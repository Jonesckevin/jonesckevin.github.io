document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let currentAnalogies = [];
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('analogyForm').addEventListener('submit', generateAnalogies);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyAllToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', generateAnalogies);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #ff6666; padding: 15px; background: rgba(255,68,68,0.1); border-radius: 6px; border-left: 4px solid #ff6666;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function generateAnalogies(event) {
        if (event) event.preventDefault();
        
        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const concept = document.getElementById('concept').value.trim();
        const audienceLevel = document.getElementById('audienceLevel').value;
        const audienceBackground = document.getElementById('audienceBackground').value.trim();
        const analogyType = document.getElementById('analogyType').value;
        const analogyCount = parseInt(document.getElementById('analogyCount').value);
        const focusAspect = document.getElementById('focusAspect').value.trim();
        const avoidTerms = document.getElementById('avoidTerms').value.trim();

        if (!concept) {
            showError('Please enter a concept to explain.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const levelDescriptions = {
                'child': 'an 8-12 year old child - use simple, concrete examples from everyday life',
                'teenager': 'a teenager (13-17) - use relatable examples from school, games, social media',
                'general': 'a general adult audience - balance simplicity with some depth',
                'professional': 'professionals with some background knowledge - can use slightly technical terms',
                'expert': 'experts in adjacent fields - can be more technical and nuanced'
            };

            const typeDescriptions = {
                'everyday': 'everyday life activities (household chores, shopping, daily routines)',
                'nature': 'nature and animals (ecosystems, animal behavior, natural phenomena)',
                'sports': 'sports and games (team dynamics, scoring systems, strategies)',
                'cooking': 'cooking and food (recipes, ingredients, cooking processes)',
                'building': 'building and construction (blueprints, tools, structures)',
                'transportation': 'transportation systems (roads, vehicles, traffic)',
                'storytelling': 'storytelling and narrative structures',
                'mixed': 'the most relatable domain for this concept'
            };

            const systemPrompt = `You are an expert educator and communicator skilled at creating clear, memorable analogies to explain complex concepts.

Using Markdown with headings, create ${analogyCount} distinct analogy/analogies to explain:
**Concept:** ${concept}
**Audience:** ${levelDescriptions[audienceLevel]}
${audienceBackground ? `**Audience Interest:** ${audienceBackground} - incorporate this when possible` : ''}
**Analogy Domain:** ${typeDescriptions[analogyType]}
${focusAspect ? `**Focus on:** ${focusAspect}` : ''}
${avoidTerms ? `**Avoid:** ${avoidTerms}` : ''}

Requirements for each analogy:
1. **Clear Mapping**: Each part of the concept should map to something in the analogy
2. **Accessible**: Use familiar, concrete things the audience already understands
3. **Accurate**: Don't oversimplify to the point of being wrong
4. **Memorable**: Make it vivid and easy to remember
5. **Complete**: Cover the key aspects of the concept
6. **Limitations**: Briefly note where the analogy breaks down (if relevant)

Format each analogy as:
**Analogy [Number]: [Title]**
[The actual analogy explanation - 2-4 sentences]

**Why This Works:**
[Brief explanation of how the analogy maps to the concept - 1-2 sentences]

${analogyCount > 1 ? 'Make each analogy distinctly different, approaching the concept from different angles.' : ''}`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Explain: ${concept}` }
            ];

            const response = await apiManager.makeRequest(messages, { 
                max_tokens: analogyCount * 400,
                temperature: 0.8
            });

            currentResult = response;
            parseAndDisplayAnalogies(response);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            const provider = window.apiManager?.getProvider() || 'openai';
            const model = window.apiManager?.getModel(provider) || '(model not set)';
            let msg = `Failed to generate analogies: ${error.message}`;
            if (error && error.message === 'Failed to fetch') {
                // Network/CORS diagnostic suggestions
                msg += `<br><br><strong>Possible causes:</strong><ul style="margin:8px 0 0 18px;">
                  <li>CORS/network blocked for provider <code>${provider}</code>.</li>
                  <li>Invalid or missing API key (session expired).</li>
                  <li>Proxy not running (Anthropic requires local proxy).</li>
                  <li>Firewall/VPN interfering with requests.</li>
                </ul>`;
                if (provider === 'anthropic') {
                    msg += `<div style="margin-top:8px; font-size:0.9em;">Ensure proxy running: <code>node proxy/anthropic-proxy.js</code> (port 7071). Page auto-switches baseURL when served from localhost:6969.</div>`;
                }
            }
            msg += `<div style="margin-top:8px; font-size:0.85em;">Provider: <code>${provider}</code> | Model: <code>${model}</code></div>`;
            showError(msg);
        }
    }

    function parseAndDisplayAnalogies(analogyText) {
        const contentDiv = document.getElementById('resultContent');
        
        // Parse analogies (looking for "Analogy 1:", "Analogy 2:", etc.)
        const analogyPattern = /\*\*Analogy\s+(\d+):\s*([^*]+)\*\*\s*([\s\S]*?)(?=\*\*Analogy\s+\d+:|$)/gi;
        const matches = [...analogyText.matchAll(analogyPattern)];
        
        if (matches.length === 0) {
            // Fallback: use utils.formatMarkdown for proper HTML conversion
            contentDiv.innerHTML = window.utils ? window.utils.formatMarkdown(analogyText) : analogyText.replace(/\n/g, '<br>');
            return;
        }
        
        currentAnalogies = matches.map(match => ({
            number: match[1],
            title: match[2].trim(),
            content: match[3].trim()
        }));
        
        let htmlOutput = '';
        
        currentAnalogies.forEach((analogy, index) => {
            // Split content into main analogy and explanation
            const parts = analogy.content.split(/\*\*Why This Works:\*\*/i);
            const mainContent = parts[0].trim();
            const explanation = parts[1] ? parts[1].trim() : '';
            
            // Use utils.formatMarkdown for proper markdown-to-HTML conversion
            const formattedMain = window.utils ? window.utils.formatMarkdown(mainContent) : mainContent.replace(/\n/g, '<br>');
            const formattedExplanation = explanation && window.utils ? window.utils.formatMarkdown(explanation) : explanation.replace(/\n/g, '<br>');
            
            htmlOutput += `
                <div class="analogy-card">
                    <div class="analogy-header">
                        <div class="analogy-number">${analogy.number}</div>
                        <div class="analogy-title">${analogy.title}</div>
                    </div>
                    <div class="analogy-content">${formattedMain}</div>
                    ${explanation ? `
                        <div class="analogy-explanation">
                            <div class="analogy-explanation-title">💡 Why This Works:</div>
                            <div class="analogy-explanation-text">${formattedExplanation}</div>
                        </div>
                    ` : ''}
                    <button class="action-btn copy-btn" data-analogy-index="${index}" onclick="copyAnalogy(${index})">Copy This Analogy</button>
                </div>
            `;
        });
        
        contentDiv.innerHTML = htmlOutput;
    }

    // Make copyAnalogy available globally
    window.copyAnalogy = function(index) {
        const analogy = currentAnalogies[index];
        if (analogy) {
            const text = `${analogy.title}\n\n${analogy.content}`;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.querySelector(`button[data-analogy-index="${index}"]`);
                if (btn) {
                  const originalText = btn.textContent;
                  btn.textContent = '✓ Copied!';
                  btn.classList.add('copied');
                  setTimeout(() => {
                      btn.textContent = originalText;
                      btn.classList.remove('copied');
                  }, 2000);
                }
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
            const concept = document.getElementById('concept').value.trim();
            const filename = `analogies-${concept.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        }
    }
});
