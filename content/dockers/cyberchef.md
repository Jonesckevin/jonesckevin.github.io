---
title: CyberChef
description: A web app for analyzing and decoding data.
tags: [cyberchef, web app, data analysis, decoding, encoding,
  encryption, decryption, data manipulation]
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
