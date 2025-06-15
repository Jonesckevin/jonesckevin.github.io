---
title: Shark on wire
date: 2024-01-01T00:00:00+00:00
author: JonesCKevin
tags:
  - PicoCTF
  - Forensics
  - Write-Up
  - PCAP
  - Wireshark
  - Flag
  - Network Analysis
  - UDP
  - TCP
  - Packet Capture
  - Network Forensics
  - Network Traffic
  - Network Protocols
  - Network Security
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
