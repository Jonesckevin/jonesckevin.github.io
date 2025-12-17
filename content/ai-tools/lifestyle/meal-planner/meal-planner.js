// Weekly Meal Planner Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Meal planner script loaded');

    // Global variable to store current result
    let currentResult = '';

    // Register standard copy/download actions
    utils.registerToolActions('meal-planner', () => currentResult);

    // Main meal plan generation function
    window.generateMealPlan = async function () {
        console.log('=== GENERATE MEAL PLAN FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const numberOfDays = document.getElementById('numberOfDays').value;
        const householdSize = document.getElementById('householdSize').value;
        const includeBreakfast = document.getElementById('includeBreakfast').checked;
        const includeLunch = document.getElementById('includeLunch').checked;
        const includeDinner = document.getElementById('includeDinner').checked;
        const includeSnacks = document.getElementById('includeSnacks').checked;
        const dietaryPreference = document.getElementById('dietaryPreference').value;
        const budgetLevel = document.getElementById('budgetLevel').value;
        const cookingTime = document.getElementById('cookingTime').value;
        const cuisineVariety = document.getElementById('cuisineVariety').value;
        const existingIngredients = document.getElementById('existingIngredients').value.trim();
        const avoidIngredients = document.getElementById('avoidIngredients').value.trim();
        const additionalPreferences = document.getElementById('additionalPreferences').value.trim();

        console.log('Form values collected');

        // Validation - at least one meal type must be selected
        if (!includeBreakfast && !includeLunch && !includeDinner && !includeSnacks) {
            utils.showError(document.getElementById('errorDiv'), 'Please select at least one meal type to plan.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Build meal types array
        const mealTypes = [];
        if (includeBreakfast) mealTypes.push('Breakfast');
        if (includeLunch) mealTypes.push('Lunch');
        if (includeDinner) mealTypes.push('Dinner');
        if (includeSnacks) mealTypes.push('Snacks');

        // Build the prompt
        let prompt = `You are an expert meal planning nutritionist. Create a detailed ${numberOfDays}-day meal plan for ${householdSize} ${householdSize === '1' ? 'person' : 'people'}.\n\n`;

        prompt += `**Requirements:**\n`;
        prompt += `- Include ${mealTypes.join(', ')} for each day\n`;
        prompt += `- Household size: ${householdSize} ${householdSize === '1' ? 'person' : 'people'}\n`;
        if (dietaryPreference && dietaryPreference !== 'none') prompt += `- Dietary preference: ${dietaryPreference}\n`;
        prompt += `- Budget level: ${budgetLevel}\n`;
        prompt += `- Cooking time preference: ${cookingTime}\n`;
        prompt += `- Cuisine variety: ${cuisineVariety}\n`;

        if (existingIngredients) {
            const existingList = existingIngredients.split('\n').map(i => i.trim()).filter(i => i);
            if (existingList.length > 0) {
                prompt += `\n**Ingredients to Incorporate (already available):**\n${existingList.map(i => `- ${i}`).join('\n')}\n`;
            }
        }

        if (avoidIngredients) {
            const avoidList = avoidIngredients.split('\n').map(i => i.trim()).filter(i => i);
            if (avoidList.length > 0) {
                prompt += `\n**Ingredients to AVOID:**\n${avoidList.map(i => `- ${i}`).join('\n')}\n`;
            }
        }

        if (additionalPreferences) {
            prompt += `\n**Additional Preferences:**\n${additionalPreferences}\n`;
        }

        prompt += `\n**Please provide:**\n\n`;
        prompt += `## Weekly Meal Plan\n`;
        prompt += `For each day, list all meals with:\n`;
        prompt += `- Meal name\n`;
        prompt += `- Brief description\n`;
        prompt += `- Estimated prep + cook time\n\n`;

        prompt += `## Smart Grocery List\n`;
        prompt += `Organize ingredients by category (Produce, Proteins, Dairy, Pantry, etc.) with quantities needed for the entire week.\n\n`;

        prompt += `## Recommended Next Steps\n`;
        prompt += `- Meal prep suggestions (what can be prepped in advance)\n`;
        prompt += `- Shopping tips\n`;
        prompt += `- Time-saving strategies\n`;
        prompt += `- Storage recommendations\n\n`;

        prompt += `Format your response in clear markdown with headers, lists, and organized sections. Make it practical and easy to follow!`;

        console.log('Prompt prepared');

        // Show loading indicator
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Creating your personalized weekly meal plan...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            console.log('Making API request...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are an expert meal planning nutritionist who creates balanced, practical, and delicious weekly meal plans. You provide detailed grocery lists and helpful meal prep advice.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ];

            // Make the API request
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 5000,
                temperature: 0.7
            });

            console.log('API response received');

            // Hide loading
            document.getElementById('loadingDiv').style.display = 'none';

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
            console.error('Error generating meal plan:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate meal plan. ';
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key configuration.';
            } else if (error.message.includes('rate limit')) {
                errorMessage += 'Rate limit reached. Please try again in a moment.';
            } else {
                errorMessage += error.message || 'Please try again.';
            }

            utils.showError(document.getElementById('errorDiv'), errorMessage);
            document.getElementById('errorDiv').style.display = 'block';
        }
    };
});
    };
});
