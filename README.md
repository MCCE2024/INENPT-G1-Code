# INENPT-G1-Code: Our Cloud Computing Learning Journey

> [!NOTE]
> **Welcome to our learning journey!** This repository documents what we (Harald, Patrick, and Susanne) learned while building a complete cloud-native microservices application. We're sharing our discoveries, challenges, and insights to help other students understand modern cloud computing concepts.

## 🎯 What We Learned

As cloud computing students, we built a **complete microservices application** that taught us:

- **Containerization** with Docker - packaging our applications consistently
- **Continuous Integration/Continuous Deployment (CI/CD)** with GitHub Actions - automating our development workflow
- **Message Queue Systems** - handling asynchronous communication between services
- **Microservices Architecture** - breaking down applications into focused, independent services
- **Container Orchestration** with Kubernetes - managing our containers in production
- **GitOps** deployment with ArgoCD - treating infrastructure as code

## 🏗️ Our Project: A Message Processing System

We built a system that:
- **Producer** (Python): Generates datetime messages and sends them via HTTP to the API
- **API** (Node.js): Receives messages via HTTP and stores them in PostgreSQL
- **Consumer** (Node.js): Fetches messages from the API via HTTP and displays them in a web dashboard
- **PostgreSQL**: Stores all the datetime messages persistently

### Our Multi-Repository Architecture

> [!IMPORTANT]
> **GitOps Best Practice**: We learned to separate application code from infrastructure code using multiple repositories.

Our project spans three repositories:

| Repository | Purpose | What We Learned |
|------------|---------|-----------------|
| **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)** | Application code & CI/CD | How to build and package our microservices |
| **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)** | Kubernetes manifests | How to define our application deployment |
| **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)** | ArgoCD infrastructure | How to manage GitOps deployment |

> [!TIP]
> **Why Multiple Repositories?** This separation allows us to manage application changes independently from infrastructure changes, following GitOps best practices.

### Our Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Producer  │───▶│     API     │───▶│  Consumer   │
│  (Python)   │    │  (Node.js)  │    │   (Node.js) │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │ PostgreSQL  │
                   │  (Database) │
                   └─────────────┘
```

> [!TIP]
> **Our "Aha!" Moment**: We realized this pattern is used everywhere - from social media feeds to e-commerce order processing. Understanding this helped us see the bigger picture of cloud computing.

## 🐳 What We Learned About Containerization

> [!IMPORTANT]
> **Key Learning**: Containers solved our biggest problem - "It works on my machine!" Now our applications run the same way everywhere.

### Our Container Journey

We started with simple scripts, but quickly learned that containers are like **shipping containers for software**:
- Each container has everything our application needs
- They're lightweight and portable
- They run consistently across different environments
- They're isolated from each other

### Our Three Containerized Services

| Service | Technology | What We Learned | Container Image |
|---------|------------|-----------------|-----------------|
| **Producer** | Python | How to package Python apps with dependencies | `ghcr.io/mcce2024/argo-g1-producer` |
| **Consumer** | Node.js | Building web interfaces in containers | `ghcr.io/mcce2024/argo-g1-consumer` |
| **API** | Node.js | Multi-tenant applications with authentication | `ghcr.io/mcce2024/argo-g1-api` |

> [!NOTE]
> **Our Discovery**: Each service uses the technology best suited for its job. Python for data generation, Node.js for web services. This is a key principle of microservices!

## 🔄 Our CI/CD Learning Experience

> [!IMPORTANT]
> **Biggest Revelation**: CI/CD transformed our development process. No more manual deployments or "forgot to test" moments!

### What CI/CD Means to Us

- **CI (Continuous Integration)**: Every time we push code, it automatically builds and tests
- **CD (Continuous Deployment)**: If tests pass, it automatically deploys to our environment

### Our GitHub Actions Workflow

```yaml
# This runs every time we push code
on:
  push:
    branches: [main, dev]
    paths:
      - "applications/api/**"
      - "applications/consumer/**"
      - "applications/producer/**"
