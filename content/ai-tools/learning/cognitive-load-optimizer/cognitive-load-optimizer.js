// Cognitive Load Optimizer Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Cognitive Load Optimizer loaded');
});

let currentResult = '';

async function optimizeCognitive() {
    console.log('=== OPTIMIZE COGNITIVE FUNCTION CALLED ===');

    const learningMaterial = document.getElementById('learningMaterial').value.trim();
    const learnerLevel = document.getElementById('learnerLevel').value;
    const sessionLength = document.getElementById('sessionLength').value;
    const contentType = document.getElementById('contentType').value;
    const learningGoal = document.getElementById('learningGoal').value.trim();

    if (!learningMaterial) {
        utils.showError(document.getElementById('errorDiv'), 'Please enter learning material');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    // Check API availability
    if (!window.apiManager) {
        utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    const aiProvider = window.apiManager.getProvider();
    const apiKey = window.apiManager.getApiKey();

    // Show loading
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';

    try {
        const levelInstructions = {
            'beginner': 'Smaller chunks with more scaffolding. Prioritize building foundational understanding. Higher redundancy and more examples.',
            'intermediate': 'Moderate chunks. Some prior knowledge can be assumed. Balance new information with practice.',
            'advanced': 'Larger chunks possible. Can handle more complexity. Focus on integration and nuanced understanding.'
        };

        const contentInstructions = {
            'conceptual': 'Use analogies, visual representations, and progressive abstraction. Space out abstract concepts.',
            'procedural': 'Break into clear steps. Include practice after each skill. Use worked examples and guided practice.',
            'factual': 'Group related facts. Use mnemonics and organization strategies. Spaced repetition is key.',
            'mixed': 'Identify different content types and optimize each appropriately. Interleave strategically.'
        };

        const goalInstruction = learningGoal ?
            `Optimize toward this goal: ${learningGoal}` :
            'Focus on comprehensive understanding and retention.';

        const systemPrompt = `You are an expert in learning science, cognitive psychology, and instructional design.

Analyze the provided learning material and optimize it for cognitive load:

**Learner Level**: ${learnerLevel} - ${levelInstructions[learnerLevel]}
**Session Length**: ${sessionLength} minutes
**Content Type**: ${contentType} - ${contentInstructions[contentType]}
${goalInstruction}

Provide a comprehensive cognitive load analysis including:

1. **Content Analysis**:
   - Identify intrinsic load (inherent complexity)
   - Spot extraneous load (unnecessary complexity)
   - Note germane load opportunities (productive cognitive effort)

2. **Optimized Chunking Strategy**:
   - Break content into 3-6 meaningful chunks
   - For each chunk:
     * Core concept/skill
     * Estimated time needed
     * Pre-requisites from previous chunks
     * Key learning points
     * Cognitive load level (Low/Medium/High)

3. **Spacing Recommendations**:
   - Optimal sequence for chunks
   - Rest/practice breaks timing
   - Spaced repetition schedule (when to review each chunk)

4. **Load Reduction Strategies**:
   - Simplifications or scaffolding suggestions
   - Examples, analogies, or visual aids to add
   - What can be offloaded (notes, references)

5. **Practice & Retrieval**:
   - Specific retrieval practice suggestions for each chunk
   - Progressive difficulty levels
   - Interleaving opportunities

6. **Session Structure**:
   - Complete session breakdown with timing
   - Warm-up, core learning, and consolidation phases
   - Cognitive load management throughout

Base recommendations on cognitive load theory, spacing effect, retrieval practice, and working memory limitations (7±2 items).

Format in clear, actionable markdown.`;

        const userPrompt = `Optimize this learning material for cognitive load:\n\n${learningMaterial}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        console.log('Making API request...');
        const response = await window.apiManager.makeRequest(messages, {
            provider: aiProvider,
            apiKey: apiKey,
            maxTokens: 3000,
            temperature: 0.7
        });

        console.log('API response received');

        // Accept raw string or object with .content/.output
        let content = '';
        if (typeof response === 'string') {
            content = response;
        } else if (response && typeof response === 'object') {
            content = response.content || response.output || '';
        }
        if (!content || typeof content !== 'string') {
            throw new Error('Invalid API response');
        }

        window.currentResult = content;

        // Display result
        const resultContent = document.getElementById('resultContent');
        resultContent.innerHTML = utils.formatMarkdown(content);
        document.getElementById('loadingDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'block';

        console.log('Results displayed successfully');

    } catch (error) {
        console.error('Error optimizing cognitive load:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        utils.showError(document.getElementById('errorDiv'), `Error: ${error.message}`);
        document.getElementById('errorDiv').style.display = 'block';
    }
}

function copyResult(event) {
    if (event) event.preventDefault();
    if (window.currentResult) {
        utils.copyToClipboard(window.currentResult, event ? event.target : null);
    }
}

function downloadResult(format) {
    if (!window.currentResult) return;

    const timestamp = utils.getCurrentTimestamp();
    const filename = `cognitive-load-plan-${timestamp}`;

    if (window.downloadManager) {
        downloadManager.setContent(window.currentResult, 'markdown');
        downloadManager.download(format, filename);
    } else {
        console.error('downloadManager not available');
    }
}
