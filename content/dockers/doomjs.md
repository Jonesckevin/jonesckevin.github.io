---
title: "Doom in Docker - Classic FPS Game Server"
description: "Play the classic Doom FPS game directly in your browser with this lightweight Docker container. Fast, customizable game server for retro gaming enthusiasts."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["doom", "game server", "lightweight", "customizable", "retro gaming", "fps", "browser game", "web game", "entertainment", "docker gaming"]
keywords: ["doom docker", "doom game server", "retro fps docker", "browser doom", "doom in container"]
slug: "doom-js-docker-game"
draft: false
---

**Ref:** [DoomJS](https://github.com/treyyoder/doomjs-docker)

![Doom Example](../images/doom_example.png)

DoomJS is a fast, lightweight, and highly customizable game server for the classic first-person shooter game. It allows players to host their own game sessions and provides a variety of options for customization and optimization.

## Portainer Stack

```bash
docker run -d --name hal-doom --restart always -p 999:8080 callumhoughton22/doom-in-docker
```

```yaml
services:
  doom:
    image: callumhoughton22/doom-in-docker
    hostname: doomjs
    container_name: doomjs
    restart: unless-stopped
    ports:
      - "999:8080"
```
