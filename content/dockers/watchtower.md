---
title: "Watchtower - Automatic Docker Container Updates"
description: "Watchtower automatically updates your running Docker containers when new images are available. Set-and-forget container update automation with scheduling and notifications."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["watchtower", "docker", "automation", "container management", "updates", "monitoring", "open source", "auto-update", "devops", "continuous deployment", "container maintenance"]
keywords: ["watchtower docker", "automatic container updates", "docker auto-update", "watchtower automation", "container updater"]
slug: "watchtower"
draft: false
---

**Ref:** <https://github.com/containrrr/watchtower.git>

Watchtower is a tool designed to automatically update running Docker containers whenever a new image is available. It monitors your containers and checks for updates at specified intervals, ensuring that your applications are always running the latest versions without manual intervention.

## Portainer Stack

![Watchtower Example](../images/watchtower_example.png)

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 600 open-webui  # Check for updates every 10 minutes
    restart: unless-stopped
```
