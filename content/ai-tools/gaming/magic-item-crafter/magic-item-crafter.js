document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    async function generateMagicItems() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const system = document.getElementById('system').value;
        const tier = document.getElementById('tier').value;
        const rarity = document.getElementById('rarity').value;
        const slot = document.getElementById('slot').value;
        const theme = document.getElementById('theme').value.trim();
        const itemCount = document.getElementById('itemCount').value;
        const drawbacks = document.getElementById('drawbacks').checked;
        const attunement = document.getElementById('attunement').checked;
        const includeValues = document.getElementById('includeValues').checked;
        const includeHooks = document.getElementById('includeHooks').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!system) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a game system');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemInstructions = {
                'dnd5e': 'D&D 5e mechanics with SRD-friendly language, avoid reproducing licensed rules text',
                'pf2e': 'Pathfinder 2e mechanics with SRD-friendly language, focus on traits and action economy',
                'fantasy': 'Generic fantasy RPG mechanics, system-agnostic',
                'scifi': 'Science fiction setting with technological items and energy-based effects',
                'cyberpunk': 'Cyberpunk setting with high-tech gear, implants, and digital effects',
                'modern': 'Modern/contemporary setting with realistic technology and effects'
            };

            const tierInstructions = {
                'low': 'Low-level characters (1st-5th level), simple effects, minor bonuses',
                'mid': 'Mid-level characters (6th-15th level), moderate effects, useful abilities',
                'high': 'High-level characters (16th+ level), powerful effects, game-changing abilities'
            };

            const countInstructions = {
                '1': 'Create a single, well-detailed magic item',
                '2-3': 'Create 2-3 complementary magic items',
                '4-6': 'Create 4-6 varied magic items forming a treasure hoard',
                'parcel': 'Create a complete loot parcel with currency, mundane valuables, and 3-5 magic items'
            };

            const themeText = theme ? `Theme/Concept: ${theme}` : 'No specific theme - create varied and interesting items';
            const drawbackText = drawbacks ? 'Include interesting drawbacks, curses, or limitations when appropriate' : 'Focus on beneficial effects, minimal drawbacks';
            const attunementText = attunement ? 'Prefer items that require attunement for balance' : 'Use attunement only when necessary for powerful effects';
            const valueText = includeValues ? 'Include approximate gold piece values or credit costs' : 'Focus on mechanical and story elements';
            const hookText = includeHooks ? 'Include a brief plot hook or story element for each item' : 'Focus on mechanical descriptions';

            const systemPrompt = `You are a master treasure designer and magic item crafter. Create balanced, flavorful items that enhance gameplay and storytelling.

SYSTEM: ${systemInstructions[system]}
TIER: ${tierInstructions[tier]}
RARITY: ${rarity === 'mixed' ? 'Mix of different rarities appropriate for the tier' : rarity.replace('_', ' ')}
SLOT PREFERENCE: ${slot === 'any' ? 'Any equipment slot or none' : slot}
ITEM COUNT: ${countInstructions[itemCount]}

DESIGN GUIDELINES:
- ${themeText}
- ${drawbackText}
- ${attunementText}
- ${valueText}
- ${hookText}

REQUIREMENTS:
1. Items must be balanced for the specified tier and rarity
2. Include clear activation methods and usage limitations
3. Provide flavorful descriptions and lore
4. Use SRD-friendly language (avoid exact reproduction of copyrighted text)
5. Format as clear Markdown with proper headings and organization

For each magic item include:
- **Name** and rarity
- **Type/Slot** (weapon, armor, wondrous item, etc.)
- **Properties** and mechanical effects
- **Activation** method and any charges/limitations
- **Attunement** requirements if applicable
- **Description** with flavor and lore
- **Value** (if requested)
- **Plot Hook** (if requested)

Create items that are mechanically interesting and narratively compelling!`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create ${itemCount} magic item(s) for ${system} at ${tier} tier, ${rarity} rarity, focusing on ${slot} slot items.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: itemCount === 'parcel' ? 3000 : itemCount === '4-6' ? 2500 : itemCount === '2-3' ? 1500 : 1000,
                temperature: 0.7
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div class="result-display">${htmlContent}</div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating magic items:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate magic items. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const system = document.getElementById('system').value;
        const tier = document.getElementById('tier').value;
        const rarity = document.getElementById('rarity').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create completely different magic items with the same parameters but different themes, mechanics, and purposes. Explore alternative design approaches and creative effects.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create alternative magic items for ${system} at ${tier} tier, ${rarity} rarity with different themes and mechanics.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.8
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div class="result-display">${htmlContent}</div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate variation. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult(event) {
        utils.copyToClipboard(currentResult).then(success => {
            if (success && event && event.target) {
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            }
        });
    }

    function downloadResult(format) {
        const system = document.getElementById('system').value || 'magic-items';
        const filename = `magic-items_${system}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('theme').value = '';
        document.getElementById('system').value = '';
        document.getElementById('tier').value = 'mid';
        document.getElementById('rarity').value = 'uncommon';
        document.getElementById('slot').value = 'any';
        document.getElementById('itemCount').value = '1';
    }

    // Make functions globally available for onclick handlers
    window.generateMagicItems = generateMagicItems;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});