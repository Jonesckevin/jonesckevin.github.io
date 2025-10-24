// Packing List Generator Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Packing list script loaded');

    // Global variable to store current result
    let currentResult = '';

    // Main packing list generation function
    window.generatePackingList = async function () {
        console.log('=== GENERATE PACKING LIST FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const tripType = document.getElementById('tripType').value;
        const destination = document.getElementById('destination').value.trim();
        const tripDuration = document.getElementById('tripDuration').value;
        const season = document.getElementById('season').value;
        const travelStyle = document.getElementById('travelStyle').value;
        const accommodationType = document.getElementById('accommodationType').value;
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        // Validation
        if (!tripType) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a trip type.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!destination) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter your destination.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get selected activities
        const activities = [];
        if (document.getElementById('actBeach').checked) activities.push('Beach/Swimming');
        if (document.getElementById('actHiking').checked) activities.push('Hiking/Trekking');
        if (document.getElementById('actFormal').checked) activities.push('Formal Events');
        if (document.getElementById('actSports').checked) activities.push('Sports/Fitness');
        if (document.getElementById('actDining').checked) activities.push('Fine Dining');
        if (document.getElementById('actPhotography').checked) activities.push('Photography');
        if (document.getElementById('actWater').checked) activities.push('Water Sports');
        if (document.getElementById('actNightlife').checked) activities.push('Nightlife');

        // Get special needs
        const specialNeeds = [];
        if (document.getElementById('needBaby').checked) specialNeeds.push('Traveling with Baby');
        if (document.getElementById('needKids').checked) specialNeeds.push('Traveling with Kids');
        if (document.getElementById('needMedical').checked) specialNeeds.push('Medical Needs');
        if (document.getElementById('needPets').checked) specialNeeds.push('Traveling with Pets');
        if (document.getElementById('needWork').checked) specialNeeds.push('Remote Work');
        if (document.getElementById('needElectronics').checked) specialNeeds.push('Tech Heavy');

        console.log('Form values collected');

        // Build the prompt
        let prompt = `You are an expert travel advisor and packing specialist. Create a comprehensive, organized packing list based on the following trip details:\n\n`;

        prompt += `**Trip Details:**\n`;
        prompt += `- Type: ${tripType.replace(/-/g, ' ')}\n`;
        prompt += `- Destination: ${destination}\n`;
        prompt += `- Duration: ${tripDuration.replace(/-/g, ' ')}\n`;
        prompt += `- Season/Weather: ${season}\n`;
        prompt += `- Accommodation: ${accommodationType.replace(/-/g, ' ')}\n`;
        prompt += `- Travel Style: ${travelStyle}\n`;

        if (activities.length > 0) {
            prompt += `\n**Planned Activities:**\n${activities.map(a => `- ${a}`).join('\n')}\n`;
        }

        if (specialNeeds.length > 0) {
            prompt += `\n**Special Needs:**\n${specialNeeds.map(n => `- ${n}`).join('\n')}\n`;
        }

        if (additionalNotes) {
            prompt += `\n**Additional Notes:**\n${additionalNotes}\n`;
        }

        prompt += `\n**Please provide a comprehensive packing list organized into clear categories:**\n\n`;
        prompt += `## Essential Documents & Money\n`;
        prompt += `- Passport, IDs, tickets, insurance, etc.\n\n`;

        prompt += `## Clothing\n`;
        prompt += `- Appropriate for weather, activities, and trip style\n`;
        prompt += `- Include quantities (e.g., "3 t-shirts", "2 pairs of pants")\n\n`;

        prompt += `## Footwear\n`;
        prompt += `- Appropriate for activities and weather\n\n`;

        prompt += `## Toiletries & Personal Care\n`;
        prompt += `- Essentials and any special needs items\n\n`;

        prompt += `## Electronics & Gadgets\n`;
        prompt += `- Devices, chargers, adapters, etc.\n\n`;

        prompt += `## Health & Medical\n`;
        prompt += `- First aid, medications, prescriptions\n\n`;

        prompt += `## Activity-Specific Gear\n`;
        prompt += `- Based on planned activities\n\n`;

        prompt += `## Miscellaneous\n`;
        prompt += `- Other useful items\n\n`;

        prompt += `## Pre-Departure Checklist\n`;
        prompt += `- Tasks to complete before leaving\n\n`;

        prompt += `## Travel Tips\n`;
        prompt += `- Packing strategies\n`;
        prompt += `- Weight/space saving tips\n`;
        prompt += `- Things to do at destination\n\n`;

        prompt += `Format your response in clear markdown with checkboxes (- [ ] format) for easy checking off. Be specific and practical!`;

        console.log('Prompt prepared');

        // Show loading indicator
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Creating your personalized packing list...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            console.log('Making API request...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are an expert travel advisor with extensive experience in trip planning and packing optimization. You create comprehensive, practical packing lists that ensure travelers have everything they need without overpacking.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ];

            // Make the API request
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 4500,
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
            console.error('Error generating packing list:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate packing list. ';
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

    // Copy function using centralized utils
    window.copyResult = async function (event) {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to copy');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

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
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to download');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        try {
            const timestamp = utils.getCurrentTimestamp();
            const filename = `packing-list-${timestamp}`;

            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download(format, filename);

            console.log('Download initiated successfully');
        } catch (err) {
            console.error('Download failed:', err);
            utils.showError(document.getElementById('errorDiv'), 'Failed to download file. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    };
});
