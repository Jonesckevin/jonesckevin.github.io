---
title: Mermaid JS Live Editor
description: A web-based live editor for creating and visualizing diagrams using Mermaid syntax.
tags: [mermaid-js, live editor, diagrams, visualization, web app, open source, markdown, flowcharts, sequence diagrams]
---

**Ref:** <https://github.com/mermaid-js/mermaid-live-editor>

Mermaid JS Live Editor is a web-based tool that allows users to create and visualize diagrams using Mermaid syntax. It supports various types of diagrams, including flowcharts, sequence diagrams, class diagrams, and more. The live editor provides an interactive environment where users can write Mermaid code and see the rendered diagram in real-time.
It is particularly useful for developers, technical writers, and anyone who needs to create diagrams quickly and efficiently. The Mermaid syntax is simple and intuitive, making it easy to learn and use.

## Portainer Stack

![Mermaid JS Example](../images/mermaid_js_example.png)

````yaml
services:
    mermaid-js:
        image: ghcr.io/mermaid-js/mermaid-live-editor
        ports:
            - '1105:8080'
        restart: 'always'
        container_name: MermaidJS
```
