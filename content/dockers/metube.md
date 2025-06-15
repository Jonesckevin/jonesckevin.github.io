---
title: MeTube
description: A web-based YouTube downloader with a user-friendly interface.
tags: [metube, youtube downloader, web app, open source, media, video download, streaming,
  multimedia, user-friendly, media management]
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
