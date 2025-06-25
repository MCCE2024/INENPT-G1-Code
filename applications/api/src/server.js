const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "api.log" }),
  ],
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Read CA certificate
let caCert = null;
try {
  caCert = fs.readFileSync(path.join(__dirname, "ca.pem")).toString();
  logger.info("CA certificate loaded successfully");
} catch (error) {
  logger.warn("Could not load CA certificate:", error.message);
}

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:
    process.env.DB_SSL === "require"
      ? {
          rejectUnauthorized: false,
          ca: caCert,
        }
      : false,
});

// Simple test middleware - no authentication for testing
function testMiddleware(req, res, next) {
  // Use a test tenant ID for all requests
  req.tenantId = "test_tenant";
  req.githubUser = {
    login: "test_tenant",
    id: 12345,
    name: "Test User",
  };
  next();
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// POST /api/messages - Store datetime message
app.post("/api/messages", testMiddleware, async (req, res) => {
  try {
    const { datetime, environment = "prod" } = req.body;
    const tenantId = req.tenantId;

    if (!datetime) {
      return res.status(400).json({ error: "datetime is required" });
    }

    // Create tenant schema if it doesn't exist
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS tenant_${tenantId.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}
    `);

    // Create messages table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenant_${tenantId.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.messages (
        id SERIAL PRIMARY KEY,
        datetime TIMESTAMP NOT NULL,
        environment VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert the message
    const result = await pool.query(
      `
      INSERT INTO tenant_${tenantId.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}.messages (datetime, environment)
      VALUES ($1, $2)
      RETURNING id, datetime, environment, created_at
    `,
      [datetime, environment]
    );

    logger.info(`Message stored for tenant ${tenantId}`, {
      tenantId,
      environment,
      messageId: result.rows[0].id,
    });

    res.status(201).json({
      message: "Message stored successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error("Error storing message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/messages - Retrieve datetime messages
app.get("/api/messages", testMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { environment = "prod", limit = 100 } = req.query;

    // Check if tenant schema exists
    const schemaExists = await pool.query(
      `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = $1
      )
    `,
      [`tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}`]
    );

    if (!schemaExists.rows[0].exists) {
      return res.json({ messages: [] });
    }

    // Get messages for the tenant
    const result = await pool.query(
      `
      SELECT id, datetime, environment, created_at
      FROM tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}.messages
      WHERE environment = $1
      ORDER BY created_at DESC
      LIMIT $2
    `,
      [environment, parseInt(limit)]
    );

    logger.info(`Messages retrieved for tenant ${tenantId}`, {
      tenantId,
      environment,
      count: result.rows.length,
    });

    res.json({
      messages: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    logger.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/tenants - Get tenant information
app.get("/api/tenants", testMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;

    // Get tenant statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE environment = 'prod') as prod_messages,
        COUNT(*) FILTER (WHERE environment = 'test') as test_messages,
        MAX(created_at) as last_message
      FROM tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}.messages
    `);

    res.json({
      tenantId,
      githubUser: req.githubUser,
      statistics: stats.rows[0] || {
        total_messages: 0,
        prod_messages: 0,
        test_messages: 0,
        last_message: null,
      },
    });
  } catch (error) {
    logger.error("Error getting tenant info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`Using test tenant ID: test_tenant`);
});

module.exports = app;
