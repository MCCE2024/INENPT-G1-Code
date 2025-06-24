#!/bin/bash

# Use timestamp as version
VERSION=$(date +%Y%m%d-%H%M%S)

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Image name
IMAGE_NAME="akkt1-g1-producer"
REGISTRY="ghcr.io/mcce2024"

# Check if already logged in to ghcr.io
if [ -f ~/.docker/config.json ] && grep -q "ghcr.io" ~/.docker/config.json; then
    echo "Already logged in to ghcr.io"
else
    # Get token from parallel directory
    TOKEN_PATH="$(dirname "$SCRIPT_DIR")/token"
    if [ ! -f "$TOKEN_PATH" ]; then
        echo "Could not read GitHub token from '$TOKEN_PATH' file"
        exit 1
    fi
    cat "$TOKEN_PATH" | tr -d '\r\n' | docker login ghcr.io -u mcce2024 --password-stdin
fi

echo "Building ${REGISTRY}/${IMAGE_NAME}:${VERSION}"

docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} .
docker tag ${REGISTRY}/${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:latest
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
docker push ${REGISTRY}/${IMAGE_NAME}:latest

# Logout from ghcr.io
docker logout ghcr.io
echo "Logged out from ghcr.io"

echo "Build complete!"
echo "To run the image: docker run ${IMAGE_NAME}:${VERSION}" 