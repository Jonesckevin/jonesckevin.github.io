document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let currentSettings = {};

    // Ensure result containers exist; create them if missing
    function ensureResultContainers() {
        let resultDiv = document.getElementById('resultDiv');
        let resultContent = document.getElementById('resultContent');
        let errorDiv = document.getElementById('errorDiv');
        let loadingDiv = document.getElementById('loadingDiv');

        // Only create if truly missing - the HTML already has proper structure
        if (!resultDiv) {
            const form = document.getElementById('open-prompt-form');
            resultDiv = document.createElement('div');
            resultDiv.id = 'resultDiv';
            resultDiv.className = 'result-container';
            resultDiv.style.cssText = 'display:none;';
            resultDiv.innerHTML = `
                <h3 style="color: #ff6b35; margin-bottom: 20px;">AI Response</h3>
                <div id="resultContent" class="result-content"></div>
                <div class="result-actions" style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
                    <button class="action-btn copy-btn" onclick="copyResult()">Copy Output</button>
                    <button class="action-btn download-btn" onclick="downloadResult('markdown')">MD</button>
                    <button class="action-btn download-btn" onclick="downloadResult('html')">HTML</button>
                    <button class="action-btn regenerate-btn" onclick="generateVariation()">Generate Variation</button>
                </div>
            `;
            if (form && form.parentNode) {
                form.parentNode.insertBefore(resultDiv, form.nextSibling);
            } else {
                document.body.appendChild(resultDiv);
            }
            resultContent = document.getElementById('resultContent');
        } else if (!resultContent) {
            // resultDiv exists but resultContent is missing - create it
            resultContent = document.createElement('div');
            resultContent.id = 'resultContent';
            resultContent.className = 'result-content';
            // Insert before the button container
            const buttonContainer = resultDiv.querySelector('div[style*="margin-top: 30px"]');
            if (buttonContainer) {
                resultDiv.insertBefore(resultContent, buttonContainer);
            } else {
                resultDiv.appendChild(resultContent);
            }
        }

        // Create error/loading only if missing
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorDiv';
            errorDiv.style.display = 'none';
            if (resultDiv && resultDiv.parentNode) {
                resultDiv.parentNode.insertBefore(errorDiv, resultDiv);
            } else {
                document.body.appendChild(errorDiv);
            }
        }

        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingDiv';
            loadingDiv.className = 'loading';
            loadingDiv.style.display = 'none';
            loadingDiv.textContent = 'Generating your response...';
            if (resultDiv && resultDiv.parentNode) {
                resultDiv.parentNode.insertBefore(loadingDiv, resultDiv);
            } else {
                document.body.appendChild(loadingDiv);
            }
        }

        return { resultDiv, resultContent, errorDiv, loadingDiv };
    }

    // Build system prompt based on selected settings
    function buildSystemPrompt(settings) {
        let styleGuide = '';
        
        // Map response style to instructions
        const styleMap = {
            'balanced': 'Maintain a professional yet approachable tone. Be informative and clear.',
            'casual': 'Use a conversational, friendly tone. Write as if talking to a peer.',
            'formal': 'Use formal, professional language. Maintain strict structure and proper grammar.',
            'technical': 'Focus on technical accuracy and precision. Use domain-specific terminology appropriately.',
            'creative': 'Be imaginative and expressive. Use vivid language and creative approaches.',
            'analytical': 'Emphasize logical reasoning and data-driven insights. Break down complex concepts.',
            'educational': 'Teach clearly with examples. Explain concepts thoroughly for understanding.'
        };

        // Map response length to token guidance
        const lengthMap = {
            'concise': 'Keep responses brief and to the point. Aim for 100-200 words.',
            'moderate': 'Provide standard detailed responses. Aim for 300-500 words.',
            'comprehensive': 'Give thorough, in-depth responses. Aim for 600-1000 words.',
            'extensive': 'Provide extensive detail with full context and background. Aim for 1000+ words.'
        };

        // Map response tone
        const toneMap = {
            'neutral': 'Maintain objectivity and avoid bias.',
            'enthusiastic': 'Show positive energy and encouragement.',
            'empathetic': 'Demonstrate understanding and provide supportive responses.',
            'authoritative': 'Project confidence and expertise.',
            'humorous': 'Include appropriate humor while staying relevant.',
            'diplomatic': 'Be tactful and balanced, considering multiple perspectives.'
        };

        // Map output format
        const formatMap = {
            'paragraph': 'Format response in natural flowing paragraphs.',
            'bullets': 'Use bullet points to organize information clearly.',
            'numbered': 'Use numbered lists for sequential steps or ordered items.',
            'structured': 'Use clear headings and sections to organize the response.',
            'mixed': 'Use a combination of paragraphs, lists, and headings as appropriate.'
        };

        styleGuide = `
RESPONSE GUIDELINES:
- Style: ${styleMap[settings.responseStyle] || styleMap['balanced']}
- Length: ${lengthMap[settings.responseLength] || lengthMap['moderate']}
- Tone: ${toneMap[settings.responseTone] || toneMap['neutral']}
- Format: ${formatMap[settings.outputFormat] || formatMap['paragraph']}
`;

        if (settings.focusArea) {
            styleGuide += `- Focus Area: Pay special attention to ${settings.focusArea}\n`;
        }

        if (settings.includeExamples) {
            styleGuide += `- Include relevant examples and use cases to illustrate points\n`;
        }

        if (settings.includeSources) {
            styleGuide += `- Cite reasoning and mention applicable sources or methodologies\n`;
        }

        if (settings.additionalContext) {
            styleGuide += `\nADDITIONAL CONTEXT:\n${settings.additionalContext}\n`;
        }

        const systemPrompt = `You are a versatile AI assistant designed to provide helpful, accurate, and well-crafted responses to user queries.
${styleGuide}

INSTRUCTIONS:
1. Read and understand the user's input carefully
2. Apply the specified style, tone, length, and format guidelines
3. Provide a helpful, accurate, and relevant response
4. Maintain consistency with the specified settings throughout your response
5. Do not include meta-commentary about the response unless asked
`;

        return systemPrompt;
    }

    // Gather form settings
    function gatherSettings() {
        return {
            userInput: document.getElementById('userInput').value.trim(),
            responseStyle: document.getElementById('responseStyle').value,
            responseLength: document.getElementById('responseLength').value,
            responseTone: document.getElementById('responseTone').value,
            outputFormat: document.getElementById('outputFormat').value,
            focusArea: document.getElementById('focusArea').value.trim(),
            additionalContext: document.getElementById('additionalContext').value.trim(),
            includeExamples: document.getElementById('includeExamples').checked,
            includeSources: document.getElementById('includeSources').checked
        };
    }

    // Main generation function
    window.generateResponse = async function() {
        console.log('=== GENERATE RESPONSE FUNCTION CALLED ===');

        const settings = gatherSettings();
        
        // Validate user input
        if (!settings.userInput) {
            const { errorDiv } = ensureResultContainers();
            if (errorDiv) {
                utils.showError(errorDiv, 'Please enter your question or request.');
                errorDiv.style.display = 'block';
            }
            return;
        }

        // Store current settings for variation generation
        currentSettings = settings;

        console.log('Settings gathered:', settings);

        // Get or create DOM elements
        const { resultDiv, resultContent, errorDiv, loadingDiv } = ensureResultContainers();

        // Show loading
        if (errorDiv) errorDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'none';
        if (loadingDiv) loadingDiv.style.display = 'block';

        try {
            const systemPrompt = buildSystemPrompt(settings);
            
            console.log('System prompt built');

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: settings.userInput }
            ];

            console.log('Making API request...');

            // Determine max tokens based on length setting
            const maxTokensMap = {
                'concise': 500,
                'moderate': 1000,
                'comprehensive': 2000,
                'extensive': 3000
            };

            const maxTokens = maxTokensMap[settings.responseLength] || 1000;

            const response = await apiManager.makeRequest(messages, {
                maxTokens: maxTokens,
                temperature: 0.7
            });

            console.log('API response received');
            currentResult = response;

            // Guard: no content returned
            if (!response || (typeof response === 'string' && response.trim().length === 0)) {
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorDiv) {
                    utils.showError(errorDiv, 'The AI returned an empty response. Please try again or switch providers/models from the AI menu.');
                    errorDiv.style.display = 'block';
                }
                return;
            }

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            console.log('HTML content generated');

            if (resultContent) {
                const safeHtml = htmlContent && htmlContent.trim().length > 0
                    ? htmlContent
                    : utils.escapeHtml(currentResult || 'No content generated.');
                resultContent.innerHTML = safeHtml;
            }

            // Show result
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.style.visibility = 'visible';
                resultDiv.style.opacity = '1';
            }

            console.log('Results displayed successfully');
            
            // Scroll to result
            if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating response:', error);
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (errorDiv) {
                utils.showError(errorDiv, error.message || 'Failed to generate response. Please check your API key and try again.');
                errorDiv.style.display = 'block';
            }
        }
    };

    // Generate variation function
    window.generateVariation = async function() {
        console.log('=== GENERATE VARIATION FUNCTION CALLED ===');

        if (!currentResult || !currentSettings.userInput) {
            console.log('No previous result to vary');
            return;
        }

        const { resultDiv, resultContent, errorDiv, loadingDiv } = ensureResultContainers();

        // Show loading
        if (errorDiv) errorDiv.style.display = 'none';
        if (loadingDiv) {
            loadingDiv.textContent = 'Generating variation...';
            loadingDiv.style.display = 'block';
        }
        if (resultDiv) resultDiv.style.display = 'none';

        try {
            const systemPrompt = buildSystemPrompt(currentSettings);
            
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: currentSettings.userInput },
                { role: 'assistant', content: currentResult },
                { role: 'user', content: 'Please provide an alternative version of your response with a different approach or perspective, while maintaining the same style guidelines.' }
            ];

            console.log('Making API request for variation...');

            const maxTokensMap = {
                'concise': 500,
                'moderate': 1000,
                'comprehensive': 2000,
                'extensive': 3000
            };

            const maxTokens = maxTokensMap[currentSettings.responseLength] || 1000;

            const response = await apiManager.makeRequest(messages, {
                maxTokens: maxTokens,
                temperature: 0.8 // Slightly higher temperature for more variation
            });

            console.log('Variation response received');
            currentResult = response;

            if (!response || response.trim().length === 0) {
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorDiv) {
                    utils.showError(errorDiv, 'Failed to generate variation. Please try again.');
                    errorDiv.style.display = 'block';
                }
                return;
            }

            const htmlContent = utils.formatMarkdown(response);

            if (resultContent) {
                const safeHtml = htmlContent && htmlContent.trim().length > 0
                    ? htmlContent
                    : utils.escapeHtml(currentResult || 'No content generated.');
                resultContent.innerHTML = safeHtml;
            }

            if (loadingDiv) {
                loadingDiv.style.display = 'none';
                loadingDiv.textContent = 'Generating your response...';
            }
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.style.visibility = 'visible';
                resultDiv.style.opacity = '1';
            }

            if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating variation:', error);
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
                loadingDiv.textContent = 'Generating your response...';
            }
            if (errorDiv) {
                utils.showError(errorDiv, error.message || 'Failed to generate variation.');
                errorDiv.style.display = 'block';
            }
        }
    };

    // Copy result to clipboard
    window.copyResult = function() {
        if (!currentResult) return;
        
        navigator.clipboard.writeText(currentResult).then(() => {
            // Visual feedback
            // Prefer specific role-based button for feedback
            const copyBtn = document.querySelector('.action-btn.copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    };

    // Download result in specified format
    window.downloadResult = function(format) {
        if (!currentResult) return;

        let content, filename, mimeType;

        if (format === 'markdown') {
            content = currentResult;
            filename = 'open-prompt-response.md';
            mimeType = 'text/markdown';
        } else if (format === 'html') {
            const htmlContent = utils.formatMarkdown(currentResult);
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Prompt Response</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
               line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
        h1, h2, h3 { color: #ff6b35; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ff6b35; margin: 0; padding-left: 20px; color: #666; }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
            filename = 'open-prompt-response.html';
            mimeType = 'text/html';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Handle Enter key in textarea (Ctrl+Enter to submit)
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                generateResponse();
            }
        });
    }

    console.log('Open Prompt tool initialized');
});
