---
title: GitLab
description: A web-based DevOps lifecycle tool that provides a Git repository manager with features like issue tracking, CI/CD, and more.
tags: [gitlab, devops, git repository, issue tracking, ci/cd, web app, open source, collaboration,
  version control, software development, project management]
---

GitLab is a web-based DevOps lifecycle tool that provides a Git repository manager with features like issue tracking, continuous integration/continuous deployment (CI/CD), and more. It is designed to facilitate collaboration among developers and teams, offering a comprehensive platform for software development, project management, and version control.

## Portainer Stack

![GitLab Example](../images/gitlab_example.png)

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    container_name: GitLab
    hostname: gitlab
    restart: always
    ports:
      - 8500:80
    volumes:
      - ./gitlab/config:/etc/gitlab:rw
      - ./gitlab/logs:/var/log/gitlab:rw
      - ./gitlab/data:/var/opt/gitlab:rw
```

```.env
EXTERNAL_URL=https://gitlab.4n6post.com
```