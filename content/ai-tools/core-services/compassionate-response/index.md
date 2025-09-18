---
title: "Compassionate Response Generator"
subtitle: "AI-Powered Tool"
author: JonesCKevin
date: 2025-09-13
tags:
- AI
- Tools
- Core Services
- Productivity
type: ai-tools
---
<main class="main-content">
<div class="form-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">Compassionate Response Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
                Generate empathetic and hopeful responses to global tragedies. This tool crafts meaningful content
                that expresses solidarity and support for communities in need.
            </p>
<form id="responseForm">
<div class="form-group">
<label for="systemPrompt">System Prompt *</label>
<select id="systemPrompt" required="">
<option value="">Select a compassionate prompt...</option>
<option value="global-empathy">Global Empathy Lens</option>
<option value="hope-headlines">Hope Beyond Headlines</option>
<option value="silent-stories">Silent Stories, Loud Support</option>
<option value="united-humanity">United in Humanity</option>
<option value="forgotten">For Those Forgotten</option>
</select>
</div>
<div class="form-group">
<label for="outputStyle">Output Style</label>
<select id="outputStyle">
<option value="neutral">Neutral</option>
<option value="formal">Formal</option>
<option value="poetic">Poetic</option>
<option value="minimalist">Minimalist</option>
</select>
</div>
<div class="form-group">
<label for="maxLength">Maximum Tweet Length</label>
<input id="maxLength" max="280" min="50" type="number" value="280"/>
</div>
<button type="button" class="btn-primary" onclick="generateResponse()">Generate Compassionate Response</button>
</form>
<div class="loading" id="loadingDiv" style="display: none;">
                Generating compassionate response...
            </div>
<div id="errorDiv" style="display: none;"></div>
<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Compassionate Response</h3>
<div class="result-content" id="resultContent"></div>
<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy
                        to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄
                        Download Markdown</button>
<button class="btn-primary" onclick="downloadResult('html')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #17a2b8, #20c997);">🌐
                        Download HTML</button>
<button class="btn-primary" onclick="generateVariation()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #6f42c1, #8e5bcd);">🎭
                        Generate New</button>
<button class="btn-primary" onclick="resetForm()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">🔄
                        Reset</button>
</div>
</div>
</div>
</main>

<script src="compassionate-response.js"></script>