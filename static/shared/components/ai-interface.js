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
        this.normalizeLegacyButtons();
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

                <button type="submit" class="generate-btn btn-primary action-btn">${this.submitButtonIcon} ${this.submitButtonText}</button>
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
        const providerSelect = document.getElementById('ai-provider');
        const apiKeyInput = document.getElementById('ai-api-key');
        const modelSelect = document.getElementById('ai-model');

        if (form && this.onSubmit) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }

        // Provider/api/model events are handled globally via header controls
    }

    async handleSubmit(event) {
        const resultDiv = document.getElementById(this.resultId);

        try {
            // Get AI provider settings
            const provider = apiManager.getProvider();
            const apiKey = apiManager.getApiKey()?.trim();

            // Validation
            if (!utils.validateApiKey(apiKey, provider)) {
                const providerNames = { openai: 'OpenAI', cohere: 'Cohere', deepseek: 'DeepSeek', anthropic: 'Anthropic', gemini: 'Gemini', grok: 'Grok (X.AI)' };
                utils.showError(resultDiv, `Please enter a valid ${providerNames[provider]} API key`);
                resultDiv.style.display = 'block';
                return;
            }

            // Set API provider and key
            apiManager.setProvider(provider);
            apiManager.setApiKey(apiKey);

            // Get form data
            const formData = this.getFormData();

            // Show loading
            resultDiv.style.display = 'block';
            utils.showLoading(resultDiv);

            // Call the custom onSubmit handler
            if (this.onSubmit) {
                await this.onSubmit(formData, resultDiv);
            }

        } catch (error) {
            console.error('Error:', error);
            utils.showError(resultDiv, error.message || 'An error occurred while processing your request.');
            resultDiv.style.display = 'block';
        }
    }

    getFormData() {
        const data = {
            provider: document.getElementById('ai-provider').value,
            apiKey: document.getElementById('ai-api-key').value.trim()
        };

        const modelEl = document.getElementById('ai-model');
        if (this.includeModelSelect && modelEl) {
            data.model = modelEl.value || null;
        }

        if (this.includeResponseLength) {
            data.responseLength = document.getElementById('ai-response-length').value;
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

    // Header manages placeholder; keep method for backward compatibility (no-op)
    updateApiKeyPlaceholder(provider) { /* handled in header */ }

    loadStoredCredentials() {
        const storedKey = apiManager.getApiKey();
        const storedProvider = apiManager.getProvider();
        const storedModel = apiManager.getModel(storedProvider);

        // Header inputs reflect stored values; nothing to populate here now

        // Attempt to load models if we have key+provider
        if (this.includeModelSelect) {
            this.tryLoadModels(storedModel);
        }
    }

    resetModelSelect() {
        // Model select lives in header; keep for backward compatibility
    }

    debouncedLoadModels = (() => {
        let t;
        return () => {
            clearTimeout(t);
            t = setTimeout(() => this.tryLoadModels(), 400);
        };
    })();

    async tryLoadModels(preselectModel = null) {
        // Model select is managed by header; nothing to load here.
        return;

        try {
            if (help) help.textContent = 'Loading models…';
            const models = await apiManager.listModels(provider, key);
            if (!Array.isArray(models) || models.length === 0) {
                if (help) help.textContent = 'No chat models available for this key/provider.';
                return;
            }
            // Populate select
            modelSelect.innerHTML = models.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
            modelSelect.disabled = false;

            // Determine selection: saved model or provider default
            const desired = preselectModel || apiManager.getModel(provider) || apiManager.getProviderConfig(provider).defaultModel;
            const found = Array.from(modelSelect.options).some(opt => opt.value === desired);
            modelSelect.value = found ? desired : modelSelect.options[0].value;
            apiManager.setModel(modelSelect.value, provider);
            if (help) help.textContent = 'Model list loaded from provider.';
        } catch (err) {
            console.error('Failed to load models:', err);
            if (help) help.textContent = err.message || 'Failed to load models.';
        }
    }

    displayResult(content, title = 'Generated Content', downloadBaseName = 'generated-content') {
        const resultDiv = document.getElementById(this.resultId);

        // Set content in download manager for proper conversion
        downloadManager.setContent(content, 'markdown');

        // Convert markdown to HTML for display
        const htmlContent = downloadManager.currentContent.html;

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
            <div class="result-display">
                <h3 style="color: #ff6b35; margin-bottom: 20px;">${title}</h3>
                <div class="ai-result-stack">${groupedHtml}</div>
                <div class="result-actions">${downloadManager.createDownloadButtons(downloadBaseName)}</div>
            </div>
        `;

        // Store for backward compatibility (legacy download functions)
        window.currentResponse = content;
        window.currentHtmlContent = htmlContent;
        window.currentTxtContent = downloadManager.currentContent.txt;

        resultDiv.style.display = 'block';

        // After injecting result markup, normalize any action buttons
        this.normalizeLegacyButtons(resultDiv);
    }

    showError(message) {
        const resultDiv = document.getElementById(this.resultId);
        utils.showError(resultDiv, message);
        resultDiv.style.display = 'block';
    }

    showLoading() {
        const resultDiv = document.getElementById(this.resultId);
        utils.showLoading(resultDiv);
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

    // Add btn-primary/action-btn classes to legacy buttons that pre-date shared styling
    normalizeLegacyButtons(scope = document) {
        try {
            const buttons = scope.querySelectorAll('button');
            buttons.forEach(btn => {
                const id = btn.id || '';
                const cls = btn.className || '';
                // Identify generate / primary actions
                if (/generate/i.test(id) || /generate-btn/.test(cls)) {
                    if (!btn.classList.contains('generate-btn')) btn.classList.add('generate-btn');
                    if (!btn.classList.contains('btn-primary')) btn.classList.add('btn-primary');
                    if (!btn.classList.contains('action-btn')) btn.classList.add('action-btn');
                }
                // Copy / download / regenerate etc.
                if (/(copy|download|regenerate)/i.test(id) || /(copy-btn|download-btn|regenerate-btn)/.test(cls)) {
                    if (!btn.classList.contains('action-btn')) btn.classList.add('action-btn');
                    if (!btn.classList.contains('btn-primary')) btn.classList.add('btn-primary');
                }
                // Secondary variant preservation
                if (/regenerate/i.test(id) && !btn.classList.contains('secondary')) {
                    btn.classList.add('secondary');
                }
            });
        } catch (e) {
            console.warn('Button normalization failed:', e);
        }
    }
}

// Global download functions (for backward compatibility)
function copyResponse() {
    if (window.currentResponse) {
        downloadManager.copyToClipboard('markdown').then(success => {
            // Find the copy button and show feedback
            const buttons = document.querySelectorAll('button');
            const copyButton = Array.from(buttons).find(btn => btn.textContent.includes('Copy'));
            if (copyButton) {
                downloadManager._showCopyFeedback(copyButton, success);
            }
        });
    }
}

function downloadMarkdown(baseName) {
    if (window.currentResponse) {
        downloadManager.setContent(window.currentResponse, 'markdown');
        downloadManager.download('markdown', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

function downloadHtml(baseName) {
    if (window.currentResponse) {
        downloadManager.setContent(window.currentResponse, 'markdown');
        downloadManager.download('html', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

function downloadTxt(baseName) {
    if (window.currentResponse) {
        downloadManager.setContent(window.currentResponse, 'markdown');
        downloadManager.download('txt', baseName.replace(/_\d{4}-\d{2}-\d{2}$/, ''));
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIInterface;
}
