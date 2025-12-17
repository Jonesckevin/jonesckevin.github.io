// Recipe Suggester Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Recipe suggester script loaded');

    // Global variable to store current result
    let currentResult = '';

    // Main recipe generation function
    window.generateRecipes = async function () {
        console.log('=== GENERATE RECIPES FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
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
            utils.showError(document.getElementById('errorDiv'), 'Please enter at least one ingredient.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Parse ingredients
        const ingredientList = ingredients.split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        if (ingredientList.length === 0) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter at least one valid ingredient.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Parsed ingredients:', ingredientList);

        // Check API configuration
        const provider = apiManager.getProvider();

        console.log('API Provider:', provider);

        // API key validation is handled by apiManager - no need to check here
        // LMStudio and other local APIs don't require API keys

        console.log('Ready to generate recipes');

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
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Creating delicious recipe suggestions for you...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

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

            // API manager returns the content directly as a string
            if (response && response.length > 0) {
                currentResult = response;
                console.log('Result stored, length:', currentResult.length);

                // Use centralized formatMarkdown from utils
                document.getElementById('resultContent').innerHTML = utils.formatMarkdown(currentResult);
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

            utils.showError(document.getElementById('errorDiv'), errorMessage);
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    // Copy function using centralized utils
    window.copyResult = async function (event) {
        console.log('Copy function called');

        if (!currentResult) {
            console.error('No content available');
            utils.showError(document.getElementById('errorDiv'), 'No content to copy');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Attempting to copy', currentResult.length, 'characters');

        const success = await utils.copyToClipboard(currentResult);

        if (success && event?.target) {
            const btn = event.target;
            const originalText = btn.innerHTML;
            const originalBg = btn.style.background;

            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg || '';
            }, 2000);
        } else if (!success) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Failed to copy to clipboard. Please try selecting and copying manually.'
            );
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    // Download function using centralized downloadManager
    window.downloadResult = function (format) {
        console.log('Download function called, format:', format);

        if (!currentResult) {
            console.error('No content to download');
            utils.showError(document.getElementById('errorDiv'), 'No content to download');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        try {
            const timestamp = utils.getCurrentTimestamp();
            const filename = `recipe-suggestions`;

            // Use download manager's standard methods
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download(format, filename);

            console.log('Download initiated successfully');
        } catch (err) {
            console.error('Download failed:', err);
            utils.showError(document.getElementById('errorDiv'), 'Failed to download file. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    console.log('Recipe suggester initialized successfully');
});
