// Global function for custom topic toggle
function toggleCustomTopic() {
    const topicSelect = document.getElementById('topicSelect');
    const customTopicGroup = document.getElementById('customTopicGroup');

    if (topicSelect.value === 'custom') {
        customTopicGroup.style.display = 'block';
    } else {
        customTopicGroup.style.display = 'none';
    }
}

// Global function for question count slider
function updateQuestionCount(value) {
    document.getElementById('questionCountDisplay').textContent = value;
}

// Global function for difficulty display
function updateDifficultyDisplay(value) {
    console.log('updateDifficultyDisplay called with value:', value);
    const difficultyLevels = {
        1: 'Elementary (1)',
        2: 'Elementary+ (2)',
        3: 'High School (3)',
        4: 'High School+ (4)',
        5: 'College (5)',
        6: 'College+ (6)',
        7: 'University (7)',
        8: 'University+ (8)',
        9: 'Graduate (9)',
        10: 'PhD/Expert (10)'
    };
    const displayText = difficultyLevels[value] || `Level ${value}`;
    console.log('Setting display text to:', displayText);
    const element = document.getElementById('difficultyDisplay');
    if (element) {
        element.textContent = displayText;
        console.log('Updated element successfully');
    } else {
        console.error('difficultyDisplay element not found!');
    }
}

// Utility functions to avoid dependency issues
const quizUtils = {
    validateApiKey: function (apiKey, provider) {
        if (!apiKey || apiKey.length < 10) return false;

        switch (provider) {
            case 'openai':
                return apiKey.startsWith('sk-');
            case 'deepseek':
                return apiKey.startsWith('sk-');
            case 'anthropic':
                return apiKey.startsWith('sk-ant-');
            default:
                return apiKey.length > 10;
        }
    },

    showError: function (element, message) {
        element.innerHTML = message;
        element.style.display = 'block';
    },

    copyToClipboard: async function (text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    }
};

