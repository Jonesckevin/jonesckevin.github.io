// Wardrobe Capsule Planner Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Wardrobe Capsule Planner loaded');
});

let currentResult = '';

async function planWardrobe() {
    console.log('=== PLAN WARDROBE FUNCTION CALLED ===');

    const lifestyleType = document.getElementById('lifestyleType').value;
    const climate = document.getElementById('climate').value;
    const colorPreferences = document.getElementById('colorPreferences').value;
    const capsuleSize = document.getElementById('capsuleSize').value;
    const budget = document.getElementById('budget').value;
    const stylePreferences = document.getElementById('stylePreferences').value.trim();
    const specialNeeds = document.getElementById('specialNeeds').value.trim();

    if (!lifestyleType || !climate || !colorPreferences) {
        utils.showError(document.getElementById('errorDiv'), 'Please fill in all required fields');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    // Check API availability
    if (!window.apiManager) {
        utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    const aiProvider = window.apiManager.getProvider();
    const apiKey = window.apiManager.getApiKey();

    // Show loading
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';

    try {
        const sizeInstructions = {
            'minimal': '15-20 carefully selected essential pieces. Ultra-minimalist approach focusing on maximum versatility.',
            'standard': '25-30 pieces providing good variety while maintaining simplicity. Balanced capsule approach.',
            'extended': '35-40 pieces allowing for more variety and seasonal options. Comfortable minimalism.'
        };

        const budgetInstructions = {
            'budget': 'Focus on affordable, durable basics from accessible brands. Quality per dollar ratio.',
            'moderate': 'Mix of mid-range and some investment pieces. Balance quality and affordability.',
            'investment': 'Emphasize high-quality, timeless investment pieces. Long-term wardrobe building.'
        };

        const styleInstruction = stylePreferences ?
            `Aesthetic: ${stylePreferences}. Tailor recommendations to this style.` :
            'Focus on timeless, versatile pieces with broad appeal.';

        const specialNeedsInstruction = specialNeeds ?
            `Special considerations: ${specialNeeds}. Account for these in recommendations.` :
            '';

        const systemPrompt = `You are a professional wardrobe consultant and minimalist fashion expert.

Create a comprehensive capsule wardrobe plan for:

**Lifestyle**: ${lifestyleType}
**Climate**: ${climate}
**Color Palette**: ${colorPreferences}
**Capsule Size**: ${sizeInstructions[capsuleSize]}
**Budget Level**: ${budgetInstructions[budget]}
${styleInstruction}
${specialNeedsInstruction}

Provide a detailed capsule wardrobe plan including:

1. **Wardrobe Philosophy**:
   - Overall strategy and approach for this capsule
   - Why these pieces work together
   - Versatility principles

2. **Core Pieces by Category**:
   Organize by:
   - **Tops** (shirts, blouses, sweaters)
   - **Bottoms** (pants, skirts, shorts)
   - **Dresses / Jumpsuits** (if applicable)
   - **Outerwear** (jackets, coats)
   - **Shoes** (must-have footwear)
   - **Accessories** (bags, belts, scarves)

   For each item:
   - Specific piece description
   - Color recommendation
   - Why it's essential
   - Versatility (how many outfits it enables)

3. **Color Coordination Strategy**:
   - Specific color palette with hex codes or names
   - How colors work together
   - Accent vs. neutral balance

4. **Outfit Combinations**:
   - 8-10 complete outfit examples
   - Mix for different occasions (work, casual, special)
   - Show how pieces interconnect

5. **Seasonal Adaptations** (if applicable):
   - How to adjust for different seasons
   - Layering strategies
   - Seasonal swaps

6. **Shopping Priorities**:
   - What to buy first (if building from scratch)
   - Key investment pieces
   - Nice-to-have additions

7. **Maintenance & Care**:
   - Care tips for longevity
   - Storage suggestions
   - When to replace items

8. **Sustainability Notes**:
   - How this capsule reduces waste
   - Quality over quantity mindset
   - Versatility benefits

Focus on:
- Timeless, durable pieces
- Maximum mix-and-match potential
- Practical for actual lifestyle
- Realistic and achievable
- Clear, specific recommendations

Format in clear, organized markdown with visual hierarchy.`;

        const userPrompt = `Create a capsule wardrobe plan for ${lifestyleType} lifestyle in ${climate} climate.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        console.log('Making API request...');
        const response = await window.apiManager.makeRequest(messages, {
            provider: aiProvider,
            apiKey: apiKey,
            maxTokens: 3500,
            temperature: 0.7
        });

        console.log('API raw response received:', typeof response, response && response.length ? `(length: ${response.length})` : '');

        // Support legacy object shape and new string return from apiManager.makeRequest
        let content = '';
        if (typeof response === 'string') {
            content = response;
        } else if (response && typeof response === 'object') {
            content = response.content || response.output || '';
        }

        if (!content || typeof content !== 'string') {
            throw new Error('Invalid API response format');
        }

        window.currentResult = content;

        // Display result
        const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = utils.formatMarkdown(content);
        document.getElementById('loadingDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'block';

        console.log('Results displayed successfully');

    } catch (error) {
        console.error('Error planning wardrobe:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        utils.showError(document.getElementById('errorDiv'), `Error: ${error.message}`);
        document.getElementById('errorDiv').style.display = 'block';
    }
}

function copyResult(event) {
    if (event) event.preventDefault();
    if (window.currentResult) {
        utils.copyToClipboard(window.currentResult, event ? event.target : null);
    }
}

function downloadResult(format) {
    if (!window.currentResult) return;

    const timestamp = utils.getCurrentTimestamp();
    const filename = `capsule-wardrobe-${timestamp}`;

    if (format === 'markdown') {
        utils.downloadAsMarkdown(window.currentResult, filename);
    } else if (format === 'html') {
        utils.downloadAsHTML(window.currentResult, filename, 'Capsule Wardrobe Plan');
    }
}
