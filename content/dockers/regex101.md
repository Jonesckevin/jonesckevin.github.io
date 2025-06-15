---
title: Regex101
description: A web-based tool for testing and debugging regular expressions.
tags: [regex101, regex, regular expressions, web app, debugging, testing, open source, productivity,
  development, software engineering, data validation]
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