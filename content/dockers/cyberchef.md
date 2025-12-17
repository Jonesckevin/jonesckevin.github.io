---
title: "CyberChef"
description: "CyberChef is a web-based data analysis and decoding tool for encryption, encoding, compression, and data manipulation. Perfect for cybersecurity professionals, developers, and data analysts running in Docker."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["cyberchef", "web app", "data analysis", "decoding", "encoding", "encryption", "decryption", "data manipulation", "cybersecurity", "forensics", "hashing", "base64", "hex"]
keywords: ["cyberchef docker", "data decoding tool", "encryption analysis", "cybersecurity tools", "data manipulation web app"]
slug: "cyberchef"
draft: false
featured_image: "https://cyberchef.io/images/cyberchef-128x128.png"
seo_title: "CyberChef - The Cyber Swiss Army Knife in Docker"
seo_description: "Set up CyberChef, a web-based data analysis and decoding tool, using Docker. Perform encryption, encoding, compression, and data manipulation tasks with ease."
seo_keywords: ["cyberchef docker", "data decoding tool", "encryption analysis", "cybersecurity tools", "data manipulation web app", "docker cyberchef", "self-hosted data tool", "cyber forensics", "data analysis docker"]
schemaItemType: "WebPage"
---

Cyberchef is a web app for analyzing and decoding data. It provides a wide range of tools for encoding, decoding, encrypting, decrypting, and manipulating data in various formats.

It is designed to be user-friendly and accessible, making it easy for users to perform complex data operations without needing extensive technical knowledge.

## Portainer Stack

![CyberChef Example](../images/cyberchef_example.png)

```yaml
services:
  cyber-chef:
    image: mpepping/cyberchef:latest
    container_name: CyberChef
    ports:
      - "8100:8000"
```
