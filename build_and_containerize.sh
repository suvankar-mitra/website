#!/bin/bash
set -euo pipefail

APP_NAME="suvankar_website"
IMAGE_NAME="${APP_NAME}:latest"

# Step 1: Validate prerequisites
if [[ ! -f "./mvnw" ]]; then
  echo "Error: Maven wrapper (mvnw) not found."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker daemon is not running."
  exit 1
fi

# Step 2: Build the native container image
echo "Building Spring Boot native image: ${IMAGE_NAME}"

./mvnw -Pnative spring-boot:build-image \
  -Dspring-boot.build-image.imageName="${IMAGE_NAME}"

# Step 3: Verify the image exists
if docker image inspect "${IMAGE_NAME}" >/dev/null 2>&1; then
  echo "Native image built successfully: ${IMAGE_NAME}"
  docker image ls "${IMAGE_NAME}"
else
  echo "Error: Native image build failed."
  exit 1
fi