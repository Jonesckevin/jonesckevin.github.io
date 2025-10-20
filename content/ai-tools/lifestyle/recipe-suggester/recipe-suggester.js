// Recipe Suggester Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Recipe suggester script loaded');

    // Global variables
    let currentResult = '';
    let currentMarkdown = '';

    // Utility functions
    function showError(message) {
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = `
            <div style="color: #ff6666; padding: 15px; background: rgba(255,68,68,0.1); border-radius: 8px; border: 2px solid #ff4444; margin-top: 20px;">
                <strong>⚠️ Error:</strong> ${message}
            </div>`;
        errorDiv.style.display = 'block';
    }

    function hideError() {
        document.getElementById('errorDiv').style.display = 'none';
    }

    function formatMarkdown(text) {
        currentMarkdown = text;  // Store original markdown
        let html = text;         // Enhanced markdown formatting with better line break handling
        const codeBlocks = [];   // First, protect code blocks from processing
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            codeBlocks.push(code);
            return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
        });

        // Process headers (must be on their own line)
        html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Process bold and italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Process lists - must be on own lines
        html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
        html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');

        // Wrap consecutive <li> elements in <ul>
        html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => {
            return '<ul>' + match + '</ul>';
        });

        // Restore code blocks
        html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
            return `<code>${codeBlocks[index]}</code>`;
        });

        // Convert paragraphs - double newlines become paragraph breaks
        html = html.split(/\n\n+/).map(para => {
            para = para.trim();
            // Don't wrap if already a block element
            if (para.match(/^<(h[1-6]|ul|ol|li|div|p|blockquote)/)) {
                return para;
            }
            // Don't wrap empty strings
            if (!para) return '';
            // Wrap in paragraph
            return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
        }).join('\n');

        return html;
    }

    function getCurrentTimestamp() {
        return new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    }

    // Main recipe generation function
    window.generateRecipes = async function () {
        console.log('=== GENERATE RECIPES FUNCTION CALLED ===');

        // Hide previous results/errors
        hideError();
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const ingredients = document.getElementById('ingredients').value.trim();
        const mealType = document.getElementById('mealType').value;
        const cuisineTheme = document.getElementById('cuisineTheme').value;
        const dietaryPreference = document.getElementById('dietaryPreference').value;
        const cookingTime = document.getElementById('cookingTime').value;
        const skillLevel = document.getElementById('skillLevel').value;
        const numberOfRecipes = document.getElementById('numberOfRecipes').value;
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        console.log('Form values:', {
            ingredients: ingredients.substring(0, 50) + '...',
            mealType,
            cuisineTheme,
            dietaryPreference,
            cookingTime,
            skillLevel,
            numberOfRecipes,
            additionalNotes
        });

        // Validation
        if (!ingredients) {
            showError('Please enter at least one ingredient.');
            return;
        }

        // Parse ingredients
        const ingredientList = ingredients.split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        if (ingredientList.length === 0) {
            showError('Please enter at least one valid ingredient.');
            return;
        }

        console.log('Parsed ingredients:', ingredientList);

        // Check API configuration
        const provider = apiManager.getProvider();
        const apiKey = apiManager.getApiKey();

        console.log('API Provider:', provider);
        console.log('API Key present:', !!apiKey);

        // Validate API key (simple check - just ensure it exists)
        if (!apiKey) {
            showError('Please configure your AI API key using the settings menu (⚙️) at the top of the page.');
            return;
        }

        console.log('API Key validation passed');

        // Build the prompt
        let prompt = `You are a creative and knowledgeable chef assistant. Based on the following ingredients and preferences, generate ${numberOfRecipes} detailed recipe suggestions.\n\n`;
        prompt += `**Available Ingredients:**\n${ingredientList.map(i => `- ${i}`).join('\n')}\n\n`;

        prompt += `**Preferences:**\n`;
        if (mealType && mealType !== 'any') prompt += `- Meal Type: ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}\n`;
        if (cuisineTheme && cuisineTheme !== 'any') prompt += `- Cuisine: ${cuisineTheme.charAt(0).toUpperCase() + cuisineTheme.slice(1)}\n`;
        if (dietaryPreference && dietaryPreference !== 'none') prompt += `- Dietary Restriction: ${dietaryPreference.charAt(0).toUpperCase() + dietaryPreference.slice(1)}\n`;
        if (cookingTime && cookingTime !== 'any') prompt += `- Cooking Time: ${cookingTime.charAt(0).toUpperCase() + cookingTime.slice(1)}\n`;
        if (skillLevel && skillLevel !== 'any') prompt += `- Skill Level: ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}\n`;
        if (additionalNotes) prompt += `- Additional Notes: ${additionalNotes}\n`;

        prompt += `\nFor each recipe, please provide:\n`;
        prompt += `1. Recipe name (as a level 2 header: ## Recipe Name)\n`;
        prompt += `2. Brief description\n`;
        prompt += `3. Prep time and cook time\n`;
        prompt += `4. Servings\n`;
        prompt += `5. Ingredient list (with quantities)\n`;
        prompt += `6. Step-by-step instructions\n`;
        prompt += `7. Optional: Nutritional highlights or chef's tips\n\n`;
        prompt += `Please format your response in markdown with clear headers and lists. Make the recipes creative, practical, and delicious!`;

        console.log('Prompt prepared, length:', prompt.length);

        // Show loading indicator
        document.getElementById('loadingDiv').style.display = 'flex';

        try {
            console.log('Making API request...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are a creative and experienced chef assistant who specializes in creating delicious, practical recipes using available ingredients. You provide detailed, easy-to-follow instructions and helpful cooking tips.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ];

            // Make the API request
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 4000,
                temperature: 0.8 // Higher temperature for more creative recipes
            });

            console.log('API response received, length:', response ? response.length : 0);
            console.log('Response preview:', response ? response.substring(0, 100) : 'null');

            // Hide loading
            document.getElementById('loadingDiv').style.display = 'none';

            // API manager returns the content directly as a string, not an object
            if (response && response.length > 0) {
                currentResult = response;
                console.log('Result stored, length:', currentResult.length);

                // Format and display result
                const formattedHtml = formatMarkdown(currentResult);
                document.getElementById('resultContent').innerHTML = formattedHtml;
                document.getElementById('resultDiv').style.display = 'block';

                // Scroll to results
                document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                throw new Error('No content received from AI');
            }

        } catch (error) {
            console.error('Error generating recipes:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate recipe suggestions. ';
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key configuration.';
            } else if (error.message.includes('rate limit')) {
                errorMessage += 'Rate limit reached. Please try again in a moment.';
            } else if (error.message.includes('network')) {
                errorMessage += 'Network error. Please check your connection.';
            } else {
                errorMessage += error.message || 'Please try again.';
            }

            showError(errorMessage);
        }
    };

    // Copy to clipboard function
    window.copyResult = async function (event) {
        console.log('Copy function called');

        if (!currentMarkdown) {
            console.error('No markdown content available');
            showError('No content to copy');
            return;
        }

        console.log('Attempting to copy', currentMarkdown.length, 'characters');

        try {
            // Try using the download manager first
            if (typeof downloadManager !== 'undefined' && downloadManager.setContent) {
                downloadManager.setContent(currentMarkdown, 'markdown');
                const success = await downloadManager.copyToClipboard('markdown');

                if (success) {
                    console.log('Copy successful via download manager');
                    // Show success feedback
                    if (event && event.target) {
                        const btn = event.target;
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '✅ Copied!';
                        btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.style.background = '';
                        }, 2000);
                    }
                    return;
                }
            }

            // Fallback to direct clipboard API
            await navigator.clipboard.writeText(currentMarkdown);
            console.log('Copy successful via navigator.clipboard');

            // Show success feedback
            if (event && event.target) {
                const btn = event.target;
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Copied!';
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy:', err);

            // Last resort fallback - create a temporary textarea
            try {
                const textArea = document.createElement('textarea');
                textArea.value = currentMarkdown;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    console.log('Copy successful via execCommand');
                    if (event && event.target) {
                        const btn = event.target;
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '✅ Copied!';
                        btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.style.background = '';
                        }, 2000);
                    }
                    return;
                }
            } catch (fallbackErr) {
                console.error('Fallback copy also failed:', fallbackErr);
            }

            showError('Failed to copy to clipboard. Please try selecting and copying manually.');
        }
    };

    // Download functions
    window.downloadResult = function (format) {
        if (!currentMarkdown) {
            showError('No content to download');
            return;
        }

        try {
            // Set the content in download manager
            downloadManager.setContent(currentMarkdown, 'markdown');

            // Get timestamp for filename
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `recipe-suggestions`;

            // Use download manager's download method
            downloadManager.download(format, filename);

            // Show success feedback
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Downloaded!';

            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Download failed:', err);
            showError('Failed to download file. Please try again.');
        }
    };

    console.log('Recipe suggester initialized successfully');
});
