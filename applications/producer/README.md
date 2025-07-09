# Producer Service (Python)

09.07.2025

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

The Producer service generates datetime messages and sends them to the API service via HTTP POST requests. It is designed to run as a scheduled job (e.g., Kubernetes CronJob) and supports robust retry logic with detailed logging for reliable delivery.

## Key Features

- **HTTP API Integration**: Sends messages to the API service
- **Retry Logic**: 3 attempts with 30-second delays between retries
- **Environment Awareness**: Configurable for different environments (prod/test)
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Graceful Error Handling**: Continues execution even if API is unreachable
- **Security**: Uses environment variables for configuration

## How It Works

- Generates a datetime message in UTC timezone
- Sends the message to the API using HTTP POST with retry logic
- Logs all attempts and responses for debugging
- Continues execution gracefully even if API is unavailable

## Message Format

The service sends messages in the following format:

```json
{
  "datetime": "2024-01-15 10:30:00",
  "environment": "prod"
}
```

## Example Code Snippet

```python
def send_to_api(message, max_retries=3, retry_delay=30):
    """Send message to API with retry logic"""
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'MCCE-Producer-Service'
    }

    endpoint = f"{api_url}/api/messages"

    for attempt in range(max_retries):
        try:
            logger.info(f"Sending message to API (attempt {attempt + 1}/{max_retries})")

            response = requests.post(
                endpoint,
                headers=headers,
                json=message,
                timeout=30
            )

            if response.status_code == 201:
                logger.info(f"Successfully sent message to API: {response.json()}")
                return True
            else:
                logger.error(f"API returned error {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed (attempt {attempt + 1}/{max_retries}): {str(e)}")

        if attempt < max_retries - 1:
            logger.info(f"Waiting {retry_delay} seconds before retry...")
            time.sleep(retry_delay)

    logger.error(f"Failed to send message to API after {max_retries} attempts")
    return False
```

## Environment Variables

| Variable       | Description                   | Default                   |
| -------------- | ----------------------------- | ------------------------- |
| `API_URL`      | API service URL               | `http://api-service:3000` |
| `GITHUB_TOKEN` | GitHub token (for future use) | Optional                  |
| `ENVIRONMENT`  | Environment (prod/test)       | `prod`                    |

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
export GITHUB_TOKEN=your_github_token  # Optional

# Run the producer
python producer.py
```

### Build & Run with Docker

```bash
# Build the Docker image
./build.sh

# Run the container
docker run --rm \
  -e API_URL=http://host.docker.internal:3000 \
  -e ENVIRONMENT=prod \
  -e GITHUB_TOKEN=your_github_token \
  ghcr.io/mcce2024/argo-g1-producer:latest
```

## Kubernetes CronJob Configuration

The producer service is designed to run as a Kubernetes CronJob. Here's an example configuration:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: producer-cronjob
spec:
  schedule: "*/5 * * * *" # Every 5 minutes
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: producer
              image: ghcr.io/mcce2024/argo-g1-producer:latest
              env:
                - name: API_URL
                  value: "http://api-service:3000"
                - name: ENVIRONMENT
                  value: "prod"
                - name: GITHUB_TOKEN
                  valueFrom:
                    secretKeyRef:
                      name: github-token
                      key: token
          restartPolicy: OnFailure
```

### Scheduling Options

- **Every 5 minutes**: `"*/5 * * * *"`
- **Hourly**: `"0 * * * *"`
- **Daily at 2 AM**: `"0 2 * * *"`
- **Weekly on Sunday**: `"0 2 * * 0"`

## Retry Logic Details

The service implements robust retry logic:

- **Max Attempts**: 3 attempts per message
- **Retry Delay**: 30 seconds between attempts
- **Timeout**: 30 seconds per HTTP request
- **Success Criteria**: HTTP 201 status code
- **Error Handling**: Logs all failures but continues execution

## Logging

The service provides comprehensive logging:

- **Info Level**: Configuration, message creation, successful sends
- **Error Level**: API errors, network failures, retry attempts
- **Format**: Timestamp, log level, and detailed message
- **Output**: Console logging (configurable for file output)

## Error Handling Strategy

- **API Unavailable**: Retries 3 times with delays
- **Network Errors**: Handles timeouts and connection failures
- **API Errors**: Logs HTTP error responses
- **Graceful Degradation**: Continues execution even if API is unreachable
- **No Exit Codes**: Service doesn't fail if API is unavailable

## Monitoring and Observability

### Key Metrics to Monitor

- **Message Send Rate**: Number of messages sent per minute
- **API Response Times**: Latency of API calls
- **Error Rates**: Failed API calls and retry attempts
- **Service Health**: Producer service uptime and execution frequency

### Log Analysis

```bash
# View recent logs
kubectl logs -l app=producer-cronjob --tail=100

# Search for errors
kubectl logs -l app=producer-cronjob | grep ERROR

# Monitor retry attempts
kubectl logs -l app=producer-cronjob | grep "attempt"
```

## Performance Considerations

- **Batch Processing**: Consider batching messages for high-volume scenarios
- **Rate Limiting**: Respect API rate limits to avoid overwhelming the service
- **Resource Limits**: Set appropriate CPU and memory limits in Kubernetes
- **Timeout Configuration**: Adjust timeout values based on network conditions

## Debugging & Learning Journey

> [!TIP] > **HTTP Retry Logic**: We implemented robust retry logic with detailed logging. This makes the producer resilient against temporary API outages and provides excellent debugging capabilities.

> [!CAUTION] > **Architecture Change**: We originally used RabbitMQ, but switched to HTTP POST for simplicity and easier debugging. This made the system more transparent and maintainable.

> [!IMPORTANT] > **Graceful Error Handling**: We learned that scheduled jobs should not fail completely if external services are unavailable. The producer continues execution and logs warnings instead of exiting with error codes.

## Troubleshooting

### Common Issues

#### API Service Not Reachable

```bash
# Test API connectivity
curl -f $API_URL/health

# Check DNS resolution
nslookup api-service

# Verify network policies
kubectl get networkpolicies
```

#### High Error Rates

```bash
# Check API service logs
kubectl logs -l app=api-service --tail=100

# Monitor API service health
kubectl get pods -l app=api-service

# Check resource usage
kubectl top pods -l app=api-service
```

#### CronJob Not Running

```bash
# Check CronJob status
kubectl get cronjobs

# View CronJob events
kubectl describe cronjob producer-cronjob

# Check recent job executions
kubectl get jobs -l app=producer-cronjob
```

## How This Service Fits In

- **Backend**: Generates and sends datetime messages
- **Talks to**: API service (HTTP POST)
- **Runs as**: CronJob or scheduled task
- **Reliability**: Retry logic and graceful error handling
- **Part of**: [INENPT-G1-Code](../../../README.md) (see main README for full architecture)

---

**For the complete system and learning journey, see the [main repo README](../../../README.md).**
