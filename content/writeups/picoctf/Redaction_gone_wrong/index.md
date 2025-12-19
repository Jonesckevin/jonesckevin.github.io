---
title: "Redaction gone wrong"
description: "picoCTF Writeup for the Redaction gone wrong challenge involving PDF analysis and improper redaction techniques."
keywords: ["picoCTF", "Redaction gone wrong", "PDF Analysis", "Document Forensics", "Improper Redaction", "picoCTF Writeup", "Flag Retrieval"]
date: 2024-01-01
lastmod: 2024-01-01
draft: false
tags: ["picoCTF", "Writeups", "Forensics", "PDF", "Redaction"]
type: writeups
categories: ["Writeups"]
seo_title: "Redaction gone wrong - picoCTF PDF Forensics Writeup"
schema_type: "TechArticle"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
---

## Description

Now you DON’T see me.
This report has some critical data in it, some of which have been redacted correctly, while some were not. Can you find an important key that was not redacted properly?

<https://artifacts.picoctf.net/c/84/Financial_Report_for_ABC_Labs.pdf>

## Info

1. Copy the data from the PDF:

```txt
1
Financial Report for ABC Labs, Kigali, Rwanda for the year 2021.  
Breakdown - Just painted over in MS word.  
Cost Benefit Analysis 
Credit Debit 
This is not the flag, keep looking 
Expenses from the       
picoCTF{C4n_Y0u_S33_m3_fully} 
Redacted document.
```

## Flag

`picoCTF{C4n_Y0u_S33_m3_fully}`
