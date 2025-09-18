---
title: "Story Generator"
subtitle: "AI-Powered Tool"
author: JonesCKevin
date: 2025-09-13
tags:
- AI
- Tools
- Gaming
- Productivity
type: ai-tools
---


<link rel="stylesheet" href="story-generator.css">
<main class="main-content">
<div class="form-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">📚 AI Story Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
Create compelling stories with AI assistance. Choose your genre, setting, and characters to generate unique narratives for entertainment, writing practice, or creative inspiration.
</p>

<form id="storyForm">
<div class="form-group">
<label for="storyGenre">Story Genre *</label>
<select id="storyGenre" required>
<option value="">Select genre...</option>
<option value="fantasy">Fantasy</option>
<option value="sci-fi">Science Fiction</option>
<option value="mystery">Mystery</option>
<option value="romance">Romance</option>
<option value="thriller">Thriller</option>
<option value="horror">Horror</option>
<option value="adventure">Adventure</option>
<option value="drama">Drama</option>
<option value="comedy">Comedy</option>
<option value="historical">Historical Fiction</option>
<option value="post-apocalyptic">Post-Apocalyptic</option>
<option value="superhero">Superhero</option>
</select>
</div>

<div class="form-group">
<label for="storyLength">Story Length</label>
<select id="storyLength">
<option value="short">Short Story (500-800 words)</option>
<option value="medium">Medium Story (1000-1500 words)</option>
<option value="long">Long Story (2000+ words)</option>
<option value="flash">Flash Fiction (200-300 words)</option>
</select>
</div>

<div class="form-group">
<label for="mainCharacter">Main Character (Optional)</label>
<input type="text" id="mainCharacter" placeholder="e.g., A young wizard, A detective, A space explorer...">
</div>

<div class="form-group">
<label for="setting">Setting/Location (Optional)</label>
<input type="text" id="setting" placeholder="e.g., Medieval castle, Mars colony, Victorian London...">
</div>

<div class="form-group">
<label for="storyPrompt">Story Prompt/Theme (Optional)</label>
<textarea id="storyPrompt" rows="3" placeholder="Describe a situation, conflict, or theme you'd like the story to explore..."></textarea>
</div>

<div class="form-group">
<label for="tone">Story Tone</label>
<select id="tone">
<option value="balanced">Balanced</option>
<option value="dark">Dark & Serious</option>
<option value="light">Light & Humorous</option>
<option value="mysterious">Mysterious</option>
<option value="inspiring">Inspiring & Uplifting</option>
<option value="dramatic">Dramatic & Intense</option>
</select>
</div>

<button type="button" class="btn-primary" onclick="generateStory()">✨ Generate Story</button>
</form>

<div id="loadingDiv" class="loading" style="display: none;">
Crafting your story...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Generated Story</h3>
<div class="result-content" id="resultContent"></div>

<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="generateVariation()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">📖 Generate Alternative</button>
<button class="btn-primary" onclick="resetForm()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">🔄 Reset</button>
</div>
</div>
</div>
</main>

<script src="story-generator.js"></script>





