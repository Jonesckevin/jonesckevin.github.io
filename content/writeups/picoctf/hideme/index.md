---
title: "hideme"
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - Image Analysis
  - Binwalk
  - Foremost
  - Scalpel
  - Flag
  - PNG
  - Zlib
  - Zip
  - Steganography
  - Stego
---

## Description

Every file gets a flag.
The SOC analyst saw one image been sent back and forth between two people. They decided to investigate and found out that there was more than what meets the eye here.

## Info

1. Doing a binwalk we get:

| DECIMAL | HEXADECIMAL | DESCRIPTION                                                                 |
|---------|-------------|-----------------------------------------------------------------------------|
| 0       | 0x0         | PNG image, 512 x 504, 8-bit/color RGBA, non-interlaced                      |
| 41      | 0x29        | Zlib compressed data, compressed                                            |
| 39739   | 0x9B3B      | Zip archive data, at least v1.0 to extract, name: secret/                   |
| 39804   | 0x9B7C      | Zip archive data, at least v2.0 to extract, compressed size: 2876, uncompressed size: 3029, name: secret/flag.png |
| 42915   | 0xA7A3      | End of Zip archive, footer length: 22|

2. So, lets extract the zip with foremost or scalpel.
   1. This gives us: 00000077.zip
   2. which gives us secret/flag.png
   3. Open this photo for an image of the flag.

## Flag

`picoCTF{Hiddinng_An_imag3_within_@n_ima9e_d55982e8}`
