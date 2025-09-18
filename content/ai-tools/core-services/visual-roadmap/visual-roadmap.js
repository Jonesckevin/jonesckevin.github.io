document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    async function generateRoadmap() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const goalTopic = document.getElementById('goalTopic').value.trim();
        const currentLevel = document.getElementById('currentLevel').value;
        const timeframe = document.getElementById('timeframe').value;
        const focusAreas = document.getElementById('focusAreas').value.trim();
        const learningStyle = document.getElementById('learningStyle').value;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!goalTopic) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter your goal or topic');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `You are an expert learning consultant and roadmap designer. Create a comprehensive, actionable roadmap for achieving the specified goal.

GOAL: ${goalTopic}
CURRENT LEVEL: ${currentLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
TIMEFRAME: ${timeframe.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
LEARNING STYLE: ${learningStyle.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
${focusAreas ? `FOCUS AREAS: ${focusAreas}` : ''}

Create a structured roadmap with:

1. **Overview & Assessment**
   - Brief goal analysis
   - Current level assessment
   - Key challenges to expect

2. **Learning Path** (Break into 4-6 phases)
   - Phase name and duration
   - Core objectives for each phase
   - Key skills/knowledge to acquire
   - Recommended resources and activities
   - Milestone/checkpoint to measure progress

3. **Practical Implementation**
   - Daily/weekly study schedule suggestions
   - Project ideas or practical exercises
   - Tools and resources needed
   - Common pitfalls to avoid

4. **Progress Tracking**
   - How to measure progress
   - Key indicators of success
   - When to move to next phase

5. **Additional Tips**
   - Motivation strategies
   - Community/networking suggestions
   - Advanced topics for later exploration

Format with clear headings, bullet points, and actionable advice. Make it comprehensive but not overwhelming.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a detailed roadmap for: ${goalTopic}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 3000,
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
            console.error('Error generating roadmap:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate roadmap. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const goalTopic = document.getElementById('goalTopic').value.trim();
        const learningStyle = document.getElementById('learningStyle').value;

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create an alternative roadmap approach for: ${goalTopic}. Use a different methodology, timeline structure, or learning approach than the previous roadmap. Focus on ${learningStyle.replace('-', ' ')} learning style and provide fresh perspectives and strategies.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate an alternative roadmap approach for: ${goalTopic}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 3000,
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
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative approach. Please try again.');
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
        const goalTopic = document.getElementById('goalTopic').value || 'roadmap';
        const filename = `roadmap_${goalTopic.replace(/[^a-zA-Z0-9]/g, '_')}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('goalTopic').value = '';
        document.getElementById('focusAreas').value = '';
        document.getElementById('currentLevel').value = 'complete-beginner';
        document.getElementById('timeframe').value = '3-months';
        document.getElementById('learningStyle').value = 'mixed';
    }

    // Make functions globally available for onclick handlers
    window.generateRoadmap = generateRoadmap;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});