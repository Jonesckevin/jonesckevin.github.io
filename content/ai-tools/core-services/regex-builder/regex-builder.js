document.addEventListener('DOMContentLoaded', () => {
  let currentResult = '';
  let currentRegex = null;
  let descriptionsVisible = true;
  
  if (!window.apiManager) window.apiManager = new APIManager();
  if (!window.downloadManager) window.downloadManager = new DownloadManager();

  // Register standardized copy/download actions
  utils.registerToolActions('regex-builder', () => currentResult);

  // DOM Elements
  const form = document.getElementById('regexBuilderForm');
  const patternInput = document.getElementById('regexPattern');
  const generateBtn = document.getElementById('generateBtn');
  const userDescription = document.getElementById('userDescription');
  const optionCount = document.getElementById('optionCount');
  const complexityRange = document.getElementById('complexityRange');
  const aiActionSelect = document.getElementById('aiAction');
  const patternValid = document.getElementById('patternValid');
  const patternLength = document.getElementById('patternLength');
  
  const resultDiv = document.getElementById('resultDiv');
  const errorDiv = document.getElementById('errorDiv');
  const loadingDiv = document.getElementById('loadingDiv');
  const resultContent = document.getElementById('resultContent');
  const toggleDescriptionsBtn = document.getElementById('toggleDescriptions');

  // Generate button click handler
  generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    generateRegexOptions();
  });

  // Toggle descriptions button
  toggleDescriptionsBtn?.addEventListener('click', () => {
    descriptionsVisible = !descriptionsVisible;
    const descriptions = document.querySelectorAll('.regex-description');
    descriptions.forEach(desc => {
      desc.style.display = descriptionsVisible ? 'block' : 'none';
    });
    toggleDescriptionsBtn.textContent = descriptionsVisible ? '📖 Hide Descriptions' : '📖 Show Descriptions';
  });

  // Real-time pattern validation for manual input
  patternInput?.addEventListener('input', () => {
    validatePattern();
  });

  // Form submission - disabled for now since we use generate button
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Generate multiple regex options from user description
  async function generateRegexOptions() {
    const apiKey = window.apiManager?.getApiKey?.();
    if (!apiKey) {
      utils.showError(errorDiv, 'Please set your API key via the ⚙️ settings menu.');
      return;
    }

    const description = userDescription.value.trim();
    if (!description) {
      utils.showError(errorDiv, 'Please describe what you want to match.');
      return;
    }

    const numOptions = parseInt(optionCount.value);
    const complexity = complexityRange.value;
    const flavor = document.getElementById('regexFlavor').value;
    const aiAction = aiActionSelect.value;
    const additionalContext = document.getElementById('additionalContext').value.trim();

    clearErrors();
    resultDiv.style.display = 'none';
    showLoading(`Generating ${numOptions} regex option${numOptions > 1 ? 's' : ''}...`);

    try {
      const systemPrompt = buildGenerationSystemPrompt(numOptions, complexity, flavor, aiAction, additionalContext);
      const userPrompt = buildGenerationUserPrompt(description, numOptions, complexity, flavor, aiAction, additionalContext);

      const response = await apiManager.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], { 
        maxTokens: 2000 + (numOptions * 500), 
        temperature: 0.3 
      });

      currentResult = response;
      displayGeneratedOptions(response, numOptions);
      hideLoading();
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      hideLoading();
      utils.showError(errorDiv, 'Failed to generate options: ' + (err.message || err));
    }
  }

  // Build system prompt for generation
  function buildGenerationSystemPrompt(numOptions, complexity, flavor, aiAction, additionalContext) {
    const complexityDesc = {
      'simple-only': 'simple and straightforward',
      'simple-moderate': 'ranging from simple to moderate complexity',
      'moderate-complex': 'ranging from simple to complex',
      'complex-only': 'complex and comprehensive'
    }[complexity];

    let enhancementNote = '';
    if (aiAction === 'explain') {
      enhancementNote = '\nProvide extra detailed explanations for each component.';
    } else if (aiAction === 'optimize') {
      enhancementNote = '\nFocus on performance optimization and reducing backtracking.';
    } else if (aiAction === 'security') {
      enhancementNote = '\nInclude security analysis (ReDoS vulnerabilities) in the Cons section.';
    } else if (aiAction === 'test-cases') {
      enhancementNote = '\nInclude comprehensive test cases with both matching and non-matching examples.';
    }

    return `You are an expert regex engineer. Generate ${numOptions} different regular expression${numOptions > 1 ? 's' : ''} for the user's requirement, ${complexityDesc}.${enhancementNote}

For each option, provide the output in this EXACT format:

## Option [N]: [Brief Title]

**Complexity:** [Simple/Moderate/Complex]

**Pattern:**
\`\`\`regex
[REGEX_PATTERN_HERE]
\`\`\`

**Flavor:** ${flavor}

<div class="regex-description">

### Explanation
[Explain what this pattern matches and its approach]

### Component Breakdown
- \`[part]\` - [explanation]
- \`[part]\` - [explanation]
[continue for each significant component]

### Pros & Cons
**Pros:**
- [advantage 1]
- [advantage 2]

**Cons:**
- [limitation 1]
- [limitation 2]

### Example Usage
[Show 3-5 example strings this would match and 2-3 that would NOT match]

</div>

---

${numOptions > 1 ? `\nOrder the options from ${complexity === 'complex-only' ? 'most to least complex' : 'simplest to most complex'}.` : ''}
Ensure each pattern is syntactically correct for ${flavor}.`;
  }

  // Build user prompt for generation
  function buildGenerationUserPrompt(description, numOptions, complexity, flavor, aiAction, additionalContext) {
    let prompt = `Requirement: ${description}\n`;
    prompt += `Generate ${numOptions} regex option${numOptions > 1 ? 's' : ''} (${complexity.replace('-', ' to ')})\n`;
    prompt += `Flavor: ${flavor}\n`;
    
    if (aiAction && aiAction !== 'none') {
      prompt += `Enhancement: ${aiAction}\n`;
    }

    if (additionalContext) {
      prompt += `\nAdditional Context: ${additionalContext}`;
    }

    return prompt;
  }

  // Display generated options with toggle-able descriptions
  function displayGeneratedOptions(markdown, numOptions) {
    // Parse and display with custom formatting
    const html = parseGeneratedOptionsToHtml(markdown);
    resultContent.innerHTML = html;

    // Add click handlers to "Use This Pattern" buttons
    document.querySelectorAll('.use-pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pattern = btn.getAttribute('data-pattern');
        patternInput.value = pattern;
        validatePattern();
        showNotification('Pattern loaded! Test it below.');
        
        // Scroll to pattern section
        patternInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        patternInput.focus();
      });
    });

    // Set initial description visibility
    const descriptions = document.querySelectorAll('.regex-description');
    descriptions.forEach(desc => {
      desc.style.display = descriptionsVisible ? 'block' : 'none';
    });
  }

  // Parse generated markdown into structured HTML
  function parseGeneratedOptionsToHtml(markdown) {
    // Use downloadManager for basic markdown conversion
    window.downloadManager.setContent(markdown, 'markdown');
    let html = window.downloadManager.currentContent.html;

    // Extract patterns and add "Use Pattern" buttons
    html = html.replace(/<code class="language-regex">([\s\S]*?)<\/code>/g, (match, pattern) => {
      const cleanPattern = pattern.trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      return `<code class="language-regex">${pattern}</code>
        <button class="use-pattern-btn" data-pattern="${escapeHtml(cleanPattern)}">
          ✨ Use This Pattern
        </button>`;
    });

    return html;
  }

  // Validate pattern syntax
  function validatePattern() {
    const pattern = patternInput.value.trim();
    patternLength.textContent = `Length: ${pattern.length}`;
    
    if (!pattern) {
      patternValid.textContent = '';
      patternValid.className = 'status-indicator';
      currentRegex = null;
      return false;
    }

    try {
      const flags = getFlags();
      currentRegex = new RegExp(pattern, flags);
      patternValid.textContent = '✓ Valid';
      patternValid.className = 'status-indicator valid';
      return true;
    } catch (err) {
      patternValid.textContent = '✗ Invalid: ' + err.message;
      patternValid.className = 'status-indicator invalid';
      currentRegex = null;
      return false;
    }
  }

  // Get selected flags
  function getFlags() {
    let flags = '';
    const flagGlobal = document.getElementById('flagGlobal');
    const flagIgnoreCase = document.getElementById('flagIgnoreCase');
    const flagMultiline = document.getElementById('flagMultiline');
    const flagDotAll = document.getElementById('flagDotAll');
    const flagUnicode = document.getElementById('flagUnicode');
    
    if (flagGlobal?.checked) flags += 'g';
    if (flagIgnoreCase?.checked) flags += 'i';
    if (flagMultiline?.checked) flags += 'm';
    if (flagDotAll?.checked) flags += 's';
    if (flagUnicode?.checked) flags += 'u';
    return flags;
  }

  // Utility functions
  function showLoading(msg = 'Processing...') {
    loadingDiv.innerHTML = `<div style="color:#ff6b35;">${msg}</div>`;
    loadingDiv.style.display = 'block';
  }

  function hideLoading() {
    loadingDiv.style.display = 'none';
  }

  function clearErrors() {
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = '';
  }

  function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#ff6b35;color:white;padding:12px 20px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease-out;';
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
