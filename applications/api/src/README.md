# API Service (Node.js)

> ### 🔗 Part of the INENPT-G1 Multi-Repo Cloud-Native System
> This repository is one of three that together form our complete cloud-native, GitOps-driven project:
>
> - **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)** – Application code & CI/CD pipelines
> - **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)** – Kubernetes manifests & Helm charts
> - **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)** – ArgoCD infrastructure & GitOps automation
>
> [Learn more about how these repositories work together in our main documentation.](https://github.com/MCCE2024/INENPT-G1-Argo#🏗️-our-3-repository-architecture-why-we-chose-this-path)

## Overview
The API service is the core backend of the system. It handles GitHub OAuth2 authentication, manages tenant data in PostgreSQL (with multi-tenancy), and provides RESTful endpoints for the Consumer and Producer services.

## Key Features
- **GitHub OAuth2 Authentication**: Secure user authentication
- **Multi-Tenant Database**: Isolated schemas per tenant in PostgreSQL
- **RESTful API**: Endpoints for storing and retrieving datetime messages
- **Security**: Rate limiting, CORS, security headers, SSL/TLS for database
- **Health Checks**: Kubernetes-ready endpoints

## How It Works
- Validates users via GitHub OAuth2
- Each tenant gets a separate schema in PostgreSQL
- Stores and retrieves messages via HTTP endpoints
- Used by both the Producer (for storing) and Consumer (for fetching)

## Example Endpoints
```http
# Store a message
POST /api/messages
Content-Type: application/json
{
  "datetime": "2024-01-15T10:30:00Z",
  "environment": "prod"
}

# Retrieve messages
GET /api/messages?environment=prod&limit=100

# Get tenant info
GET /api/tenants
```

## Environment Variables
| Variable      | Description        | Default       |
| ------------- | ------------------ | ------------- |
| `PORT`        | Server port        | `3000`        |
| `NODE_ENV`    | Environment        | `development` |
| `DB_HOST`     | PostgreSQL host    | Required      |
| `DB_PORT`     | PostgreSQL port    | `5432`        |
| `DB_NAME`     | Database name      | Required      |
| `DB_USER`     | Database user      | Required      |
| `DB_PASSWORD` | Database password  | Required      |
| `DB_SSL`      | Use SSL connection | `true`        |

## Setup & Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- GitHub OAuth App credentials

### Local Development
```bash
# Install dependencies
npm install

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=mcce_db
export DB_USER=postgres
export DB_PASSWORD=password
export DB_SSL=false

# Start development server
npm run dev
```

### Build & Run with Docker
```bash
# Build the Docker image
./build.sh

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST=postgresql \
  -e DB_NAME=mcce_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  ghcr.io/mcce2024/argo-g1-api:latest
```

## Debugging & Learning Journey
> [!TIP]
> **Multi-Tenancy**: We learned to create isolated schemas for each tenant, ensuring data separation and security.

> [!CAUTION]
> **OAuth2 Debugging**: Implementing OAuth2 required careful state management and error handling. Our first attempts failed until we handled the callback and session storage correctly.

> [!IMPORTANT]
> **Database Security**: SSL/TLS for PostgreSQL was a challenge. We learned to use a CA certificate (`ca.pem`) for secure connections in production.

## How This Service Fits In
- **Backend**: Core API for the system
- **Talks to**: PostgreSQL (database)
- **Used by**: Producer (HTTP POST), Consumer (HTTP GET)
- **Authentication**: GitHub OAuth2
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
