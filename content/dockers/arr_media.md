---
title: "*Arr Media Stack - Automated Media Management"
description: "Complete media automation stack with Radarr, Sonarr, Lidarr, Prowlarr, and download clients. Self-hosted media management system with automatic downloads and organization."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["arr stack", "radarr", "sonarr", "lidarr", "prowlarr", "readarr", "bazarr", "media automation", "docker-compose", "qbittorrent", "nzbget", "jackett", "media server", "self-hosted", "plex", "jellyfin"]
keywords: ["arr stack docker", "radarr sonarr", "media automation", "docker media server", "arr compose"]
slug: "arr-media-stack"
draft: false
---

This guide provides a Docker Compose setup for various media management applications, including qBittorrent, Transmission, NZBGet, SABnzbd, Jackett, Prowlarr, Sonarr, Radarr, Lidarr, Readarr, Bazarr, and Tubesync. The setup is designed to work with a Synology NAS or similar systems.

## Portainer Setup

Note: You will need your own VPN credentials for the DelugeVPN service. As well you will need your config file from the VPN provider.

```yaml
services:
  delugevpn:
    image: binhex/arch-delugevpn
    container_name: delugevpn
    cap_add:
        - NET_ADMIN
    environment:
        - VPN_ENABLED=yes
        - VPN_USER=${VPN_USER}
        - VPN_PASS=${VPN_PASS}
        - VPN_PROV=pia
        - LAN_NETWORK=192.168.1.0/24
        - NAME_SERVERS=1.1.1.1,1.0.0.1
        - DELUGE_DAEMON_LOG_LEVEL=info
        - DELUGE_WEB_LOG_LEVEL=info
    ports:
        - 8112:8112
        - 8118:8118
        - 58846:58846
    volumes:
        - $V_PATHS/delugevpn:/data
        - $V_PATHS/delugevpn/config:/config

  transmission:
    image: linuxserver/transmission:version-3.00-r0
    container_name: transmission
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    volumes:
      - $V_PATHS/transmission:/config
      - $V_PATHS/_downloads:/media/_downloads
      - $V_PATHS/_downloads/_watch:/media/_downloads/_watch
      - $V_PATHS/_downloads/_intermediate:/media/_downloads/_intermediate
    restart: always

  nzbget:
    image: ghcr.io/linuxserver/nzbget
    container_name: nzbget
    ports:
      - 6789:6789
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    volumes:
      - $V_PATHS/nzbget:/config
      - $V_PATHS/nzbget/logs:/nzb_logs
      - $V_PATHS/_downloads:/media/_downloads
      - $V_PATHS/_downloads/_watch:/media/_downloads/_watch
      - $V_PATHS/_downloads/_intermediate:/media/_downloads/_intermediate
    restart: always

  sabnzb:
    image: lscr.io/linuxserver/sabnzbd:latest
    container_name: sabnzb
    ports:
      - 8280:8080
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    volumes:
      - $V_PATH/sabnzb:/config
      - $V_PATHS/_downloads:/downloads
      - $V_PATHS/_downloads/_incomplete:/incomplete-downloads
    restart: always

  jackett:
    image: ghcr.io/linuxserver/jackett
    container_name: jackett
    hostname: jackett
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 9117:9117
    volumes:
      - $V_PATHS/jackett:/config
    restart: always

  prowlarr:
    image: ghcr.io/linuxserver/prowlarr:develop
    container_name: prowlarr
    hostname: prowlarr
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 9696:9696
    volumes:
      - $V_PATHS/prowlarr:/config
    restart: always

  sonarr:
    image: ghcr.io/linuxserver/sonarr
    container_name: sonarr
    hostname: sonarr
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 8989:8989
    volumes:
      - $V_PATHS/sonarr:/config
      - $V_MEDIA/tv:/media/tv
      - $V_PATHS/_downloads:/media/_downloads
    restart: always

  radarr:
    image: ghcr.io/linuxserver/radarr
    container_name: radarr
    hostname: radarr
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 7878:7878
    volumes:
      - $V_PATHS/radarr:/config
      - $V_MEDIA/movies:/media/movies
      - $V_PATHS/_downloads:/media/_downloads
    restart: always

  lidarr:
    image: ghcr.io/linuxserver/lidarr
    container_name: lidarr
    hostname: lidarr
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 8686:8686
    volumes:
      - $V_PATH/lidarr:/config
      - $V_MEDIA/music:/media/music
      - $V_PATHS/_downloads:/media/_downloads
    restart: always

  readarr:
    image: lscr.io/linuxserver/readarr:develop
    container_name: readarr
    hostname: readarr
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 8787:8787
    volumes:
      - $V_PATHS/readarr:/config
      - $V_MEDIA/audiobooks:/media/audiobooks
      - $V_MEDIA/ebooks:/media/ebooks
      - $V_PATHS/_downloads:/media/_downloads
    restart: always

  bazarr:
    image: ghcr.io/linuxserver/bazarr
    container_name: bazarr
    ports:
      - 6767:6767
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    volumes:
      - $V_PATHS/bazarr:/config
      - $V_MEDIA/movies:/movies
      - $V_MEDIA/tv:/tv
    restart: always

  tubesync:
    image: ghcr.io/meeb/tubesync:latest
    container_name: tubesync
    hostname: tubesync
    environment:
      - PUID=$V_PUID
      - PGID=$V_PGID
      - PGID=$V_TZ
    ports:
      - 4848:4848
    volumes:
      - $V_PATHS/tubesync:/config
      - $V_MEDIA/youtube:/downloads
    restart: "no"

# Note: The m4b-tool and example sections were not valid docker-compose services and have been removed.
# If you want to use m4b-tool, use the provided docker run alias outside of docker-compose.

# Only one volume was defined, for synology-tv. If you want to use more named volumes, define them here.
volumes:
  synology-tv:
    driver: local
    driver_opts:
      type: cifs
      o: username=$V_USERNAME,password=$V_PASSWORD,uid=1031,gid=100,file_mode=0777,dir_mode=0777
      device: $V_CIFS_DEVICE_TV

```

```env
    VPN_USER=your_vpn_username
    VPN_PASS=your_vpn_password
    V_PUID=1000
    V_PGID=1000
    V_TZ=America/New_York
    V_MEDIA=/mnt/pve/PlexMedia/nzbdocker
    V_PATHS=./nzbget/Arrs/
    V_USERNAME=yarrsername
    V_PASSWORD=the_password
    V_CIFS_DEVICE_TV=//10.0.0.10/tv
```
