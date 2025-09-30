document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Global functions
    window.generateSQLQuery = generateSQLQuery;
    window.generateVariation = generateVariation;
    window.resetForm = resetForm;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.dismissSafetyNotice = dismissSafetyNotice;
    window.showSafetyNotice = showSafetyNotice;

    // Utility functions
    function showError(element, message) {
        element.innerHTML = `<div class="error">${message}</div>`;
    }

    function formatMarkdown(text) {
        // Basic markdown formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    function highlightSQL(sql) {
        // Basic SQL syntax highlighting
        const keywords = /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|PRIMARY KEY|FOREIGN KEY|REFERENCES|NOT NULL|UNIQUE|DEFAULT|AUTO_INCREMENT|VARCHAR|INT|INTEGER|BIGINT|DECIMAL|FLOAT|DOUBLE|DATE|DATETIME|TIMESTAMP|TEXT|BOOLEAN|COUNT|SUM|AVG|MAX|MIN|DISTINCT|AS|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|LIMIT|OFFSET|UNION|CASE|WHEN|THEN|ELSE|END|WITH|CTE)\b/gi;
        const strings = /('[^']*'|"[^"]*")/g;
        const comments = /(--[^\n]*|\/\*[\s\S]*?\*\/)/g;
        const numbers = /\b\d+(\.\d+)?\b/g;
        const functions = /\b([A-Z_]+)\s*\(/g;

        return sql
            .replace(comments, '<span class="sql-comment">$1</span>')
            .replace(strings, '<span class="sql-string">$1</span>')
            .replace(keywords, '<span class="sql-keyword">$1</span>')
            .replace(numbers, '<span class="sql-number">$1</span>')
            .replace(functions, '<span class="sql-function">$1</span>(');
    }

    function highlightBash(code) {
        const keywords = /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue|echo|printf|read|test|\[|\])\b/g;
        const strings = /('[^']*'|"[^"]*")/g;
        const comments = /(#[^\n]*)/g;
        const variables = /(\$\{?[A-Za-z_][A-Za-z0-9_]*\}?)/g;

        return code
            .replace(comments, '<span class="bash-comment">$1</span>')
            .replace(strings, '<span class="bash-string">$1</span>')
            .replace(keywords, '<span class="bash-keyword">$1</span>')
            .replace(variables, '<span class="bash-string">$1</span>');
    }

    function highlightPowerShell(code) {
        const keywords = /\b(if|else|elseif|switch|foreach|for|while|do|until|break|continue|function|param|return|try|catch|finally|throw)\b/gi;
        const cmdlets = /\b([A-Z][a-z]+-[A-Z][a-zA-Z]*)\b/g;
        const strings = /('[^']*'|"[^"]*")/g;
        const comments = /(#[^\n]*)/g;
        const variables = /(\$[A-Za-z_][A-Za-z0-9_]*)/g;

        return code
            .replace(comments, '<span class="bash-comment">$1</span>')
            .replace(strings, '<span class="powershell-string">$1</span>')
            .replace(cmdlets, '<span class="powershell-cmdlet">$1</span>')
            .replace(keywords, '<span class="powershell-keyword">$1</span>')
            .replace(variables, '<span class="bash-string">$1</span>');
    }

    function highlightPython(code) {
        const keywords = /\b(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|break|continue|pass|raise|lambda|and|or|not|in|is|True|False|None)\b/g;
        const strings = /('[^']*'|"[^"]*"|'''[\s\S]*?'''|"""[\s\S]*?""")/g;
        const comments = /(#[^\n]*)/g;
        const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

        return code
            .replace(comments, '<span class="bash-comment">$1</span>')
            .replace(strings, '<span class="python-string">$1</span>')
            .replace(keywords, '<span class="python-keyword">$1</span>')
            .replace(functions, '<span class="python-function">$1</span>(');
    }

    function highlightJavaScript(code) {
        const keywords = /\b(const|let|var|function|class|if|else|for|while|try|catch|finally|return|async|await|import|export|from|default|new|this|super|extends|typeof|instanceof)\b/g;
        const strings = /('[^']*'|"[^"]*"|`[^`]*`)/g;
        const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
        const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

        return code
            .replace(comments, '<span class="bash-comment">$1</span>')
            .replace(strings, '<span class="js-string">$1</span>')
            .replace(keywords, '<span class="js-keyword">$1</span>')
            .replace(functions, '<span class="js-function">$1</span>(');
    }

    function highlightYAML(code) {
        const keys = /^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/gm;
        const strings = /('[^']*'|"[^"]*")/g;
        const comments = /(#[^\n]*)/g;

        return code
            .replace(comments, '<span class="bash-comment">$1</span>')
            .replace(strings, '<span class="yaml-value">$1</span>')
            .replace(keys, '$1<span class="yaml-key">$2</span>:');
    }

    function buildResponseHTML(sections, databaseType, outputFormat, options) {
        let htmlContent = '';

        // Add format indicator
        const formatDisplayName = {
            'sql-only': 'SQL Query',
            'sql-with-cli': 'SQL + CLI',
            'script-bash': 'Bash Script',
            'script-powershell': 'PowerShell Script',
            'script-python': 'Python Script',
            'script-nodejs': 'Node.js Script',
            'docker-compose': 'Docker Compose',
            'orm-examples': 'ORM Examples'
        };

        htmlContent += `<div class="db-type-indicator db-${databaseType}">${databaseType.toUpperCase()} - ${formatDisplayName[outputFormat] || outputFormat}</div>`;

        // Add SQL query if available
        if (sections.query) {
            htmlContent += `
                <div class="sql-query-block db-${databaseType}">
                    <pre class="sql-code">${highlightSQL(sections.query)}</pre>
                </div>
            `;
        }

        // Add script content based on format
        if (sections.script) {
            const scriptClass = outputFormat.replace('script-', '');
            let highlightedScript = sections.script;

            switch (outputFormat) {
                case 'script-bash':
                    highlightedScript = highlightBash(sections.script);
                    break;
                case 'script-powershell':
                    highlightedScript = highlightPowerShell(sections.script);
                    break;
                case 'script-python':
                    highlightedScript = highlightPython(sections.script);
                    break;
                case 'script-nodejs':
                    highlightedScript = highlightJavaScript(sections.script);
                    break;
            }

            htmlContent += `
                <div class="script-block script-${scriptClass}">
                    <pre class="code-block">${highlightedScript}</pre>
                </div>
            `;
        }

        // Add Docker Compose content
        if (sections.docker) {
            htmlContent += `
                <div class="docker-block">
                    <pre class="code-block">${highlightYAML(sections.docker)}</pre>
                </div>
            `;
        }

        // Add CLI examples
        if (sections.cli) {
            htmlContent += `
                <div class="cli-block">
                    <pre class="code-block">${highlightBash(sections.cli)}</pre>
                </div>
            `;
        }

        // Add explanation if requested and available
        if (options.includeExplanation && sections.explanation) {
            htmlContent += `
                <div class="explanation-block">
                    <div style="line-height: 1.7;">${formatMarkdown(sections.explanation)}</div>
                </div>
            `;
        }

        // Add index suggestions if requested and available
        if (options.includeIndexSuggestions && sections.indexes) {
            htmlContent += `
                <div class="index-suggestions-block">
                    <div style="line-height: 1.7;">${formatMarkdown(sections.indexes)}</div>
                </div>
            `;
        }

        // Add test data if requested and available
        if (options.generateTestData && sections.testData) {
            htmlContent += `
                <div class="test-data-block">
                    <pre class="sql-code">${highlightSQL(sections.testData)}</pre>
                </div>
            `;
        }

        // Add documentation if requested and available
        if (options.includeDocumentation && sections.documentation) {
            htmlContent += `
                <div class="documentation-block">
                    <div style="line-height: 1.7;">${formatMarkdown(sections.documentation)}</div>
                </div>
            `;
        }

        return htmlContent;
    }

    function getSystemPrompt(databaseType, queryPurpose, queryComplexity, outputFormat, cliTools, options) {
        let basePrompt = `You are an expert SQL developer, database administrator, and DevOps engineer. Generate comprehensive solutions based on natural language descriptions.

Database Type: ${databaseType.toUpperCase()}
Query Purpose: ${queryPurpose.toUpperCase()}
Complexity Level: ${queryComplexity}
Output Format: ${outputFormat}
CLI Tool: ${cliTools}

Core Requirements:
1. Generate syntactically correct ${databaseType.toUpperCase()} code
2. Follow best practices and conventions for ${databaseType}
3. Use appropriate data types and constraints
${options.optimizePerformance ? '4. Optimize for performance and efficiency' : ''}
${options.includeErrorHandling ? '5. Include proper error handling and validation' : ''}
${options.includeTransactions ? '6. Use transactions where appropriate' : ''}
${options.includeLogging ? '7. Add logging and audit trail functionality' : ''}`;

        // Add format-specific instructions
        switch (outputFormat) {
            case 'sql-with-cli':
                basePrompt += `\n\nFormat Requirements:
- Provide the SQL query in \`\`\`sql code blocks
- Include command line examples using ${cliTools} to execute the query
- Show connection string examples
- Include file-based execution examples`;
                break;

            case 'script-bash':
                basePrompt += `\n\nBash Script Requirements:
- Create a complete bash script with proper shebang
- Include database connection handling
- Add error checking and validation
- Use environment variables for sensitive data
- Include help/usage information`;
                break;

            case 'script-powershell':
                basePrompt += `\n\nPowerShell Script Requirements:
- Create a complete PowerShell script with proper parameters
- Include database connection handling with proper error handling
- Use PowerShell best practices (approved verbs, error handling)
- Include help documentation and examples
- Handle Windows authentication when applicable`;
                break;

            case 'script-python':
                basePrompt += `\n\nPython Script Requirements:
- Create a complete Python script using appropriate database libraries
- Include connection pooling and proper resource management
- Add logging, error handling, and configuration management
- Use environment variables for sensitive data
- Include requirements.txt suggestions`;
                break;

            case 'script-nodejs':
                basePrompt += `\n\nNode.js Script Requirements:
- Create a complete Node.js script with appropriate packages
- Include async/await patterns and proper error handling
- Add configuration management and logging
- Include package.json suggestions
- Use modern ES6+ syntax`;
                break;

            case 'docker-compose':
                basePrompt += `\n\nDocker Compose Requirements:
- Create a complete docker-compose.yml file
- Include the database service with proper configuration
- Add initialization scripts and volume mounts
- Include environment file examples
- Add networking and security considerations`;
                break;

            case 'orm-examples':
                basePrompt += `\n\nORM Examples Requirements:
- Provide examples for multiple ORM frameworks (Sequelize, Prisma, TypeORM, SQLAlchemy, etc.)
- Include model definitions where applicable
- Show both query builder and raw SQL approaches
- Include migration examples when relevant`;
                break;
        }

        basePrompt += `\n\nStructure your response with clear sections:
${options.includeExplanation ? '- "Explanation:" section describing the approach' : ''}
${options.includeIndexSuggestions ? '- "Index Suggestions:" section for performance optimization' : ''}
${options.generateTestData ? '- "Test Data:" section with sample data' : ''}
${options.includeDocumentation ? '- "Documentation:" section with usage instructions' : ''}

Always ensure code is production-ready and follows security best practices.`;

        return basePrompt;
    }

    function parseResponse(response, outputFormat) {
        const sections = {
            query: '',
            explanation: '',
            indexes: '',
            testData: '',
            script: '',
            cli: '',
            docker: '',
            orm: '',
            documentation: ''
        };

        // Extract different code blocks based on format
        const codeBlocks = {
            sql: response.match(/```sql([\s\S]*?)```/gi),
            bash: response.match(/```bash([\s\S]*?)```/gi),
            powershell: response.match(/```(powershell|ps1)([\s\S]*?)```/gi),
            python: response.match(/```python([\s\S]*?)```/gi),
            javascript: response.match(/```(javascript|js)([\s\S]*?)```/gi),
            yaml: response.match(/```(yaml|yml)([\s\S]*?)```/gi),
            json: response.match(/```json([\s\S]*?)```/gi)
        };

        // Extract SQL query (primary)
        if (codeBlocks.sql && codeBlocks.sql[0]) {
            sections.query = codeBlocks.sql[0].replace(/```sql\n?/i, '').replace(/```$/, '').trim();
        }

        // Extract script content based on format
        switch (outputFormat) {
            case 'script-bash':
                if (codeBlocks.bash && codeBlocks.bash[0]) {
                    sections.script = codeBlocks.bash[0].replace(/```bash\n?/i, '').replace(/```$/, '').trim();
                }
                break;
            case 'script-powershell':
                if (codeBlocks.powershell && codeBlocks.powershell[0]) {
                    sections.script = codeBlocks.powershell[0].replace(/```(powershell|ps1)\n?/i, '').replace(/```$/, '').trim();
                }
                break;
            case 'script-python':
                if (codeBlocks.python && codeBlocks.python[0]) {
                    sections.script = codeBlocks.python[0].replace(/```python\n?/i, '').replace(/```$/, '').trim();
                }
                break;
            case 'script-nodejs':
                if (codeBlocks.javascript && codeBlocks.javascript[0]) {
                    sections.script = codeBlocks.javascript[0].replace(/```(javascript|js)\n?/i, '').replace(/```$/, '').trim();
                }
                break;
            case 'docker-compose':
                if (codeBlocks.yaml && codeBlocks.yaml[0]) {
                    sections.docker = codeBlocks.yaml[0].replace(/```(yaml|yml)\n?/i, '').replace(/```$/, '').trim();
                }
                break;
        }

        // Extract explanations and other sections
        const explanationMatch = response.match(/(?:explanation|how it works|approach)[:\n]([\s\S]*?)(?=\n\n|$|index|test data|documentation)/i);
        if (explanationMatch) {
            sections.explanation = explanationMatch[1].trim();
        }

        const indexMatch = response.match(/(?:index suggestions?|indexes?)[:\n]([\s\S]*?)(?=\n\n|$|test data|documentation)/i);
        if (indexMatch) {
            sections.indexes = indexMatch[1].trim();
        }

        const testDataMatch = response.match(/(?:test data|sample data)[:\n]([\s\S]*?)(?=\n\n|$|documentation)/i);
        if (testDataMatch) {
            sections.testData = testDataMatch[1].trim();
        }

        const docMatch = response.match(/(?:documentation|usage|instructions)[:\n]([\s\S]*?)(?=\n\n|$)/i);
        if (docMatch) {
            sections.documentation = docMatch[1].trim();
        }

        // Extract CLI examples
        const cliMatch = response.match(/(?:command line|cli examples?)[:\n]([\s\S]*?)(?=\n\n|$|explanation|test data)/i);
        if (cliMatch) {
            sections.cli = cliMatch[1].trim();
        }

        return sections;
    }

    async function generateSQLQuery(event) {
        if (event) {
            event.preventDefault();
        }

        // Check if API is configured
        if (!window.apiManager) {
            showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const currentApiKey = window.apiManager.getApiKey();
        if (!currentApiKey) {
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get form values
        const queryDescription = document.getElementById('queryDescription').value.trim();
        const databaseType = document.getElementById('databaseType').value;
        const schemaInfo = document.getElementById('schemaInfo').value.trim();
        const queryComplexity = document.getElementById('queryComplexity').value;
        const queryPurpose = document.getElementById('queryPurpose').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const cliTools = document.getElementById('cliTools').value;
        const additionalRequirements = document.getElementById('additionalRequirements').value.trim();

        // Get options
        const includeExplanation = document.getElementById('includeExplanation').checked;
        const optimizePerformance = document.getElementById('optimizePerformance').checked;
        const includeIndexSuggestions = document.getElementById('includeIndexSuggestions').checked;
        const generateTestData = document.getElementById('generateTestData').checked;
        const includeErrorHandling = document.getElementById('includeErrorHandling').checked;
        const includeTransactions = document.getElementById('includeTransactions').checked;
        const includeLogging = document.getElementById('includeLogging').checked;
        const includeDocumentation = document.getElementById('includeDocumentation').checked;

        // Validation
        if (!queryDescription) {
            showError(document.getElementById('errorDiv'), 'Please provide a query description');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Build system prompt based on output format
            let systemPrompt = getSystemPrompt(databaseType, queryPurpose, queryComplexity, outputFormat, cliTools, {
                includeExplanation,
                optimizePerformance,
                includeIndexSuggestions,
                generateTestData,
                includeErrorHandling,
                includeTransactions,
                includeLogging,
                includeDocumentation
            });

            // Build user prompt
            let userPrompt = `Generate a SQL query for: ${queryDescription}`;

            if (schemaInfo) {
                userPrompt += `\n\nDatabase Schema:\n${schemaInfo}`;
            }

            if (additionalRequirements) {
                userPrompt += `\n\nAdditional Requirements:\n${additionalRequirements}`;
            }

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

            const response = await window.apiManager.makeRequest(messages, {
                max_tokens: 2000,
                temperature: 0.1 // Lower temperature for more precise code generation
            });

            currentResult = response;

            // Parse and format the response
            const sections = parseResponse(response, outputFormat);
            let htmlContent = buildResponseHTML(sections, databaseType, outputFormat, {
                includeExplanation,
                includeIndexSuggestions,
                generateTestData,
                includeDocumentation
            });

            // If no specific sections were found, display the full response
            if (!sections.query && !sections.script && !sections.docker && !sections.explanation) {
                htmlContent = `
                    <div class="db-type-indicator db-${databaseType}">${databaseType.toUpperCase()} - ${outputFormat.toUpperCase()}</div>
                    <div class="sql-query-block db-${databaseType}">
                        <div style="line-height: 1.7;">${formatMarkdown(response)}</div>
                    </div>
                `;
            }

            document.getElementById('resultContent').innerHTML = htmlContent;

            // Update download buttons based on output format
            updateDownloadButtons(outputFormat, sections);

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating SQL query:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            showError(document.getElementById('errorDiv'), error.message || 'Failed to generate SQL query. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        // Check if API is configured
        if (!window.apiManager) {
            showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const currentApiKey = window.apiManager.getApiKey();
        if (!currentApiKey) {
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Get current form values
        const queryDescription = document.getElementById('queryDescription').value.trim();
        const databaseType = document.getElementById('databaseType').value;
        const schemaInfo = document.getElementById('schemaInfo').value.trim();

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = `You are an expert SQL developer. Generate an alternative SQL query approach for the same requirement. 
Use different techniques, query structures, or optimization strategies while achieving the same result.
Database Type: ${databaseType.toUpperCase()}`;

            let userPrompt = `Generate an alternative SQL query approach for: ${queryDescription}`;

            if (schemaInfo) {
                userPrompt += `\n\nDatabase Schema:\n${schemaInfo}`;
            }

            userPrompt += `\n\nPrevious query approach:\n${currentResult}\n\nPlease provide a different approach that achieves the same goal.`;

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

            const response = await window.apiManager.makeRequest(messages, {
                max_tokens: 2000,
                temperature: 0.3
            });

            currentResult = response;

            // Parse and format the response
            const sections = parseResponse(response);
            let htmlContent = `<div class="db-type-indicator db-${databaseType}">${databaseType.toUpperCase()} - Alternative Approach</div>`;

            if (sections.query) {
                htmlContent += `
                    <div class="sql-query-block db-${databaseType}">
                        <pre class="sql-code">${highlightSQL(sections.query)}</pre>
                    </div>
                `;
            }

            if (sections.explanation) {
                htmlContent += `
                    <div class="explanation-block">
                        <div style="line-height: 1.7;">${formatMarkdown(sections.explanation)}</div>
                    </div>
                `;
            }

            if (!sections.query && !sections.explanation) {
                htmlContent += `
                    <div class="sql-query-block db-${databaseType}">
                        <div style="line-height: 1.7;">${formatMarkdown(response)}</div>
                    </div>
                `;
            }

            document.getElementById('resultContent').innerHTML = htmlContent;
            document.getElementById('loadingDiv').style.display = 'none';

        } catch (error) {
            console.error('Error generating alternative query:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative query. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult() {
        if (!currentResult) return;

        // Extract just the SQL query for copying
        const sections = parseResponse(currentResult);
        const queryToCopy = sections.query || currentResult;

        navigator.clipboard.writeText(queryToCopy).then(() => {
            // Show feedback
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = '#4CAF50';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
    }

    function downloadResult(format) {
        if (!currentResult) return;

        const queryDescription = document.getElementById('queryDescription').value.trim();
        const databaseType = document.getElementById('databaseType').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const sections = parseResponse(currentResult, outputFormat);

        let content, filename, mimeType;

        if (format === 'sql') {
            content = `-- Generated SQL Query\n-- Description: ${queryDescription}\n-- Database: ${databaseType.toUpperCase()}\n-- Output Format: ${outputFormat}\n-- Generated: ${new Date().toISOString()}\n\n${sections.query || currentResult}`;
            filename = `sql-query-${timestamp}.sql`;
            mimeType = 'text/plain';
        } else if (format === 'script') {
            if (sections.script) {
                const extensions = {
                    'script-bash': 'sh',
                    'script-powershell': 'ps1',
                    'script-python': 'py',
                    'script-nodejs': 'js'
                };
                const ext = extensions[outputFormat] || 'txt';
                content = sections.script;
                filename = `${outputFormat}-${timestamp}.${ext}`;
                mimeType = 'text/plain';
            } else {
                alert('No script content available to download');
                return;
            }
        } else if (format === 'docker') {
            if (sections.docker) {
                content = sections.docker;
                filename = `docker-compose-${timestamp}.yml`;
                mimeType = 'text/yaml';
            } else {
                alert('No Docker Compose content available to download');
                return;
            }
        } else if (format === 'markdown') {
            content = `# ${outputFormat.replace('-', ' ').toUpperCase()}\n\n**Description:** ${queryDescription}\n**Database:** ${databaseType.toUpperCase()}\n**Output Format:** ${outputFormat}\n**Generated:** ${new Date().toISOString()}\n\n`;

            if (sections.query) {
                content += `## SQL Query\n\n\`\`\`sql\n${sections.query}\n\`\`\`\n\n`;
            }

            if (sections.script) {
                const lang = outputFormat.replace('script-', '');
                content += `## Script\n\n\`\`\`${lang}\n${sections.script}\n\`\`\`\n\n`;
            }

            if (sections.docker) {
                content += `## Docker Compose\n\n\`\`\`yaml\n${sections.docker}\n\`\`\`\n\n`;
            }

            content += `## Full Response\n\n${currentResult}`;
            filename = `${outputFormat}-${timestamp}.md`;
            mimeType = 'text/markdown';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function resetForm() {
        document.getElementById('sqlBuilderForm').reset();
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'none';
        currentResult = '';

        // Reset to default values
        document.getElementById('databaseType').value = 'postgresql';
        document.getElementById('queryComplexity').value = 'moderate';
        document.getElementById('queryPurpose').value = 'select';
        document.getElementById('outputFormat').value = 'sql-only';
        document.getElementById('cliTools').value = 'native';
        document.getElementById('includeExplanation').checked = true;
        document.getElementById('optimizePerformance').checked = true;
        document.getElementById('includeIndexSuggestions').checked = false;
        document.getElementById('generateTestData').checked = false;
        document.getElementById('includeErrorHandling').checked = false;
        document.getElementById('includeTransactions').checked = false;
        document.getElementById('includeLogging').checked = false;
        document.getElementById('includeDocumentation').checked = false;

        // Reset CLI tools visibility
        document.getElementById('outputFormat').dispatchEvent(new Event('change'));

        // Hide download buttons
        document.getElementById('scriptDownloadBtn').style.display = 'none';
        document.getElementById('dockerDownloadBtn').style.display = 'none';
    }

    // Form validation and UX improvements
    document.getElementById('queryDescription').addEventListener('input', function () {
        if (this.value.trim()) {
            this.style.borderColor = '#4CAF50';
        } else {
            this.style.borderColor = '';
        }
    });

    // Database type change handler
    document.getElementById('databaseType').addEventListener('change', function () {
        const type = this.value;

        // Update placeholder text based on database type
        const schemaTextarea = document.getElementById('schemaInfo');
        const examples = {
            'mysql': 'Example MySQL schema:\nusers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE)\norders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, total DECIMAL(10,2), FOREIGN KEY (user_id) REFERENCES users(id))',
            'postgresql': 'Example PostgreSQL schema:\nusers (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE)\norders (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), total DECIMAL(10,2))',
            'sqlite': 'Example SQLite schema:\nusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE)\norders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total REAL, FOREIGN KEY (user_id) REFERENCES users(id))',
            'sqlserver': 'Example SQL Server schema:\nusers (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255), email NVARCHAR(255) UNIQUE)\norders (id INT IDENTITY(1,1) PRIMARY KEY, user_id INT FOREIGN KEY REFERENCES users(id), total DECIMAL(10,2))',
            'oracle': 'Example Oracle schema:\nusers (id NUMBER PRIMARY KEY, name VARCHAR2(255), email VARCHAR2(255) UNIQUE)\norders (id NUMBER PRIMARY KEY, user_id NUMBER REFERENCES users(id), total NUMBER(10,2))',
            'mongodb': 'Example MongoDB collections:\nusers: {_id, name, email}\norders: {_id, userId, total, orderDate}'
        };

        schemaTextarea.placeholder = examples[type] || schemaTextarea.placeholder;
    });

    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // Output format change handler
    document.getElementById('outputFormat').addEventListener('change', function () {
        const format = this.value;
        const cliToolsGroup = document.getElementById('cliTools').parentElement;

        // Show/hide CLI tools dropdown based on format
        if (format === 'sql-with-cli') {
            cliToolsGroup.style.display = 'block';
        } else {
            cliToolsGroup.style.display = 'none';
        }

        // Update placeholder text based on format
        const queryTextarea = document.getElementById('queryDescription');
        const formatExamples = {
            'sql-only': 'Describe what you want to query in plain English. Example: "Get all customers who placed orders in the last 30 days with their total order amount"',
            'sql-with-cli': 'Describe your query and mention if you need specific CLI examples. Example: "Get all customers with orders, and show me how to run this with psql"',
            'script-bash': 'Describe the database operation you want to automate with a bash script. Example: "Create a backup script for PostgreSQL database with error handling"',
            'script-powershell': 'Describe the database task for PowerShell automation. Example: "Connect to SQL Server and export query results to CSV"',
            'script-python': 'Describe the database operation for Python script. Example: "Create a data migration script from MySQL to PostgreSQL"',
            'script-nodejs': 'Describe the database task for Node.js application. Example: "Create an API endpoint that returns user statistics"',
            'docker-compose': 'Describe the database setup you need. Example: "Set up PostgreSQL with initial schema and sample data"',
            'orm-examples': 'Describe the query for ORM implementation. Example: "Show me how to get users with their orders using different ORMs"'
        };

        queryTextarea.placeholder = formatExamples[format] || queryTextarea.placeholder;
    });

    function updateDownloadButtons(outputFormat, sections) {
        const scriptBtn = document.getElementById('scriptDownloadBtn');
        const dockerBtn = document.getElementById('dockerDownloadBtn');

        // Show/hide script download button
        if (outputFormat.startsWith('script-') && sections.script) {
            scriptBtn.style.display = 'inline-block';
            scriptBtn.textContent = outputFormat.replace('script-', '').toUpperCase() + ' Script';
        } else {
            scriptBtn.style.display = 'none';
        }

        // Show/hide docker download button
        if (outputFormat === 'docker-compose' && sections.docker) {
            dockerBtn.style.display = 'inline-block';
        } else {
            dockerBtn.style.display = 'none';
        }
    }

    // Initialize CLI tools visibility
    document.getElementById('outputFormat').dispatchEvent(new Event('change'));

    // Check if safety notice has been acknowledged
    checkSafetyNoticeStatus();

    // Add keyboard support for dismissing safety notice
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const overlay = document.getElementById('safetyOverlay');
            if (overlay && overlay.classList.contains('show')) {
                dismissSafetyNotice();
            }
        }
    });

    // Click outside popup to close
    document.getElementById('safetyOverlay').addEventListener('click', function (event) {
        if (event.target === this) {
            dismissSafetyNotice();
        }
    });

    function showSafetyNotice() {
        const overlay = document.getElementById('safetyOverlay');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function dismissSafetyNotice() {
        const overlay = document.getElementById('safetyOverlay');
        const toggleBtn = document.getElementById('safetyToggleBtn');

        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling

        // Show the toggle button
        toggleBtn.style.display = 'flex';

        // Store acknowledgment in localStorage
        localStorage.setItem('sqlBuilder_safetyAcknowledged', 'true');
        localStorage.setItem('sqlBuilder_safetyAcknowledgedDate', new Date().toISOString());
    }

    function checkSafetyNoticeStatus() {
        const acknowledged = localStorage.getItem('sqlBuilder_safetyAcknowledged');
        const acknowledgedDate = localStorage.getItem('sqlBuilder_safetyAcknowledgedDate');
        const overlay = document.getElementById('safetyOverlay');
        const toggleBtn = document.getElementById('safetyToggleBtn');

        // Check if acknowledgment is less than 7 days old
        if (acknowledged === 'true' && acknowledgedDate) {
            const ackDate = new Date(acknowledgedDate);
            const now = new Date();
            const daysDiff = (now - ackDate) / (1000 * 60 * 60 * 24);

            if (daysDiff < 7) {
                // Show toggle button, hide popup
                toggleBtn.style.display = 'flex';
                return;
            }
        }

        // Show popup immediately for new users or expired acknowledgments
        setTimeout(() => {
            showSafetyNotice();
        }, 500); // Small delay for better UX
    }

    window.dismissSafetyNotice = dismissSafetyNotice;
});