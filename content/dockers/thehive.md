---
title: TheHive
description: TheHive is a scalable, open-source Security Incident Response Platform (SIRP) designed to assist security teams in managing and responding to incidents effectively.
tags: [thehive, security incident response, sirp, open source, web app, cybersecurity, incident management, collaboration, IT tools]
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