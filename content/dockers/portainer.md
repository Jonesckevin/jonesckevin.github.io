---
title: Portainer
description: A lightweight management UI which allows you to easily manage your Docker containers, images, networks and volumes.
tags: [portainer, docker management, container management, web app, open source, productivity, self-hosted, monitoring, deployment]
---

Portainer is a lightweight management UI that allows you to easily manage your Docker containers, images, networks, and volumes. It provides a user-friendly interface for monitoring and deploying applications, making it an essential tool for Docker users.

## Portainer Stack

![Portainer Example](../images/portainer_example.png)

```yaml
services:
    portainer-ce:
        image: 'portainer/portainer-ce:latest'
        volumes:
            - '/var/run/docker.sock:/var/run/docker.sock'
            - 'portainer_data:/data'
        command: '-H unix:///var/run/docker.sock'
        ports:
            - '9443:9000'
        restart: 'always'
        hostname: portainer
        container_name: Portainer

volumes:
    portainer_data:
        driver: local
```

If you want an agent, this is the configuration:

```yaml
    portainer-agent:
        image: 'portainer/agent:latest'
        volumes:
            - '/var/run/docker.sock:/var/run/docker.sock'
        restart: 'always'
        hostname: portainer-agent
        container_name: Portainer-Agent
```
