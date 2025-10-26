---
title: "TheHive - Security Incident Response Platform"
description: "TheHive is a scalable, open-source SIRP (Security Incident Response Platform) for SOC teams. Manage security incidents, collaborate on investigations, and integrate with MISP and Cortex."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "Artifacts"]
tags: ["thehive", "security incident response", "sirp", "soc", "open source", "web app", "cybersecurity", "incident management", "collaboration", "threat intelligence", "misp", "cortex", "forensics"]
keywords: ["thehive docker", "incident response platform", "soc platform", "security orchestration", "thehive sirp"]
slug: "thehive-incident-response"
draft: false
---

**Ref:** [Strangebee - Installation](https://docs.strangebee.com/cortex/installation-and-configuration/step-by-step-guide/#java-virtual-machine)

TheHive is a scalable, open-source Security Incident Response Platform (SIRP) designed to assist security teams in managing and responding to incidents effectively. It provides a web-based interface for incident management, collaboration, and integration with various security tools, making it suitable for organizations of all sizes.

## Portainer Stack

![TheHive Example](../images/thehive_example.png)

```yaml
services:
  hal-thehive:
    image: thehiveproject/thehive4:4.1
    container_name: Thehive4
    restart: unless-stopped
    ports:
      - "8700:9000"
    volumes:
      - ./thehive/config/thehive/application.conf:/etc/thehive/application.conf
      - ./thehive/volumes/thehive/db:/opt/thp/thehive/db
      - ./thehive/volumes/thehive/index:/opt/thp/thehive/index
      - ./thehive/volumes/thehive/data:/opt/thp/thehive/data
    environment:
      - MAX_HEAP_SIZE=2G
      - HEAP_NEWSIZE=2G
    networks:
      - thehive
networks:
  thehive: 
  
volumes:
  thehive_db:
  thehive_index:
  thehive_data:
```