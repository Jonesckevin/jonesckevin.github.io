---
title: Velociraptor
description: A web-based tool for endpoint visibility and management.
tags: [velociraptor, endpoint management, visibility, web app, security, monitoring, open source, self-hosted]
---

Velociraptor is a web-based tool designed for endpoint visibility and management. It provides a user-friendly interface for monitoring and managing endpoints, making it an essential tool for security professionals and system administrators.

## Portainer Stack

![Velociraptor Example](../images/velociraptor_example.png)

```yaml
services:
  velociraptor:
    image: wlambert/velociraptor:latest
    container_name: Velociraptor
    hostname: velociraptor
    restart: unless-stopped
    ports:
      - "8000:8000"
      - "8001:8001"
      - "8889:8889"
    volumes:
      - ./velociraptor:/velociraptor/:rw
    environment:
      - VELOX_USER=${VELOX_USER}
      - VELOX_PASSWORD=${VELOX_PASSWORD}
      - VELOX_ROLE=${VELOX_ROLE}
      - VELOX_SERVER_URL=${VELOX_SERVER_URL}
      - VELOX_FRONTEND_HOSTNAME=${VELOX_FRONTEND_HOSTNAME}
```

```env
# VELOX_USER=admin
# VELOX_PASSWORD=admin
# VELOX_ROLE=administrator
# VELOX_SERVER_URL=https://10.1.1.16:8889
# VELOX_FRONTEND_HOSTNAME=MedaRaptor
# VELOX_SERVER_URL2=https://raptor.4n6post.com/
```