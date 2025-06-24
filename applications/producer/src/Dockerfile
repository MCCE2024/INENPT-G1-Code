FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY producer.py .

# Create the group and user
RUN groupadd -g 3000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/bash appuser

# Set ownership for any application directories
RUN chown -R 1000:3000 /app

# Switch to non-root user
USER 1000:3000

CMD ["python", "producer.py"] 