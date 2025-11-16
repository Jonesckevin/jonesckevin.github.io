document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('debateForm').addEventListener('submit', buildArguments);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', buildArguments);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #ff6666; padding: 15px; background: rgba(255,68,68,0.1); border-radius: 6px; border-left: 4px solid #ff6666;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function buildArguments(event) {
        if (event) event.preventDefault();
        
        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const topic = document.getElementById('topic').value.trim();
        const position = document.getElementById('position').value;
        const debateStyle = document.getElementById('debateStyle').value;
        const argumentCount = parseInt(document.getElementById('argumentCount').value);
        const evidenceLevel = document.getElementById('evidenceLevel').value;
        const context = document.getElementById('context').value.trim();
        const includeRebuttals = document.getElementById('includeRebuttals').checked;
        
        const selectedIncludes = Array.from(document.querySelectorAll('input[name="includes"]:checked'))
            .map(cb => cb.value);

        if (!topic) {
            showError('Please enter a debate topic.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const positionText = {
                'for': 'FOR (Affirmative)',
                'against': 'AGAINST (Negative)',
                'both': 'BOTH sides (Affirmative and Negative)'
            }[position];

            const evidenceText = {
                'minimal': 'minimal evidence (claims and brief explanations)',
                'moderate': 'moderate evidence (include statistics, examples, or expert citations)',
                'detailed': 'detailed evidence (comprehensive data, multiple examples, expert opinions)'
            }[evidenceLevel];

            const includesText = selectedIncludes.length > 0 
                ? `Incorporate: ${selectedIncludes.join(', ')}.` 
                : '';

            const systemPrompt = `You are an expert debate coach and argumentation specialist.

Build structured debate arguments for the ${debateStyle} debate format.

**Topic:** ${topic}
**Position:** ${positionText}
**Arguments Needed:** ${argumentCount} main arguments per side
**Evidence Level:** ${evidenceText}
${includesText}
${context ? `**Context:** ${context}` : ''}

Structure each argument as:
**Argument [#]: [Compelling Title]**
- **Claim:** Clear statement of the argument
- **Warrant:** Explain why this claim matters/is valid
- **Evidence:** ${evidenceLevel === 'detailed' ? 'Detailed supporting evidence with specifics' : 'Supporting evidence'}
- **Impact:** Why this argument is significant

${includeRebuttals ? '**Counterarguments & Rebuttals:**\nFor each argument, provide:\n- Likely opposition arguments\n- Strong rebuttals to counter them\n' : ''}

Make arguments:
- Logically sound and well-structured
- Supported by credible reasoning
- Clear and persuasive
- Distinct from each other (no repetition)
- Strategically ordered (strongest first or last)

Use formal but accessible language. Format with markdown.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Build arguments for: ${topic}` }
            ];

            const response = await apiManager.makeRequest(messages, { 
                max_tokens: 3000,
                temperature: 0.7
            });

            currentResult = response;
            displayResults(response);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            showError(`Failed to build arguments: ${error.message}`);
        }
    }

    function displayResults(argumentsText) {
        const contentDiv = document.getElementById('resultContent');
        
        // Convert markdown-style formatting to HTML
        let formattedHtml = argumentsText
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
            .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h3>$1</h3>')
            .replace(/^\* (.+)$/gm, '<li>$1</li>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/g, '');
        
        contentDiv.innerHTML = `<p>${formattedHtml}</p>`;
    }

    function copyToClipboard() {
        if (currentResult) {
            navigator.clipboard.writeText(currentResult).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
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
            const topic = document.getElementById('topic').value.trim();
            const filename = `debate-${topic.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        }
    }
});
