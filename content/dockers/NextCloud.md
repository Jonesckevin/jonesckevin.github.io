---
title: "NextCloud - Self-Hosted Cloud Storage & Collaboration"
description: "NextCloud is a powerful self-hosted cloud platform offering file storage, sync, sharing, calendar, contacts, and office suite. Full-featured alternative to Google Drive and Dropbox with complete data ownership."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker", "AI Tools"]
tags: ["nextcloud", "cloud storage", "self-hosted", "file sync", "file sharing", "productivity", "collaboration", "office suite", "calendar", "contacts", "tasks", "docker-compose", "privacy", "data ownership"]
keywords: ["nextcloud docker", "self-hosted cloud", "private cloud storage", "nextcloud compose", "dropbox alternative"]
slug: "nextcloud"
draft: false
images: ["https://nextcloud.com/wp-content/uploads/2020/03/nextcloud-logo.png"]
---

## Portainer Stack

**Ref:** <https://help.nextcloud.com/t/how-to-docker-compose-with-notify-push-2024/186721>

![NextCloud Example](../images/nextcloud_example.png)

```yaml
services:
  nc:
    image: nextcloud:apache
    environment:
      - POSTGRES_HOST=ncdb
      - POSTGRES_PASSWORD=nextcloud
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=nextcloud
    ports:
      - 8500:80
    restart: always
    volumes:
      - ./nextcloud/nc_data:/var/www/html
  ncdb:
    image: postgres:alpine
    environment:
      - POSTGRES_PASSWORD=nextcloud
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=nextcloud
    restart: always
    volumes:
      - ./nextcloud/db_data:/var/lib/postgresql/data
    expose:
      - 5432
volumes:
  db_data:
  nc_data:
```