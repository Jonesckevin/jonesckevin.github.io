---
title: "Homer"
description: "Homer is a simple, elegant static application dashboard and homepage. Organize your self-hosted services with a customizable, lightweight dashboard that requires no database."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker"]
tags: ["homer", "dashboard", "homepage", "self-hosted", "web app", "static site", "service organizer", "landing page", "docker-compose", "lightweight", "customizable", "yaml config"]
keywords: ["homer dashboard", "static dashboard", "self-hosted homepage", "service dashboard docker", "homer docker"]
slug: "homer"
draft: false
images: ["https://raw.githubusercontent.com/bastienwirtz/homer/main/public/logo.png"]
seo_title: "Homer - Static Application Dashboard"
seo_description: "Homer is a simple, elegant static application dashboard and homepage. Organize your self-hosted services with a customizable, lightweight dashboard that requires no database."
canonical: "/dockers/homer/"
featured_image: "https://raw.githubusercontent.com/bastienwirtz/homer/main/public/logo.png"
---

## Portainer Stack

**Ref:** [Github.com/b4bz/homer](https://github.com/bastienwirtz/homer)

![Homer Example](../images/homer_example.png)

```yaml
services:
  homer:
    image: b4bz/homer:latest
    container_name: Homer
    ports:
      - 80:8080
    user: 1000:1000 # default
#    user: 0:0 # For when Default doesn't work
    environment:
      - INIT_ASSETS=1 # default
    volumes:
      - ./assets/:/www/assets
      - ./assets/tools:/www/assets/tools
      - ./assets/custom.css:/www/assets/custom.css  
volumes:
  assets:
```
