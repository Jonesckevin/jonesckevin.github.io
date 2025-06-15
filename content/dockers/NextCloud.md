---
title: "NextCloud"
date: 2025-06-01
draft: false
images: [https://nextcloud.com/wp-content/uploads/2020/03/nextcloud-logo.png]
tags:
  - dockers
  - nextcloud
  - cloud
  - docker-compose
  - yml
  - self-hosted
  - file-sync
  - file-sharing
  - productivity
  - collaboration
  - productivity-suite
  - office-suite
  - calendar
  - contacts
  - tasks
---

## Portainer Stack

**Ref:** <https://help.nextcloud.com/t/how-to-docker-compose-with-notify-push-2024/186721>

![NextCloud Example](../images/nextcloud_example.png)

```yaml
services:
  nc:
    image: nextcloud:apache
    environment:
      - POSTGRES_HOST=ncdb
      - POSTGRES_PASSWORD=nextcloud
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=nextcloud
    ports:
      - 8500:80
    restart: always
    volumes:
      - ./nextcloud/nc_data:/var/www/html
  ncdb:
    image: postgres:alpine
    environment:
      - POSTGRES_PASSWORD=nextcloud
      - POSTGRES_DB=nextcloud
      - POSTGRES_USER=nextcloud
    restart: always
    volumes:
      - ./nextcloud/db_data:/var/lib/postgresql/data
    expose:
      - 5432
volumes:
  db_data:
  nc_data:
```