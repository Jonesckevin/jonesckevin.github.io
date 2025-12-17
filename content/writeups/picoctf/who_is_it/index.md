---
title: "Who is it"
description: "picoCTF Writeup for the 'Who is it' challenge involving email header analysis, IP tracking, and WHOIS investigation to identify email origin."
keywords: ["picoCTF", "Who is it", "Email Forensics", "Email Headers", "IP Analysis", "WHOIS", "picoCTF Writeup", "Flag Retrieval"]
author: JonesCKevin
date: 2023-10-01
lastmod: 2023-10-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "Email", "IP Analysis"]
type: writeups
categories: ["Writeups"]
seo_title: "Who is it - picoCTF Email Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

Someone just sent you an email claiming to be Google's co-founder Larry Page but you suspect a scam.
Can you help us identify whose mail server the email actually originated from?
Download the email file here. Flag: picoCTF{FirstnameLastname}
<https://artifacts.picoctf.net/c/499/email-export.>

## Info

1. EML File wants to know who the user likely is.

2. PST Walk EML Viewer, we can quickly look at the header and eventually come down to an IP since the email is coming from `lpage@onionmail.org`;
3. but also has the IP of `173.249.33.206`
4. Looking up this IP on <https://www.ipvoid.com/whois/> and scrolling down to the name we get the name of: `Wilhelm Zwalina`

## Flag

<details>
<summary>Click to reveal the final flag</summary>

```flag
picoCTF{WilhelmZwalina}
```
</details>
