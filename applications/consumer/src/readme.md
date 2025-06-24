# Consumer - Setup 
Used libaries and coding language
- [amqplib 0.10.3](https://www.npmjs.com/package/amqplib/v/0.10.3) 
- [express 4.18.2](https://www.npmjs.com/package/express/v/4.18.2)
- [nodemon 3.0.3](https://www.npmjs.com/package/nodemon/v/3.0.3)

Used docker image from dockerhub
- [node:16-alpine](https://hub.docker.com/_/node/)

## Function:
-  server.js establish a connection to the rabbitmq and the `async function connectQueue()` retries 10 times to establish a connection
-  Afterwards the recieved JSON will be parsed and pushed to a queue 
-  For the messages that are parsed to string a array is used
-  The javascript graphic userinterface offers to buttons `Refresh Messages` and `Delete All Messages`
-  `Delete All Messages uses the array` and this be cleared with `app.post('/clear-messages', (req, res) => {
    messages.length = 0; // Clear the messages array
    res.sendStatus(200);
});`
- Additionally the environment will be determined based on RabbitMQ port: `const environmentText = rabbitmq_port === '5672' ? 'Test Deployment' : 'Production Deployment';`
### **Steps to Build and Run the Configuration**

*Build and Push the Docker Image*:
- navigate to the consumer directory
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

*Run the Docker Container*:
   - Start the service using Docker:
     docker run -p 3000:3000 ghcr.io/mcce2024/akkt1-g1-consumer:latest
  
   - application will be accessible at `http://localhost:3000`
> Action is no longer needed because there is a github action for this `build (consumer)`
---
### **Service Communication Overview**

- *RabbitMQ Integration*:
  - RabbitMQ connection details are dynamically configured using environment variables:
    ```
    RABBITMQ_HOST
    RABBITMQ_PORT
    RABBITMQ_USER
    RABBITMQ_PASS
    ```
  - The service consumes messages from a `datetime_queue` queue

- *Web Dashboard*:
  - Serves an interactive interface via `Express`:
    - view and refresh messages
    - clear messages stored in memory

- *Key Scripts*:
  - **`server.js`**:
    - establishes a connection to RabbitMQ
    - handles incoming messages and displays them on the web dashboard
  - **`package.json`**:
    - start the server:
      ```
      npm start
      ```
    - development mode with live reload:
      ```
      npm run dev
      ```
---

#### **Simplified Workflow**
Run the `build.sh` or `build.ps1`script to build and push the Docker image
Start the container using the `docker run` command
Access the web dashboard to view and manage messages

For more details, consult the source files:
- **`server.js`**: RabbitMQ and Express configuration
- **`package.json`**: Scripts and dependencies
