// Resume Builder Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Resume builder script loaded');

    // Local utility functions
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    function validateApiKey(apiKey, provider) {
        if (!apiKey || apiKey.trim() === '') return false;

        // Basic validation patterns
        switch (provider) {
            case 'openai':
                return apiKey.startsWith('sk-') && apiKey.length > 20;
            case 'anthropic':
                return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
            case 'deepseek':
                return apiKey.startsWith('sk-') && apiKey.length > 20;
            default:
                return apiKey.length > 10;
        }
    }

    function showError(element, message) {
        element.innerHTML = `<div style="color: #ff6666; padding: 10px; background: rgba(255,68,68,0.1); border-radius: 4px; border: 1px solid #ff4444;">${message}</div>`;
    }

    function formatMarkdown(text) {
        // Enhanced markdown formatting with headers
        return text
            // Headers (must come before other formatting)
            .replace(/^### (.*?)$/gm, '<h3 style="color: #ff6b35; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em;">$1</h3>')
            .replace(/^## (.*?)$/gm, '<h2 style="color: #ff6b35; margin-top: 30px; margin-bottom: 20px; font-size: 1.5em;">$1</h2>')
            .replace(/^# (.*?)$/gm, '<h1 style="color: #ff6b35; margin-top: 35px; margin-bottom: 25px; font-size: 1.8em;">$1</h1>')
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code
            .replace(/`(.*?)`/g, '<code style="background: rgba(255,107,53,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
            // Lists
            .replace(/^- (.*?)$/gm, '<li style="margin-bottom: 5px;">$1</li>')
            // Line breaks
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    function getCurrentTimestamp() {
        return new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

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
            showError(document.getElementById('errorDiv'), 'Please upload a document');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }
        console.log('File uploaded:', uploadedFile.name, 'Size:', uploadedFile.size, 'Type:', uploadedFile.type);

        // Check if API is configured using global apiManager if available
        let apiKey, aiProvider;
        if (window.apiManager) {
            console.log('Using global API manager');
            apiKey = window.apiManager.getApiKey();
            aiProvider = window.apiManager.getProvider();
            console.log('Global API manager - API Key present:', !!apiKey, 'Provider:', aiProvider);
        } else {
            console.log('Global API manager not available, using fallback');
            // Fallback: check for stored credentials
            apiKey = sessionStorage.getItem('ai_api_key') || localStorage.getItem('ai_api_key');
            aiProvider = sessionStorage.getItem('ai_provider') || localStorage.getItem('ai_provider') || 'openai';
            console.log('Fallback API - API Key present:', !!apiKey, 'Provider:', aiProvider);
        }

        if (!apiKey) {
            console.log('ERROR: No API key found');
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('API Key validation passed');

        // Show loading
        console.log('Showing loading state');
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Read file content
            console.log('Starting file read...');
            const fileContent = await readFileAsText(uploadedFile);
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
            const htmlContent = formatMarkdown(response);
            console.log('HTML conversion complete. HTML length:', htmlContent.length);

            console.log('Updating DOM with result...');
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.6; color: #e0e0e0;">${htmlContent}</div>
                </div>
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
            showError(document.getElementById('errorDiv'), error.message || 'Failed to generate resume. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult || !uploadedFile) return;

        // Get API credentials
        let apiKey, aiProvider;
        if (window.apiManager) {
            apiKey = window.apiManager.getApiKey();
            aiProvider = window.apiManager.getProvider();
        } else {
            // Fallback: check for stored credentials
            apiKey = sessionStorage.getItem('ai_api_key') || localStorage.getItem('ai_api_key');
            aiProvider = sessionStorage.getItem('ai_provider') || localStorage.getItem('ai_provider') || 'openai';
        }

        if (!apiKey) {
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

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
            const htmlContent = formatMarkdown(response);
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
            showError(document.getElementById('errorDiv'), error.message || 'Failed to generate variation. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult() {
        copyToClipboard(currentResult).then(success => {
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
        const filename = `resume_${getCurrentTimestamp()}`;
        if (window.downloadManager) {
            window.downloadManager.setContent(currentResult, 'markdown');
            window.downloadManager.download(format, filename);
        } else {
            // Simple fallback download
            const blob = new Blob([currentResult], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
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
