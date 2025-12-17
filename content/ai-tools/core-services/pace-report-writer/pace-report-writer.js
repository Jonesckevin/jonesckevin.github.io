// PaCE Report Writer Script
document.addEventListener('DOMContentLoaded', async function () {
    console.log('PaCE Report Writer script loaded');
    
    // Global variable to store current result
    let currentResult = '';
    
    // Initialize download manager
    if (!window.downloadManager) {
        window.downloadManager = new DownloadManager();
    }

    // Register standardized copy/download actions
    utils.registerToolActions('pace-report-writer', () => currentResult);
    
    // Load competency data from JSONL file
    await loadCompetencyData();
    
    // Load inclusive behaviours data from JSONL file
    await loadInclusiveBehavioursData();
    
    // Move modals to body level to fix positioning issues
    moveModalsToBody();
    
    // Create info overlay dynamically
    createInfoOverlay();
});

// Create info overlay for tool description
function createInfoOverlay() {
    const existingOverlay = document.getElementById('infoOverlay');
    
    if (!existingOverlay) {
        const overlayHTML = `
            <div class="info-overlay" id="infoOverlay">
                <div class="info-popup" id="infoPopup">
                    <div class="popup-header">
                        <div class="popup-title">
                            <span class="info-icon-large">ℹ️</span>
                            <strong>About PaCE Report Writer</strong>
                        </div>
                    </div>
                    <div class="popup-content">
                        <p><strong>⚠️ Security Notice:</strong> Do not put sensitive information into the form.</p>
                        <p>From here you can create PaCE Feedback Notes by providing some information. The more details you provide, the better the AI can assist you.</p>
                        <ul>
                            <li>This tool is completely free to use</li>
                            <li>Does not retain any information (handled by your API provider)</li>
                            <li>Can be used offline by selecting a local AI in provider settings</li>
                            <li>Select rank-specific competency frameworks</li>
                            <li>Adjust the number of competencies (1-15) based on your needs</li>
                            <li>Optional pre-selection of up to 3 competencies</li>
                            <li>Toggle CCG assessment and competency analysis as needed</li>
                        </ul>
                        <div class="popup-actions">
                            <button class="btn-acknowledge" onclick="dismissInfoNotice()">I Understand - Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Show overlay on first visit
        const infoOverlay = document.getElementById('infoOverlay');
        if (infoOverlay) {
            infoOverlay.style.display = 'flex';
        }
    }
}

// Dismiss info notice
window.dismissInfoNotice = function() {
    const overlay = document.getElementById('infoOverlay');
    const toggleBtn = document.getElementById('infoToggleBtn');
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    if (toggleBtn) {
        toggleBtn.style.display = 'flex';
    }
};

// Show info notice again
window.showInfoNotice = function() {
    const overlay = document.getElementById('infoOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
};

// Rank mapping from JSONL format to dropdown values
const rankMapping = {
    'Pte': 'pte',
    'Cpl': 'cpl',
    'MCpl': 'mcpl-ms',
    'Sgt': 'sgt-po2',
    'WO': 'wo-po1',
    'MWO': 'mwo-cpo2',
    'CWO': 'cwo-cpo1',
    'OCdt': 'ocdt',
    '2Lt': '2lt-aslt',
    'Lt': 'lt-slt',
    'Capt': 'capt-lt',
    'Major': 'maj-lcdr',
    'LCol': 'lcol-cdr',
    'Col': 'col-capt'
};

// Reverse mapping for display
const rankDisplayNames = {
    'pte': 'Private',
    'cpl': 'Corporal',
    'mcpl-ms': 'Master Corporal / Master Seaman',
    'sgt-po2': 'Sergeant / Petty Officer 2nd Class',
    'wo-po1': 'Warrant Officer / Petty Officer 1st Class',
    'mwo-cpo2': 'Master Warrant Officer / Chief Petty Officer 2nd Class',
    'cwo-cpo1': 'Chief Warrant Officer / Chief Petty Officer 1st Class',
    'ocdt': 'Officer Cadet',
    '2lt-aslt': 'Second Lieutenant / Acting Sub-Lieutenant',
    'lt-slt': 'Lieutenant / Sub-Lieutenant',
    'capt-lt': 'Captain / Lieutenant (Navy)',
    'maj-lcdr': 'Major / Lieutenant Commander',
    'lcol-cdr': 'Lieutenant Colonel / Commander',
    'col-capt': 'Colonel / Captain (Navy)'
};

// Function to move modals to body level for proper fixed positioning
function moveModalsToBody() {
    const frameworkModal = document.getElementById('frameworkModal');
    const referencesModal = document.getElementById('referencesModal');
    
    if (frameworkModal && frameworkModal.parentElement !== document.body) {
        console.log('Moving frameworkModal to body');
        document.body.appendChild(frameworkModal);
    }
    
    if (referencesModal && referencesModal.parentElement !== document.body) {
        console.log('Moving referencesModal to body');
        document.body.appendChild(referencesModal);
    }
}

// Function to load and parse competency JSONL data
async function loadCompetencyData() {
    try {
        const response = await fetch('/ai-tools/core-services/pace-report-writer/competency.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        // Parse each JSONL line
        const rawData = lines.map(line => JSON.parse(line));
        
        // Transform data into rank-specific structure
        window.competencyData = {};
        
        // Initialize all ranks
        Object.values(rankMapping).forEach(rankCode => {
            window.competencyData[rankCode] = {
                name: rankCode.toUpperCase(),
                fullName: rankDisplayNames[rankCode],
                competencies: []
            };
        });
        
        // Process each competency from JSONL
        rawData.forEach(compData => {
            const competencyName = compData.Competency;
            const facets = compData.Facets;
            
            // For each facet in the competency
            Object.keys(facets).forEach(facetName => {
                const behavioralIndicators = facets[facetName]['Behavioural Indicators'];
                
                // For each rank in the behavioral indicators
                Object.keys(behavioralIndicators).forEach(jsonlRank => {
                    const rankCode = rankMapping[jsonlRank];
                    if (!rankCode || !window.competencyData[rankCode]) return;
                    
                    const indicators = behavioralIndicators[jsonlRank];
                    if (!indicators || indicators.length === 0) return;
                    
                    // Find or create the competency category
                    let category = window.competencyData[rankCode].competencies.find(
                        c => c.category === competencyName
                    );
                    
                    if (!category) {
                        category = {
                            category: competencyName,
                            facets: []
                        };
                        window.competencyData[rankCode].competencies.push(category);
                    }
                    
                    // Add facet with behavioral indicators
                    category.facets.push({
                        name: facetName,
                        indicators: indicators
                    });
                });
            });
        });
        
        console.log('Competency data loaded successfully', window.competencyData);
        
        // Populate the competency dropdowns with all available competencies
        populateAllCompetencies();
        
        // Update dropdown to disable ranks without data
        updateRankDropdownState();
    } catch (error) {
        console.error('Error loading competency data:', error);
        // Fallback to empty data structure
        window.competencyData = {};
        Object.values(rankMapping).forEach(rankCode => {
            window.competencyData[rankCode] = {
                name: rankCode.toUpperCase(),
                fullName: rankDisplayNames[rankCode],
                competencies: []
            };
        });
        
        // Update dropdown even on error
        updateRankDropdownState();
    }
}

// Function to load and parse inclusive behaviours JSONL data
async function loadInclusiveBehavioursData() {
    try {
        const response = await fetch('/ai-tools/core-services/pace-report-writer/inclusive-behaviours.jsonl');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        // Parse each JSONL line
        const rawData = lines.map(line => JSON.parse(line));
        
        // Transform data into meta-competency-indexed structure
        window.inclusiveBehavioursData = {};
        
        rawData.forEach(item => {
            const metaCompetencyName = item.MetaCompetency;
            const definition = item.Definition;
            const behaviours = item.InclusiveBehaviours;
            const frequencyScale = item.FrequencyScale;
            
            window.inclusiveBehavioursData[metaCompetencyName] = {
                definition: definition,
                behaviours: behaviours,
                frequencyScale: frequencyScale
            };
        });
        
        console.log('Inclusive behaviours (meta-competencies) data loaded successfully', window.inclusiveBehavioursData);
    } catch (error) {
        console.error('Error loading inclusive behaviours data:', error);
        window.inclusiveBehavioursData = {};
    }
}

// Function to populate competency dropdowns with all available competencies from JSONL
function populateAllCompetencies() {
    const comp1 = document.getElementById('competency1');
    const comp2 = document.getElementById('competency2');
    const comp3 = document.getElementById('competency3');
    
    if (!comp1 || !comp2 || !comp3) {
        console.warn('Competency dropdowns not found');
        return;
    }
    
    // Collect all unique competencies across all ranks
    const allCompetencies = new Set();
    
    Object.values(window.competencyData).forEach(rankData => {
        if (rankData.competencies && rankData.competencies.length > 0) {
            rankData.competencies.forEach(category => {
                category.facets.forEach(facet => {
                    allCompetencies.add(`${category.category} -> ${facet.name}`);
                });
            });
        }
    });
    
    // Sort competencies alphabetically
    const sortedCompetencies = Array.from(allCompetencies).sort();
    
    // Build options HTML
    let optionsHTML = '';
    sortedCompetencies.forEach(comp => {
        const displayComp = comp.replace(' -> ', ' → ');
        optionsHTML += `<option value="${comp}">${displayComp}</option>`;
    });
    
    // Populate all three dropdowns
    comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>' + optionsHTML;
    comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>' + optionsHTML;
    comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>' + optionsHTML;
    
    console.log(`Populated competency dropdowns with ${sortedCompetencies.length} competencies`);
}

// Function to disable ranks without competency data in the dropdown
function updateRankDropdownState() {
    const rankSelect = document.getElementById('rankSelect');
    if (!rankSelect) return;
    
    const options = rankSelect.querySelectorAll('option[value]');
    
    options.forEach(option => {
        const rankCode = option.value;
        if (!rankCode) return; // Skip the "-- Select Rank --" option
        
        const rankData = window.competencyData[rankCode];
        const hasData = rankData && rankData.competencies && rankData.competencies.length > 0;
        
        if (!hasData) {
            option.disabled = true;
            option.textContent = option.textContent + ' (Data not available)';
            option.style.color = '#888';
        } else {
            option.disabled = false;
            // Remove any "(Data not available)" suffix if it exists
            option.textContent = option.textContent.replace(' (Data not available)', '');
            option.style.color = '';
        }
    });
}

// Legacy structure kept for backward compatibility (will be replaced by JSONL data)
if (!window.competencyData) {
    window.competencyData = {};
}

// Modal functions for Competency Framework
window.openFrameworkModal = function() {
    console.log('openFrameworkModal called');
    console.log('Document body:', document.body);
    console.log('Searching for frameworkModal...');
    const modal = document.getElementById('frameworkModal');
    console.log('Modal element:', modal);
    console.log('All elements with class modal:', document.querySelectorAll('.modal'));
    if (modal) {
        console.log('Adding active class and setting display to flex');
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible');
    } else {
        console.error('frameworkModal element not found!');
        console.log('Checking all IDs in document:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    }
};

window.closeFrameworkModal = function() {
    const modal = document.getElementById('frameworkModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Modal functions for References
window.openReferencesModal = function() {
    console.log('openReferencesModal called');
    const modal = document.getElementById('referencesModal');
    console.log('Modal element:', modal);
    if (modal) {
        console.log('Adding active class and setting display to flex');
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible');
    } else {
        console.error('referencesModal element not found!');
    }
};

window.closeReferencesModal = function() {
    const modal = document.getElementById('referencesModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const frameworkModal = document.getElementById('frameworkModal');
    const referencesModal = document.getElementById('referencesModal');
    
    if (event.target === frameworkModal) {
        closeFrameworkModal();
    }
    if (event.target === referencesModal) {
        closeReferencesModal();
    }
});

// Close modals with Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeFrameworkModal();
        closeReferencesModal();
    }
});

// Update Competency Framework based on rank selection
window.updateCompetencyFramework = function() {
    const rankSelect = document.getElementById('rankSelect');
    const selectedRank = rankSelect.value;
    const frameworkContent = document.getElementById('competencyFrameworkContent');
    const rankWarning = document.getElementById('rankWarning');
    const comp1 = document.getElementById('competency1');
    const comp2 = document.getElementById('competency2');
    const comp3 = document.getElementById('competency3');
    
    if (!selectedRank) {
        // Hide warning when no rank selected
        if (rankWarning) {
            rankWarning.style.display = 'none';
        }
        if (frameworkContent) {
            frameworkContent.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px 20px;">Please select a rank from the dropdown above to load the competency framework.</p>';
        }
        // Reset competency selectors
        if (comp1) comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>';
        if (comp2) comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>';
        if (comp3) comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>';
        return;
    }
    
    const rankData = window.competencyData[selectedRank];
    
    if (!rankData || !rankData.competencies || rankData.competencies.length === 0) {
        // Show warning under rank selection
        if (rankWarning) {
            rankWarning.innerHTML = `
                <div style="background: rgba(255, 180, 50, 0.1); border: 2px solid #ffb432; border-radius: 8px; padding: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">⚠️</span>
                        <div>
                            <strong style="color: #ffb432;">Competency Data Not Yet Available</strong><br>
                            <span style="color: #e0e0e0; font-size: 0.9em;">The competency framework for <strong>${rankData.fullName}</strong> is being prepared. You can still generate reports using the AI's knowledge.</span>
                        </div>
                    </div>
                </div>
            `;
            rankWarning.style.display = 'block';
        }
        if (frameworkContent) {
            frameworkContent.innerHTML = '<p style="text-align: center; color: #aaa; padding: 20px;">Competency framework will be available soon.</p>';
        }
        // Reset competency selectors
        if (comp1) comp1.innerHTML = '<option value="">-- Optional: Select 1st Competency --</option>';
        if (comp2) comp2.innerHTML = '<option value="">-- Optional: Select 2nd Competency --</option>';
        if (comp3) comp3.innerHTML = '<option value="">-- Optional: Select 3rd Competency --</option>';
        return;
    }
    
    // Hide warning and show success message
    if (rankWarning) {
        rankWarning.innerHTML = `
            <div style="background: rgba(107, 255, 107, 0.1); border: 2px solid #6bff6b; border-radius: 8px; padding: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2em;">✅</span>
                    <span style="color: #6bff6b; font-weight: 500;">Loaded ${rankData.fullName} </span>
                </div>
            </div>
        `;
        rankWarning.style.display = 'block';
    }
    
    // Build the framework HTML with behavioral indicators
    let html = '';
    
    rankData.competencies.forEach((category, index) => {
        html += '<div class="competency-category">';
        html += `<h4>${index + 1}. ${category.category}</h4>`;
        
        category.facets.forEach(facet => {
            html += `<div style="margin-left: 15px; margin-bottom: 15px;">`;
            html += `<strong style="color: #ffa575;">${facet.name}</strong>`;
            html += '<ul style="margin-top: 5px;">';
            facet.indicators.forEach(indicator => {
                html += `<li style="color: #ccc; font-size: 0.9em;">${indicator}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        });
        
        html += '</div>';
    });
    
    if (frameworkContent) {
        frameworkContent.innerHTML = html;
    }
    
    // Update competency selectors with category and facet names
    let optionsHTML = '<option value="">-- Optional: Select Competency --</option>';
    rankData.competencies.forEach(category => {
        category.facets.forEach(facet => {
            optionsHTML += `<option value="${category.category} -> ${facet.name}">${category.category} → ${facet.name}</option>`;
        });
    });
    
    if (comp1) comp1.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 1st Competency --');
    if (comp2) comp2.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 2nd Competency --');
    if (comp3) comp3.innerHTML = optionsHTML.replace('-- Optional: Select Competency --', '-- Optional: Select 3rd Competency --');
};

