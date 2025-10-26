---
title: "Regex101 - Regular Expression Tester"
description: "Regex101 is a powerful online regex tester and debugger with real-time highlighting and explanations. Test and debug regular expressions for multiple programming languages."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker"]
tags: ["regex101", "regex", "regular expressions", "web app", "debugging", "testing", "open source", "productivity", "development", "software engineering", "data validation", "pattern matching", "text processing"]
keywords: ["regex101 docker", "regex tester", "regular expression debugger", "regex tool", "pattern testing"]
slug: "regex101-tester"
draft: false
---

Regex101 is a web-based tool designed for testing and debugging regular expressions. It provides an interactive environment where users can write, test, and visualize the behavior of regex patterns against sample text. This tool is particularly useful for developers, data analysts, and anyone who works with text processing and validation.

## Regex101 Stack

![Regex101 Example](../images/regex101_example.png)

```yaml
services:
  regex101:
    image: loopsun/regex101:latest
    container_name: regex101
    restart: always
    ports:
     - 8400:9090
```