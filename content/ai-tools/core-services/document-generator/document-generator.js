document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let uploadedFile = null;
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // File upload handlers
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255, 107, 53, 0.1)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadedFile = files[0];
            document.getElementById('fileName').textContent = uploadedFile.name;
            document.getElementById('fileName').style.display = 'block';
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadedFile = e.target.files[0];
            document.getElementById('fileName').textContent = uploadedFile.name;
            document.getElementById('fileName').style.display = 'block';
        }
    });

    async function generateResume() {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const resumeStyle = document.getElementById('resumeStyle').value;
        const targetRole = document.getElementById('targetRole').value.trim();
        const sectionOrder = document.getElementById('sectionOrder').value;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic', gemini: 'Gemini', grok: 'Grok (X.AI)' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!uploadedFile) {
            utils.showError(document.getElementById('errorDiv'), 'Please upload a document');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Read file content
            const fileContent = await utils.readFileAsText(uploadedFile);

            const styleInstructions = {
                'modern': 'Use clean, contemporary formatting with clear sections and modern typography.',
                'traditional': 'Use classic resume formatting with conventional layouts and professional styling.',
                'minimalist': 'Use simple, clean formatting with minimal styling and maximum white space.'
            };

            const orderInstructions = {
                'standard': 'Order sections as: Summary, Experience, Education, Skills, then any additional sections.',
                'skills-first': 'Order sections as: Summary, Skills, Experience, Education, then any additional sections.',
                'education-first': 'Order sections as: Summary, Education, Experience, Skills, then any additional sections.'
            };

            const targetRoleInstruction = targetRole ?
                `Tailor the resume for a ${targetRole} position, emphasizing relevant skills and experiences.` :
                'Create a general professional resume highlighting all qualifications.';

            const systemPrompt = `You are a professional resume builder that creates ATS-optimized resumes. 
            ${styleInstructions[resumeStyle]} 
            ${orderInstructions[sectionOrder]} 
            ${targetRoleInstruction}

            Extract and organize the following information from the uploaded content:
            - Personal details (name, contact info)
            - Professional summary or objective
            - Work experience (roles, companies, dates, achievements)
            - Education (institutions, degrees, dates)
            - Skills (technical, soft skills, tools)
            - Certifications, projects, languages, awards

            Format as a clean, single-page resume with:
            - Clear section headers
            - Bullet points for achievements
            - ATS-friendly formatting (no tables, graphics, or complex layouts)
            - Professional language and action verbs
            - Quantified achievements where possible

            Return only the formatted resume text, ready to copy and paste.`;

            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Please create a professional resume from this content:\n\n${fileContent}`
                }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.3
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.6; color: #e0e0e0;">${htmlContent}</div>
                </div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating resume:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate resume. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult || !uploadedFile) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const resumeStyle = document.getElementById('resumeStyle').value;
        const targetRole = document.getElementById('targetRole').value.trim();
        const sectionOrder = document.getElementById('sectionOrder').value;

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const fileContent = await utils.readFileAsText(uploadedFile);

            const styleInstructions = {
                'modern': 'Use clean, contemporary formatting with clear sections and modern typography.',
                'traditional': 'Use classic resume formatting with conventional layouts and professional styling.',
                'minimalist': 'Use simple, clean formatting with minimal styling and maximum white space.'
            };

            const systemPrompt = `Create an alternative version of this resume with a different approach. ${styleInstructions[resumeStyle]} Use different wording, rearrange content, and emphasize different aspects while maintaining professional quality and ATS optimization.`;

            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Please create an alternative resume from this content:\n\n${fileContent}`
                }
            ];

            const response = await apiManager.makeRequest(messages, {
                provider: aiProvider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.5
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.6; color: #e0e0e0;">${htmlContent}</div>
                </div>
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

    function copyResult() {
        utils.copyToClipboard(currentResult).then(success => {
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

    function downloadResult(format) {
        const filename = `resume_${utils.getCurrentTimestamp()}`;
        downloadManager.setContent(currentResult, 'markdown');
        downloadManager.download(format, filename);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('targetRole').value = '';
        uploadedFile = null;
        document.getElementById('fileName').style.display = 'none';
        document.getElementById('fileName').textContent = '';
        fileInput.value = '';
    }

    // Make functions globally available for onclick handlers
    window.generateResume = generateResume;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});
