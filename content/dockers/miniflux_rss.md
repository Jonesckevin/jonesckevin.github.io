---
title: RSS Feed Reader
description: A simple and efficient RSS feed reader.
tags: [rss, feed reader, miniflux, docker, postgres, web application, self-hosted, open source, productivity, news aggregator, content management]
---

Miniflux is a minimalist and efficient RSS feed reader designed to help users manage their news feeds effectively. It provides a clean and user-friendly interface for reading and organizing RSS feeds, making it easy to stay updated with the latest content from various sources. Miniflux is self-hosted, allowing users to maintain control over their data while enjoying a fast and responsive reading experience.

## Portainer Stack

![Miniflux Example](../images/miniflux_example.png)

```yaml
services:
  miniflux:
    image: miniflux/miniflux:latest
    ports:
      - "8050:8080"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://miniflux:secret@db/miniflux?sslmode=disable
      - RUN_MIGRATIONS=1
      - CREATE_ADMIN=1
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=password
  db:
    image: postgres:latest
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - miniflux-db:/var/lib/postgresql/data
volumes:
  miniflux-db:
