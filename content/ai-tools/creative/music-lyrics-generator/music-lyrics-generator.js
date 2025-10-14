document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Toggle style options based on generation mode
    window.toggleStyleOptions = function () {
        const mode = document.getElementById('generationMode').value;
        const styleOptions = document.getElementById('styleOptions');

        if (mode === 'style') {
            styleOptions.style.display = 'block';
        } else {
            styleOptions.style.display = 'none';
        }
    };

    // Form submission
    document.getElementById('lyricsForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        await generateLyrics();
    });

    async function generateLyrics() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const songTheme = document.getElementById('songTheme').value.trim();
        const generationMode = document.getElementById('generationMode').value;
        const artistOrSong = document.getElementById('artistOrSong').value.trim();
        const genre = document.getElementById('genre').value;
        const mood = document.getElementById('mood').value;
        const songStructure = document.getElementById('songStructure').value;
        const verseCount = document.getElementById('verseCount').value;
        const lineLength = document.getElementById('lineLength').value;
        const language = document.getElementById('language').value;
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        // Lyrical features
        const includeMetaphors = document.getElementById('includeMetaphors').checked;
        const includeRhyming = document.getElementById('includeRhyming').checked;
        const includeHooks = document.getElementById('includeHooks').checked;
        const includeWordplay = document.getElementById('includeWordplay').checked;
        const includeRepetition = document.getElementById('includeRepetition').checked;
        const includeImagery = document.getElementById('includeImagery').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = {
                openai: 'OpenAI',
                deepseek: 'DeepSeek',
                anthropic: 'Anthropic'
            };
            utils.showError(
                document.getElementById('errorDiv'),
                `Please enter a valid ${providerNames[aiProvider]} API key`
            );
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!songTheme) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Please enter a song theme or topic'
            );
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!genre || !mood || !songStructure) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Please fill in all required fields'
            );
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (generationMode === 'style' && !artistOrSong) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Please enter an artist or song reference for style-based generation'
            );
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Hide error and show loading
        document.getElementById('errorDiv').style.display = 'none';
        const resultContent = document.getElementById('resultContent');
        const resultDiv = document.getElementById('resultDiv');
        resultDiv.style.display = 'block';
        utils.showLoading(resultContent, 'Creating your song lyrics...');

        try {
            // Build the prompt
            let prompt = buildLyricsPrompt({
                songTheme,
                generationMode,
                artistOrSong,
                genre,
                mood,
                songStructure,
                verseCount,
                lineLength,
                language,
                additionalNotes,
                includeMetaphors,
                includeRhyming,
                includeHooks,
                includeWordplay,
                includeRepetition,
                includeImagery
            });

            // Call AI API
            const result = await callAIAPI(apiKey, aiProvider, prompt);
            currentResult = result;

            // Display result with formatting
            displayFormattedLyrics(result);

        } catch (error) {
            console.error('Error generating lyrics:', error);
            utils.showError(
                resultContainer,
                `Failed to generate lyrics: ${error.message}`
            );
        }
    }

    function buildLyricsPrompt(options) {
        let prompt = '';

        // Generation mode specific instructions
        if (options.generationMode === 'style') {
            prompt += `Write song lyrics in the style of "${options.artistOrSong}". `;
        } else {
            prompt += `Write original, creative song lyrics. `;
        }

        // Main requirements
        prompt += `Create professional song lyrics about "${options.songTheme}". `;
        prompt += `Genre: ${options.genre}. `;
        prompt += `Mood/Emotion: ${options.mood}. `;

        // Structure
        const structureMap = {
            'standard': 'Use standard song structure with: Intro, Verse, Chorus, Verse, Chorus, Bridge, Chorus',
            'simple': 'Use simple structure: Verse, Chorus, Verse, Chorus, Bridge, Chorus',
            'extended': 'Use extended structure: Intro, Verse, Pre-Chorus, Chorus, Verse, Pre-Chorus, Chorus, Bridge, Chorus, Outro',
            'minimal': 'Use minimal structure: Verse, Chorus, Verse, Chorus',
            'custom': 'Choose an appropriate song structure that fits the theme and genre'
        };
        prompt += `${structureMap[options.songStructure]}. `;

        // Verse count
        prompt += `Include ${options.verseCount} verses. `;

        // Line length
        const lineLengthMap = {
            'short': 'Keep lines short and punchy (4-6 words per line)',
            'medium': 'Use medium-length lines (7-10 words per line)',
            'long': 'Use longer, flowing lines (11-15 words per line)'
        };
        prompt += `${lineLengthMap[options.lineLength]}. `;

        // Lyrical features
        let features = [];
        if (options.includeMetaphors) features.push('rich metaphors and similes');
        if (options.includeRhyming) features.push('consistent rhyme scheme');
        if (options.includeHooks) features.push('catchy, memorable hooks');
        if (options.includeWordplay) features.push('clever wordplay and puns');
        if (options.includeRepetition) features.push('effective repetition for emphasis');
        if (options.includeImagery) features.push('vivid imagery and descriptive language');

        if (features.length > 0) {
            prompt += `Include the following elements: ${features.join(', ')}. `;
        }

        // Additional notes
        if (options.additionalNotes) {
            prompt += `Additional requirements: ${options.additionalNotes}. `;
        }

        // Language
        if (options.language !== 'en') {
            const languageMap = {
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'it': 'Italian',
                'pt': 'Portuguese',
                'ja': 'Japanese',
                'ko': 'Korean'
            };
            prompt += `Write the lyrics in ${languageMap[options.language]}. `;
        }

        // Formatting instructions
        prompt += `\n\nFormat the output clearly with section labels (e.g., [Intro], [Verse 1], [Chorus], [Bridge], etc.). `;
        prompt += `Each section should be clearly separated. `;
        prompt += `Make the lyrics professional, creative, and emotionally resonant. `;
        prompt += `Ensure the chorus is catchy and repeatable. `;

        return prompt;
    }

    async function callAIAPI(apiKey, provider, prompt) {
        const apiConfigs = {
            openai: {
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: {
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional songwriter and lyricist with expertise across all music genres. You create compelling, emotionally resonant lyrics with proper song structure.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.9,
                    max_tokens: 2000
                }
            },
            deepseek: {
                url: 'https://api.deepseek.com/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional songwriter and lyricist with expertise across all music genres. You create compelling, emotionally resonant lyrics with proper song structure.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.9,
                    max_tokens: 2000
                }
            },
            anthropic: {
                url: 'https://api.anthropic.com/v1/messages',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: {
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    messages: [
                        {
                            role: 'user',
                            content: `You are a professional songwriter and lyricist with expertise across all music genres. You create compelling, emotionally resonant lyrics with proper song structure.\n\n${prompt}`
                        }
                    ],
                    temperature: 0.9
                }
            }
        };

        const config = apiConfigs[provider];
        if (!config) {
            throw new Error(`Unsupported AI provider: ${provider}`);
        }

        const response = await fetch(config.url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(config.body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract content based on provider
        if (provider === 'anthropic') {
            return data.content[0].text;
        } else {
            return data.choices[0].message.content;
        }
    }

    function displayFormattedLyrics(lyrics) {
        const resultContent = document.getElementById('resultContent');

        // Try to parse sections for better formatting
        const sectionRegex = /\[(.*?)\]/g;
        let formattedHTML = '';

        if (sectionRegex.test(lyrics)) {
            // Lyrics have section markers
            const sections = lyrics.split(/(\[.*?\])/);

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i].trim();
                if (!section) continue;

                if (section.startsWith('[') && section.endsWith(']')) {
                    // This is a section title
                    const title = section.slice(1, -1);
                    formattedHTML += `<div class="lyrics-section"><div class="section-title">${title}</div>`;
                } else {
                    // This is lyrics content
                    const lines = section.split('\n').filter(line => line.trim());
                    lines.forEach(line => {
                        formattedHTML += `<div class="lyrics-line">${line}</div>`;
                    });
                    formattedHTML += `</div>`;
                }
            }

            resultContent.innerHTML = formattedHTML;
        } else {
            // No section markers, display as-is with line breaks
            resultContent.innerHTML = lyrics.replace(/\n/g, '<br>');
        }
    }

    // Copy to clipboard
    window.copyToClipboard = function () {
        if (!currentResult) return;

        navigator.clipboard.writeText(currentResult).then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied!';
            copyBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20893a 100%)';

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    };

    // Download lyrics
    window.downloadLyrics = function () {
        if (!currentResult) return;

        const songTheme = document.getElementById('songTheme').value.trim();
        const filename = `lyrics-${songTheme.replace(/\s+/g, '-').toLowerCase()}.txt`;

        const blob = new Blob([currentResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Generate new lyrics
    window.generateNewLyrics = function () {
        generateLyrics();
    };
});
