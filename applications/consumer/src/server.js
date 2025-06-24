const express = require('express');
const amqp = require('amqplib');
const app = express();

const messages = [];
//const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq';

//Get RabbitMQ connection details from environment variables
rabbitmq_host = process.env.RABBITMQ_HOST || 'rabbitmq'
rabbitmq_port = process.env.RABBITMQ_PORT || '5672'
rabbitmq_user = process.env.RABBITMQ_USER || 'guest'
rabbitmq_pass = process.env.RABBITMQ_PASS || 'guest'

//console.log('rabbitmq_host:', rabbitmq_host);
//console.log('rabbitmq_port:', rabbitmq_port);
//console.log('rabbitmq_user:', rabbitmq_user);
//console.log('rabbitmq_pass:', rabbitmq_pass);

const RABBITMQ_URL = `amqp://${rabbitmq_user}:${rabbitmq_pass}@${rabbitmq_host}:${rabbitmq_port}`

async function connectQueue() {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            const queue = 'datetime_queue';

            await channel.assertQueue(queue);
            
            console.log('Successfully connected to RabbitMQ');
            console.log('Waiting for messages...');
            
            channel.consume(queue, (data) => {
                try {
                    const message = data.content.toString();
                    const parsedMessage = JSON.parse(message);
                    messages.push(parsedMessage);
                    channel.ack(data);
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    console.log('Raw message:', data.content.toString());
                    // Still acknowledge the message to prevent it from being requeued
                    channel.ack(data);
                }
            });

            return; // Success - exit the retry loop
        } catch (error) {
            currentRetry++;
            console.log(`Failed to connect to RabbitMQ (attempt ${currentRetry}/${maxRetries}):`, error.message);
            
            if (currentRetry === maxRetries) {
                console.error('Max retries reached. Could not connect to RabbitMQ');
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

app.use(express.static('public'));

app.post('/clear-messages', (req, res) => {
    messages.length = 0; // Clear the messages array
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    // Determine environment based on RabbitMQ port
    const environmentText = rabbitmq_port === '5672' ? 'Test Deployment' : 'Production Deployment';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AKTT1 G1 Consumer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background-color: #f0f0f0;
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .header-text {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;  /* Adds space between text elements */
                }
                .header-text h1, .header-text h2, .header-text h4 {
                    margin: 0;  /* Removes default margins */
                }
                .logo {
                    max-width: 150px;
                    max-height: 150px;
                    width: auto;
                    height: auto;
                    margin-right: 20px;
                }
                .messages {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                }
                .refresh-button {
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-bottom: 20px;
                }
                .refresh-button:hover {
                    background-color: #45a049;
                }
                .delete-button {
                    padding: 10px 20px;
                    background-color: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
                .delete-button:hover {
                    background-color: #cc0000;
                }
                .environment-label {
                    background-color: #007bff;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 3px;
                    display: inline-block;
                    margin-bottom: 10px;
                }
            </style>
            <script>
                function refreshPage() {
                    const audio = document.getElementById('clickSound');
                    audio.volume = 0.2;  // Set volume to 20% (0.2)
                    audio.play();
                    setTimeout(() => {
                        location.reload();
                    }, 4000);
                }

                function clearMessages() {
                    fetch('/clear-messages', { method: 'POST' })
                        .then(() => {
                            setTimeout(() => {
                                location.reload();
                            }, 200);
                        })
                        .catch(error => console.error('Error clearing messages:', error));
                }
            </script>
        </head>
        <body>
            <audio id="clickSound" src="/click.mp3"></audio>
            <div class="header">
                <img src="/logo.gif" alt="Group 1 Logo" class="logo">
                <div class="header-text">
                    <h1>AKTT1 G1 Consumer Dashboard</h1>
                    <h2>Beier, Peer, Prugger</h2>
                    <h4 style="font-style: italic;">A part of Red Rose Inc.</h4>
                    <div class="environment-label">${environmentText}</div>
                </div>
            </div>
            <button class="refresh-button" onclick="refreshPage()">Refresh Messages</button>
            <button class="delete-button" onclick="clearMessages()">Delete All Messages</button>
            <div class="messages">
                ${messages.map(msg => `
                    <div class="message">
                        <strong>Time:</strong> ${msg.timestamp}<br>
                        <strong>Data:</strong> ${JSON.stringify(msg.data)}
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.CONSUMER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('RABBITMQ_URL:', RABBITMQ_URL);
    connectQueue();
}); 