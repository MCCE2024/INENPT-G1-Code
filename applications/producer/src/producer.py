import requests
from datetime import datetime
from zoneinfo import ZoneInfo
import os
import json
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get configuration from environment variables
api_url = os.getenv('API_URL', 'http://api-service:3000')
github_token = os.getenv('GITHUB_TOKEN')
environment = os.getenv('ENVIRONMENT', 'prod')

def validate_config():
    """Validate that required configuration is present"""
    # GitHub token is not actually required by the API, but we keep it for future use
    logger.info(f"API URL: {api_url}")
    logger.info(f"Environment: {environment}")
    return True

def create_message():
    """Create the datetime message that matches API expectations"""
    current_time = datetime.now(ZoneInfo("UTC"))
    
    # API expects a simple payload with datetime and environment
    return {
        "datetime": current_time.strftime("%Y-%m-%d %H:%M:%S"),
        "environment": environment
    }

def send_to_api(message, max_retries=3, retry_delay=30):
    """Send message to API with retry logic"""
    # API doesn't require authentication headers based on testMiddleware
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'MCCE-Producer-Service'
    }
    
    endpoint = f"{api_url}/api/messages"
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Sending message to API (attempt {attempt + 1}/{max_retries})")
            logger.info(f"Endpoint: {endpoint}")
            logger.info(f"Payload: {json.dumps(message, indent=2)}")
            
            response = requests.post(
                endpoint,
                headers=headers,
                json=message,
                timeout=30
            )
            
            logger.info(f"Response status: {response.status_code}")
            logger.info(f"Response body: {response.text}")
            
            if response.status_code == 201:
                logger.info(f"Successfully sent message to API: {response.json()}")
                return True
            else:
                logger.error(f"API returned error {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed (attempt {attempt + 1}/{max_retries}): {str(e)}")
        
        # If this wasn't the last attempt, wait before retrying
        if attempt < max_retries - 1:
            logger.info(f"Waiting {retry_delay} seconds before retry...")
            time.sleep(retry_delay)
    
    logger.error(f"Failed to send message to API after {max_retries} attempts")
    return False

def main():
    """Main function to create and send datetime message"""
    logger.info("Starting producer service")
    
    # Validate configuration
    if not validate_config():
        logger.error("Configuration validation failed")
        return
    
    # Create message
    message = create_message()
    logger.info(f"Created message: {json.dumps(message, indent=2)}")
    
    # Send to API
    success = send_to_api(message)
    
    if success:
        logger.info("Producer completed successfully")
    else:
        logger.warning("Producer completed with warnings (API unreachable)")
        # Don't exit with error code, just log and continue as requested

if __name__ == "__main__":
    main() 