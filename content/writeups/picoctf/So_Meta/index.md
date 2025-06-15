---
title: So Meta
description: "Find the flag in this picture."
date: 2023-10-01
tags: ["picoctf", "stego", "steganography", "exiftool"]
---

# So Meta

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
