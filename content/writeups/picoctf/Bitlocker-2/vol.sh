#!/bin/bash

# Volatility Docker Automation Script
# This script sets up and runs Volatility using Docker Compose

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "Creating docker-compose.yml..."
    cat > docker-compose.yml << 'EOF'
---
services:
  volatility:
    build:
      context: .
      dockerfile: Dockerfile
    image: volatility-custom:latest
    container_name: volatility
    volumes:
      - ./:/dumps
    working_dir: /dumps
    command: --help
EOF
    echo "docker-compose.yml created successfully."
fi

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "Creating Dockerfile..."
    cat > Dockerfile << 'EOF'
FROM python:3.8-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Clone and install Volatility
RUN git clone https://github.com/volatilityfoundation/volatility.git /app/volatility && \
    cd /app/volatility && \
    python setup.py install

# Set working directory to /dumps for analysis
WORKDIR /dumps

ENTRYPOINT ["python", "/app/volatility/vol.py"]
EOF
    echo "Dockerfile created successfully."
fi

# Check if image already exists
if docker images volatility-custom:latest | grep -q volatility-custom; then
    echo "Volatility image already exists. Skipping build."
    echo "Starting Volatility with Docker Compose..."
    docker compose up
else
    echo "Building and starting Volatility with Docker Compose..."
    docker compose up --build
fi

