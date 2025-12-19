---
title: "NexTerm - Multi-Protocol Remote Access Client"
description: "NexTerm is a web-based remote desktop client supporting RDP, VNC, SSH, and Telnet. Self-hosted alternative to Apache Guacamole with a modern interface."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker"]
tags: ["nexterm", "remote desktop", "rdp", "vnc", "ssh", "telnet", "web app", "open source", "productivity", "it tools", "remote access", "cross-platform", "self-hosted", "guacamole alternative"]
keywords: ["nexterm docker", "web-based remote desktop", "rdp vnc ssh", "remote access tool", "nexterm client"]
slug: "nexterm"
draft: false
---

NexTerm is a versatile remote desktop client that supports multiple protocols, including RDP, VNC, and SSH. It is designed for IT professionals and users who need to access remote systems securely and efficiently. NexTerm provides a user-friendly interface for managing remote connections, making it an essential tool for remote access and administration.

## Portainer Stack

![NexTerm Example](../images/nexterm_example.png)

```yaml
services:
  nexterm:
    image: germannewsmaker/nexterm:1.0.2-OPEN-PREVIEW
    container_name: nexterm
    hostname: nexterm
    restart: ${SHUFFLE_RESTART_POLICY:-unless-stopped}
    ports:
      - "${NEXTERMPORT:-6989}:6989"
    volumes:
      - /root/utility/nexterm:/app/data
```
