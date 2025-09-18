---
title: Nginx Proxy Manager
description: A guide to setting up and using Nginx Proxy Manager with Docker.
---

**Ref:** [Nginx Proxy Manager](https://nginxproxymanager.com/setup/)

![Nginx Reverse Proxy Example](../images/nginxreverse_example.png)

This guide provides a Docker Compose setup for Nginx Proxy Manager, which allows you to manage your web applications and services with ease. It is designed to work with a Synology NAS or similar systems.

## Portainer Setup

```yaml
services:
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: 'nginx-proxy-manager'
    hostname: 'nginx-proxy-manager'
    restart: unless-stopped
    ports:
      - '80:80' # Public HTTP Port
      - '443:443' # Public HTTPS Port
      - '81:81' # Admin Web Port
    environment:
      DB_POSTGRES_HOST: 'npm-db'
      DB_POSTGRES_PORT: '5432'
      DB_POSTGRES_USER: $NPM_DBUSER
      DB_POSTGRES_PASSWORD: $NPM_DBPASS
      DB_POSTGRES_NAME: 'npm'
      # DISABLE_IPV6: 'true'
    volumes:
      - /root/nxing/data:/data
      - /root/nxing/letsencrypt:/etc/letsencrypt
    depends_on:
      - npm-db

  npm-db:
    image: postgres:latest
    container_name: 'npm-db'
    hostname: 'npm-db'
    restart: unless-stopped
    environment:
      POSTGRES_USER: $NPM_DBUSER
      POSTGRES_PASSWORD: $NPM_DBPASS
      POSTGRES_DB: 'npm'
    volumes:
      - /root/nxing/postgres:/var/lib/postgresql/data
```

```env
NPM_DBUSER='nginx'
NPM_DBPASS='nginx'
```
