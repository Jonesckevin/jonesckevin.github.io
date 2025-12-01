document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Show/hide custom role description
    document.getElementById('npcRole').addEventListener('change', function () {
        const customGroup = document.getElementById('customRoleGroup');
        if (this.value === 'custom') {
            customGroup.style.display = 'block';
        } else {
            customGroup.style.display = 'none';
        }
    });

    async function generateNPC() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const npcRole = document.getElementById('npcRole').value;
        const customRole = document.getElementById('customRole').value.trim();
        const setting = document.getElementById('setting').value;
        const importance = document.getElementById('importance').value;
        const specialRequests = document.getElementById('specialRequests').value.trim();
        const includeSecrets = document.getElementById('includeSecrets').checked;
        const includeQuirks = document.getElementById('includeQuirks').checked;
        const includeHooks = document.getElementById('includeHooks').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!npcRole) {
            utils.showError(document.getElementById('errorDiv'), 'Please select an NPC role');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (npcRole === 'custom' && !customRole) {
            utils.showError(document.getElementById('errorDiv'), 'Please describe the custom role');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const roleDescription = npcRole === 'custom' ? customRole : npcRole.replace('-', ' ');

            const importanceInstructions = {
                'minor': 'Create a simple but memorable NPC for brief encounters',
                'recurring': 'Create a detailed NPC that can appear multiple times with consistent personality',
                'major': 'Create a complex NPC important to the story with deep motivations',
                'central': 'Create a pivotal character who could drive major plot elements'
            };

            const specialText = specialRequests ? `Special requirements: ${specialRequests}` : '';

            let includeElements = [];
            if (includeSecrets) includeElements.push('secrets or hidden motivations');
            if (includeQuirks) includeElements.push('personality quirks and distinctive mannerisms');
            if (includeHooks) includeElements.push('plot hooks and story connections');

            const includeText = includeElements.length > 0 ?
                `Include: ${includeElements.join(', ')}.` : '';

            const systemPrompt = `You are a master game master and character creator. Design a compelling NPC for a ${setting} setting that will enhance the gaming experience.

CHARACTER PARAMETERS:
- Role: ${roleDescription}
- Setting: ${setting}
- Importance: ${importanceInstructions[importance]}
${specialText}
${includeText}

CREATE A COMPLETE NPC PROFILE INCLUDING:

1. **Basic Information** - Name, age, physical description, occupation
2. **Personality & Behavior** - Core traits, how they interact, speech patterns
3. **Background & History** - Personal history, important events, current situation
4. **Roleplay Notes** - How to portray them, key phrases, motivations
5. **Story Integration** - Secrets, plot hooks, how they help/hinder players

Make this NPC memorable, useful for the game, and easy for a GM to portray consistently.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a ${roleDescription} NPC for a ${setting} setting.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: importance === 'central' ? 2000 : importance === 'major' ? 1500 : 1000,
                temperature: 0.7
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `<div class="result-display">${htmlContent}</div>`;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating NPC:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate NPC. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const npcRole = document.getElementById('npcRole').value;
        const setting = document.getElementById('setting').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create a completely different NPC with the same role and setting but different personality, background, and approach.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create an alternative ${npcRole} NPC for a ${setting} setting.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 1500,
                temperature: 0.8
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `<div class="result-display">${htmlContent}</div>`;

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
        const npcRole = document.getElementById('npcRole').value || 'npc';
        const filename = `npc_${npcRole.replace(/[^a-zA-Z0-9]/g, '_')}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('specialRequests').value = '';
        document.getElementById('customRole').value = '';
        document.getElementById('npcRole').value = '';
        document.getElementById('setting').value = 'fantasy';
        document.getElementById('importance').value = 'recurring';
        document.getElementById('customRoleGroup').style.display = 'none';
    }

    // Make functions globally available
    window.generateNPC = generateNPC;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});