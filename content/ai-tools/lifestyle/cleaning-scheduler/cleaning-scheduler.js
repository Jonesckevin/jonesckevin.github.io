// Home Cleaning & Chore Scheduler Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Cleaning scheduler script loaded');

    // Global variable to store current result
    let currentResult = '';

    // Register standard copy/download actions
    utils.registerToolActions('cleaning-scheduler', () => currentResult);

    // Main cleaning schedule generation function
    window.generateCleaningSchedule = async function () {
        console.log('=== GENERATE CLEANING SCHEDULE FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const homeType = document.getElementById('homeType').value;
        const householdSize = document.getElementById('householdSize').value;
        const cleaningIntensity = document.getElementById('cleaningIntensity').value;
        const timeAvailable = document.getElementById('timeAvailable').value;
        const scheduleType = document.getElementById('scheduleType').value;
        const focusPriorities = document.getElementById('focusPriorities').value.trim();
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        // Validation
        if (!homeType) {
            utils.showError(document.getElementById('errorDiv'), 'Please select your home type.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get selected areas
        const areas = [];
        if (document.getElementById('areaKitchen').checked) areas.push('Kitchen');
        if (document.getElementById('areaBathrooms').checked) areas.push('Bathrooms');
        if (document.getElementById('areaBedrooms').checked) areas.push('Bedrooms');
        if (document.getElementById('areaLiving').checked) areas.push('Living Areas');
        if (document.getElementById('areaLaundry').checked) areas.push('Laundry Room');
        if (document.getElementById('areaGarage').checked) areas.push('Garage');
        if (document.getElementById('areaOutdoor').checked) areas.push('Outdoor Spaces');
        if (document.getElementById('areaOffice').checked) areas.push('Home Office');

        if (areas.length === 0) {
            utils.showError(document.getElementById('errorDiv'), 'Please select at least one area to include in your schedule.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get special considerations
        const considerations = [];
        if (document.getElementById('considerPets').checked) considerations.push('Pets');
        if (document.getElementById('considerKids').checked) considerations.push('Young Children');
        if (document.getElementById('considerAllergies').checked) considerations.push('Allergies/Sensitivities');
        if (document.getElementById('considerBusy').checked) considerations.push('Very Busy Schedule');
        if (document.getElementById('considerSharing').checked) considerations.push('Shared Chores');
        if (document.getElementById('considerGuests').checked) considerations.push('Frequent Guests');

        console.log('Form values collected');

        // Build the prompt
        let prompt = `You are a professional home organization and cleaning expert. Create a comprehensive, practical cleaning schedule based on the following:\n\n`;

        prompt += `**Home Details:**\n`;
        prompt += `- Type: ${homeType.replace(/-/g, ' ')}\n`;
        prompt += `- Household Size: ${householdSize} ${householdSize === '1' ? 'person' : 'people'}\n`;
        prompt += `- Cleaning Intensity: ${cleaningIntensity}\n`;
        prompt += `- Time Available: ${timeAvailable.replace(/-/g, ' ')}\n`;
        prompt += `- Schedule Preference: ${scheduleType.replace(/-/g, ' ')}\n`;

        prompt += `\n**Areas to Clean:**\n${areas.map(a => `- ${a}`).join('\n')}\n`;

        if (considerations.length > 0) {
            prompt += `\n**Special Considerations:**\n${considerations.map(c => `- ${c}`).join('\n')}\n`;
        }

        if (focusPriorities) {
            prompt += `\n**Priority Focus Areas:**\n${focusPriorities}\n`;
        }

        if (additionalNotes) {
            prompt += `\n**Additional Preferences:**\n${additionalNotes}\n`;
        }

        prompt += `\n**Please provide a comprehensive cleaning plan including:**\n\n`;

        if (scheduleType === 'daily') {
            prompt += `## Daily Cleaning Routine\n`;
            prompt += `Break down tasks into manageable daily chunks (10-20 minutes per day)\n\n`;
        } else if (scheduleType === 'zone') {
            prompt += `## Zone-Based Weekly Schedule\n`;
            prompt += `Assign different areas/zones to different days of the week\n\n`;
        } else if (scheduleType === 'weekly') {
            prompt += `## Weekly Cleaning Schedule\n`;
            prompt += `Organize tasks by specific days and timeframes\n\n`;
        } else {
            prompt += `## Comprehensive Cleaning Checklist\n`;
            prompt += `Organized by frequency and area\n\n`;
        }

        prompt += `## Task Frequency Guide\n`;
        prompt += `- Daily Tasks\n`;
        prompt += `- Weekly Tasks\n`;
        prompt += `- Bi-weekly Tasks\n`;
        prompt += `- Monthly Tasks\n`;
        prompt += `- Seasonal Tasks (Deep Cleaning)\n\n`;

        prompt += `## Detailed Task Lists by Area\n`;
        prompt += `For each area, list specific cleaning tasks with:\n`;
        prompt += `- Task name\n`;
        prompt += `- Estimated time\n`;
        prompt += `- Recommended frequency\n\n`;

        prompt += `## Quick Cleaning Tips\n`;
        prompt += `- Time-saving strategies\n`;
        prompt += `- Product recommendations (if needed)\n`;
        prompt += `- Efficiency hacks\n`;
        prompt += `- Maintenance tips to reduce cleaning time\n\n`;

        prompt += `## Optional Chore Assignment\n`;
        if (considerations.includes('Shared Chores')) {
            prompt += `Suggest how to divide chores among household members\n\n`;
        } else {
            prompt += `Tips for managing chores solo or delegating when possible\n\n`;
        }

        prompt += `Format your response in clear markdown with checkboxes (- [ ] format) for tasks. Make it practical, achievable, and motivating!`;

        console.log('Prompt prepared');

        // Show loading indicator
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Creating your personalized cleaning schedule...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            console.log('Making API request...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are a professional home organization expert who creates realistic, practical cleaning schedules. You understand different lifestyles and help people maintain clean, organized homes without feeling overwhelmed.'
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
                const formattedHtml = utils.formatMarkdown(currentResult);
                document.getElementById('resultContent').innerHTML = `
                    <div class="result-display">${formattedHtml}</div>
                `;
                document.getElementById('resultDiv').style.display = 'block';

                // Scroll to results
                document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                throw new Error('No content received from AI');
            }

        } catch (error) {
            console.error('Error generating cleaning schedule:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate cleaning schedule. ';
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
