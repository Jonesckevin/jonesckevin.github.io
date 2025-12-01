document.addEventListener('DOMContentLoaded', function() {
    let currentResult = '';

    async function generateStory() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const storyGenre = document.getElementById('storyGenre').value;
        const storyLength = document.getElementById('storyLength').value;
        const mainCharacter = document.getElementById('mainCharacter').value.trim();
        const setting = document.getElementById('setting').value.trim();
        const storyPrompt = document.getElementById('storyPrompt').value.trim();
        const tone = document.getElementById('tone').value;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!storyGenre) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a story genre');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const lengthInstructions = {
                'flash': 'Write a flash fiction piece of 200-300 words',
                'short': 'Write a short story of 500-800 words',
                'medium': 'Write a medium-length story of 1000-1500 words',
                'long': 'Write a long story of 2000+ words'
            };

            const characterText = mainCharacter ? `Main character: ${mainCharacter}` : '';
            const settingText = setting ? `Setting: ${setting}` : '';
            const promptText = storyPrompt ? `Story prompt/theme: ${storyPrompt}` : '';

            const systemPrompt = `You are a skilled creative writer specializing in ${storyGenre} stories. Create an engaging, well-structured story that captures the reader's attention from beginning to end.

STORY REQUIREMENTS:
- Genre: ${storyGenre}
- Length: ${lengthInstructions[storyLength]}
- Tone: ${tone}
${characterText}
${settingText}
${promptText}

WRITING GUIDELINES:
1. Create a compelling opening that hooks the reader
2. Develop interesting characters with clear motivations
3. Build tension and conflict appropriate to the genre
4. Include vivid descriptions and dialogue
5. Provide a satisfying resolution
6. Use proper story structure (beginning, middle, end)
7. Match the tone throughout the story
8. Make it engaging and emotionally resonant

Write a complete, polished story that readers will enjoy and remember.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Write a ${storyGenre} story.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: storyLength === 'long' ? 3500 : storyLength === 'medium' ? 2500 : storyLength === 'short' ? 1500 : 800,
                temperature: 0.8
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
            console.error('Error generating story:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate story. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const storyGenre = document.getElementById('storyGenre').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create a completely different ${storyGenre} story with different characters, plot, and approach. Use the same genre but explore different themes and narrative styles.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Write an alternative ${storyGenre} story.` }
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
                <div class="result-display">${htmlContent}</div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative story. Please try again.');
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
        const storyGenre = document.getElementById('storyGenre').value || 'story';
        const filename = `story_${storyGenre}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('mainCharacter').value = '';
        document.getElementById('setting').value = '';
        document.getElementById('storyPrompt').value = '';
        document.getElementById('storyGenre').value = '';
        document.getElementById('storyLength').value = 'medium';
        document.getElementById('tone').value = 'balanced';
    }

    // Make functions globally available
    window.generateStory = generateStory;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});
