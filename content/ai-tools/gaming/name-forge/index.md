---
title: "Name Forge - Multi-Genre Name Generator"
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

<link rel="stylesheet" href="name-forge.css">

<main class="main-content">
<div class="form-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">Name Forge: Multi-Genre Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
Generate unique names for characters, places, items, ships, guilds, and more across genres and cultures.
</p>

<form id="nameForgeForm">
<div class="form-group">
<label for="nameType">What Type of Name? *</label>
<select id="nameType" required>
<option value="">Select name type...</option>
<option value="character">Character Names</option>
<option value="place">Place Names (Cities, Towns, Regions)</option>
<option value="organization">Organizations (Guilds, Companies, Groups)</option>
<option value="item">Items & Artifacts</option>
<option value="ship">Ships & Vehicles</option>
<option value="business">Businesses & Establishments</option>
<option value="spell">Spells & Abilities</option>
<option value="creature">Creatures & Monsters</option>
</select>
</div>

<div class="form-group">
<label for="genre">Genre/Setting</label>
<select id="genre">
<option value="fantasy">Fantasy</option>
<option value="sci-fi">Science Fiction</option>
<option value="modern">Modern/Contemporary</option>
<option value="historical">Historical</option>
<option value="cyberpunk">Cyberpunk</option>
<option value="steampunk">Steampunk</option>
<option value="horror">Horror</option>
<option value="western">Western</option>
<option value="post-apocalyptic">Post-Apocalyptic</option>
<option value="superhero">Superhero</option>
</select>
</div>

<div class="form-group" id="characterGenderGroup" style="display: none;">
<label for="characterGender">Character Gender</label>
<select id="characterGender">
<option value="any">Any/Mixed</option>
<option value="masculine">Masculine Names</option>
<option value="feminine">Feminine Names</option>
<option value="neutral">Gender-Neutral Names</option>
</select>
</div>

<div class="form-group">
<label for="culture">Cultural Style</label>
<select id="culture">
<option value="mixed">Mixed Cultures</option>
<option value="european">European</option>
<option value="celtic">Celtic</option>
<option value="nordic">Nordic/Scandinavian</option>
<option value="slavic">Slavic</option>
<option value="mediterranean">Mediterranean</option>
<option value="middle-eastern">Middle Eastern</option>
<option value="asian">East Asian</option>
<option value="indian">South Asian</option>
<option value="african">African</option>
<option value="native-american">Native American</option>
<option value="invented">Completely Invented</option>
</select>
</div>

<div class="form-group">
<label for="nameCount">How Many Names?</label>
<select id="nameCount">
<option value="5">5 Names</option>
<option value="10">10 Names</option>
<option value="15">15 Names</option>
<option value="20">20 Names</option>
</select>
</div>

<div class="form-group">
<label for="nameStyle">Name Style</label>
<select id="nameStyle">
<option value="balanced">Balanced - Mix of simple and complex</option>
<option value="simple">Simple - Easy to pronounce</option>
<option value="exotic">Exotic - Unique and memorable</option>
<option value="regal">Regal - Noble and impressive</option>
<option value="mysterious">Mysterious - Dark and intriguing</option>
</select>
</div>

<div class="form-group">
<label for="specialRequests">Special Requests (Optional)</label>
<textarea id="specialRequests" rows="2" placeholder="Any specific requirements, themes, or elements you'd like included..."></textarea>
</div>

<button type="button" class="btn-primary" onclick="generateNames()">⚒️ Forge Names</button>
</form>

<div id="loadingDiv" class="loading" style="display: none;">
Forging unique names...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Generated Names</h3>
<div class="result-content" id="resultContent"></div>

<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="generateMoreNames()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">🎲 Generate More</button>
<button class="btn-primary" onclick="resetForm()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">🔄 Reset</button>
</div>
</div>
</div>
</main>

<script src="name-forge.js"></script>





