---
title: Draw.io
description: A web-based diagramming tool for creating flowcharts, UML diagrams, and more.
tags: [draw.io, diagramming, flowcharts, UML, web app, collaboration,
  design, visualization, prototyping]
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
