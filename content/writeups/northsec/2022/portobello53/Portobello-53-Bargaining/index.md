---
title: Portobello-53-Bargaining
description: "DNS exfiltration PCAP analysis."
date: 2022-06-01
tags:
- NorthSec
- DFIR
- PCAP
- CTF
- 2022
- Portobello-53-Bargaining
- Write-Up
- Montreal
- Portobello 53
---

## Packet Analysis

Within your method of looking through the packets (using Wireshark), searching for the word `flag-` brought me directly to the flag.

![Flag found in Wireshark](1.png)

Using the "Follow UDP Stream" feature in Wireshark, you can see the whole flag inline.

![UDP Stream showing flag](2.png)

```txt
Flag-we_have_a_bad_case_of_ophiocordyceps_unilateralis
```

![Additional packet screenshot](3.png)

![Another packet screenshot](4.png)

---

## Part 2 – Version 1

Farther down, the server returns commands:  

- `ls –la`  
- `cat wallet-priv.txt`  

The hex code is returned.

![Hex code screenshot](5.png)

---

## Part 2 – Version 2

Converted to text:

This is my method of finding this.  
Narrowed down to host 23 to collect only these in `tcpdump`. I then cut out most of the before and after excess using:

```bash
tcpdump -nr portobello53.pcapng 'dst fd00:6e73:6563:3232::100 and src fd00:6e73:6563:3232::23' | cut -d " " -f 8- | cut -d "." -f -2 | cut -d "." -f 2- > hex.log
```

**The command does the following:**
- `tcpdump -nr portobello53.pcapng` reads the packet capture file.
- `'dst fd00:6e73:6563:3232::100 and src fd00:6e73:6563:3232::23'` filters packets with the specified destination and source IP addresses.
- `cut -d " " -f 8-` extracts the relevant fields from the packet data.
- `cut -d "." -f -2` removes the domain suffix.
- `cut -d "." -f 2-` removes the first part of the domain, leaving only the hex code.
- `> hex.log` saves the output to a file named `hex.log`.

I used **CyberChef**, but after the excess is removed you can just type in Linux:

```bash
cat hex.log | xxd -r -p
```

- This will convert the hex code back to text.
- You can also use CyberChef to convert the hex code to text.

![CyberChef output](6.png)

---

Last flag is:

```txt
flag-bargaining_{md5 hash of the string CVE-xxx-yyyy}
```

---

## Second Version

![Second version screenshot](7.png)
