---
title: DuckDNS
description: A simple and free dynamic DNS service to keep your domain pointing to your dynamic IP address.
tags: [DuckDNS, dynamic DNS, self-hosted, domain, IP address]
---

**Ref:** [DuckDNS.org](https://www.duckdns.org/)

![DuckDNS Logo](https://github.com/homarr-labs/dashboard-icons/blob/main/png/duckdns.png?raw=true)

DuckDNS is a free dynamic DNS service that allows you to keep your domain name pointed to your dynamic IP address. It is a simple and effective solution for users who want to access their home network or self-hosted services from anywhere in the world without worrying about IP address changes.

## Portainer Stack

```yaml
services:
  duckdns:
    image: lscr.io/linuxserver/duckdns:latest
    container_name: duckdns
    network_mode: host
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - SUBDOMAINS=${DUCKDNS_DOMAIN}
      - TOKEN=${DUCKDNS_TOKEN}
      - UPDATE_IP=ipv4
      - LOG_FILE=false
    volumes:
      - /root/duckdns/config:/config
```

```env
DUCKDNS_DOMAIN="subdomain1,subdomain2"
DUCKDNS_TOKEN=your_duckdns_token
```
