---
title: "Mermaid JS Live Editor - Diagram as Code"
description: "Mermaid JS Live Editor lets you create flowcharts, sequence diagrams, and more using simple markdown-like syntax. Self-hosted live diagram editor with real-time preview."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["mermaid-js", "mermaidjs", "live editor", "diagrams", "visualization", "web app", "open source", "markdown", "flowcharts", "sequence diagrams", "diagram as code", "documentation", "uml"]
keywords: ["mermaid js docker", "diagram editor", "flowchart tool", "mermaid live editor", "diagram as code"]
slug: "mermaid-js-live-editor"
draft: false
---

**Ref:** <https://github.com/mermaid-js/mermaid-live-editor>

Mermaid JS Live Editor is a web-based tool that allows users to create and visualize diagrams using Mermaid syntax. It supports various types of diagrams, including flowcharts, sequence diagrams, class diagrams, and more. The live editor provides an interactive environment where users can write Mermaid code and see the rendered diagram in real-time.
It is particularly useful for developers, technical writers, and anyone who needs to create diagrams quickly and efficiently. The Mermaid syntax is simple and intuitive, making it easy to learn and use.

## Portainer Stack

![Mermaid JS Example](../images/mermaid_example.png)

```yaml
services:
    mermaid-js:
        image: ghcr.io/mermaid-js/mermaid-live-editor
        ports:
            - '1105:8080'
        restart: 'always'
        container_name: MermaidJS
```
