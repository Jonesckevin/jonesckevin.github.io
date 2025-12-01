document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    async function generateTrapPuzzle() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const generationType = document.getElementById('generationType').value;
        const setting = document.getElementById('setting').value;
        const difficulty = document.getElementById('difficulty').value;
        const purpose = document.getElementById('purpose').value;
        const theme = document.getElementById('theme').value.trim();
        const specialRequests = document.getElementById('specialRequests').value.trim();
        const includeVariations = document.getElementById('includeVariations').checked;
        const includeFailsafes = document.getElementById('includeFailsafes').checked;
        const includeClues = document.getElementById('includeClues').checked;
        const includeRewards = document.getElementById('includeRewards').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            let providerLabel = aiProvider;
            try { providerLabel = (window.apiManager && window.apiManager.getProviderConfig(aiProvider)?.name) || aiProvider; } catch (_) { }
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerLabel} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!generationType) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a type (trap, puzzle, or both)');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const typeInstructions = {
                'trap': 'Create a trap with trigger mechanisms, effects, detection methods, and disarm procedures',
                'puzzle': 'Create a puzzle with clear challenge, solution method, clues, and failure consequences',
                'both': 'Create a combination trap-puzzle where solving the puzzle disarms the trap or avoiding the trap reveals the puzzle'
            };

            const difficultyInstructions = {
                'easy': 'Easy difficulty for low-level characters (DC 10-12, 1d6 damage, simple mechanics)',
                'moderate': 'Moderate difficulty for mid-level characters (DC 13-15, 2d6 damage, intermediate mechanics)',
                'hard': 'Hard difficulty for high-level characters (DC 16-18, 3d6+ damage, complex mechanics)',
                'deadly': 'Deadly difficulty for epic-level characters (DC 19+, 4d6+ damage, very complex mechanics)'
            };

            const purposeDescriptions = {
                'guardian': 'Protect valuable treasure, important location, or sacred area',
                'deterrent': 'Discourage casual intruders while allowing determined parties to proceed',
                'test': 'Test worthiness, intelligence, or specific skills of those who encounter it',
                'alarm': 'Alert guards, inhabitants, or magical systems to intrusion',
                'delay': 'Slow down intruders to buy time for responses or other events',
                'capture': 'Capture or restrain intruders for later questioning or judgment',
                'information': 'Convey important information, warnings, or instructions',
                'entertainment': 'Provide challenge and engagement for recreational purposes'
            };

            const themeText = theme ? `Theme/Concept: ${theme}` : '';
            const specialText = specialRequests ? `Special Requirements: ${specialRequests}` : '';

            let includeElements = [];
            if (includeVariations) includeElements.push('difficulty scaling options for different party levels');
            if (includeFailsafes) includeElements.push('failsafes, bypasses, or alternative solutions');
            if (includeClues) includeElements.push('hidden clues and hints for players to discover');
            if (includeRewards) includeElements.push('appropriate rewards for successful completion');

            const includeText = includeElements.length > 0 ?
                `Include: ${includeElements.join(', ')}.` : '';

            const systemPrompt = `You are a master dungeon designer specializing in creating engaging traps and puzzles for tabletop RPGs. Create detailed, balanced challenges that enhance gameplay and storytelling.

DESIGN PARAMETERS:
- Type: ${typeInstructions[generationType]}
- Setting: ${setting}
- Difficulty: ${difficultyInstructions[difficulty]}
- Purpose: ${purposeDescriptions[purpose]}
${themeText}
${specialText}
${includeText}

REQUIREMENTS FOR TRAPS:
1. **Trigger Mechanism** - How the trap activates
2. **Detection** - How players can spot it (Perception DC, Investigation clues)
3. **Effects** - Damage, conditions, or consequences when triggered
4. **Disarm Method** - How to safely disable it (skill checks, tools needed)
5. **Reset Capability** - Whether and how it resets

REQUIREMENTS FOR PUZZLES:
1. **Challenge Description** - What players see and must solve
2. **Solution Method** - The correct approach or answer
3. **Clues Available** - Hints players can discover
4. **Failure Consequences** - What happens with wrong attempts
5. **Success Outcome** - What happens when solved correctly

GENERAL REQUIREMENTS:
- Include specific DCs and mechanics for D&D 5e or similar systems
- Provide clear descriptions for DM presentation
- Consider player agency and multiple approaches
- Balance challenge with fairness
- Include atmospheric details for immersion

FORMAT as clear Markdown with:
- Compelling title and brief description
- Detailed mechanics with specific numbers
- Multiple sections clearly organized
- DM guidance and tips
- Player-facing descriptions separate from mechanical details

Create something memorable that players will talk about after the session!`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a ${generationType} for a ${setting} setting with ${difficulty} difficulty, serving as a ${purpose}.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: generationType === 'both' ? 2500 : 2000,
                temperature: 0.7
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div class="result-display">${htmlContent}</div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating trap/puzzle:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate trap/puzzle. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const generationType = document.getElementById('generationType').value;
        const setting = document.getElementById('setting').value;
        const difficulty = document.getElementById('difficulty').value;
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create a completely different ${generationType} with the same difficulty and setting but different mechanics, themes, and approach. Explore alternative design concepts and creative solutions.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create an alternative ${generationType} for a ${setting} setting with ${difficulty} difficulty.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.8
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div class="result-display">${htmlContent}</div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate variation. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult(evt) {
        const btn = evt?.target;
        if (window.utils && typeof window.utils.copyWithFeedback === 'function' && btn) {
            window.utils.copyWithFeedback(currentResult, btn);
        } else {
            utils.copyToClipboard(currentResult).then(success => {
                if (success && btn) {
                    const originalText = btn.innerHTML;
                    const originalBg = btn.style.background;
                    btn.innerHTML = '✅ Copied!';
                    btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = originalBg || '';
                    }, 2000);
                }
            });
        }
    }

    function downloadResult(format, evt) {
        const generationType = document.getElementById('generationType').value || 'trap-puzzle';
        const setting = document.getElementById('setting').value || 'dungeon';
        const timestamp = new Date().toISOString().slice(0, 10);

        // Set content in download manager
        downloadManager.setContent(currentResult, 'markdown');

        const base = `trap_puzzle_${generationType}_${setting}_${timestamp}`;
        if (format === 'markdown') {
            downloadManager.download('markdown', base);
        } else if (format === 'html') {
            downloadManager.download('html', base);
        }

        // Button feedback
        const btn = evt?.target;
        if (btn) {
            const originalText = btn.innerHTML;
            const originalBg = btn.style.background;
            btn.innerHTML = '⬇️ Saved!';
            btn.style.background = 'linear-gradient(135deg, #17a2b8, #20c997)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg || '';
            }, 1500);
        }
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('theme').value = '';
        document.getElementById('specialRequests').value = '';
        document.getElementById('generationType').value = '';
        document.getElementById('setting').value = 'dungeon';
        document.getElementById('difficulty').value = 'moderate';
        document.getElementById('purpose').value = 'guardian';
        document.getElementById('includeVariations').checked = true;
        document.getElementById('includeFailsafes').checked = true;
        document.getElementById('includeClues').checked = false;
        document.getElementById('includeRewards').checked = false;
    }

    // Make functions globally available
    window.generateTrapPuzzle = generateTrapPuzzle;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});