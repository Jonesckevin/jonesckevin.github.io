---
title: "So Meta"
description: "picoCTF Writeup for the So Meta challenge involving image metadata analysis using exiftool."
keywords: ["picoCTF", "So Meta", "Exiftool", "Metadata Analysis", "Image Forensics", "Steganography", "picoCTF Writeup", "Flag Retrieval"]
author: JonesCKevin
date: 2023-10-01
lastmod: 2023-10-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Steganography", "Exiftool", "Metadata"]
type: writeups
categories: ["Writeups"]
seo_title: "So Meta - picoCTF Metadata Analysis Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

Find the flag in this picture. https://jupiter.challenges.picoctf.org/static/916b07b4c87062c165ace1d3d31ef655/pico_img.png

## Info

First thing I notice is the file name is: `pico_img.png` which could mean it's a img file.

- Binwalk says it's a PNG

## Stego ToolKit Results

This answer can be found by looking at the properties metadata fields.

1. `exiftool pico_img.png`
2. This will show you the metadata fields.
3. The flag is in the Artist field.

`meta Artist         .. text: "picoCTF{s0_m3ta_d8944929}"`

You can also see this answer using strings or a hex editor.

## Flag

`picoCTF{s0_m3ta_d8944929}`
