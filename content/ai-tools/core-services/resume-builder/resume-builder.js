// Resume Builder & Analyzer Script - Unified Version
document.addEventListener('DOMContentLoaded', function () {
    console.log('Resume builder & analyzer script loaded');

    // All utility functions now use centralized utils.js
    // readFileAsText -> utils.readFileAsText()
    // validateApiKey -> utils.validateApiKey()
    // showError -> utils.showError()
    // formatMarkdown -> utils.formatMarkdown()
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
    let currentMode = 'build'; // 'build' or 'critique'
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    // Register standardized copy/download actions
    utils.registerToolActions('resume-builder', () => currentResult);

    // Mode switching handlers
    const modeBuild = document.getElementById('modeBuild');
    const modeCritique = document.getElementById('modeCritique');
    const resumeForm = document.getElementById('resumeForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingText = document.getElementById('loadingText');
    const resultHeader = document.getElementById('resultHeader');

    function updateMode(mode) {
        currentMode = mode;
        console.log('Mode switched to:', mode);

        // Update form class for toggle group visibility
        resumeForm.classList.remove('mode-build', 'mode-critique');
        resumeForm.classList.add('mode-' + mode);

        // Update UI elements based on mode (CSS handles segmented control styling via :checked)
        if (mode === 'build') {
            submitBtn.textContent = 'Build Resume';
            loadingText.textContent = 'Building your professional resume...';
            resultHeader.textContent = '📄 Professional Resume';
            // Enable builder options, disable critique options
            document.querySelectorAll('.toggle-group-builder').forEach(el => el.classList.remove('toggle-group-disabled'));
            document.querySelectorAll('.toggle-group-critique').forEach(el => el.classList.add('toggle-group-disabled'));
        } else {
            submitBtn.textContent = 'Analyze Resume';
            loadingText.textContent = 'Analyzing your resume...';
            resultHeader.textContent = '📊 Resume Analysis';
            // Enable critique options, disable builder options
            document.querySelectorAll('.toggle-group-critique').forEach(el => el.classList.remove('toggle-group-disabled'));
            document.querySelectorAll('.toggle-group-builder').forEach(el => el.classList.add('toggle-group-disabled'));
        }
    }

    if (modeBuild) modeBuild.addEventListener('change', () => updateMode('build'));
    if (modeCritique) modeCritique.addEventListener('change', () => updateMode('critique'));

    // Input method handlers
    const inputFile = document.getElementById('inputFile');
    const inputText = document.getElementById('inputText');
    const fileInputGroup = document.getElementById('fileInputGroup');
    const textInputGroup = document.getElementById('textInputGroup');

    function updateInputMethod(method) {
        console.log('Input method switched to:', method);
        if (method === 'file') {
            fileInputGroup.style.display = 'block';
            textInputGroup.style.display = 'none';
        } else {
            fileInputGroup.style.display = 'none';
            textInputGroup.style.display = 'block';
        }
    }

    if (inputFile) inputFile.addEventListener('change', () => updateInputMethod('file'));
    if (inputText) inputText.addEventListener('change', () => updateInputMethod('text'));

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

    // Main process function - routes to build or analyze based on mode
    async function processResume() {
        console.log('=== PROCESS RESUME CALLED - Mode:', currentMode, '===');
        if (currentMode === 'build') {
            await generateResume();
        } else {
            await analyzeResume();
        }
    }

    // Get resume content from file or text input
    async function getResumeContent() {
        const inputMethod = document.querySelector('input[name="inputMethod"]:checked')?.value || 'file';
        
        if (inputMethod === 'text') {
            const resumeText = document.getElementById('resumeText')?.value?.trim();
            if (!resumeText) {
                throw new Error('Please enter your resume content');
            }
            return resumeText;
        } else {
            if (!uploadedFile) {
                throw new Error('Please upload a document');
            }
            return await utils.readFileAsText(uploadedFile);
        }
    }

    async function generateResume() {
        console.log('=== GENERATE RESUME FUNCTION CALLED ===');

        // Get form values
        const resumeStyle = document.getElementById('resumeStyle')?.value || 'modern';
        const targetRole = document.getElementById('targetRole')?.value?.trim() || '';
        const sectionOrder = document.getElementById('sectionOrder')?.value || 'standard';
        const experienceLevel = document.getElementById('experienceLevel')?.value || 'mid';
        
        // Get toggle options
        const includeKeywords = document.getElementById('includeKeywords')?.checked ?? true;
        const includeSummary = document.getElementById('includeSummary')?.checked ?? true;
        const actionVerbs = document.getElementById('actionVerbs')?.checked ?? false;
        const includeSkillsMatrix = document.getElementById('includeSkillsMatrix')?.checked ?? true;
        const includeCertifications = document.getElementById('includeCertifications')?.checked ?? false;
        const tailorToJob = document.getElementById('tailorToJob')?.checked ?? true;
        const fullRewrite = document.getElementById('fullRewrite')?.checked ?? false;
        const compactResume = document.getElementById('compactResume')?.checked ?? false;

        console.log('Form values:', { resumeStyle, targetRole, sectionOrder, experienceLevel });
        console.log('Toggle options:', { includeKeywords, includeSummary, actionVerbs, includeSkillsMatrix, includeCertifications, tailorToJob, fullRewrite, compactResume });

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

        // Show loading
        console.log('Showing loading state');
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Get resume content using shared helper
            console.log('Getting resume content...');
            const fileContent = await getResumeContent();
            console.log('Content retrieved successfully. Length:', fileContent.length);
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

            // Build optional instructions based on toggles
            const optionalInstructions = [];
            if (includeKeywords) {
                optionalInstructions.push('- Optimize for ATS with industry-relevant keywords throughout');
            }
            if (includeSummary) {
                optionalInstructions.push('- Include a compelling professional summary at the top');
            } else {
                optionalInstructions.push('- Skip the professional summary section');
            }
            if (actionVerbs) {
                optionalInstructions.push('- Start every bullet point with strong action verbs (Led, Achieved, Implemented, Spearheaded, Transformed, etc.)');
            }
            if (includeSkillsMatrix) {
                optionalInstructions.push('- Organize skills into categories (Technical Skills, Soft Skills, Tools & Technologies) with proficiency indicators where applicable');
            }
            if (includeCertifications) {
                optionalInstructions.push('- Include a dedicated Certifications & Licenses section highlighting relevant credentials');
            }
            if (tailorToJob && targetRole) {
                optionalInstructions.push(`- Specifically tailor all content to highlight relevance for ${targetRole} positions`);
            }
            if (fullRewrite) {
                optionalInstructions.push('- FULL OPTIMIZATION REWRITE: Critically evaluate ALL content. Keep only high-impact, valuable information. Remove or condense low-priority items, redundant phrases, outdated skills, irrelevant experience, and filler content. Prioritize achievements over responsibilities. Aim for maximum impact with minimum words.');
            }
            if (compactResume) {
                optionalInstructions.push('- COMPACT RESUME: Condense the resume to fit on 1-2 pages maximum. Limit bullet points to 3-4 per role. Focus on the most recent/relevant 10-15 years of experience. Combine similar roles or achievements where appropriate. Remove older or less relevant positions.');
            }

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
            - Professional language
            ${optionalInstructions.join('\n            ')}

            IMPORTANT: Return ONLY the formatted resume text, ready to copy and paste.
            Do NOT include any explanatory text, summaries, conclusions, or commentary after the resume.
            Do NOT add phrases like "This optimized resume..." or "Good luck with your job search."
            End your response immediately after the last resume section.`;

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
            const response = await makeApiRequest(messages, aiProvider, null, {
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
            document.getElementById('resultContent').innerHTML = htmlContent;

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

            const response = await makeApiRequest(messages, aiProvider, null, {
                maxTokens: 2000,
                temperature: 0.5
            });

            currentResult = response;
            const htmlContent = utils.formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = htmlContent;

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate variation. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('targetRole').value = '';
        document.getElementById('resumeText').value = '';
        document.getElementById('experienceLevel').value = 'mid';
        uploadedFile = null;
        document.getElementById('fileName').style.display = 'none';
        document.getElementById('fileName').textContent = '';
        fileInput.value = '';
        // Reset to file input method
        if (inputFile) inputFile.checked = true;
        updateInputMethod('file');
    }

    // Analyze Resume function (merged from resume-critique)
    async function analyzeResume() {
        console.log('=== ANALYZE RESUME FUNCTION CALLED ===');

        // Get form values
        const targetRole = document.getElementById('targetRole')?.value?.trim() || '';
        const experienceLevel = document.getElementById('experienceLevel')?.value || 'mid';
        
        // Get toggle options (shared)
        const includeKeywords = document.getElementById('includeKeywords')?.checked ?? true;
        const fullRewrite = document.getElementById('fullRewrite')?.checked ?? false;
        const compactResume = document.getElementById('compactResume')?.checked ?? false;
        
        // Get critique toggle options
        const includeStrengths = document.getElementById('includeStrengths')?.checked ?? true;
        const includeWeaknesses = document.getElementById('includeWeaknesses')?.checked ?? true;
        const includeRecommendations = document.getElementById('includeRecommendations')?.checked ?? true;
        const includeScoring = document.getElementById('includeScoring')?.checked ?? true;
        const includeRedFlags = document.getElementById('includeRedFlags')?.checked ?? true;
        const includeCompetitiveAnalysis = document.getElementById('includeCompetitiveAnalysis')?.checked ?? false;
        const includeActionItems = document.getElementById('includeActionItems')?.checked ?? true;
        const includeEnhanced = document.getElementById('includeEnhanced')?.checked ?? false;

        console.log('Form values:', { targetRole, experienceLevel });
        console.log('Toggle options:', { includeKeywords, includeStrengths, includeWeaknesses, includeRecommendations, includeScoring, includeRedFlags, includeCompetitiveAnalysis, includeActionItems, includeEnhanced, fullRewrite, compactResume });

        // Check if API manager is available
        if (!window.apiManager) {
            console.log('ERROR: API manager not available');
            utils.showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Using global API manager');
        const aiProvider = window.apiManager.getProvider();
        console.log('Provider:', aiProvider);

        // Show loading
        console.log('Showing loading state');
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Get resume content using shared helper
            console.log('Getting resume content...');
            const resumeContent = await getResumeContent();
            console.log('Content retrieved successfully. Length:', resumeContent.length);

            const targetJobInstruction = targetRole ?
                `The analysis should be tailored for a ${targetRole} position.` :
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
            
            if (includeStrengths) {
                analysisSections.push(`## Strengths
            - List 3-5 key strengths`);
            }
            
            if (includeWeaknesses) {
                analysisSections.push(`## Areas for Improvement
            - List 3-5 specific areas that need work`);
            }
            
            if (includeScoring) {
                analysisSections.push(`## Section-by-Section Analysis
            Analyze each section with a score (1-10):
            - **Professional Summary/Objective** - Score: X/10
            - **Work Experience** - Score: X/10
            - **Education** - Score: X/10
            - **Skills** - Score: X/10
            - **Additional Sections** - Score: X/10`);
            }
            
            if (includeKeywords) {
                analysisSections.push(`## ATS Optimization
            - Keyword optimization status
            - Formatting recommendations
            - Common ATS issues found
            - List 10-15 industry-specific keywords missing from the resume
            - Suggest where each keyword should be incorporated`);
            }
            
            if (includeRecommendations) {
                analysisSections.push(`## Specific Recommendations
            - 5-7 actionable improvement suggestions
            - Industry-specific advice if target job provided`);
            }
            
            if (includeRedFlags) {
                analysisSections.push(`## Red Flags
            - Any concerning elements that could hurt candidacy
            - Employment gaps or inconsistencies
            - Potential areas of concern for recruiters`);
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

            if (compactResume) {
                analysisSections.push(`## Compact Resume Version
            Create a condensed version of this resume:
            - Limit to 1-2 pages maximum
            - Cap bullet points at 3-4 per role
            - Focus on the most recent/relevant 10-15 years of experience
            - Combine similar roles or achievements where appropriate
            - Remove older or less relevant positions
            - Ready to copy and use immediately`);
            }

            const systemPrompt = `You are a professional resume critique expert with 15+ years of HR and recruiting experience. 
            ${targetJobInstruction} 
            ${levelInstructions[experienceLevel]}

            Provide a comprehensive resume analysis with:

            ${analysisSections.join('\n\n            ')}

            Be constructive, specific, and actionable. Use professional language while being encouraging.
            
            IMPORTANT: Do NOT include any concluding summary, motivational closing, or commentary after the final section.
            Do NOT add phrases like "This analysis shows..." or "Good luck with your job search."
            End your response immediately after the last requested section.`;

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

    // Make functions globally available for onclick handlers
    window.processResume = processResume;
    window.generateResume = generateResume;
    window.analyzeResume = analyzeResume;
    window.generateVariation = generateVariation;
    window.resetForm = resetForm;
});
