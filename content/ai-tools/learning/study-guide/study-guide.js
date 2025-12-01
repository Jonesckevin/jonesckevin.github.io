document.addEventListener('DOMContentLoaded', function() {
    let currentResult = '';

    async function generateStudyGuide() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const subject = document.getElementById('subject').value.trim();
        const studyContent = document.getElementById('studyContent').value.trim();
        const studyLevel = document.getElementById('studyLevel').value;
        const guideType = document.getElementById('guideType').value;
        const includeQuizzes = document.getElementById('includeQuizzes').checked;
        const includeFlashcards = document.getElementById('includeFlashcards').checked;
        const includeMnemonics = document.getElementById('includeMnemonics').checked;
        const focusAreas = document.getElementById('focusAreas').value.trim();

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!subject) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter the subject or course name');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!studyContent) {
            utils.showError(document.getElementById('errorDiv'), 'Please provide the course content or material to study');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const guideTypeInstructions = {
                'comprehensive': 'Create a comprehensive review covering all major topics with detailed explanations and connections between concepts.',
                'exam-prep': 'Focus on exam preparation with key formulas, important facts, likely test questions, and critical concepts.',
                'quick-reference': 'Create a concise, scannable reference guide with key points, definitions, and essential information.',
                'concept-map': 'Organize information as a concept map showing relationships between ideas and hierarchical structure.',
                'practice-focused': 'Emphasize practical application with examples, problem-solving strategies, and hands-on exercises.'
            };

            const levelInstructions = {
                'high-school': 'Use clear, accessible language appropriate for high school students. Focus on fundamental concepts and basic applications.',
                'undergraduate': 'Use college-level terminology and depth. Include intermediate concepts and analytical thinking.',
                'graduate': 'Use advanced academic language. Include complex theories, research connections, and critical analysis.',
                'professional': 'Focus on practical application and industry standards. Include certification-relevant information.'
            };

            let practiceElements = [];
            if (includeQuizzes) practiceElements.push('practice questions and quiz items');
            if (includeFlashcards) practiceElements.push('flashcard terms with definitions');
            if (includeMnemonics) practiceElements.push('memory techniques and mnemonics');

            const practiceInstruction = practiceElements.length > 0 ? 
                `Include these practice elements: ${practiceElements.join(', ')}.` : '';

            const focusInstruction = focusAreas ? 
                `Pay special attention to these focus areas: ${focusAreas}.` : '';

            const systemPrompt = `You are an expert educational content creator and study guide specialist. Create a comprehensive, well-structured study guide for the given subject and material.

SUBJECT: ${subject}
ACADEMIC LEVEL: ${studyLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
GUIDE TYPE: ${guideType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

INSTRUCTIONS:
${guideTypeInstructions[guideType]}
${levelInstructions[studyLevel]}
${practiceInstruction}
${focusInstruction}

Structure the study guide with:

1. **Overview & Learning Objectives**
   - Brief subject overview
   - Key learning objectives
   - What students should know by the end

2. **Core Content Sections**
   - Break material into logical sections/chapters
   - Key concepts and definitions
   - Important facts and formulas
   - Examples and explanations
   - Visual organizers when helpful

3. **Practice Elements** (if requested)
   - Practice questions with answers
   - Flashcard terms and definitions
   - Memory techniques and mnemonics
   - Application exercises

4. **Study Strategies**
   - How to approach studying this material
   - Time management suggestions
   - Review schedule recommendations

5. **Quick Reference Summary**
   - Key formulas, dates, terms
   - Must-know concepts
   - Common mistakes to avoid

Make it educational, well-organized, and study-friendly with clear headings and formatting.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a study guide for:\n\nSUBJECT: ${subject}\n\nCONTENT:\n${studyContent}` }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 3000,
                temperature: 0.3
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7; color: #e0e0e0;">${htmlContent}</div>
                </div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating study guide:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate study guide. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    // Register standard copy/download actions
    utils.registerToolActions('study-guide', () => currentResult);

    // Keep generate-specific function
    window.generateStudyGuide = generateStudyGuide;
});
