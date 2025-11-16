document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    new AIInterface({
        containerId: 'ai-interface',
        onSubmit: null,
        submitButtonText: '',
        includeResponseLength: false,
        includeModelSelect: false,
        customFields: []
    });

    document.getElementById('mapperForm').addEventListener('submit', handleSubmit);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', handleRegenerate);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #e74c3c; padding: 15px; background: rgba(231, 76, 60, 0.1); border-radius: 6px; border-left: 4px solid #e74c3c;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const mainConcept = document.getElementById('mainConcept').value.trim();
        const relatedConcepts = document.getElementById('relatedConcepts').value.trim();
        const subject = document.getElementById('subject').value;
        const depth = document.getElementById('depth').value;
        const includeExamples = document.getElementById('includeExamples').checked;
        const includeAnalogies = document.getElementById('includeAnalogies').checked;

        if (!mainConcept) {
            showError('Please enter a main concept.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `You are an expert educator and cognitive learning specialist. Map connections and relationships between concepts to enhance understanding.

Main Concept: ${mainConcept}
${relatedConcepts ? `Related Concepts: ${relatedConcepts}` : ''}
${subject ? `Subject Area: ${subject}` : ''}
Connection Depth: ${depth}

Create comprehensive concept map:

**CENTRAL CONCEPT: ${mainConcept}**
[Clear, concise definition]

**CORE COMPONENTS**
[Break down the main concept into its key parts]
- Component 1: [Explanation]
- Component 2: [Explanation]
- Component 3: [Explanation]

**PRIMARY CONNECTIONS**

**Connection 1: ${mainConcept} ↔️ [Related Concept]**
- Relationship Type: [Cause/Effect, Part/Whole, etc.]
- How They Connect: [Explanation]
- Why It Matters: [Significance]
${includeExamples ? '- Real-world Example: [Concrete example]' : ''}

[Repeat for 4-6 primary connections]

**SECONDARY CONNECTIONS**
[How the related concepts connect to each other]

**HIERARCHICAL RELATIONSHIPS**
- Broader Concept: [Higher-level concept this fits into]
- Narrower Concepts: [More specific sub-concepts]
- Parallel Concepts: [Related concepts at same level]

${includeAnalogies ? `**ANALOGIES & METAPHORS**
[Help understand the concept through comparisons]
- Analogy 1: [Description]
- Analogy 2: [Description]` : ''}

**MISCONCEPTIONS & CLARIFICATIONS**
- Common Confusion: [What people often misunderstand]
- Clarification: [Correct understanding]

**INTERDISCIPLINARY CONNECTIONS**
[How this concept appears in other fields]

**PRACTICAL APPLICATIONS**
[Where/how this concept is used]

**STUDY TIPS**
[How to remember and understand these connections]

**VISUAL MAP STRUCTURE**
[Text description of how concepts should be visually organized]

Make connections clear, meaningful, and memorable!`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Map connections for concept: ${mainConcept}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: 2200,
                temperature: 0.75
            });

            currentResult = response;
            displayResults(response);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            showError(`Error mapping concepts: ${error.message}`);
        }
    }

    function handleRegenerate(event) {
        event.preventDefault();
        handleSubmit(event);
    }

    function displayResults(content) {
        document.getElementById('resultTitle').textContent = 'Concept Connection Map';

        // Format the markdown content properly
        let formattedContent = content
            .replace(/\*\*CENTRAL CONCEPT: (.*?)\*\*/g, '<h3>🎯 Central Concept: $1</h3>')
            .replace(/\*\*CORE COMPONENTS\*\*/g, '<h3>🧩 Core Components</h3>')
            .replace(/\*\*PRIMARY CONNECTIONS\*\*/g, '<h3>🔗 Primary Connections</h3>')
            .replace(/\*\*Connection (\d+): (.*?)\*\*/g, '<h4>↔️ Connection $1: $2</h4>')
            .replace(/\*\*SECONDARY CONNECTIONS\*\*/g, '<h3>🔀 Secondary Connections</h3>')
            .replace(/\*\*HIERARCHICAL RELATIONSHIPS\*\*/g, '<h3>📊 Hierarchical Relationships</h3>')
            .replace(/\*\*ANALOGIES & METAPHORS\*\*/g, '<h3>🌉 Analogies & Metaphors</h3>')
            .replace(/\*\*MISCONCEPTIONS & CLARIFICATIONS\*\*/g, '<h3>⚠️ Misconceptions & Clarifications</h3>')
            .replace(/\*\*INTERDISCIPLINARY CONNECTIONS\*\*/g, '<h3>🌐 Interdisciplinary Connections</h3>')
            .replace(/\*\*PRACTICAL APPLICATIONS\*\*/g, '<h3>💡 Practical Applications</h3>')
            .replace(/\*\*STUDY TIPS\*\*/g, '<h3>📚 Study Tips</h3>')
            .replace(/\*\*VISUAL MAP STRUCTURE\*\*/g, '<h3>🗺️ Visual Map Structure</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- /g, '\n• ')
            .replace(/\n/g, '<br>');

        document.getElementById('resultContent').innerHTML = formattedContent;
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(currentResult).then(() => {
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            showError('Failed to copy');
        });
    }

    function downloadResult() {
        if (currentResult) {
            const conceptName = document.getElementById('mainConcept').value.trim().replace(/\s+/g, '_');
            const filename = `concept-map-${conceptName.substring(0, 30).toLowerCase()}`;
            
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        } else {
            console.error('No content to download');
        }
    }
});
