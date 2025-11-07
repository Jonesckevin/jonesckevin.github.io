document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    console.log('PowerBI DAX Builder: DOMContentLoaded event fired');

    // Create safety overlay dynamically if it doesn't exist
    const existingOverlay = document.getElementById('safetyOverlay');
    console.log('Checking for existing overlay:', existingOverlay ? 'FOUND' : 'NOT FOUND');

    if (!existingOverlay) {
        console.log('Creating safety overlay dynamically...');
        const overlayHTML = `
            <div class="safety-overlay" id="safetyOverlay">
                <div class="safety-popup" id="safetyPopup">
                    <div class="popup-header">
                        <div class="popup-title">
                            <span class="warning-icon">⚠️</span>
                            <strong>Important Safety Notice</strong>
                        </div>
                    </div>
                    <div class="popup-content">
                        <p><strong>Always test generated DAX formulas in a development environment first.</strong></p>
                        <ul>
                            <li>Never apply untested DAX directly to production reports</li>
                            <li>Review and validate all generated code before use</li>
                            <li>Test performance impact on large datasets</li>
                            <li>Verify calculated results match expected business logic</li>
                            <li>Check filter contexts and relationships are correct</li>
                            <li>Consider data refresh performance implications</li>
                        </ul>
                        <div class="popup-actions">
                            <button class="btn-acknowledge" onclick="dismissSafetyNotice()">I Understand - Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);

        const verifyOverlay = document.getElementById('safetyOverlay');
        if (verifyOverlay) {
            console.log('✅ Safety overlay created successfully and verified in DOM');
        } else {
            console.error('❌ Safety overlay creation FAILED - element not in DOM!');
        }
    } else {
        console.log('✅ Safety overlay already exists in HTML');
    }

    // Define functions first before assigning to window
    function showSafetyNotice() {
        console.log('showSafetyNotice called, searching for overlay...');
        let overlay = document.getElementById('safetyOverlay');

        // If overlay doesn't exist, create it now
        if (!overlay) {
            console.warn('Overlay not found, creating it now...');
            const overlayHTML = `
                <div class="safety-overlay" id="safetyOverlay">
                    <div class="safety-popup" id="safetyPopup">
                        <div class="popup-header">
                            <div class="popup-title">
                                <span class="warning-icon">⚠️</span>
                                <strong>Important Safety Notice</strong>
                            </div>
                        </div>
                        <div class="popup-content">
                            <p><strong>Always test generated DAX formulas in a development environment first.</strong></p>
                            <ul>
                                <li>Never apply untested DAX directly to production reports</li>
                                <li>Review and validate all generated code before use</li>
                                <li>Test performance impact on large datasets</li>
                                <li>Verify calculated results match expected business logic</li>
                                <li>Check filter contexts and relationships are correct</li>
                                <li>Consider data refresh performance implications</li>
                            </ul>
                            <div class="popup-actions">
                                <button class="btn-acknowledge" onclick="dismissSafetyNotice()">I Understand - Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', overlayHTML);
            console.log('Overlay created in showSafetyNotice');

            // Try to get it again
            overlay = document.getElementById('safetyOverlay');
            if (!overlay) {
                console.error('CRITICAL: Still cannot find overlay after creation!');
                console.log('document.body:', document.body);
                console.log('document.body.innerHTML length:', document.body.innerHTML.length);
                return;
            }
        }

        console.log('Overlay found, adding show class');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function dismissSafetyNotice() {
        const overlay = document.getElementById('safetyOverlay');
        const toggleBtn = document.getElementById('safetyToggleBtn');

        if (!overlay) {
            // Silently exit if overlay doesn't exist
            return;
        }

        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling

        // Show the toggle button if it exists
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
        }

        // Store acknowledgment in localStorage
        localStorage.setItem('daxBuilder_safetyAcknowledged', 'true');
        localStorage.setItem('daxBuilder_safetyAcknowledgedDate', new Date().toISOString());
    }

    function checkSafetyNoticeStatus() {
        const acknowledged = localStorage.getItem('daxBuilder_safetyAcknowledged');
        const acknowledgedDate = localStorage.getItem('daxBuilder_safetyAcknowledgedDate');
        const toggleBtn = document.getElementById('safetyToggleBtn');

        // If acknowledged within last 7 days, show the toggle button instead
        if (acknowledged === 'true' && acknowledgedDate) {
            const daysSinceAck = (Date.now() - new Date(acknowledgedDate).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceAck < 7) {
                console.log(`Safety notice acknowledged ${Math.floor(daysSinceAck)} days ago, showing toggle button`);
                if (toggleBtn) {
                    toggleBtn.style.display = 'flex';
                }
                return;
            }
        }

        // Show safety notice on first visit or after 7 days
        console.log('First visit or acknowledgment expired, showing safety notice');
        setTimeout(showSafetyNotice, 500); // Small delay to ensure DOM is ready
    }

    function resetForm() {
        document.getElementById('daxBuilderForm').reset();
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('errorDiv').style.display = 'none';
        currentResult = '';
        console.log('Form reset');
    }

    // Global functions
    window.generateDAX = generateDAX;
    window.generateVariation = generateVariation;
    window.resetForm = resetForm;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.dismissSafetyNotice = dismissSafetyNotice;
    window.showSafetyNotice = showSafetyNotice;

    // Utility functions
    function highlightDAX(dax) {
        if (!dax) return '';
        
        // First, escape HTML entities to prevent XSS
        const escapeHTML = (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };
        
        let escapedDAX = escapeHTML(dax);
        
        // DAX syntax highlighting - order matters!
        const patterns = [
            // Comments first (to avoid highlighting keywords in comments)
            { regex: /(\/\/[^\n]*|--[^\n]*)/g, class: 'dax-comment' },
            // Multi-line comments
            { regex: /(\/\*[\s\S]*?\*\/)/g, class: 'dax-comment' },
            // Strings
            { regex: /("(?:[^"\\]|\\.)*")/g, class: 'dax-string' },
            { regex: /('(?:[^'\\]|\\.)*')/g, class: 'dax-string' },
            // Numbers
            { regex: /\b(\d+(?:\.\d+)?)\b/g, class: 'dax-number' },
            // Keywords
            { regex: /\b(CALCULATE|CALCULATETABLE|FILTER|ALL|ALLEXCEPT|ALLSELECTED|VALUES|DISTINCT|RELATED|RELATEDTABLE|EARLIER|EARLIEST|SUM|SUMX|AVERAGE|AVERAGEX|COUNT|COUNTA|COUNTROWS|COUNTX|MIN|MINX|MAX|MAXX|IF|SWITCH|AND|OR|NOT|TRUE|FALSE|BLANK|DIVIDE|VAR|RETURN|SELECTEDVALUE|HASONEVALUE|ISFILTERED|ISCROSSFILTERED|USERELATIONSHIP|CROSSFILTER|KEEPFILTERS|REMOVEFILTERS|DATEADD|DATESBETWEEN|DATESYTD|DATESMTD|DATESQTD|TOTALYTD|TOTALMTD|TOTALQTD|SAMEPERIODLASTYEAR|PARALLELPERIOD|PREVIOUSYEAR|PREVIOUSQUARTER|PREVIOUSMONTH|PREVIOUSDAY|FORMAT|CONCATENATE|CONCATENATEX|LEFT|RIGHT|MID|LEN|UPPER|LOWER|TRIM|REPLACE|SUBSTITUTE|SEARCH|FIND|IFERROR|ISERROR|ISBLANK|ISEMPTY|ISNUMBER|ISTEXT|ISLOGICAL|ISNONTEXT|IN|CONTAINS|CONTAINSSTRING|LOOKUPVALUE|RANKX|TOPN|SAMPLE|ADDCOLUMNS|SELECTCOLUMNS|SUMMARIZE|SUMMARIZECOLUMNS|GROUPBY|ROLLUP|ROLLUPADDISSUBTOTAL|ROLLUPGROUP|NATURALINNERJOIN|NATURALLEFTOUTERJOIN|UNION|INTERSECT|EXCEPT|DISTINCT|ROW|DATATABLE|GENERATESERIES|CALENDAR|CALENDARAUTO|CLOSINGBALANCEMONTH|CLOSINGBALANCEQUARTER|CLOSINGBALANCEYEAR|OPENINGBALANCEMONTH|OPENINGBALANCEQUARTER|OPENINGBALANCEYEAR)\b/gi, class: 'dax-keyword' }
        ];
        
        patterns.forEach(pattern => {
            escapedDAX = escapedDAX.replace(pattern.regex, `<span class="${pattern.class}">$1</span>`);
        });
        
        return escapedDAX;
    }

    function buildResponseHTML(sections, daxType, outputFormat, options) {
        let htmlContent = '';

        // Add main DAX code
        if (sections.dax) {
            htmlContent += `
                <div class="dax-code-block dax-${daxType}">
                    <pre class="dax-code">${highlightDAX(sections.dax)}</pre>
                </div>
            `;
        }

        // Add format string if available
        if (sections.format) {
            htmlContent += `
                <div class="format-string-block">
                    <h4>📋 Format String</h4>
                    <pre class="format-code">${sections.format}</pre>
                </div>
            `;
        }

        // Add explanation if available
        if (sections.explanation) {
            htmlContent += `
                <div class="explanation-block">
                    <h4>📖 Explanation</h4>
                    <div style="line-height: 1.7;">${utils.formatMarkdown(sections.explanation)}</div>
                </div>
            `;
        }

        // Add usage examples if available
        if (sections.examples) {
            htmlContent += `
                <div class="examples-block">
                    <h4>💡 Usage Examples</h4>
                    <div style="line-height: 1.7;">${utils.formatMarkdown(sections.examples)}</div>
                </div>
            `;
        }

        // Add alternative approaches if available
        if (options.includeAlternatives && sections.alternatives) {
            htmlContent += `
                <div class="alternatives-block">
                    <h4>🔄 Alternative Approaches</h4>
                    <div style="line-height: 1.7;">${utils.formatMarkdown(sections.alternatives)}</div>
                </div>
            `;
        }

        // Add performance tips if requested
        if (options.includePerformanceTips && sections.performance) {
            htmlContent += `
                <div class="performance-block">
                    <h4>⚡ Performance Optimization Tips</h4>
                    <div style="line-height: 1.7;">${utils.formatMarkdown(sections.performance)}</div>
                </div>
            `;
        }

        // Add best practices if requested
        if (options.includeBestPractices && sections.bestPractices) {
            htmlContent += `
                <div class="best-practices-block">
                    <h4>✅ Best Practices</h4>
                    <div style="line-height: 1.7;">${utils.formatMarkdown(sections.bestPractices)}</div>
                </div>
            `;
        }

        // Add test data if requested
        if (options.includeTestData && sections.testData) {
            htmlContent += `
                <div class="test-data-block">
                    <h4>🧪 Test Data</h4>
                    <pre class="dax-code">${highlightDAX(sections.testData)}</pre>
                </div>
            `;
        }

        // Add DAX Studio query if applicable
        if (sections.daxStudio) {
            htmlContent += `
                <div class="dax-studio-block">
                    <h4>🔍 DAX Studio Query</h4>
                    <pre class="dax-code">${highlightDAX(sections.daxStudio)}</pre>
                </div>
            `;
        }

        // Add Tabular Editor script if applicable
        if (sections.tabularEditor) {
            htmlContent += `
                <div class="tabular-editor-block">
                    <h4>🛠️ Tabular Editor Script</h4>
                    <pre class="code-block">${sections.tabularEditor}</pre>
                </div>
            `;
        }

        return htmlContent;
    }

    function getSystemPrompt(daxType, daxComplexity, timeIntelligence, aggregationType, filterContext, outputFormat, options) {
        let basePrompt = `You are an expert PowerBI developer and DAX specialist with deep knowledge of data modeling, performance optimization, and best practices. Generate comprehensive DAX solutions based on natural language descriptions.

DAX Type: ${daxType.toUpperCase()}
Complexity Level: ${daxComplexity}
Time Intelligence: ${timeIntelligence}
Aggregation Type: ${aggregationType}
Filter Context: ${filterContext}
Output Format: ${outputFormat}

Core Requirements:
1. Generate syntactically correct DAX code following PowerBI conventions
2. Use appropriate DAX functions and patterns for the specified type
3. Apply proper filter context management
4. Follow DAX naming conventions (PascalCase for measures, no spaces)
${options.optimizePerformance ? '5. Optimize for query performance and formula engine efficiency' : ''}
${options.includeErrorHandling ? '6. Include proper error handling with IFERROR or conditional logic' : ''}
${options.includeComments ? '7. Add inline comments explaining complex logic' : ''}
${options.includeFormatting ? '8. Include appropriate FORMAT strings for measure formatting' : ''}`;

        // Add type-specific instructions
        switch (daxType) {
            case 'measure':
                basePrompt += `\n\nMeasure-Specific Requirements:
- Create an implicit measure that evaluates in any filter context
- Use CALCULATE for filter modifications when needed
- Ensure measure works correctly with slicers and visual filters
- Handle BLANK values appropriately
- Consider row-level vs filter context`;
                break;

            case 'calculated-column':
                basePrompt += `\n\nCalculated Column Requirements:
- Create a row context formula that evaluates row-by-row
- Use RELATED/RELATEDTABLE for cross-table references
- Consider storage and refresh performance implications
- Warn if a measure would be more appropriate`;
                break;

            case 'calculated-table':
                basePrompt += `\n\nCalculated Table Requirements:
- Create a complete table with proper column definitions
- Use appropriate table functions (SUMMARIZE, ADDCOLUMNS, etc.)
- Consider storage implications and refresh performance
- Document use cases and relationships`;
                break;

            case 'visual-filter':
            case 'page-filter':
            case 'report-filter':
                basePrompt += `\n\nFilter Requirements:
- Create boolean expressions that evaluate to TRUE/FALSE
- Handle BLANK and NULL values properly
- Optimize for filter context evaluation
- Consider interaction with other filters`;
                break;

            case 'row-level-security':
                basePrompt += `\n\nRow-Level Security Requirements:
- Create boolean expressions for security rules
- Use USERNAME() or USERPRINCIPALNAME() functions
- Test with different user contexts
- Consider performance impact on large datasets
- Include security best practices`;
                break;

            case 'calculation-group':
                basePrompt += `\n\nCalculation Group Requirements:
- Create calculation items with SELECTEDMEASURE()
- Handle format string expressions
- Consider precedence and interaction with other measures
- Include documentation for business users`;
                break;
        }

        // Add time intelligence instructions if applicable
        if (timeIntelligence !== 'none') {
            basePrompt += `\n\nTime Intelligence Requirements:
- Use appropriate time intelligence functions (DATESYTD, TOTALYTD, etc.)
- Ensure a proper date table is referenced
- Handle missing dates and partial periods
- Consider fiscal vs calendar year requirements`;
        }

        // Add format-specific instructions
        switch (outputFormat) {
            case 'dax-with-explanation':
                basePrompt += `\n\nProvide the DAX code and include a brief explanation section.`;
                break;

            case 'dax-with-examples':
                basePrompt += `\n\nProvide the DAX code and include usage examples.`;
                break;

            case 'complete-solution':
                basePrompt += `\n\nProvide a complete solution with DAX code, supporting measures if needed, and brief documentation.`;
                break;

            case 'multiple-variations':
                basePrompt += `\n\nProvide multiple variations of the DAX code with brief descriptions.`;
                break;

            case 'dax-studio':
                basePrompt += `\n\nFormat for DAX Studio with EVALUATE statement.`;
                break;

            case 'tabular-editor':
                basePrompt += `\n\nFormat as Tabular Editor C# script.`;
                break;
        }

        basePrompt += `\n\nIMPORTANT - Response Format:
- Always start with the DAX code in a \`\`\`dax code block
- Only include additional sections if specifically requested via options
- Keep responses concise and code-focused
- Do NOT include explanations, tips, or best practices unless the following options are enabled:`;

        const enabledSections = [];
        if (options.includeFormatting) enabledSections.push('Format String');
        if (options.includeAlternatives) enabledSections.push('Alternative Approaches');
        if (options.includePerformanceTips) enabledSections.push('Performance Tips');
        if (options.includeBestPractices) enabledSections.push('Best Practices');
        if (options.includeTestData) enabledSections.push('Test Data');

        if (enabledSections.length > 0) {
            basePrompt += `\n\nEnabled optional sections:\n${enabledSections.map(s => `- ${s}`).join('\n')}`;
        } else {
            basePrompt += `\n- NONE - Only provide the DAX code`;
        }

        basePrompt += `\n\nEnsure all code is production-ready and follows DAX best practices.`;

        return basePrompt;
    }

    function parseResponse(response, outputFormat) {
        const sections = {
            dax: '',
            format: '',
            explanation: '',
            examples: '',
            alternatives: '',
            performance: '',
            bestPractices: '',
            testData: '',
            daxStudio: '',
            tabularEditor: ''
        };

        // Extract DAX code blocks
        const daxBlocks = response.match(/```dax([\s\S]*?)```/gi);
        if (daxBlocks && daxBlocks[0]) {
            sections.dax = daxBlocks[0].replace(/```dax\n?/i, '').replace(/```$/, '').trim();
        }

        // Try to extract from generic code blocks if no DAX-specific blocks
        if (!sections.dax) {
            const codeBlocks = response.match(/```([\s\S]*?)```/gi);
            if (codeBlocks && codeBlocks[0]) {
                const codeContent = codeBlocks[0].replace(/```[a-z]*\n?/i, '').replace(/```$/, '').trim();
                // Check if it looks like DAX (contains common DAX keywords)
                if (/\b(CALCULATE|SUM|AVERAGE|FILTER|ALL|VALUES|RELATED)\b/i.test(codeContent)) {
                    sections.dax = codeContent;
                }
            }
        }

        // Extract format string
        const formatMatch = response.match(/Format String:?\s*[`"]([^`"]+)[`"]/i) ||
            response.match(/FORMAT\s*=\s*["]([^"]+)["]/i);
        if (formatMatch) {
            sections.format = formatMatch[1];
        }

        // Extract explanation section
        const explanationMatch = response.match(/(?:Explanation|What it does|Description):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Usage|Alternative|Performance|Best Practices)|$)/i);
        if (explanationMatch) {
            sections.explanation = explanationMatch[1].trim();
        }

        // Extract examples
        const examplesMatch = response.match(/(?:Usage Examples|Examples|How to Use):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Alternative|Performance|Best Practices)|$)/i);
        if (examplesMatch) {
            sections.examples = examplesMatch[1].trim();
        }

        // Extract alternatives
        const alternativesMatch = response.match(/(?:Alternative Approaches|Alternatives|Other Methods):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Performance|Best Practices|Test Data)|$)/i);
        if (alternativesMatch) {
            sections.alternatives = alternativesMatch[1].trim();
        }

        // Extract performance tips
        const performanceMatch = response.match(/(?:Performance Tips|Optimization|Performance):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Best Practices|Test Data)|$)/i);
        if (performanceMatch) {
            sections.performance = performanceMatch[1].trim();
        }

        // Extract best practices
        const bestPracticesMatch = response.match(/(?:Best Practices|Recommendations|Guidelines):?\s*([\s\S]*?)(?=\n##|\n\*\*Test Data|$)/i);
        if (bestPracticesMatch) {
            sections.bestPractices = bestPracticesMatch[1].trim();
        }

        // Extract test data
        if (daxBlocks && daxBlocks.length > 1) {
            sections.testData = daxBlocks[1].replace(/```dax\n?/i, '').replace(/```$/, '').trim();
        }

        // Extract DAX Studio query
        if (outputFormat === 'dax-studio') {
            const daxStudioMatch = response.match(/EVALUATE[\s\S]*?(?=```|$)/i);
            if (daxStudioMatch) {
                sections.daxStudio = daxStudioMatch[0].trim();
            }
        }

        // Extract Tabular Editor script
        if (outputFormat === 'tabular-editor') {
            const csharpBlocks = response.match(/```c#([\s\S]*?)```/gi) ||
                response.match(/```csharp([\s\S]*?)```/gi);
            if (csharpBlocks && csharpBlocks[0]) {
                sections.tabularEditor = csharpBlocks[0]
                    .replace(/```c#\n?/i, '')
                    .replace(/```csharp\n?/i, '')
                    .replace(/```$/, '')
                    .trim();
            }
        }

        return sections;
    }

    async function generateDAX(event) {
        if (event) event.preventDefault();

        console.log('🚀 Generate DAX button clicked');

        // Get form values
        const daxDescription = document.getElementById('daxDescription').value.trim();
        const daxType = document.getElementById('daxType').value;
        const dataModel = document.getElementById('dataModel').value.trim();
        const daxComplexity = document.getElementById('daxComplexity').value;
        const timeIntelligence = document.getElementById('timeIntelligence').value;
        const aggregationType = document.getElementById('aggregationType').value;
        const filterContext = document.getElementById('filterContext').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const additionalRequirements = document.getElementById('additionalRequirements').value.trim();

        // Get options
        const options = {
            includeComments: document.getElementById('includeComments').checked,
            optimizePerformance: document.getElementById('optimizePerformance').checked,
            includeErrorHandling: document.getElementById('includeErrorHandling').checked,
            includeFormatting: document.getElementById('includeFormatting').checked,
            includeTestData: document.getElementById('includeTestData').checked,
            includeAlternatives: document.getElementById('includeAlternatives').checked,
            includePerformanceTips: document.getElementById('includePerformanceTips').checked,
            includeBestPractices: document.getElementById('includeBestPractices').checked
        };

        // Validation
        if (!daxDescription) {
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'Please provide a description of the DAX formula or filter you need.');
            return;
        }

        // Check if API setup exists
        if (!window.apiManager) {
            console.error('❌ API Manager not initialized');
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'API Manager not initialized. Please refresh the page.');
            return;
        }

        // Build user message
        let userMessage = `Generate a PowerBI DAX ${daxType} with the following requirements:\n\n`;
        userMessage += `Description: ${daxDescription}\n\n`;

        if (dataModel) {
            userMessage += `Data Model:\n${dataModel}\n\n`;
        }

        userMessage += `Requirements:\n`;
        userMessage += `- Complexity: ${daxComplexity}\n`;
        userMessage += `- Time Intelligence: ${timeIntelligence}\n`;
        userMessage += `- Aggregation: ${aggregationType}\n`;
        userMessage += `- Filter Context: ${filterContext}\n`;

        if (additionalRequirements) {
            userMessage += `\nAdditional Requirements:\n${additionalRequirements}`;
        }

        // Get system prompt
        const systemPrompt = getSystemPrompt(
            daxType,
            daxComplexity,
            timeIntelligence,
            aggregationType,
            filterContext,
            outputFormat,
            options
        );

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('errorDiv').style.display = 'none';

        try {
            console.log('📤 Sending request to AI...');

            const response = await window.apiManager.makeRequest([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ], {
                maxTokens: 4000,
                temperature: 0.7
            });

            console.log('📥 Received response from AI');

            currentResult = response;

            // Parse response
            const sections = parseResponse(response, outputFormat);

            // Build HTML
            const htmlContent = buildResponseHTML(sections, daxType, outputFormat, options);

            // Display result
            document.getElementById('resultContent').innerHTML = htmlContent;
            document.getElementById('resultDiv').style.display = 'block';

            // Show/hide download buttons based on format
            const pbixTemplateBtn = document.getElementById('pbixTemplateBtn');
            if (outputFormat === 'powerbi-template' || outputFormat === 'tabular-editor') {
                pbixTemplateBtn.style.display = 'inline-block';
            } else {
                pbixTemplateBtn.style.display = 'none';
            }

            console.log('✅ DAX generation complete');

        } catch (error) {
            console.error('❌ Error generating DAX:', error);
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, `Error generating DAX: ${error.message}`);
        } finally {
            document.getElementById('loadingDiv').style.display = 'none';
        }
    }

    async function generateVariation() {
        console.log('🔄 Generating alternative version...');

        if (!currentResult) {
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'No previous result to generate variation from.');
            return;
        }

        const daxDescription = document.getElementById('daxDescription').value.trim();
        const daxType = document.getElementById('daxType').value;

        const variationPrompt = `Based on the previous DAX solution, generate an alternative approach for: ${daxDescription}

Please provide a different method or optimization technique while maintaining the same functionality. Focus on:
- Different DAX functions or patterns
- Performance improvements
- Clarity and maintainability
- Edge case handling`;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const response = await window.apiManager.makeRequest([
                { role: 'system', content: 'You are an expert PowerBI DAX developer.' },
                { role: 'assistant', content: currentResult },
                { role: 'user', content: variationPrompt }
            ], {
                maxTokens: 4000,
                temperature: 0.7
            });

            currentResult = response;

            const sections = parseResponse(response, document.getElementById('outputFormat').value);
            const options = {
                includeComments: document.getElementById('includeComments').checked,
                optimizePerformance: document.getElementById('optimizePerformance').checked,
                includeErrorHandling: document.getElementById('includeErrorHandling').checked,
                includeFormatting: document.getElementById('includeFormatting').checked,
                includeTestData: document.getElementById('includeTestData').checked,
                includeAlternatives: document.getElementById('includeAlternatives').checked,
                includePerformanceTips: document.getElementById('includePerformanceTips').checked,
                includeBestPractices: document.getElementById('includeBestPractices').checked
            };

            const htmlContent = buildResponseHTML(sections, daxType, document.getElementById('outputFormat').value, options);
            document.getElementById('resultContent').innerHTML = htmlContent;

            console.log('✅ Alternative version generated');

        } catch (error) {
            console.error('❌ Error generating variation:', error);
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, `Error generating variation: ${error.message}`);
        } finally {
            document.getElementById('loadingDiv').style.display = 'none';
        }
    }

    function copyResult(event) {
        if (event) event.preventDefault();

        if (!currentResult) {
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'No result to copy.');
            return;
        }

        // Extract just the DAX code for copying
        const sections = parseResponse(currentResult, document.getElementById('outputFormat').value);
        const textToCopy = sections.dax || currentResult;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const btn = event.target.closest('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'Failed to copy to clipboard.');
        });
    }

    function downloadResult(format) {
        if (!currentResult) {
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'No result to download.');
            return;
        }

        const sections = parseResponse(currentResult, document.getElementById('outputFormat').value);
        const daxType = document.getElementById('daxType').value;
        let content = '';
        let filename = '';
        let mimeType = '';

        switch (format) {
            case 'dax':
                content = sections.dax || currentResult;
                filename = `powerbi_${daxType}_${Date.now()}.dax`;
                mimeType = 'text/plain';
                break;

            case 'pbix-template':
                // Create a template file with JSON structure
                const template = {
                    name: daxType,
                    expression: sections.dax,
                    formatString: sections.format || '',
                    description: sections.explanation || ''
                };
                content = JSON.stringify(template, null, 2);
                filename = `powerbi_${daxType}_template_${Date.now()}.json`;
                mimeType = 'application/json';
                break;

            case 'markdown':
                content = `# PowerBI ${daxType.charAt(0).toUpperCase() + daxType.slice(1)}\n\n`;
                content += `## DAX Formula\n\n\`\`\`dax\n${sections.dax}\n\`\`\`\n\n`;
                if (sections.format) {
                    content += `## Format String\n\n\`${sections.format}\`\n\n`;
                }
                if (sections.explanation) {
                    content += `## Explanation\n\n${sections.explanation}\n\n`;
                }
                if (sections.performance) {
                    content += `## Performance Tips\n\n${sections.performance}\n\n`;
                }
                if (sections.bestPractices) {
                    content += `## Best Practices\n\n${sections.bestPractices}\n\n`;
                }
                filename = `powerbi_${daxType}_${Date.now()}.md`;
                mimeType = 'text/markdown';
                break;

            default:
                content = currentResult;
                filename = `powerbi_result_${Date.now()}.txt`;
                mimeType = 'text/plain';
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log(`✅ Downloaded as ${filename}`);
    }

    // Check safety notice status on page load
    checkSafetyNoticeStatus();

    console.log('PowerBI DAX Builder initialized successfully');
});
