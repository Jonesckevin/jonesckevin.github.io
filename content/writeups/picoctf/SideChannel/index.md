---
title: "SideChannel"
description: "picoCTF Writeup for the SideChannel challenge involving timing side-channel attacks to extract PIN codes."
keywords: ["picoCTF", "SideChannel", "Side Channel Attack", "Timing Attack", "PIN Cracking", "Network Security", "picoCTF Writeup", "Flag Retrieval"]
author: JonesCKevin
date: 2024-01-01T00:00:00+00:00
lastmod: 2024-01-01T00:00:00+00:00
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Side Channel", "Timing Attack"]
type: writeups
categories: ["Writeups"]
seo_title: "SideChannel - picoCTF Side Channel Attack Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

There's something fishy about this PIN-code checker, can you figure out the PIN and get the flag?
Download the PIN checker program here pin_checker
Once you've figured out the PIN (and gotten the checker program to accept it), connect to the master server using nc saturn.picoctf.net 50364 and provide it the PIN to get your flag.

<https://artifacts.picoctf.net/c/72/pin_checker>

```bash
nc saturn.picoctf.net 50364
```

## Info

1. 

## Flag

`picoCTF{}`
