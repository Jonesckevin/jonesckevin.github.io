---
title: IT Tools
description: A collection of web-based tools for IT professionals, including CyberChef, Draw.io, and more.
tags: [it-tools, web app, tools, cyberchef, draw.io, dashboard, productivity,
  collaboration, data analysis, diagramming, open source]
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
