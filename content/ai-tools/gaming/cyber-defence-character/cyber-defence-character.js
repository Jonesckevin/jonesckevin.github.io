// Cyber Defence Character Sheet Generator
document.addEventListener('DOMContentLoaded', function () {
    console.log('Cyber Defence Character Sheet script loaded');

    // Global variables
    let currentResult = '';
    let currentCharacterData = null;

    // Modal functions
    window.openStatsModal = function() {
        document.getElementById('statsModal').style.display = 'block';
    };

    window.closeStatsModal = function() {
        document.getElementById('statsModal').style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('statsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Calculate stat modifier (D&D formula)
    function calculateModifier(statValue) {
        return Math.floor((statValue - 10) / 2);
    }

    // Format modifier for display
    function formatModifier(modifier) {
        return modifier >= 0 ? `+${modifier}` : `${modifier}`;
    }

    // Get current stat value
    function getStatValue(stat) {
        const element = document.getElementById(`stat${stat}`);
        return parseInt(element.textContent) || 10;
    }

    // Set stat value and update modifier
    function setStatValue(stat, value) {
        // Clamp value between 1 and 20
        value = Math.max(1, Math.min(20, value));
        
        const statElement = document.getElementById(`stat${stat}`);
        const modElement = document.getElementById(`mod${stat}`);
        
        statElement.textContent = value;
        
        const modifier = calculateModifier(value);
        modElement.textContent = formatModifier(modifier);
    }

    // Adjust stat by increment (for +/- buttons)
    window.adjustStat = function(stat, increment) {
        const currentValue = getStatValue(stat);
        const newValue = currentValue + increment;
        setStatValue(stat, newValue);
    };

    // Update stat modifiers in real-time
    function updateModifiers() {
        const stats = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];
        stats.forEach(stat => {
            const value = getStatValue(stat);
            const modifier = calculateModifier(value);
            document.getElementById(`mod${stat}`).textContent = formatModifier(modifier);
        });
    }

    // Initialize modifiers on load
    updateModifiers();

    // Randomize character generation
    window.randomizeCharacter = function () {
        console.log('Randomizing character...');

        // Random name components (expanded)
        const prefixes = [
            'Shadow','Cyber','Ghost','Null','Dark','Quantum','Phoenix','Raven','Vortex','Cipher', 'Vector','Neon','Apex','Echo','Nova','Binary','Lambda','Onyx','Zero','Flux', 'Cobalt','Obsidian','Argon','Sable','Specter','Orbit','Static','Glitch','Firewall','Kernel', 'Voltage','Spectrum','Carbon','Titan','Nebula','Catalyst','Orbit','Circuit','Pulse','Quantum'
        ];
        const suffixes = [
            'Knight','Guardian','Hunter','Sentinel','Wraith','Blade','Shield','Warden','Forge','Keeper', 'Operator','Architect','Ranger','Analyst','Vigil','Nomad','Spectre','Harbinger','Scout','Protector', 'Striker','Cipher','Tracer','Watcher','Seeker','Navigator','Resolver','Breaker','Defender','Engineer', 'Controller','Invoker','Skirmisher','Tracer','Monitor','Mediator','Arbiter','Pathfinder','Overwatch','Custodian'
        ];
        const randomName = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        document.getElementById('characterName').value = randomName;

        // Random class (all 16 classes)
        const classes = [
            'incident-responder', 'soc-analyst', 'blue-team', 'threat-hunter', 'security-architect', 'red-team', 'penetration-tester', 'exploit-developer',
            'malware-analyst', 'forensics-investigator', 'threat-intelligence', 'reverse-engineer', 'security-engineer', 'compliance-officer', 'risk-analyst', 'cryptographer'
        ];
        document.getElementById('characterClass').value = classes[Math.floor(Math.random() * classes.length)];

        // Random gender
        const genders = ['neutral', 'male', 'female'];
        document.getElementById('characterGender').value = genders[Math.floor(Math.random() * genders.length)];

        // Random stats (8-18 range for balanced characters)
        ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'].forEach(stat => {
            const value = Math.floor(Math.random() * 11) + 8; // 8-18
            setStatValue(stat, value);
        });

        // Random skills (3-6 skills)
        const skillsSelect = document.getElementById('skills');
        const skillOptions = Array.from(skillsSelect.options);
        const numSkills = Math.floor(Math.random() * 4) + 3; // 3-6 skills
        
        // Clear selections
        skillOptions.forEach(opt => opt.selected = false);
        
        // Select random skills
        const shuffled = skillOptions.sort(() => 0.5 - Math.random());
        shuffled.slice(0, numSkills).forEach(opt => opt.selected = true);

        // Random tools (3-6 tools)
        const toolsSelect = document.getElementById('tools');
        const toolOptions = Array.from(toolsSelect.options);
        const numTools = Math.floor(Math.random() * 4) + 3; // 3-6 tools
        
        // Clear selections
        toolOptions.forEach(opt => opt.selected = false);
        
        // Select random tools
        const shuffledTools = toolOptions.sort(() => 0.5 - Math.random());
        shuffledTools.slice(0, numTools).forEach(opt => opt.selected = true);

        // Random background prompt (expanded options)
        const backgrounds = [
            'Former military intelligence analyst who transitioned to private sector cybersecurity after witnessing nation-state attacks.',
            'Self-taught hacker turned ethical security professional after a life-changing encounter with cybercrime.', 'Computer science graduate who discovered their passion for security during a university CTF competition.', 'Career-changer from law enforcement who brings investigative skills to digital forensics.', 'System administrator who evolved into security after defending against a major ransomware attack.', 'Bug bounty hunter who turned professional after discovering critical vulnerabilities in Fortune 500 companies.', 'Former software developer who pivoted to security after experiencing a devastating supply chain attack.', 'Academic researcher specializing in cryptography who now applies theoretical knowledge to real-world threats.', 'Network engineer who became a security specialist after investigating an APT persistence in enterprise infrastructure.', 'Incident responder forged in the crucible of coordinating response to a multi-stage breach affecting critical infrastructure.', 'Ex-military cyber operations specialist who now brings tactical precision to red team engagements.', 'Compliance officer turned risk analyst after recognizing the gap between regulatory requirements and actual security posture.', 'Cloud architect who specializes in securing hybrid environments after migrating legacy systems.', 'Industrial control systems engineer who pivoted to OT/ICS security after a near-miss critical infrastructure incident.', 'Threat intelligence analyst who started by hunting APT groups targeting their nation\'s interests.', 'Security automation engineer who built their career automating response to high-volume security events.', 'IoT security researcher who discovered their calling after finding vulnerabilities in smart home devices.', 'Mobile security specialist who transitioned from app development after reverse engineering malicious applications.', 'Privacy engineer who combines legal expertise with technical knowledge to implement privacy-by-design principles.', 'Open-source intelligence analyst who leverages OSINT techniques to map adversary infrastructure and TTPs.'
        ];
        document.getElementById('background').value = backgrounds[Math.floor(Math.random() * backgrounds.length)];

        console.log('Character randomized successfully');
    };

    // Main character generation function
    window.generateCharacter = async function () {
        console.log('=== GENERATE CHARACTER FUNCTION CALLED ===');

        // Hide previous results/errors
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';

        // Get form values
        const characterName = document.getElementById('characterName').value.trim();
        const characterClass = document.getElementById('characterClass').value;
        const characterGender = document.getElementById('characterGender').value;
        const background = document.getElementById('background').value.trim();

        // Get stats
        const stats = {
            str: getStatValue('Str'),
            dex: getStatValue('Dex'),
            con: getStatValue('Con'),
            int: getStatValue('Int'),
            wis: getStatValue('Wis'),
            cha: getStatValue('Cha')
        };

        // Get skills
        const skillsSelect = document.getElementById('skills');
        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(opt => opt.value);
        const customSkills = document.getElementById('customSkills').value.trim()
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        const allSkills = [...selectedSkills, ...customSkills];

        // Get tools
        const toolsSelect = document.getElementById('tools');
        const selectedTools = Array.from(toolsSelect.selectedOptions).map(opt => opt.value);
        const customTools = document.getElementById('customTools').value.trim()
            .split('\n')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        const allTools = [...selectedTools, ...customTools];

        // Get generation options
        const includeStatAnalysis = document.getElementById('includeStatAnalysis').checked;
        const includeUniqueAbilities = document.getElementById('includeUniqueAbilities').checked;
        const includeStrengthsWeaknesses = document.getElementById('includeStrengthsWeaknesses').checked;

        // Validation
        if (!characterName) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter a character name.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!characterClass) {
            utils.showError(document.getElementById('errorDiv'), 'Please select a cybersecurity class.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        console.log('Character data collected:', { characterName, characterClass, stats, skillCount: allSkills.length, toolCount: allTools.length });

        // Store character data for PDF generation
        currentCharacterData = {
            name: characterName,
            class: characterClass,
            gender: characterGender,
            stats: stats,
            skills: allSkills,
            tools: allTools,
            background: background,
            options: {
                includeStatAnalysis,
                includeUniqueAbilities,
                includeStrengthsWeaknesses
            }
        };

        // Build prompt for AI backstory generation
        const pronounGuidance = {
            male: 'Use male pronouns (he/him/his) when referring to this character.',
            female: 'Use female pronouns (she/her/hers) when referring to this character.',
            neutral: 'Use gender-neutral pronouns (they/them/their) when referring to this character. Avoid using he/she or his/her constructions.'
        };
        
        let prompt = `You are a creative storyteller specializing in cybersecurity narratives. Generate a compelling character backstory and special abilities for the following cyber defence professional.\n\n`;
        prompt += `**Important:** ${pronounGuidance[characterGender]}\n\n`;
        prompt += `**Character Details:**\n`;
        prompt += `- Name: ${characterName}\n`;
        prompt += `- Class: ${characterClass}\n`;
        prompt += `- Stats: STR ${stats.str} (${formatModifier(calculateModifier(stats.str))}), `;
        prompt += `DEX ${stats.dex} (${formatModifier(calculateModifier(stats.dex))}), `;
        prompt += `CON ${stats.con} (${formatModifier(calculateModifier(stats.con))}), `;
        prompt += `INT ${stats.int} (${formatModifier(calculateModifier(stats.int))}), `;
        prompt += `WIS ${stats.wis} (${formatModifier(calculateModifier(stats.wis))}), `;
        prompt += `CHA ${stats.cha} (${formatModifier(calculateModifier(stats.cha))})\n`;
        
        if (allSkills.length > 0) {
            prompt += `- Skills: ${allSkills.join(', ')}\n`;
        }
        
        if (allTools.length > 0) {
            prompt += `- Tools: ${allTools.slice(0, 5).join(', ')}${allTools.length > 5 ? ', and more' : ''}\n`;
        }
        
        if (background) {
            prompt += `- Background Context: ${background}\n`;
        }

        prompt += `\n**Requirements:**\n`;
        prompt += `Generate the following sections in markdown format:\n\n`;
        
        prompt += `## Character Backstory\n`;
        prompt += `Write a 2-3 paragraph, modern, realistic profile grounded strictly in the provided stats, class, selected skills, and tools. Focus on current role, typical responsibilities, decision-making style, notable patterns of work, and how their strengths show up in practice. Avoid speculative personal details (e.g., past jobs, places lived, family background) unless explicitly provided. Do not invent biographical history. Keep it professional and contemporary, reflecting real cybersecurity work.\n\n`;
        
        if (includeStatAnalysis) {
            prompt += `## Stat-Based Character Analysis\n`;
            prompt += `Analyze this character's personality and work style based on their stat distribution. Describe:\n`;
            prompt += `- Primary strengths based on highest stats\n`;
            prompt += `- Character archetype (e.g., "The Technical Perfectionist", "The Strategic Leader", "The Swift Responder")\n`;
            prompt += `- How their stat distribution influences their approach to cybersecurity work\n`;
            prompt += `- Whether they're more analytical/technical (INT/WIS) or social/leadership-oriented (CHA) or hands-on/action-focused (STR/DEX)\n\n`;
        }
        
        prompt += `## Class Features & Special Abilities\n`;
        prompt += `Based on their class (${characterClass}), describe 3-4 special abilities or techniques they've mastered. Each ability should:\n`;
        prompt += `- Have a cool name\n`;
        prompt += `- Be relevant to their cybersecurity role\n`;
        prompt += `- Reference their stats or skills where appropriate\n`;
        prompt += `- Sound epic but remain grounded in real security work\n\n`;
        
        if (includeUniqueAbilities) {
            prompt += `## Unique Signature Abilities\n`;
            prompt += `Generate 2-3 unique, random special abilities that are specifically tailored to this character's stat distribution and class. These should be:\n`;
            prompt += `- Highly specific and creative (not generic abilities)\n`;
            prompt += `- Directly influenced by their highest stats (e.g., high INT = advanced technical analysis abilities, high CHA = exceptional social engineering/communication abilities)\n`;
            prompt += `- Unexpected combinations that make this character memorable\n`;
            prompt += `- Practical in cybersecurity contexts but with a unique twist\n\n`;
        }
        
        if (includeStrengthsWeaknesses) {
            prompt += `## Strengths & Weaknesses\n`;
            prompt += `Based on their stat distribution, identify:\n`;
            prompt += `- **Key Strengths**: 3-4 areas where they excel (tied to high stats)\n`;
            prompt += `- **Potential Weaknesses**: 2-3 areas where they may struggle (tied to low stats)\n`;
            prompt += `- **Growth Opportunities**: Suggestions for how they can develop their weaker areas\n`;
            prompt += `Be honest but constructive about limitations.\n\n`;
        }
        
        prompt += `## Signature Moves\n`;
        prompt += `Describe 2-3 "signature moves" or notable achievements that define this character's reputation in the field.\n\n`;
        prompt += `Keep the tone professional but exciting, like a D&D character sheet meets real-world cybersecurity expertise.`;

        console.log('Prompt prepared, length:', prompt.length);

        // Show loading indicator
        utils.showLoading(
            document.getElementById('loadingDiv'),
            'Forging your cyber warrior...'
        );
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            console.log('Making API request for backstory...');

            const messages = [
                {
                    role: 'system',
                    content: 'You are a creative storyteller who specializes in cybersecurity narratives and character development. You create compelling backstories that blend D&D-style heroic flavor with realistic cybersecurity expertise.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ];

            // Make the API request
            const aiResponse = await apiManager.makeRequest(messages, {
                maxTokens: 2000,
                temperature: 0.8 // Higher temperature for creative storytelling
            });

            console.log('API response received, length:', aiResponse ? aiResponse.length : 0);

            // Hide loading
            document.getElementById('loadingDiv').style.display = 'none';

            // Generate character sheet HTML
            const characterSheetHTML = generateCharacterSheetHTML(currentCharacterData, aiResponse);
            
            // Store full result (markdown format)
            currentResult = generateMarkdownSheet(currentCharacterData, aiResponse);

            // Display character sheet
            document.getElementById('characterSheet').innerHTML = characterSheetHTML;
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to results
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error generating character:', error);
            document.getElementById('loadingDiv').style.display = 'none';

            let errorMessage = 'Failed to generate character sheet. ';
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key configuration.';
            } else if (error.message.includes('rate limit')) {
                errorMessage += 'Rate limit reached. Please try again in a moment.';
            } else {
                errorMessage += error.message || 'Please try again.';
            }

            utils.showError(document.getElementById('errorDiv'), errorMessage);
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    // Generate character sheet HTML
    function generateCharacterSheetHTML(charData, aiStory) {
        const classNames = {
            'incident-responder': 'Incident Responder',
            'soc-analyst': 'SOC Analyst',
            'blue-team': 'Blue Team Defender',
            'threat-hunter': 'Threat Hunter',
            'security-architect': 'Security Architect',
            'red-team': 'Red Team Specialist',
            'penetration-tester': 'Penetration Tester',
            'exploit-developer': 'Exploit Developer',
            'malware-analyst': 'Malware Analyst',
            'forensics-investigator': 'Forensics Investigator',
            'threat-intelligence': 'Threat Intelligence Analyst',
            'reverse-engineer': 'Reverse Engineer',
            'security-engineer': 'Security Engineer',
            'compliance-officer': 'Compliance Officer',
            'risk-analyst': 'Risk Analyst',
            'cryptographer': 'Cryptographer'
        };

        let html = `<div class="character-sheet-display">`;
        
        // Header
        html += `<div class="char-header">`;
        html += `<h2>${charData.name}</h2>`;
        html += `<p class="char-class">${classNames[charData.class] || charData.class}</p>`;
        html += `</div>`;

        // Stats table
        html += `<div class="char-stats">`;
        html += `<h3>Core Statistics</h3>`;
        html += `<table class="stats-table">`;
        html += `<tr>`;
        html += `<th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th>`;
        html += `</tr>`;
        html += `<tr>`;
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(stat => {
            const mod = calculateModifier(charData.stats[stat]);
            html += `<td><strong>${charData.stats[stat]}</strong><br><span class="modifier">${formatModifier(mod)}</span></td>`;
        });
        html += `</tr>`;
        html += `</table>`;
        html += `</div>`;

        // Skills
        if (charData.skills.length > 0) {
            html += `<div class="char-skills">`;
            html += `<h3>Skills & Proficiencies</h3>`;
            html += `<ul class="skill-list">`;
            charData.skills.forEach(skill => {
                html += `<li>✓ ${skill}</li>`;
            });
            html += `</ul>`;
            html += `</div>`;
        }

        // Tools
        if (charData.tools.length > 0) {
            html += `<div class="char-tools">`;
            html += `<h3>Tools & Technologies</h3>`;
            html += `<ul class="tool-list">`;
            charData.tools.forEach(tool => {
                html += `<li>🔧 ${tool}</li>`;
            });
            html += `</ul>`;
            html += `</div>`;
        }

        // AI-generated story
        if (aiStory) {
            html += `<div class="char-story">`;
            // Remove markdown code block wrapping if present
            let cleanedStory = aiStory.trim();
            // Remove leading ```markdown or ``` and trailing ```
            cleanedStory = cleanedStory.replace(/^```(?:markdown)?\s*\n/i, '');
            cleanedStory = cleanedStory.replace(/\n```\s*$/, '');
            html += utils.formatMarkdown(cleanedStory);
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }

    // Generate markdown version of character sheet
    function generateMarkdownSheet(charData, aiStory) {
        const classNames = {
            'incident-responder': 'Incident Responder',
            'threat-hunter': 'Threat Hunter',
            'malware-analyst': 'Malware Analyst',
            'soc-analyst': 'SOC Analyst',
            'red-team': 'Red Team Specialist',
            'blue-team': 'Blue Team Defender'
        };

        let markdown = `# ${charData.name}\n\n`;
        markdown += `**Class:** ${classNames[charData.class] || charData.class}\n\n`;
        
        markdown += `## Core Statistics\n\n`;
        markdown += `| STR | DEX | CON | INT | WIS | CHA |\n`;
        markdown += `|-----|-----|-----|-----|-----|-----|\n`;
        markdown += `| ${charData.stats.str} (${formatModifier(calculateModifier(charData.stats.str))}) | `;
        markdown += `${charData.stats.dex} (${formatModifier(calculateModifier(charData.stats.dex))}) | `;
        markdown += `${charData.stats.con} (${formatModifier(calculateModifier(charData.stats.con))}) | `;
        markdown += `${charData.stats.int} (${formatModifier(calculateModifier(charData.stats.int))}) | `;
        markdown += `${charData.stats.wis} (${formatModifier(calculateModifier(charData.stats.wis))}) | `;
        markdown += `${charData.stats.cha} (${formatModifier(calculateModifier(charData.stats.cha))}) |\n\n`;

        if (charData.skills.length > 0) {
            markdown += `## Skills & Proficiencies\n\n`;
            charData.skills.forEach(skill => {
                markdown += `- ${skill}\n`;
            });
            markdown += `\n`;
        }

        if (charData.tools.length > 0) {
            markdown += `## Tools & Technologies\n\n`;
            charData.tools.forEach(tool => {
                markdown += `- ${tool}\n`;
            });
            markdown += `\n`;
        }

        if (aiStory) {
            // Remove markdown code block wrapping if present
            let cleanedStory = aiStory.trim();
            // Remove leading ```markdown or ``` and trailing ```
            cleanedStory = cleanedStory.replace(/^```(?:markdown)?\s*\n/i, '');
            cleanedStory = cleanedStory.replace(/\n```\s*$/, '');
            markdown += `---\n\n${cleanedStory}`;
        }

        return markdown;
    }

    // Copy function
    window.copyResult = async function (event) {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to copy');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const success = await utils.copyToClipboard(currentResult);

        if (success && event?.target) {
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }
    };

    // Download function
    window.downloadResult = function (format) {
        if (!currentResult) {
            utils.showError(document.getElementById('errorDiv'), 'No content to download');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        try {
            const filename = `cyber-character-${currentCharacterData.name.toLowerCase().replace(/\s+/g, '-')}`;
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download(format, filename);
        } catch (err) {
            console.error('Download failed:', err);
            utils.showError(document.getElementById('errorDiv'), 'Failed to download file.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    // PDF download function
    window.downloadPDF = function () {
        if (!currentCharacterData) {
            utils.showError(document.getElementById('errorDiv'), 'No character data available');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const classNames = {
                'incident-responder': 'Incident Responder',
                'soc-analyst': 'SOC Analyst',
                'blue-team': 'Blue Team Defender',
                'threat-hunter': 'Threat Hunter',
                'security-architect': 'Security Architect',
                'red-team': 'Red Team Specialist',
                'penetration-tester': 'Penetration Tester',
                'exploit-developer': 'Exploit Developer',
                'malware-analyst': 'Malware Analyst',
                'forensics-investigator': 'Forensics Investigator',
                'threat-intelligence': 'Threat Intelligence Analyst',
                'reverse-engineer': 'Reverse Engineer',
                'security-engineer': 'Security Engineer',
                'compliance-officer': 'Compliance Officer',
                'risk-analyst': 'Risk Analyst',
                'cryptographer': 'Cryptographer'
            };

            let yPos = 20;

            // Title
            doc.setFontSize(22);
            doc.setFont(undefined, 'bold');
            doc.text(currentCharacterData.name, 105, yPos, { align: 'center' });
            
            yPos += 10;
            doc.setFontSize(14);
            doc.setFont(undefined, 'normal');
            doc.text(classNames[currentCharacterData.class] || currentCharacterData.class, 105, yPos, { align: 'center' });
            
            yPos += 15;
            doc.line(20, yPos, 190, yPos);
            yPos += 10;

            // Stats - draw a 2-row table (headers + values/mods)
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Core Statistics', 20, yPos);
            yPos += 8;

            const statLabels = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
            const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

            // Table layout
            const tableLeft = 20;
            const tableTop = yPos;
            const colWidth = (190 - tableLeft) / statLabels.length; // fit across page
            const headerHeight = 8;
            const cellHeight = 8;

            // Header row
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            statLabels.forEach((label, idx) => {
                const x = tableLeft + idx * colWidth;
                doc.text(label, x + colWidth / 2, tableTop, { align: 'center' });
            });

            // Values row
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            const valuesTop = tableTop + headerHeight + 4;
            statKeys.forEach((key, idx) => {
                const statVal = currentCharacterData.stats[key];
                const mod = formatModifier(calculateModifier(statVal));
                const x = tableLeft + idx * colWidth;
                doc.text(`${statVal} (${mod})`, x + colWidth / 2, valuesTop, { align: 'center' });
            });

            // Move yPos below table
            yPos = valuesTop + cellHeight + 6;

            // Skills
            if (currentCharacterData.skills.length > 0) {
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text('Skills & Proficiencies', 20, yPos);
                yPos += 7;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                currentCharacterData.skills.forEach(skill => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(`• ${skill}`, 25, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }

            // Tools
            if (currentCharacterData.tools.length > 0) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text('Tools & Technologies', 20, yPos);
                yPos += 7;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                currentCharacterData.tools.forEach(tool => {
                    if (yPos > 270) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(`• ${tool}`, 25, yPos);
                    yPos += 5;
                });
                yPos += 10;
            }

            // AI-Generated Story Content (basic markdown renderer)
            if (currentResult) {
                const renderMarkdownToPDF = (markdown) => {
                    const maxWidth = 170;
                    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
                    let inList = false;
                    let listType = null; // 'ul' or 'ol'
                    let listIndex = 1;

                    const ensureSpace = (amt = 4) => { yPos += amt; };
                    const maybePageBreak = (limit = 280) => {
                        if (yPos > limit) { doc.addPage(); yPos = 20; }
                    };

                    // Draw a single line with basic inline styles (**bold**, *italic* or _italic_, `code`)
                    const drawStyledLine = (text, startX, startY) => {
                        // Tokenize inline segments
                        const tokens = [];
                        let remaining = text;
                        const pattern = /(\*\*[^*]+\*\*|_[^_]+_|\*[^*]+\*|`[^`]+`)/g;
                        let lastIndex = 0, m;
                        while ((m = pattern.exec(text)) !== null) {
                            if (m.index > lastIndex) {
                                tokens.push({ kind: 'normal', text: text.slice(lastIndex, m.index) });
                            }
                            const seg = m[0];
                            if (seg.startsWith('**')) {
                                tokens.push({ kind: 'bold', text: seg.slice(2, -2) });
                            } else if (seg.startsWith('`')) {
                                tokens.push({ kind: 'code', text: seg.slice(1, -1) });
                            } else {
                                // *italic* or _italic_
                                tokens.push({ kind: 'italic', text: seg.slice(1, -1) });
                            }
                            lastIndex = m.index + seg.length;
                        }
                        if (lastIndex < text.length) {
                            tokens.push({ kind: 'normal', text: text.slice(lastIndex) });
                        }

                        let x = startX;
                        tokens.forEach(tok => {
                            // Set style
                            if (tok.kind === 'bold') doc.setFont(undefined, 'bold');
                            else if (tok.kind === 'italic') doc.setFont(undefined, 'italic');
                            else if (tok.kind === 'code') {
                                doc.setFont(undefined, 'normal');
                                // Monospace approximation
                                doc.setFont('courier', 'normal');
                            } else {
                                doc.setFont('helvetica', 'normal');
                            }
                            const printed = tok.text;
                            doc.text(printed, x, startY);
                            const w = doc.getTextWidth(printed);
                            x += w;
                            // Reset to base font after code
                            if (tok.kind === 'code') {
                                doc.setFont('helvetica', 'normal');
                            }
                        });
                        // Ensure we reset font
                        doc.setFont('helvetica', 'normal');
                    };

                    for (let raw of lines) {
                        let line = raw.trim();
                        // Headers
                        const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
                        if (hMatch) {
                            // Close list
                            inList = false; listType = null; listIndex = 1;
                            maybePageBreak(260);
                            const level = hMatch[1].length;
                            const text = hMatch[2];
                            doc.setFontSize(level <= 2 ? 12 : 11);
                            doc.setFont(undefined, 'bold');
                            doc.text(text, 20, yPos);
                            yPos += (level <= 2 ? 7 : 6);
                            doc.setFontSize(10);
                            doc.setFont(undefined, 'normal');
                            continue;
                        }

                        // Horizontal rule
                        if (/^---+$/.test(line)) { ensureSpace(6); continue; }

                        // Ordered list
                        const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
                        if (olMatch) {
                            if (!inList || listType !== 'ol') { inList = true; listType = 'ol'; listIndex = parseInt(olMatch[1], 10) || 1; }
                            maybePageBreak();
                            const itemText = olMatch[2];
                            const wrapped = doc.splitTextToSize(itemText, maxWidth - 10);
                            doc.text(`${listIndex}.`, 20, yPos);
                            wrapped.forEach(line => {
                                drawStyledLine(line, 28, yPos);
                                yPos += 5;
                            });
                            listIndex++;
                            continue;
                        }

                        // Unordered list
                        const ulMatch = line.match(/^[-*+]\s+(.*)$/);
                        if (ulMatch) {
                            if (!inList || listType !== 'ul') { inList = true; listType = 'ul'; }
                            maybePageBreak();
                            const itemText = ulMatch[1];
                            const wrapped = doc.splitTextToSize(itemText, maxWidth - 10);
                            doc.text('•', 20, yPos);
                            wrapped.forEach(line => {
                                drawStyledLine(line, 28, yPos);
                                yPos += 5;
                            });
                            continue;
                        }

                        // Blank line
                        if (line === '') { inList = false; listType = null; listIndex = 1; ensureSpace(4); continue; }

                        // Paragraph
                        inList = false; listType = null; listIndex = 1;
                        maybePageBreak();
                        const wrapped = doc.splitTextToSize(line, maxWidth);
                        wrapped.forEach(t => {
                            maybePageBreak();
                            drawStyledLine(t, 20, yPos);
                            yPos += 5;
                        });
                    }
                };

                if (yPos > 240) { doc.addPage(); yPos = 20; }
                doc.setFontSize(16);
                doc.setFont(undefined, 'bold');
                doc.text('Character Profile', 20, yPos);
                yPos += 10;
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                // Remove duplicate sections from markdown before rendering in the PDF profile
                let profileMarkdown = currentResult;
                // Remove top-level title (e.g., "# Name")
                profileMarkdown = profileMarkdown.replace(/^#\s+.*\n+/, '');
                // Remove Class line (e.g., "**Class:** Something")
                profileMarkdown = profileMarkdown.replace(/\n\*\*Class:\*\*.*\n+/, '\n');
                // Remove Core Statistics section
                profileMarkdown = profileMarkdown.replace(/\n## Core Statistics[\s\S]*?(?=\n## |\n# |$)/, '\n');
                // Remove Skills & Proficiencies section
                profileMarkdown = profileMarkdown.replace(/\n## Skills \& Proficiencies[\s\S]*?(?=\n## |\n# |$)/, '\n');
                // Remove Tools & Technologies section
                profileMarkdown = profileMarkdown.replace(/\n## Tools \& Technologies[\s\S]*?(?=\n## |\n# |$)/, '\n');
                renderMarkdownToPDF(profileMarkdown);
            }

            // Save PDF
            const filename = `cyber-character-${currentCharacterData.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            doc.save(filename);

            console.log('PDF generated successfully');

        } catch (err) {
            console.error('PDF generation failed:', err);
            utils.showError(document.getElementById('errorDiv'), 'Failed to generate PDF. Please try downloading as Markdown or HTML instead.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    console.log('Cyber Defence Character Sheet initialized successfully');
});
