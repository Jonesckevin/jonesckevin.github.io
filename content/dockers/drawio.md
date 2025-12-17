---
title: "Draw.io"
description: "Draw.io (diagrams.net) is a free, open-source diagramming tool for flowcharts, UML, network diagrams, and more. Self-hosted alternative to Visio and Lucidchart."
date: 2024-01-15
lastmod: 2025-01-18
author: "Kevin Jones"
categories: ["Docker", "AI Tools"]
tags: ["drawio", "diagrams.net", "diagramming", "flowcharts", "uml", "web app", "collaboration", "design", "visualization", "prototyping", "network diagrams", "visio alternative", "open source"]
keywords: ["drawio docker", "diagrams.net", "self-hosted diagramming", "flowchart tool", "visio alternative"]
slug: "drawio"
draft: false
seo_title: "Draw.io - Free Diagram & Flowchart Editor"
seo_description: "Draw.io (diagrams.net) is a free, open-source diagramming tool for flowcharts, UML, network diagrams, and more. Self-hosted alternative to Visio and Lucidchart."
canonical: "/dockers/drawio/"
featured_image: "https://fitsmallbusiness.com/wp-content/uploads/2019/06/draw.io_.png"
---

Draw.io is a web-based diagramming tool that allows users to create flowcharts, UML diagrams, and various other types of visual representations. It is designed for collaboration and can be used for prototyping, design, and visualization tasks.

It provides a user-friendly interface and supports a wide range of diagram types, making it suitable for both technical and non-technical users. It can be integrated into various platforms and is often used in software development, project management, and educational contexts.

## Portainer Stack

![drawio Example](../images/drawio_example.png)

```yaml
services:
    drawio:
        image: 'jgraph/drawio:latest'
        ports:
            - '8080:8080'
        restart: 'always'
        hostname: drawio
        container_name: Draw.io
```
