---
title: "Linkwarden - Bookmark & Link Manager"
description: "Linkwarden is a self-hosted bookmark manager for saving and organizing web links with tags, archives, and collaboration. Privacy-focused alternative to Pocket and Raindrop."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["linkwarden", "bookmark manager", "link manager", "self-hosted", "web app", "open source", "docker", "organization", "productivity", "archiving", "collaboration", "tagging"]
keywords: ["linkwarden docker", "self-hosted bookmarks", "bookmark manager", "link organizer", "pocket alternative"]
slug: "linkwarden-bookmark-manager"
draft: false
---

**Ref:** <https://arstech.net/install-linkwarden-on-portainer/>

Linkwarden is a self-hosted bookmark manager that allows users to save, organize, and share web links. It provides a web interface for managing bookmarks with features like tagging, archiving, and collaboration, ensuring data privacy and control.

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
