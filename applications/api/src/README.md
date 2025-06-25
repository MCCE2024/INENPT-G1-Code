# MCCE API Service

The API service is the core backend component of the MCCE multi-tenant application. It handles GitHub OAuth authentication, manages tenant data in PostgreSQL, and provides RESTful endpoints for the consumer (frontend) and producer services.

## Architecture

This service implements the API layer as described in the concept diagram:

- **GitHub OAuth Integration**: Validates GitHub tokens for tenant authentication
- **Multi-tenant Database**: Creates isolated schemas per tenant in PostgreSQL
- **RESTful API**: Provides endpoints for storing and retrieving datetime messages
- **Security**: Implements rate limiting, CORS, and security headers

## Features

- 🔐 **GitHub OAuth Authentication**: Uses GitHub tokens for tenant identification
- 🏢 **Multi-tenant Support**: Isolated database schemas per tenant
- 📊 **Environment Support**: Separate data for prod/test environments
- 🔒 **Security**: Rate limiting, CORS, and security headers
- 📝 **Logging**: Structured logging with Winston
- 🏥 **Health Checks**: Kubernetes-ready health endpoints

## API Endpoints

### Authentication

All endpoints require a valid GitHub token in the Authorization header:

```
Authorization: Bearer <github_token>
```

### Health Check

```
GET /health
```

Returns service health status.

### Store Message

```
POST /api/messages
Content-Type: application/json

{
  "datetime": "2024-01-15T10:30:00Z",
  "environment": "prod"
}
```

Stores a datetime message for the authenticated tenant.

### Retrieve Messages

```
GET /api/messages?environment=prod&limit=100
```

Retrieves messages for the authenticated tenant.

### Tenant Information

```
GET /api/tenants
```

Returns tenant statistics and GitHub user information.

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

## Database Schema

The service automatically creates tenant-specific schemas:

```sql
-- Schema: tenant_<github_username>
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL,
  environment VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub personal access token

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

### Testing

```bash
npm test
```

## Docker

### Build

```bash
docker build -t mcce-api-service .
```

### Run

```bash
docker run -p 3000:3000 \
  -e DB_HOST=postgresql \
  -e DB_NAME=mcce_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  mcce-api-service
```

## Kubernetes Deployment

The service is deployed using the provided `deployment.yaml` which includes:

- **Deployment**: 2 replicas with health checks
- **Service**: ClusterIP service for internal communication
- **ServiceAccount**: For RBAC
- **NetworkPolicy**: Zero-trust network security

### Secrets Required

Create a `postgresql-secret` with:

- `host`: PostgreSQL host
- `port`: PostgreSQL port
- `database`: Database name
- `username`: Database user
- `password`: Database password

## Integration

### With Consumer Service (Frontend)

The consumer service calls the API to:

- Retrieve messages for display
- Get tenant information

### With Producer Service

The producer service calls the API to:

- Store datetime messages from cron jobs

### With GitHub OAuth

- Validates GitHub tokens
- Uses GitHub username as tenant ID
- Supports GitHub App and Personal Access Tokens

## Security

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Network Policies**: Kubernetes network isolation
- **Non-root Container**: Runs as non-root user

## Monitoring

- **Health Checks**: `/health` endpoint for Kubernetes probes
- **Logging**: Structured JSON logging with Winston
- **Metrics**: Ready for Prometheus integration

## Troubleshooting

### Common Issues

1. **Database Connection**: Check PostgreSQL credentials and network connectivity
2. **GitHub Token**: Ensure valid GitHub personal access token
3. **Network Policies**: Verify Kubernetes network policy allows required traffic
4. **SSL**: Check PostgreSQL SSL configuration

### Logs

```bash
# View application logs
kubectl logs -f deployment/api-service

# View health check logs
kubectl describe pod -l app=api-service
```
