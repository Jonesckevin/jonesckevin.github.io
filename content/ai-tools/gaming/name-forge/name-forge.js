document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Show/hide character gender when character type is selected
    document.getElementById('nameType').addEventListener('change', function () {
        const genderGroup = document.getElementById('characterGenderGroup');
        if (this.value === 'character') {
            genderGroup.style.display = 'block';
        } else {
            genderGroup.style.display = 'none';
        }
    });

    async function generateNames() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const nameType = document.getElementById('nameType').value;
        const genre = document.getElementById('genre').value;
        const characterGender = document.getElementById('characterGender').value;
        const culture = document.getElementById('culture').value;
        const nameCount = document.getElementById('nameCount').value;
        const nameStyle = document.getElementById('nameStyle').value;
        const specialRequests = document.getElementById('specialRequests').value.trim();

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!nameType) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a name type');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const typeDescriptions = {
                'character': 'character names (first names, full names, or surnames)',
                'place': 'place names for cities, towns, regions, landmarks, or geographical features',
                'organization': 'organization names for guilds, companies, groups, factions, or societies',
                'item': 'item and artifact names for weapons, magical items, treasures, or equipment',
                'ship': 'ship and vehicle names for boats, starships, aircraft, or other vessels',
                'business': 'business and establishment names for taverns, shops, inns, or services',
                'spell': 'spell and ability names for magical powers, techniques, or supernatural abilities',
                'creature': 'creature and monster names for beasts, mythical beings, or fantastical entities'
            };

            const styleDescriptions = {
                'balanced': 'a good mix of simple and complex names that are memorable but not overwhelming',
                'simple': 'simple, easy-to-pronounce names that are practical for gameplay',
                'exotic': 'unique and exotic names that stand out and create atmosphere',
                'regal': 'noble and impressive names with gravitas and authority',
                'mysterious': 'dark and intriguing names with mysterious or ominous undertones'
            };

            const genderText = nameType === 'character' && characterGender !== 'any' ?
                `Focus on ${characterGender} names.` : '';

            const cultureText = culture === 'mixed' ?
                'Draw from various cultural naming traditions' :
                `Use ${culture.replace('-', ' ')} cultural naming conventions`;

            const specialText = specialRequests ?
                `Special requirements: ${specialRequests}` : '';

            const systemPrompt = `You are a master name generator specializing in creating authentic, memorable names for various purposes across different genres and cultures.

GENERATE ${nameCount} ${typeDescriptions[nameType]} for a ${genre} setting.

PARAMETERS:
- Type: ${typeDescriptions[nameType]}
- Genre: ${genre}
- Cultural Style: ${cultureText}
- Name Style: ${styleDescriptions[nameStyle]}
${genderText}
${specialText}

GUIDELINES:
1. Create names that fit the specified genre and cultural style
2. Ensure names are appropriate for the type and context
3. Make them memorable and suitable for gaming/storytelling
4. Provide variety in length and complexity within the style
5. Consider pronunciation and ease of use
6. For character names, you may include both first and last names where appropriate

FORMAT: Present the names as a numbered list with brief explanations or origins where helpful.

Generate creative, authentic names that enhance the gaming experience!`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate ${nameCount} ${nameType} names for a ${genre} setting with ${culture} cultural style.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 1500,
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
            console.error('Error generating names:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate names. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateMoreNames() {
        if (!currentResult) return;

        const nameType = document.getElementById('nameType').value;
        const genre = document.getElementById('genre').value;
        const culture = document.getElementById('culture').value;
        const nameCount = document.getElementById('nameCount').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Generate ${nameCount} additional unique ${nameType} names for a ${genre} setting with ${culture} cultural style. Make them different from any previous generations but maintain the same quality and style.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate more ${nameType} names for ${genre} setting.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 1500,
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
            console.error('Error generating more names:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate more names. Please try again.');
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
        const nameType = document.getElementById('nameType').value || 'names';
        const filename = `names_${nameType}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('specialRequests').value = '';
        document.getElementById('nameType').value = '';
        document.getElementById('genre').value = 'fantasy';
        document.getElementById('culture').value = 'mixed';
        document.getElementById('nameCount').value = '10';
        document.getElementById('nameStyle').value = 'balanced';
        document.getElementById('characterGenderGroup').style.display = 'none';
    }

    // Make functions globally available
    window.generateNames = generateNames;
    window.generateMoreNames = generateMoreNames;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});