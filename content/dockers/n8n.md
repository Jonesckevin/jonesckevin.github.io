---
title: n8n
description: A powerful workflow automation tool that allows you to connect various services and automate tasks.
tags: [n8n, workflow automation, integration, open source, task automation, web app, data processing]
---

n8n is a powerful workflow automation tool that allows users to connect various services and automate tasks. It provides a visual interface for creating workflows, enabling users to design complex automations without needing extensive programming knowledge. n8n supports a wide range of integrations with popular applications and services, making it a versatile solution for automating repetitive tasks and streamlining processes.

## Portainer Stack

![n8n Example](../images/n8n_example.png)

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - 8300:5678
    depends_on:
      - db
    environment:
      TZ: America/Toronto
      N8N_PORT: 5678
      DB_TYPE: postgresdb
      WEBHOOK_URL: http://10.1.3.16:8300
      DB_POSTGRESDB_HOST: db
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: ${POSTGRES_DB}
      DB_POSTGRESDB_USER: ${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_SECURE_COOKIE: false
    volumes:
      - ./n8n/n8n-data:/home/node/.n8n
  db:
    image: postgres:13-alpine
    volumes:
      - ./n8n/db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      TZ: America/Toronto
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}

volumes:
  n8n-n8n-data:
  n8n-db-data:
```

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
N8N_SECURE_COOKIE=false
```
