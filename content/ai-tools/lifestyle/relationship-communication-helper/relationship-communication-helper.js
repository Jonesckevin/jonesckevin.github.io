document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('communicationForm').addEventListener('submit', generateGuidance);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', generateGuidance);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #ff6666; padding: 15px; background: rgba(255,68,68,0.1); border-radius: 6px; border-left: 4px solid #ff6666;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function generateGuidance(event) {
        if (event) event.preventDefault();
        
        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const relationshipType = document.getElementById('relationshipType').value;
        const conversationType = document.getElementById('conversationType').value;
        const situation = document.getElementById('situation').value.trim();
        const yourFeelings = document.getElementById('yourFeelings').value.trim();
        const communicationTone = document.getElementById('communicationTone').value;
        const desiredOutcome = document.getElementById('desiredOutcome').value.trim();
        const includeExamples = document.getElementById('includeExamples').checked;
        const includeAvoid = document.getElementById('includeAvoid').checked;

        if (!relationshipType || !conversationType || !situation || !yourFeelings) {
            showError('Please fill in all required fields.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const toneGuidance = {
                'gentle': 'Use gentle, caring language. Prioritize emotional safety and connection.',
                'direct': 'Be direct but respectful. Balance honesty with empathy.',
                'firm': 'Be firm and clear while maintaining respect. Set boundaries confidently.',
                'apologetic': 'Be sincere and take responsibility. Show genuine remorse and commitment to change.',
                'neutral': 'Use professional, neutral language. Keep emotions balanced and focus on facts.'
            };

            const systemPrompt = `You are an empathetic communication coach helping someone navigate a ${conversationType} conversation with their ${relationshipType}. ${toneGuidance[communicationTone]}

SITUATION:
${situation}

FEELINGS & NEEDS:
${yourFeelings}

${desiredOutcome ? `DESIRED OUTCOME: ${desiredOutcome}` : ''}

Provide thoughtful communication guidance:

## 💭 Situation Analysis
- Key dynamics at play
- Emotional considerations
- Potential challenges in this conversation

## 🎯 Communication Strategy
- Overall approach for ${communicationTone} tone
- Timing and setting considerations
- Mental/emotional preparation

## 💬 Suggested Message Framework
Structure the conversation:
1. **Opening**: How to begin ${includeExamples ? '(with example)' : ''}
2. **Core Message**: Main points to convey ${includeExamples ? '(with phrasing examples)' : ''}
3. **Listening**: Space for their perspective
4. **Resolution**: Proposed path forward

${includeExamples ? '\n## 📝 Example Phrases\nSpecific language you can adapt:\n- Opening phrases\n- Expressing feelings with "I" statements\n- Making requests clearly\n- Responding to reactions\n' : ''}

${includeAvoid ? '\n## ⚠️ What to Avoid\nLanguage and approaches that could backfire:\n- Accusatory or blaming language\n- Assumptions about intent\n- Defensive reactions\n- Conversation derailers\n' : ''}

## 🧘 During the Conversation
- Active listening techniques
- Managing your emotions
- Responding to defensive reactions
- Finding common ground

## 🌱 After the Conversation
- Following through on commitments
- Rebuilding trust
- Ongoing communication
- Self-care

## 💡 Key Principles
- Maintain respect and dignity for both parties
- Focus on specific behaviors, not character attacks
- Use "I" statements to express feelings
- Validate their perspective even when disagreeing
- Aim for understanding, not winning

Be compassionate, realistic about relationship dynamics, and focused on healthy communication that preserves dignity for everyone involved.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `I need to have a ${conversationType} conversation with my ${relationshipType}. The situation: ${situation}` }
            ];

            const response = await apiManager.makeRequest(messages, { 
                max_tokens: 2200,
                temperature: 0.7
            });

            currentResult = response;
            displayResults(response);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            showError(`Failed to generate communication guidance: ${error.message}`);
        }
    }

    function displayResults(guidance) {
        const contentDiv = document.getElementById('resultContent');
        
        let htmlOutput = guidance
            .replace(/^## (.*$)/gm, '<h3 class="section-header">$1</h3>')
            .replace(/^### (.*$)/gm, '<h4 class="subsection-header">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.*$)/gm, '<li class="numbered-item" value="$1">$2</li>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
        
        htmlOutput = htmlOutput.replace(/(<li(?! class="numbered-item")>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        htmlOutput = htmlOutput.replace(/(<li class="numbered-item".*<\/li>\n?)+/g, '<ol>$&</ol>');
        
        contentDiv.innerHTML = `<div class="communication-guidance-output">${htmlOutput}</div>`;
    }

    function copyToClipboard() {
        if (currentResult) {
            navigator.clipboard.writeText(currentResult).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
            });
        }
    }

    function downloadResult() {
        if (currentResult) {
            const filename = 'communication-guidance';
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        }
    }
});
