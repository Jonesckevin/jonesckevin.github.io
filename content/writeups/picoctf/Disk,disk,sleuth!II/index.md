---
title: "Disk, disk, sleuth! II"
description: "picoCTF Writeup for the 'Disk, disk, sleuth! II' challenge involving Alpine Linux disk image analysis and file recovery."
keywords: ["picoCTF", "Disk sleuth II", "Disk Image", "Alpine Linux", "FTK Imager", "Arsenal Image Mounter", "Forensics", "picoCTF Writeup", "Flag Retrieval"]
date: 2024-01-01
lastmod: 2024-01-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Disk Image", "Linux"]
type: writeups
categories: ["Writeups"]
seo_title: "Disk, disk, sleuth! II - picoCTF Disk Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

All we know is the file with the flag is named `down-at-the-bottom.txt`... Disk image: dds2-alpine.flag.img.gz
<https://mercury.picoctf.net/static/b369e0ba3b6ffd2be8164cd3c99c294b/dds2-alpine.flag.img.gz>

## Info

- Linux: gunzip dds2-alpine.flag.img.gz
  - Goes from 28MB to 128MB `dds2-alpine.flag.img`
- Opening in windows shows Disc Corruption

- Load into Arsenal Image Mounter appears to do something, but very little.
  - Disk Signature: 5D8B75FC
  - MBR
  - Fixed Disk
- Loading IMG file into FTK does mount the file properly, and can be seen as a Linux file system, which is why Arsenal was unable to mount.

## Shadow File

`root:$6$UhCTAsfnkEhko/RB$74qD2ZifihLSCOHzw7.45mXtlahVPmJucrQ4runzgQpY/uwuBQfP0AZoAGS8pZG8CTjmdw9ytN.FKqjUUp5xj0:18674:0:::::`

## OS Info

1. `NAME="Alpine Linux"`
2. `ID=alpine`
3. `VERSION_ID=3.9.4`
4. `PRETTY_NAME="Alpine Linux v3.9"`

Going to the root of home folder in linux `/home/root` and running `ls -la` shows the following:
`down-at-the-bottom.txt` which contains the text

## Flag

`picoCTF{f0r3ns1c4t0r_n0v1c3_0ba8d02d}`
  _     _     _     _     _     _     _     _     _     _     _     _     _  
  / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \ 
 ( p ) ( i ) ( c ) ( o ) ( C ) ( T ) ( F ) ( { ) ( f ) ( 0 ) ( r ) ( 3 ) ( n )
  \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/ 
   _     _     _     _     _     _     _     _     _     _     _     _     _  
  / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \ 
 ( s ) ( 1 ) ( c ) ( 4 ) ( t ) ( 0 ) ( r ) ( _ ) ( n ) ( 0 ) ( v ) ( 1 ) ( c )
  \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/ 
   _     _     _     _     _     _     _     _     _     _     _  
  / \   / \   / \   / \   / \   / \   / \   / \   / \   / \   / \ 
 ( 3 ) ( _ ) ( 0 ) ( b ) ( a ) ( 8 ) ( d ) ( 0 ) ( 2 ) ( d ) ( } )
  \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/   \_/ 
