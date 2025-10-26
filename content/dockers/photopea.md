---
title: "Photopea - Web-Based Image Editor"
description: "Photopea is a free, self-hostable web-based image editor supporting PSD, XCF, Sketch, and more. Full-featured Photoshop alternative with layers, filters, and advanced editing tools."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["photopea", "image editor", "web app", "graphics", "design", "photo editing", "psd support", "online tool", "multimedia", "creative", "photoshop alternative", "gimp alternative", "self-hosted"]
keywords: ["photopea docker", "web-based photoshop", "psd editor", "self-hosted image editor", "photoshop alternative"]
slug: "photopea-image-editor"
draft: false
---

Photopea is a web-based image editor that provides functionality similar to Adobe Photoshop. It supports a wide range of file formats, including PSD, XCF, Sketch, and more. Photopea is designed for graphic design, photo editing, and other creative tasks, making it a versatile tool for both professionals and hobbyists.

It offers features such as layers, filters, and advanced editing tools, allowing users to create and manipulate images directly in their web browser without the need for additional software installations.

## Portainer Stack

![Photopea Example](../images/photopea_example.png)

```yaml
services:
  photopea:
    image: eorendel/photopea:latest
    container_name: Photopea
    hostname: photopea
    restart: unless-stopped
    ports:
      - "8120:8887"
```
