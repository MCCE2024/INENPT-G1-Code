# Consumer Service (Node.js Web Dashboard)

> ### 🔗 Part of the INENPT-G1 Multi-Repo Cloud-Native System
> This repository is one of three that together form our complete cloud-native, GitOps-driven project:
>
> - **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)** – Application code & CI/CD pipelines
> - **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)** – Kubernetes manifests & Helm charts
> - **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)** – ArgoCD infrastructure & GitOps automation
>
> [Learn more about how these repositories work together in our main documentation.](https://github.com/MCCE2024/INENPT-G1-Argo#🏗️-our-3-repository-architecture-why-we-chose-this-path)

## Overview
The Consumer service provides a web dashboard for users to view and manage datetime messages. It authenticates users via GitHub OAuth2 and fetches messages from the API service using HTTP requests.

## Key Features
- **OAuth2 Authentication**: Secure login with GitHub
- **HTTP API Integration**: Fetches messages from the API service
- **Multi-Tenant Support**: Each user sees only their own messages
- **Interactive Dashboard**: View, refresh, and manage messages
- **Security**: Session management, CORS, rate limiting

## How It Works
- Users log in via GitHub OAuth2
- The dashboard fetches messages from the API using HTTP GET requests
- All actions are performed via secure, authenticated HTTP calls

## Example Code Snippet
```javascript
// Fetch messages from the API
fetch(`${API_BASE_URL}/api/messages?limit=50`, {
  credentials: 'include',
  headers: { 'Authorization': `Bearer ${userToken}` }
})
  .then(res => res.json())
  .then(data => displayMessages(data));
```

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
# (Set environment variables as needed)
docker run -p 3001:3000 \
  -e API_BASE_URL=http://host.docker.internal:3000 \
  -e GITHUB_CLIENT_ID=your_client_id \
  -e GITHUB_CLIENT_SECRET=your_client_secret \
  -e SESSION_SECRET=your_session_secret \
  ghcr.io/mcce2024/argo-g1-consumer:latest
```

## Debugging & Learning Journey
> [!TIP]
> **OAuth2 Debugging**: We learned that OAuth2 requires careful state management and error handling. Our first attempts failed until we handled the OAuth callback and session storage correctly.

> [!CAUTION]
> **API Integration**: Early versions tried to use message queues, but we switched to HTTP for simplicity and easier debugging. Fetching messages via HTTP made troubleshooting much easier.

## How This Service Fits In
- **Frontend**: Provides the user interface for the system
- **Talks to**: API service (HTTP)
- **Authentication**: GitHub OAuth2
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
