---
title: "NPC Forge: Character Generator"
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

<link rel="stylesheet" href="npc-generator.css">

<main class="main-content">
<div class="form-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">NPC Forge: Character Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
Create compelling NPCs for any system or genre with detailed personalities, backgrounds, and roleplay notes.
</p>

<div id="ai-interface"></div>

<form id="npcForm">
<div class="form-group">
<label for="npcRole">NPC Role/Type *</label>
<select id="npcRole" required>
<option value="">Select NPC role...</option>
<option value="quest-giver">Quest Giver</option>
<option value="merchant">Merchant/Shopkeeper</option>
<option value="tavern-keeper">Tavern Keeper/Innkeeper</option>
<option value="guard">Guard/Law Enforcement</option>
<option value="noble">Noble/Aristocrat</option>
<option value="commoner">Commoner/Citizen</option>
<option value="villain">Villain/Antagonist</option>
<option value="ally">Ally/Companion</option>
<option value="scholar">Scholar/Sage</option>
<option value="craftsperson">Craftsperson/Artisan</option>
<option value="religious">Religious Figure</option>
<option value="criminal">Criminal/Rogue</option>
<option value="explorer">Explorer/Adventurer</option>
<option value="entertainer">Entertainer/Performer</option>
<option value="custom">Custom Role</option>
</select>
</div>

<div class="form-group" id="customRoleGroup" style="display: none;">
<label for="customRole">Custom Role Description</label>
<input type="text" id="customRole" placeholder="Describe the NPC's role or profession">
</div>

<div class="form-group">
<label for="setting">Setting/Genre</label>
<select id="setting">
<option value="fantasy">Fantasy</option>
<option value="sci-fi">Science Fiction</option>
<option value="modern">Modern/Contemporary</option>
<option value="historical">Historical</option>
<option value="cyberpunk">Cyberpunk</option>
<option value="steampunk">Steampunk</option>
<option value="post-apocalyptic">Post-Apocalyptic</option>
<option value="superhero">Superhero</option>
<option value="horror">Horror</option>
<option value="western">Western</option>
</select>
</div>

<div class="form-group">
<label for="importance">Story Importance</label>
<select id="importance">
<option value="minor">Minor NPC - Brief encounter</option>
<option value="recurring">Recurring Character - Multiple scenes</option>
<option value="major">Major Character - Important to plot</option>
<option value="central">Central Figure - Key story element</option>
</select>
</div>

<div class="form-group">
<label for="specialRequests">Special Requests (Optional)</label>
<textarea id="specialRequests" rows="3" placeholder="Any specific traits, backstory elements, secrets, or requirements for this NPC..."></textarea>
</div>

<div class="form-group">
<div class="checkbox-group">
<label class="checkbox-inline">
<input type="checkbox" id="includeSecrets" checked> Include secrets or hidden motivations
</label>
<label class="checkbox-inline">
<input type="checkbox" id="includeQuirks" checked> Include personality quirks and mannerisms
</label>
<label class="checkbox-inline">
<input type="checkbox" id="includeHooks" checked> Include plot hooks and story connections
</label>
</div>
</div>

<button type="button" class="btn-primary" onclick="generateNPC()">🧙 Forge NPC</button>
</form>

<div id="loadingDiv" class="loading" style="display: none;">
Forging your NPC character...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Generated NPC</h3>
<div class="result-content" id="resultContent"></div>

<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="downloadResult('html')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #17a2b8, #20c997);">🌐 Download HTML</button>
<button class="btn-primary" onclick="generateVariation()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">🎲 Generate Alternative</button>
<button class="btn-primary" onclick="resetForm()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">🔄 Reset</button>
</div>
</div> 
</main>

<script src="npc-generator.js"></script>