```

> [!TIP]
> **Smart Discovery**: We learned to only trigger builds when we change application code, not documentation. This saves time and resources!

### Our CI/CD Process

1. **We push code** to GitHub
2. **GitHub Actions builds** Docker images for our three application services
3. **Images are pushed** to GitHub Container Registry
4. **ArgoCD automatically deploys** to our Kubernetes cluster

> [!NOTE]
> **Important Distinction**: Our CI/CD pipeline builds our three application containers (Producer, Consumer, API). RabbitMQ and PostgreSQL are external services that our applications connect to, but they're not built by our CI/CD pipeline.

> [!WARNING]
> **Security Lesson**: We learned to use GitHub secrets (`GHCR_USR`, `GHCR_PAT`) for authentication. Never hardcode credentials!

### Our Complete Development Workflow

> [!IMPORTANT]
> **End-to-End Process**: Here's how our three repositories work together in a complete GitOps workflow.

#### 1. **Development Phase** (INENPT-G1-Code)
```bash
# We develop our application code
git add .
git commit -m "Add new feature"
git push origin main
```

#### 2. **CI/CD Phase** (INENPT-G1-Code)
- GitHub Actions automatically builds our containers
- Images are pushed to GitHub Container Registry
- Build status is reported back to us

#### 3. **Deployment Configuration** (INENPT-G1-K8s)
```bash
# We update Kubernetes manifests with new image versions
git clone https://github.com/MCCE2024/INENPT-G1-K8s.git
# Update deployment.yaml with new image tags
git commit -m "Update to v1.2.3"
git push origin main
```

#### 4. **GitOps Deployment** (INENPT-G1-Argo)
- ArgoCD monitors INENPT-G1-K8s for changes
- Automatically deploys new versions to Kubernetes
- Provides deployment status and rollback capabilities

> [!TIP]
> **Our Discovery**: This workflow ensures that every deployment is traceable, auditable, and can be rolled back if needed. We learned that GitOps is not just about automation, but about reliability and transparency.

### Our Build Strategy

```yaml
strategy:
  fail-fast: false
  matrix:
    service: [api, consumer, producer]
```

> [!NOTE]
> **Performance Insight**: Each service builds independently. If one fails, the others continue. This is much faster than building sequentially!

### Local Development vs. CI/CD

> [!IMPORTANT]
> **Two Build Approaches**: We learned to use both local build scripts for development and GitHub Actions for automated CI/CD.

#### Local Build Scripts (Development)

Each application has its own `build.sh` script for local development:

```bash
# Example: applications/api/src/build.sh
#!/usr/bin/bash

# Use timestamp as version
VERSION=$(date +%Y%m%d-%H%M%S)
IMAGE_NAME="argo-g1-api"
REGISTRY="ghcr.io/mcce2024"

# Authenticate with GitHub Container Registry
cat "$TOKEN_PATH" | docker login ghcr.io -u mcce2024 --password-stdin

