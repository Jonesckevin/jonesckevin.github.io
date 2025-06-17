---
title: DoomJS
description: A fast, lightweight, and highly customizable game server for Doom.
tags: [Doom, game server, lightweight, customizable]
---

**Ref:** [DoomJS](https://github.com/treyyoder/doomjs-docker)

![Doom Logo](https://raw.githubusercontent.com/treyyoder/doomjs-docker/refs/heads/master/doomjs-docker.png?raw=true)

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
