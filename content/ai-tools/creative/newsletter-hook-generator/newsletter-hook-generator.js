document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let currentHooks = [];
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('hookForm').addEventListener('submit', generateHooks);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyAllToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', generateHooks);

    async function generateHooks(event) {
        if (event) event.preventDefault();
        
        if (!window.apiManager?.getApiKey()) {
            utils.showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const mainTopic = document.getElementById('mainTopic').value.trim();
        const keyMessage = document.getElementById('keyMessage').value.trim();
        const audience = document.getElementById('audience').value;
        const hookStyle = document.getElementById('hookStyle').value;
        const tone = document.getElementById('tone').value;
        const length = document.getElementById('length').value;
        const context = document.getElementById('context').value.trim();
        const variations = parseInt(document.getElementById('variations').value);

        if (!mainTopic || !keyMessage) {
            utils.showError(document.getElementById('errorDiv'), 'Please fill in the main topic and key message.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const audienceDescriptions = {
                'professionals': 'busy professionals who value efficiency and actionable insights',
                'tech': 'tech-savvy individuals interested in innovation and trends',
                'marketers': 'marketing professionals looking for strategies and tactics',
                'entrepreneurs': 'entrepreneurs and startup founders seeking growth opportunities',
                'consumers': 'general consumers interested in practical information',
                'creatives': 'creative professionals and designers seeking inspiration',
                'students': 'students and lifelong learners focused on education',
                'executives': 'business executives and decision-makers looking for strategic insights'
            };

            const hookStyleDescriptions = {
                'question': 'Start with a thought-provoking question that makes readers curious',
                'statistic': 'Lead with a surprising or compelling statistic that demands attention',
                'story': 'Begin with a brief personal story or anecdote that creates connection',
                'problem': 'Identify a specific pain point or problem that resonates immediately',
                'curiosity': 'Create a curiosity gap that makes readers want to know more',
                'bold-statement': 'Make a bold, contrarian, or unexpected statement',
                'timely': 'Connect to a current trend or timely event',
                'contrarian': 'Present a contrarian or counterintuitive viewpoint'
            };

            const lengthDescriptions = {
                'short': '1-2 punchy sentences',
                'medium': '2-3 well-crafted sentences',
                'long': '3-4 sentences with more context'
            };

            const systemPrompt = `You are an expert copywriter specializing in newsletter openings and email marketing. 

Create ${variations} compelling newsletter opening paragraphs (hooks) based on the following:

Topic: ${mainTopic}
Key Message: ${keyMessage}
Target Audience: ${audienceDescriptions[audience]}
Hook Style: ${hookStyleDescriptions[hookStyle]}
Tone: ${tone}
Length: ${lengthDescriptions[length]}
${context ? `Additional Context: ${context}` : ''}

Requirements:
- Make each hook unique and distinct
- Use the specified hook style as the primary approach
- Match the ${tone} tone throughout
- Keep length to ${lengthDescriptions[length]}
- Ensure immediate engagement - grab attention in the first few words
- Make readers want to continue reading
- Be specific and concrete, not vague
- Avoid clichés and overused phrases
- Each variation should explore a different angle or perspective

Format: Number each hook (1., 2., 3., etc.) and provide only the hook text, no explanations or commentary.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate ${variations} newsletter hooks about: ${mainTopic}` }
            ];

            const response = await apiManager.makeRequest(messages, { 
                max_tokens: variations * 200,
                temperature: 0.85
            });

            currentResult = response;
            parseAndDisplayHooks(response);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), `Failed to generate hooks: ${error.message}`);
        }
    }

    function parseAndDisplayHooks(hooksText) {
        const contentDiv = document.getElementById('resultContent');
        
        // Parse numbered hooks (1., 2., 3., etc.)
        const hookPattern = /(\d+)\.\s*(.+?)(?=\d+\.|$)/gs;
        const matches = [...hooksText.matchAll(hookPattern)];
        
        currentHooks = matches.map(match => match[2].trim());
        
        let htmlOutput = '';
        
        currentHooks.forEach((hook, index) => {
            htmlOutput += `
                <div class="hook-item" data-hook-index="${index}">
                    <div class="hook-number">${index + 1}</div>
                    <div class="hook-text">${hook}</div>
                    <button class="action-btn copy-btn" onclick="copyHook(${index})">Copy</button>
                </div>
            `;
        });
        
        htmlOutput += `
            <div class="hooks-guide">
                <h4>💡 How to Use These Hooks</h4>
                <p>Test different hooks to see which resonates best with your audience. Consider A/B testing in your email campaigns. Remember to follow up the hook with valuable content that delivers on the promise.</p>
            </div>
        `;
        
        contentDiv.innerHTML = htmlOutput;
    }

    // Make copyHook available globally for the onclick handler
    window.copyHook = function(index) {
        const hook = currentHooks[index];
        if (hook) {
            navigator.clipboard.writeText(hook).then(() => {
                const btn = document.querySelector(`[data-hook-index="${index}"] .action-btn.copy-btn`);
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            });
        }
    };

    function copyAllToClipboard() {
        if (currentResult) {
            navigator.clipboard.writeText(currentResult).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied All!';
                btn.style.background = '#45a049';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#4CAF50';
                }, 2000);
            }, () => {
                alert('Failed to copy to clipboard.');
            });
        }
    }

    function downloadResult() {
        if (currentResult) {
            const topic = document.getElementById('mainTopic').value.trim();
            const filename = `newsletter-hooks-${topic.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        }
    }
});
