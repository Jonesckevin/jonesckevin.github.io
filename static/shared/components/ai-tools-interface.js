/**
 * Centralized AI Interface Component
 * A reusable component for AI provider selection, API key management, and response handling
 */

class AIInterface {
    constructor(options = {}) {
        this.containerId = options.containerId || 'ai-interface';
        this.onSubmit = options.onSubmit || null;
        this.submitButtonText = options.submitButtonText || 'Generate';
        this.submitButtonIcon = options.submitButtonIcon || '🤖';
        this.formId = options.formId || 'ai-form';
        this.resultId = options.resultId || 'ai-result';
        this.includeResponseLength = options.includeResponseLength !== false;
        this.includeModelSelect = options.includeModelSelect !== false;
        this.responseLengthOptions = options.responseLengthOptions || [
            { value: 'short', label: 'Short (~150 words)' },
            { value: 'medium', label: 'Medium (~500 words)' },
            { value: 'long', label: 'Long (~1000+ words)' }
        ];
        this.customFields = options.customFields || [];

        this.init();
    }

    init() {
        this.createHTML();
        this.attachEventListeners();
        this.loadStoredCredentials();
    }

    createHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        const customFieldsHTML = this.customFields.map(field => {
            switch (field.type) {
                case 'text':
                    return `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                            <input type="text" id="${field.id}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                        </div>
                    `;
                case 'textarea':
                    return `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                            <textarea id="${field.id}" rows="${field.rows || 4}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                        </div>
                    `;
                case 'select':
                    const options = field.options.map(opt =>
                        `<option value="${opt.value}">${opt.label}</option>`
                    ).join('');
                    return `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
                            <select id="${field.id}" ${field.required ? 'required' : ''}>
                                ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
                                ${options}
                            </select>
                        </div>
                    `;
                case 'checkbox':
                    return `
                        <div class="form-group">
                            <label class="checkbox-inline" for="${field.id}">
                                <input type="checkbox" id="${field.id}" ${field.checked ? 'checked' : ''}>
                                ${field.label}
                            </label>
                            ${field.description ? `<small style="opacity: 0.7; display: block; margin-top: 5px;">${field.description}</small>` : ''}
                        </div>
                    `;
                case 'custom':
                    return field.html || '';
                default:
                    return '';
            }
        }).join('');

        const responseLengthHTML = this.includeResponseLength ? `
            <div class="form-group">
                <label for="ai-response-length">Response Length</label>
                <select id="ai-response-length">
                    ${this.responseLengthOptions.map(opt =>
            `<option value="${opt.value}">${opt.label}</option>`
        ).join('')}
                </select>
            </div>
        ` : '';

        const modelSelectHTML = '';

        container.innerHTML = `
            <form id="${this.formId}">
                ${modelSelectHTML}

                ${customFieldsHTML}

                ${responseLengthHTML}

                <button type="submit" class="btn-primary">${this.submitButtonIcon} ${this.submitButtonText}</button>
            </form>

            <div id="${this.resultId}" class="result-container" style="display: none;">
                <!-- Results will be displayed here -->
            </div>
        `;