// Main PaCE Report generation function
window.generatePaceReport = async function () {
    console.log('=== GENERATE PACE REPORT FUNCTION CALLED ===');
    
    // Hide previous results/errors
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
    
    // Get form values
    const rankSelect = document.getElementById('rankSelect').value;
    const jobTrade = document.getElementById('jobTrade')?.value.trim() || '';
    const eventDescription = document.getElementById('eventDescription').value.trim();
    const competency1 = document.getElementById('competency1').value;
    const competency2 = document.getElementById('competency2').value;
    const competency3 = document.getElementById('competency3').value;
    const includeCCG = document.getElementById('ccgToggle')?.checked || false;
    const includeAnalysis = document.getElementById('analysisToggle')?.checked || false;
    const includeMetaCompetency = document.getElementById('metaCompetencyToggle')?.checked || false;
    const includeMetaCompetencyDetailed = document.getElementById('metaCompetencyDetailedToggle')?.checked || false;
    const competencyCount = parseInt(document.getElementById('competencyCount')?.value) || 3;
    
    // Validation
    if (!rankSelect) {
        utils.showError(document.getElementById('errorDiv'), 'Please select the member\'s rank from the dropdown.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Get rank data
    const rankData = window.competencyData[rankSelect];
    if (!rankData) {
        utils.showError(document.getElementById('errorDiv'), 'Invalid rank selected.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Check if rank has competency data
    if (!rankData.competencies || rankData.competencies.length === 0) {
        utils.showError(document.getElementById('errorDiv'), `Competency data for ${rankData.fullName} is not yet available. Please select a different rank with available data.`);
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    if (!eventDescription) {
        utils.showError(document.getElementById('errorDiv'), 'Please provide an event description.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    // Collect user-selected competencies (remove duplicates)
    const selectedCompetencies = [competency1, competency2, competency3]
        .filter(c => c && c.trim() !== '');
    
    // Check for duplicates
    const uniqueCompetencies = [...new Set(selectedCompetencies)];
    if (selectedCompetencies.length !== uniqueCompetencies.length) {
        utils.showError(document.getElementById('errorDiv'), 'Please select different competencies. Duplicates are not allowed.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }
    
    console.log('Form values validated:', {
        rank: rankData.fullName,
        eventDescriptionLength: eventDescription.length,
        selectedCompetencies: uniqueCompetencies
    });
    
    // Build competency framework string for AI prompt with behavioral indicators
    let competencyFramework = '';
    if (rankData.competencies && rankData.competencies.length > 0) {
        competencyFramework = `\nRANK-SPECIFIC COMPETENCY FRAMEWORK FOR ${rankData.fullName.toUpperCase()}:\n`;
        competencyFramework += `(Select 3-5 most relevant competencies from the following framework based on the behavioral indicators)\n\n`;
        
        rankData.competencies.forEach((category, index) => {
            competencyFramework += `${index + 1}. ${category.category}:\n`;
            category.facets.forEach(facet => {
                competencyFramework += `\n   ${facet.name}:\n`;
                competencyFramework += `   Behavioral Indicators for ${rankData.fullName}:\n`;
                facet.indicators.forEach(indicator => {
                    competencyFramework += `   • ${indicator}\n`;
                });
            });
            competencyFramework += '\n';
        });
    } else {
        // Fallback to generic framework if rank-specific data not available
        competencyFramework = `\nGENERIC COMPETENCY FRAMEWORK (Rank-specific framework not yet available for ${rankData.fullName}):\n`;
        competencyFramework += `1. Communication: Oral Communication, Written Communication, Tailored Communication, Active Listening\n`;
        competencyFramework += `2. Personal Development: Self-Development, Adaptability, Resilience, Self-Awareness\n`;
        competencyFramework += `3. Leadership: Team Leadership, Decision Making, Mentorship, Influence\n`;
        competencyFramework += `4. Teamwork: Collaboration, Cooperation, Conflict Resolution, Building Relationships\n`;
        competencyFramework += `5. Technical/Professional Competence: Technical Expertise, Problem Solving, Innovation, Quality Focus\n`;
        competencyFramework += `6. Military Ethos: Discipline, Integrity, Loyalty, Professionalism\n`;
        competencyFramework += `7. Strategic Thinking: Vision, Planning, Risk Assessment, Resource Management\n`;
        competencyFramework += `8. Change Management: Initiative, Innovation Implementation, Continuous Improvement, Change Leadership\n`;
    }
    
    // Build meta-competency framework based on toggle states
    let metaCompetencyFramework = '';
    if ((includeMetaCompetency || includeMetaCompetencyDetailed) && window.inclusiveBehavioursData) {
        metaCompetencyFramework = `\n\nMETA-COMPETENCIES FOR POTENTIAL ASSESSMENT (Next Rank Level):\n`;
        metaCompetencyFramework += `Potential is a member's readiness to perform at the next rank. Evaluate five meta-competencies with inclusive behaviours.\n\n`;
        
        Object.keys(window.inclusiveBehavioursData).forEach((metaCompetency, index) => {
            const data = window.inclusiveBehavioursData[metaCompetency];
            metaCompetencyFramework += `${index + 1}. ${metaCompetency}\n`;
            
            // Only include detailed information if detailed toggle is enabled
            if (includeMetaCompetencyDetailed) {
                metaCompetencyFramework += `   Definition: ${data.definition}\n\n`;
                metaCompetencyFramework += `   Inclusive Behaviours:\n`;
                data.behaviours.forEach(behaviour => {
                    metaCompetencyFramework += `   • ${behaviour}\n`;
                });
                metaCompetencyFramework += `\n   Frequency Scale:\n`;
                metaCompetencyFramework += `   • Rarely (Unexploited): ${data.frequencyScale.Rarely}\n`;
                metaCompetencyFramework += `   • Occasionally (Developing): ${data.frequencyScale.Occasionally}\n`;
                metaCompetencyFramework += `   • Frequently (Consolidating): ${data.frequencyScale.Frequently}\n`;
                metaCompetencyFramework += `   • Consistently (Mastered): ${data.frequencyScale.Consistently}\n`;
            }
            metaCompetencyFramework += '\n';
        });
    }
    
    // Build the AI prompt
    let systemPrompt = `You are a professional Canadian Armed Forces (CAF) PaCE (Performance and Career Evaluation) report writer with expertise in the CAF competency framework. You help members create structured, professional performance evaluations that highlight their achievements using appropriate competencies.

Your task is to analyze the provided event description and generate a PaCE report following this EXACT format:

## PaCE Report

### Member Information
- **Rank/Position:** ${rankData.fullName}${jobTrade ? `\n- **Military Occupation/Trade:** ${jobTrade}` : ''}

### Event Summary
**Event Title:** [2-5 word capitalized summary of the event, e.g., "OPERATIONAL READINESS TRAINING EXERCISE" or "LEADERSHIP MENTORSHIP PROGRAM"]

**Relevant Competencies:**
[List EXACTLY ${competencyCount} competencies in this EXACT format - each competency MUST include both category and specific competency name:
"1. [Category Name] -> [Specific Competency Name]"
"2. [Category Name] -> [Specific Competency Name]"
etc.

CRITICAL: Do NOT list only category names. ALWAYS include the arrow (->) and the specific competency name.
Example CORRECT format: "1. Leadership -> Team Building"
Example INCORRECT format: "1. Leadership" (missing specific competency)
]

**Performance Summary:**
[Provide a 2-3 sentence summary of the member's performance during the evaluation period, focusing on key actions and contributions${jobTrade ? `. Consider how this event relates to their ${jobTrade} occupation` : ''}]

### Event Outcome
[Describe the tangible outcome or impact of the member's actions on individual, team, unit, or organizational performance. Include measurable results where possible. Focus on what was achieved or improved.]

${includeCCG ? `

**Assessment Context (CCG):**
- **Complexity:** [Low/Medium/High - based on task difficulty and scope${jobTrade ? `. Consider: tasks within normal ${jobTrade} scope are typically Low-Medium; tasks significantly outside ${jobTrade} responsibilities (e.g., an Armored soldier developing software) are High complexity due to requiring skills beyond primary trade` : ''}]
- **Consistency:** [Occasional/Frequent/Sustained - based on performance patterns]
- **Guidance:** [Independent/Minimum/Moderate/Close - level of supervision needed]` : ''}

${includeAnalysis ? `

### Competency Analysis
[For EACH competency listed in Event Summary, provide a detailed paragraph explaining:
- How the member specifically demonstrated this competency during the event
- Concrete examples from the event description that showcase the competency in action
- The impact or significance of demonstrating this competency]` : ''}

${includeMetaCompetency && !includeMetaCompetencyDetailed ? `

### Meta-Competency Assessment (Next Rank Potential)
[Identify which of the five meta-competencies (Expertise, Cognitive Capacities, Social Capacities, Change Capacities, Professional Ideology) are relevant to this event. List only the names of relevant meta-competencies.

**Relevant Meta-Competencies:**
- [List each relevant meta-competency name]

Note: Only list meta-competencies where clear evidence exists in the event description.]` : ''}

${includeMetaCompetencyDetailed ? `

### Meta-Competency Assessment (Next Rank Potential)
[Conduct detailed assessment of member's readiness to perform at the next rank level by evaluating each of the five meta-competencies. For each meta-competency that was demonstrated:

1. **Meta-Competency Name** (e.g., Expertise, Cognitive Capacities, Social Capacities, Change Capacities, Professional Ideology)
   - **Definition:** [Provide the definition of this meta-competency]
   - **Frequency Assessment:** [Rarely/Occasionally/Frequently/Consistently]
   - **Inclusive Behaviours Demonstrated:** List specific inclusive behaviours from the framework that were evident
   - **Evidence from Event:** Concrete examples showing demonstration at next rank level
   - **Impact:** How these behaviours contribute to readiness for next rank

Note: Only assess meta-competencies where clear evidence exists in the event description. If insufficient evidence for a meta-competency, note "Insufficient evidence to assess at next rank level."]` : ''}

${uniqueCompetencies.length > 0 ? `

### Competency Selection Rationale
List ${uniqueCompetencies.join(', ')}

If you chose DIFFERENT competencies than the member's selections, provide a brief explanation for each pre-selected competency that you did NOT include in the final report, explaining why it was not the best fit for this specific event. If you used all of the member's selections, state that they were appropriate and briefly explain why.` : ''}
${competencyFramework}
${metaCompetencyFramework}
IMPORTANT GUIDELINES:
- **CRITICAL FORMATTING RULE:** When listing competencies under "Relevant Competencies", you MUST use the format "1. [Category Name] -> [Specific Competency Name]". NEVER list only the category name without the specific competency.
- Select exactly ${competencyCount} competencies that are MOST relevant to the event description, listed in order of priority (most relevant first)
- Each competency listed MUST include BOTH the category AND the specific competency name separated by an arrow (->)
- Use the rank-specific competency framework provided above to identify both category names and specific competency names${jobTrade ? `
- **Military Occupation Context:** The member's trade is ${jobTrade}. When assessing complexity, consider whether tasks align with typical ${jobTrade} responsibilities or demonstrate versatility beyond their primary role. Tasks outside normal trade scope indicate higher complexity and broader capability.` : ''}
- Use proper markdown formatting with headers (##, ###) and bullet points
- Be specific and provide concrete examples
- Focus on measurable outcomes and impacts
- Maintain professional military tone
- Follow the EXACT format template provided above - do not add or remove sections
- Ensure every section follows the template structure precisely${includeCCG ? `
- Assess CCG (Complexity, Consistency, Guidance) realistically based on the event description${jobTrade ? `. For Complexity: tasks within ${jobTrade} normal duties = Low-Medium; tasks significantly outside ${jobTrade} scope = High (demonstrates exceptional versatility and learning agility)` : ''}` : ''}${includeAnalysis ? `
- Provide detailed competency demonstration analysis with concrete examples from the event
- Ensure the Competency Analysis section analyzes EACH competency listed in the Event Summary` : `
- DO NOT include a "Competency Analysis" section - only provide the Event Outcome`}${includeMetaCompetency && !includeMetaCompetencyDetailed ? `
- Identify which of the five meta-competencies are relevant to this event for next-rank readiness
- List only the meta-competency names without detailed descriptions
- Only identify meta-competencies with clear evidence from the event description` : ''}${includeMetaCompetencyDetailed ? `
- Assess member's potential for next rank using the five meta-competencies framework with detailed analysis
- Include definitions, frequency ratings (Rarely/Occasionally/Frequently/Consistently), and inclusive behaviours
- Identify specific inclusive behaviours demonstrated that support next-rank readiness
- Provide concrete evidence and impact assessment for each meta-competency
- Only assess meta-competencies with clear evidence from the event description` : includeMetaCompetency ? '' : `
- DO NOT include a "Meta-Competency Assessment" section`}
- Ensure competencies selected match the responsibilities expected at the ${rankData.fullName} rank level
- Follow the EXACT format template provided above - do not add or remove sections`;

    let userPrompt = `**Event Description:**\n${eventDescription}\n\n`;
    
    if (jobTrade) {
        userPrompt += `**Member's Military Occupation/Trade:**\n${jobTrade}\n\n`;
        userPrompt += `Context: Use this occupation to assess task complexity and relevance. Tasks aligned with ${jobTrade} duties show normal competency development. Tasks significantly outside ${jobTrade} scope demonstrate exceptional versatility, learning agility, and higher complexity (e.g., an Armored soldier developing software, an Infantry member doing supply chain analysis).\n\n`;
    }
    
    if (uniqueCompetencies.length > 0) {
        userPrompt += `**Member's Pre-Selected Competencies:**\n${uniqueCompetencies.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n`;
        userPrompt += `Note: Evaluate whether these pre-selected competencies are the best fit. If not, choose more appropriate ones and explain why the pre-selected ones were not optimal for this specific event.\n\n`;
    }
    
    userPrompt += `Please generate a complete PaCE report following the exact format specified in your system instructions.\n\n`;
    userPrompt += `REMINDER: Under "Relevant Competencies" section, you MUST format each competency as:\n`;
    userPrompt += `"1. [Category Name] -> [Specific Competency Name]"\n`;
    userPrompt += `"2. [Category Name] -> [Specific Competency Name]"\n`;
    userPrompt += `Do NOT write only the category name without the specific competency.`;
    
    console.log('Prompt prepared');
    
    // Show loading indicator
    utils.showLoading(
        document.getElementById('loadingDiv'),
        'Analyzing event and generating PaCE report...'
    );
    document.getElementById('loadingDiv').style.display = 'block';
    
    try {
        console.log('Making API request...');
        
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ];
        
        // Make the API request
        const response = await apiManager.makeRequest(messages, {
            maxTokens: 3000,
            temperature: 0.4 // Moderate temperature for professional but tailored output
        });
        
        console.log('API response received, length:', response ? response.length : 0);
        
        // Hide loading
        document.getElementById('loadingDiv').style.display = 'none';
        
        if (response && response.length > 0) {
            currentResult = response;
            console.log('Result stored, length:', currentResult.length);
            
            // Use centralized formatMarkdown from utils
            document.getElementById('resultContent').innerHTML = utils.formatMarkdown(currentResult);
            document.getElementById('resultDiv').style.display = 'block';
            
            // Set content for download manager
            window.downloadManager.setContent(currentResult, 'markdown');
            
            // Scroll to results
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            throw new Error('No content received from AI');
        }
        
    } catch (error) {
        console.error('Error generating PaCE report:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        
        let errorMessage = 'Failed to generate PaCE report. ';
        if (error.message.includes('API key')) {
            errorMessage += 'Please check your API key configuration in the AI Settings.';
        } else if (error.message.includes('rate limit')) {
            errorMessage += 'Rate limit reached. Please try again in a moment.';
        } else if (error.message.includes('timeout')) {
            errorMessage += 'Request timed out. Please try again.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        
        utils.showError(document.getElementById('errorDiv'), errorMessage);
        document.getElementById('errorDiv').style.display = 'block';
    }
};

// Toggle visibility of optional competency selectors
window.toggleCompetencySelectors = function() {
    const container = document.getElementById('competencySelectors');
    const toggle = document.getElementById('competencyToggle');
    if (!container || !toggle) return;
    const show = !!toggle.checked;
    container.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    // If hiding, clear any selected values
    if (!show) {
        ['competency1','competency2','competency3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }
};

// Toggle visibility of CCG info
window.toggleCCG = function() {
    const infoDiv = document.getElementById('ccgInfo');
    const toggle = document.getElementById('ccgToggle');
    console.log('toggleCCG called', {infoDiv, toggle, checked: toggle?.checked});
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    console.log('CCG toggled to:', show);
};

// Toggle visibility of competency analysis info
window.toggleAnalysis = function() {
    const infoDiv = document.getElementById('analysisInfo');
    const toggle = document.getElementById('analysisToggle');
    console.log('toggleAnalysis called', {infoDiv, toggle, checked: toggle?.checked});
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    console.log('Analysis toggled to:', show);
};

// Toggle visibility of meta-competency options
window.toggleMetaCompetency = function() {
    const optionsDiv = document.getElementById('metaCompetencyOptions');
    const toggle = document.getElementById('metaCompetencyToggle');
    const detailedToggle = document.getElementById('metaCompetencyDetailedToggle');
    
    if (!optionsDiv || !toggle) return;
    
    const show = !!toggle.checked;
    optionsDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
    
    // If hiding primary toggle, also hide and uncheck secondary toggle
    if (!show && detailedToggle) {
        detailedToggle.checked = false;
        toggleMetaCompetencyDetailed();
    }
};

// Toggle visibility of detailed meta-competency analysis
window.toggleMetaCompetencyDetailed = function() {
    const infoDiv = document.getElementById('metaCompetencyDetailedInfo');
    const toggle = document.getElementById('metaCompetencyDetailedToggle');
    if (!infoDiv || !toggle) return;
    const show = !!toggle.checked;
    infoDiv.style.display = show ? 'block' : 'none';
    toggle.setAttribute('aria-expanded', show.toString());
};
