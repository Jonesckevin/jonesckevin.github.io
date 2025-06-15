---
title: "Homer"
date: 2025-05-21
draft: false
images: [https://raw.githubusercontent.com/bastienwirtz/homer/main/public/logo.png]
tags:
  - dockers
  - homer
  - dashboard
  - docker-compose
  - yml
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
