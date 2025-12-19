---
title: "n8n - Workflow Automation Platform"
description: "n8n is a fair-code workflow automation tool for connecting apps and services. Build complex integrations visually with 350+ nodes. Self-hosted Zapier alternative with Docker."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker"]
tags: ["n8n", "workflow automation", "integration", "open source", "task automation", "web app", "data processing", "zapier alternative", "workflow builder", "api integration", "no-code", "low-code", "self-hosted"]
keywords: ["n8n docker", "workflow automation", "zapier alternative", "self-hosted automation", "n8n compose"]
slug: "n8n"
draft: false
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
      - n8n-db
    environment:
      TZ: America/Toronto
      N8N_PORT: 5678
      DB_TYPE: postgresdb
      WEBHOOK_URL: http://10.1.3.160:8300
      DB_POSTGRESDB_HOST: n8n-db
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: ${POSTGRES_DB}
      DB_POSTGRESDB_USER: ${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_SECURE_COOKIE: false
    volumes:
      - /root/n8n/n8n-data:/home/node/.n8n
  n8n-db:
    image: postgres:13-alpine
    user: "0:0"
    volumes:
      - /root/n8n/db-data:/var/lib/postgresql/data
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

---

Post setup, you may need to change permissions on the `n8n-data` and `db-data` directories to ensure that the n8n service can write to them. You can do this by running:

```bash
sudo chmod -R 777 /root/n8n
```
This command grants read, write, and execute permissions to all users for the `n8n` directory and its contents, which is necessary for n8n to function correctly.
