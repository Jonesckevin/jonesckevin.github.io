---
title: "Resume Analysis Tool"
subtitle: "AI-Powered Resume Review and Enhancement Service"
description: "Get professional AI-powered resume analysis with detailed feedback and scoring. Improve your resume with expert critiques and ATS optimization suggestions. Free resume reviewer."
keywords: ["resume critique", "resume analysis", "AI resume reviewer", "resume feedback", "ATS optimization", "resume scoring", "professional resume review", "resume improvement", "career tools", "job application help"]
author: JonesCKevin
date: 2025-09-13
lastmod: 2025-09-30
draft: false
tags: ["Core Services", "Productivity", "Resume", "Career", "Analysis", "Professional Development", "AI", "Tools"]
categories: ["AI Tools"]
type: ai-tools
seo_title: "Free AI Resume Critique - Professional Resume Analysis & Review"
canonical: "/ai-tools/core-services/resume-critique/"
featured_image: "/images/featured/aitools/resume-analysis.png"
schema_type: "SoftwareApplication"
sitemap_priority: 0.7
sitemap_changefreq: "monthly"
social_media:
  og_title: "AI Resume Critique - Professional Resume Analysis"
  og_description: "Get expert AI-powered resume analysis with detailed feedback and scoring. Improve your resume for better job applications."
  og_image: "/images/ai-tools/resume-critique-social.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "Free AI Resume Critique Tool"
  twitter_description: "Professional resume analysis with AI. Get detailed feedback and scoring to improve your job applications."
  twitter_image: "/images/featured/aitools/resume-analysis.png"
---

<link rel="stylesheet" href="/shared/styles/result-display.css">
<link rel="stylesheet" href="/ai-tools/core-services/resume-critique/resume-critique.css">

<h1 style="text-align: center; margin-bottom: 20px; color: #ff6b35;">AI Resume Critique & Enhancement</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9; font-size: 1.1rem; line-height: 1.6;">
Get professional AI-powered analysis of your resume with detailed feedback, scoring, section-by-section critiques, and an enhanced version tailored for your target job.
<br><strong style="color: #ff6b35;">Transform your resume into an interview-winning document!</strong>
</p>

<form id="resumeCritiqueForm">
<div class="form-group">
<label>Input Method *</label>
<div style="display: flex; gap: 20px; margin-bottom: 15px;">
<label style="display: flex; align-items: left; color: #e0e0e0;">
<input checked="" name="inputMethod" style="margin-right: 10px;" type="radio" value="text"/>
Paste Resume Text
</label>
<label style="display: flex; align-items: left; color: #e0e0e0;">
<input name="inputMethod" style="margin-right: 10px;" type="radio" value="file"/>
Upload Resume File
</label>
</div>
</div>

<div class="form-group" id="textInputGroup">
<label for="resumeText">Resume Content *</label>
<textarea id="resumeText" placeholder="Paste your resume content here..." required="" rows="12"></textarea>
</div>

<div class="form-group" id="fileInputGroup" style="display: none;">
<label>Upload Resume</label>
<div class="file-upload-area" id="uploadArea" style="border: 3px dashed #ff6b35; background: #2a2a2a; min-height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
<div class="upload-text">Click to upload or drag and drop</div>
<div class="upload-subtext">Supports TXT and MD files</div>
<div class="file-name" id="fileName" style="display: none;"></div>
</div>
<input accept=".txt,.md" id="fileInput" style="display: none;" type="file"/>
</div>

<div class="form-group">
<label for="targetJob">Target Job/Industry (Optional)</label>
<input id="targetJob" placeholder="e.g., Software Engineer, Marketing Manager" type="text"/>
</div>

<div class="form-group">
<label for="experienceLevel">Experience Level</label>
<select id="experienceLevel">
<option value="entry">Entry Level (0-2 years)</option>
<option value="mid" selected>Mid-Level (3-7 years)</option>
<option value="senior">Senior Level (8+ years)</option>
<option value="executive">Executive Level</option>
</select>
</div>

<button type="button" class="btn-primary" onclick="analyzeResume()">Analyze Resume</button>
</form>

<div class="loading" id="loadingDiv" style="display: none;">
Analyzing your resume with AI...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">📊 Resume Analysis Results</h3>
<div id="resultContent"></div>
<div class="result-actions">
<button class="btn-copy" onclick="copyResult(event)">📋 Copy Analysis</button>
<button class="btn-download" onclick="downloadResult('markdown')">📄 Download MD</button>
<button class="btn-download" onclick="downloadResult('html')">🌐 Download HTML</button>
<button class="btn-primary" onclick="generateEnhanced()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">✨ Enhanced Version</button>
</div>
</div>

<!-- Shared components already loaded in head.html -->
<script src="/ai-tools/core-services/resume-critique/resume-critique.js"></script>