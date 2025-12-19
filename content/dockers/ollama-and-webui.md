---
title: "Ollama & Open WebUI - Self-Hosted AI Models"
description: "Run local AI models with Ollama and manage them through Open WebUI's intuitive interface. Self-hosted LLM solution for privacy-focused AI deployment with Docker Compose."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker"]
tags: ["ollama", "open-webui", "docker-compose", "ai models", "web interface", "machine learning", "deployment", "self-hosted", "open source", "productivity", "development", "containerization", "web app", "llm", "local ai", "privacy"]
keywords: ["ollama docker", "self-hosted ai", "local llm", "open webui", "ai model management", "docker ai stack"]
slug: "ollama-open-webui"
draft: false
---

**Ref**: [Docker Compose - usrbinkat](https://gist.githubusercontent.com/usrbinkat/de44facc683f954bf0cca6c87e2f9f88/raw/0402e8441de57ccd8b00fe0db8ad40cae7d5fdb8/docker-compose.yaml)

Ollama is a platform that allows users to run AI models locally, providing a self-hosted solution for machine learning applications. Open WebUI is a web interface that interacts with Ollama, enabling users to easily access and manage AI models through a user-friendly dashboard.

## Portainer Stack

![Ollama and Open WebUI Example](../images/ollama_open_webui_example.png)

```yaml
services:
  open-webui:
    container_name: open-webui
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - MODEL_DOWNLOAD_DIR=./models
      - OLLAMA_API_BASE_URL=http://ollama:11434
      - OLLAMA_API_URL=http://ollama:11434
      - LOG_LEVEL=debug
      - WEBUI_SECRET_KEY=your_secret_key  # Add this to prevent logouts after updates
    volumes:
      - ./data:/data
      - ./models:/models
      - ./open-webui:/app/backend/data  # Corrected path based on documentation
    ports:
      - "8081:8080"
    logging:
      driver: json-file
      options:
        max-size: "5m"
        max-file: "2"
    depends_on:
      - ollama
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - ollama
    restart: unless-stopped
    
  ollama:
    container_name: ollama
    image: ollama/ollama:latest
    #runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
      - CUDA_VISIBLE_DEVICES=0
      - LOG_LEVEL=debug
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              capabilities: [gpu]
              count: all
    volumes:
      - ./ollama:/root/.ollama
      - ./models:/models
    ports:
      - "11434:11434"
    logging:
      driver: json-file
      options:
        max-size: "5m"
        max-file: "2"
    networks:
      - ollama
    restart: unless-stopped
    
volumes:
  data:
  models:
  ollama:
  open-webui:
networks:
  ollama:
    driver: bridge
```
