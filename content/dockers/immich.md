---
title: "Immich"
description: "Immich is a high-performance self-hosted photo and video backup solution with AI-powered facial recognition, automatic tagging, and mobile apps. Privacy-focused Google Photos alternative."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["immich", "photo backup", "video backup", "self-hosted", "ai search", "media management", "web app", "open source", "google photos alternative", "facial recognition", "mobile app", "privacy", "photo gallery"]
keywords: ["immich docker", "self-hosted photos", "google photos alternative", "photo backup solution", "immich compose"]
slug: "immich-photo-backup"
draft: false
seo_title: "Immich - Self-Hosted Photo & Video Backup"
seo_description: "Immich is a high-performance self-hosted photo and video backup solution with AI-powered facial recognition, automatic tagging, and mobile apps. Privacy-focused Google Photos alternative."
canonical: "/dockers/immich/"
featured_image: "https://immich.app/_app/immutable/assets/immich-logo-inline-dark.C4PioLn8.svg"
---

Immich is a self-hosted photo and video backup solution that allows users to securely store, manage, and share their media files. It offers features like AI-powered search, sharing capabilities, and a user-friendly interface for organizing photos and videos.

## Portainer Stack

![Immich Example](../images/immich_example.png)

>WARNING: Make sure to use the docker-compose.yml of the current release:
>
>https://github.com/immich-app/immich/releases/latest/download/docker-compose.yml
>
>The compose file on main may not be compatible with the latest release.

```yaml
services:
  immich-server:
    container_name: immich_server
    image: ghcr.io/immich-app/immich-server:${IMMICH_VERSION:-release}
    # extends:
    #   file: hwaccel.transcoding.yml
    #   service: cpu # set to one of [nvenc, quicksync, rkmpp, vaapi, vaapi-wsl] for accelerated transcoding
    volumes:
      # Do not edit the next line. If you want to change the media storage location on your system, edit the value of UPLOAD_LOCATION in the .env file
      - ${UPLOAD_LOCATION}:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    ports:
      - ${IMMICH_PORT:-2283}:2283
    depends_on:
      - redis
      - database
    restart: always
    healthcheck:
      disable: false

  immich-machine-learning:
    container_name: immich_machine_learning
    # For hardware acceleration, add one of -[armnn, cuda, openvino] to the image tag.
    # Example tag: ${IMMICH_VERSION:-release}-cuda
    image: ghcr.io/immich-app/immich-machine-learning:${IMMICH_VERSION:-release}-cuda
    # extends: # uncomment this section for hardware acceleration - see https://immich.app/docs/features/ml-hardware-acceleration
    #   file: hwaccel.ml.yml
    #   service: cpu # set to one of [armnn, cuda, openvino, openvino-wsl] for accelerated inference - use the `-wsl` version for WSL2 where applicable
    volumes:
      - ./immich/model-cache:/cache
    restart: always
    healthcheck:
      disable: false

  redis:
    container_name: immich_redis
    image: docker.io/redis:6.2-alpine@sha256:905c4ee67b8e0aa955331960d2aa745781e6bd89afc44a8584bfd13bc890f0ae
    healthcheck:
      test: redis-cli ping || exit 1
    restart: always

  database:
    container_name: immich_postgres
    image: docker.io/tensorchord/pgvecto-rs:pg14-v0.2.0@sha256:90724186f0a3517cf6914295b5ab410db9ce23190a2d9d0b9dd6463e3fa298f0
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_DB: ${DB_DATABASE_NAME}
      POSTGRES_INITDB_ARGS: '--data-checksums'
    volumes:
      - ${DB_DATA_LOCATION}:/var/lib/postgresql/data
    healthcheck:
      test: >-
        pg_isready --dbname="$${POSTGRES_DB}" --username="$${POSTGRES_USER}" || exit 1;
        Chksum="$$(psql --dbname="$${POSTGRES_DB}" --username="$${POSTGRES_USER}" --tuples-only --no-align
        --command='SELECT COALESCE(SUM(checksum_failures), 0) FROM pg_stat_database')";
        echo "checksum failure count is $$Chksum";
        [ "$$Chksum" = '0' ] || exit 1
      interval: 5m
      start_interval: 30s
      start_period: 5m
    command: >-
      postgres
      -c shared_preload_libraries=vectors.so
      -c 'search_path="$$user", public, vectors'
      -c logging_collector=on
      -c max_wal_size=2GB
      -c shared_buffers=512MB
      -c wal_compression=on
    restart: always

volumes:
  model-cache:
```

```.env
UPLOAD_LOCATION=./immich/media
DB_DATA_LOCATION=./immich/postgres
IMMICH_VERSION=release
DB_PASSWORD=postgres
DB_USERNAME=postgres
DB_DATABASE_NAME=immich
IMMICH_PORT=1054
```
