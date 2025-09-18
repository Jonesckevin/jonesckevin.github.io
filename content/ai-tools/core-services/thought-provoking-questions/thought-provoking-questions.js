document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    async function generateTPQ() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const roleTitle = document.getElementById('roleTitle').value;
        const seniority = document.getElementById('seniority').value;
        const industry = document.getElementById('industry').value;
        const numQuestions = document.getElementById('numQuestions').value;
        const distribution = document.getElementById('distribution').value;
        const topicsCsv = document.getElementById('topicsCsv').value.trim();
        const includeFollowups = document.getElementById('includeFollowups').checked;
        const includeRubric = document.getElementById('includeRubric').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('tpq-result').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `You are an expert interviewer and hiring advisor. Create thought-provoking, high-signal interview questions that make applicants genuinely reflect and reveal judgment, depth, and maturity. Tailor to the role and seniority.

CONTEXT:
- Role: ${roleTitle || 'General'}
- Seniority: ${seniority || 'any'}
- Industry focus: ${industry || 'general'}
- Emphasis: ${distribution || 'balanced'}
- Topics: General plus ${topicsCsv || 'General only'}
- Target count: ${numQuestions || 20}
- Include follow-ups: ${includeFollowups ? 'Yes' : 'No'}
- Include rubric/red flags: ${includeRubric ? 'Yes' : 'No'}

INSTRUCTIONS:
1) Mix General questions with the chosen topic areas. Avoid trivia; prefer judgment, tradeoffs, systems thinking, and self-awareness.
2) Each question should include: intent (what it reveals), the question, and if enabled, 1–2 follow-up probes.
3) If rubric is enabled, include a concise PER-QUESTION scoring rubric (1, 3, 5) describing what weak/average/strong answers look like, and 1–2 common red flags for that question.
4) Format with clear sections and numbering for easy reading.
5) Do not include unrelated content or disclaimers.

Create a comprehensive interview question set now.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Generate the question set now.' }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.6
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
            document.getElementById('tpq-result').style.display = 'block';

            // Scroll to result
            document.getElementById('tpq-result').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating questions:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate questions. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const roleTitle = document.getElementById('roleTitle').value;
        const seniority = document.getElementById('seniority').value;

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create an alternative set of thought-provoking interview questions for a ${roleTitle || 'general'} role at ${seniority || 'any'} level. Use different approaches and angles while maintaining high quality and relevance.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Generate a new variation of interview questions.' }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.8
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7; color: #e0e0e0;">${htmlContent}</div>
                </div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('tpq-result').style.display = 'block';

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
        const roleTitle = document.getElementById('roleTitle').value || 'general';
        const filename = `interview-questions_${roleTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('tpq-result').style.display = 'none';
        document.getElementById('roleTitle').value = '';
        document.getElementById('industry').value = '';
        document.getElementById('topicsCsv').value = '';
        document.getElementById('seniority').value = 'any';
        document.getElementById('distribution').value = 'balanced';
        document.getElementById('numQuestions').value = '20';
        document.getElementById('includeFollowups').checked = true;
        document.getElementById('includeRubric').checked = true;
    }

    // Make functions globally available for onclick handlers
    window.generateTPQ = generateTPQ;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});