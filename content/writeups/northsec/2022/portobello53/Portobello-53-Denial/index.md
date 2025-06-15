---
title: Portobello 53 - Denial (2 of 2)
author: JonesCKevin
date: 2022-06-01
tags:
- NorthSec
- DFIR
- PCAP
- CTF
- 2022
- Portobello-53-Denial
- Write-Up
- Montreal
- Portobello 53
---

## Context

> Why do you need DNS logs anyway?  
> We both know that DNS servers are just address books of Internet resources and I’ve never seen anyone abuse a plain old address book.  
> The appliance would have blocked anything malicious anyway.  
> I bet you don’t even have a certification to understand the protocol anyway.

**Here’s a link to download the PCAP 5.**  
Don’t waste your time on the network capture, I skimmed through it and found that your test device `fd00:6e73:6563:3232::beef` did nothing suspicious.

---

## Part 1

### Step 1

```bash
tcpdump -r portobello53.pcapng 'src fd00:6e73:6563:3232::beef'
```

This is based on the hunt from the context. This will show all the DNS packets from this IPv6.

![DNS Packet Example](1.png)

You can see at the DNS sub-domain there are single letters. In the example in the photo, you can spell the word "space".  
So let's remove all the excess by filtering only those represented by `60` at the end.  
I did this by exporting this tcpdump and opening it in Wireshark, filtering down to only size 122.

You could use a Wireshark filter to only show `beef` source IP and packets within the 122-byte range:

```sql
(ipv6.src == fd00:6e73:6563:3232::beef) && !(frame.len <= 120) && !(frame.len >= 123)
```

![Wireshark Filtered](2.png)

### Step 3

```bash
tcpdump -r ~/Desktop/beef2.pcap | cut -d " " -f 8- | rev | cut -d "." -f 4-
```

This cuts out the extra characters on both sides of the snippet and will line them up.  
You can dump this into a file for text manipulation.

![Text Extraction Step 1](3.png)  
![Text Extraction Step 2](4.png)

---

## Part 2

### Based on someone else's write-up

This one is similar to above with added filters.

```bash
tshark -r portobello53.pcapng -Y "ipv6.dst == fd00:6e73:6563:3232::beef" | grep pinky | grep -v "No such" | awk '{print $13}' | cut -d. -f1 | tr -d '\n'
```

```txt
flagdashdnsdashserverhidinginternetnoise
flag-dns-serverhidinginternetnoise
```

---

## Flag Submission

**Portobello 53 - Denial (2/2)**  
Ouch - A two-way covert communication channel. Watch the client proceed to the next stage of grief (2/2)

---

## Forum Message

> A server answering correctly to your arbitrary DNS queries. That’s not the kind of thing that would take the Mycoverse down.
