# Producer Service (Python)

> ### 🔗 Part of the INENPT-G1 Multi-Repo Cloud-Native System
> This repository is one of three that together form our complete cloud-native, GitOps-driven project:
>
> - **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)** – Application code & CI/CD pipelines
> - **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)** – Kubernetes manifests & Helm charts
> - **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)** – ArgoCD infrastructure & GitOps automation
>
> [Learn more about how these repositories work together in our main documentation.](https://github.com/MCCE2024/INENPT-G1-Argo#🏗️-our-3-repository-architecture-why-we-chose-this-path)

## Overview
The Producer service generates datetime messages and sends them to the API service via HTTP POST requests. It is designed to run as a scheduled job (e.g., Kubernetes CronJob) and supports retry logic for robust delivery.

## Key Features
- **HTTP API Integration**: Sends messages to the API service
- **Retry Logic**: Retries failed HTTP requests
- **Environment Awareness**: Can be configured for different environments (prod/test)
- **Security**: Uses environment variables for configuration

## How It Works
- Generates a datetime message (with timezone)
- Sends the message to the API using HTTP POST
- Retries if the API is temporarily unavailable

## Example Code Snippet
```python
# Send message to API with retry logic
for attempt in range(max_retries):
    try:
        response = requests.post(
            f"{api_url}/api/messages",
            headers={"Content-Type": "application/json"},
            json=message,
            timeout=30
        )
        if response.status_code == 201:
            print("Message sent!")
            break
    except Exception as e:
        print(f"Attempt {attempt+1} failed: {e}")
        time.sleep(retry_delay)
```

## Setup & Development

### Prerequisites
- Python 3.9+
- API service running and accessible

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export API_URL=http://localhost:3000
export ENVIRONMENT=prod

# Run the producer
python producer.py
```

### Build & Run with Docker
```bash
# Build the Docker image
./build.sh

# Run the container
# (Set environment variables as needed)
docker run --rm \
  -e API_URL=http://host.docker.internal:3000 \
  -e ENVIRONMENT=prod \
  ghcr.io/mcce2024/argo-g1-producer:latest
```

## Debugging & Learning Journey
> [!TIP]
> **HTTP Retry Logic**: We learned that cloud environments are unpredictable. Adding retry logic made our producer robust against temporary API outages.

> [!CAUTION]
> **Architecture Change**: We originally used RabbitMQ, but switched to HTTP POST for simplicity and easier debugging. This made the system more transparent and maintainable.

## How This Service Fits In
- **Backend**: Generates and sends datetime messages
- **Talks to**: API service (HTTP)
- **Runs as**: CronJob or scheduled task
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
