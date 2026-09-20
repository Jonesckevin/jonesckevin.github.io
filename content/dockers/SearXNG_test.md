---
title: "SearXNG - Privacy-Respecting Metasearch Engine"
description: "SearXNG is a free, self-hosted metasearch engine aggregating results from 70+ search engines while respecting your privacy. No tracking, no ads, complete search freedom."
date: 2024-01-15
lastmod: 2025-01-18
categories: ["Docker"]
tags: ["searxng", "metasearch engine", "privacy", "search engine", "docker", "python", "web app", "self-hosted", "no tracking", "open source", "google alternative"]
keywords: ["searxng docker", "private search engine", "metasearch", "self-hosted search", "privacy search"]
slug: "searxng"
draft: false
image: "searxng/searxng:latest"
featured_image: "/images/danger-sign.svg"
---

**Ref:** <https://docs.searxng.org/admin/installation-searxng.html>

```dockerfile
FROM python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-babel \
    uwsgi uwsgi-plugin-python3 \
    git build-essential libxslt-dev zlib1g-dev libffi-dev libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create searxng user and directories
RUN useradd --system --shell /bin/bash --home-dir /usr/local/searxng --comment 'Privacy-respecting metasearch engine' searxng \
    && mkdir -p /usr/local/searxng \
    && chown -R searxng:searxng /usr/local/searxng

USER searxng
WORKDIR /usr/local/searxng

# Clone SearXNG source
RUN git clone https://github.com/searxng/searxng /usr/local/searxng/searxng-src

# Set up virtualenv and install SearXNG
RUN python3 -m venv /usr/local/searxng/searx-pyenv \
    && . /usr/local/searxng/searx-pyenv/bin/activate \
    && pip install -U pip setuptools wheel pyyaml \
    && cd /usr/local/searxng/searxng-src \
    && pip install --use-pep517 --no-build-isolation -e .

# Copy settings file
COPY --chown=searxng:searxng settings.yml /etc/searxng/settings.yml

ENV SEARXNG_SETTINGS_PATH=/etc/searxng/settings.yml

EXPOSE 8888

# Entrypoint
CMD ["/usr/local/searxng/searx-pyenv/bin/python", "/usr/local/searxng/searxng-src/searx/webapp.py"]

```


```bash
#! /usr/bin/env bash

# Autocomplete Options: duckduckgo, bing, google, startpage, qwant, searxng
SEARXNG_AUTOCOMPLETE="duckduckgo"
SEARXNG_BASE_URL="http://example.com/location"
SEARXNG_SECRET="ultrasecretkey"

sudo -H apt-get install -y \
    python3-dev python3-babel python3-venv \
    uwsgi uwsgi-plugin-python3 \
    git build-essential libxslt-dev zlib1g-dev libffi-dev libssl-dev

sudo -H useradd --shell /bin/bash --system \
    --home-dir "/usr/local/searxng" \
    --comment 'Privacy-respecting metasearch engine' \
    searxng

sudo -H mkdir "/usr/local/searxng"
sudo -H chown -R "searxng:searxng" "/usr/local/searxng"

sudo -H -u searxng -i
git clone "https://github.com/searxng/searxng" \
    "/usr/local/searxng/searxng-src"

python3 -m venv "/usr/local/searxng/searx-pyenv"
echo ". /usr/local/searxng/searx-pyenv/bin/activate" \
    >>  "/usr/local/searxng/.profile"

sudo -H -u searxng -i

command -v python && python --version
searxng/searx-pyenv/bin/python

# update pip's boilerplate ..
pip install -U pip
pip install -U setuptools
pip install -U wheel
pip install -U pyyaml

# jump to SearXNG's working tree and install SearXNG into virtualenv
cd "/usr/local/searxng/searxng-src"
pip install --use-pep517 --no-build-isolation -e .

sudo tee /etc/searxng/settings.yml > /dev/null <<'EOF'
# SearXNG settings

use_default_settings: true

general:
    debug: false
    instance_name: "${SEARXNG_INSTANCE_NAME:-SearXNG}"

search:
    safe_search: 2
    autocomplete: '${SEARXNG_AUTOCOMPLETE:-duckduckgo}'
    formats:
        - html

server:
    secret_key: "${SEARXNG_SECRET:-ultrasecretkey}"
    limiter: false
    image_proxy: true

redis:
    # URL to connect redis database. Is overwritten by ${SEARXNG_REDIS_URL}.
    url: unix:///usr/local/searxng-redis/run/redis.sock?db=0

ui:
    static_use_hash: true
EOF

sudo -H -u searxng -i
cd /usr/local/searxng/searxng-src
export SEARXNG_SETTINGS_PATH="/etc/searxng/settings.yml"
python searx/webapp.py

# open http://127.0.0.1:8888
```