document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    // Register standardized copy/download actions
    utils.registerToolActions('thought-provoking-questions', () => currentResult);

    // Ensure result containers exist; create them if missing
    function ensureResultContainers() {
        let resultDiv = document.getElementById('resultDiv');
        let resultContent = document.getElementById('resultContent');
        let errorDiv = document.getElementById('errorDiv');
        let loadingDiv = document.getElementById('loadingDiv');

        // Only create if truly missing - the HTML already has proper structure
        if (!resultDiv) {
            const form = document.getElementById('tpq-form');
            resultDiv = document.createElement('div');
            resultDiv.id = 'resultDiv';
            resultDiv.className = 'result-container';
            resultDiv.style.cssText = 'display:none;';
            resultDiv.innerHTML = `
                <h3 style="color: #ff6b35; margin-bottom: 20px;">Interview Question Set</h3>
                <div id="resultContent" class="result-content"></div>
                <div class="result-actions">
                    <button class="copy-btn" onclick="copyResult(event)">📋 Copy</button>
                    <button class="download-btn" onclick="downloadResult('markdown')">📄 MD</button>
                    <button class="download-btn-alt" onclick="downloadResult('html')">🌐 HTML</button>
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
            loadingDiv.textContent = 'Generating interview questions...';
            if (resultDiv && resultDiv.parentNode) {
                resultDiv.parentNode.insertBefore(loadingDiv, resultDiv);
            } else {
                document.body.appendChild(loadingDiv);
            }
        }

        return { resultDiv, resultContent, errorDiv, loadingDiv };
    }
    async function generateTPQ() {
        console.log('=== GENERATE INTERVIEW QUESTIONS FUNCTION CALLED ===');

        const roleTitle = document.getElementById('roleTitle').value;
        const seniority = document.getElementById('seniority').value;
        const industry = document.getElementById('industry').value;
        const numQuestions = document.getElementById('numQuestions').value;
        const distribution = document.getElementById('distribution').value;
        const topicsCsv = document.getElementById('topicsCsv').value.trim();
        const includeFollowups = document.getElementById('includeFollowups').checked;
        const includeRubric = document.getElementById('includeRubric').checked;

        console.log('Form values collected');

        // Get or create DOM elements
        const { resultDiv, resultContent, errorDiv, loadingDiv } = ensureResultContainers();
        // Optional: mock the response for display pipeline testing
        try {
            const params = new URLSearchParams(window.location.search || '');
            if (params.has('tpqmock')) {
                const mock = `## Mock Interview Questions\n\n1. Tell me about a time you had to balance speed vs. quality.\n- Intent: Judgment, trade-offs\n\n2. Describe a decision you reversed. Why?\n- Intent: Humility, learning rate`;
                const html = utils.formatMarkdown(mock);
                const rc = document.getElementById('resultContent');
                if (rc) {
                    rc.innerHTML = `<div style="background:#1a1a1a;padding:30px;border-radius:10px;border:1px solid rgba(255,107,53,.3);margin-bottom:15px;"><div style="line-height:1.7;color:#e0e0e0;">${html}</div></div>`;
                    if (loadingDiv) loadingDiv.style.display = 'none';
                    if (resultDiv) {
                        resultDiv.style.display = 'block';
                        resultDiv.style.visibility = 'visible';
                        resultDiv.style.opacity = '1';
                        resultDiv.scrollIntoView({ behavior: 'smooth' });
                    }
                    return; // Skip API when mocking
                }
            }
        } catch { }
        // Show loading
        if (errorDiv) errorDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'none';
        if (loadingDiv) loadingDiv.style.display = 'block';
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
- Include ## rubric/red flags: ${includeRubric ? 'Yes' : 'No'}
INSTRUCTIONS:
1) Mix General questions with the chosen topic areas. Avoid trivia; prefer judgment, tradeoffs, systems thinking, and self-awareness.
2) Each question should include: intent (what it reveals), the question, and if enabled, 1–2 follow-up probes.
3) If rubric is enabled, include a concise PER-QUESTION scoring rubric (1, 3, 5) describing what weak/average/strong answers look like, and 1–2 common red flags for that question.
4) Format with clear sections and numbering for easy reading.
5) Do not include unrelated content or disclaimers.
Create a comprehensive interview question set now.`;

            console.log('Prompt prepared');

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Generate the question set now.' }
            ];

            console.log('Making API request...');

            const response = await apiManager.makeRequest(messages, {
                maxTokens: 2000,
                temperature: 0.6
            });

            console.log('API response received');
            console.log('Response received:', response ? 'Yes' : 'No', response?.length);
            currentResult = response;

            console.log('Result stored, length:', currentResult ? currentResult.length : 0);
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
            console.log('HTML content generated, length:', htmlContent ? htmlContent.length : 0);

            if (resultContent) {
                const safeHtml = htmlContent && htmlContent.trim().length > 0
                    ? htmlContent
                    : utils.escapeHtml(currentResult || 'No content generated.');
                // Let the global CSS style the content inside .ai-results-section
                resultContent.innerHTML = safeHtml;
            }

            // Show result
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            if (resultDiv) {
                // Force show in case of conflicting CSS
                resultDiv.style.display = 'block';
                resultDiv.style.visibility = 'visible';
                resultDiv.style.opacity = '1';
            }

            console.log('Results displayed successfully');
            // Scroll to result
            if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error generating questions:', error);
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (errorDiv) {
                utils.showError(errorDiv, error.message || 'Failed to generate questions. Please check your API key and try again.');
                errorDiv.style.display = 'block';
            }
        }
    }
    async function generateVariation() {
        console.log('=== GENERATE VARIATION FUNCTION CALLED ===');

        if (!currentResult) return;
        const roleTitle = document.getElementById('roleTitle').value;
        const seniority = document.getElementById('seniority').value;
        // Get DOM elements
        const { resultDiv, resultContent, errorDiv, loadingDiv } = ensureResultContainers();
        // Show loading
        if (loadingDiv) loadingDiv.style.display = 'block';
        try {
            const systemPrompt = `Create an alternative set of thought-provoking interview questions for a ${roleTitle || 'general'} role at ${seniority || 'any'} level. Use different approaches and angles while maintaining high quality and relevance.`;
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Generate a new variation of interview questions.' }
            ];
            const response = await apiManager.makeRequest(messages, {
                maxTokens: 2000,
                temperature: 0.8
            });
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
            const htmlContent = utils.formatMarkdown(response);
            if (resultContent) {
                const safeHtml = htmlContent && htmlContent.trim().length > 0
                    ? htmlContent
                    : utils.escapeHtml(currentResult || 'No content generated.');
                resultContent.innerHTML = safeHtml;
            }
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.style.visibility = 'visible';
                resultDiv.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error generating variation:', error);
            if (loadingDiv) loadingDiv.style.display = 'none';
            if (errorDiv) {
                utils.showError(errorDiv, error.message || 'Failed to generate variation. Please try again.');
                errorDiv.style.display = 'block';
            }
        }
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
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
    window.resetForm = resetForm;
});