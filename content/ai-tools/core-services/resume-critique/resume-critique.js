// Resume Critique Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Resume critique script loaded');
    console.log('Checking for duplicate elements...');

    // Check for existing form elements
    const existingForms = document.querySelectorAll('form');
    console.log('Number of forms found:', existingForms.length);

    const existingButtons = document.querySelectorAll('button');
    console.log('Number of buttons found:', existingButtons.length);

    const aiInterfaceDiv = document.getElementById('ai-interface');
    console.log('ai-interface div found:', !!aiInterfaceDiv);

    // Prevent AIInterface from running by removing any ai-interface div
    if (aiInterfaceDiv) {
        console.log('Removing ai-interface div to prevent conflicts');
        aiInterfaceDiv.remove();
    }

    // All utility functions now use centralized utils.js`n    // readFileAsText -> utils.utils.readFileAsText()`n    // validateApiKey -> utils.validateApiKey()`n    // showError -> utils.utils.showError()`n    // formatMarkdown -> utils.utils.formatMarkdown()`n    // getCurrentTimestamp -> utils.utils.getCurrentTimestamp()`n    // copyToClipboard -> utils.copyToClipboard()`n`n    // Use centralized API manager for requests
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
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    // Register standardized copy/download actions
    utils.registerToolActions('resume-critique', () => currentResult);

    // Input method handlers
    document.querySelector('input[name="inputMethod"][value="text"]').addEventListener('change', function () {
        const textInputGroup = document.getElementById('textInputGroup');
        const fileInputGroup = document.getElementById('fileInputGroup');
        textInputGroup.style.display = 'block';
        fileInputGroup.style.display = 'none';
        document.getElementById('resumeText').required = true;
    });

    document.querySelector('input[name="inputMethod"][value="file"]').addEventListener('change', function () {
        const textInputGroup = document.getElementById('textInputGroup');
        const fileInputGroup = document.getElementById('fileInputGroup');
        textInputGroup.style.display = 'none';
        fileInputGroup.style.display = 'block';
        document.getElementById('resumeText').required = false;
    });

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

    async function analyzeResume() {
        console.log('=== ANALYZE RESUME FUNCTION CALLED ===');

        // Get form values
        const inputMethod = document.querySelector('input[name="inputMethod"]:checked').value;
        const targetJob = document.getElementById('targetJob').value.trim();
        const experienceLevel = document.getElementById('experienceLevel').value;
        
        // Get toggle options
        const includeAtsAnalysis = document.getElementById('includeAtsAnalysis')?.checked ?? true;
        const includeScoring = document.getElementById('includeScoring')?.checked ?? true;
        const includeEnhanced = document.getElementById('includeEnhanced')?.checked ?? false;
        const includeRedFlags = document.getElementById('includeRedFlags')?.checked ?? true;
        const includeKeywordSuggestions = document.getElementById('includeKeywordSuggestions')?.checked ?? true;
        const includeCompetitiveAnalysis = document.getElementById('includeCompetitiveAnalysis')?.checked ?? false;
        const includeActionItems = document.getElementById('includeActionItems')?.checked ?? true;
        const fullRewrite = document.getElementById('fullRewrite')?.checked ?? false;

        console.log('Form values:', { inputMethod, targetJob, experienceLevel });
        console.log('Toggle options:', { includeAtsAnalysis, includeScoring, includeEnhanced, includeRedFlags, includeKeywordSuggestions, includeCompetitiveAnalysis, includeActionItems, fullRewrite });

        // Get resume content
        let resumeContent = '';
        if (inputMethod === 'text') {
            resumeContent = document.getElementById('resumeText').value.trim();
            if (!resumeContent) {
                utils.showError(document.getElementById('errorDiv'), 'Please enter your resume content');
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
        } else {
            if (!uploadedFile) {
                utils.showError(document.getElementById('errorDiv'), 'Please upload a resume file');
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
            // Read file content
            console.log('Reading file content...');
            resumeContent = await utils.readFileAsText(uploadedFile);
            console.log('File content read successfully. Length:', resumeContent.length);
        }

        // Check if API manager is available
        if (!window.apiManager) {
            console.log('ERROR: API manager not available');
            utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Using global API manager');
        const aiProvider = window.apiManager.getProvider();
        const apiKey = window.apiManager.getApiKey && window.apiManager.getApiKey();
        console.log('Provider:', aiProvider);

        // API key validation is handled by apiManager
        // LMStudio and other local APIs don't require API keys

        // Show loading
        console.log('Showing loading state');
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const targetJobInstruction = targetJob ?
                `The analysis should be tailored for a ${targetJob} position.` :
                'Provide general professional resume feedback.';

            const levelInstructions = {
                'entry': 'Focus on potential, education, internships, and transferable skills. Be encouraging about growth opportunities.',
                'mid': 'Emphasize career progression, specific achievements, and leadership potential.',
                'senior': 'Highlight strategic impact, team leadership, mentorship, and industry expertise.',
                'executive': 'Focus on organizational impact, vision, board experience, and transformational leadership.'
            };

            // Build dynamic sections based on toggles
            const analysisSections = [];
            
            analysisSections.push(`## Overall Score (1-10)
            Rate the resume overall with justification.`);
            
            analysisSections.push(`## Strengths
            - List 3-5 key strengths`);
            
            analysisSections.push(`## Areas for Improvement
            - List 3-5 specific areas that need work`);
            
            if (includeScoring) {
                analysisSections.push(`## Section-by-Section Analysis
            Analyze each section with a score (1-10):
            - **Professional Summary/Objective** - Score: X/10
            - **Work Experience** - Score: X/10
            - **Education** - Score: X/10
            - **Skills** - Score: X/10
            - **Additional Sections** - Score: X/10`);
            } else {
                analysisSections.push(`## Section-by-Section Analysis
            Analyze each section:
            - **Professional Summary/Objective**
            - **Work Experience** 
            - **Education**
            - **Skills**
            - **Additional Sections**`);
            }
            
            if (includeAtsAnalysis) {
                analysisSections.push(`## ATS Optimization
            - Keyword optimization status
            - Formatting recommendations
            - Common ATS issues found`);
            }
            
            analysisSections.push(`## Specific Recommendations
            - 5-7 actionable improvement suggestions
            - Industry-specific advice if target job provided`);
            
            if (includeRedFlags) {
                analysisSections.push(`## Red Flags
            - Any concerning elements that could hurt candidacy
            - Employment gaps or inconsistencies
            - Potential areas of concern for recruiters`);
            }
            
            if (includeKeywordSuggestions) {
                analysisSections.push(`## Keyword Suggestions
            - List 10-15 industry-specific keywords missing from the resume
            - Suggest where each keyword should be incorporated
            - Prioritize keywords by importance for ATS`);
            }
            
            if (includeCompetitiveAnalysis) {
                analysisSections.push(`## Competitive Analysis
            - How does this resume compare to industry standards?
            - What do top candidates in this field typically include?
            - Gaps compared to competitive resumes`);
            }
            
            if (includeActionItems) {
                analysisSections.push(`## Priority Action Items
            List the TOP 5 most impactful changes to make immediately:
            1. [Highest priority change]
            2. [Second priority]
            3. [Third priority]
            4. [Fourth priority]
            5. [Fifth priority]`);
            }
            
            if (includeEnhanced) {
                analysisSections.push(`## Enhanced Resume Version
            Provide a complete rewritten version of the resume with all improvements applied. This should be ready to copy and use.`);
            }
            
            if (fullRewrite) {
                analysisSections.push(`## Full Optimization Rewrite
            Create a completely optimized version of this resume:
            - Keep ONLY high-impact, valuable information
            - Remove all low-priority items, redundant phrases, and filler content
            - Eliminate outdated skills and irrelevant experience
            - Prioritize achievements over responsibilities
            - Condense verbose descriptions into punchy, impactful statements
            - Maximum impact with minimum words
            - Ready to copy and use immediately`);
            }

            const systemPrompt = `You are a professional resume critique expert with 15+ years of HR and recruiting experience. 
            ${targetJobInstruction} 
            ${levelInstructions[experienceLevel]}

            Provide a comprehensive resume analysis with:

            ${analysisSections.join('\n\n            ')}

            Be constructive, specific, and actionable. Use professional language while being encouraging.`;

            console.log('System prompt created. Length:', systemPrompt.length);

            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Please provide a comprehensive critique of this resume:\n\n${resumeContent}`
                }
            ];

            console.log('Messages array created. Total messages:', messages.length);
            console.log('User message length:', messages[1].content.length);

            console.log('Making API request to provider:', aiProvider);
            const response = await makeApiRequest(messages, aiProvider, null, {
                maxTokens: 3000,
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
            document.getElementById('resultContent').innerHTML = htmlContent;

            // Show result
            console.log('Showing result div...');
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            console.log('Scrolling to result...');
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

            console.log('=== RESUME ANALYSIS COMPLETED SUCCESSFULLY ===');

        } catch (error) {
            console.error('=== ERROR IN RESUME ANALYSIS ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Full error object:', error);
            console.error('Stack trace:', error.stack);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to analyze resume. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateEnhanced() {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'Please analyze a resume first before generating an enhanced version.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('=== GENERATING ENHANCED VERSION ===');

        // Get current form values for context
        const inputMethod = document.querySelector('input[name="inputMethod"]:checked').value;
        const targetJob = document.getElementById('targetJob').value.trim();
        const experienceLevel = document.getElementById('experienceLevel').value;

        console.log('Form values for enhancement:', { inputMethod, targetJob, experienceLevel });

        // Get original resume content
        let resumeContent = '';
        if (inputMethod === 'text') {
            resumeContent = document.getElementById('resumeText').value.trim();
        } else if (uploadedFile) {
            try {
                resumeContent = await utils.readFileAsText(uploadedFile);
            } catch (error) {
                console.error('Error reading file for enhancement:', error);
                utils.showError(document.getElementById('errorDiv'), 'Could not read original resume file for enhancement.');
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
        }

        if (!resumeContent) {
            utils.showError(document.getElementById('errorDiv'), 'Original resume content not available for enhancement.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Check if API manager is available
        if (!window.apiManager) {
            console.log('ERROR: API manager not available for enhancement');
            utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const aiProvider = window.apiManager.getProvider();
        const apiKey = window.apiManager.getApiKey && window.apiManager.getApiKey();
        console.log('Using global API manager for enhancement');

        // API key validation is handled by apiManager
        // LMStudio and other local APIs don't require API keys

        // Show loading
        console.log('Showing loading state for enhancement');
        document.getElementById('loadingDiv').style.display = 'block';
        document.getElementById('errorDiv').style.display = 'none';

        try {
            const targetJobInstruction = targetJob ?
                `Optimize specifically for a ${targetJob} position with relevant keywords and skills.` :
                'Create a generally optimized professional resume.';

            const levelInstructions = {
                'entry': 'Focus on potential, education, transferable skills, and growth opportunities.',
                'mid': 'Emphasize career progression, quantified achievements, and leadership development.',
                'senior': 'Highlight strategic impact, team leadership, mentorship, and industry expertise.',
                'executive': 'Focus on organizational transformation, vision, and high-level business impact.'
            };

            const enhancementPrompt = `You are a professional resume writer. Based on the previous analysis, create an enhanced version of this resume.

            ${targetJobInstruction}
            ${levelInstructions[experienceLevel]}

            Improvements to make:
            - Strengthen bullet points with action verbs and quantified achievements
            - Optimize for ATS with relevant keywords for the target role
            - Improve formatting and structure for better readability
            - Enhance professional summary with compelling value proposition
            - Better highlight key accomplishments and impact
            - Ensure consistency in formatting and verb tenses
            - Add missing sections if needed (certifications, projects, etc.)
            - Remove any weak or redundant content

            Return ONLY the enhanced resume content, ready to copy and paste. Do not include analysis or commentary - just the improved resume.`;

            console.log('Enhancement prompt created');

            const messages = [
                {
                    role: 'system',
                    content: enhancementPrompt
                },
                {
                    role: 'user',
                    content: `Here is the original resume to enhance:\n\n${resumeContent}\n\nAnd here was the analysis that should guide the improvements:\n\n${currentResult}`
                }
            ];

            console.log('Making API request for enhancement...');
            const response = await makeApiRequest(messages, aiProvider, null, {
                maxTokens: 3000,
                temperature: 0.4
            });

            console.log('Enhancement API request successful!');

            // Update the result with enhanced version
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <h3>✨ Enhanced Resume Version</h3>
                ${htmlContent}
            `;

            currentResult = response; // Update current result to the enhanced version
            document.getElementById('loadingDiv').style.display = 'none';

            console.log('=== ENHANCED VERSION GENERATED SUCCESSFULLY ===');

        } catch (error) {
            console.error('=== ERROR GENERATING ENHANCED VERSION ===');
            console.error('Error:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate enhanced version. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('resumeText').value = '';
        document.getElementById('targetJob').value = '';
        document.getElementById('experienceLevel').value = 'mid';
        uploadedFile = null;
        document.getElementById('fileName').style.display = 'none';
        document.getElementById('fileName').textContent = '';
        fileInput.value = '';

        // Reset to text input method
        document.querySelector('input[name="inputMethod"][value="text"]').checked = true;
        document.getElementById('textInputGroup').style.display = 'block';
        document.getElementById('fileInputGroup').style.display = 'none';
        document.getElementById('resumeText').required = true;
    }

    // Make functions globally available for onclick handlers
    window.analyzeResume = analyzeResume;
    window.generateEnhanced = generateEnhanced;
    window.resetForm = resetForm;
});


