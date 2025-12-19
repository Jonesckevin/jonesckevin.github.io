---
title: "St3g0"
description: "picoCTF Writeup for the St3g0 challenge involving PNG steganography and zsteg analysis to extract hidden flags."
keywords: ["picoCTF", "St3g0", "Steganography", "Zsteg", "PNG Analysis", "LSB Steganography", "picoCTF Writeup", "Flag Retrieval"]
date: 2023-10-01
lastmod: 2023-10-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Steganography", "Zsteg", "PNG"]
type: writeups
categories: ["Writeups"]
seo_title: "St3g0 - picoCTF Steganography Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
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
