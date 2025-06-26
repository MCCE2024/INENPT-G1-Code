const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

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

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.githubUser) {
    return next();
  } else {
    return res.redirect("/?error=authentication_required");
  }
}

// Dashboard route (protected)
app.get("/dashboard", requireAuth, (req, res) => {
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

app.get("/auth/github/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error("GitHub OAuth error:", error);
    return res.redirect("/?error=oauth_failed");
  }

  if (!code) {
    return res.redirect("/?error=oauth_no_code");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData.error);
      return res.redirect("/?error=oauth_token_failed");
    }

    // Get user information
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    // Store user in session
    req.session.githubUser = {
      id: userData.id,
      login: userData.login,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
    };

    console.log(`User authenticated: ${userData.login} (${userData.name})`);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("/?error=oauth_callback_failed");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
    }
    res.redirect("/");
  });
});

// User info endpoint
app.get("/api/user", requireAuth, (req, res) => {
  res.json({
    user: req.session.githubUser,
    tenant: TENANT_NAME,
  });
});

// API proxy endpoints
app.get("/api/messages", requireAuth, async (req, res) => {
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

app.get("/api/tenants", requireAuth, async (req, res) => {
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