# Build and push
docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} .
docker tag ${REGISTRY}/${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:latest
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
docker push ${REGISTRY}/${IMAGE_NAME}:latest
```

> [!TIP]
> **Why Local Scripts?** We use these for rapid development and testing. They allow us to build and push individual services without triggering the full CI/CD pipeline.

#### GitHub Actions (Production)

The CI/CD pipeline automates the same process:

```yaml
# .github/workflows/docker-build.yml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: ${{ matrix.context }}
    file: ${{ matrix.dockerfile }}
    push: true
    tags: ${{ steps.meta.outputs.tags }}
```

> [!NOTE]
> **Our Learning**: Local scripts are great for development, but CI/CD ensures consistent, automated builds for production. We learned to use both approaches appropriately.

### What Gets Built vs. What We Connect To

| Component | Built by CI/CD? | Purpose |
|-----------|----------------|---------|
| **Producer** | ✅ Yes | Our Python datetime generator |
| **Consumer** | ✅ Yes | Our Node.js web dashboard |
| **API** | ✅ Yes | Our Node.js authentication service |
| **RabbitMQ** | ❌ No | External message queue service |
| **PostgreSQL** | ❌ No | External database service |

## 🏗️ Microservices: Why We Chose This Approach

### Our Microservices Journey

Instead of one big application, we built **small, focused services**:

- **Producer**: Only generates datetime messages and sends them via HTTP
- **Consumer**: Only fetches messages via HTTP and displays them via web UI
- **API**: Only handles HTTP requests and stores data in PostgreSQL
- **PostgreSQL**: Only stores and retrieves data

> [!IMPORTANT]
> **Key Learning**: Each service can be developed, deployed, and scaled independently. If one fails, the others keep working!

### How Our Services Communicate

```
Producer ──[HTTP POST]──▶ API ──[HTTP GET]──▶ Consumer
                │
                ▼
            PostgreSQL
```

> [!NOTE]
> **Our Design Choice**: We chose HTTP-based communication over message queues for simplicity. This makes our system easier to understand and debug, while still maintaining the benefits of microservices architecture.

## 🚀 How to Run Our Project

### What You'll Need

- **Docker Desktop** installed and running
- **Git** for version control
- **Basic command line knowledge**
- **GitHub account** (for container registry access)

> [!CAUTION]
> **Windows Tip**: Make sure Docker Desktop is running before executing any Docker commands. You'll see a whale icon in your system tray when it's active.

### Our Setup Instructions

1. **Clone our repository**:
   ```bash
   git clone https://github.com/your-username/INENPT-G1-Code.git
   cd INENPT-G1-Code
   ```

2. **Explore our structure**:
   ```bash
   # See all our applications
   ls applications/
   
   # Look at our CI/CD workflow
   cat .github/workflows/docker-build.yml
   
   # Check out our local build scripts
   ls applications/*/src/build.sh
   ```

3. **Build and test individual services locally**:
   ```bash
   # Build the API service locally
   cd applications/api/src
   ./build.sh
   
   # Build the consumer service locally
   cd applications/consumer/src
   ./build.sh
   
   # Build the producer service locally
   cd applications/producer/src
   ./build.sh
   ```

> [!NOTE]
> **Local Development**: These build scripts require a GitHub token in the root directory. They're perfect for testing changes before pushing to the main repository.

4. **Run our application locally**:
   ```bash
   # Start PostgreSQL (database)
   docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:13
   
   # Start our API service
   docker run -d --name api -p 3000:3000 \
     -e DB_HOST=host.docker.internal \
     -e DB_NAME=mcce_db \
     -e DB_USER=postgres \
     -e DB_PASSWORD=password \
     ghcr.io/mcce2024/argo-g1-api:latest
   
   # Start our consumer service
   docker run -d --name consumer -p 3001:3000 \
     -e API_BASE_URL=http://host.docker.internal:3000 \
     ghcr.io/mcce2024/argo-g1-consumer:latest
   
   # Start our producer (runs as a job)
   docker run --rm \
     -e API_URL=http://host.docker.internal:3000 \
     ghcr.io/mcce2024/argo-g1-producer:latest
   ```

4. **Access our application**:
   - **Consumer Dashboard**: http://localhost:3001
   - **API Health Check**: http://localhost:3000/health
   - **PostgreSQL**: localhost:5432 (if you need direct database access)

## 🔧 Code Insights: What We Learned

### Producer Service (`applications/producer/src/producer.py`)

```python
# We learned about HTTP retry logic - this was crucial!
def send_to_api(message, max_retries=3, retry_delay=30):
    """Send message to API with retry logic"""
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'MCCE-Producer-Service'
    }
    
    endpoint = f"{api_url}/api/messages"
    
    for attempt in range(max_retries):
        try:
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
            time.sleep(retry_delay)
    
    return False
```

> [!TIP]
> **Why HTTP Retry Logic?** In cloud environments, services might not be ready immediately. This pattern ensures our producer waits for the API to be available and handles network issues gracefully.

### Consumer Service (`applications/consumer/src/server.js`)

```javascript
// We learned about HTTP API integration
app.get("/api/messages", async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const apiUrl = `${API_BASE_URL}/api/messages?limit=${limit}`;

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
```

> [!NOTE]
> **HTTP Integration**: We learned to use the Fetch API to communicate between services. This is a common pattern in microservices architecture for service-to-service communication.

### API Service (`applications/api/src/server.js`)

```javascript
// We learned about multi-tenancy and database management
app.post("/api/messages", testMiddleware, async (req, res) => {
  try {
    const { datetime, environment = "prod" } = req.body;
    const tenantId = req.tenantId;

    // Create tenant schema if it doesn't exist
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}
    `);

    // Insert the message
    const result = await pool.query(
      `INSERT INTO tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}.messages 
       (datetime, environment) VALUES ($1, $2) RETURNING *`,
      [datetime, environment]
    );

    res.status(201).json({
      message: "Message stored successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error("Error storing message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

> [!IMPORTANT]
> **Multi-tenancy**: We learned that each tenant gets their own database schema. This ensures data isolation between different users/tenants.

## 🎓 Key Concepts We Mastered

### 1. **Container Orchestration (Kubernetes)**

> [!NOTE]
> **Our Discovery**: When you have many containers, you need a way to manage them. Kubernetes handles scheduling, scaling, and health monitoring.

Our project uses Kubernetes with:
- **CronJobs**: Our producer runs every minute automatically
- **Deployments**: Multiple replicas for high availability
- **Services**: Internal networking between containers
- **Network Policies**: Security isolation

### 2. **HTTP-Based Service Communication**

> [!TIP]
> **Our Approach**: We chose HTTP-based communication between services for simplicity and ease of debugging. This is a common pattern in microservices architecture.

What we learned:
- **RESTful APIs**: Standard HTTP methods (GET, POST) for service communication
- **Error handling**: Proper HTTP status codes and error responses
- **Retry logic**: Handling network failures and service unavailability
- **Service discovery**: Using environment variables for service URLs

### 3. **GitOps (ArgoCD)**

> [!IMPORTANT]
> **GitOps Revelation**: Our Git repository is the single source of truth for our infrastructure. Changes to Git automatically update our deployment.

Our ArgoCD setup spans multiple repositories:

#### Repository Structure
- **[INENPT-G1-Code](https://github.com/MCCE2024/INENPT-G1-Code)**: Contains our application code and CI/CD pipeline
- **[INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s)**: Contains Kubernetes manifests for our application deployment
- **[INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo)**: Contains ArgoCD application definitions and infrastructure configuration

#### How It Works
1. **We push application code** to INENPT-G1-Code
2. **CI/CD builds containers** and pushes to GitHub Container Registry
3. **We update Kubernetes manifests** in INENPT-G1-K8s to use new container versions
4. **ArgoCD monitors** INENPT-G1-K8s and automatically deploys changes
5. **Infrastructure changes** are managed in INENPT-G1-Argo

> [!NOTE]
> **Our Learning**: This separation allows us to manage application releases independently from infrastructure changes, making our deployment process more reliable and auditable.

Our ArgoCD setup:
- Monitors our Git repositories for changes
- Automatically deploys when configuration changes
- Provides a web UI to see deployment status
- Enables rollbacks to previous versions

## 🌍 Real-World Applications We Now Understand

### E-commerce Platform
- **Producer**: Inventory updates, order notifications sent via HTTP
- **Consumer**: Email notifications, dashboard updates via HTTP API calls
- **API**: User authentication, order management via RESTful endpoints
- **Database**: Persistent storage of orders, inventory, and user data

### Social Media Platform
- **Producer**: New posts, comments, likes sent via HTTP
- **Consumer**: News feed updates, notifications via HTTP API calls
- **API**: User profiles, content management via RESTful endpoints
- **Database**: Persistent storage of posts, user data, and interactions

### IoT Data Processing
- **Producer**: Sensor data from devices sent via HTTP
- **Consumer**: Analytics dashboards, alerts via HTTP API calls
- **API**: Device management, user access via RESTful endpoints
- **Database**: Persistent storage of sensor data and device information

## 🚀 What We Want to Learn Next

### 1. **Add Monitoring**
- Implement Prometheus metrics
- Add Grafana dashboards
- Set up alerting

### 2. **Enhance Security**
- Add service mesh (Istio)
- Implement mTLS between services
- Add secrets management

### 3. **Scale Our Application**
- Add horizontal pod autoscaling
- Implement database sharding
- Add caching layers

### 4. **Advanced CI/CD**
- Add automated testing
- Implement blue-green deployments
- Add security scanning

## 🤝 Our Learning Journey

> [!TIP]
> **Our Advice**: The best way to understand cloud computing is to modify this project and see how changes affect the system.

### How We Learned

1. **Started Simple**: We began with basic scripts
2. **Added Containers**: Learned Docker and containerization
3. **Implemented CI/CD**: Automated our development process
4. **Added Orchestration**: Learned Kubernetes
5. **Implemented GitOps**: Made infrastructure declarative

### Our Challenges and Solutions

- **Challenge**: "It works on my machine" problem
  - **Solution**: Containerization with Docker

- **Challenge**: Manual deployments were error-prone
  - **Solution**: Automated CI/CD pipeline

- **Challenge**: Services couldn't communicate reliably
  - **Solution**: HTTP-based communication with retry logic

- **Challenge**: Managing multiple containers
  - **Solution**: Kubernetes orchestration

- **Challenge**: Need for rapid local development and testing
  - **Solution**: Individual build scripts for each service

### What We Learned About Build Scripts

> [!TIP]
> **Build Script Insights**: We discovered that having both local and automated build processes gives us flexibility and reliability.

#### Key Concepts from Our Build Scripts

1. **Versioning Strategy**:
   ```bash
   VERSION=$(date +%Y%m%d-%H%M%S)
   ```
   - We use timestamps for versioning during development
   - This ensures each build has a unique identifier
   - Helps with debugging and rollback scenarios

2. **Registry Authentication**:
   ```bash
   cat "$TOKEN_PATH" | docker login ghcr.io -u mcce2024 --password-stdin
   ```
   - Secure authentication with GitHub Container Registry
   - Token-based authentication for automated processes
   - Proper cleanup with `docker logout`

3. **Image Tagging Strategy**:
   ```bash
   docker tag ${REGISTRY}/${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:latest
   ```
   - Both versioned and `latest` tags for flexibility
   - Versioned tags for specific deployments
   - `latest` tag for easy testing and development

4. **Error Handling**:
   ```bash
   if [ ! -f "$TOKEN_PATH" ]; then
       echo "Could not read GitHub token from '$TOKEN_PATH' file"
       exit 1
   fi
   ```
   - Proper error checking for required files
   - Clear error messages for debugging
   - Graceful failure handling

> [!NOTE]
> **Our Discovery**: These build scripts taught us about automation, security, and the importance of having both development and production build processes.

## 📚 Resources That Helped Us

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/tutorials/)
- [Microservices Patterns](https://microservices.io/patterns/)

---

> [!NOTE]
> **Our Reflection**: Cloud computing is about building reliable, scalable, and maintainable systems. This project taught us the building blocks - now we're ready to create something amazing!

**Happy Cloud Computing! ☁️**

*— Harald, Patrick, and Susanne*
