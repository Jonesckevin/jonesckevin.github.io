---
title: "Mattermost"
description: "Mattermost is an open-source Slack alternative for secure team messaging, collaboration, and workflow automation. Self-hosted chat platform with full data control and enterprise features."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["mattermost", "collaboration", "team communication", "project management", "self-hosted", "open source", "web app", "docker", "messaging", "chat", "productivity", "team collaboration", "slack alternative", "secure messaging"]
keywords: ["mattermost docker", "self-hosted slack", "team chat platform", "secure collaboration", "mattermost compose"]
slug: "mattermost-team-chat"
draft: false
seo_title: "Mattermost - Self-Hosted Team Collaboration Platform"
seo_description: "Mattermost is an open-source Slack alternative for secure team messaging, collaboration, and workflow automation. Self-hosted chat platform with full data control and enterprise features."
canonical: "/dockers/mattermost/"
featured_image: "https://mattermost.com/wp-content/themes/mattermost-2021/frontend/dist/img/mattermost-logo-horizontal.svg"
---

MatterMost is an open-source, self-hosted collaboration platform designed for team communication and project management. It provides a web-based interface for messaging, file sharing, and project tracking, making it suitable for teams of all sizes. MatterMost supports real-time chat, threaded conversations, and integrations with various tools, enhancing productivity and collaboration within teams.

## Portainer Stack

**Ref:** <https://mattermost.com/>

Example Playbook - https://github.com/it33/playbook-templates/blob/main/cyber-crisis-response.json

![MatterMost Example](../images/mattermost_example.png)

```yaml
services:
  mattermost:
      image: "mattermost/mattermost-enterprise-edition:9.5" # https://hub.com/r/mattermost/mattermost-enterprise-edition/tags
      restart: "unless-stopped"
      container_name: mattermost
      depends_on:
        - "mattermost_db"
      ports:
        - "8065:8065"
      environment:
        MM_SQLSETTINGS_DRIVERNAME: "postgres"
        MM_SQLSETTINGS_DATASOURCE: "postgres://${MM_POSTGRES_USER}:${MM_POSTGRES_PASSWORD}@mattermost_db/${MM_POSTGRES_DB}?sslmode=disable&connect_timeout=10"
        MM_SERVICESETTINGS_LISTENADDRESS: ":8065"
        MM_SERVICESETTINGS_SITEURL: "http://10.1.1.2:8065" # Or https://MM.domain.com
        MM_SERVICESETTINGS_ENABLEBOTACCOUNTCREATION: "true"
        MM_SERVICESETTINGS_ENABLEUSERACCESSTOKENS: "true"
        MM_SERVICESETTINGS_ENABLEOAUTHSERVICEPROVIDER: "true"
        MM_SERVICESETTINGS_ENABLEDEVELOPER: "true"
        MM_SERVICESETTINGS_ENABLETESTING: "true"
        MM_PLUGINSETTINGS_AUTOMATICPREPACKAGEDPLUGINS: "true"
        MM_EXPERIMENTALSETTINGS_ENABLEAPPBAR: "true"
        MM_PLUGINSETTINGS_ENABLEUPLOADS: "true"
        MM_LOGSETTINGS_CONSOLELEVEL: "DEBUG"
        MM_LOGSETTINGS_FILELEVEL: "DEBUG"
        MM_FILESETTINGS_MAXFILESIZE: 123524266
        MM_FEATUREFLAGS_AppsEnabled: "true"
        MM_FEATUREFLAGS_PluginApps: "1.1.0" # https://github.com/mattermost/mattermost-plugin-apps/releases
        MM_SERVICESETTINGS_ENABLELOCALMODE: "true"
        MM_SERVICESETTINGS_ALLOWEDUNTRUSTEDINTERNALCONNECTIONS: ""
  
  mattermost_db:
      image: "postgres"
      container_name: mattermost_db
      restart: "unless-stopped"
      environment:
        POSTGRES_PASSWORD: "${MM_POSTGRES_PASSWORD}"
        POSTGRES_USER: "${MM_POSTGRES_USER}"
        POSTGRES_DB: "${MM_POSTGRES_DB}"
```

```.env
MM_POSTGRES_USER=postmm
MM_POSTGRES_PASSWORD=postmm
MM_POSTGRES_DB=postmm
MM_USER_EMAIL=
MM_USER_PASSWORD=postmm
```