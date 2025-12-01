document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    async function generateTwist() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const storyContext = document.getElementById('storyContext').value.trim();
        const genre = document.getElementById('genre').value;
        const twistType = document.getElementById('twistType').value;
        const twistTiming = document.getElementById('twistTiming').value;
        const impactLevel = document.getElementById('impactLevel').value;
        const existingClues = document.getElementById('existingClues').value.trim();
        const avoidElements = document.getElementById('avoidElements').value.trim();
        const includeForeshadowing = document.getElementById('includeForeshadowing').checked;
        const includeClues = document.getElementById('includeClues').checked;
        const includeReactions = document.getElementById('includeReactions').checked;
        const includeConsequences = document.getElementById('includeConsequences').checked;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!storyContext) {
            utils.showError(document.getElementById('errorDiv'), 'Please provide your current story context');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!genre) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a story genre');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const twistTypeNames = {
                'any': 'Surprise plot twist (any type)',
                'identity': 'Character identity reveal',
                'betrayal': 'Betrayal or alliance switch',
                'hidden-connection': 'Hidden character connection',
                'false-reality': 'False reality or simulation reveal',
                'time-manipulation': 'Time travel or manipulation',
                'unreliable-narrator': 'Unreliable narrator reveal',
                'moral-reversal': 'Moral reversal (hero becomes villain or vice versa)',
                'hidden-motive': 'Hidden motive reveal',
                'fake-death': 'Fake death or character return',
                'secret-organization': 'Secret organization reveal',
                'family-secret': 'Family secret or heritage reveal',
                'prophecy-subversion': 'Prophecy subversion',
                'technology-reveal': 'Technology or magic system reveal',
                'past-connection': 'Past event connection',
                'parallel-reality': 'Parallel world or reality'
            };

            const timingInstructions = {
                'midpoint': 'This twist should occur at the story midpoint as a major revelation that changes everything',
                'climax': 'This twist should occur near the climax as a final major revelation',
                'resolution': 'This twist should occur during resolution as an epilogue surprise',
                'early': 'This twist should occur early in the story to set a new direction',
                'multiple': 'This should be part of a series of reveals across multiple points'
            };

            const impactInstructions = {
                'subtle': 'Create a subtle twist that recontextualizes existing details',
                'moderate': 'Create a moderate twist that changes the story direction',
                'major': 'Create a major twist that transforms the entire narrative',
                'game-changing': 'Create a game-changing twist where everything is different'
            };

            let includeInstructions = [];
            if (includeForeshadowing) includeInstructions.push('foreshadowing suggestions for earlier in the story');
            if (includeClues) includeInstructions.push('specific clues to plant earlier');
            if (includeReactions) includeInstructions.push('character reactions to the twist');
            if (includeConsequences) includeInstructions.push('story consequences and implications');

            const includeText = includeInstructions.length > 0 ?
                `\n\nAlso include: ${includeInstructions.join(', ')}.` : '';

            const existingCluesText = existingClues ?
                `\n\nExisting clues to incorporate: ${existingClues}` : '';

            const avoidText = avoidElements ?
                `\n\nAvoid these elements: ${avoidElements}` : '';

            const systemPrompt = `You are a master storyteller and plot twist expert. Create a compelling, logical plot twist that fits seamlessly into the given story context.

STORY CONTEXT:
${storyContext}

REQUIREMENTS:
- Genre: ${genre}
- Twist Type: ${twistTypeNames[twistType]}
- Timing: ${timingInstructions[twistTiming]}
- Impact Level: ${impactInstructions[impactLevel]}${existingCluesText}${avoidText}${includeText}

GUIDELINES:
1. Make the twist surprising yet logical in hindsight
2. Ensure it respects established story elements and character motivations
3. Provide clear integration with the existing narrative
4. Make it emotionally resonant and meaningful to the story
5. Avoid clichés and overused plot devices
6. Ensure the twist enhances rather than undermines the story

Create a detailed plot twist that fits naturally into the story while providing maximum impact.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate a ${twistTypeNames[twistType]} for this ${genre} story.` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
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
            console.error('Error generating plot twist:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate plot twist. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateAlternative() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const storyContext = document.getElementById('storyContext').value.trim();
        const genre = document.getElementById('genre').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Create a completely different plot twist for the same story. Use a different approach, type, or angle while maintaining the same quality and story fit. Avoid repeating elements from the previous twist.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create an alternative plot twist for this ${genre} story:\n\n${storyContext}` }
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
            console.error('Error generating alternative:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `Refine and improve the existing plot twist. Make it more sophisticated, add more depth, or enhance the emotional impact while keeping the core concept.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Refine this plot twist:\n\n${currentResult}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.6
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

    // Register standard copy/download actions
    utils.registerToolActions('plot-twist-generator', () => currentResult);

    function generateNew() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('storyContext').value = '';
        document.getElementById('existingClues').value = '';
        document.getElementById('avoidElements').value = '';
        document.getElementById('genre').value = '';
        document.getElementById('twistType').value = 'any';
        document.getElementById('twistTiming').value = 'midpoint';
        document.getElementById('impactLevel').value = 'moderate';
        document.getElementById('storyContext').focus();
    }

    // Make functions globally available for onclick handlers
    window.generateTwist = generateTwist;
    window.generateAlternative = generateAlternative;
    window.generateVariation = generateVariation;
    window.generateNew = generateNew;
});