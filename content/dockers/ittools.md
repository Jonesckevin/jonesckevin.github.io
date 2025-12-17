---
title: "IT Tools"
description: "IT Tools is a comprehensive collection of handy developer utilities including encoders, converters, generators, and formatters. All-in-one toolbox for developers and IT professionals."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["it-tools", "web app", "developer tools", "utilities", "productivity", "encoding", "conversion", "formatters", "generators", "open source", "toolbox", "web utilities"]
keywords: ["it tools docker", "developer utilities", "web tools collection", "encoding tools", "developer toolbox"]
slug: "ittools"
draft: false
seo_title: "IT Tools - Developer Utilities Collection"
seo_description: "IT Tools is a comprehensive collection of handy developer utilities including encoders, converters, generators, and formatters. All-in-one toolbox for developers and IT professionals."
canonical: "/dockers/ittools/"
featured_image: "https://github.com/CorentinTh/it-tools/raw/main/.github/logo-white.png"
---

IT Tools is a collection of web-based tools designed for IT professionals. It includes applications like CyberChef for data analysis, Draw.io for diagramming, and other utilities that enhance productivity and collaboration in IT environments.

## Portainer Stack
![IT Tools Example](../images/it_tools_example.png)

```yaml
services:
  it-tools:
    restart: unless-stopped
    image: corentinth/it-tools:latest
    ports:
      - 8800:80
```
