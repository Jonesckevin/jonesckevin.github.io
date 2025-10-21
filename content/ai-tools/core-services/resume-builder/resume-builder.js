// Resume Builder Script - Centralized Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Resume builder script loaded');

    // All utility functions now use centralized utils.js
    // readFileAsText -> utils.readFileAsText()
    // validateApiKey -> utils.validateApiKey()
    // showError -> utils.utils.showError()
    // formatMarkdown -> utils.utils.formatMarkdown()
    // getCurrentTimestamp -> utils.getCurrentTimestamp()
    // copyToClipboard -> utils.copyToClipboard()

    // Use centralized API manager for requests
    async function makeApiRequest(messages, provider, apiKey, options = {}) {
        console.log('=== MAKING API REQUEST VIA API MANAGER ===');
        console.log('Provider:', provider);
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        console.log('Options:', options);
        console.log('Messages count:', messages.length);

        try {
            // Use the centralized API manager
            return await apiManager.makeRequest(messages, {
                provider: provider,
                apiKey: apiKey,
                maxTokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.7,
                ...options
            });
        } catch (error) {
            console.error('API Manager request failed:', error);
            throw error;
        }
    }

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
        console.log('=== GENERATE RESUME FUNCTION CALLED ===');

        // Get form values
        const resumeStyle = document.getElementById('resumeStyle').value;
        const targetRole = document.getElementById('targetRole').value.trim();
        const sectionOrder = document.getElementById('sectionOrder').value;

        console.log('Form values:', { resumeStyle, targetRole, sectionOrder });

        if (!uploadedFile) {
            console.log('ERROR: No file uploaded');
            utils.showError(document.getElementById('errorDiv'), 'Please upload a document');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }
        console.log('File uploaded:', uploadedFile.name, 'Size:', uploadedFile.size, 'Type:', uploadedFile.type);

        // Check if API is configured using global apiManager
        if (!window.apiManager) {
            console.log('ERROR: API manager not available');
            utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Using global API manager');
        const aiProvider = window.apiManager.getProvider();
        console.log('Provider:', aiProvider);

        // API key validation is handled by apiManager
        // LMStudio and other local APIs don't require API keys

        // Show loading
        console.log('Showing loading state');
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Read file content using centralized utils
            console.log('Starting file read...');
            const fileContent = await utils.readFileAsText(uploadedFile);
            console.log('File content read successfully. Length:', fileContent.length);
            console.log('First 200 chars:', fileContent.substring(0, 200));

            console.log('Building prompt instructions...');
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

            console.log('Prompt instructions ready');

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

            console.log('System prompt created. Length:', systemPrompt.length);

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

            console.log('Messages array created. Total messages:', messages.length);
            console.log('User message length:', messages[1].content.length);

            console.log('Making API request to provider:', aiProvider);
            const response = await makeApiRequest(messages, aiProvider, apiKey, {
                maxTokens: 2000,
                temperature: 0.3
            });

            console.log('API request successful! Response length:', response.length);
            console.log('Response preview:', response.substring(0, 200));

            currentResult = response;
            console.log('Response stored in currentResult');

            // Convert to HTML and display
            console.log('Converting markdown to HTML...');
            const htmlContent = utils.formatMarkdown(response);
            console.log('HTML conversion complete. HTML length:', htmlContent.length);

            console.log('Updating DOM with result...');
            document.getElementById('resultContent').innerHTML = `
                <div class="result-display">${htmlContent}</div>
            `;

            // Show result
            console.log('Showing result div...');
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            console.log('Scrolling to result...');
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

            console.log('=== RESUME GENERATION COMPLETED SUCCESSFULLY ===');

        } catch (error) {
            console.error('=== ERROR IN RESUME GENERATION ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Full error object:', error);
            console.error('Stack trace:', error.stack);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate resume. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult || !uploadedFile) return;

        // Check if API manager is available
        if (!window.apiManager) {
            utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const aiProvider = window.apiManager.getProvider();
        // API key validation is handled by apiManager

        const resumeStyle = document.getElementById('resumeStyle').value;
        const targetRole = document.getElementById('targetRole').value.trim();
        const sectionOrder = document.getElementById('sectionOrder').value;

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const fileContent = await readFileAsText(uploadedFile);

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

            const response = await makeApiRequest(messages, aiProvider, apiKey, {
                maxTokens: 2000,
                temperature: 0.5
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

    async function copyResult(event) {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to copy');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const success = await utils.copyToClipboard(currentResult);

        if (success && event?.target) {
            const btn = event.target;
            const originalText = btn.innerHTML;
            const originalBg = btn.style.background;

            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg || '';
            }, 2000);
        } else if (!success) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Failed to copy to clipboard. Please try selecting and copying manually.'
            );
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function downloadResult(format) {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to download');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

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
