document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Show/hide custom race description
    document.getElementById('characterRace').addEventListener('change', function () {
        const customGroup = document.getElementById('customRaceGroup');
        if (this.value === 'custom') {
            customGroup.style.display = 'block';
        } else {
            customGroup.style.display = 'none';
        }
    });

    async function generateDnDCharacter() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const characterName = document.getElementById('characterName').value.trim();
        const characterClass = document.getElementById('characterClass').value;
        const characterRace = document.getElementById('characterRace').value;
        const customRace = document.getElementById('customRace').value.trim();
        const storyLength = document.getElementById('storyLength').value;
        const backgroundTraits = document.getElementById('backgroundTraits').value.trim();
        const includeBonus = document.getElementById('includeBonus').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!characterName) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter a character name');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!characterClass || !characterRace) {
            utils.showError(document.getElementById('errorDiv'), 'Please select both class and race');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (characterRace === 'custom' && !customRace) {
            utils.showError(document.getElementById('errorDiv'), 'Please describe your custom race');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const lengthInstructions = {
                'short': 'Write a concise but compelling backstory of approximately 150 words.',
                'heroic': 'Create a detailed heroic chronicle of approximately 500 words with rich background.',
                'epic': 'Develop an epic saga of 1000+ words with extensive lore and world-building.'
            };

            const raceDescription = characterRace === 'custom' ? customRace : characterRace;
            const traitsText = backgroundTraits ? `\nAdditional background elements: ${backgroundTraits}` : '';
            const bonusText = includeBonus ? '\nInclude creative bonus elements like battle cries, favorite drinks, recurring dreams, mysterious prophecies, or unique quirks.' : '';

            const systemPrompt = `You are a master storyteller and D&D lorekeeper. Generate authentic, creative character backstories that fit seamlessly into D&D 5E campaigns. Create compelling narratives that provide rich roleplay opportunities and integrate well with typical campaign settings.

CHARACTER DETAILS:
- Name: ${characterName}
- Class: ${characterClass}
- Race: ${raceDescription}${traitsText}

${lengthInstructions[storyLength]}${bonusText}

Your response must include:

1. **Origin Story**: Where they came from and formative experiences
2. **Motivations**: What drives them to adventure
3. **Personality Traits**: 2-3 defining characteristics  
4. **Flaws**: Meaningful character weaknesses or struggles
5. **Bonds**: Important relationships or connections
6. **Ideals**: Core beliefs or values
7. **Background Details**: Occupation, family, significant events
8. **Adventure Hook**: How they might join a party or begin campaigns

WRITING GUIDELINES:
- Make it campaign-ready with clear roleplay opportunities
- Include specific details that DMs can use in storytelling
- Ensure racial and class features are naturally woven into the narrative
- Create compelling internal conflicts and goals
- Use evocative D&D fantasy language and tone
- Make the character feel authentic and three-dimensional

Write an engaging backstory that brings this character to life!`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a D&D character backstory for ${characterName}, a ${characterRace} ${characterClass}.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: storyLength === 'epic' ? 3000 : storyLength === 'heroic' ? 1500 : 800,
                temperature: 0.8
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7; color: #e0e0e0;">${htmlContent}</div>
                </div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating D&D character:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate character lore. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const characterName = document.getElementById('characterName').value.trim();
        const characterClass = document.getElementById('characterClass').value;
        const characterRace = document.getElementById('characterRace').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create an alternative backstory for the same D&D character. Use different origins, motivations, and story elements while keeping the same name, race, and class. Explore a completely different path this character could have taken.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create an alternative backstory for ${characterName}, a ${characterRace} ${characterClass}.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.9
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7; color: #e0e0e0;">${htmlContent}</div>
                </div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative backstory. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult() {
        utils.copyToClipboard(currentResult).then(success => {
            if (success) {
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                button.style.background = 'linear-gradient(135deg, #44ff44, #66ff66)';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                }, 2000);
            }
        });
    }

    function downloadResult(format) {
        const characterName = document.getElementById('characterName').value || 'dnd-character';
        const filename = `dnd-character_${characterName.replace(/[^a-zA-Z0-9]/g, '_')}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('characterName').value = '';
        document.getElementById('backgroundTraits').value = '';
        document.getElementById('customRace').value = '';
        document.getElementById('characterClass').value = '';
        document.getElementById('characterRace').value = '';
        document.getElementById('storyLength').value = 'heroic';
        document.getElementById('customRaceGroup').style.display = 'none';
    }

    // Make functions globally available for onclick handlers
    window.generateDnDCharacter = generateDnDCharacter;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});