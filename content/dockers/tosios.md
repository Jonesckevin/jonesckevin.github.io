---
title: "TOSIOS - Multiplayer Web Game"
description: "TOSIOS (The Open-Source IO Game) is a real-time multiplayer game built with Node.js and Phaser. Self-hosted browser-based action game with customizable gameplay."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker", "AI Tools"]
tags: ["tosios", "web game", "multiplayer", "browser game", "self-hosted", "open-source", "io game", "real-time", "nodejs", "phaser", "action game", "gaming"]
keywords: ["tosios docker", "multiplayer web game", "io game", "self-hosted game", "browser multiplayer"]
slug: "tosios"
draft: false
---

**Ref:** [TOSIOS](https://github.com/halftheopposite/TOSIOS)

![TOSIOS Logo](https://github.com/halftheopposite/TOSIOS/blob/master/images/title.png?raw=true)

TOSIOS is a self-hosted, open-source web game that supports multiple players. It is designed to be played in a web browser and offers a unique gaming experience with strategic elements. Players can join games, compete against each other, and enjoy the game without the need for any installations.

## Portainer Stack

![TOSIOS Example](../images/tosios_example.png)

```yaml
services:	
  tosios:	
    image: halftheopposite/tosios	
    container_name: tosios	
    restart: always	
    ports:	
      - 3001:3001
```
