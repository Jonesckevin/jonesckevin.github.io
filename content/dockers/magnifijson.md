---
title: "MagnifiJSON-viewer"
description: "MagnifiJSON-viewer is a web-based tool for visualizing and exploring JSON data structures. It provides an intuitive interface for analyzing and debugging JSON content."
date: 2026-09-20
lastmod: 2026-09-20
categories: ["Docker", "Training"]
tags: ["json viewer", "data visualization", "debugging", "docker-compose", "educational", "infosec", "tabletop game", "cyber training", "gamification"]
keywords: ["magnifijson docker", "json visualization docker", "debugging json docker", "docker json viewer"]
slug: "magnifijson"
draft: false
images: ["https://raw.githubusercontent.com/Jonesckevin/MagnifiJSON-viewer/31799449fe45b73e4f3587c805727d981cc69bda/app/static/img/logo.svg"]
seo_title: "MagnifiJSON-viewer - Dockerized JSON Visualization Tool"
seo_description: "Set up MagnifiJSON-viewer, a web-based tool for visualizing and exploring JSON data structures, using Docker. Analyze and debug JSON content with ease."
seo_keywords: ["magnifijson docker", "json visualization docker", "debugging json docker", "docker json viewer"]
schemaItemType: "WebPage"
featured_image: "https://raw.githubusercontent.com/Jonesckevin/MagnifiJSON-viewer/31799449fe45b73e4f3587c805727d981cc69bda/app/static/img/logo.svg"
---

## Portainer Stack

**Ref:** <https://github.com/Jonesckevin/MagnifiJSON-viewer>

![MagnifiJSON-viewer Example](../images/magnifijson_example.png)

```yaml
# MagnifiJSON-viewer
```
# https://github.com/Jonesckevin/MagnifiJSON-viewer

services:
  magnijson:
    image: jonesckevin/magnifijson-viewer:latest
    container_name: magnijson-webui
    ports:
      - "9021:8080"
    volumes:
      - ./upload:/app/upload       # Persisted JSON file uploads
      - ./exports:/app/exports     # Exports, saved queries, app state
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
```

