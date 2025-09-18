document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    const systemPrompts = {
        'global-empathy': 'Identify one current tragic event affecting lives worldwide. Compose a heartfelt, hopeful tweet expressing concern and solidarity. Focus on human compassion and avoid graphic descriptions.',
        'hope-headlines': 'Scan recent global tragedies. Choose one and write a tweet that sends love to those affected and calls for compassion. Emphasize hope and collective support.',
        'silent-stories': 'Find a lesser-known but deeply impactful event. Write a supportive tweet reminding others to care and take notice. Highlight overlooked communities with dignity.',
        'united-humanity': 'Select a top tragic world event. Generate a tweet that focuses on shared humanity and the desire for healing and help. Unite rather than divide.',
        'forgotten': 'Uncover one underreported tragedy. Craft a tweet that mourns the losses and uplifts those working to make things better. Honor resilience and hope.'
    };
    async function generateResponse() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const systemPromptKey = document.getElementById('systemPrompt').value;
        const outputStyle = document.getElementById('outputStyle').value;
        const maxLength = document.getElementById('maxLength').value;
        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }
        if (!systemPromptKey) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a system prompt');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }
        // Persist to manager
        apiManager.setProvider(aiProvider);
        apiManager.setApiKey(apiKey);
        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';
        try {
            const systemPrompt = systemPrompts[systemPromptKey];
            const styleInstructions = {
                'formal': 'Use formal, respectful language.',
                'poetic': 'Use poetic, metaphorical language that evokes emotion.',
                'minimalist': 'Use simple, concise language with powerful impact.',
                'neutral': 'Use clear, straightforward language.'
            };
            const messages = [
                {
                    role: 'system',
                    content: `${systemPrompt} ${styleInstructions[outputStyle]} Keep the response under ${maxLength} characters. Always end with appropriate hashtags like #HopeForHumanity, #GlobalSolidarity, or relevant location/cause hashtags. Be respectful, avoid politics, and focus on human compassion.`
                },
                {
                    role: 'user',
                    content: 'Please generate a compassionate response following the system prompt guidelines.'
                }
            ];
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 200,
                temperature: 0.8
            });
            currentResult = response;
            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                        <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 15px;">${htmlContent}</div>
                        <div style="text-align: right; opacity: 0.7; font-size: 0.9rem;">
                            Character count: ${response.length}/${maxLength}
                        </div>
                    </div>
                `;
            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error generating response:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate response. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }
    async function generateVariation() {
        if (!currentResult) return;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const systemPromptKey = document.getElementById('systemPrompt').value;
        const outputStyle = document.getElementById('outputStyle').value;
        const maxLength = document.getElementById('maxLength').value;
        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';
        try {
            const systemPrompt = systemPrompts[systemPromptKey];
            const styleInstructions = {
                'formal': 'Use formal, respectful language.',
                'poetic': 'Use poetic, metaphorical language that evokes emotion.',
                'minimalist': 'Use simple, concise language with powerful impact.',
                'neutral': 'Use clear, straightforward language.'
            };
            const messages = [
                {
                    role: 'system',
                    content: `Create a different variation of a compassionate response. ${systemPrompt} ${styleInstructions[outputStyle]} Keep the response under ${maxLength} characters. Use different wording and approach while maintaining the same compassionate spirit.`
                },
                {
                    role: 'user',
                    content: 'Please generate a new variation of a compassionate response following the guidelines.'
                }
            ];
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 200,
                temperature: 0.9
            });
            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                        <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 15px;">${htmlContent}</div>
                        <div style="text-align: right; opacity: 0.7; font-size: 0.9rem;">
                            Character count: ${response.length}/${maxLength}
                        </div>
                    </div>
                `;
            document.getElementById('loadingDiv').style.display = 'none';
        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), 'Failed to generate variation. Please try again.');
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
                    button.style.background = 'linear-gradient(135deg, #ff6b35, #ff8c69)';
                }, 2000);
            }
        });
    }
    function downloadResult(format) {
        const systemPromptKey = document.getElementById('systemPrompt').value;
        const timestamp = new Date().toISOString().slice(0, 10);
        // Set content in download manager
        downloadManager.setContent(currentResult, 'markdown');
        switch (format) {
            case 'markdown':
                downloadManager.download('markdown', `compassionate_response_${systemPromptKey}_${timestamp}`);
                break;
            case 'html':
                downloadManager.download('html', `compassionate_response_${systemPromptKey}_${timestamp}`);
                break;
        }
    }
    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('systemPrompt').value = '';
        document.getElementById('outputStyle').value = 'neutral';
        document.getElementById('maxLength').value = '280';
        document.getElementById('systemPrompt').focus();
    }
    // Make functions globally available for onclick handlers
    window.generateResponse = generateResponse;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});
