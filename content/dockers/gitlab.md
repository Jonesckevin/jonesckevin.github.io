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

## Post Setup Instructions

While the docker is up and running, you can access GitLab at `http://localhost:8500`.

Because Gitlab requires an admin user to authorize new accounts, you will need to set up the initial root & password by running the following docker command:

```bash
docker exec -it GitLab gitlab-rake "gitlab:password:reset[root]"
```

This will prompt you to enter a new password for the root user.

---

Once Logged in you should be able to go to user settings and allow your new account:

- <http://10.1.3.160:8520/admin/users>