---
title: Planka
description: A kanban board application for managing tasks and projects.
tags: [planka, kanban, task management, project management, web app, productivity, open source,
  collaboration, team management, agile, software development]
---

Planka is a kanban board application designed for managing tasks and projects. It provides a visual interface for organizing work, tracking progress, and collaborating with team members. Planka is suitable for agile project management and supports features like task assignment, due dates, and project boards.

## Portainer Stack

![Planka Example](../images/planka_example.png)

```yaml
services:
  planka:
    image: ghcr.io/plankanban/planka:latest
    container_name: Planka
    restart: on-failure
    volumes:
      - ./Planka/user-avatars:/app/public/user-avatars
      - ./Planka/project-background-images:/app/public/project-background-images
      - ./Planka/attachments:/app/private/attachments
    ports:
      - 8200:1337
    environment:
      - BASE_URL=http://10.1.1.16:8200
      - DATABASE_URL=postgresql://postgres@postgres/planka
      - SECRET_KEY=notsecretkey
      - DEFAULT_ADMIN_EMAIL=planka@4n6post.com
      - DEFAULT_ADMIN_PASSWORD=planka@4n6post.com
      - DEFAULT_ADMIN_NAME=admin
      - DEFAULT_ADMIN_USERNAME=admin
    depends_on:
      - postgres
    networks:
      - planka-net

  postgres:
    image: postgres:14-alpine
    container_name: Planka_DB
    restart: on-failure
    volumes:
      - ./Planka/db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=planka
      - POSTGRES_HOST_AUTH_METHOD=trust
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d planka"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - planka-net

networks:
  planka-net: 

volumes:
  db-data:
  user-avatars:
  project-background-images:
  attachments:
```
