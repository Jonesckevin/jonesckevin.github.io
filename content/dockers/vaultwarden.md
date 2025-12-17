---
title: "Vaultwarden - Self-Hosted Password Manager"
description: "Vaultwarden is a lightweight, self-hosted password manager and Bitwarden-compatible server. Secure your passwords with end-to-end encryption, 2FA support, and complete data ownership in a Docker container."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["vaultwarden", "password manager", "self-hosted", "security", "web app", "open source", "docker", "productivity", "data security", "encryption", "user management", "bitwarden", "2fa", "authentication"]
keywords: ["vaultwarden docker", "self-hosted password manager", "bitwarden alternative", "secure password storage", "docker password vault"]
slug: "vaultwarden"
draft: false
---

Vaultwarden is a self-hosted password manager that provides a secure and convenient way to store and manage passwords. It is an open-source alternative to Bitwarden, allowing users to maintain control over their data while benefiting from a user-friendly interface and robust security features. Vaultwarden supports various authentication methods, including two-factor authentication, and offers features like password sharing, organization management, and secure note storage. It is designed to be lightweight and efficient, making it suitable for both personal and organizational use.

## Portainer Stack

![Vaultwarden Example](../images/vaultwarden_example.png)

```yaml
services:
  Vaultwarden:
    image: vaultwarden/server:latest
    container_name: Hal-VaultWarden
    environment:
      SIGNUPS_ALLOWED: true
      INVITATIONS_ALLOWED: true
      DISABLE_ADMIN_TOKEN: false
      # apt install argon2 echo -n '$2TnXFVf6qgHxG^a#hj8@tex2HTNRXxpWH#6z!w10' | argon2 "$(openssl rand -base64 32)" -e -id -k 
      # 65540 -t 3 -p 4 Escape Output so that all 5 $ have two. eg. $$argon2id~ vs $argon2id~
      ADMIN_TOKEN: $$argon2id$$v=19$$m=65540,t=3,p=4$$MnBIa1JhMDlRQzN2ZVVWNHY3VHlZQkg5YlBLSnVrbFozbjNOQXVGTnFiaz0$$fT918w+4ozfZvdc+fHGJMl4dF1BV03KTcLFEytepLP8
      WEBSOCKET_ENABLED: false
    ports:
      - 9998:80
      - 9999:443
    volumes:
      - ./Vaultwarden/data:/data/
    restart: unless-stopped
  
volumes:
  Vaultwarden:
```
