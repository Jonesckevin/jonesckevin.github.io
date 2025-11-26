/**
 * NIST NICE Framework Position Mapper
 * Generates job descriptions based on NIST NICE Framework and SOC strategies
 */

(function() {
    'use strict';

    // State management
    let nistData = null;
    let socStrategies = null;
    
    // DOM elements
    const elements = {
        form: document.getElementById('nistForm'),
        jobTitle: document.getElementById('jobTitle'),
        jobTier: document.getElementById('jobTier'),
        workRole: document.getElementById('workRole'),
        skillsCount: document.getElementById('skillsCount'),
        knowledgeCount: document.getElementById('knowledgeCount'),
        tasksCount: document.getElementById('tasksCount'),
        skillsValue: document.getElementById('skillsValue'),
        knowledgeValue: document.getElementById('knowledgeValue'),
        tasksValue: document.getElementById('tasksValue'),
        outputFormat: document.getElementById('outputFormat'),
        formatLabel: document.getElementById('formatLabel'),
        includeSOC: document.getElementById('includeSOC'),
        useAI: document.getElementById('useAI'),
        generateBtn: document.getElementById('generateBtn'),
        resetBtn: document.getElementById('resetBtn'),
        loadingDiv: document.getElementById('loadingDiv'),
        errorDiv: document.getElementById('errorDiv'),
        resultDiv: document.getElementById('resultDiv'),
        resultContent: document.getElementById('resultContent'),
        copyBtn: document.getElementById('copyBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        regenerateBtn: document.getElementById('regenerateBtn')
    };

    // SOC Strategies content
    const SOC_STRATEGIES = {
        1: {
            title: "Know What You Are Protecting and Why",
            description: "Maintain comprehensive asset inventory and understand criticality to organizational mission."
        },
        2: {
            title: "Give the SOC the Authority to Do Its Job",
            description: "Empower the SOC with decision-making authority and organizational support."
        },
        3: {
            title: "Build a SOC Structure to Match Your Organizational Needs",
            description: "Design operations that align with organizational size, risk tolerance, and resources."
        },
        4: {
            title: "Hire AND Grow Quality Staff",
            description: "Invest in talent acquisition, retention, and continuous professional development."
        },
        5: {
            title: "Prioritize Incident Response",
            description: "Implement effective triage, handling procedures, and recovery processes."
        },
        6: {
            title: "Illuminate Adversaries with Cyber Threat Intelligence",
            description: "Leverage threat intelligence for proactive, intelligence-driven defense."
        },
        7: {
            title: "Select and Collect the Right Data",
            description: "Focus on strategic data collection that supports detection and analysis."
        },
        8: {
            title: "Leverage Tools to Support Analyst Workflow",
            description: "Deploy technology that enhances, not hinders, analyst effectiveness."
        },
        9: {
            title: "Communicate Clearly, Collaborate Often, Share Generously",
            description: "Foster information sharing within and beyond the organization."
        },
        10: {
            title: "Measure Performance to Improve Performance",
            description: "Implement meaningful metrics for continuous improvement."
        },
        11: {
            title: "Turn up the Volume by Expanding SOC Functionality",
            description: "Mature operations by expanding capabilities and reach."
        }
    };

    // Job title to work role mappings
    const JOB_TITLE_MAPPINGS = {
        'soc analyst': ['PR-CDA-001', 'AN-TWA-001'],
        'security analyst': ['PR-CDA-001', 'OG-WRL-012'],
        'incident responder': ['PR-CIR-001'],
        'incident response': ['PR-CIR-001'],
        'threat analyst': ['AN-TWA-001'],
        'threat hunter': ['AN-TWA-001', 'AN-EXP-001'],
        'cybersecurity architect': ['DD-WRL-001'],
        'security architect': ['DD-WRL-001'],
        'penetration tester': ['DD-WRL-005', 'AN-EXP-001'],
        'vulnerability analyst': ['DD-WRL-005'],
        'security engineer': ['DD-WRL-004', 'PR-INF-001'],
        'network security': ['PR-INF-001'],
        'ciso': ['OG-WRL-007'],
        'security manager': ['OG-WRL-014'],
        'compliance': ['OG-WRL-008', 'OG-WRL-012'],
        'policy': ['OG-WRL-002'],
        'forensic': ['AN-FOR-001'],
        'malware': ['AN-EXP-001'],
        'developer': ['DD-WRL-003'],
        'software': ['DD-WRL-003', 'DD-WRL-005']
    };

    // General tasks by work role category
    const GENERAL_TASKS = {
        'PR-CDA-001': [ // Cyber Defense Analyst
            'Monitor security alerts and events from SIEM and security tools',
            'Investigate suspicious activities and security incidents',
            'Clear false positive alerts and tune detection rules',
            'Create incident reports and security briefings',
            'Perform threat intelligence analysis',
            'Document security events and maintain case files',
            'Coordinate with IT teams on remediation activities'
        ],
        'PR-CIR-001': [ // Cyber Defense Incident Responder
            'Respond to and contain security incidents',
            'Perform forensic analysis on compromised systems',
            'Recover data from affected systems',
            'Create incident response reports',
            'Execute containment and eradication procedures',
            'Coordinate incident response activities across teams',
            'Document lessons learned and improve IR procedures'
        ],
        'PR-INF-001': [ // Cyber Defense Infrastructure Support Specialist
            'Maintain security infrastructure and tools',
            'Investigate infrastructure issues and anomalies',
            'Create system configuration documentation',
            'Perform security tool upgrades and patching',
            'Monitor infrastructure health and performance',
            'Recover systems from outages or failures',
            'Coordinate with vendors on technical issues'
        ],
        'AN-TWA-001': [ // Threat/Warning Analyst
            'Create threat intelligence reports',
            'Investigate emerging threats and vulnerabilities',
            'Monitor threat actor activities and campaigns',
            'Analyze indicators of compromise (IOCs)',
            'Brief stakeholders on threat landscape',
            'Update threat detection signatures and rules',
            'Coordinate with external threat intelligence sources'
        ],
        'AN-EXP-001': [ // Exploitation Analyst
            'Investigate vulnerabilities and exploits',
            'Perform exploit analysis and reverse engineering',
            'Create vulnerability assessment reports',
            'Test security controls against known exploits',
            'Document exploit techniques and mitigation strategies',
            'Coordinate with development teams on security fixes',
            'Maintain exploit intelligence database'
        ],
        'DD-WRL-001': [ // Cybersecurity Architecture
            'Create security architecture designs and documentation',
            'Investigate security design flaws and weaknesses',
            'Review and approve security architecture proposals',
            'Coordinate security requirements across projects',
            'Perform security architecture assessments',
            'Update security architecture standards',
            'Brief leadership on architecture decisions'
        ],
        'DD-WRL-003': [ // Secure Software Development
            'Create secure code and implement security controls',
            'Investigate code vulnerabilities and security bugs',
            'Perform security code reviews',
            'Coordinate with QA on security testing',
            'Document secure coding practices',
            'Update security libraries and frameworks',
            'Clear security findings from scanning tools'
        ],
        'DD-WRL-004': [ // Secure Systems Development
            'Create secure system configurations',
            'Investigate system vulnerabilities',
            'Perform security hardening and configuration',
            'Coordinate security testing activities',
            'Document system security controls',
            'Clear security findings from assessments',
            'Update security baselines and standards'
        ],
        'DD-WRL-005': [ // Software Security Assessment
            'Perform penetration testing and vulnerability assessments',
            'Investigate security weaknesses in applications',
            'Create security assessment reports',
            'Coordinate remediation with development teams',
            'Document testing methodologies and findings',
            'Clear verified vulnerabilities from tracking system',
            'Update testing tools and techniques'
        ],
        'OG-WRL-002': [ // Cybersecurity Policy and Planning
            'Create security policies and procedures',
            'Investigate policy violations and compliance issues',
            'Review and update governance documentation',
            'Coordinate policy reviews with stakeholders',
            'Perform compliance assessments',
            'Brief leadership on policy matters',
            'Document security program metrics'
        ],
        'OG-WRL-007': [ // Executive Cybersecurity Leadership
            'Create strategic security plans and roadmaps',
            'Investigate major security incidents and breaches',
            'Review security program performance',
            'Coordinate with executive leadership on security matters',
            'Brief board and executives on security posture',
            'Allocate security budget and resources',
            'Document security program strategy'
        ],
        'OG-WRL-012': [ // Security Control Assessment
            'Perform security control assessments',
            'Investigate control deficiencies and gaps',
            'Create assessment reports and POA&Ms',
            'Coordinate remediation activities',
            'Review compliance documentation',
            'Clear assessment findings upon remediation',
            'Update assessment procedures and criteria'
        ],
        'OG-WRL-014': [ // Systems Security Management
            'Manage security operations and team activities',
            'Investigate security program issues',
            'Create security metrics and reports',
            'Coordinate security initiatives across teams',
            'Review security tool effectiveness',
            'Brief management on security operations',
            'Document security procedures and playbooks'
        ],
        'default': [ // Generic security tasks
            'Monitor security systems and alerts',
            'Investigate security events and anomalies',
            'Create security reports and documentation',
            'Clear false positives and tune detection rules',
            'Coordinate with team members on security activities',
            'Perform security assessments and reviews',
            'Update security procedures and documentation'
        ]
    };

    // Get general tasks for work role
    function getGeneralTasks(workRoles) {
        let tasks = [];
        
        if (workRoles && workRoles.length > 0) {
            workRoles.forEach(roleId => {
                if (GENERAL_TASKS[roleId]) {
                    tasks = tasks.concat(GENERAL_TASKS[roleId]);
                }
            });
        }
        
        // If no specific tasks found, use default
        if (tasks.length === 0) {
            tasks = GENERAL_TASKS['default'];
        }
        
        // Remove duplicates
        return [...new Set(tasks)];
    }

    // Initialize
    function init() {
        // Initialize API Manager if not already available
        if (!window.apiManager) {
            window.apiManager = new APIManager();
        }
        
        setupEventListeners();
        loadNISTData();
        updateSliderValues();
    }

    // Setup event listeners
    function setupEventListeners() {
        elements.form.addEventListener('submit', handleFormSubmit);
        elements.resetBtn.addEventListener('click', handleReset);
        elements.copyBtn.addEventListener('click', handleCopy);
        elements.downloadBtn.addEventListener('click', handleDownload);
        elements.regenerateBtn.addEventListener('click', handleRegenerate);
        
        // Format toggle
        elements.outputFormat.addEventListener('change', updateFormatLabel);
        
        // Slider updates
        elements.skillsCount.addEventListener('input', updateSliderValues);
        elements.knowledgeCount.addEventListener('input', updateSliderValues);
        elements.tasksCount.addEventListener('input', updateSliderValues);
    }

    // Update format label
    function updateFormatLabel() {
        elements.formatLabel.textContent = elements.outputFormat.checked ? 'Job Advertisement' : 'Role Definition';
    }

    // Update slider display values
    function updateSliderValues() {
        elements.skillsValue.textContent = elements.skillsCount.value;
        elements.knowledgeValue.textContent = elements.knowledgeCount.value;
        elements.tasksValue.textContent = elements.tasksCount.value;
        
        // Update slider background gradient
        updateSliderBackground(elements.skillsCount);
        updateSliderBackground(elements.knowledgeCount);
        updateSliderBackground(elements.tasksCount);
    }

    function updateSliderBackground(slider) {
        const value = (slider.value / slider.max) * 100;
        slider.style.background = `linear-gradient(to right, #0066cc 0%, #0066cc ${value}%, #e9ecef ${value}%, #e9ecef 100%)`;
    }

    // Load NIST data
    async function loadNISTData() {
        try {
            const response = await fetch('nist-nice-component-framework_2025.json');
            if (!response.ok) {
                throw new Error('Failed to load NIST data');
            }
            nistData = await response.json();
            console.log('NIST data loaded successfully');
        } catch (error) {
            console.error('Error loading NIST data:', error);
            showError('Failed to load NIST NICE Framework data. Please refresh the page.');
        }
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        showLoading();
        hideError();
        hideResult();

        try {
            const jobDescription = await generateJobDescription();
            displayResult(jobDescription);
        } catch (error) {
            console.error('Error generating job description:', error);
            showError('Failed to generate job description. Please try again.');
        } finally {
            hideLoading();
        }
    }

    // Validate form
    function validateForm() {
        if (!elements.jobTitle.value.trim()) {
            showError('Please enter a job title.');
            return false;
        }

        if (!nistData) {
            showError('NIST data is still loading. Please wait a moment and try again.');
            return false;
        }

        // Check for API key if AI enhancement is enabled
        if (elements.useAI.checked && !window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️) to use AI enhancement.');
            return false;
        }

        return true;
    }

    // Generate job description
    async function generateJobDescription() {
        const jobTitle = elements.jobTitle.value.trim();
        const jobTier = elements.jobTier.value;
        const workRole = elements.workRole.value;
        const skillsCount = parseInt(elements.skillsCount.value);
        const knowledgeCount = parseInt(elements.knowledgeCount.value);
        const tasksCount = parseInt(elements.tasksCount.value);
        const isJobAd = elements.outputFormat.checked;
        const includeSOC = elements.includeSOC.checked;
        const useAI = elements.useAI.checked;

        // Determine work roles
        let relevantWorkRoles = [];
        if (workRole) {
            relevantWorkRoles = [workRole];
        } else {
            relevantWorkRoles = detectWorkRoles(jobTitle);
        }

        // Extract components from NIST data
        const components = extractNISTComponents(relevantWorkRoles, skillsCount, knowledgeCount, tasksCount);
        
        // Build job description
        let markdown = buildJobDescriptionMarkdown(jobTitle, jobTier, components, includeSOC, relevantWorkRoles, isJobAd);
        
        // If AI enhancement is enabled, refine the description
        if (useAI) {
            markdown = await enhanceWithAI(markdown, jobTitle, jobTier, components, includeSOC, isJobAd);
        }
        
        return markdown;
    }

    // Detect work roles from job title
    function detectWorkRoles(jobTitle) {
        const titleLower = jobTitle.toLowerCase();
        let detectedRoles = [];

        for (const [keyword, roles] of Object.entries(JOB_TITLE_MAPPINGS)) {
            if (titleLower.includes(keyword)) {
                detectedRoles.push(...roles);
            }
        }

        // Default to cyber defense analyst if no match
        if (detectedRoles.length === 0) {
            detectedRoles = ['PR-CDA-001'];
        }

        // Remove duplicates
        return [...new Set(detectedRoles)];
    }

    // Extract NIST components based on work roles
    function extractNISTComponents(workRoles, skillsCount, knowledgeCount, tasksCount) {
        if (!nistData || !nistData.elements) {
            return { skills: [], knowledge: [], tasks: [], workRoleInfo: [] };
        }

        // Get work role information
        const workRoleInfo = nistData.elements.filter(el => 
            el.element_type === 'work_role' && workRoles.includes(el.element_identifier)
        );

        // Get related components through relationships
        const relatedIds = getRelatedComponentIds(workRoles);

        // Extract skills
        let skills = nistData.elements.filter(el => 
            el.element_type === 'skill' && 
            el.element_identifier && 
            el.text &&
            (relatedIds.skills.includes(el.element_identifier) || relatedIds.skills.length === 0)
        );
        skills = shuffleArray(skills).slice(0, skillsCount);

        // Extract knowledge
        let knowledge = nistData.elements.filter(el => 
            el.element_type === 'knowledge' && 
            el.element_identifier && 
            el.text &&
            (relatedIds.knowledge.includes(el.element_identifier) || relatedIds.knowledge.length === 0)
        );
        knowledge = shuffleArray(knowledge).slice(0, knowledgeCount);

        // Extract tasks
        let tasks = nistData.elements.filter(el => 
            el.element_type === 'task' && 
            el.element_identifier && 
            el.text &&
            (relatedIds.tasks.includes(el.element_identifier) || relatedIds.tasks.length === 0)
        );
        tasks = shuffleArray(tasks).slice(0, tasksCount);

        return { skills, knowledge, tasks, workRoleInfo };
    }

    // Get related component IDs from relationships
    function getRelatedComponentIds(workRoles) {
        const relatedIds = {
            skills: [],
            knowledge: [],
            tasks: []
        };

        if (!nistData.relationships) {
            return relatedIds;
        }

        // Find relationships where work role is the source
        const relevantRelationships = nistData.relationships.filter(rel => 
            workRoles.includes(rel.source_element_identifier)
        );

        relevantRelationships.forEach(rel => {
            const targetId = rel.target_element_identifier;
            
            if (targetId.startsWith('S-')) {
                relatedIds.skills.push(targetId);
            } else if (targetId.startsWith('K-')) {
                relatedIds.knowledge.push(targetId);
            } else if (targetId.startsWith('T-')) {
                relatedIds.tasks.push(targetId);
            }
        });

        return relatedIds;
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Build job description markdown
    function buildJobDescriptionMarkdown(jobTitle, jobTier, components, includeSOC, workRoles, isJobAd) {
        let md = `# ${jobTitle}`;
        if (jobTier) {
            md += ` (${jobTier} Level)`;
        }
        md += `\n\n`;
        
        // Work role information
        if (components.workRoleInfo && components.workRoleInfo.length > 0) {
            md += `## NIST NICE Framework Work Role\n\n`;
            components.workRoleInfo.forEach(role => {
                md += `**${role.element_identifier}**: ${role.title}\n\n`;
                md += `${role.text}\n\n`;
            });
        }

        // Overview section - different for each format
        if (isJobAd) {
            md += `## Position Overview\n\n`;
            md += `We are seeking a qualified ${jobTitle} to join our cybersecurity team. `;
            md += `This position aligns with the NIST NICE Workforce Framework for Cybersecurity (SP 800-181 Rev 1) `;
            md += `and incorporates industry best practices.`;
            if (jobTier) {
                md += ` This is a ${jobTier.toLowerCase()}-level position.`;
            }
            md += `\n\n`;
            
            // Add general tasks for job ad
            const generalTasks = getGeneralTasks(workRoles);
            if (generalTasks.length > 0) {
                md += `### Typical Daily Activities\n\n`;
                generalTasks.forEach(task => {
                    md += `- ${task}\n`;
                });
                md += `\n`;
            }
        } else {
            md += `## Role Definition\n\n`;
            md += `The ${jobTitle} position is defined according to the NIST NICE Workforce Framework for Cybersecurity (SP 800-181 Rev 1). `;
            if (jobTier) {
                md += `This is a ${jobTier.toLowerCase()}-level role. `;
            }
            md += `The following components outline the core competencies, knowledge areas, and responsibilities associated with this position.`;
            md += `\n\n`;
            
            // Add general tasks for role definition
            const generalTasks = getGeneralTasks(workRoles);
            if (generalTasks.length > 0) {
                md += `### Core Activities\n\n`;
                generalTasks.forEach(task => {
                    md += `- ${task}\n`;
                });
                md += `\n`;
            }
        }

        // Skills section
        if (components.skills.length > 0) {
            md += isJobAd ? `## Required Skills\n\n` : `## Skills\n\n`;
            components.skills.forEach((skill, index) => {
                md += `${index + 1}. **${skill.element_identifier}**: ${skill.text}\n`;
            });
            md += `\n`;
        }

        // Knowledge section
        if (components.knowledge.length > 0) {
            md += isJobAd ? `## Required Knowledge\n\n` : `## Knowledge\n\n`;
            components.knowledge.forEach((k, index) => {
                md += `${index + 1}. **${k.element_identifier}**: ${k.text}\n`;
            });
            md += `\n`;
        }

        // Tasks section
        if (components.tasks.length > 0) {
            md += isJobAd ? `## Key Responsibilities\n\n` : `## Tasks\n\n`;
            components.tasks.forEach((task, index) => {
                md += `${index + 1}. **${task.element_identifier}**: ${task.text}\n`;
            });
            md += `\n`;
        }

        // Include SOC Strategies if requested
        if (includeSOC) {
            md += buildSOCStrategiesSection(jobTitle, isJobAd);
        }

        // Add qualifications section only for job advertisements
        if (isJobAd) {
            md += buildQualificationsSection(jobTier, isJobAd);
        }

        return md;
    }

    // Build SOC Strategies section
    function buildSOCStrategiesSection(jobTitle, isJobAd) {
        let md = `## Alignment with World-Class SOC Strategies\n\n`;
        if (isJobAd) {
            md += `The successful candidate will support the following strategies from MITRE's 11 Strategies of a World-Class SOC:\n\n`;
        } else {
            md += `The ${jobTitle} position aligns with the following strategies from MITRE's 11 Strategies of a World-Class SOC:\n\n`;
        }

        // Select relevant strategies based on job type
        const relevantStrategies = selectRelevantSOCStrategies(jobTitle);
        
        relevantStrategies.forEach(stratNum => {
            const strategy = SOC_STRATEGIES[stratNum];
            md += `### Strategy ${stratNum}: ${strategy.title}\n\n`;
            md += `${strategy.description}\n\n`;
        });

        return md;
    }

    // Select relevant SOC strategies
    function selectRelevantSOCStrategies(jobTitle) {
        const titleLower = jobTitle.toLowerCase();
        
        // All roles get these core strategies
        let strategies = [4, 9]; // Hiring/Growing Staff, Communication
        
        // Leadership roles
        if (titleLower.includes('lead') || titleLower.includes('manager') || 
            titleLower.includes('director') || titleLower.includes('ciso')) {
            strategies.push(2, 3, 10, 11); // Authority, Structure, Metrics, Expansion
        }
        
        // Analyst roles
        if (titleLower.includes('analyst') || titleLower.includes('soc')) {
            strategies.push(5, 6, 7, 8); // Incident Response, CTI, Data, Tools
        }
        
        // Architecture/planning roles
        if (titleLower.includes('architect') || titleLower.includes('engineer') || 
            titleLower.includes('policy')) {
            strategies.push(1, 3, 7); // Asset Protection, Structure, Data
        }
        
        // Threat intelligence roles
        if (titleLower.includes('threat') || titleLower.includes('intelligence')) {
            strategies.push(6, 7); // CTI, Data
        }

        // Remove duplicates and sort
        return [...new Set(strategies)].sort((a, b) => a - b);
    }

    // Build qualifications section
    function buildQualificationsSection(jobTier, isJobAd) {
        let md = isJobAd ? `## Qualifications\n\n` : `## Expected Qualifications\n\n`;
        
        // Tier-specific qualifications
        const tierQualifications = getTierQualifications(jobTier);
        
        md += `### Education\n`;
        md += tierQualifications.education;
        
        md += `### Experience\n`;
        md += tierQualifications.experience;
        
        md += `### Certifications (Preferred)\n`;
        md += tierQualifications.certifications;

        return md;
    }

    // Get tier-specific qualifications
    function getTierQualifications(tier) {
        const qualifications = {
            'Entry': {
                education: `- Bachelor's degree in Computer Science, Cybersecurity, Information Technology, or related field\n- Recent graduates or those early in their cybersecurity career\n\n`,
                experience: `- 0-2 years of relevant cybersecurity experience\n- Internship or academic project experience valued\n- Eagerness to learn and grow in cybersecurity\n\n`,
                certifications: `- Security+ (CompTIA) - highly recommended\n- Network+ or A+ (CompTIA)\n- Entry-level cybersecurity certifications\n\n`
            },
            'Mid': {
                education: `- Bachelor's degree in Computer Science, Cybersecurity, Information Technology, or related field required\n- Advanced degree preferred\n\n`,
                experience: `- 3-5 years of relevant cybersecurity experience\n- Demonstrated experience with security tools and technologies\n- Experience in relevant cybersecurity domains\n\n`,
                certifications: `- Security+ (CompTIA)\n- CEH (Certified Ethical Hacker) or similar\n- CISSP (Certified Information Systems Security Professional)\n- GIAC certifications relevant to role\n\n`
            },
            'Senior': {
                education: `- Bachelor's degree required; Master's degree in Cybersecurity or related field strongly preferred\n- Advanced technical or professional certifications\n\n`,
                experience: `- 5-8 years of relevant cybersecurity experience\n- Deep expertise in specialized cybersecurity domains\n- Proven track record of successful security implementations\n- Experience mentoring junior staff\n\n`,
                certifications: `- CISSP (Certified Information Systems Security Professional) required\n- Advanced GIAC certifications (GCIA, GCIH, GPEN, etc.)\n- CISM (Certified Information Security Manager)\n- Specialized certifications relevant to domain\n\n`
            },
            'Lead': {
                education: `- Bachelor's degree required; Master's degree strongly preferred\n- Executive education or leadership training valued\n\n`,
                experience: `- 8-12 years of progressive cybersecurity experience\n- Proven leadership and technical excellence\n- Experience leading projects and technical teams\n- Strategic planning and architecture experience\n\n`,
                certifications: `- CISSP or CISM required\n- Multiple advanced technical certifications (GIAC, etc.)\n- Leadership or management certifications preferred\n- Specialized domain expertise certifications\n\n`
            },
            'Manager': {
                education: `- Bachelor's degree required; Master's degree (MBA or MIS) strongly preferred\n- Executive leadership training valued\n\n`,
                experience: `- 8+ years of cybersecurity experience with 3+ years in management\n- Proven ability to lead and develop teams\n- Budget and resource management experience\n- Strategic planning and organizational skills\n\n`,
                certifications: `- CISM (Certified Information Security Manager) or CISSP required\n- PMP (Project Management Professional) preferred\n- CGEIT (Certified in Governance of Enterprise IT)\n- Executive or management-focused certifications\n\n`
            },
            'Director': {
                education: `- Bachelor's degree required; Master's degree or MBA required\n- Executive education from recognized institutions\n\n`,
                experience: `- 12+ years of cybersecurity experience with 5+ years in leadership\n- Proven executive leadership and strategic vision\n- Experience managing large teams and budgets\n- Board-level communication and stakeholder management\n\n`,
                certifications: `- CISM or CISSP required\n- CGEIT (Certified in Governance of Enterprise IT)\n- Executive leadership certifications\n- Industry-recognized thought leadership\n\n`
            }
        };

        // Default qualifications if no tier specified
        const defaultQuals = {
            education: `- Bachelor's degree in Computer Science, Cybersecurity, Information Technology, or related field\n- Advanced degree or relevant certifications preferred\n\n`,
            experience: `- 2-5 years of relevant cybersecurity experience (varies by level)\n- Demonstrated experience with security tools and technologies\n- Experience in relevant cybersecurity domains\n\n`,
            certifications: `- Security+ (CompTIA)\n- CEH (Certified Ethical Hacker)\n- CISSP (Certified Information Systems Security Professional)\n- GIAC certifications relevant to role\n- CISM (Certified Information Security Manager)\n\n`
        };

        return qualifications[tier] || defaultQuals;
    }

    // AI Enhancement Function
    async function enhanceWithAI(markdown, jobTitle, jobTier, components, includeSOC, isJobAd) {
        if (!window.apiManager) {
            console.error('API Manager not available');
            return markdown;
        }

        try {
            const formatType = isJobAd ? 'job advertisement' : 'role definition document';
            const systemPrompt = `You are an expert HR professional and cybersecurity workforce specialist. You create professional ${isJobAd ? 'job advertisements' : 'role definition documents'} based on the NIST NICE Framework.

Your task is to refine and enhance the provided ${formatType} to make it more professional, cohesive, and suitable for its purpose. The description is based on NIST NICE Framework components.

Guidelines:
- Maintain all NIST codes (K-xxxx, S-xxxx, T-xxxx) exactly as provided
- Keep the structure and all sections intact
- Keep all Skills, Knowledge, and Tasks as NUMBERED LISTS (1. 2. 3. etc.) - DO NOT convert to markdown tables
- Maintain the exact list format with bold NIST codes: "1. **K-0001**: Description text"
- ${isJobAd ? 'Use recruitment language to attract candidates and highlight benefits' : 'Use objective, factual language. This is an internal documentation tool for employees who already hold the position. Avoid conversational tone, phrases like "you will" or "your role", and do not describe qualifications or hiring requirements'}
- ${jobTier ? `Keep content appropriate for a ${jobTier}-level position` : 'Ensure appropriate position level'}
- ${isJobAd ? 'Include qualifications and requirements' : 'Focus purely on role definition: skills, knowledge, tasks, and responsibilities. Do NOT include qualifications, education, or experience requirements'}
- Ensure consistent formatting and professional tone
- Do NOT remove or alter the NIST framework references or codes
- Do NOT use markdown tables for any section`;

            const userPrompt = `Please refine and enhance this ${jobTier ? jobTier + '-level ' : ''}${formatType} for "${jobTitle}". ${isJobAd ? 'Make it appealing for recruitment' : 'Make it clear and informative for someone already in the role'} while maintaining all NIST framework references and structure:\n\n${markdown}`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: 3000,
                temperature: 0.7
            });

            return response;
        } catch (error) {
            console.error('AI enhancement failed:', error);
            showError('AI enhancement failed. Using basic job description. ' + error.message);
            return markdown;
        }
    }

    // Display result
    function displayResult(markdown) {
        // Convert markdown to HTML (basic conversion)
        const html = convertMarkdownToHTML(markdown);
        elements.resultContent.innerHTML = html;
        elements.resultDiv.style.display = 'block';
        elements.resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Basic markdown to HTML converter
    function convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Line breaks and paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        html = '<p>' + html + '</p>';
        
        // Horizontal rules
        html = html.replace(/<p>---<\/p>/g, '<hr>');
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><br><\/p>/g, '');
        
        return html;
    }

    // Handle copy
    function handleCopy() {
        const text = elements.resultContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            showTemporaryMessage(elements.copyBtn, '✓ Copied!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showError('Failed to copy to clipboard.');
        });
    }

    // Handle download
    function handleDownload() {
        const markdown = elements.resultContent.innerText;
        const jobTitle = elements.jobTitle.value.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const isJobAd = elements.outputFormat.checked;
        const filename = `${jobTitle}_${isJobAd ? 'job_ad' : 'role_definition'}.md`;
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showTemporaryMessage(elements.downloadBtn, '✓ Downloaded!');
    }

    // Handle regenerate
    function handleRegenerate() {
        handleFormSubmit(new Event('submit'));
    }

    // Handle reset
    function handleReset() {
        elements.form.reset();
        elements.jobTier.value = '';
        elements.skillsCount.value = 5;
        elements.knowledgeCount.value = 5;
        elements.tasksCount.value = 5;
        elements.outputFormat.checked = false;
        elements.includeSOC.checked = true;
        elements.useAI.checked = false;
        updateFormatLabel();
        updateSliderValues();
        hideResult();
        hideError();
    }

    // Show/hide functions
    function showLoading() {
        elements.loadingDiv.style.display = 'block';
        elements.generateBtn.disabled = true;
    }

    function hideLoading() {
        elements.loadingDiv.style.display = 'none';
        elements.generateBtn.disabled = false;
    }

    function showError(message) {
        elements.errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
        elements.errorDiv.style.display = 'block';
    }

    function hideError() {
        elements.errorDiv.style.display = 'none';
    }

    function hideResult() {
        elements.resultDiv.style.display = 'none';
    }

    function showTemporaryMessage(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
