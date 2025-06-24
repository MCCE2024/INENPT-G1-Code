# Use specific version for better security and reproducibility
FROM node:16-alpine

# Update system packages and install only necessary dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init

# Set the working directory
WORKDIR /app

# Create node_modules and set permissions before switching user
RUN mkdir -p /app/node_modules && \
    chown -R node:node /app

# Copy package files and set ownership
COPY --chown=node:node package*.json ./

# Switch to non-root user
#node has uid 1000
USER node

# Install dependencies
RUN npm install --verbose && \
    npm cache clean --force

# Copy the rest of the application code
COPY --chown=node:node . .

# Set secure defaults
ENV NODE_ENV=production \
    NODE_OPTIONS='--no-deprecation --no-warnings' \
    NPM_CONFIG_AUDIT=true \
    NPM_CONFIG_AUDIT_LEVEL=high

EXPOSE 3000

# Use dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "server.js"] 