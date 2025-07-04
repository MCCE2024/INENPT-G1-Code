# Consumer Service (Node.js Web Dashboard)

03.07.2025

> ### 🔗 Part of the INENPT-G1 Multi-Repo Cloud-Native System
>
> This repository is one of three that together form our complete cloud-native, GitOps-driven project:
>
> - **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)** – Application code & CI/CD pipelines
> - **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)** – Kubernetes manifests & Helm charts
> - **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)** – ArgoCD infrastructure & GitOps automation
>
> [Learn more about how these repositories work together in our main documentation.](https://github.com/MCCE2024/INENPT-G1-Argo#🏗️-our-3-repository-architecture-why-we-chose-this-path)

## Overview

The Consumer service provides a web dashboard for users to view and manage datetime messages. It authenticates users via GitHub OAuth2 and fetches messages from the API service using HTTP requests. The service acts as a proxy between the frontend and the API service.

## Key Features

- **OAuth2 Authentication**: Secure login with GitHub
- **HTTP API Integration**: Fetches messages from the API service
- **Session Management**: Express-session based authentication
- **Interactive Dashboard**: View, refresh, and manage messages
- **Security**: Session management, CORS, authentication middleware
- **Health Checks**: Kubernetes-ready endpoints

## How It Works

- Users log in via GitHub OAuth2
- The service acts as a proxy, forwarding requests to the API service
- Session-based authentication protects dashboard access
- All API calls are made server-side for security

## Example Code Snippet

```javascript
// Server-side API proxy (from server.js)
app.get("/api/messages", requireAuth, async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const environment = req.query.environment || "prod";
    const apiUrl = `${API_BASE_URL}/api/messages?environment=${environment}&limit=${limit}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
```

## Environment Variables

| Variable               | Description                | Default                               |
| ---------------------- | -------------------------- | ------------------------------------- |
| `CONSUMER_PORT`        | Server port                | `3000`                                |
| `TENANT_NAME`          | Tenant identifier          | `default-tenant`                      |
| `API_BASE_URL`         | API service URL            | `http://api-service:80`               |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID     | Required                              |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Required                              |
| `SESSION_SECRET`       | Session encryption secret  | `default-secret-change-in-production` |

## Setup & Development

### Prerequisites

- Node.js 18+
- GitHub OAuth App credentials
- API service running and accessible

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export CONSUMER_PORT=3001
export TENANT_NAME=mytenant
export API_BASE_URL=http://localhost:3000
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret
export SESSION_SECRET=your_session_secret

# Start the development server
npm run dev
```

### Build & Run with Docker

```bash
# Build the Docker image
./build.sh

# Run the container
docker run -p 3001:3000 \
  -e CONSUMER_PORT=3000 \
  -e TENANT_NAME=mytenant \
  -e API_BASE_URL=http://host.docker.internal:3000 \
  -e GITHUB_CLIENT_ID=your_client_id \
  -e GITHUB_CLIENT_SECRET=your_client_secret \
  -e SESSION_SECRET=your_session_secret \
  ghcr.io/mcce2024/argo-g1-consumer:latest
```

## Available Endpoints

```http
# Authentication
GET /auth/github                    # Initiate GitHub OAuth
GET /auth/github/callback           # OAuth callback handler
GET /logout                         # Logout user

# Dashboard
GET /                               # Login page
GET /dashboard                      # Protected dashboard (requires auth)

# API Proxies
GET /api/user                       # Get current user info
GET /api/messages                   # Proxy to API service messages
GET /api/tenants                    # Proxy to API service tenant stats

# Health
GET /health                         # Health check endpoint
```

## Session Configuration

The service uses express-session with production-ready settings:

- Secure cookies (configurable)
- HTTP-only cookies (XSS protection)
- SameSite lax (CSRF protection)
- 24-hour session timeout
- Rolling sessions (reset on activity)

## Debugging & Learning Journey

> [!TIP] > **OAuth2 Implementation**: We successfully implemented GitHub OAuth2 with proper session management and error handling. The OAuth flow is complete and production-ready.

> [!CAUTION] > **API Integration**: The service acts as a secure proxy between frontend and API. All API calls are made server-side to protect credentials and provide better security.

> [!IMPORTANT] > **Session Security**: We learned to configure express-session with proper security settings for production use, including secure cookies and CSRF protection.

## How This Service Fits In

- **Frontend**: Provides the user interface for the system
- **Proxy**: Acts as secure proxy between frontend and API service
- **Authentication**: GitHub OAuth2 with session management
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
