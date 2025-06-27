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
- **Producer** (Python): Generates datetime messages every minute
- **RabbitMQ**: Stores messages temporarily (like a post office)
- **Consumer** (Node.js): Displays messages through a web dashboard
- **API** (Node.js): Handles user authentication and stores data in PostgreSQL

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
│   Producer  │───▶│  RabbitMQ   │───▶│  Consumer   │
│  (Python)   │    │  (Message   │    │   (Node.js) │
│             │    │   Queue)    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │     API     │
                   │  (Node.js)  │
                   │             │
                   └─────────────┘
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

- **Producer**: Only generates datetime messages
- **Consumer**: Only displays messages via web UI
- **API**: Only handles authentication and data storage
- **RabbitMQ**: Only manages message queuing

> [!IMPORTANT]
> **Key Learning**: Each service can be developed, deployed, and scaled independently. If one fails, the others keep working!

### How Our Services Communicate

```
Producer ──[datetime message]──▶ RabbitMQ ──[datetime message]──▶ Consumer
                                    │
                                    ▼
                                 API ──[store/retrieve]──▶ PostgreSQL
```

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
   ```

3. **Run our application locally**:
   ```bash
   # Start RabbitMQ (message queue)
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   
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
     -e RABBITMQ_HOST=host.docker.internal \
     ghcr.io/mcce2024/argo-g1-consumer:latest
   
   # Start our producer (runs as a job)
   docker run --rm \
     -e RABBITMQ_HOST=host.docker.internal \
     ghcr.io/mcce2024/argo-g1-producer:latest
   ```

4. **Access our application**:
   - **Consumer Dashboard**: http://localhost:3001
   - **RabbitMQ Management**: http://localhost:15672 (guest/guest)
   - **API Health Check**: http://localhost:3000/health

## 🔧 Code Insights: What We Learned

### Producer Service (`applications/producer/src/producer.py`)

```python
# We learned about retry logic - this was crucial!
def try_connect(max_retries=30, retry_delay=2):
    """Attempts to connect to RabbitMQ with retry logic"""
    for attempt in range(max_retries):
        try:
            # Create connection parameters
            credentials = pika.PlainCredentials(
                os.environ.get('RABBITMQ_USER', 'guest'),
                os.environ.get('RABBITMQ_PASS', 'guest')
            )
            # ... connection logic
        except Exception as e:
            print(f"Connection attempt {attempt + 1} failed: {e}")
            time.sleep(retry_delay)
```

> [!TIP]
> **Why Retry Logic?** In cloud environments, services might not be ready immediately. This pattern ensures our producer waits for RabbitMQ to be available.

### Consumer Service (`applications/consumer/src/server.js`)

```javascript
// We learned about environment detection
const app = express();
app.use(express.static('public'));

// RabbitMQ connection with retry
async function connectQueue() {
    let retries = 10;
    while (retries > 0) {
        try {
            // ... connection logic
            break;
        } catch (error) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
```

> [!NOTE]
> **Environment Detection**: We learned to automatically detect if we're running in test or production based on the RabbitMQ port. This is a common pattern in cloud applications.

### API Service (`applications/api/src/server.js`)

```javascript
// We learned about multi-tenancy
app.post('/api/messages', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const githubUser = await validateGitHubToken(token);
    const schemaName = `tenant_${githubUser}`;
    
    // Create tenant-specific schema if it doesn't exist
    await createTenantSchema(schemaName);
});
```

> [!IMPORTANT]
> **Multi-tenancy**: We learned that each GitHub user gets their own database schema. This ensures data isolation between different users/tenants.

## 🎓 Key Concepts We Mastered

### 1. **Container Orchestration (Kubernetes)**

> [!NOTE]
> **Our Discovery**: When you have many containers, you need a way to manage them. Kubernetes handles scheduling, scaling, and health monitoring.

Our project uses Kubernetes with:
- **CronJobs**: Our producer runs every minute automatically
- **Deployments**: Multiple replicas for high availability
- **Services**: Internal networking between containers
- **Network Policies**: Security isolation

### 2. **Message Queues (RabbitMQ)**

> [!TIP]
> **Our Analogy**: Think of it like a post office. Messages are sent to queues, and consumers pick them up when ready. This decouples services and handles traffic spikes.

What we learned:
- **Asynchronous processing**: Services don't wait for each other
- **Load balancing**: Multiple consumers can process messages
- **Reliability**: Messages aren't lost if a service is down

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
- **Producer**: Inventory updates, order notifications
- **Consumer**: Email notifications, dashboard updates
- **API**: User authentication, order management
- **Message Queue**: Handles Black Friday traffic spikes

### Social Media Platform
- **Producer**: New posts, comments, likes
- **Consumer**: News feed updates, notifications
- **API**: User profiles, content management
- **Message Queue**: Processes millions of interactions

### IoT Data Processing
- **Producer**: Sensor data from devices
- **Consumer**: Analytics dashboards, alerts
- **API**: Device management, user access
- **Message Queue**: Handles burst data from thousands of devices

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
  - **Solution**: Message queues with RabbitMQ

- **Challenge**: Managing multiple containers
  - **Solution**: Kubernetes orchestration

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
