---
title: "Loot & Magic Item Crafter - D&D Magic Item Generator"
subtitle: "AI-Powered Magic Item and Treasure Generator"
description: "Generate balanced treasure parcels and bespoke magic items with lore, attunement, and campaign hooks. Perfect for D&D DMs and RPG creators."
keywords: ["magic item generator", "D&D loot generator", "RPG treasure", "magic item creator", "DnD magic items", "tabletop RPG", "treasure generator", "magic weapon generator", "RPG loot"]
author: JonesCKevin
date: 2025-09-13
lastmod: 2025-09-30
draft: false
tags: ["AI", "Tools", "Gaming", "D&D", "RPG", "Magic Items", "Loot", "Treasure", "DM Tools"]
categories: ["AI Tools", "Gaming", "RPG Tools"]
type: ai-tools
seo_title: "Free Magic Item Generator - D&D Loot & Treasure Creator"
canonical: "/ai-tools/gaming/magic-item-crafter/"
featured_image: "/images/ai-tools/magic-item-crafter.png"
schema_type: "SoftwareApplication"
sitemap_priority: 0.6
sitemap_changefreq: "monthly"
social_media:
  og_title: "Loot & Magic Item Crafter - D&D Magic Item Generator"
  og_description: "Generate balanced treasure and bespoke magic items with lore and campaign hooks. Perfect for D&D DMs."
  og_image: "/images/ai-tools/magic-item-crafter-social.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "Free Magic Item Generator"
  twitter_description: "Create balanced D&D magic items and treasure with AI. Perfect for DMs and RPG creators."
  twitter_image: "/images/ai-tools/magic-item-crafter-twitter.png"
---

<link rel="stylesheet" href="magic-item-crafter.css">


<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">Loot & Magic Item Crafter</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
Generate balanced treasure parcels and bespoke magic items with lore, attunement, and hooks for your campaigns.
</p>

<form id="magicItemForm">
<div class="form-group">
<label for="system">Game System *</label>
<select id="system" required>
<option value="">Select system...</option>
<option value="dnd5e">D&D 5e (SRD-friendly)</option>
<option value="pf2e">Pathfinder 2e (SRD-friendly)</option>
<option value="fantasy">Generic Fantasy</option>
<option value="scifi">Science Fiction</option>
<option value="cyberpunk">Cyberpunk</option>
<option value="modern">Modern</option>
</select>
</div>

<div class="form-group">
<label for="tier">Tier/Level</label>
<select id="tier">
<option value="low">Low/Novice</option>
<option value="mid">Mid/Seasoned</option>
<option value="high">High/Epic</option>
</select>
</div>

<div class="form-group">
<label for="rarity">Target Rarity</label>
<select id="rarity">
<option value="common">Common</option>
<option value="uncommon">Uncommon</option>
<option value="rare">Rare</option>
<option value="very_rare">Very Rare</option>
<option value="legendary">Legendary</option>
<option value="mixed">Mixed Rarities</option>
</select>
</div>

<div class="form-group">
<label for="slot">Equipment Slot (if item)</label>
<select id="slot">
<option value="any">Any/None</option>
<option value="weapon">Weapon</option>
<option value="armor">Armor</option>
<option value="ring">Ring</option>
<option value="amulet">Amulet/Necklace</option>
<option value="wondrous">Wondrous Item</option>
<option value="consumable">Consumable</option>
</select>
</div>

<div class="form-group">
<label for="theme">Theme/Concept (Optional)</label>
<input type="text" id="theme" placeholder="e.g., desert sun, frost, clockwork, necrotic, elemental...">
</div>

<div class="form-group">
<label for="itemCount">Number of Items</label>
<select id="itemCount">
<option value="1">Single Item</option>
<option value="2-3">Small Collection (2-3 items)</option>
<option value="4-6">Treasure Hoard (4-6 items)</option>
<option value="parcel">Full Loot Parcel</option>
</select>
</div>

<div class="form-group">
<div class="checkbox-group">
<label class="checkbox-inline">
<input type="checkbox" id="drawbacks"> Allow drawbacks/curses when appropriate
</label>
<label class="checkbox-inline">
<input type="checkbox" id="attunement" checked> Prefer attunement (5e-style)
</label>
<label class="checkbox-inline">
<input type="checkbox" id="includeValues" checked> Include gold/credits value ranges
</label>
<label class="checkbox-inline">
<input type="checkbox" id="includeHooks" checked> Include a plot hook per item
</label>
</div>
</div>

<button type="button" class="btn-primary" onclick="generateMagicItems()">✨ Craft Magic Items</button>
</form>

<div id="loadingDiv" class="loading" style="display: none;">
Crafting magical treasures...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Crafted Magic Items</h3>
<div class="result-content" id="resultContent"></div>

<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="downloadResult('html')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #17a2b8, #20c997);">🌐 Download HTML</button>
<button class="btn-primary" onclick="generateVariation()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">🎲 Generate Different Items</button>

</div>
</div>


<script src="magic-item-crafter.js"></script>





