---
title: Watchtower
description: A tool for automatically updating Docker containers.
tags: [watchtower, docker, automation, container management, updates, monitoring, open source]
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
