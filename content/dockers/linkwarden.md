---
title: Linkwarden
description: A self-hosted password manager that integrates with Bitwarden.
tags: [linkwarden, password manager, self-hosted, bitwarden, security, web app, open source, docker]
---

**Ref:** <https://arstech.net/install-linkwarden-on-portainer/>

Linkwarden is a self-hosted password manager that integrates with Bitwarden, allowing users to manage their passwords securely. It provides a web interface for accessing and managing passwords, making it easy to use while ensuring data privacy and security.

## Portainer Stack

![Linkwarden Example](../images/linkwarden_example.png)

```yaml
services:
  linkwarden:
    container_name: linkwarden
    image: ghcr.io/linkwarden/linkwarden:latest
    restart: unless-stopped
    volumes:
      - ./linkwarden/data:/data/data
    environment:
      - DATABASE_URL=postgresql://dbuser1:PASSWORD@linkwarden-db:5432/linkwarden
      - NEXTAUTH_SECRET=SuperPassword
      - NEXTAUTH_URL=http://localhost/api/v1/auth
    ports:
      - "4222:3000"
    networks:
      - linkwarden_net
  linkwarden-db:
    container_name: linkwarden-db
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=dbuser1
      - POSTGRES_PASSWORD=PASSWORD
      - POSTGRES_DB=linkwarden
    volumes:
      - ./linkwarden/pgdata:/var/lib/postgresql/data
    networks:
      - linkwarden_net
networks:
  linkwarden_net:
    driver: bridge
```
