---
title: "QuakeJS - Classic FPS in Your Browser"
description: "QuakeJS brings the classic Quake III Arena to your browser. Self-hosted multiplayer FPS game server with WebGL rendering. Play Quake 3 without installation."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["quake", "quakejs", "game server", "fps", "browser game", "multiplayer", "retro gaming", "web game", "quake 3", "arena shooter", "lightweight", "customizable", "self-hosted"]
keywords: ["quakejs docker", "quake 3 browser", "web-based quake", "quake game server", "quake docker"]
slug: "quakejs-browser-game"
draft: false
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
