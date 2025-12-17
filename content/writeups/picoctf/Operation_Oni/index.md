---
title: "Operation Oni"
description: "picoCTF Writeup for the Operation Oni challenge involving disk image analysis and SSH key extraction."
keywords: ["picoCTF", "Operation Oni", "Disk Image", "SSH Keys", "Forensics", "Remote Access", "picoCTF Writeup", "Flag Retrieval"]
author: JonesCKevin
date: 2024-01-01
lastmod: 2024-01-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Disk Image", "SSH"]
type: writeups
categories: ["Writeups"]
seo_title: "Operation Oni - picoCTF Disk Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

Download this disk image, find the key and log into the remote machine.
Note: if you are using the webshell, download and extract the disk image into /tmp not your home directory.

<https://artifacts.picoctf.net/c/71/disk.img.gz>

```bash
ssh -i key_file -p 59323 ctf-player@saturn.picoctf.net
```

## Flag

`picoCTF{}`
