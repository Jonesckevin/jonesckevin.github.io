---
title: "Backdoors & Breaches"
description: "Backdoors & Breaches is an engaging tabletop card game for cybersecurity training and incident response practice. Digital version for teaching security concepts through gameplay."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker", "Training"]
tags: ["backdoors and breaches", "cybersecurity game", "card game", "incident response", "security training", "docker-compose", "educational", "infosec", "tabletop game", "cyber training", "gamification"]
keywords: ["backdoors and breaches docker", "cybersecurity card game", "incident response training", "security game", "infosec training"]
slug: "backdoors"
draft: false
images: ["https://raw.githubusercontent.com/BackdoorsAndBreaches/BackdoorsAndBreaches/master/images/logo.png"]
seo_title: "Backdoors & Breaches - Cybersecurity Card Game in Docker"
seo_description: "Set up Backdoors & Breaches, a cybersecurity card game for incident response training, using Docker. Engage in hands-on security learning through gameplay."
seo_keywords: ["backdoors and breaches docker", "cybersecurity card game", "incident response training", "security game", "infosec training", "docker security game", "cybersecurity training game"]
schemaItemType: "WebPage"
featured_image: "https://www.blackhillsinfosec.com/wp-content/uploads/2020/12/Resized-BB.png"
---

## Portainer Stack

**Ref:** <https://github.com/p3hndrx/B-B-Shuffle>

![Backdoor & Breaches Example](../images/b-bshuffle_example.png)

```yaml
# Backdoors and Breaches
# https://github.com/p3hndrx/B-B-Shuffle

services:
  shuffle:
    image: jonesckevin/b-b-shuffle:latest
    container_name: B-B-Shuffle
    ports:
      - "9500:80"
```

