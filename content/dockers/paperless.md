---
title: "Paperless-ngx - Document Management System"
description: "Paperless-ngx is a powerful document management system with OCR, tagging, and full-text search. Scan, archive, and organize all your documents in a self-hosted paperless office."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["paperless", "document management", "archiving", "digital documents", "web app", "open source", "productivity", "self-hosted", "ocr", "document scanning", "pdf management", "paperless office", "organization"]
keywords: ["paperless-ngx docker", "document management system", "ocr docker", "paperless office", "document archive"]
slug: "paperless-ngx"
draft: false
---

Paperless-ngx is a document management system designed for archiving and managing digital documents. It allows users to scan, upload, and organize documents efficiently, providing features like OCR (Optical Character Recognition) to make documents searchable. Paperless-ngx is self-hosted, ensuring data privacy and control over your documents.

## Portainer Stack

![Paperless Example](../images/paperless_example.png)

```yaml
services:
    paperless-redis:
        image: 'docker.io/library/redis:7'
        volumes:
            - './paperless/redisdata:/data'
        restart: 'always'
        hostname: paperless-redis
        container_name: Paperless-Redis

    paperless-db:
        image: 'docker.io/library/postgres:16'
        environment:
            - POSTGRES_PASSWORD=paperless
            - POSTGRES_USER=paperless
            - POSTGRES_DB=paperless
        volumes:
            - './paperless/pgdata:/var/lib/postgresql/data'
        restart: 'always'
        hostname: paperless-db
        container_name: Paperless-DB

    paperless-ngx:
        image: 'ghcr.io/paperless-ngx/paperless-ngx:latest'
        environment:
            - PAPERLESS_REDIS=redis://Paperless-Redis:6379
            - PAPERLESS_DBHOST=Paperless-DB
            - PAPERLESS_OCR_LANGUAGE=eng
            - USERMAP_UID=1000
            - USERMAP_GID=1000
            - PAPERLESS_OCR_LANGUAGES=fra
        volumes:
            - './paperless/data:/usr/src/paperless/data'
            - './paperless/media:/usr/src/paperless/media'
            - './paperless/export:/usr/src/paperless/export'
            - './paperless/consume:/usr/src/paperless/consume'
        ports:
            - '8000:8000'
        restart: 'always'
        hostname: paperless-ngx
        container_name: Paperless-NGX
```
