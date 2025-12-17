---
title: "DuckDNS"
description: "DuckDNS provides free dynamic DNS with automatic IP updates. Keep your domain pointing to your home server even with changing IP addresses. Docker container for auto-updates."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["duckdns", "dynamic dns", "ddns", "self-hosted", "domain", "ip address", "networking", "dns service", "free dns", "home server", "port forwarding"]
keywords: ["duckdns docker", "dynamic dns docker", "free ddns", "duckdns container", "home server dns"]
slug: "duckdns"
draft: false
seo_title: "DuckDNS - Free Dynamic DNS Service"
seo_description: "DuckDNS provides free dynamic DNS with automatic IP updates. Keep your domain pointing to your home server even with changing IP addresses. Docker container for auto-updates."
canonical: "/dockers/duckdns/"
featured_image: "https://brands.home-assistant.io/_/duckdns/logo.png"
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
