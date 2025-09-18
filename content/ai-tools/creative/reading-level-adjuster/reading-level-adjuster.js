document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let originalText = '';

    async function adjustReadingLevel() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        originalText = document.getElementById('originalText').value.trim();
        const targetLevel = document.getElementById('targetLevel').value;
        const contentType = document.getElementById('contentType').value;
        const preservationLevel = document.getElementById('preservationLevel').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const specialInstructions = document.getElementById('specialInstructions').value.trim();

        // Get checkbox values
        const simplifyVocabulary = document.getElementById('simplifyVocabulary').checked;
        const shortenSentences = document.getElementById('shortenSentences').checked;
        const addDefinitions = document.getElementById('addDefinitions').checked;
        const useExamples = document.getElementById('useExamples').checked;
        const improveStructure = document.getElementById('improveStructure').checked;
        const addTransitions = document.getElementById('addTransitions').checked;
        const removeJargon = document.getElementById('removeJargon').checked;
        const activeVoice = document.getElementById('activeVoice').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!originalText) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter the text to adjust');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!targetLevel) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a target reading level');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const levelDescriptions = {
                'elementary': 'Elementary school level (Grades 1-5): Use simple words, short sentences (5-10 words), basic concepts, and familiar vocabulary',
                'middle-school': 'Middle school level (Grades 6-8): Use moderate vocabulary, medium sentences (10-15 words), clearer explanations',
                'high-school': 'High school level (Grades 9-12): Use standard complexity, varied sentence structure, appropriate vocabulary',
                'college': 'College level: Use advanced vocabulary, complex sentences, sophisticated concepts and analysis',
                'graduate': 'Graduate/Professional level: Use technical terminology, complex analysis, specialized vocabulary',
                'simplified-adult': 'Simplified adult reading: Clear, accessible language for adult readers with basic literacy',
                'esl-beginner': 'ESL beginner level: Simple vocabulary, basic grammar, common words, clear structure',
                'esl-intermediate': 'ESL intermediate level: Moderate vocabulary, standard grammar, cultural context',
                'plain-language': 'Plain language standard: Government/legal clarity, direct communication, actionable information',
                'technical-simplified': 'Technical simplified: Complex topics explained with simple, clear language'
            };

            const contentTypeInstructions = {
                'educational': 'Maintain educational value and learning objectives',
                'technical': 'Preserve technical accuracy while improving accessibility',
                'scientific': 'Keep scientific precision but explain complex concepts',
                'legal': 'Maintain legal accuracy while improving readability',
                'medical': 'Preserve medical accuracy while making it understandable',
                'business': 'Keep professional tone while improving clarity',
                'news': 'Maintain journalistic standards and factual accuracy',
                'instruction': 'Ensure steps remain clear and actionable',
                'creative': 'Preserve creative voice and style while adjusting complexity'
            };

            const preservationInstructions = {
                'balanced': 'Balance simplicity with accuracy - make reasonable adjustments',
                'meaning-first': 'Preserve exact meaning and nuance even if slightly more complex',
                'simplicity-first': 'Prioritize maximum readability and simplicity',
                'length-preserve': 'Keep approximately the same length as the original'
            };

            let adjustmentOptions = [];
            if (simplifyVocabulary) adjustmentOptions.push('simplify vocabulary');
            if (shortenSentences) adjustmentOptions.push('shorten sentences');
            if (addDefinitions) adjustmentOptions.push('add definitions for complex terms');
            if (useExamples) adjustmentOptions.push('include examples and analogies');
            if (improveStructure) adjustmentOptions.push('improve text structure');
            if (addTransitions) adjustmentOptions.push('add transition words');
            if (removeJargon) adjustmentOptions.push('remove or explain jargon');
            if (activeVoice) adjustmentOptions.push('convert to active voice');

            const adjustmentText = adjustmentOptions.length > 0 ?
                `Focus on: ${adjustmentOptions.join(', ')}.` : '';

            const specialText = specialInstructions ?
                `Special requirements: ${specialInstructions}` : '';

            const formatInstructions = {
                'text-only': 'Provide only the adjusted text',
                'comparison': 'Show both original and adjusted text side by side',
                'highlighted': 'Show the adjusted text with changes highlighted or marked',
                'analysis': 'Include a readability analysis explaining the changes made',
                'suggestions': 'Include suggestions for further improvement'
            };

            const systemPrompt = `You are an expert in text simplification and readability. Adjust the given text to the specified reading level while preserving meaning and essential information.

TARGET LEVEL: ${levelDescriptions[targetLevel]}
CONTENT TYPE: ${contentTypeInstructions[contentType] || 'General text'}
PRESERVATION: ${preservationInstructions[preservationLevel]}
${adjustmentText}
${specialText}

OUTPUT FORMAT: ${formatInstructions[outputFormat]}

GUIDELINES:
1. Maintain the core message and important information
2. Use appropriate vocabulary for the target audience
3. Adjust sentence length and complexity appropriately
4. Ensure logical flow and organization
5. Consider the specific content type requirements
6. Make the text accessible without losing essential meaning

Adjust the text according to these specifications.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Adjust this text to ${targetLevel} reading level:\n\n${originalText}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: Math.max(2000, originalText.length * 2),
                temperature: 0.4
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
            console.error('Error adjusting reading level:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to adjust reading level. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function analyzeReadability() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Analyze the readability of the adjusted text. Provide:
1. Estimated reading level/grade
2. Key readability metrics (sentence length, word complexity, etc.)
3. Strengths of the current version
4. Areas that could be improved further
5. Comparison with typical standards for the target audience`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Analyze the readability of this text:\n\n${currentResult}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 1000,
                temperature: 0.3
            });

            const analysisHtml = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <h4 style="color: #ff6b35; margin-bottom: 15px;">Adjusted Text:</h4>
                    <div style="line-height: 1.7; color: #e0e0e0; margin-bottom: 25px;">${utils.formatMarkdown(currentResult)}</div>
                    <hr style="border: 1px solid rgba(255, 107, 53, 0.3); margin: 20px 0;">
                    <h4 style="color: #ff6b35; margin-bottom: 15px;">📊 Readability Analysis:</h4>
                    <div style="line-height: 1.7; color: #e0e0e0;">${analysisHtml}</div>
                </div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error analyzing readability:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to analyze readability. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult || !originalText) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const targetLevel = document.getElementById('targetLevel').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create an alternative version of the text adjustment using a different approach while maintaining the same target reading level. Try different sentence structures, explanations, or organization methods.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create an alternative ${targetLevel} version of this original text:\n\n${originalText}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: Math.max(2000, originalText.length * 2),
                temperature: 0.6
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
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate variation. Please try again.');
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
        const targetLevel = document.getElementById('targetLevel').value || 'adjusted-text';
        const filename = `reading-level-${targetLevel}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function adjustNew() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('originalText').value = '';
        document.getElementById('specialInstructions').value = '';
        document.getElementById('targetLevel').value = '';
        document.getElementById('contentType').value = 'general';
        document.getElementById('preservationLevel').value = 'balanced';
        document.getElementById('outputFormat').value = 'text-only';
        document.getElementById('originalText').focus();
    }

    // Make functions globally available for onclick handlers
    window.adjustReadingLevel = adjustReadingLevel;
    window.analyzeReadability = analyzeReadability;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.adjustNew = adjustNew;
});