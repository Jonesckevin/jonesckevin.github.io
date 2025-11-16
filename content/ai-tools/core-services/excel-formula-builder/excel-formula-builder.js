document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    console.log('Excel Formula Builder: DOMContentLoaded event fired');

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
                        <p><strong>Always test generated Excel formulas in a test environment first.</strong></p>
                        <ul>
                            <li>Verify formulas work with your actual data structure</li>
                            <li>Check cell references match your worksheet layout</li>
                            <li>Test with edge cases and unusual data values</li>
                            <li>Review calculated results for accuracy</li>
                            <li>Consider performance impact on large datasets</li>
                            <li>Backup your workbook before applying complex formulas</li>
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
                            <p><strong>Always test generated Excel formulas in a test environment first.</strong></p>
                            <ul>
                                <li>Verify formulas work with your actual data structure</li>
                                <li>Check cell references match your worksheet layout</li>
                                <li>Test with edge cases and unusual data values</li>
                                <li>Review calculated results for accuracy</li>
                                <li>Consider performance impact on large datasets</li>
                                <li>Backup your workbook before applying complex formulas</li>
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
        localStorage.setItem('excelBuilder_safetyAcknowledged', 'true');
        localStorage.setItem('excelBuilder_safetyAcknowledgedDate', new Date().toISOString());
    }

    function checkSafetyNoticeStatus() {
        const acknowledged = localStorage.getItem('excelBuilder_safetyAcknowledged');
        const acknowledgedDate = localStorage.getItem('excelBuilder_safetyAcknowledgedDate');
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
        document.getElementById('excelBuilderForm').reset();
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('errorDiv').style.display = 'none';
        currentResult = '';
    }

    // Make functions globally accessible
    window.showSafetyNotice = showSafetyNotice;
    window.dismissSafetyNotice = dismissSafetyNotice;
    window.resetForm = resetForm;
    window.generateFormula = generateFormula;
    window.downloadResult = downloadResult;

    // Check safety notice status on load
    checkSafetyNoticeStatus();

    function highlightFormula(formula) {
        if (!formula) return '';
        
        // Escape only special HTML characters that could break rendering
        // but DON'T escape the entire string yet since we'll be adding HTML spans
        let processedFormula = formula;
        
        // Use a token-based approach to avoid conflicts
        const tokens = [];
        let tokenIndex = 0;
        
        // Extract and tokenize strings first (they should not be further processed)
        processedFormula = processedFormula.replace(/"([^"]*)"/g, (match, content) => {
            const token = `__STRING_TOKEN_${tokenIndex}__`;
            // Escape HTML in string content only
            const escapedContent = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tokens.push({ token, replacement: `<span class="excel-string">"${escapedContent}"</span>` });
            tokenIndex++;
            return token;
        });

        // Escape remaining HTML entities (but not quotes since they're tokenized)
        processedFormula = processedFormula
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Excel functions (case-insensitive) - must come before named ranges
        processedFormula = processedFormula.replace(/\b(SUM|AVERAGE|COUNT|COUNTA|COUNTIF|COUNTIFS|SUMIF|SUMIFS|AVERAGEIF|AVERAGEIFS|IF|IFS|IFERROR|IFNA|AND|OR|NOT|XOR|VLOOKUP|HLOOKUP|XLOOKUP|INDEX|MATCH|OFFSET|INDIRECT|CHOOSE|LOOKUP|FILTER|SORT|UNIQUE|SORTBY|SEQUENCE|RANDARRAY|LET|LAMBDA|TEXTJOIN|CONCAT|CONCATENATE|LEFT|RIGHT|MID|LEN|FIND|SEARCH|SUBSTITUTE|REPLACE|TRIM|UPPER|LOWER|PROPER|TEXT|VALUE|NUMBERVALUE|DATE|TIME|NOW|TODAY|YEAR|MONTH|DAY|HOUR|MINUTE|SECOND|DATEDIF|NETWORKDAYS|WORKDAY|EOMONTH|PMT|PV|FV|NPV|IRR|RATE|NPER|MAX|MIN|MEDIAN|MODE|STDEV|VAR|CORREL|PERCENTILE|QUARTILE|RANK|LARGE|SMALL|ROUND|ROUNDUP|ROUNDDOWN|INT|TRUNC|MOD|ABS|SQRT|POWER|EXP|LN|LOG|LOG10|PI|SIN|COS|TAN|ASIN|ACOS|ATAN|DEGREES|RADIANS|ISBLANK|ISERROR|ISNA|ISNUMBER|ISTEXT|ISLOGICAL|CELL|ROW|ROWS|COLUMN|COLUMNS|ADDRESS|HYPERLINK|TRANSPOSE|DSUM|DCOUNT|DAVERAGE|DGET|DMIN|DMAX)\b/gi, 
            '<span class="excel-function">$1</span>');

        // Cell references (A1, $A$1, A$1, $A1, etc.)
        processedFormula = processedFormula.replace(/\b(\$?[A-Z]{1,3}\$?\d{1,7})\b/g, '<span class="excel-cell">$1</span>');

        // Numbers (integers and decimals) - before operators
        processedFormula = processedFormula.replace(/\b(\d+\.?\d*)\b/g, '<span class="excel-number">$1</span>');

        // Operators
        processedFormula = processedFormula.replace(/([+\-*\/=<>%&])/g, '<span class="excel-operator">$1</span>');
        
        // Parentheses and brackets (note: these were already escaped above if they were < or >)
        processedFormula = processedFormula.replace(/([()])/g, '<span class="excel-paren">$1</span>');
        processedFormula = processedFormula.replace(/([[\]])/g, '<span class="excel-bracket">$1</span>');
        
        // Commas and semicolons
        processedFormula = processedFormula.replace(/([,;])/g, '<span class="excel-delimiter">$1</span>');

        // Restore string tokens
        tokens.forEach(({ token, replacement }) => {
            processedFormula = processedFormula.replace(token, replacement);
        });

        return processedFormula;
    }

    function buildResultHTML(sections, formulaType, options) {
        let htmlContent = '';

        // Add main formula - RAW, no highlighting
        if (sections.formula) {
            // Escape HTML entities for safe display
            const escapedFormula = sections.formula
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            
            htmlContent += `
                <div class="formula-code-block formula-${formulaType}">
                    <pre class="formula-code">${escapedFormula}</pre>
                </div>
            `;
        }

        // Add cell formatting if available
        if (sections.formatting) {
            htmlContent += `
                <div class="formatting-block">
                    <h4>🎨 Cell Formatting Suggestions</h4>
                    <div>${utils.formatMarkdown(sections.formatting)}</div>
                </div>
            `;
        }

        // Add explanation if available
        if (sections.explanation) {
            htmlContent += `
                <div class="explanation-block">
                    <h4>📖 Explanation</h4>
                    <div>${utils.formatMarkdown(sections.explanation)}</div>
                </div>
            `;
        }

        // Add step-by-step breakdown if available
        if (sections.stepByStep) {
            htmlContent += `
                <div class="step-by-step-block">
                    <h4>📝 Step-by-Step Breakdown</h4>
                    <div>${utils.formatMarkdown(sections.stepByStep)}</div>
                </div>
            `;
        }

        // Add usage examples if available
        if (sections.examples) {
            htmlContent += `
                <div class="examples-block">
                    <h4>💡 Usage Examples</h4>
                    <div>${utils.formatMarkdown(sections.examples)}</div>
                </div>
            `;
        }

        // Add alternative approaches if available
        if (options.includeAlternatives && sections.alternatives) {
            htmlContent += `
                <div class="alternatives-block">
                    <h4>🔄 Alternative Approaches</h4>
                    <div>${utils.formatMarkdown(sections.alternatives)}</div>
                </div>
            `;
        }

        // Add best practices if requested
        if (options.includeBestPractices && sections.bestPractices) {
            htmlContent += `
                <div class="best-practices-block">
                    <h4>✅ Best Practices</h4>
                    <div>${utils.formatMarkdown(sections.bestPractices)}</div>
                </div>
            `;
        }

        // Add VBA macro alternative if applicable
        if (sections.vbaMacro) {
            htmlContent += `
                <div class="vba-macro-block">
                    <h4>🔧 VBA Macro Alternative</h4>
                    <pre class="code-block">${sections.vbaMacro}</pre>
                </div>
            `;
        }

        return htmlContent;
    }

    function getSystemPrompt(excelVersion, formulaType, formulaComplexity, errorHandling, outputFormat, options) {
        let basePrompt = `You are an expert Excel specialist with deep knowledge of formulas, functions, data analysis, and spreadsheet best practices. Generate comprehensive Excel formula solutions based on natural language descriptions.

Excel Version: ${excelVersion.toUpperCase()}
Formula Type: ${formulaType}
Complexity Level: ${formulaComplexity}
Error Handling: ${errorHandling}
Output Format: ${outputFormat}

Core Requirements:
1. Generate syntactically correct Excel formulas for the specified version
2. Use appropriate functions and patterns for the formula type
3. Follow Excel formula conventions and best practices
4. Ensure formulas are efficient and maintainable
${options.optimizePerformance ? '5. Optimize for performance with large datasets' : ''}
${options.includeComments ? '6. Add explanatory comments or notes' : ''}
${options.useAbsoluteReferences ? '7. Use absolute references ($A$1) where appropriate' : ''}
${options.useMixedReferences ? '8. Use mixed references ($A1 or A$1) where appropriate' : ''}`;

        // Add version-specific instructions
        if (excelVersion === 'microsoft365') {
            basePrompt += `\n\nMicrosoft 365 Features Available:
- Dynamic array formulas (FILTER, SORT, UNIQUE, SORTBY, SEQUENCE)
- XLOOKUP function
- LET and LAMBDA functions
- Spill ranges and array behavior`;
        } else if (excelVersion === 'googlesheets') {
            basePrompt += `\n\nGoogle Sheets Specific:
- Use ARRAYFORMULA where appropriate
- Google Sheets specific functions (QUERY, IMPORTRANGE, etc.)
- Note differences from Excel syntax`;
        } else {
            basePrompt += `\n\nLegacy Excel Version Notes:
- Avoid dynamic array formulas (use array formula with Ctrl+Shift+Enter)
- Use VLOOKUP/INDEX-MATCH instead of XLOOKUP
- Note compatibility limitations`;
        }

        // Add error handling instructions
        switch (errorHandling) {
            case 'iferror':
                basePrompt += `\n\nError Handling: Wrap formula in IFERROR to handle errors gracefully.`;
                break;
            case 'ifna':
                basePrompt += `\n\nError Handling: Use IFNA to handle #N/A errors specifically.`;
                break;
            case 'comprehensive':
                basePrompt += `\n\nError Handling: Implement comprehensive error checking for multiple error types.`;
                break;
            case 'custom':
                basePrompt += `\n\nError Handling: Include custom error messages for different error scenarios.`;
                break;
        }

        // Add output format instructions
        switch (outputFormat) {
            case 'formula-with-explanation':
                basePrompt += `\n\nProvide the formula and include a clear explanation of how it works.`;
                break;
            case 'formula-with-examples':
                basePrompt += `\n\nProvide the formula with practical cell reference examples.`;
                break;
            case 'complete-solution':
                basePrompt += `\n\nProvide a complete solution with formula, explanation, and testing steps.`;
                break;
            case 'multiple-alternatives':
                basePrompt += `\n\nProvide multiple alternative approaches to solve the problem.`;
                break;
            case 'vba-macro':
                basePrompt += `\n\nAlso provide a VBA macro alternative for the formula.`;
                break;
        }

        basePrompt += `\n\nIMPORTANT - Response Format:
- Always start with the Excel formula in a code block
- The formula should be ready to copy and paste into Excel
- Include the = sign at the beginning of the formula
- Only include additional sections if specifically requested via options`;

        const enabledSections = [];
        if (options.includeCellFormatting) enabledSections.push('Cell Formatting Suggestions');
        if (options.includeStepByStep) enabledSections.push('Step-by-Step Breakdown');
        if (options.includeAlternatives) enabledSections.push('Alternative Approaches');
        if (options.includeBestPractices) enabledSections.push('Best Practices');

        if (enabledSections.length > 0) {
            basePrompt += `\n\nEnabled optional sections:\n${enabledSections.map(s => `- ${s}`).join('\n')}`;
        } else {
            basePrompt += `\n- NONE - Only provide the formula`;
        }

        basePrompt += `\n\nEnsure all formulas are production-ready and follow Excel best practices.`;

        return basePrompt;
    }

    function parseResponse(response, outputFormat) {
        const sections = {
            formula: '',
            formatting: '',
            explanation: '',
            stepByStep: '',
            examples: '',
            alternatives: '',
            bestPractices: '',
            vbaMacro: ''
        };

        // Extract formula from code blocks
        const codeBlocks = response.match(/```[\s\S]*?```/gi);
        if (codeBlocks && codeBlocks[0]) {
            let formulaContent = codeBlocks[0]
                .replace(/```[a-z]*\n?/i, '')
                .replace(/```$/, '')
                .trim();
            
            // Ensure formula starts with =
            if (!formulaContent.startsWith('=')) {
                formulaContent = '=' + formulaContent;
            }
            sections.formula = formulaContent;
        }

        // If no code block, try to find formula starting with =
        if (!sections.formula) {
            const formulaMatch = response.match(/=[\s\S]*?(?=\n\n|\n[A-Z#*]|$)/);
            if (formulaMatch) {
                sections.formula = formulaMatch[0].trim();
            }
        }

        // Extract formatting suggestions
        const formattingMatch = response.match(/(?:Cell Formatting|Formatting Suggestions?):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Explanation|Step|Examples|Alternative|Best Practices)|$)/i);
        if (formattingMatch) {
            sections.formatting = formattingMatch[1].trim();
        }

        // Extract explanation section
        const explanationMatch = response.match(/(?:Explanation|How it works|Description):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Step|Examples|Alternative|Best Practices)|$)/i);
        if (explanationMatch) {
            sections.explanation = explanationMatch[1].trim();
        }

        // Extract step-by-step
        const stepByStepMatch = response.match(/(?:Step-by-Step|Breakdown|Steps):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Examples|Alternative|Best Practices)|$)/i);
        if (stepByStepMatch) {
            sections.stepByStep = stepByStepMatch[1].trim();
        }

        // Extract examples
        const examplesMatch = response.match(/(?:Usage Examples|Examples|Sample):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Alternative|Best Practices)|$)/i);
        if (examplesMatch) {
            sections.examples = examplesMatch[1].trim();
        }

        // Extract alternatives
        const alternativesMatch = response.match(/(?:Alternative Approaches?|Alternatives|Other Methods):?\s*([\s\S]*?)(?=\n##|\n\*\*(?:Best Practices|VBA)|$)/i);
        if (alternativesMatch) {
            sections.alternatives = alternativesMatch[1].trim();
        }

        // Extract best practices
        const bestPracticesMatch = response.match(/(?:Best Practices|Recommendations|Tips):?\s*([\s\S]*?)(?=\n##|\n\*\*VBA|$)/i);
        if (bestPracticesMatch) {
            sections.bestPractices = bestPracticesMatch[1].trim();
        }

        // Extract VBA macro
        if (outputFormat === 'vba-macro' && codeBlocks && codeBlocks.length > 1) {
            sections.vbaMacro = codeBlocks[1]
                .replace(/```[a-z]*\n?/i, '')
                .replace(/```$/, '')
                .trim();
        }

        return sections;
    }

    async function generateFormula(event) {
        if (event) event.preventDefault();

        console.log('🚀 Generate Formula button clicked');

        // Get form values
        const formulaDescription = document.getElementById('formulaDescription').value.trim();
        const excelVersion = document.getElementById('excelVersion').value;
        const dataStructure = document.getElementById('dataStructure').value.trim();
        const formulaType = document.getElementById('formulaType').value;
        const formulaComplexity = document.getElementById('formulaComplexity').value;
        const errorHandling = document.getElementById('errorHandling').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const additionalRequirements = document.getElementById('additionalRequirements').value.trim();

        // Get options
        const options = {
            useAbsoluteReferences: document.getElementById('useAbsoluteReferences').checked,
            useMixedReferences: document.getElementById('useMixedReferences').checked,
            includeComments: document.getElementById('includeComments').checked,
            optimizePerformance: document.getElementById('optimizePerformance').checked,
            includeCellFormatting: document.getElementById('includeCellFormatting').checked,
            includeAlternatives: document.getElementById('includeAlternatives').checked,
            includeStepByStep: document.getElementById('includeStepByStep').checked,
            includeBestPractices: document.getElementById('includeBestPractices').checked
        };

        // Validation
        if (!formulaDescription) {
            const errorDiv = document.getElementById('errorDiv');
            utils.showError(errorDiv, 'Please provide a description of the Excel formula you need.');
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
        let userMessage = `Generate an Excel formula with the following requirements:\n\n`;
        userMessage += `Description: ${formulaDescription}\n\n`;

        if (dataStructure) {
            userMessage += `Data Structure:\n${dataStructure}\n\n`;
        }

        userMessage += `Requirements:\n`;
        userMessage += `- Excel Version: ${excelVersion}\n`;
        userMessage += `- Formula Type: ${formulaType}\n`;
        userMessage += `- Complexity: ${formulaComplexity}\n`;
        userMessage += `- Error Handling: ${errorHandling}\n`;

        if (additionalRequirements) {
            userMessage += `\nAdditional Requirements:\n${additionalRequirements}`;
        }

        // Get system prompt
        const systemPrompt = getSystemPrompt(
            excelVersion,
            formulaType,
            formulaComplexity,
            errorHandling,
            outputFormat,
            options
        );

        console.log('📤 Sending request to AI...');
        console.log('System Prompt:', systemPrompt);
        console.log('User Message:', userMessage);

        // Show loading state
        const loadingDiv = document.getElementById('loadingDiv');
        const errorDiv = document.getElementById('errorDiv');
        const resultDiv = document.getElementById('resultDiv');

        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';

        try {
            // Call API manager
            const response = await window.apiManager.makeRequest([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ], {
                maxTokens: 3000,
                temperature: 0.7
            });
            console.log('📥 Received response:', response);

            // Hide loading
            loadingDiv.style.display = 'none';

            // Parse response
            const sections = parseResponse(response, outputFormat);
            console.log('Parsed sections:', sections);

            // Store the raw formula for copying
            currentResult = sections.formula;
            window.currentResult = currentResult;

            // Build and display result
            const resultHTML = buildResultHTML(sections, formulaType, options);
            console.log('Result HTML:', resultHTML);
            
            // Insert directly into resultDiv, not resultContent
            const resultDiv = document.getElementById('resultDiv');
            console.log('Setting innerHTML on:', resultDiv);
            
            // Clear and set the full content including the header
            resultDiv.innerHTML = `
                <h3 style="color: #ff6b35; margin-bottom: 20px;">📊 Generated Excel Formula</h3>
                ${resultHTML}
                <div class="result-actions" style="margin-top: 30px; display: flex; gap: 15px; flex-wrap: wrap;">
                    <button class="action-btn btn-primary copy-btn" onclick="utils.copyToClipboard(currentResult, 'Excel formula copied to clipboard!')">
                        📋 Copy Formula
                    </button>
                    <button class="action-btn btn-primary download-btn" onclick="downloadResult('markdown')">
                        💾 Download as Markdown
                    </button>
                    <button class="action-btn btn-primary download-btn" onclick="downloadResult('html')">
                        💾 Download as HTML
                    </button>
                    <button class="action-btn btn-primary download-btn" onclick="downloadResult('txt')">
                        💾 Download as Text
                    </button>
                    <button class="action-btn btn-danger" onclick="resetForm()">
                        🔄 Reset Form
                    </button>
                </div>
            `;
            
            console.log('innerHTML set, checking result...');
            
            // Debug: log what's actually in the DOM
            const formulaCodeBlock = resultDiv.querySelector('.formula-code');
            if (formulaCodeBlock) {
                console.log('Formula code innerHTML:', formulaCodeBlock.innerHTML);
            }
            
            resultDiv.style.display = 'block';

            console.log('✅ Formula generation completed successfully');

        } catch (error) {
            console.error('❌ Error generating formula:', error);
            loadingDiv.style.display = 'none';
            utils.showError(errorDiv, error.message || 'Failed to generate formula. Please try again.');
        }
    }

    function downloadResult(format) {
        if (!currentResult) {
            alert('No formula to download');
            return;
        }

        const formulaDescription = document.getElementById('formulaDescription').value.trim();
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `excel-formula-${timestamp}`;
        let content = '';
        let mimeType = 'text/plain';

        // Get the result div content
        const resultDiv = document.getElementById('resultDiv');
        const resultText = resultDiv ? resultDiv.innerText : '';

        switch (format) {
            case 'markdown':
                filename += '.md';
                content = `# Excel Formula\n\nGenerated on ${new Date().toLocaleDateString()}\n\n## Description\n${formulaDescription}\n\n## Formula\n\`\`\`excel\n${currentResult}\n\`\`\`\n\n## Additional Information\n${resultText}`;
                mimeType = 'text/markdown';
                break;

            case 'html':
                filename += '.html';
                content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Excel Formula</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #ff6b35; }
        .formula { background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Excel Formula</h1>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    <h2>Description</h2>
    <p>${formulaDescription}</p>
    <h2>Formula</h2>
    <div class="formula">${currentResult}</div>
    ${resultDiv ? resultDiv.innerHTML : ''}
</body>
</html>`;
                mimeType = 'text/html';
                break;

            case 'txt':
                filename += '.txt';
                content = `Excel Formula\n${'='.repeat(50)}\n\nGenerated: ${new Date().toLocaleDateString()}\n\nDescription:\n${formulaDescription}\n\nFormula:\n${currentResult}\n\nAdditional Information:\n${resultText}`;
                mimeType = 'text/plain';
                break;
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`✅ Downloaded as ${filename}`);
    }
});
