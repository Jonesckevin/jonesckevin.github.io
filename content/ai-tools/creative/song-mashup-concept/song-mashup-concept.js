document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let currentMode = 'discover';
    
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    // Initialize AI Interface for both modes
    new AIInterface({
        containerId: 'ai-interface-discover',
        onSubmit: null,
        submitButtonText: '',
        includeResponseLength: false,
        includeModelSelect: false,
        customFields: []
    });

    new AIInterface({
        containerId: 'ai-interface-analyze',
        onSubmit: null,
        submitButtonText: '',
        includeResponseLength: false,
        includeModelSelect: false,
        customFields: []
    });

    document.getElementById('discoverForm').addEventListener('submit', handleDiscoverSubmit);
    document.getElementById('analyzeForm').addEventListener('submit', handleAnalyzeSubmit);

    function switchMode(mode) {
        currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Show/hide forms
        if (mode === 'discover') {
            document.getElementById('discoverForm').style.display = 'block';
            document.getElementById('analyzeForm').style.display = 'none';
        } else {
            document.getElementById('discoverForm').style.display = 'none';
            document.getElementById('analyzeForm').style.display = 'block';
        }

        // Hide results when switching modes
        document.getElementById('resultDiv').style.display = 'none';
    }

    // Make switchMode available globally
    window.switchMode = switchMode;

    async function handleDiscoverSubmit(event) {
        event.preventDefault();

        if (!window.apiManager?.getApiKey()) {
            utils.showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const primarySong = document.getElementById('primarySong').value.trim();
        const primaryGenre = document.getElementById('primaryGenre').value;
        const mashupStyle = document.getElementById('mashupStyle').value;
        const energyLevel = document.getElementById('energyLevel').value;
        const numberOfConcepts = parseInt(document.getElementById('numberOfConcepts').value);
        const additionalPreferences = document.getElementById('additionalPreferences').value.trim();

        if (!primarySong) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter a primary song or artist.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const styleDescriptions = {
                'complementary': 'songs with similar vibes and energy that naturally blend together',
                'contrast': 'unexpected combinations that create exciting contrasts',
                'genre-blend': 'creative cross-genre mashups that merge different musical styles',
                'era-mix': 'classic meets modern - bridging different musical eras',
                'cultural-fusion': 'blending songs from different cultural backgrounds'
            };

            const systemPrompt = `You are an expert DJ, music producer, and mashup artist with deep knowledge of music theory, song structure, and creative mixing techniques. Generate ${numberOfConcepts} innovative mashup concepts.

Primary Track: ${primarySong}
${primaryGenre ? `Primary Genre: ${primaryGenre}` : ''}
Mashup Style: ${styleDescriptions[mashupStyle]}
${energyLevel ? `Energy Level: ${energyLevel}` : ''}
${additionalPreferences ? `Additional Preferences: ${additionalPreferences}` : ''}

For each mashup concept, provide:

**Mashup #X: [Creative Mashup Name]**

**Combination:**
- Primary Track: [Song Name - Artist]
- Secondary Track: [Song Name - Artist]
- Mashup Style: [Description of the combination approach]

**Why This Works:**
[2-3 sentences explaining why these songs complement each other musically and emotionally]

**Technical Details:**
- Original Tempo: [Track 1 BPM] / [Track 2 BPM]
- Target Tempo: [Suggested mashup BPM]
- Key Compatibility: [Analysis of key relationship]
- Time Signature: [If relevant]

**Arrangement Suggestions:**
- Intro: [How to start - which elements from which song]
- Verse/Chorus Structure: [How to layer or alternate sections]
- Bridge/Breakdown: [Creative transition ideas]
- Outro: [How to end effectively]

**Key Mixing Techniques:**
- [Specific technique 1 - e.g., "Use vocals from Song 1 over instrumental of Song 2"]
- [Specific technique 2]
- [Specific technique 3]

**Creative Elements:**
- [Unique flourishes or effects to make it special]
- [Timing/rhythm tricks]
- [Vocal processing suggestions]

**Difficulty Level:** [Beginner/Intermediate/Advanced]

**Best Context:** [Where/when this mashup would work best - club, radio, chill set, etc.]

Make suggestions creative, unexpected, and technically sound. Focus on mashups that would genuinely work and surprise listeners.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create ${numberOfConcepts} mashup concepts for: ${primarySong}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: 1500 + (numberOfConcepts * 350),
                temperature: 0.9
            });

            currentResult = response;
            displayResults(response, 'Mashup Concepts');

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), `Error generating mashup concepts: ${error.message}`);
        }
    }

    async function handleAnalyzeSubmit(event) {
        event.preventDefault();

        if (!window.apiManager?.getApiKey()) {
            utils.showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const song1 = document.getElementById('song1').value.trim();
        const song2 = document.getElementById('song2').value.trim();
        const song1Tempo = document.getElementById('song1Tempo').value;
        const song2Tempo = document.getElementById('song2Tempo').value;
        const song1Key = document.getElementById('song1Key').value;
        const song2Key = document.getElementById('song2Key').value;
        const specificGoals = document.getElementById('specificGoals').value.trim();

        if (!song1 || !song2) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter both songs to analyze.');
            return;
        }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `You are an expert DJ and music producer analyzing the mashup potential between two specific songs. Provide a comprehensive compatibility analysis.

Song 1: ${song1}${song1Tempo ? ` (${song1Tempo} BPM)` : ''}${song1Key ? ` (Key: ${song1Key})` : ''}
Song 2: ${song2}${song2Tempo ? ` (${song2Tempo} BPM)` : ''}${song2Key ? ` (Key: ${song2Key})` : ''}
${specificGoals ? `Goals: ${specificGoals}` : ''}

Provide detailed analysis:

**COMPATIBILITY OVERVIEW**

**Overall Mashup Score:** X/10
**Difficulty Level:** [Beginner/Intermediate/Advanced]
**Recommended For:** [Type of DJ/producer who should attempt this]

**COMPATIBILITY BREAKDOWN**

**Tempo Analysis:**
- Song 1 BPM: [State or estimate]
- Song 2 BPM: [State or estimate]
- Tempo Differential: [X% difference]
- Tempo Solution: [How to match - speed up, slow down, or creative solution]
- Impact on Quality: [How tempo changes affect the songs]

**Key & Harmonic Analysis:**
- Song 1 Key: [State or estimate]
- Song 2 Key: [State or estimate]
- Harmonic Relationship: [Compatible, needs pitch shift, distance in semitones]
- Pitch Shifting Required: [How many semitones and in which direction]
- Tonal Compatibility: [How well the melodies/harmonies will blend]

**Structural Compatibility:**
- Song structures: [Verse/chorus patterns]
- Time signatures: [If different, explain challenges]
- Section lengths: [How well sections align]
- Best sync points: [Where to align the songs]

**Sonic & Production Analysis:**
- Frequency ranges: [Where each song sits sonically]
- Vocal compatibility: [If both have vocals, how to handle]
- Percussion/rhythm compatibility: [How drums/beats will interact]
- Production era/style: [How production styles mesh]

**RECOMMENDED APPROACH**

**Method 1: [Name of approach]**
[Detailed step-by-step instructions]

**Method 2: [Alternative approach]**
[Another way to combine them]

**POTENTIAL CHALLENGES:**
1. [Challenge 1 and solution]
2. [Challenge 2 and solution]
3. [Challenge 3 and solution]

**CREATIVE OPPORTUNITIES:**
• [Unique aspect this combo offers]
• [Unexpected moment that could work great]
• [Signature element to feature]

**MIXING TIPS:**
• [Specific EQ suggestions]
• [Volume balance recommendations]
• [Effect/processing ideas]

**FINAL VERDICT:**
[Honest assessment: Is this mashup worth pursuing? Why or why not?]

Be honest and technical. If the mashup is challenging, explain why and provide solutions.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Analyze mashup compatibility between:\n1. ${song1}\n2. ${song2}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: 2000,
                temperature: 0.7
            });

            currentResult = response;
            displayResults(response, 'Mashup Compatibility Analysis');

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), `Error analyzing mashup: ${error.message}`);
        }
    }

    function handleRegenerate(event) {
        event.preventDefault();
        if (currentMode === 'discover') {
            handleDiscoverSubmit(event);
        } else {
            handleAnalyzeSubmit(event);
        }
    }

    function displayResults(content, title) {
        document.getElementById('resultTitle').textContent = title;
        
        // Format the content with proper HTML and styling
        let formattedContent = content
            .replace(/\*\*Mashup #(\d+): (.*?)\*\*/g, '<h3>🎵 Mashup #$1: $2</h3>')
            .replace(/\*\*COMPATIBILITY OVERVIEW\*\*/g, '<h3>📊 Compatibility Overview</h3>')
            .replace(/\*\*COMPATIBILITY BREAKDOWN\*\*/g, '<h3>🔬 Compatibility Breakdown</h3>')
            .replace(/\*\*RECOMMENDED APPROACH\*\*/g, '<h3>🎯 Recommended Approach</h3>')
            .replace(/\*\*POTENTIAL CHALLENGES:\*\*/g, '<h3>⚠️ Potential Challenges</h3>')
            .replace(/\*\*CREATIVE OPPORTUNITIES:\*\*/g, '<h3>✨ Creative Opportunities</h3>')
            .replace(/\*\*MIXING TIPS:\*\*/g, '<h3>🎚️ Mixing Tips</h3>')
            .replace(/\*\*FINAL VERDICT:\*\*/g, '<h3>⚖️ Final Verdict</h3>')
            .replace(/\*\*Overall Mashup Score:\*\* (\d+)\/10/g, function(match, score) {
                const scoreNum = parseInt(score);
                let badgeClass = 'compatibility-challenging';
                if (scoreNum >= 9) badgeClass = 'compatibility-excellent';
                else if (scoreNum >= 7) badgeClass = 'compatibility-good';
                else if (scoreNum >= 5) badgeClass = 'compatibility-moderate';
                return `**Overall Mashup Score:** <span class="compatibility-badge ${badgeClass}">${score}/10</span>`;
            })
            .replace(/\*\*Difficulty Level:\*\* (Beginner|Intermediate|Advanced)/g, function(match, level) {
                const dots = level === 'Beginner' ? 1 : level === 'Intermediate' ? 2 : 3;
                let dotsHtml = '';
                for (let i = 0; i < 3; i++) {
                    dotsHtml += `<span class="difficulty-dot ${i < dots ? 'active' : ''}"></span>`;
                }
                return `**Difficulty Level:** <span class="difficulty-indicator">${dotsHtml}<span>${level}</span></span>`;
            })
            .replace(/\*\*Combination:\*\*/g, '<h4>🎼 Combination:</h4>')
            .replace(/\*\*Why This Works:\*\*/g, '<h4>💡 Why This Works:</h4>')
            .replace(/\*\*Technical Details:\*\*/g, '<h4>⚙️ Technical Details:</h4>')
            .replace(/\*\*Arrangement Suggestions:\*\*/g, '<h4>🎹 Arrangement Suggestions:</h4>')
            .replace(/\*\*Key Mixing Techniques:\*\*/g, '<h4>🎛️ Key Mixing Techniques:</h4>')
            .replace(/\*\*Creative Elements:\*\*/g, '<h4>✨ Creative Elements:</h4>')
            .replace(/\*\*Best Context:\*\*/g, '<h4>🎪 Best Context:</h4>')
            .replace(/\*\*Tempo Analysis:\*\*/g, '<h4>🥁 Tempo Analysis:</h4>')
            .replace(/\*\*Key & Harmonic Analysis:\*\*/g, '<h4>🎹 Key & Harmonic Analysis:</h4>')
            .replace(/\*\*Structural Compatibility:\*\*/g, '<h4>🏗️ Structural Compatibility:</h4>')
            .replace(/\*\*Sonic & Production Analysis:\*\*/g, '<h4>🔊 Sonic & Production Analysis:</h4>')
            .replace(/\*\*Method (\d+): (.*?)\*\*/g, '<h4>📍 Method $1: $2</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- /g, '\n• ')
            .replace(/\n/g, '<br>');

        document.getElementById('resultContent').innerHTML = formattedContent;
    }

    // Register standard copy/download actions
    utils.registerToolActions('song-mashup-concept', () => currentResult);
});
