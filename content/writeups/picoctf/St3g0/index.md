---
title: St3g0
description: "Download this image and find the flag."
date: 2023-10-01
tags: ["picoctf", "stegano", "steganography", "zsteg"]
---

## Description

Download this image and find the flag.

<https://artifacts.picoctf.net/c/216/pico.flag.png>

## Info

- Zsteg from

```bash
###########################
########## zsteg ##########
###########################

Watch out for red output. This tool shows lots of false positives...
b1,rgb,lsb,xy       .. text: "picoCTF{7h3r3_15_n0_5p00n_a1062667}$t3g0"
b1,abgr,lsb,xy      .. text: "E2A5q4E%uSA"
b2,b,lsb,xy         .. text: "AAPAAQTAAA"
b2,b,msb,xy         .. text: "HWUUUUUU"

```

## Flag

`picoCTF{7h3r3_15_n0_5p00n_a1062667}`
