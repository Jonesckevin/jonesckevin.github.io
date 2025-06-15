---
title: SideChannel
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - Side Channel Attack
  - PIN Code
  - Network Connection
  - Flag
  - Network Security
  - Network Protocols
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
