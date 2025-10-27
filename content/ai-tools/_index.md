---
# Page Configuration
title: "AI Tools Hub"
description: "Discover powerful AI-driven tools for productivity, content creation, resumes, and professional dev. Free online AI tools to enhance workflow."
type: "ai-tools"
layout: "section-list"
draft: false

# Content Organization
tags: ["AI Tools", "Productivity", "Content Creation", "Workflow Automation"]
categories: ["AI Tools"]
keywords: ["AI tools", "artificial intelligence", "productivity tools", "AI-powered applications", "resume builder", "content generator", "document summarizer", "free AI tools", "professional tools", "workflow automation"]

# SEO Configuration
seo_title: "AI Tools Hub - Free Professional AI-Powered Tools & Applications"
seo_description: "Explore powerful AI-driven tools for productivity, content creation, resume building, and professional development. Free online AI tools to enhance your workflow."
seo_keywords: ["AI tools", "artificial intelligence", "productivity tools", "AI-powered applications", "resume builder", "content generator", "document summarizer", "free AI tools", "professional tools", "workflow automation"]
canonical: "/ai-tools/"

# Theme Configuration
customCSS: "/assets/css/theme-ai-tools.css"

# Search Configuration
searchPlaceholder: "Search AI Tools..."
searchResultLabel: "tool"
searchNoResultsTitle: "AI Tools"
disableSearch: false

# Display Configuration
hideThumbnails: false
thumbnailOnlyView: false
hideDescriptions: false
showAllDescendants: true

# Schema Configuration
schemaType: true
schemaName: "AI Tools Collection"
schemaDescription: "Professional AI-powered tools for productivity and workflow enhancement"
schemaItemType: "SoftwareApplication"
schemaCategory: "Productivity"
defaultAuthor: "JonesCKevin"

# Info Section Configuration
showInfoSection: true
infoSectionTitle: "Security & Privacy"
infoItems:
  - title: "Your API Key"
    description: "Your API key (OpenAI, DeepSeek, Anthropic, Gemini, Grok) or custom AI server (Ollama, LM Studio) is used only for the current session and is never stored."
  - title: "Data Privacy"
    description: "All uploaded documents and generated content are processed securely and not retained after your session."
  - title: "Multi-Provider Support"
    description: "Switch between cloud AI providers or use your own locally-hosted AI server (Ollama, LM Studio) seamlessly while maintaining the same security standards."
  - title: "Rich Output Formats"
    description: "All AI responses are converted to HTML and available for download in Markdown, HTML, and MD formats."

# Social Media
social_media:
  og_title: "AI Tools Hub - Professional AI-Powered Tools"
  og_description: "Discover powerful AI-driven tools for productivity, content creation, resume building, and professional development. Free online AI tools to enhance your workflow."
  og_image: "/images/ai-tools-hub-social.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "AI Tools Hub - Professional AI-Powered Tools"
  twitter_description: "Free AI-powered tools for productivity, content creation, and professional development. Enhance your workflow with our AI applications."
  twitter_image: "/images/ai-tools-hub-twitter.png"

# Child Page Defaults
cascade:
  - _target:
      kind: "page"
    type: "ai-tools"
    categories: ["AI Tools"]
    draft: false
    sitemap_priority: 0.7
    sitemap_changefreq: "weekly"
    schema_type: "SoftwareApplication"
---
