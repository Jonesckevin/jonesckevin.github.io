---
title: "OCR WebApp"
description: "OCR WebApp is a Dockerized application that provides a web interface for performing Optical Character Recognition (OCR) on uploaded images and documents. It leverages powerful OCR engines to extract text from various file formats, making it easy for users to convert scanned documents and images into editable text."
date: 2024-12-21
lastmod: 2025-12-21
categories: ["Docker"]
tags: ["ocr", "optical character recognition", "docker-compose", "ai models", "web interface", "machine learning", "deployment", "self-hosted", "open source", "productivity", "development", "containerization", "web app", "llm", "local ai", "privacy"]
keywords: ["ocr docker", "self-hosted ocr", "local ocr", "ocr webui", "ocr model management", "docker ocr stack"]
slug: "ocr-webapp"
draft: false
featured_image: ""

---

**Ref**: 
- [GitHub](https://github.com/jonesckevin/ocr-webapp)
- [Docker Hub](https://hub.docker.com/r/jonesckevin/ocr-webapp)

OCR WebApp is a Dockerized application that provides a web interface for performing Optical Character Recognition (OCR) on uploaded images and documents. It leverages powerful OCR engines to extract text from various file formats, making it easy for users to convert scanned documents and images into editable text.

## Portainer Stack

![ocr-webapp](../images/ocr_example.png)

```yaml
---
services:
  ocr-webapp:
    image: jonesckevin/ocr-webapp:latest
    container_name: ocr-webapp
    ports:
      - "${OCRPORT:-8002}:5000"
    volumes:
      # Persistent storage for uploaded files and OCR results
      - ./data/uploaded:/data/uploaded
      - ./data/output:/data/output
      - ./data/logs:/data/logs
    environment:
      # Flask settings
      - FLASK_ENV=production
      - SECRET_KEY=change-this-to-a-secure-random-string
      
      # Admin feature toggles
      - ALLOW_LIVE_LANG_INSTALL=true
      - ALLOW_CLIENT_API_KEYS=true
      
      # Logging configuration
      - LOG_MAX_BYTES=10485760  # 10MB default
      - LOG_BACKUP_COUNT=5
      - LOG_LEVEL=INFO
      
      # LLM Server endpoints (local)
      - OLLAMA_HOST=http://host.docker.internal:11434
      - LMSTUDIO_HOST=http://host.docker.internal:1234
      
      # Paid LLM API Keys (server-side, secure)
      # Uncomment and set your API keys as needed
      # - OPENAI_API_KEY=sk-your-openai-key
      # - ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
      # - GOOGLE_API_KEY=AIza-your-google-key
      # - DEEPSEEK_API_KEY=sk-your-deepseek-key
      # - COHERE_API_KEY=your-cohere-key
      # - GROK_API_KEY=xai-your-grok-key
      # - MISTRAL_API_KEY=your-mistral-key
      # - PERPLEXITY_API_KEY=pplx-your-perplexity-key
      
    restart: unless-stopped
    # For live language installation, container needs to run as root
    # user: root
    
    # Resource limits (optional)
    # deploy:
    #   resources:
    #     limits:
    #       memory: 2G
    #       cpus: '2'

```