// Simple API manager to avoid conflicts
const quizApiManager = {
    makeRequest: async function (messages, options) {
        const { provider, apiKey, maxTokens, temperature } = options;

        let url, headers, body;

        switch (provider) {
            case 'openai':
                url = 'https://api.openai.com/v1/chat/completions';
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: maxTokens,
                    temperature: temperature
                });
                break;

            case 'deepseek':
                url = 'https://api.deepseek.com/v1/chat/completions';
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                body = JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    max_tokens: maxTokens,
                    temperature: temperature
                });
                break;

            case 'anthropic':
                url = 'https://api.anthropic.com/v1/messages';
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                };
                body = JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: maxTokens,
                    temperature: temperature,
                    messages: messages
                });
                break;

            default:
                throw new Error('Unsupported AI provider');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (provider === 'anthropic') {
            return data.content[0].text;
        } else {
            return data.choices[0].message.content;
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    let currentQuizData = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
    let selectedTopic = '';

    async function startQuiz() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const difficulty = document.getElementById('difficultySelect').value;
        const questionCount = document.getElementById('questionCount').value;
        selectedTopic = document.getElementById('topicSelect').value;

        // Handle custom topic
        let topicName = '';
        if (selectedTopic === 'custom') {
            const customTopic = document.getElementById('customTopic').value.trim();
            if (!customTopic) {
                quizUtils.showError(document.getElementById('errorDiv'), 'Please enter a custom topic');
                return;
            }
            topicName = customTopic;
        } else {
            const topicNames = {
                'computers-tech-cybersecurity': 'Computers, Technology & Cyber Security',
                'mathematics': 'Mathematics',
                'world-history': 'World History',
                'environmental-science': 'Environmental Science',
                'english-language': 'English Language',
                'space-astronomy': 'Space & Astronomy',
                'human-anatomy': 'Human Anatomy',
                'programming-fundamentals': 'Programming Fundamentals',
                'economics': 'Economics',
                'art-culture': 'Art & Culture',
                'global-current-events': 'Global Current Events'
            };
            topicName = topicNames[selectedTopic];
        }

        // Validation
        if (!quizUtils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            quizUtils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            return;
        }

        if (!selectedTopic) {
            quizUtils.showError(document.getElementById('errorDiv'), 'Please select a quiz topic');
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('setupForm').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Enhanced difficulty descriptions with educational level mapping
            const difficultyDescriptions = {
                '1': 'Elementary level - very basic concepts and simple vocabulary suitable for young learners',
                '2': 'Elementary+ level - basic concepts with slightly more detail and simple terminology',
                '3': 'High School level - standard curriculum topics with moderate complexity and vocabulary',
                '4': 'High School+ level - advanced high school topics with pre-college level understanding',
                '5': 'College level - undergraduate complexity requiring detailed understanding and analysis',
                '6': 'College+ level - advanced undergraduate topics with specialized knowledge requirements',
                '7': 'University level - comprehensive understanding with analytical and critical thinking',
                '8': 'University+ level - advanced concepts requiring sophisticated analysis and synthesis',
                '9': 'Graduate level - specialized knowledge with research-level understanding and expertise',
                '10': 'PhD/Expert level - cutting-edge concepts, expert analysis, and highly specialized knowledge that challenges even professionals in the field'
            };

            const difficultyInstructions = {
                '1': 'Use simple language and focus on the most basic, fundamental concepts. Questions should be accessible to elementary students.',
                '2': 'Include straightforward questions with slightly more detail than level 1, but still use simple vocabulary.',
                '3': 'Ask about topics covered in typical high school curriculum. Use appropriate academic vocabulary for this level.',
                '4': 'Include advanced high school topics that prepare students for college-level work.',
                '5': 'Questions should require college-level understanding of concepts, theories, and their applications.',
                '6': 'Include advanced undergraduate concepts with some specialized knowledge and technical terminology.',
                '7': 'Questions should challenge someone with comprehensive university-level knowledge and require analytical thinking.',
                '8': 'Include sophisticated concepts requiring advanced analysis, synthesis, and critical evaluation.',
                '9': 'Focus on graduate-level specialized knowledge, research concepts, and complex theoretical understanding.',
                '10': 'Create expert-level questions about: cutting-edge research, highly specialized subdisciplines, complex theoretical frameworks, advanced technical details, or knowledge that would challenge university professors and industry experts.'
            };

            const systemPrompt = `Create a ${questionCount}-question multiple choice quiz about ${topicName} with difficulty level ${difficulty}/10.

DIFFICULTY LEVEL ${difficulty}/10: ${difficultyDescriptions[difficulty]}

SPECIFIC INSTRUCTIONS FOR THIS DIFFICULTY:
${difficultyInstructions[difficulty]}

Requirements:
- ALL questions must be at exactly difficulty level ${difficulty}/10
- ${difficulty >= 8 ? 'Focus on highly specialized, technical, or obscure aspects of ' + topicName : 'Cover a broad range of subtopics within ' + topicName}
- ${difficulty === '10' ? 'Questions should involve extremely specific details, edge cases, rare phenomena, advanced technical specifications, or specialized knowledge that would challenge even experts in the field' : 'Questions should be appropriate for the specified difficulty level'}
- Ensure factual accuracy and clarity
- Each question should be concise but specific
- Each question should have 4 answer options (A, B, C, D)
- Include variety in question types (facts, concepts, applications, technical details)
- Provide a brief explanation for the correct answer
- ${difficulty >= 9 ? 'Use technical terminology and reference specialized concepts' : 'Make questions educational and thought-provoking'}
- Format the quiz in JSON as specified below
- Avoid ambiguous questions but embrace complexity for higher difficulties
- Ensure one clearly correct answer per question
- ${difficulty === '10' ? 'Draw from advanced subdisciplines, cutting-edge research, historical minutiae, or highly technical specifications' : ''}

Format each question as JSON:
{
  "question": "Question text here?",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "correct": 0,
  "explanation": "Brief explanation of why this answer is correct"
}

Return a valid JSON array of ${questionCount} questions.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate a ${questionCount}-question ${topicName} quiz at ${difficultyDescriptions[difficulty]}. Ensure the questions, vocabulary, and concepts are appropriate for this educational level.` }
            ];

            const response = await quizApiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: Math.min(4000, questionCount * 300), // Scale tokens with question count
                temperature: 0.7
            });

            // Parse the quiz data
            try {
                currentQuizData = JSON.parse(response);
                if (!Array.isArray(currentQuizData) || currentQuizData.length === 0) {
                    throw new Error('Invalid quiz format');
                }
            } catch (parseError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    currentQuizData = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Could not parse quiz data');
                }
            }

            // Reset quiz state
            currentQuestionIndex = 0;
            userAnswers = [];
            score = 0;

            // Show quiz interface
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('quizInterface').style.display = 'block';

            // Display first question
            displayQuestion();

        } catch (error) {
            console.error('Error generating quiz:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('setupForm').style.display = 'block';
            quizUtils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate quiz. Please try again.');
        }
    }

    function displayQuestion() {
        const question = currentQuizData[currentQuestionIndex];
        const progressPercent = ((currentQuestionIndex + 1) / currentQuizData.length) * 100;

        // Update progress
        document.getElementById('progressFill').style.width = progressPercent + '%';
        document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = currentQuizData.length;

        // Display question
        document.getElementById('questionText').textContent = question.question;

        // Display options
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option';
            optionDiv.innerHTML = `
                <button class="option-btn" onclick="selectAnswer(${index})" data-index="${index}">
                    ${option}
                </button>
            `;
            optionsContainer.appendChild(optionDiv);
        });

        // Hide next button initially
        document.getElementById('nextButton').style.display = 'none';
    }

    function selectAnswer(selectedIndex) {
        const question = currentQuizData[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;

        // Store answer
        userAnswers[currentQuestionIndex] = {
            selected: selectedIndex,
            correct: question.correct,
            isCorrect: isCorrect
        };

        if (isCorrect) {
            score++;
        }

        // Style the options
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === selectedIndex) {
                // Highlight the selected answer with randomColorBtn hover color
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
                btn.style.border = '2px solid rgba(255, 255, 255, 0.4)';
            }
            if (index === question.correct) {
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                btn.style.border = '2px solid #34ce57';
            } else if (index === selectedIndex && !isCorrect) {
                btn.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
                btn.style.border = '2px solid #e74c3c';
            }
        });

        // Show next button
        document.getElementById('nextButton').style.display = 'block';
    }

    function nextQuestion() {
        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuizData.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        document.getElementById('quizInterface').style.display = 'none';
        document.getElementById('resultsInterface').style.display = 'block';

        const percentage = Math.round((score / currentQuizData.length) * 100);
        document.getElementById('scoreDisplay').textContent = `${score}/${currentQuizData.length} (${percentage}%)`;

        // Generate detailed results
        let resultsHtml = `<h3>Quiz Results</h3>`;

        // Get topic display name
        let topicDisplayName = selectedTopic;
        if (selectedTopic === 'custom') {
            topicDisplayName = document.getElementById('customTopic').value.trim();
        } else {
            topicDisplayName = selectedTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        const difficulty = document.getElementById('difficultySelect').value;
        const difficultyLevels = {
            1: 'Elementary (1)',
            2: 'Elementary+ (2)',
            3: 'High School (3)',
            4: 'High School+ (4)',
            5: 'College (5)',
            6: 'College+ (6)',
            7: 'University (7)',
            8: 'University+ (8)',
            9: 'Graduate (9)',
            10: 'PhD/Expert (10)'
        };
        const difficultyDisplay = difficultyLevels[difficulty] || `Level ${difficulty}`;

        resultsHtml += `<div style="margin-bottom: 20px;"><strong>Topic:</strong> ${topicDisplayName}</div>`;
        resultsHtml += `<div style="margin-bottom: 20px;"><strong>Questions:</strong> ${currentQuizData.length}</div>`;
        resultsHtml += `<div style="margin-bottom: 20px;"><strong>Difficulty:</strong> ${difficultyDisplay}</div>`;

        currentQuizData.forEach((question, index) => {
            const answer = userAnswers[index];
            const isCorrect = answer && answer.isCorrect;

            resultsHtml += `
                <div style="margin-bottom: 15px; padding: 15px; border-radius: 8px; background: ${isCorrect ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};">
                    <div style="font-weight: bold; margin-bottom: 8px;">Q${index + 1}: ${question.question}</div>
                    <div style="margin-bottom: 5px;">Your answer: ${answer ? question.options[answer.selected] : 'Not answered'}</div>
                    <div style="margin-bottom: 5px;">Correct answer: ${question.options[question.correct]}</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${question.explanation}</div>
                </div>
            `;
        });

        document.getElementById('resultsDetails').innerHTML = resultsHtml;
    }

    function retakeQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;
        document.getElementById('resultsInterface').style.display = 'none';
        document.getElementById('quizInterface').style.display = 'block';
        displayQuestion();
    }

    function newTopic() {
        document.getElementById('resultsInterface').style.display = 'none';
        document.getElementById('setupForm').style.display = 'block';
        document.getElementById('topicSelect').value = '';
        document.getElementById('customTopic').value = '';
        document.getElementById('customTopicGroup').style.display = 'none';
    }

    function copyQuizResults() {
        const results = generateResultsText();
        quizUtils.copyToClipboard(results).then(success => {
            if (success) {
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                button.style.background = 'linear-gradient(135deg, #44ff44, #66ff66)';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                }, 2000);
            }
        });
    }

    function downloadQuizResults(format) {
        const results = generateResultsText();
        const filename = `quiz-results_${selectedTopic}_${getCurrentTimestamp()}`;

        // Simple download fallback
        const blob = new Blob([results], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + (format === 'html' ? '.html' : '.md');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getCurrentTimestamp() {
        return new Date().toISOString().slice(0, 19).replace(/[T:]/g, '_');
    }

    function generateResultsText() {
        const percentage = Math.round((score / currentQuizData.length) * 100);
        let results = `# Quiz Results\n\n`;

        // Get topic display name
        let topicDisplayName = selectedTopic;
        if (selectedTopic === 'custom') {
            topicDisplayName = document.getElementById('customTopic').value.trim();
        } else {
            topicDisplayName = selectedTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        const difficulty = document.getElementById('difficultySelect').value;
        const difficultyLevels = {
            1: 'Elementary (1)',
            2: 'Elementary+ (2)',
            3: 'High School (3)',
            4: 'High School+ (4)',
            5: 'College (5)',
            6: 'College+ (6)',
            7: 'University (7)',
            8: 'University+ (8)',
            9: 'Graduate (9)',
            10: 'PhD/Expert (10)'
        };
        const difficultyDisplay = difficultyLevels[difficulty] || `Level ${difficulty}`;

        results += `**Topic:** ${topicDisplayName}\n`;
        results += `**Questions:** ${currentQuizData.length}\n`;
        results += `**Difficulty:** ${difficultyDisplay}\n`;
        results += `**Score:** ${score}/${currentQuizData.length} (${percentage}%)\n`;
        results += `**Date:** ${new Date().toLocaleDateString()}\n\n`;

        results += `## Questions and Answers\n\n`;

        currentQuizData.forEach((question, index) => {
            const answer = userAnswers[index];
            const isCorrect = answer && answer.isCorrect;

            results += `### Q${index + 1}: ${question.question}\n\n`;
            results += `**Your answer:** ${answer ? question.options[answer.selected] : 'Not answered'} ${isCorrect ? '✅' : '❌'}\n\n`;
            results += `**Correct answer:** ${question.options[question.correct]}\n\n`;
            results += `**Explanation:** ${question.explanation}\n\n`;
            results += `---\n\n`;
        });

        return results;
    }

    // Make functions globally available for onclick handlers
    window.startQuiz = startQuiz;
    window.selectAnswer = selectAnswer;
    window.nextQuestion = nextQuestion;
    window.retakeQuiz = retakeQuiz;
    window.newTopic = newTopic;
    window.copyQuizResults = copyQuizResults;
    window.downloadQuizResults = downloadQuizResults;
});
