---
title: Quake
description: A fast, lightweight, and highly customizable game server for Quake.
tags: [Quake, game server, lightweight, customizable]
---

**Ref:** [QuakeJS](https://github.com/treyyoder/quakejs-docker)

![Quake Logo](https://raw.githubusercontent.com/treyyoder/quakejs-docker/refs/heads/master/quakejs-docker.png?raw=true)

![QuakeJS Example](../images/quakejs_example.png)

Quake is a fast, lightweight, and highly customizable game server for the classic first-person shooter game. It allows players to host their own game sessions and provides a variety of options for customization and optimization.

## Portainer Stack

```yaml
services:
  hal-quake:
    image: treyyoder/quakejs
    container_name: Quake
    restart: unless-stopped
    environment:
      - HTTP_PORT=666
      - SERVER=$IP
    ports:
      - "27960:27960"
      - "666:80"
```

```env
IP=your_ip_address
```
