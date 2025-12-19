---
title: Warmups
description: "Collection of warm-up challenges for beginners."
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

---

**Spoiler Command:**

```bash
tshark -r mypcap.pcap -Tfields -e data \
    | cut -c -2 \
    | sed ':a;N;$!ba;s/\n/ /g' \
    | sed 's/ //g' \
    | xxd -r -p
```

1. `tshark -r mypcap.pcap -Tfields -e data` uses tshark to read the pcap file and output only the packet data field in hexadecimal.
2. `cut -c -2` takes only the first two characters of each line, which is typically the first byte of each packet's data.
3. `sed ':a;N;$!ba;s/\n/ /g'` joins all lines into a single line, separating them with spaces.
   - `:a` creates a label for the loop.
   - `N` appends the next line to the pattern space.
   - `$!ba` branches back to the label `a` until the end of the file.
   - `s/\n/ /g` replaces all newline characters with spaces.
4. `sed 's/ //g'` removes all spaces, resulting in a continuous hex string.
5. `xxd -r -p` converts the hex string back into its original binary form.
   - `r` means reverse operation (from hex to binary).
   - `-p` means plain hexdump style (no whitespace).

<details>
<summary>Click to reveal the final flag</summary>

```flag
FLAG-GoodJobReadingTheNetwork
```

</details>

---
---

[Download main64.exe](main64-the-password-is-northsec.zip)

Use `strings | grep FLAG` on the binary at the beginning to get the flag.

<details>
<summary>Click to reveal the final flag</summary>

```flag
FLAG-GoodJobOnRebOnReadingBins!
```

</details>

---

**Remove the duplicate part ("JobOnReading") to get the correct flag.**

<details>
<summary>Click to reveal the final flag</summary>

```flag
FLAG-GoodJobOnReadingBins!
```
</details>
