---
title: VSCode Server
description: A web-based version of Visual Studio Code for remote development.
tags: [vscode, code-server, web app, development, remote development, productivity, open source, IDE, programming]
---

VSCode Server is a web-based version of Visual Studio Code that allows developers to work remotely on their projects using a web browser. It provides a full-featured development environment with support for extensions, debugging, and collaboration, making it an ideal tool for remote development workflows.

## Portainer Stack

![VSCode Server Example](../images/vscode_example.png)

Default Password here: `thepassword`

```yaml
services:
  vscode:
    command: "code-server --install-extension esbenp.prettier-vscode ms-python.debugpy redhat.vscode-yaml redhat.vscode-xml gitlab.gitlab-workflow vscode-icons-team.vscode-icons yzhang.markdown-all-in-one mechatroner.rainbow-csv oderwat.indent-rainbow shd101wyy.markdown-preview-enhanced grapecity.gc-excelviewer bierner.markdown-mermaid bpruitt-goddard.mermaid-markdown-syntax-highlighting"
    image: "lscr.io/linuxserver/code-server:latest"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - PASSWORD=thepassword
      - HASHED_PASSWORD=
      - SUDO_PASSWORD=thepassword
      - SUDO_PASSWORD_HASH=
      - DEFAULT_WORKSPACE=/config/workspace
    volumes:
      - "./vscode:/config"
    ports:
      - "8443:8443"
    restart: "always"
    hostname: vscode
    container_name: VSCode
```
