---
title: "Backdoors & Breaches"
date: 2025-06-02
draft: false
images: [https://raw.githubusercontent.com/BackdoorsAndBreaches/BackdoorsAndBreaches/master/images/logo.png]
tags:
  - dockers
  - backdoors
  - breaches
  - docker-compose
  - yml
  - game
  - cards
  - incident response
  - cybersecurity
  - training
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

