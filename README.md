# INENPT-G1-Code: Our Application Development Learning Journey

04.07.2025

> [!NOTE] > **Welcome to our learning journey!** This repository contains the **application code** for our cloud-native microservices. We're sharing our discoveries, challenges, and insights to help other students understand modern application development in the cloud.
> We worked mostly via the Liveshare extension, so there can often be uneven pushes in the Git repository.

## 🧭 Repository Navigation Guide

**For Students Learning Cloud Computing:**

1. **Start Here** (INENPT-G1-Code) - Application development and microservices
2. **Next**: [INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s) - Kubernetes deployment and scaling
3. **Finally**: [INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo) - GitOps infrastructure and automation

**For Professors Evaluating:**

- **Requirements Coverage**: [See below](#-professor-requirements-how-we-met-each-one)
- **Application Architecture**: [See below](#️-our-project-a-message-processing-system)
- **Code Examples**: [See below](#-code-insights-what-we-learned)

**For Developers Contributing:**

- **Local Setup**: [See below](#-how-to-run-our-project)
- **Build Process**: [See below](#-local-development-vs-cicd)
- **Development Workflow**: [See below](#-our-complete-development-workflow)

## 📋 Table of Contents

- [🚀 Quick Start Guide](#-quick-start-guide)
- [🎯 What We Learned](#-what-we-learned)
- [🏗️ Our Project: A Message Processing System](#️-our-project-a-message-processing-system)
- [📁 Project Structure](#-project-structure)
- [🐳 What We Learned About Containerization](#-what-we-learned-about-containerization)
- [🔄 Our CI/CD Learning Experience](#-our-cicd-learning-experience)
- [🏗️ Microservices: Why We Chose This Approach](#️-microservices-why-we-chose-this-approach)
- [🚀 How to Run Our Project](#-how-to-run-our-project)
- [🔧 Code Insights: What We Learned](#-code-insights-what-we-learned)
- [🎓 Key Application Concepts](#-key-application-concepts)
- [🚨 Troubleshooting Guide](#-troubleshooting-guide)
- [✅ Professor Requirements: How We Met Each One](#-professor-requirements-how-we-met-each-one)
- [🌍 Real-World Applications](#-real-world-applications)
- [🚀 What We Want to Learn Next](#-what-we-want-to-learn-next)
- [🤝 Our Learning Journey](#-our-learning-journey)
- [📚 Resources That Helped Us](#-resources-that-helped-us)
- [🤔 Our Reflection](#-our-reflection)
- [🚀 Possible Improvements](#-possible-improvements)

## 📁 Project Structure

```
INENPT-G1-Code/                           # This Repository: Application Code & CI/CD
├── applications/                          # Our 3 Microservices
│   ├── api/                              # API Service (Node.js + PostgreSQL)
│   │   ├── src/
│   │   │   ├── server.js                 # Multi-tenant API with schema isolation
│   │   │   ├── Dockerfile                # Container definition
│   │   │   ├── build.sh                  # Local build script
│   │   │   ├── ca.pem                    # SSL certificate for database
│   │   │   └── package.json              # Dependencies
│   │   └── README.md                     # Service documentation
│   ├── consumer/                         # Consumer Service (Node.js Web Dashboard)
│   │   ├── src/
│   │   │   ├── server.js                 # Web dashboard with GitHub OAuth2
│   │   │   ├── public/                   # Frontend files
│   │   │   │   ├── dashboard.html        # Main dashboard
│   │   │   │   └── login.html            # OAuth2 login page
│   │   │   ├── Dockerfile                # Container definition
│   │   │   ├── build.sh                  # Local build script
│   │   │   └── package.json              # Dependencies
│   │   └── readme.md                     # Service documentation
│   └── producer/                         # Producer Service (Python CronJob)
│       ├── src/
│       │   ├── producer.py               # Datetime message generator
│       │   ├── Dockerfile                # Container definition
│       │   ├── build.sh                  # Local build script
│       │   └── requirements.txt          # Python dependencies
│       └── readme.md                     # Service documentation
├── .github/workflows/                    # CI/CD Pipeline
│   └── docker-build.yml                  # GitHub Actions workflow
└── README.md                             # This file
```

> [!NOTE] > **Related Repositories:**
>
> - **Kubernetes Deployment**: See [INENPT-G1-K8s](https://github.com/MCCE2024/INENPT-G1-K8s) for deployment manifests
> - **GitOps Infrastructure**: See [INENPT-G1-Argo](https://github.com/MCCE2024/INENPT-G1-Argo) for ArgoCD configuration
> - **Complete Setup**: See [INENPT-G1-Argo/README.md](https://github.com/MCCE2024/INENPT-G1-Argo) for full deployment guide

## 🎯 What We Learned

As cloud computing students, we built a **complete microservices application** that taught us:

- **Containerization** with Docker - packaging our applications consistently
- **Continuous Integration/Continuous Deployment (CI/CD)** with GitHub Actions - automating our development workflow
- **HTTP-Based Service Communication** - handling synchronous communication between services
- **Microservices Architecture** - breaking down applications into focused, independent services
- **OAuth2 Authentication** - implementing secure user authentication (Consumer Service)
- **Database Security** with SSL/TLS - securing database connections
- **Multi-tenant Applications** - isolating data between different users

## 🏗️ Our Project: A Message Processing System

We built a system that:

- **Producer** (Python): Generates datetime messages and sends them via HTTP to the API
- **API** (Node.js): Receives messages via HTTP and stores them in PostgreSQL with schema-based multi-tenancy
- **Consumer** (Node.js): Fetches messages from the API via HTTP and displays them in a web dashboard
- **PostgreSQL**: Stores all the datetime messages persistently

### Our Application Architecture

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

> [!TIP] > **Our "Aha!" Moment**: We realized this pattern is used everywhere - from social media feeds to e-commerce order processing. Understanding this helped us see the bigger picture of cloud computing.

## 🐳 What We Learned About Containerization

> [!IMPORTANT] > **Key Learning**: Containers solved our biggest problem - "It works on my machine!" Now our applications run the same way everywhere.

### Our Container Journey

We started with simple scripts, but quickly learned that containers are like **shipping containers for software**:

- Each container has everything our application needs
- They're lightweight and portable
- They run consistently across different environments
- They're isolated from each other

### Our Three Containerized Services

| Service      | Technology | What We Learned                               | Container Image                     |
| ------------ | ---------- | --------------------------------------------- | ----------------------------------- |
| **Producer** | Python     | How to package Python apps with dependencies  | `ghcr.io/mcce2024/argo-g1-producer` |
| **Consumer** | Node.js    | Building web interfaces in containers         | `ghcr.io/mcce2024/argo-g1-consumer` |
| **API**      | Node.js    | Multi-tenant applications with authentication | `ghcr.io/mcce2024/argo-g1-api`      |

> [!NOTE] > **Our Discovery**: Each service uses the technology best suited for its job. Python for data generation, Node.js for web services. This is a key principle of microservices!

## 🔄 Our CI/CD Learning Experience

> [!IMPORTANT] > **Biggest Revelation**: CI/CD transformed our development process. No more manual deployments or "forgot to test" moments!

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

> [!TIP] > **Smart Discovery**: We learned to only trigger builds when we change application code, not documentation. This saves time and resources!

### Our CI/CD Process

1. **We push code** to GitHub
2. **GitHub Actions builds** Docker images for our three application services
3. **Images are pushed** to GitHub Container Registry
4. **ArgoCD automatically deploys** to our Kubernetes cluster

> [!NOTE] > **Important Distinction**: Our CI/CD pipeline builds our three application containers (Producer, Consumer, API). PostgreSQL is an external service that our applications connect to, but it's not built by our CI/CD pipeline.

> [!WARNING] > **Security Lesson**: We learned to use GitHub secrets (`GHCR_USR`, `GHCR_PAT`) for authentication. Never hardcode credentials!

### Our Complete Development Workflow

> [!IMPORTANT] > **End-to-End Process**: Here's how our three repositories work together in a complete GitOps workflow.

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

> [!TIP] > **Our Discovery**: This workflow ensures that every deployment is traceable, auditable, and can be rolled back if needed. We learned that GitOps is not just about automation, but about reliability and transparency.

### Our Build Strategy

```yaml
strategy:
  fail-fast: false
  matrix:
    service: [api, consumer, producer]
```

> [!NOTE] > **Performance Insight**: Each service builds independently. If one fails, the others continue. This is much faster than building sequentially!

### Local Development vs. CI/CD

> [!IMPORTANT] > **Two Build Approaches**: We learned to use both local build scripts for development and GitHub Actions for automated CI/CD.

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

> [!TIP] > **Why Local Scripts?** We use these for rapid development and testing. They allow us to build and push individual services without triggering the full CI/CD pipeline.

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

> [!NOTE] > **Our Learning**: Local scripts are great for development, but CI/CD ensures consistent, automated builds for production. We learned to use both approaches appropriately.

### What Gets Built vs. What We Connect To

| Component      | Built by CI/CD? | Purpose                            |
| -------------- | --------------- | ---------------------------------- |
| **Producer**   | ✅ Yes          | Our Python datetime generator      |
| **Consumer**   | ✅ Yes          | Our Node.js web dashboard          |
| **API**        | ✅ Yes          | Our Node.js authentication service |
| **PostgreSQL** | ❌ No           | External database service          |

## 🏗️ Microservices: Why We Chose This Approach

### Our Microservices Journey

Instead of one big application, we built **small, focused services**:

- **Producer**: Only generates datetime messages and sends them via HTTP
- **Consumer**: Only fetches messages via HTTP and displays them via web UI
- **API**: Only handles HTTP requests and stores data in PostgreSQL
- **PostgreSQL**: Only stores and retrieves data

> [!IMPORTANT] > **Key Learning**: Each service can be developed, deployed, and scaled independently. If one fails, the others keep working!

### How Our Services Communicate

```
Producer ──[HTTP POST]──▶ API ──[HTTP GET]──▶ Consumer
                │
                ▼
            PostgreSQL
```

> [!NOTE] > **Our Design Choice**: We chose HTTP-based communication over message queues for simplicity. This makes our system easier to understand and debug, while still maintaining the benefits of microservices architecture.

## 🚀 How to Run Our Project

### What You'll Need

- **Docker Desktop** installed and running
- **Git** for version control
- **Basic command line knowledge**
- **GitHub account** (for container registry access)

> [!CAUTION] > **Windows Tip**: Make sure Docker Desktop is running before executing any Docker commands. You'll see a whale icon in your system tray when it's active.

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

> [!NOTE] > **Local Development**: These build scripts require a GitHub token in the root directory. They're perfect for testing changes before pushing to the main repository.

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

5. **Access our application**:
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

> [!TIP] > **Why HTTP Retry Logic?** In cloud environments, services might not be ready immediately. This pattern ensures our producer waits for the API to be available and handles network issues gracefully.

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

> [!NOTE] > **HTTP Integration**: We learned to use the Fetch API to communicate between services. This is a common pattern in microservices architecture for service-to-service communication.

### API Service (`applications/api/src/server.js`)

```javascript
// We learned about multi-tenancy, database management, and SSL security
// Read CA certificate for PostgreSQL SSL
let caCert = null;
try {
  const caCertPath = process.env.DB_CA_CERT_PATH || "/etc/ssl/certs/ca.pem";
  caCert = fs.readFileSync(caCertPath).toString();
  logger.info(`CA certificate loaded successfully from: ${caCertPath}`);
} catch (error) {
  logger.warn("Could not load CA certificate:", error.message);
  logger.warn("SSL connection will use system CA certificates");
}

// PostgreSQL connection with SSL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:
    process.env.DB_SSL === "require"
      ? {
          rejectUnauthorized: false,
          ca: caCert,
        }
      : false,
});

// Tenant middleware - gets tenant from environment variable
function tenantMiddleware(req, res, next) {
  const tenantId = process.env.TENANT_ID || "default";
  req.tenantId = tenantId;
  req.githubUser = {
    login: tenantId,
    id: Date.now(),
    name: `User from ${tenantId}`,
  };
  next();
}

// Multi-tenant message storage
app.post("/api/messages", tenantMiddleware, async (req, res) => {
  try {
    const { datetime, environment = "prod" } = req.body;
    const tenantId = req.tenantId;

    // Create tenant schema if it doesn't exist
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS tenant_${tenantId.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}
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

> [!IMPORTANT] > **Multi-tenancy & Security**: We learned that each tenant gets their own database schema based on the TENANT_ID environment variable, and we secure all database connections with SSL/TLS encryption for production environments.

## 🎓 Key Application Concepts

### 1. **OAuth2 Authentication (Consumer Service)**

> [!WARNING] > **OAuth2 Authentication - Our Biggest Challenge**
>
> We implemented OAuth2 in the Consumer Service for user authentication. We thought OAuth2 would be simple - just add a few endpoints. Reality was much harder:
>
> ```javascript
> // What we thought would work:
> app.get("/auth/github", (req, res) => {
>   res.redirect("https://github.com/login/oauth/authorize");
> });
>
> // What actually worked after days of debugging:
> app.get("/auth/github", (req, res) => {
>   if (!GITHUB_CLIENT_ID) {
>     return res.redirect("/?error=oauth_not_configured");
>   }
>   const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
>   res.redirect(githubAuthUrl);
> });
> ```
>
> **Our Learning**: OAuth2 requires proper state management, session handling, and error handling. We learned that security is never as simple as it looks.

### 2. **Database Security (SSL/TLS)**

> [!CAUTION] > **Database SSL/TLS - The ca.pem Mystery**
>
> Our biggest debugging nightmare was the database connection:
>
> ```javascript
> // This kept failing silently:
> const pool = new Pool({
>   host: process.env.DB_HOST,
>   ssl: true, // This wasn't enough!
> });
>
> // What actually worked:
> let caCert = null;
> try {
>   caCert = fs.readFileSync(path.join(__dirname, "ca.pem")).toString();
>   logger.info("CA certificate loaded successfully");
> } catch (error) {
>   logger.warn("Could not load CA certificate:", error.message);
> }
>
> const pool = new Pool({
>   host: process.env.DB_HOST,
>   ssl:
>     process.env.DB_SSL === "require"
>       ? {
>           rejectUnauthorized: false,
>           ca: caCert, // This was the missing piece!
>         }
>       : false,
> });
> ```
>
> **Our Learning**: SSL certificates aren't optional in production. We spent hours debugging connection issues before realizing we needed proper certificate handling.

### 3. **Multi-Tenant Applications (API Service)**

> [!TIP] > **Multi-Tenancy - Data Isolation**
>
> We implemented schema-based multi-tenancy in the API Service, where each tenant is identified by the TENANT_ID environment variable:
>
> ```javascript
> // Tenant middleware - gets tenant from environment variable
> function tenantMiddleware(req, res, next) {
>   const tenantId = process.env.TENANT_ID || "default";
>   req.tenantId = tenantId;
>   next();
> }
>
> // Create tenant-specific schema
> const schemaName = `tenant_${tenantId.replace(/[^a-zA-Z0-9]/g, "_")}`;
> await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
>
> // Store data in tenant's schema
> await pool.query(
>   `
>   INSERT INTO ${schemaName}.messages (datetime, environment)
>   VALUES ($1, $2)
> `,
>   [datetime, environment]
> );
> ```
>
> **Our Learning**: Multi-tenancy requires careful data isolation. Each tenant gets their own database schema to ensure complete data separation.

### 4. **HTTP-Based Service Communication**

> [!NOTE] > **Service Communication - HTTP vs Message Queues**
>
> We chose HTTP for simplicity and debugging:
>
> ```javascript
> // Producer sends to API via HTTP
> const response = await fetch(`${API_URL}/api/messages`, {
>   method: "POST",
>   headers: { "Content-Type": "application/json" },
>   body: JSON.stringify({ datetime, environment }),
> });
>
> // Consumer fetches from API via HTTP
> const response = await fetch(`${API_URL}/api/messages?limit=50`);
> const messages = await response.json();
> ```
>
> **Our Learning**: HTTP is easier to debug than message queues. We can use browser dev tools, curl, and standard HTTP debugging techniques.

## 🌍 Real-World Applications

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

> [!TIP] > **Our Advice**: The best way to understand cloud computing is to modify this project and see how changes affect the system.

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

> [!TIP] > **Build Script Insights**: We discovered that having both local and automated build processes gives us flexibility and reliability.

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

> [!NOTE] > **Our Discovery**: These build scripts taught us about automation, security, and the importance of having both development and production build processes.

## 📚 Resources That Helped Us

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Microservices Patterns](https://microservices.io/patterns/)

---

## 🤔 Our Reflection

### What This Project Taught Us

> [!IMPORTANT] > **Our Biggest Discovery**: Cloud computing isn't about writing perfect code - it's about debugging distributed systems and building reliable, scalable applications.

#### **The Learning Journey**

When we started this project, we thought cloud computing was about:

- Writing code and deploying it
- Using containers to package applications
- Setting up basic infrastructure

**What we actually learned:**

- **Debugging is 80% of the work**: OAuth2, SSL/TLS, and distributed systems debugging
- **Security is never optional**: Every component needs proper authentication and encryption
- **Infrastructure matters**: How you deploy affects how you develop
- **Multi-tenancy is complex**: Data isolation requires careful design and environment-based tenant identification

#### **Key Insights**

**1. Application Development in the Cloud**

- Microservices require different thinking than monolithic applications
- HTTP-based communication is simpler to debug than message queues
- Multi-tenant applications need careful data isolation and environment-based tenant identification
- OAuth2 is more complex than it appears and requires proper session management

**2. Security-First Mindset**

- SSL/TLS isn't optional in production
- Authentication requires proper state management
- Input validation and rate limiting are essential
- Secrets management is crucial

**3. Development Workflow**

- Local development scripts save time
- CI/CD pipelines automate repetitive tasks
- Containerization ensures consistency
- Versioning and tagging matter

#### **What We'd Do Differently**

**1. Start with Security**

- Implement OAuth2 from day one
- Set up SSL/TLS early in development
- Add input validation and rate limiting immediately

**2. Better Testing Strategy**

- Add automated tests for OAuth2 flows
- Test database connections with SSL
- Implement integration tests for microservices

**3. Documentation**

- Document debugging processes
- Create troubleshooting guides
- Share lessons learned earlier

#### **Real-World Impact**

This project taught us skills that are directly applicable to:

- **Enterprise Applications**: Multi-tenant, secure, scalable
- **Cloud-Native Development**: Containerized, distributed systems
- **DevOps Practices**: CI/CD, infrastructure as code, GitOps
- **Security Engineering**: Authentication, encryption, data protection

> [!NOTE] > **Our Reflection**: Cloud computing is about building reliable, scalable, and maintainable systems. This project taught us the building blocks - now we're ready to create something amazing!

**Happy Cloud Computing! ☁️**

_— Harald, Patrick, and Susanne_

## ✅ Professor Requirements: How We Met Each One

> [!IMPORTANT] > **Complete Requirements Coverage**: Our application code satisfies the core requirements, while our other repositories handle deployment and infrastructure.

### 📋 Application Requirements Checklist

| Requirement               | Our Implementation                                   | Status |
| ------------------------- | ---------------------------------------------------- | ------ |
| **3+ Services**           | Producer (Python), Consumer (Node.js), API (Node.js) | ✅ Met |
| **Database Integration**  | PostgreSQL with SSL/TLS and multi-tenant schemas     | ✅ Met |
| **OAuth2 Authentication** | GitHub OAuth with proper state management            | ✅ Met |
| **Security-First Design** | SSL/TLS, rate limiting, CORS, input validation       | ✅ Met |
| **Multi-Tenancy**         | Isolated database schemas per tenant                 | ✅ Met |

### 🔗 Related Requirements in Other Repositories

| Requirement               | Repository     | Link                                                          |
| ------------------------- | -------------- | ------------------------------------------------------------- |
| **Kubernetes Deployment** | INENPT-G1-K8s  | [View Repository](https://github.com/MCCE2024/INENPT-G1-K8s)  |
| **GitOps Controller**     | INENPT-G1-Argo | [View Repository](https://github.com/MCCE2024/INENPT-G1-Argo) |
| **IaC Tool (Helm)**       | INENPT-G1-Argo | [View Repository](https://github.com/MCCE2024/INENPT-G1-Argo) |
| **No-Click Setup**        | INENPT-G1-Argo | [View Repository](https://github.com/MCCE2024/INENPT-G1-Argo) |

> [!TIP]
> **Complete System**: This repository contains the application code. For deployment and infrastructure, see our other repositories linked above.

## 🔗 How This Repository Integrates with the Others

- **INENPT-G1-K8s**:  
  - Provisions the Kubernetes cluster and managed PostgreSQL database using OpenTofu (or Terraform).
  - Outputs cluster and database connection information for use by the applications built in this repository.

- **INENPT-G1-Argo**:  
  - Contains the GitOps deployment configuration (Helm charts, ArgoCD ApplicationSets, Sealed Secrets).
  - References the Docker images built and pushed by this repository in its deployment manifests.
  - (Recommended) After a successful build, a workflow or manual process should update the image tag in the Helm values files in INENPT-G1-Argo, ensuring ArgoCD deploys the latest version.

- **INENPT-G1-Code (this repo)**:  
  - Contains the application source code and CI/CD workflows for building and pushing Docker images to the GitHub Container Registry (GHCR).
  - Triggers builds and deployments that are then managed by the other two repositories.

## 🚀 Possible Improvements

- **ArgoCD GitHub Action for ApplicationSet Templates** (INENPT-G1-Argo):
  - Automate the generation and update of ApplicationSet YAMLs using a GitHub Action, reducing manual errors and improving scalability for new tenants/services.

- **GitHub Action for Tag Update** (INENPT-G1-Code & INENPT-G1-Argo):
  - After a successful image build, automatically create a PR in INENPT-G1-Argo to update the image tag in Helm values, ensuring seamless GitOps deployment.

- **Secure Database IP Filtering** (INENPT-G1-K8s):
  - Restrict PostgreSQL access to only the Kubernetes cluster or specific CIDRs, rather than 0.0.0.0/0, to enhance security.

- **Proxy for Request Forwarding & JWT Generation** (INENPT-G1-Code):
  - Implement a proxy service to route requests to the correct tenant namespace based on URL, and optionally generate JWT tokens for secure, multi-tenant authentication.

### Additional Considerations
- All improvements are viable and align with best practices for automation, security, and scalability.
- Ensure proper testing and review for automation (GitHub Actions) to avoid accidental disruptions.
- For security enhancements, validate network policies and access controls after changes.
- Proxy and JWT logic should be thoroughly tested for security vulnerabilities and correct multi-tenancy behavior.
