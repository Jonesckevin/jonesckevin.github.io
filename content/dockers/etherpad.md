---
title: "Etherpad"
description: "Etherpad is an open-source collaborative text editor with real-time editing, version control, and chat. Self-hosted alternative to Google Docs for team collaboration."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["etherpad", "collaborative editor", "real-time editing", "document creation", "web app", "open source", "text editor", "productivity", "google docs alternative", "team collaboration", "version control", "document sharing"]
keywords: ["etherpad docker", "collaborative text editor", "real-time document editing", "google docs alternative", "self-hosted editor"]
slug: "etherpad-collaborative-editor"
draft: false
seo_title: "Etherpad - Collaborative Real-Time Document Editor"
seo_description: "Etherpad is an open-source collaborative text editor with real-time editing, version control, and chat. Self-hosted alternative to Google Docs for team collaboration."
canonical: "/dockers/etherpad/"
featured_image: "https://etherpad.org/_next/static/media/brand.9923586b.svg"
---

Etherpad is a collaborative real-time editor that allows multiple users to create and edit documents simultaneously. It is designed for productivity and teamwork, providing features such as version control, chat, and document sharing.
It is an open-source web application that can be self-hosted, making it a popular choice for teams and organizations looking for a flexible and customizable text editing solution.

## Portainer Stack

![Etherpad Example](../images/etherpad_example.png)

```yaml
services:
  app:
    user: "0:0"
    image: etherpad/etherpad:latest
    tty: true
    stdin_open: true
    volumes:
      - plugins:/opt/etherpad-lite/src/plugin_packages
      - etherpad-var:/opt/etherpad-lite/var
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      ADMIN_PASSWORD: ${DOCKER_COMPOSE_APP_ADMIN_PASSWORD:-admin}
      DB_CHARSET: ${DOCKER_COMPOSE_APP_DB_CHARSET:-utf8mb4}
      DB_HOST: postgres
      DB_NAME: ${DOCKER_COMPOSE_POSTGRES_DATABASE:-etherpad}
      DB_PASS: ${DOCKER_COMPOSE_POSTGRES_PASSWORD:-admin}
      DB_PORT: ${DOCKER_COMPOSE_POSTGRES_PORT:-5432}
      DB_TYPE: "postgres"
      DB_USER: ${DOCKER_COMPOSE_POSTGRES_USER:-admin}
      # For now, the env var DEFAULT_PAD_TEXT cannot be unset or empty; it seems to be mandatory in the latest version of etherpad
      DEFAULT_PAD_TEXT: ${DOCKER_COMPOSE_APP_DEFAULT_PAD_TEXT:- }
      DISABLE_IP_LOGGING: ${DOCKER_COMPOSE_APP_DISABLE_IP_LOGGING:-false}
      SOFFICE: ${DOCKER_COMPOSE_APP_SOFFICE:-null}
      TRUST_PROXY: ${DOCKER_COMPOSE_APP_TRUST_PROXY:-true}
    restart: always
    ports:
      - "${DOCKER_COMPOSE_APP_PORT_PUBLISHED:-9001}:${DOCKER_COMPOSE_APP_PORT_TARGET:-9001}"

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DOCKER_COMPOSE_POSTGRES_DATABASE:-etherpad}
      POSTGRES_PASSWORD: ${DOCKER_COMPOSE_POSTGRES_PASSWORD:-admin}
      POSTGRES_PORT: ${DOCKER_COMPOSE_POSTGRES_PORT:-5432}
      POSTGRES_USER: ${DOCKER_COMPOSE_POSTGRES_USER:-admin}
      PGDATA: /var/lib/postgresql/data/pgdata
    restart: always
    # Exposing the port is not needed unless you want to access this database instance from the host.
    # Be careful when other postgres docker container are running on the same port
    # ports:
    #   - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data/pgdata

volumes:
  postgres_data:
  plugins:
  etherpad-var:
```

```.env
DOCKER_COMPOSE_APP_PORT_PUBLISHED=9001
DOCKER_COMPOSE_APP_PORT_TARGET=9001
DOCKER_COMPOSE_APP_DEV_ENV_DEFAULT_PAD_TEXT="Welcome to MedaPad"
DOCKER_COMPOSE_APP_ADMIN_PASSWORD=etherpad
DOCKER_COMPOSE_POSTGRES_DATABASE=db
DOCKER_COMPOSE_POSTGRES_PASSWORD=medapad
DOCKER_COMPOSE_POSTGRES_USER=medapad
```