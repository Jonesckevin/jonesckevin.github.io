---
title: Who is it
description: "Someone just sent you an email claiming to be Google's co-founder Larry Page but you suspect a scam. Can you help us identify whose mail server the email actually originated from?"
date: 2023-10-01
tags: ["picoctf", "email", "forensics", "ip"]
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

`picoCTF{WilhelmZwalina}`
