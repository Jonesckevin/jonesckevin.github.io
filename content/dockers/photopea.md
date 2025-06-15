---
title: Photopea
description: A web-based image editor similar to Adobe Photoshop, supporting various file formats.
tags: [photopea, image editor, web app, graphics, design, photo editing, PSD support, online tool,
  multimedia, creative, open source]
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
