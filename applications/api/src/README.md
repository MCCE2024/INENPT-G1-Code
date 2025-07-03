# API Service (Node.js)

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

The API service is the core backend of the system. It manages tenant data in PostgreSQL (with multi-tenancy), and provides RESTful endpoints for the Consumer and Producer services.

## Key Features

- **Schema-Based Multi-Tenancy**: Isolated schemas per teanant in PostgreSQL
- **RESTful API**: Endpoints for storing and retrieving datetime messages
- **Security**: Rate limiting, CORS, security headers, SSL/TLS for database
- **Health Checks**: Kubernetes-ready endpoints
- **Comprehensive Logging**: Winston-based logging with file and console output

## How It Works

- Each tenant is identified by a 'TENANT_ID' environment variable
- Tenant data is stored in isolated schemas ('tenant\_<TENANT_ID>')
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

# Health check
GET /health
```

## Environment Variables

| Variable          | Description                     | Default                 |
| ----------------- | ------------------------------- | ----------------------- |
| `PORT`            | Server port                     | `3000`                  |
| `NODE_ENV`        | Environment                     | `development`           |
| `TENANT_ID`       | Tenant identifier               | `default`               |
| `DB_HOST`         | PostgreSQL host                 | Required                |
| `DB_PORT`         | PostgreSQL port                 | `5432`                  |
| `DB_NAME`         | Database name                   | Required                |
| `DB_USER`         | Database user                   | Required                |
| `DB_PASSWORD`     | Database password               | Required                |
| `DB_SSL`          | SSL mode (`require` or `false`) | `false`                 |
| `DB_CA_CERT_PATH` | Path to CA certificate          | `/etc/ssl/certs/ca.pem` |

## Setup & Development

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export TENANT_ID=my_tenant
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
  -e TENANT_ID=mytenant \
  -e DB_HOST=postgresql \
  -e DB_NAME=mcce_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e DB_SSL=require \
  ghcr.io/mcce2024/argo-g1-api:latest
```

## Database Schema

Each tenant gets an isolated schema with the following structure:

```sql
-- Schema: tenant_<TENANT_ID>
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL,
  environment VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Debugging & Learning Journey

> [!TIP] > **Multi-Tenancy**: We implemented schema-based multi-tenancy where each tenant gets an isolated PostgreSQL schema, ensuring data separation and security.

> [!CAUTION] > **SSL Configuration**: SSL/TLS for PostgreSQL requires careful configuration. We learned to use a CA certificate (`ca.pem`) for secure connections in production.

> [!IMPORTANT] > **Tenant Isolation**: Each tenant's data is completely isolated in separate schemas, preventing any cross-tenant data access.

## How This Service Fits In

- **Backend**: Core API for the system
- **Talks to**: PostgreSQL (database)
- **Used by**: Producer (HTTP POST), Consumer (HTTP GET)
- **Multi-Tenancy**: Schema-based isolation via `TENANT_ID`
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
