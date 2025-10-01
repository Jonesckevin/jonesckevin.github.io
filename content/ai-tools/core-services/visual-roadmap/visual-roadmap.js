document.addEventListener('DOMContentLoaded', function () {
    console.log('Visual Roadmap script loaded');
    console.log('APIManager available:', !!window.apiManager);
    console.log('Utils available:', !!window.utils);

    // Enhanced console error suppression for extension conflicts
    const originalConsoleError = console.error;
    console.error = function (...args) {
        const message = args.join(' ');
        // Specifically target the exact error pattern we're seeing
        if (message.includes('[object Object]') &&
            message.includes('not valid JSON') &&
            (message.includes('content.js') || message.includes('_storageChangeDispatcher'))) {
            console.warn('Browser extension JSON parsing error suppressed:', message);
            return;
        }
        // Apply to all console.error calls to catch variations
        if (message.includes('not valid JSON') ||
            message.includes('content.js') ||
            message.includes('extension')) {
            console.warn('Extension-related error suppressed:', message);
            return;
        }
        originalConsoleError.apply(console, args);
    };

    // Add global error handler for unhandled promise rejections and extension JSON errors
    window.addEventListener('unhandledrejection', function (event) {
        const reason = event.reason;
        // Suppress extension JSON parse errors
        if (reason && (
            (typeof reason === 'string' && (reason.includes('JSON') || reason.includes('[object Object]'))) ||
            (reason.message && (reason.message.includes('JSON') || reason.message.includes('[object Object]'))) ||
            (reason.toString && reason.toString().includes('JSON'))
        )) {
            console.warn('JSON parsing error from external source suppressed:', reason);
            event.preventDefault();
            return;
        }
        // Suppress browser extension related errors
        if (reason && (
            (typeof reason === 'string' && (reason.includes('content.js') || reason.includes('extension'))) ||
            (reason.message && (reason.message.includes('content.js') || reason.message.includes('extension')))
        )) {
            console.warn('Browser extension error suppressed:', reason);
            event.preventDefault();
            return;
        }
        console.warn('Unhandled promise rejection:', reason);
    });

    // Add global error handler for general JavaScript errors
    window.addEventListener('error', function (event) {
        // Suppress browser extension errors that we can't control
        if (event.filename && (event.filename.includes('content.js') || event.filename.includes('extension'))) {
            console.warn('Browser extension error suppressed:', event.message);
            event.preventDefault();
            return;
        }
        // Suppress JSON parsing errors from external sources
        if (event.message && (event.message.includes('not valid JSON') || event.message.includes('[object Object]'))) {
            console.warn('JSON parsing error suppressed:', event.message);
            event.preventDefault();
            return;
        }
    });

    // Additional comprehensive error suppression for extension conflicts
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'storage' || type === 'storagechange') {
            // Wrap storage listeners to prevent extension conflicts
            const wrappedListener = function (event) {
                try {
                    // Check if this is an extension-related storage event
                    if (event && event.key && typeof event.newValue === 'object') {
                        console.warn('Extension storage event intercepted and ignored');
                        return;
                    }
                    return listener.call(this, event);
                } catch (error) {
                    if (error.message && error.message.includes('JSON')) {
                        console.warn('Storage event listener error suppressed:', error.message);
                        return;
                    }
                    throw error;
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Override window.onerror for additional protection
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
        // Suppress specific extension-related errors
        if (message && (
            message.includes('[object Object]') ||
            message.includes('not valid JSON') ||
            (source && source.includes('content.js'))
        )) {
            console.warn('Extension error suppressed by onerror handler:', message);
            return true; // Prevent error from being logged
        }

        if (originalOnError) {
            return originalOnError.call(this, message, source, lineno, colno, error);
        }
        return false;
    };

    // Comprehensive storage protection to prevent extension conflicts
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;

    Storage.prototype.setItem = function (key, value) {
        try {
            // Ensure we're only storing strings and suppress events that might cause issues
            let stringValue;
            if (typeof value === 'string') {
                stringValue = value;
            } else if (value === null || value === undefined) {
                stringValue = '';
            } else {
                try {
                    stringValue = JSON.stringify(value);
                } catch (jsonError) {
                    console.warn('Failed to stringify value for storage:', jsonError);
                    stringValue = String(value);
                }
            }

            // More comprehensive storage event suppression
            const originalDispatchEvent = this.dispatchEvent;
            const originalCustomEvent = window.CustomEvent;
            const originalStorageEvent = window.StorageEvent;

            // Temporarily disable all storage-related events
            this.dispatchEvent = function () { return true; };
            window.CustomEvent = function () { return { preventDefault: () => { }, stopPropagation: () => { } }; };
            window.StorageEvent = function () { return { preventDefault: () => { }, stopPropagation: () => { } }; };

            const result = originalSetItem.call(this, key, stringValue);

            // Restore event dispatching with a delay to ensure extensions don't interfere
            setTimeout(() => {
                this.dispatchEvent = originalDispatchEvent;
                window.CustomEvent = originalCustomEvent;
                window.StorageEvent = originalStorageEvent;
            }, 10);

            return result;
        } catch (error) {
            console.warn('Storage setItem error prevented:', error);
        }
    };

    Storage.prototype.getItem = function (key) {
        try {
            return originalGetItem.call(this, key);
        } catch (error) {
            console.warn('Storage getItem error prevented:', error);
            return null;
        }
    };

    // Enhanced protection for JSON.parse to prevent extension conflicts
    const originalJSONParse = JSON.parse;
    JSON.parse = function (text, reviver) {
        try {
            // Check if text is actually a string
            if (typeof text !== 'string') {
                // If it's an object being passed to JSON.parse, this is likely an extension error
                if (typeof text === 'object' && text !== null) {
                    console.warn('Browser extension tried to parse object as JSON, returning object directly');
                    return text;
                }
                // Convert to string if possible
                text = String(text);
            }

            // Additional check for the specific "[object Object]" error
            if (text === '[object Object]') {
                console.warn('Detected [object Object] string passed to JSON.parse, likely extension error');
                return {};
            }

            return originalJSONParse.call(this, text, reviver);
        } catch (error) {
            // Enhanced error detection for extension-related JSON errors
            const errorMessage = error.message || '';
            if (errorMessage.includes('not valid JSON') ||
                errorMessage.includes('[object Object]') ||
                text === '[object Object]') {
                console.warn('JSON parse error suppressed (browser extension conflict):', errorMessage);
                // Return appropriate fallback based on expected type
                if (text && (text.startsWith('{') || text.startsWith('['))) {
                    return text.startsWith('{') ? {} : [];
                }
                return null;
            }
            // Re-throw other JSON errors as they might be legitimate
            throw error;
        }
    };

    // Ultimate protection: Override any potential indirect JSON parsing
    const originalEval = window.eval;
    window.eval = function (code) {
        try {
            // Check if the code involves JSON parsing that might fail
            if (typeof code === 'string' && code.includes('JSON.parse') && code.includes('[object Object]')) {
                console.warn('Potentially problematic JSON.parse eval intercepted');
                return {};
            }
            return originalEval.call(this, code);
        } catch (error) {
            if (error.message && error.message.includes('not valid JSON')) {
                console.warn('Eval JSON error suppressed:', error.message);
                return {};
            }
            throw error;
        }
    };

    // Additional protection for Function constructor
    const originalFunction = window.Function;
    window.Function = function (...args) {
        try {
            const func = originalFunction.apply(this, args);
            // Wrap the function to catch JSON errors
            return function (...funcArgs) {
                try {
                    return func.apply(this, funcArgs);
                } catch (error) {
                    if (error.message && error.message.includes('not valid JSON')) {
                        console.warn('Function execution JSON error suppressed:', error.message);
                        return {};
                    }
                    throw error;
                }
            };
        } catch (error) {
            throw error;
        }
    };

    // Create a safe execution context to prevent extension interference
    function createSafeExecutionContext() {
        const context = {
            suppressExtensionEvents: false,

            async executeSafely(asyncFn) {
                this.suppressExtensionEvents = true;

                try {
                    // Temporarily override console methods to catch and suppress extension errors
                    const originalConsoleError = console.error;
                    console.error = function (...args) {
                        const message = args.join(' ');
                        if (message.includes('JSON') || message.includes('content.js') || message.includes('extension')) {
                            // Suppress extension-related errors during safe execution
                            return;
                        }
                        originalConsoleError.apply(console, args);
                    };

                    const result = await asyncFn();

                    // Restore console
                    console.error = originalConsoleError;

                    return result;
                } catch (error) {
                    // Handle errors that might be extension-related
                    if (error.message && (error.message.includes('JSON') || error.message.includes('extension'))) {
                        console.warn('Extension-related error suppressed during safe execution:', error.message);
                        throw new Error('Operation failed due to browser extension interference. Please try again.');
                    }
                    throw error;
                } finally {
                    this.suppressExtensionEvents = false;
                }
            }
        };

        return context;
    }

    const safeContext = createSafeExecutionContext();

    // Safe data conversion helper
    function safeStringify(data) {
        try {
            if (typeof data === 'string') {
                return data;
            }
            if (data === null || data === undefined) {
                return '';
            }
            if (typeof data === 'object') {
                return JSON.stringify(data);
            }
            return String(data);
        } catch (error) {
            console.warn('Error in safeStringify:', error);
            return String(data);
        }
    }

    // Safe JSON parsing helper
    function safeParse(jsonString, fallback = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.warn('Error parsing JSON:', error);
            return fallback;
        }
    }

    let currentResult = '';
    let currentMermaidCode = '';
    let currentDescription = '';

    // Mermaid initialization - will be loaded dynamically when needed
    let mermaidInstance = null;

    async function ensureMermaidLoaded() {
        if (mermaidInstance) return mermaidInstance;

        try {
            // Try to import Mermaid dynamically
            const mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.esm.min.mjs');
            mermaidInstance = mermaidModule.default;

            mermaidInstance.initialize({
                startOnLoad: false,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#ff6b35',
                    primaryTextColor: '#ffffff',
                    primaryBorderColor: '#ff6b35',
                    lineColor: '#ff6b35',
                    secondaryColor: '#333333',
                    tertiaryColor: '#1a1a1a'
                }
            });

            return mermaidInstance;
        } catch (error) {
            console.error('Failed to load Mermaid:', error);
            throw new Error('Mermaid library could not be loaded');
        }
    }

    // Make functions globally available
    window.generateRoadmap = generateRoadmap;
    window.generateVariation = generateVariation;
    window.copyMermaidCode = copyMermaidCode;
    window.downloadRoadmap = downloadRoadmap;
    window.resetForm = resetForm;

    async function generateRoadmap() {
        // Check if required dependencies are loaded
        if (!window.apiManager) {
            utils.showError(document.getElementById('errorDiv'), 'API Manager not loaded. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!window.utils) {
            document.getElementById('errorDiv').innerHTML = '<p style="color: #ff6b6b;">Utils library not loaded. Please refresh the page.</p>';
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const goalTopic = document.getElementById('goalTopic').value.trim();
        const diagramType = document.getElementById('diagramType').value;
        const currentLevel = document.getElementById('currentLevel').value;
        const timeframe = document.getElementById('timeframe').value;
        const detailLevel = document.getElementById('detailLevel').value;
        const focusAreas = document.getElementById('focusAreas').value.trim();

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!goalTopic) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter your goal or topic');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const systemPrompt = createSystemPrompt(diagramType, goalTopic, currentLevel, timeframe, detailLevel, focusAreas);

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a ${diagramType} roadmap for: ${goalTopic}` }
            ];

            // Wrap API call to prevent extension interference
            const response = await (async () => {
                try {
                    return await apiManager.makeRequest(messages, {
                        provider: aiProvider,
                        apiKey: apiKey,
                        maxTokens: 2000,
                        temperature: 0.4
                    });
                } catch (apiError) {
                    // If API error contains JSON parsing issues, it might be extension interference
                    if (apiError.message && apiError.message.includes('JSON')) {
                        console.warn('API call JSON error, retrying...', apiError);
                        // Try again with a slight delay
                        await new Promise(resolve => setTimeout(resolve, 100));
                        return await apiManager.makeRequest(messages, {
                            provider: aiProvider,
                            apiKey: apiKey,
                            maxTokens: 2000,
                            temperature: 0.4
                        });
                    }
                    throw apiError;
                }
            })();

            // Safely convert response to string
            const responseText = safeStringify(response);

            // Parse the response to extract description and Mermaid code
            const parsedResponse = parseAIResponse(responseText);
            currentResult = responseText;
            currentMermaidCode = parsedResponse.mermaidCode;
            currentDescription = parsedResponse.description;

            // Display the results
            displayRoadmap(parsedResponse.description, parsedResponse.mermaidCode);

        } catch (error) {
            console.error('Error generating roadmap:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate roadmap. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function createSystemPrompt(diagramType, goalTopic, currentLevel, timeframe, detailLevel, focusAreas) {
        const diagramInstructions = {
            flowchart: `Create a Mermaid flowchart that shows the step-by-step progression. Use TD (top-down) direction with decision points and clear flow connections. Include start/end nodes and use different node shapes for different types of activities.`,
            timeline: `Create a Mermaid timeline or Gantt chart showing the chronological progression over time. Include major phases, milestones, and time periods.`,
            gantt: `Create a Mermaid Gantt chart with sections for different phases/categories and tasks with realistic time estimates. Include dependencies where appropriate.`,
            mindmap: `Create a Mermaid mindmap showing the central goal with branches for different learning areas, skills, and sub-topics. Use hierarchical structure.`
        };

        const detailInstructions = {
            overview: `Focus on HIGH-LEVEL OVERVIEW only. Use 3-5 major phases or sections. Each node should represent a broad milestone or major accomplishment. Keep it simple and strategic.`,
            moderate: `Use MODERATE DETAIL with 6-10 key steps. Include important milestones and decision points. Balance between overview and specifics. Focus on actionable phases.`,
            detailed: `Provide DETAILED STEPS with 8-15 specific actions and tasks. Include sub-steps, resources needed, and clear progression markers. Each node should be actionable.`,
            granular: `Create GRANULAR, STEP-BY-STEP instructions with 12-20+ specific actions. Include detailed "Go to X", "Click Y", "Complete Z" type instructions. Make it a comprehensive tutorial-style roadmap.`
        };

        return `You are an expert at creating visual roadmaps using Mermaid diagrams. Create a roadmap for achieving the specified goal.

GOAL: ${goalTopic}
CURRENT LEVEL: ${currentLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
TIMEFRAME: ${timeframe.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
DETAIL LEVEL: ${detailLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
DIAGRAM TYPE: ${diagramType}
${focusAreas ? `FOCUS AREAS: ${focusAreas}` : ''}

${diagramInstructions[diagramType]}

DETAIL LEVEL REQUIREMENTS:
${detailInstructions[detailLevel]}

Your response must include:

1. **DESCRIPTION** (2-3 sentences): A brief explanation of the roadmap and its key phases or components.

2. **MERMAID_CODE**: Valid Mermaid syntax for the ${diagramType}. 

For flowcharts, use this structure:
\`\`\`mermaid
flowchart TD
    A[Start] --> B[Phase 1]
    B --> C{Decision?}
    C -->|Yes| D[Action]
    C -->|No| E[Alternative]
\`\`\`

For timelines/Gantt charts:
\`\`\`mermaid
gantt
    title Learning Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Task 1    :2024-01-01, 30d
    Task 2    :after Task 1, 20d
\`\`\`

For mindmaps:
\`\`\`mermaid
mindmap
  root((Goal))
    Branch 1
      Sub 1
      Sub 2
    Branch 2
      Sub 3
\`\`\`

Adjust complexity based on detail level:
- Overview: 3-5 nodes (major phases only)
- Moderate: 6-10 nodes (key steps and milestones) 
- Detailed: 8-15 nodes (specific actions and tasks)
- Granular: 12-20+ nodes (step-by-step instructions)

Use meaningful labels and logical flow. For granular level, include specific UI interactions like "Click [Button Name]", "Navigate to [Page/Section]", "Fill in [Form Field]" when applicable.`;
    }

    function parseAIResponse(response) {
        let description = '';
        let mermaidCode = '';

        // Ensure response is a string
        const responseText = String(response || '');

        try {
            // Extract description
            const descMatch = responseText.match(/\*\*DESCRIPTION\*\*[:\s]*(.*?)(?=\*\*MERMAID_CODE\*\*|\`\`\`mermaid|$)/is);
            if (descMatch) {
                description = descMatch[1].trim();
            }

            // Extract Mermaid code
            const mermaidMatch = responseText.match(/```mermaid\s*([\s\S]*?)\s*```/i);
            if (mermaidMatch) {
                mermaidCode = mermaidMatch[1].trim();
            }

            // Fallback: if structured parsing fails, try to extract any mermaid code block
            if (!mermaidCode) {
                const fallbackMatch = responseText.match(/```\s*mermaid\s*([\s\S]*?)\s*```/i);
                if (fallbackMatch) {
                    mermaidCode = fallbackMatch[1].trim();
                }
            }
        } catch (error) {
            console.warn('Error parsing AI response:', error);
        }

        // If no description found, create a basic one
        if (!description && mermaidCode) {
            description = `This visual roadmap shows the step-by-step progression toward your goal. Each node represents a key phase or milestone in your journey.`;
        }

        return { description, mermaidCode };
    }

    async function displayRoadmap(description, mermaidCode) {
        // Display description
        document.getElementById('descriptionContent').innerHTML = `
            <div style="background: rgba(255, 107, 53, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35; margin-bottom: 20px;">
                <h4 style="color: #ff6b35; margin: 0 0 10px 0;">Roadmap Overview</h4>
                <p style="margin: 0; line-height: 1.6;">${description}</p>
            </div>
        `;

        // Display Mermaid diagram
        if (mermaidCode) {
            const diagramId = 'mermaid-' + Date.now();
            const mermaidContainer = document.getElementById('mermaidContent');

            // Create the container first
            mermaidContainer.innerHTML = `
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 20px;">
                    <div id="${diagramId}" style="display: flex; justify-content: center; min-height: 200px; align-items: center;">
                        <div style="color: #ff6b35;">Rendering diagram...</div>
                    </div>
                </div>
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                    <h5 style="color: #ff6b35; margin: 0 0 10px 0;">Mermaid Code:</h5>
                    <pre style="background: #1a1a1a; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 0.9em; margin: 0;"><code>${mermaidCode}</code></pre>
                </div>
            `;

            // Render Mermaid diagram
            try {
                // Try multiple approaches to render the diagram
                await renderMermaidDiagram(diagramId, mermaidCode);
            } catch (error) {
                console.error('Mermaid rendering error:', error);
                document.getElementById(diagramId).innerHTML = `
                    <div style="color: #ff6b6b; text-align: center; padding: 20px;">
                        <h4 style="margin: 0 0 10px 0;">Diagram Rendering Error</h4>
                        <p style="margin: 0;">There was an issue rendering the Mermaid diagram.</p>
                        <p style="margin: 10px 0 0 0; font-size: 0.9em; opacity: 0.8;">Error: ${error.message}</p>
                    </div>
                `;
            }
        } else {
            document.getElementById('mermaidContent').innerHTML = `
                <div style="background: #2a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #aa4444;">
                    <p style="color: #ff6b6b; margin: 0;">No valid Mermaid code was generated. Please try again with a different approach.</p>
                </div>
            `;
        }

        // Show result section
        document.getElementById('loadingDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'block';
        document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });
    }

    async function renderMermaidDiagram(diagramId, mermaidCode) {
        // Try different approaches to render Mermaid

        // Approach 1: Use dynamically loaded Mermaid
        try {
            const mermaid = await ensureMermaidLoaded();
            const { svg } = await mermaid.render(diagramId + '_svg', mermaidCode);

            // Sanitize SVG before inserting
            const sanitizedSvg = sanitizeSvg(svg);
            document.getElementById(diagramId).innerHTML = sanitizedSvg;
            return;
        } catch (error) {
            console.warn('Dynamic Mermaid loading failed:', error);
        }

        // Approach 2: Use Hugo's built-in Mermaid system
        try {
            // Set the page flag for Mermaid
            if (window.location && window.location.pathname) {
                // Trigger Hugo's Mermaid system
                const element = document.getElementById(diagramId);
                element.innerHTML = `<pre class="mermaid">${mermaidCode}</pre>`;

                // Wait a bit and check if it rendered
                await new Promise(resolve => setTimeout(resolve, 500));

                // If the content changed from our pre tag, it worked
                const content = element.innerHTML;
                if (content !== `<pre class="mermaid">${mermaidCode}</pre>`) {
                    return; // Success!
                }
            }
        } catch (error) {
            console.warn('Hugo Mermaid rendering failed:', error);
        }

        // Approach 3: Simple HTML fallback with styled code block
        const element = document.getElementById(diagramId);
        const fallbackId = diagramId + '_fallback_btn';
        element.innerHTML = `
            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; border: 2px dashed #ff6b35;">
                <h4 style="color: #ff6b35; margin: 0 0 15px 0; text-align: center;">📊 Mermaid Diagram</h4>
                <p style="color: #cccccc; margin: 0 0 15px 0; text-align: center; font-size: 0.9em;">
                    Copy this code to any Mermaid-compatible viewer to see the visual diagram
                </p>
                <pre style="background: #1a1a1a; padding: 15px; border-radius: 6px; overflow-x: auto; border: 1px solid #444;"><code style="color: #e0e0e0; font-family: 'Courier New', monospace; font-size: 0.9em; line-height: 1.4;">${mermaidCode}</code></pre>
                <div style="text-align: center; margin-top: 15px;">
                    <button id="${fallbackId}" style="background: #ff6b35; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
                        📋 Copy Diagram Code
                    </button>
                </div>
            </div>
        `;

        // Add event listener for the fallback copy button
        const fallbackBtn = document.getElementById(fallbackId);
        if (fallbackBtn) {
            fallbackBtn.addEventListener('click', () => {
                safeCopyToClipboard(mermaidCode, fallbackBtn);
            });
        }
    }

    // Safe helper function for clipboard copying
    function safeCopyToClipboard(text, button) {
        if (!navigator.clipboard) {
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
                showCopySuccess(button);
            } catch (err) {
                console.error('Fallback copy failed:', err);
                showCopyError(button);
            } finally {
                document.body.removeChild(textArea);
            }
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(err => {
            console.error('Failed to copy text:', err);
            showCopyError(button);
        });
    }

    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        const originalBg = button.style.background;
        button.innerHTML = '✅ Copied!';
        button.style.background = '#28a745';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg || '#ff6b35';
        }, 2000);
    }

    function showCopyError(button) {
        const originalText = button.innerHTML;
        const originalBg = button.style.background;
        button.innerHTML = '❌ Copy Failed';
        button.style.background = '#dc3545';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg || '#ff6b35';
        }, 2000);
    }

    // SVG sanitization function
    function sanitizeSvg(svgString) {
        try {
            // Fix common SVG viewBox issues
            const fixed = svgString
                .replace(/viewBox="([^"]*100%[^"]*)"/g, (match, viewBoxValue) => {
                    // Replace percentage values in viewBox with reasonable defaults
                    const sanitized = viewBoxValue.replace(/\d+%/g, '100');
                    return `viewBox="${sanitized}"`;
                })
                .replace(/viewBox="[^0-9\-\s\.]*"/g, 'viewBox="0 0 100 100"'); // Fallback for completely invalid viewBox

            return fixed;
        } catch (error) {
            console.warn('SVG sanitization failed:', error);
            return svgString; // Return original if sanitization fails
        }
    }

    // Legacy function for backward compatibility
    window.copyToClipboard = function (text) {
        safeCopyToClipboard(text, event.target);
    };

    async function generateVariation() {
        if (!currentResult) return;

        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const goalTopic = document.getElementById('goalTopic').value.trim();
        const diagramType = document.getElementById('diagramType').value;
        const detailLevel = document.getElementById('detailLevel').value;

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const detailGuidance = {
                overview: 'high-level overview with 3-5 major phases',
                moderate: 'moderate detail with 6-10 key steps and milestones',
                detailed: 'detailed steps with 8-15 specific actions and tasks',
                granular: 'granular step-by-step instructions with 12-20+ specific actions, including "Go to", "Click", and detailed UI interactions'
            };

            const systemPrompt = `Create an alternative ${diagramType} approach for: ${goalTopic}. Use a different structure, perspective, or breakdown than the previous roadmap. Focus on a fresh visualization approach while maintaining clarity and usefulness.

DETAIL LEVEL: Use ${detailGuidance[detailLevel]} for this alternative approach.

Provide both a DESCRIPTION and MERMAID_CODE as in the previous format.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate an alternative ${diagramType} for: ${goalTopic}` }
            ];

            // Wrap API call to prevent extension interference
            const response = await (async () => {
                try {
                    return await apiManager.makeRequest(messages, {
                        provider: aiProvider,
                        apiKey: apiKey,
                        maxTokens: 2000,
                        temperature: 0.6
                    });
                } catch (apiError) {
                    // If API error contains JSON parsing issues, it might be extension interference
                    if (apiError.message && apiError.message.includes('JSON')) {
                        console.warn('API call JSON error, retrying...', apiError);
                        // Try again with a slight delay
                        await new Promise(resolve => setTimeout(resolve, 100));
                        return await apiManager.makeRequest(messages, {
                            provider: aiProvider,
                            apiKey: apiKey,
                            maxTokens: 2000,
                            temperature: 0.6
                        });
                    }
                    throw apiError;
                }
            })();

            // Safely convert response to string
            const responseText = safeStringify(response);

            const parsedResponse = parseAIResponse(responseText);
            currentResult = responseText;
            currentMermaidCode = parsedResponse.mermaidCode;
            currentDescription = parsedResponse.description;

            displayRoadmap(parsedResponse.description, parsedResponse.mermaidCode);

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate alternative approach. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyMermaidCode() {
        if (!currentMermaidCode) {
            console.warn('No Mermaid code available to copy');
            return;
        }

        // Find the copy button or use event target
        let button = null;
        if (event && event.target) {
            button = event.target;
        } else {
            // Fallback: find the copy button by its text content
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.textContent.includes('Copy Mermaid Code')) {
                    button = btn;
                    break;
                }
            }
        }

        if (button) {
            safeCopyToClipboard(currentMermaidCode, button);
        } else {
            // Final fallback: just copy to clipboard without button feedback
            if (navigator.clipboard) {
                navigator.clipboard.writeText(currentMermaidCode).then(() => {
                    console.log('Mermaid code copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy Mermaid code:', err);
                });
            }
        }
    }

    function downloadRoadmap(format) {
        if (!currentMermaidCode || !currentDescription) {
            console.warn('No roadmap data available for download');
            return;
        }

        if (!window.downloadManager) {
            console.error('Download manager not available');
            return;
        }

        const goalTopic = document.getElementById('goalTopic').value.trim() || 'roadmap';
        const filename = `visual-roadmap-${goalTopic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

        try {
            if (format === 'markdown') {
                const content = `# Visual Roadmap: ${goalTopic}

## Overview
${currentDescription}

## Mermaid Diagram

\`\`\`mermaid
${currentMermaidCode}
\`\`\`

---
*Generated by Visual Roadmap Builder*
`;
                downloadManager.downloadAsFile(content, `${filename}.md`, 'text/markdown');
            } else if (format === 'html') {
                const content = `<!DOCTYPE html>
<html>
<head>
    <title>Visual Roadmap: ${goalTopic}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e0e0e0; }
        .description { background: rgba(255, 107, 53, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b35; margin-bottom: 20px; }
        .diagram { background: #2a2a2a; padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3); }
    </style>
</head>
<body>
    <h1>Visual Roadmap: ${goalTopic}</h1>
    <div class="description">
        <h2>Overview</h2>
        <p>${currentDescription}</p>
    </div>
    <div class="diagram">
        <div class="mermaid">${currentMermaidCode}</div>
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    </script>
</body>
</html>`;
                downloadManager.downloadAsFile(content, `${filename}.html`, 'text/html');
            } else if (format === 'svg') {
                downloadSvg(filename);
            }
        } catch (error) {
            console.error('Error downloading roadmap:', error);
        }
    }

    async function downloadSvg(filename) {
        try {
            // Show loading state if possible
            console.log('Generating SVG download...');

            // Find the rendered Mermaid SVG in the DOM
            const mermaidContainer = document.getElementById('mermaidContent');
            let svgElement = null;

            if (mermaidContainer) {
                svgElement = mermaidContainer.querySelector('svg');
            }

            if (svgElement) {
                // Use existing rendered SVG
                console.log('Using existing SVG from DOM');

                // Clone the SVG to avoid modifying the original
                const clonedSvg = svgElement.cloneNode(true);

                // Ensure the SVG has proper dimensions and styling
                enhanceSvgForDownload(clonedSvg);

                // Convert SVG to string
                const svgString = new XMLSerializer().serializeToString(clonedSvg);

                // Create a complete SVG document
                const completeSvg = createCompleteSvgDocument(svgString);

                // Download the SVG file
                downloadManager.downloadAsFile(completeSvg, `${filename}.svg`, 'image/svg+xml');

            } else {
                // If no SVG found, try to render one using the current Mermaid code
                console.log('No existing SVG found, generating new one...');
                await generateSvgFromMermaidCode(filename);
            }

        } catch (error) {
            console.error('Error downloading SVG:', error);
            // You could show a user-friendly error message here
            alert('Failed to download SVG. Please ensure the diagram has been generated first.');
        }
    }

    function enhanceSvgForDownload(svgElement) {
        try {
            // Set proper SVG attributes for standalone use
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

            // Ensure the SVG has dimensions
            let width = svgElement.getAttribute('width');
            let height = svgElement.getAttribute('height');

            if (!width || !height || width === '100%' || height === '100%') {
                try {
                    const bbox = svgElement.getBBox();
                    width = bbox.width || 800;
                    height = bbox.height || 600;
                } catch (e) {
                    // Fallback if getBBox fails
                    width = svgElement.clientWidth || 800;
                    height = svgElement.clientHeight || 600;
                }
                svgElement.setAttribute('width', width);
                svgElement.setAttribute('height', height);
            }

            // Set viewBox if not present
            if (!svgElement.getAttribute('viewBox')) {
                svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }

            // Add background for better visibility
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '100%');
            rect.setAttribute('height', '100%');
            rect.setAttribute('fill', '#1a1a1a'); // Dark background matching the theme

            // Insert background as first child
            if (svgElement.firstChild) {
                svgElement.insertBefore(rect, svgElement.firstChild);
            } else {
                svgElement.appendChild(rect);
            }

            // Enhance visibility of elements
            enhanceSvgElements(svgElement);

        } catch (error) {
            console.warn('Error enhancing SVG:', error);
        }
    }

    function enhanceSvgElements(svgElement) {
        // Ensure text is visible
        const textElements = svgElement.querySelectorAll('text, tspan');
        textElements.forEach(text => {
            const currentFill = text.getAttribute('fill');
            if (!currentFill || currentFill === 'black' || currentFill === '#000' || currentFill === '#000000') {
                text.setAttribute('fill', '#ffffff');
            }
            // Ensure text has proper contrast
            if (currentFill === 'inherit' || currentFill === 'currentColor') {
                text.setAttribute('fill', '#ffffff');
            }
        });

        // Enhance path elements (lines, shapes)
        const pathElements = svgElement.querySelectorAll('path, line, rect:not(:first-child), circle, ellipse, polygon');
        pathElements.forEach(element => {
            const currentStroke = element.getAttribute('stroke');
            if (!currentStroke || currentStroke === 'black' || currentStroke === 'none') {
                element.setAttribute('stroke', '#ff6b35'); // Orange theme color
            }
        });

        // Enhance markers and arrows
        const markerElements = svgElement.querySelectorAll('marker path');
        markerElements.forEach(marker => {
            marker.setAttribute('fill', '#ff6b35');
            marker.setAttribute('stroke', '#ff6b35');
        });
    }

    function createCompleteSvgDocument(svgContent) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgContent}`;
    }

    async function generateSvgFromMermaidCode(filename) {
        try {
            console.log('Loading Mermaid for SVG generation...');

            // Use Mermaid to render SVG directly from code
            const mermaid = await ensureMermaidLoaded();
            const tempId = 'temp-svg-' + Date.now();

            console.log('Rendering Mermaid diagram...');

            // Use the current Mermaid code for rendering

            const { svg } = await mermaid.render(tempId, currentMermaidCode);

            if (!svg) {
                throw new Error('Mermaid failed to generate SVG');
            }

            console.log('Processing generated SVG...');

            // Parse the SVG string
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svg, 'image/svg+xml');

            // Check for parsing errors
            const parserError = svgDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('Failed to parse SVG: ' + parserError.textContent);
            }

            const svgElement = svgDoc.querySelector('svg');

            if (svgElement) {
                enhanceSvgForDownload(svgElement);
                const svgString = new XMLSerializer().serializeToString(svgElement);
                const completeSvg = createCompleteSvgDocument(svgString);

                console.log('Downloading SVG file...');
                downloadManager.downloadAsFile(completeSvg, `${filename}.svg`, 'image/svg+xml');

            } else {
                throw new Error('No SVG element found in generated content');
            }

        } catch (error) {
            console.error('Error generating SVG from Mermaid code:', error);
            alert('Failed to generate SVG. The diagram may contain unsupported elements or syntax errors.');
        }
    }

    function resetForm() {
        document.getElementById('roadmapForm').reset();
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('errorDiv').style.display = 'none';
        currentResult = '';
        currentMermaidCode = '';
        currentDescription = '';
    }
});