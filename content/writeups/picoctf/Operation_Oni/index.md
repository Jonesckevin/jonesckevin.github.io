---
title: Operation Oni
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - Disk Image
  - Flag
  - SSH
  - Key
  - Remote Access
  - Disk Analysis
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
