---
title: Warmups
author: JonesCKevin
date: 2023-05-21
tags:
- NorthSec
- DFIR
- CTF
- 2023
- Warmups
- Write-Up
- Montreal
- Warmups
---

[Download mypcap.pcap](mypcap.zip)

**Spoiler Command:**

```bash
tshark -r mypcap.pcap -Tfields -e data | cut -c -2 | sed ':a;N;$!ba;s/\n/ /g' | sed 's/ //g' | xxd -r -p
```

**Flag:** `FLAG-GoodJobReadingTheNetwork`

---

[Download main64.exe](main64-the-password-is-northsec.zip)

Use `strings` on the binary at the beginning to get the flag:

- **Flag:** `FLAG-GoodJobOnRebOnReadingBins!`

**Remove the duplicate part ("JobOnReading") to get the correct flag.**

- **Flag:** `FLAG-GoodJobOnReadingBins!`
