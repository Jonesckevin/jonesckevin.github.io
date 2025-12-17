---
title: "Shark on wire 1"
description: "picoCTF Writeup for the Shark on wire 1 challenge involving PCAP network traffic analysis and Wireshark investigation."
keywords: ["picoCTF", "Shark on wire 1", "PCAP Analysis", "Wireshark", "Network Forensics", "Packet Capture", "UDP Stream", "TCP Analysis", "picoCTF Writeup", "Flag Retrieval"]
author: JonesCKevin
date: 2024-01-01
lastmod: 2024-01-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "PCAP", "Wireshark", "Network Analysis", "Network Forensics"]
type: writeups
categories: ["Writeups"]
seo_title: "Shark on wire 1 - picoCTF Network Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

We found this packet capture. Recover the flag.

<https://jupiter.challenges.picoctf.org/static/483e50268fe7e015c49caf51a69063d0/capture.pcap>

## Info

1. Doing a quick Cursery search on the PCAP in wireshark, I did a search on `data` and jsut quickly looked for anything that jumps out.
2. Alot of data and found `picoCTF{N0t_a_fLag}` but this is accurate and doesn't work.
3. How ever if you jump to UDP Stream 6 you get the right one.
   1. picoCTF{StaT31355_636f6e6e}  

## Flag

`picoCTF{StaT31355_636f6e6e}`

It does tell me this is not a flag, and it's correct. Dont use this.
picoCTF{N0t_a_fLag}
