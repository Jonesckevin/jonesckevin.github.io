// Fitness Routine Generator Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Fitness routine script loaded');

    // Global variable to store current result
    let currentResult = '';

    // Register standard copy/download actions
    utils.registerToolActions('fitness-routine', () => currentResult);

    // Main fitness routine generation function
    window.generateFitnessRoutine = async function () {
        console.log('=== GENERATE FITNESS ROUTINE FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const fitnessGoal = document.getElementById('fitnessGoal').value;
        const fitnessLevel = document.getElementById('fitnessLevel').value;
        const workoutDays = document.getElementById('workoutDays').value;
        const workoutDuration = document.getElementById('workoutDuration').value;
        const workoutLocation = document.getElementById('workoutLocation').value;
        const limitations = document.getElementById('limitations').value.trim();
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        // Validation
        if (!fitnessGoal) {
            utils.showError(document.getElementById('errorDiv'), 'Please select your primary fitness goal.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!fitnessLevel) {
            utils.showError(document.getElementById('errorDiv'), 'Please select your current fitness level.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get equipment selections
        const equipment = [];
        if (document.getElementById('equipDumbbells').checked) equipment.push('Dumbbells');
        if (document.getElementById('equipBarbell').checked) equipment.push('Barbell');
        if (document.getElementById('equipBands').checked) equipment.push('Resistance Bands');
        if (document.getElementById('equipKettlebells').checked) equipment.push('Kettlebells');
        if (document.getElementById('equipMachines').checked) equipment.push('Weight Machines');
        if (document.getElementById('equipCardio').checked) equipment.push('Cardio Equipment');
        if (document.getElementById('equipBodyweight').checked) equipment.push('Bodyweight');
        if (document.getElementById('equipPullupBar').checked) equipment.push('Pull-up Bar');

        // Get focus areas
        const focusAreas = [];
        if (document.getElementById('focusChest').checked) focusAreas.push('Chest');
        if (document.getElementById('focusBack').checked) focusAreas.push('Back');
        if (document.getElementById('focusLegs').checked) focusAreas.push('Legs');
        if (document.getElementById('focusArms').checked) focusAreas.push('Arms');
        if (document.getElementById('focusShoulders').checked) focusAreas.push('Shoulders');
        if (document.getElementById('focusCore').checked) focusAreas.push('Core/Abs');

        console.log('Form values collected');

        // Build the prompt
        let prompt = `You are a certified fitness trainer and exercise physiologist. Create a detailed, personalized fitness routine based on the following:\n\n`;

        prompt += `**Client Profile:**\n`;
        prompt += `- Primary Goal: ${fitnessGoal.replace(/-/g, ' ')}\n`;
        prompt += `- Fitness Level: ${fitnessLevel}\n`;
        prompt += `- Workout Frequency: ${workoutDays} days per week\n`;
        prompt += `- Session Duration: ${workoutDuration} minutes\n`;
        prompt += `- Location: ${workoutLocation.replace(/-/g, ' ')}\n`;

        if (equipment.length > 0) {
            prompt += `- Available Equipment: ${equipment.join(', ')}\n`;
        }

        if (focusAreas.length > 0) {
            prompt += `- Focus Areas: ${focusAreas.join(', ')}\n`;
        }

        if (limitations) {
            prompt += `\n**Physical Limitations:**\n${limitations}\n`;
            prompt += `*Important: Modify exercises to accommodate these limitations and suggest safe alternatives.*\n`;
        }

        if (additionalNotes) {
            prompt += `\n**Additional Preferences:**\n${additionalNotes}\n`;
        }

        prompt += `\n**Please provide a comprehensive fitness routine including:**\n\n`;
        prompt += `## Weekly Workout Schedule\n`;
        prompt += `List each day's workout with:\n`;
        prompt += `- Day name (e.g., "Day 1: Upper Body")\n`;
        prompt += `- Focus/muscle groups\n`;
        prompt += `- Total estimated time\n\n`;

        prompt += `## Detailed Exercise List\n`;
        prompt += `For each workout day, provide:\n`;
        prompt += `- Exercise name\n`;
        prompt += `- Sets and reps (or time for cardio)\n`;
        prompt += `- Brief form tips\n`;
        prompt += `- Modifications if needed\n\n`;

        prompt += `## Warm-up & Cool-down\n`;
        prompt += `- Dynamic warm-up routine (5-10 minutes)\n`;
        prompt += `- Cool-down stretches (5-10 minutes)\n\n`;

        prompt += `## Progressive Overload Strategy\n`;
        prompt += `- How to progress week by week\n`;
        prompt += `- When to increase weight/intensity\n\n`;

        prompt += `## Additional Tips\n`;
        prompt += `- Rest and recovery recommendations\n`;
        prompt += `- Nutrition basics for the goal\n`;
        prompt += `- Common mistakes to avoid\n\n`;

        prompt += `Format your response in clear markdown. Make it practical, safe, and motivating!`;

        console.log('Prompt prepared');

        // Show loading indicator
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Creating your personalized fitness routine...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            console.log('Making API request...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are a certified fitness trainer with expertise in exercise science, program design, and safe training practices. You create effective, personalized workout routines that help people achieve their fitness goals safely.'
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
            console.error('Error generating fitness routine:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate fitness routine. ';
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