        // Normalize checkbox layout: group consecutive checkbox fields into a centered row
        try {
            const formEl = container.querySelector(`#${this.formId}`);
            if (formEl) this._groupConsecutiveCheckboxes(formEl);
        } catch (err) {
            console.warn('Checkbox grouping failed:', err);
        }
    }

    attachEventListeners() {
        const form = document.getElementById(this.formId);

        if (form && this.onSubmit) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }
    }

    async handleSubmit(event) {
        const resultDiv = document.getElementById(this.resultId);

        try {
            // Get AI provider settings
            const provider = window.apiManager ? window.apiManager.getProvider() : 'openai';
            const apiKey = window.apiManager ? window.apiManager.getApiKey()?.trim() : '';

            // Validation
            if (!window.utils || !window.utils.validateApiKey(apiKey, provider)) {
                const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic', gemini: 'Gemini', grok: 'Grok (X.AI)' };
                if (window.utils) {
                    window.utils.showError(resultDiv, `Please enter a valid ${providerNames[provider]} API key`);
                } else {
                    resultDiv.innerHTML = `<div class="error">Please enter a valid ${providerNames[provider]} API key</div>`;
                }
                resultDiv.style.display = 'block';
                return;
            }

            // Set API provider and key
            if (window.apiManager) {
                window.apiManager.setProvider(provider);
                window.apiManager.setApiKey(apiKey);
            }

            // Get form data
            const formData = this.getFormData();

            // Show loading
            resultDiv.style.display = 'block';
            if (window.utils) {
                window.utils.showLoading(resultDiv);
            } else {
                resultDiv.innerHTML = '<div class="loading">Processing...</div>';
            }

            // Call the custom onSubmit handler
            if (this.onSubmit) {
                await this.onSubmit(formData, resultDiv);
            }

        } catch (error) {
            console.error('Error:', error);
            if (window.utils) {
                window.utils.showError(resultDiv, error.message || 'An error occurred while processing your request.');
            } else {
                resultDiv.innerHTML = `<div class="error">${error.message || 'An error occurred while processing your request.'}</div>`;
            }
            resultDiv.style.display = 'block';
        }
    }

    getFormData() {
        const data = {};

        if (this.includeResponseLength) {
            const responseLength = document.getElementById('ai-response-length');
            if (responseLength) {
                data.responseLength = responseLength.value;
            }
        }

        // Get custom field values
        this.customFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                switch (field.type) {
                    case 'checkbox':
                        data[field.id] = element.checked;
                        break;
                    default:
                        data[field.id] = element.value;
                        break;
                }
            }
        });

        return data;
    }

    displayResult(content, title = 'Generated Content', downloadBaseName = 'generated-content') {
        const resultDiv = document.getElementById(this.resultId);

        // Set content in download manager for proper conversion
        if (window.downloadManager) {
            window.downloadManager.setContent(content, 'markdown');

            // Convert markdown to HTML for display
            const htmlContent = window.downloadManager.currentContent.html;

            // Group by H1 sections into cards
            const sections = [];
            (function () {
                const temp = document.createElement('div');
                temp.innerHTML = htmlContent;
                let current = null;
                Array.from(temp.childNodes).forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'h1') {
                        current && sections.push(current);
                        current = document.createElement('div');
                        current.className = 'ai-card';
                        current.appendChild(node.cloneNode(true));
                    } else {
                        if (!current) {
                            current = document.createElement('div');
                            current.className = 'ai-card';
                        }
                        current.appendChild(node.cloneNode(true));
                    }
                });
                if (current) sections.push(current);
            })();

            const groupedHtml = sections.length ? sections.map(function (s) { return s.outerHTML; }).join('') : (`<div class="ai-card">${htmlContent}</div>`);

            // Display result with grouped output and download buttons
            resultDiv.innerHTML = `
                <h3 style="color: #ff6b35; margin-bottom: 20px;">${title}</h3>
                <div class="ai-result-stack">${groupedHtml}</div>
                ${window.downloadManager ? window.downloadManager.createDownloadButtons(downloadBaseName) : ''}
            `;

            // Store for backward compatibility (legacy download functions)
            window.currentResponse = content;
            window.currentHtmlContent = htmlContent;
            window.currentTxtContent = window.downloadManager.currentContent.txt;
        } else {
            // Fallback if download manager not available
            resultDiv.innerHTML = `
                <h3 style="color: #ff6b35; margin-bottom: 20px;">${title}</h3>
                <div class="result-content">${content}</div>
            `;
        }

        resultDiv.style.display = 'block';
    }

    showError(message) {
        const resultDiv = document.getElementById(this.resultId);
        if (window.utils) {
            window.utils.showError(resultDiv, message);
        } else {
            resultDiv.innerHTML = `<div class="error">${message}</div>`;
        }
        resultDiv.style.display = 'block';
    }

    showLoading() {
        const resultDiv = document.getElementById(this.resultId);
        if (window.utils) {
            window.utils.showLoading(resultDiv);
        } else {
            resultDiv.innerHTML = '<div class="loading">Processing...</div>';
        }
        resultDiv.style.display = 'block';
    }

    // Method to add custom validation
    addValidation(fieldId, validationFn, errorMessage) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => {
                if (!validationFn(field.value)) {
                    field.setCustomValidity(errorMessage);
                } else {
                    field.setCustomValidity('');
                }
            });
        }
    }

    // Group 2+ consecutive checkbox form-groups into a single centered row using global styles
    _groupConsecutiveCheckboxes(formEl) {
        const children = Array.from(formEl.children);
        let group = [];

        const isCheckboxGroup = (node) => {
            if (!node || !node.classList || !node.classList.contains('form-group')) return false;
            return !!node.querySelector('label > input[type="checkbox"]');
        };

        const flush = () => {
            if (group.length < 2) { group = []; return; }
            // Create wrapper
            const wrapperFG = document.createElement('div');
            wrapperFG.className = 'form-group';
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-group';
            const row = document.createElement('div');
            row.className = 'checkbox-row';
            wrapper.appendChild(row);
            wrapperFG.appendChild(wrapper);

            // Insert before the first group's position
            const first = group[0];
            formEl.insertBefore(wrapperFG, first);

            // Move labels into the row; preserve any descriptions below
            group.forEach(fg => {
                const label = fg.querySelector('label');
                const smalls = Array.from(fg.querySelectorAll('small'));
                if (label) {
                    label.classList.add('checkbox-inline');
                    row.appendChild(label);
                }
                // Append descriptions after the row
                smalls.forEach(sm => wrapperFG.appendChild(sm));
                fg.remove();
            });

            group = [];
        };

        for (let i = 0; i < children.length; i++) {
            const el = children[i];
            if (isCheckboxGroup(el)) {
                group.push(el);
            } else {
                flush();
            }
        }
        flush();
    }
}

// Global download functions (for backward compatibility)
function copyResponse() {
    if (window.currentResponse && window.downloadManager) {
        window.downloadManager.copyToClipboard('markdown').then(success => {
            // Find the copy button and show feedback
            const buttons = document.querySelectorAll('button');
            const copyButton = Array.from(buttons).find(btn => btn.textContent.includes('Copy'));
            if (copyButton) {
                window.downloadManager._showCopyFeedback(copyButton, success);
            }
        });
    }
}

function downloadMarkdown(baseName) {
    if (window.currentResponse && window.downloadManager) {
        window.downloadManager.setContent(window.currentResponse, 'markdown');
        window.downloadManager.download('markdown', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

function downloadHtml(baseName) {
    if (window.currentResponse && window.downloadManager) {
        window.downloadManager.setContent(window.currentResponse, 'markdown');
        window.downloadManager.download('html', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

function downloadTxt(baseName) {
    if (window.currentResponse && window.downloadManager) {
        window.downloadManager.setContent(window.currentResponse, 'markdown');
        window.downloadManager.download('txt', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIInterface;
}