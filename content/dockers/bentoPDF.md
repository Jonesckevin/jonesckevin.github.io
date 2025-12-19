---
title: "BentoPDF"
description: "BentoPDF is a lightweight PDF viewer and manager that can be self-hosted using Docker. It provides an easy way to view, organize, and manage PDF documents in a web interface."
images: ["https://www.bentopdf.com/images/favicon.svg"]
featured_image: "https://www.bentopdf.com/images/favicon.svg"
date: 2025-12-19
lastmod: 2025-12-19
categories: ["Docker"]
tags: ["bentopdf", "pdf viewer", "self-hosted", "docker-compose", "document management", "pdf manager", "open-source", "web interface", "file organization"]
keywords: ["bentopdf docker", "self-hosted pdf viewer", "pdf management platform", "docker pdf manager", "bentopdf compose"]
slug: "bentopdf"
draft: false
seo_title: "BentoPDF - Lightweight PDF Viewer and Manager with Docker"
seo_description: "Set up BentoPDF, a lightweight PDF viewer and manager, using Docker. Easily view, organize, and manage your PDF documents in a self-hosted web interface."
seo_keywords: ["bentopdf docker", "self-hosted pdf viewer", "pdf management platform", "docker pdf manager", "bentopdf compose", "docker document management", "self-hosted file organization", "open-source pdf viewer", "docker pdf organization"]
schemaItemType: "WebPage"
---

This guide provides a Docker Compose setup for BentoPDF, a lightweight PDF viewer and manager that can be self-hosted. BentoPDF offers an easy way to view, organize, and manage PDF documents through a web interface.

- [Official Site](https://www.bentopdf.com/)
- [Github](https://github.com/alam00000/bentopdf)

![BentoPDF Screenshot](../images/bentopdf_example.png)

## Portainer Setup

```yaml
services:
  bentopdf:
    # simple mode - bentopdf/bentopdf-simple:latest
    # default mode - bentopdf/bentopdf:latest
    image: bentopdf/bentopdf:latest
    container_name: bentopdf
    restart: unless-stopped
    ports:
      - '8080:8080'
```