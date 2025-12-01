document.addEventListener('DOMContentLoaded', function () {
    const apiManager = new APIManager();
    const downloadManager = new DownloadManager();
    let currentResult = '';

    const form = document.getElementById('parodyForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        await generateParody();
    });

    async function generateParody() {
        // Get form values
        const songTitle = document.getElementById('songTitle').value.trim();
        const artist = document.getElementById('artist').value.trim();
        const parodyTopic = document.getElementById('parodyTopic').value.trim();
        const specificDetails = document.getElementById('specificDetails').value.trim();
        const tone = document.getElementById('tone').value;
        const parodyLength = document.getElementById('parodyLength').value;
        const matchMeter = document.getElementById('matchMeter').checked;
        const includeChords = document.getElementById('includeChords').checked;
        const familyFriendly = document.getElementById('familyFriendly').checked;

        // Validation
        if (!songTitle || !artist || !parodyTopic) {
            utils.showError(document.getElementById('errorDiv'), 'Please fill in the song title, artist, and parody topic');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // API key validation
        if (!apiManager.getApiKey()) {
            utils.showError(document.getElementById('errorDiv'), 'Please configure your API key in the navigation menu');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const detailsText = specificDetails ? `\n\nSpecific elements to include: ${specificDetails}` : '';
            const meterText = matchMeter ? '\n- Carefully match the syllable count and rhythm of the original song' : '\n- Maintain similar structure but flexibility with exact syllable matching is okay';
            const chordsText = includeChords ? '\n- Include basic chord progression notation above lyrics' : '';
            const contentText = familyFriendly ? '\n- Keep all content family-friendly and appropriate for all ages' : '\n- Content can be edgy but not offensive';

            const lengthGuide = {
                'verse-chorus': 'Write the first verse and chorus only',
                'full': 'Write the complete song including all verses, choruses, and bridge if applicable',
                'extended': 'Write an extended version with additional verses or creative sections'
            };

            const toneGuide = {
                'funny': 'humorous, lighthearted, and entertaining',
                'satirical': 'witty, clever, and satirical with sharp observations',
                'educational': 'informative and educational while being engaging',
                'inspirational': 'uplifting, motivational, and positive',
                'absurd': 'wonderfully absurd and nonsensical in a creative way'
            };

            const systemPrompt = `You are a talented lyricist and parody songwriter specializing in transforming popular songs into clever, well-crafted parodies. You have deep knowledge of song structure, rhyme schemes, and meter.

ORIGINAL SONG:
- Title: "${songTitle}"
- Artist: ${artist}

PARODY SPECIFICATIONS:
- Topic/Theme: ${parodyTopic}
- Tone: ${toneGuide[tone]}
- Length: ${lengthGuide[parodyLength]}${detailsText}

WRITING GUIDELINES:${meterText}
- Match the original rhyme scheme
- Preserve the emotional arc and energy of the original
- Include creative wordplay and clever references
- Label each section (Verse 1, Chorus, Bridge, etc.)${chordsText}${contentText}
- Make it singable to the original melody
- Include performance notes if helpful

FORMAT YOUR RESPONSE:
# [Parody Title]
*Parody of "${songTitle}" by ${artist}*
*Theme: ${parodyTopic}*

---

[Verse 1]
[Lyrics with proper line breaks]

[Chorus]
[Lyrics]

[Continue with all sections...]

---

**Performance Tips:**
[Brief tips for singing/performing this parody]

Make it memorable, clever, and fun to perform!`;

            const userPrompt = `Write a ${tone} parody of "${songTitle}" by ${artist} about ${parodyTopic}.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];

            const response = await apiManager.makeRequest(messages, {
                temperature: 0.9,
                max_tokens: 2000
            });

            currentResult = response;

            // Display result
            document.getElementById('resultContent').innerHTML = utils.formatMarkdown(response);
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate parody. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        } finally {
            document.getElementById('loadingDiv').style.display = 'none';
        }
    }

    // Register standard copy/download actions
    utils.registerToolActions('song-parody-writer', () => currentResult);
});
