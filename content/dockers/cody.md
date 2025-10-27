---
title: "CodiMD (HackMD)"
description: "CodiMD is a real-time collaborative markdown editor with presentation mode. Self-hosted alternative to HackMD for team documentation and note-taking."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["codimd", "hackmd", "markdown", "editor", "collaborative", "real-time", "documentation", "notes", "docker-compose", "presentation mode", "self-hosted", "team collaboration"]
keywords: ["codimd docker", "hackmd self-hosted", "collaborative markdown", "markdown editor", "real-time notes"]
slug: "codimd-markdown-editor"
draft: false
image: "https://hackmd.io/logo-full.svg"
seo_title: "CodiMD (HackMD) - Collaborative Markdown Editor with Docker"
seo_description: "Set up CodiMD, a real-time collaborative markdown editor, using Docker. Create and share documents with your team effortlessly in a self-hosted environment."
seo_keywords: ["codimd docker", "hackmd self-hosted", "collaborative markdown", "markdown editor", "real-time notes", "docker markdown editor", "self-hosted documentation", "team collaboration tool"]
schemaItemType: "WebPage"
featured_image: "https://hackmd.io/logo-full.svg"
---

## Portainer Stack

Cody is a collaborative markdown editor that can be run using Docker. It is based on the HackMD project and allows multiple users to edit documents in real-time.

**Ref:** 

![Cody Example](../images/cody_example.png)

```yaml
services:
    codimd:
        image: 'hackmdio/hackmd:2.5.4'
        hostname: codimd
        container_name: Codimd
        restart: 'always'
        environment:
            - CMD_DB_URL=postgres://codimd:thepassword@Codimd-DB/codimd
            - CMD_USECDN=false
        volumes:
            - './codimd/uploads:/home/hackmd/app/public/uploads'
        ports:
            - '3000:3000'

    codimd-db:
        image: 'postgres:14-alpine'
        hostname: codimd-db
        container_name: Codimd-DB
        restart: 'always'
        environment:
            - POSTGRES_DB=codimd
            - POSTGRES_USER=codimd
            - POSTGRES_PASSWORD=thepassword
        volumes:
            - './codimd/db-data:/var/lib/postgresql/data'
```
