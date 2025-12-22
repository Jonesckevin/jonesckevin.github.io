---
title: "Wireguard + Dashboard"
description: "This guide provides a Dockerized setup for Wireguard VPN combined with WGDashboard, a web-based management interface for Wireguard. It allows users to easily configure and monitor their Wireguard VPN servers through an intuitive dashboard."
date: 2024-12-15
lastmod: 2025-12-15
categories: ["Docker"]
tags: ["wireguard", "wgdashboard", "vpn", "docker-compose", "self-hosted", "networking", "open source", "security", "containerization", "web interface", "deployment", "privacy"]
keywords: ["wireguard docker", "wgdashboard docker", "self-hosted vpn", "docker wireguard setup", "wireguard management", "vpn dashboard"]
slug: "wireguard-dashboard"
draft: false
featured_image: "https://camo.githubusercontent.com/795d448db3df1e3083e122b558d288bcf058635831821e5b4cbc3cc1433cbffc/68747470733a2f2f776764617368626f6172642d7265736f75726365732e746f72312e63646e2e6469676974616c6f6365616e7370616365732e636f6d2f4c6f676f732f4c6f676f2d322d526f756e6465642d353132783531322e706e67"
---

**Ref**:

- [GitHub Repository - WGDashboard](https://github.com/WGDashboard/WGDashboard/)
- [Docker Hub - DonaldZou](https://hub.docker.com/r/donaldzou/wgdashboard)

Wireguard + WGDashboard is a Dockerized setup that combines the Wireguard VPN server with WGDashboard, a web-based management interface. This setup allows users to easily configure and monitor their Wireguard VPN servers through an intuitive dashboard.

## Portainer Stack

![wgdashboard](../images/wgdashboard_example.png)

```yaml
services:
  wgdashboard:
    # Since the github organisation we recommend the ghcr.io.
    # Alternatively we also still push to docker.io under donaldzou/wgdashboard.
    # Both share the exact same tags. So they should be interchangable.
    image: ghcr.io/wgdashboard/wgdashboard:latest

    # Make sure to set the restart policy. Because for a VPN its important to come back IF it crashes.
    restart: unless-stopped
    container_name: wgdashboard

    # Environment variables can be used to configure certain values at startup. Without having to configure it from the dashboard.
    # By default its all disabled, but uncomment the following lines to apply these. (uncommenting is removing the # character)
    # Refer to the documentation on https://wgdashboard.dev/ for more info on what everything means.
    #environment:
      #- tz=                # <--- Set container timezone, default: Europe/Amsterdam.
      #- public_ip=         # <--- Set public IP to ensure the correct one is chosen, defaulting to the IP give by ifconfig.me.
      #- wgd_port=          # <--- Set the port WGDashboard will use for its web-server.

    # The following section, ports is very important for exposing more than one Wireguard/AmneziaWireguard interfaces.
    # Once you create a new configuration and assign a port in the dashboard, don't forget to add it to the ports as well.
    # Quick-tip: most Wireguard VPN tunnels use UDP. WGDashboard uses HTTP, so tcp.
    ports:
      - 10086:10086/tcp
      - 51820:51820/udp

    # Volumes can be configured however you'd like. The default is using docker volumes.
    # If you want to use local paths, replace the path before the : with your path.
    volumes:
      - aconf:/etc/amnezia/amneziawg
      - conf:/etc/wireguard
      - data:/data

    # Needed for network administration.
    cap_add:
      - NET_ADMIN

# The following configuration is linked to the above default volumes.
volumes:
  aconf:
  conf:
  data:
```