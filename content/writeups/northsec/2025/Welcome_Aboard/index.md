---
layout: post
title: "Welcome Aboard"
subtitle: "NorthSec 2025"
author: JonesCKevin
date: 2025-05-24
tags:
- NorthSec
- CTF
- 2025
- PCAP
- Write-Up
- Montreal
---

>I have assigned a cabin to you. This is your base of operations. It’s not the biggest cabin, but you should make yourself at home, but not too much. Walk around the ship, be observant, and look everywhere for clues. Flag and report any oddity ASAP. Got it?

> A maritime signal flag welcoming us aboard? Decoration, or our presence was detected? We will be on the lookout.
>
>Trivial flag

## Part 1

![image](1.png)

![image](2.png)

![image](3.png)

---

## Part 2

This image was forced to be larger and is a very small image rendered from html.

```html
<img src="data:image/gif;base64,R0lGODlhFQAVAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAVABUAAAJPhA9xqrgB2WOxtZQuvnZtuHmYQT3jWFFpFjmepE0rmFaomOUa9+6tzaKFXqwJzlIagoKzHSmGKz5VwqWS1FuFJFjeCUZ0/Gg2MiLpopohBQA7" alt="Base64 GIF" class="custom-img" />
```

Mod'ed to 

```html
<img src=. alt="Base64 GIF" style="width:100px;height:100px;border-radius:0;" />
```

<img src="data:image/gif;base64,R0lGODlhFQAVAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAVABUAAAJPhA9xqrgB2WOxtZQuvnZtuHmYQT3jWFFpFjmepE0rmFaomOUa9+6tzaKFXqwJzlIagoKzHSmGKz5VwqWS1FuFJFjeCUZ0/Gg2MiLpopohBQA7" alt="Base64 GIF" style="width:100px;height:100px;border-radius:0;" />

![image](4.png)

>It looks like the cabin was bugged. Good thing you were curious.
>
>At the end of the CTF, one of you can keep the wooden cabin number! Please keep it in place for the duration of the CTF though.
>
>Trivia flag
