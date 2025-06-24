# Producer Application

This directory contains the producer application that sends datetime messages to RabbitMQ.

## Folder Structure

```
producer/
├── src/                    # Application source code
│   ├── producer.py         # Main Python application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Container definition
│   ├── build.sh           # Build script for Linux/Mac
│   ├── build.ps1          # Build script for Windows
│   └── readme.md          # Application documentation
├── helm/                   # Helm chart for Kubernetes deployment
│   ├── Chart.yaml         # Chart metadata
│   ├── values.yaml        # Default configuration values
│   ├── templates/         # Kubernetes manifests
│   │   ├── cronjob.yaml   # CronJob template
│   │   └── _helpers.tpl   # Helm template helpers
│   └── .helmignore        # Files to exclude from Helm package
└── argocd-application.yaml # ArgoCD application definition
```

## Development

- **Source Code**: Located in `src/` directory
- **Build**: Use `src/build.sh` (Linux/Mac) or `src/build.ps1` (Windows)
- **Container**: Built from `src/Dockerfile`

## Deployment

- **Helm Chart**: Located in `helm/` directory
- **ArgoCD**: Uses the Helm chart for GitOps deployment
- **Configuration**: Customizable via `values.yaml` or ArgoCD inline values

## Usage

1. Build the container: `cd src && ./build.sh`
2. Deploy with ArgoCD: `kubectl apply -f argocd-application.yaml`
3. The producer will run as a CronJob every minute, sending datetime messages to RabbitMQ

# Producer - Setup

Used libaries and coding language

- [pika 1.3.2](https://pypi.org/project/pika/) for implementation of the AMQP 0-9-1 protocol including RabbitMQ's extensions.

Used docker image from dockerhub

- [Python 3.9](https://github.com/docker-library/python/blob/master/3.9/slim-bullseye/Dockerfile)

## Function:

- Within producer.py will the queue **datetime_queue** is declared and a connection is opened to the RabbitMQ instance
- Afterwards a message will be created with the current datetime including timezone
- Then the data is published to the queue as JSON
- All messages of the application are sent to STDOUT and can be access with kubectl logs

### **Steps to Build and Run the Configuration**

_Build and Push the Docker Image_:

- navigate to the producer directory
- run the deployment script

  - Linux/MacOS:

  ```
  ./build.sh
  ```

  - Windows (PowerShell):

  ```
  ./build.ps1
  ```

  - This script:
    - uses the current timestamp as the image version
    - builds and tags the Docker image
    - pushes both the versioned and `latest` image tags to the registry (`ghcr.io/mcce2024`)
    - Additionally checks for a correct GITHUB_TOKEN if not a push is prohibited

_Run the Docker Container_:

- Start the service using Docker:
  docker run -p 3000:3000 ghcr.io/mcce2024/akkt1-g1-producer:latest
- application is not accessible through localhost and port because
  > Action is no longer needed because there is a github action for this `build (producer)`

---

### **Service Communication Overview**

- _RabbitMQ Integration_:

  - RabbitMQ connection details are dynamically configured using environment variables:
    ```
    RABBITMQ_HOST
    RABBITMQ_PORT
    RABBITMQ_USER
    RABBITMQ_PASS
    ```
  - The service pushes messages to the `datetime_queue` queue with pika

- _def try_connect_:
  - Establishes the connection with pika to RabbitMQ
    - parameters `max_retries=30, retry_delay=2`
    - establishes connection if not
    - retries after `retry_delay=2`
- _try_:
  - Declares in RabbitMQ a queue_name `datetime_queue` this is needed for the consumer service
    - Creates a JSON with datetime and zone information `datetime.now(ZoneInfo("UTC")).strftime("%Y-%m-%d %H:%M:%S %Z")`
    - Publishes the JSON to the channel
- _Key Scripts_:
  - **`producer.py`**:
    - establishes a connection to RabbitMQ
    - tries to establish a connection 30 retries
    - generates a JSON with time and zone information
    - pushes this JSON into the RabbitMQ channel

---

## Kubernetes

- in the k8s folder resides the base folder and producer folder there exist the deployment.yaml file
- the producer container is run as a cronjob every minute and publishes the created JSON within the **datetime_queue** to rabbitmq
- afterwards the consumer will consume the message from the queue
