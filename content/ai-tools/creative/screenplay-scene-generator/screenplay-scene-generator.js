document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('screenplayForm').addEventListener('submit', generateScreenplay);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #ff6666; padding: 15px; background: rgba(255,68,68,0.1); border-radius: 6px; border-left: 4px solid #ff6666;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function generateScreenplay(event) {
        if (event) event.preventDefault();
        
        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const genre = document.getElementById('genre').value;
        const sceneType = document.getElementById('sceneType').value;
        const location = document.getElementById('location').value.trim().toUpperCase();
        const timeOfDay = document.getElementById('timeOfDay').value.toUpperCase();
        const characters = document.getElementById('characters').value.trim();
        const sceneDescription = document.getElementById('sceneDescription').value.trim();
        const tone = document.getElementById('tone').value;
        const sceneLength = document.getElementById('sceneLength').value;
        const dialogueStyle = document.getElementById('dialogueStyle').value;
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        if (!genre || !location || !characters || !sceneDescription) {
            showError('Please fill in all required fields.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const sceneTypePrefix = sceneType.toUpperCase().replace('-', '/');
            const slugline = `${sceneTypePrefix}. ${location} - ${timeOfDay}`;

            const lengthGuidance = {
                'short': '1-2 pages worth of content (roughly 250-500 words)',
                'medium': '2-4 pages worth of content (roughly 500-1000 words)',
                'long': '4-6 pages worth of content (roughly 1000-1500 words)'
            };

            const systemPrompt = `You are a professional screenwriter skilled in the ${genre} genre. Write a screenplay scene using MARKDOWN formatting for clean, readable output.

SCENE DETAILS:
- Slug Line: ${slugline}
- Characters: ${characters}
- Objective: ${sceneDescription}
- Tone: ${tone}
- Dialogue Style: ${dialogueStyle}
- Length: ${lengthGuidance[sceneLength]}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ''}

MARKDOWN SCREENPLAY FORMAT:
Use proper markdown formatting for structure and readability:

1. **Scene Heading**: Use ## for the slug line
   ## ${slugline}

2. **Action Lines**: Regular paragraph text, present tense
   - Describe what we SEE and HEAR
   - Each action = one clear visual idea
   - Use *italics* for emphasis on sounds or key visuals

3. **Character Dialogue**: Use ### for character names, blockquote for dialogue
   ### CHARACTER NAME
   > Their dialogue here. Make it conversational and reveal character.
   
   Or for parentheticals:
   ### CHARACTER NAME
   *(brief actor direction)*
   > Their dialogue here.

4. **Transitions**: Use **bold** for scene transitions when needed
   **CUT TO:**
   
   **FADE TO:**

WRITING GUIDELINES:
- Show, don't tell - visual storytelling
- Dialogue should reveal character and advance plot
- Include subtext and emotional beats
- Use white space effectively (blank lines between beats)
- Write for ${tone} tone with ${dialogueStyle} dialogue
- Every word must serve the story
- Stage directions that matter cinematically

EXAMPLE FORMAT:
## ${slugline}

The room is dimly lit. *Rain patters against the windows*. Character One enters, shaking water from their coat.

### CHARACTER ONE
> I didn't think you'd actually show up.

Character Two emerges from the shadows, arms crossed.

### CHARACTER TWO
*(defensive)*
> I keep my promises. Unlike some people.

A tense silence. Character One moves closer.

Deliver the screenplay scene in clean markdown format. No preamble, just the formatted scene.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Write the scene where: ${sceneDescription}` }
            ];

            const response = await apiManager.makeRequest(messages, { 
                max_tokens: sceneLength === 'long' ? 2000 : sceneLength === 'medium' ? 1500 : 1000,
                temperature: 0.8
            });

            currentResult = response;
            displayResults(response, slugline);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            showError(`Failed to generate screenplay: ${error.message}`);
        }
    }

    function displayResults(screenplay, slugline) {
        const contentDiv = document.getElementById('resultContent');
        
        // Use utils.formatMarkdown for clean markdown rendering
        if (window.utils && window.utils.formatMarkdown) {
            contentDiv.innerHTML = window.utils.formatMarkdown(screenplay);
        } else {
            // Fallback: simple HTML conversion
            contentDiv.innerHTML = screenplay
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
        }
    }

    function copyToClipboard() {
        if (currentResult) {
            navigator.clipboard.writeText(currentResult).then(() => {
                const btn = event?.target || document.querySelector('.copy-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ Copied!';
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
            });
        }
    }

    function downloadResult(format) {
        if (!currentResult) return;
        
        const location = document.getElementById('location').value.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const filename = `screenplay-scene-${location}`;
        
        window.downloadManager.setContent(currentResult, 'markdown');
        window.downloadManager.download(format, filename);
    }

    // Make functions globally accessible for onclick handlers
    window.copyToClipboard = copyToClipboard;
    window.downloadResult = downloadResult;
});
