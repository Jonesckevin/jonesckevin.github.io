---
title: "Audio & Video Transcriber"
subtitle: "AI-Powered Audio/Video to Text Transcription"
description: "Transcribe audio and video files to text using OpenAI Whisper or Mistral Voxtral. Supports timestamps, multiple languages, and common media formats. Free online transcription tool."
keywords: ["AI transcription", "audio to text", "video transcription", "Whisper API", "Voxtral", "speech to text", "transcribe audio", "transcribe video", "free transcription", "AI tools"]
date: 2025-11-30
lastmod: 2025-12-14
draft: false
tags: ["Core Services", "Productivity", "Transcription", "Audio", "Video", "Speech to Text", "AI", "Tools"]
categories: ["AI Tools"]
type: ai-tools
seo_title: "Free AI Audio & Video Transcriber - Whisper & Voxtral Transcription"
canonical: "/ai-tools/core-services/audio-transcriber/"
featured_image: "/images/featured/aitools/audio-transcription.png"
schema_type: "SoftwareApplication"
sitemap_priority: 0.7
sitemap_changefreq: "monthly"
social_media:
  og_title: "AI Audio & Video Transcriber - Free Transcription Tool"
  og_description: "Transcribe audio and video files to text with timestamps using OpenAI Whisper or Mistral Voxtral. Free online tool."
  og_image: "/images/featured/aitools/audio-transcription.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "Free AI Audio & Video Transcriber"
  twitter_description: "Convert audio and video to text with AI. Supports timestamps and multiple languages."
  twitter_image: "/images/featured/aitools/audio-transcription.png"
---

<link rel="stylesheet" href="audio-transcriber.css">

<div class="tool-header">
  <h1 class="tool-title">Audio & Video Transcriber</h1>
  <p class="tool-subtitle">Convert audio and video files to text using <a href="https://platform.openai.com/docs/models/whisper-1" target="_blank" rel="noopener">Whisper</a> or <a href="https://docs.mistral.ai/models/voxtral-mini-transcribe-25-07" target="_blank" rel="noopener">Voxtral</a>. If the file is larger, I reccomend transcribing locally since context length is limited.</p>
</div>

<!-- Provider Warning Banner -->
<div id="providerWarning" class="error-message" style="display: none;">
  <strong>⚠️ Unsupported Provider:</strong> Transcription requires <strong>OpenAI</strong> (Whisper) or <strong>Mistral</strong> (Voxtral). Please switch your provider in the header settings.
</div>

<form id="transcribeForm">

<!-- File Upload -->
<div class="form-group">
<label>Upload Audio/Video File *</label>
<div class="file-upload-area" id="uploadArea">
<div class="upload-text">Click to upload or drag and drop</div>
<div class="upload-subtext">Supports MP3, MP4, WAV, M4A, WEBM, OGG, FLAC (max 25MB)</div>
<div class="file-name" id="fileName" style="display: none;"></div>
</div>
<input accept=".mp3,.mp4,.wav,.m4a,.webm,.ogg,.flac,.mpeg,.mpga" id="fileInput" style="display: none;" type="file"/>
</div>

<!-- Options -->
<div class="form-group">
<label for="language">Language</label>
<select id="language">
<option value="en" selected>English</option>
<option value="es">Spanish</option>
<option value="fr">French</option>
<option value="de">German</option>
<option value="it">Italian</option>
<option value="pt">Portuguese</option>
<option value="nl">Dutch</option>
<option value="pl">Polish</option>
<option value="ru">Russian</option>
<option value="ja">Japanese</option>
<option value="ko">Korean</option>
<option value="zh">Chinese</option>
<option value="ar">Arabic</option>
<option value="hi">Hindi</option>
<option value="tr">Turkish</option>
<option value="vi">Vietnamese</option>
<option value="th">Thai</option>
<option value="id">Indonesian</option>
<option value="ms">Malay</option>
<option value="sv">Swedish</option>
<option value="da">Danish</option>
<option value="no">Norwegian</option>
<option value="fi">Finnish</option>
<option value="cs">Czech</option>
<option value="sk">Slovak</option>
<option value="uk">Ukrainian</option>
<option value="el">Greek</option>
<option value="he">Hebrew</option>
<option value="ro">Romanian</option>
<option value="hu">Hungarian</option>
<option value="bg">Bulgarian</option>
<option value="hr">Croatian</option>
<option value="sr">Serbian</option>
<option value="sl">Slovenian</option>
<option value="lt">Lithuanian</option>
<option value="lv">Latvian</option>
<option value="et">Estonian</option>
<option value="ca">Catalan</option>
<option value="gl">Galician</option>
<option value="eu">Basque</option>
<option value="cy">Welsh</option>
<option value="af">Afrikaans</option>
<option value="sw">Swahili</option>
<option value="tl">Filipino</option>
<option value="bn">Bengali</option>
<option value="ta">Tamil</option>
<option value="te">Telugu</option>
<option value="mr">Marathi</option>
<option value="ur">Urdu</option>
<option value="fa">Persian</option>
</select>
</div>

<!-- Toggle Options -->
<div class="form-group">
<label>Options</label>
<div class="checkbox-group">
<label class="checkbox-inline">
<input type="checkbox" id="includeTimestamps">
<span class="toggle-switch"><span class="toggle-slider"></span></span>
<span class="toggle-label">Include Timestamps</span>
<span class="toggle-helper">Adds [HH:MM:SS] markers to the transcript.</span>
</label>
</div>
</div>

<button type="button" class="btn-primary" id="submitBtn" onclick="transcribeAudio()">🎙️ Transcribe</button>
</form>

<!-- Progress Section -->
<div id="progressDiv" style="display: none;">
<div class="loading-container">
<div class="loading-spinner"></div>
<div id="progressText">Uploading file...</div>
<progress id="progressBar" value="0" max="100" style="width: 100%; height: 20px; margin-top: 15px;"></progress>
<div id="progressPercent" style="margin-top: 8px; font-size: 14px; opacity: 0.8;">0%</div>
</div>
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" class="result-container" style="display: none;">
<h3 class="result-header">📝 Transcription</h3>
<div id="resultMeta" style="margin-bottom: 15px; font-size: 14px; opacity: 0.8;"></div>
<div id="resultContent" class="result-content"></div>
<div class="result-actions">
    <button class="copy-btn" onclick="copyResult(event)">📋 Copy</button>
    <button class="download-btn" onclick="downloadResult('txt')">📄 TXT</button>
    <button class="download-btn-alt" onclick="downloadResult('srt')">🎬 SRT</button>
</div>
</div>

<!-- Shared components already loaded in head.html -->
<script src="/shared/components/utils.js"></script>
<script src="/shared/components/api-manager.js"></script>
<script src="/shared/components/download-manager.js"></script>
<script src="audio-transcriber.js"></script>
