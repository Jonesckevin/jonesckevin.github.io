---
title: TOSIOS
description: A self-hosted, open-source web game that support multiple players
tags: [TOSIOS, web game, multiplayer, self-hosted, open-source, strategy game]
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
