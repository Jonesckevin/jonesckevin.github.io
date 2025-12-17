---
title: "MeTube - Web-Based Video Downloader"
description: "MeTube is a self-hosted web UI for youtube-dl/yt-dlp. Download videos from YouTube and 1000+ sites with a simple, elegant interface. Queue management and format selection."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["metube", "youtube downloader", "yt-dlp", "youtube-dl", "web app", "open source", "media", "video download", "streaming", "multimedia", "user-friendly", "media management", "self-hosted"]
keywords: ["metube docker", "youtube-dl web ui", "video downloader", "yt-dlp docker", "self-hosted youtube downloader"]
slug: "metube"
draft: false
---

MeTube is a web-based YouTube downloader that allows users to download videos from YouTube and other platforms. It features a user-friendly interface, making it easy to search for and download videos in various formats and resolutions. MeTube is designed to be efficient and straightforward, catering to users who want to manage their media content without the complexity of traditional downloaders.

## Portainer Stack

**Ref:** <https://github.com/alexta69/metube>

![MeTube Example](../images/metube_example.png)

```yaml
services:
  metube:
    image: ghcr.io/alexta69/metube
    container_name: metube
    restart: unless-stopped
    ports:
      - "8081:8081"
    volumes:
      - ./metube/downloads:/downloads
```
