---
title: "Live-Translate"
description: "Live-Translate is a real-time translation tool that allows users to translate text and speech using direct or LLM translation methods using LibreTranslate. It supports multiple languages and can be deployed using Docker for easy setup for multi user available use and pure offline only operation."
date: 2026-09-20
lastmod: 2026-09-20
categories: ["Docker", "Training"]
tags: ["live-translate", "real-time translation", "text translation", "speech translation", "libretranslate", "multilingual", "docker deployment"]
keywords: ["live-translate docker", "real-time translation docker", "multilingual translation docker"]
slug: "live-translate"
draft: false
images: ["https://live-translate.com/images/live-translate-logo.png"]
seo_title: "Live-Translate - Real-Time Translation in Docker"
seo_description: "Deploy Live-Translate, a real-time translation tool, using Docker. Translate text and speech across multiple languages with ease."
seo_keywords: ["live-translate docker", "real-time translation docker", "multilingual translation docker"]
schemaItemType: "WebPage"
#featured_image: ""
---

Live-Translate is a real-time translation tool that allows users to translate text and speech using direct or LLM translation methods using LibreTranslate. It supports multiple languages and can be deployed using Docker for easy setup for multi user available use and pure offline only operation.

## Portainer Stack

**Ref:** <https://github.com/Jonesckevin/live-translate>

![Live-Translate Example](../images/live-translate_example.png)

## Bash Docker Run
```bash
# Live-Translate
# https://github.com/Jonesckevin/live-translate

docker run --name live-translate --restart unless-stopped -p 9015:5000 -v ./data:/data \
	-e ALLOW_AUTH=true \
	-e REQUIRE_AUTH=true \
	-e SOCKETIO_CORS_CREDENTIALS=true \
	-e ALLOW_USER_REGISTRATION=true \
	-e ALLOW_GUEST_LOGIN=true \
	-e WHISPER_ENABLED=true \
	-e WHISPER_MODEL=tiny \
	-e ENABLE_SERVER_ANALYTICS=false \
	-e SECRET_KEY='$(openssl rand -hex 32)' \
	-e SECRETS='$(openssl rand -hex 32)' \
	-e REQUIRE_SECRETS=true \
	-e LOGS_ACCESS_TOKEN= \
	-e ALLOW_CLIENT_API_KEYS=true \
    jonesckevin/live-translate:latest
```

## Docker Compose
```yaml
services:
  live-translate:
    image: jonesckevin/live-translate:latest
    container_name: live-translate
    ports:
      - "9015:5000"
    volumes:
      - "./data:/data"
    environment:
      ALLOW_AUTH: "true"
      REQUIRE_AUTH: "true"
      SOCKETIO_CORS_CREDENTIALS: "true"
      ALLOW_USER_REGISTRATION: "true"
      ALLOW_GUEST_LOGIN: "true"
      WHISPER_ENABLED: "true"
      WHISPER_MODEL: "tiny"
      ENABLE_SERVER_ANALYTICS: "false"
      SECRET_KEY: "$(openssl rand -hex 32)"
      SECRETS: "$(openssl rand -hex 32)"
      REQUIRE_SECRETS: "true"
      LOGS_ACCESS_TOKEN: ""
      ALLOW_CLIENT_API_KEYS: "true"
    restart: unless-stopped
```

## For a simplistic view

```bash
git clone https://github.com/jonesckevin/live-translate.git
cd live-translate
docker build -t live-translate:latest .

# Then run with your local image
docker run -d \
  --name live-translate \
  -p 9015:5000 \
  -v $(pwd)/data:/data \
  -e REQUIRE_AUTH=false \
  -e OFFLINE_MODE=auto \
  live-translate:latest
```