const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Environment variables
const CONSUMER_PORT = process.env.CONSUMER_PORT || 3000;
const TENANT_NAME = process.env.TENANT_NAME || "default-tenant";
const API_BASE_URL = process.env.API_BASE_URL || "http://api-service:80";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "default-secret";

console.log("Consumer Configuration:");
console.log("- Port:", CONSUMER_PORT);
console.log("- Tenant:", TENANT_NAME);
console.log("- API URL:", API_BASE_URL);
console.log(
  "- GitHub OAuth:",
  GITHUB_CLIENT_ID ? "Configured" : "Not configured"
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    tenant: TENANT_NAME,
    timestamp: new Date().toISOString(),
  });
});

// Root route - serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// GitHub OAuth routes (placeholder - needs implementation)
app.get("/auth/github", (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.redirect("/?error=oauth_not_configured");
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

app.get("/auth/github/callback", (req, res) => {
  // TODO: Implement OAuth callback handling
  // For now, just redirect to dashboard
  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

// API proxy endpoints
app.get("/api/messages", async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const environment = req.query.environment || "prod";
    const apiUrl = `${API_BASE_URL}/api/messages?environment=${environment}&limit=${limit}`;

    console.log("Fetching messages from:", apiUrl);

    // Use node's built-in fetch (Node 18+) or implement with http module
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      error: "Failed to fetch messages",
      details: error.message,
    });
  }
});

app.get("/api/tenants", async (req, res) => {
  try {
    const apiUrl = `${API_BASE_URL}/api/tenants`;

    console.log("Fetching tenant stats from:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      tenantId: data.tenantId || TENANT_NAME,
      statistics: {
        total_messages: parseInt(data.statistics.total_messages) || 0,
        prod_messages: parseInt(data.statistics.prod_messages) || 0,
        test_messages: parseInt(data.statistics.test_messages) || 0,
        last_message: data.statistics.last_message || null,
      },
    });
  } catch (error) {
    console.error("Error fetching tenant stats:", error);
    res.json({
      tenantId: TENANT_NAME,
      statistics: {
        total_messages: 0,
        prod_messages: 0,
        test_messages: 0,
        last_message: null,
      },
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
});

// Start server
app.listen(CONSUMER_PORT, () => {
  console.log(`Consumer dashboard running on port ${CONSUMER_PORT}`);
  console.log(`Access the dashboard at http://localhost:${CONSUMER_PORT}`);
});
