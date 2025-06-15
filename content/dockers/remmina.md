---
title: Remmina
description: A remote desktop client that supports multiple protocols, including RDP, VNC, and SSH.
tags: [remmina, remote desktop, RDP, VNC, SSH, web app, open source, productivity, IT tools,
  remote access, cross-platform, self-hosted]
---

Remmina is a versatile remote desktop client that supports multiple protocols, including RDP, VNC, and SSH. It is designed for IT professionals and users who need to access remote systems securely and efficiently. Remmina provides a user-friendly interface for managing remote connections, making it an essential tool for remote access and administration.

## Portainer Stack

![Remmina Example](../images/remmina_example.png)

```yaml
services:
    remmina:
        hostname: remmina
        container_name: Remmina
        image: 'lscr.io/linuxserver/remmina:latest'
        restart: unless-stopped
        volumes:
            - './remmina/config:/config'
        ports:
            - '8901:3001'
            - '8900:3000'
        environment:
            - TZ=Etc/UTC
            - PGID=1000
            - PUID=1000
```
