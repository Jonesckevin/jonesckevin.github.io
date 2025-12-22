---
title: "Whisper Webapp - Docker Deployment"
description: "Whisper WebApp is a Dockerized application for running OpenAI's Whisper speech-to-text model. Easily deploy and manage the Whisper Webapp container for efficient audio transcription."
date: 2025-12-20
lastmod: 2025-12-20
categories: ["Docker"]
tags: ["whisper", "docker", "speech-to-text", "openai", "transcription", "webapp", "containerization", "ai", "machine learning", "audio processing"]
keywords: ["whisper docker", "speech-to-text docker", "openai whisper", "docker transcription", "whisper webapp"]
slug: "whisper-webapp"
draft: false
featured_image: "https://github.com/Jonesckevin/whisper-webapp/blob/main/app/static/Whisper.png?raw=true"
---

**Ref:** <https://github.com/jonesckevin/whisper-webapp>

![Whisper WebApp Example](../images/whisper_example.png)

Whisper WebApp Dockerized version for running OpenAI's Whisper speech-to-text model. It provides an easy-to-use web interface for transcribing audio/video files with support for multiple languages and models. 

Deploying Whisper WebApp in a Docker container simplifies setup and ensures consistent environments for reliable transcription.


```yaml
---

services:
    whisper-webapp:
        image: 'jonesckevin/whisper-webapp:latest'
        ports:
        - "${WHISPERPORT:-8000}:5000"
        volumes:
        # Mapped directories for external file access via network share
        - ./data/uploads:/data/uploads
        - ./data/completed:/data/completed
        # Whisper models cache - persists models outside container
        - ./data/models:/root/.cache/whisper
        environment:
        - NVIDIA_VISIBLE_DEVICES=all
        - CUDA_VISIBLE_DEVICES=0
        - FLASK_ENV=production
        - MAX_UPLOAD_SIZE_GB=5
        - PRELOAD_WHISPER_MODELS=false  # Set to 'true' to download all models on first run
        deploy:
        resources:
            reservations:
            devices:
                - driver: nvidia
                count: 1
                capabilities: [gpu]
        restart: unless-stopped
        healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
        interval: 30s
        timeout: 10s
        retries: 3
        start_period: 60s
```


## Portainer Stack

If you use Portainer, and do not have a GPU, you can utilize CPU with degraded performance. 

> ⚠️ Uses Port 8000 by default. If you are already using it, you will get an error.

> Adjust the `WHISPERPORT` with a new Environment PORT to help avoid port conflicts.

**Portainer GitHub Connection:**

Label|Value
---:|---
Name:| whisper-webapp
Repository URL | https://github.com/Jonesckevin/whisper-webapp.git
Repository reference | \<You can leave blank>
Compose path | docker-compose.cpu.yml
