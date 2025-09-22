---
title: NexTerm
description: A remote desktop client that supports multiple protocols, including RDP, VNC, and SSH.
tags: [nexterm, remote desktop, RDP, VNC, SSH, web app, open source, productivity, IT tools,
  remote access, cross-platform, self-hosted]
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
