---
title: BookStack
date: 2024-01-01
draft: false
images: [https://www.bookstackapp.com/wp-content/uploads/2020/03/bookstack-logo.png]
tags:
  - dockers
  - bookstack
  - documentation
  - wiki
  - self-hosted
  - docker-compose
  - yml
  - productivity
  - collaboration
  - knowledge-base
  - open-source
  - documentation-platform
  - wiki-software
  - content-management
  - content-management-system
---

## BookStack Docker Compose

BookStack is an open-source platform for creating documentation and wikis. It allows users to create, manage, and share content in a structured way. Categorizing in:

- Shelves
- Books
- Chapters
- Pages

BookStack is designed to be user-friendly and provides a simple interface for organizing information.

![BookStack Example](../images/bookstack_example.png)

```yaml
services:
    bookstack:
        image: lscr.io/linuxserver/mariadb
        volumes:
            - './bookstack/db-data:/var/lib/postgresql/data'
        environment:
            - MYSQL_DATABASE=bookstackapp
            - MYSQL_USER=bookstack
            - MYSQL_PASSWORD=bookstackpassword
            - TZ=America/Toronto
            - MYSQL_ROOT_PASSWORD=bookstackrootpassword
            - PGID=1000
            - PUID=1000
        restart: 'always'
        hostname: bookstack-db
        container_name: BookStack-DB

    linuxserver:
        image: 'lscr.io/linuxserver/bookstack:latest'
        environment:
            - DB_DATABASE=bookstackapp
            - DB_PASS=bookstackpassword
            - DB_USER=bookstack
            - 'APP_URL=http://bookstacks.4n6post.com'
            - DB_HOST=BookStack-DB
            - DB_PORT=3306
            - PGID=1000
            - PUID=1000
        volumes:
            - './bookstack/public:/var/www/bookstack/public:rw'
            - './bookstack/app_data:/config'
        ports:
            - '1003:80'
        restart: 'always'
        hostname: bookstack
        container_name: BookStack
```
