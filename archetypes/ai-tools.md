---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
subtitle: "AI-powered tool description"
description: "SEO-friendly description for {{ replace .File.ContentBaseName "-" " " | title }}"
keywords: ["AI", "tool", "generator"]
date: {{ .Date }}
lastmod: {{ .Date }}
draft: false
tags: ["AI Tools", "Generator"]
categories: ["AI Tools"]
type: ai-tools

# SEO
seo_title: "{{ replace .File.ContentBaseName "-" " " | title }} - AI Tool"
canonical: "{{ .Permalink }}"
schema_type: "SoftwareApplication"
sitemap_priority: 0.7
sitemap_changefreq: "monthly"

# Social Media
social_media:
  og_title: "{{ replace .File.ContentBaseName "-" " " | title }}"
  og_description: "AI-powered tool description"
  twitter_card: "summary_large_image"

# AI Tool Result Section (used by layouts/partials/ai-tools/result-section.html)
result_title: "Generated Result"
loading_text: "Generating your content..."
show_svg_download: false
show_pdf_download: false

# Tool-specific script (auto-detected if not specified)
# tool_script: "{{ .File.ContentBaseName }}.js"
---

<!-- Optional: Tool-specific CSS -->
<link rel="stylesheet" href="{{ .File.ContentBaseName }}.css">

# 🛠️ {{ replace .File.ContentBaseName "-" " " | title }}

Short description of what this tool does and how to use it.

<form id="toolForm" class="ai-form">
    <div class="form-section">
        <div class="form-group">
            <label for="inputField">Input Label</label>
            <input type="text" id="inputField" name="inputField" placeholder="Enter value..." required>
        </div>

        <div class="form-group">
            <label for="selectField">Select Option</label>
            <select id="selectField" name="selectField">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
        </div>

        <div class="form-group">
            <label for="textareaField">Additional Details</label>
            <textarea id="textareaField" name="textareaField" rows="4" placeholder="Enter details..."></textarea>
        </div>
    </div>

    <button type="submit" class="btn btn-primary">Generate</button>
</form>
