/**
 * Utility functions for the AI Tools platform
 */

window.utils = {
    // API Key validation
    validateApiKey(key, provider = 'openai') {
        if (!key || typeof key !== 'string') {
            // Custom provider doesn't require an API key
            return provider === 'custom' ? true : false;
        }

        const patterns = {
            openai: /^sk-[A-Za-z0-9_-]+$/,
            cohere: /^[A-Za-z0-9_-]+$/,
            deepseek: /^sk-[A-Za-z0-9_-]+$/,
            anthropic: /^sk-ant-[A-Za-z0-9_-]+$/,
            gemini: /^AIza[A-Za-z0-9_-]+$/,
            grok: /^xai-[A-Za-z0-9_-]+$/,
            mistral: /^[A-Za-z0-9_-]+$/, // Flexible pattern for Mistral keys
            perplexity: /^pplx-[A-Za-z0-9_-]+$/,
            custom: null // No pattern required - API key is optional
        };

        const pattern = patterns[provider];

        // Custom provider accepts any key or no key
        if (provider === 'custom') {
            return true;
        }

        return pattern ? pattern.test(key.trim()) : false;
    },

    // Response length mapping
    getResponseLengthPrompt(length) {
        const prompts = {
            short: 'Keep your response concise and focused, around 150 words.',
            medium: 'Provide a comprehensive response, around 500 words.',
            long: 'Give a detailed and thorough response, 1000+ words with comprehensive coverage.'
        };
        return prompts[length] || prompts.medium;
    },

    // Loading state management
    showLoading(container, message = 'Processing your request...') {
        if (!container) return;
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ff6b35;">
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #ff6b35; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
                <div style="font-size: 1.1rem; font-weight: 500;">${message}</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        container.style.display = 'block';
        try { container.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { }
    },

    // Error state management
    showError(container, message = 'An error occurred') {
        if (!container) return;
        container.innerHTML = `
            <div class="error-display">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Error</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        container.style.display = 'block';
        try { container.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { }
    },

    // Success state management
    showSuccess(container, message = 'Success!') {
        if (!container) return;
        container.innerHTML = `
            <div style="background: rgba(0, 204, 68, 0.1); border: 2px solid #00cc44; border-radius: 10px; padding: 20px; text-align: center; color: #00cc44;">
                <div style="font-size: 1.5rem; margin-bottom: 10px;">✅</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Success</div>
                <div>${message}</div>
            </div>
        `;
        container.style.display = 'block';
        try { container.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { }
    },

    // Content formatting helpers (robust Markdown -> HTML)
    // options.wrap: if true (default), wraps output in .result-display div for color-coded headings
    formatMarkdown(content, options = {}) {
        const { wrap = true } = options;
        if (!content || typeof content !== 'string') return '';

        const lines = content.replace(/\r\n?/g, '\n').split('\n');
        const out = [];

        let inParagraph = false;
        let inOl = false;
        let inUl = false;
        let inBlockquote = false;
        let inCode = false;
        let codeLang = '';
        let codeBuffer = [];

        function closeParagraph() {
            if (inParagraph) {
                out.push('</p>');
                inParagraph = false;
            }
        }
        function closeLists() {
            if (inOl) { out.push('</ol>'); inOl = false; }
            if (inUl) { out.push('</ul>'); inUl = false; }
        }
        function closeBlockquote() {
            if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false; }
        }
        function flushCode() {
            if (inCode) {
                const langClass = codeLang ? ` class="language-${codeLang.toLowerCase()}"` : '';
                const escaped = codeBuffer.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;');
                out.push(`<pre><code${langClass}>${escaped}\n</code></pre>`);
                inCode = false; codeLang = ''; codeBuffer = [];
            }
        }

        // Inline transformers
        const inline = (text) => {
            if (!text) return '';
            // Inline code first to protect contents from further formatting
            text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
            // Links [text](url)
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            // Bold (**text**) and (__text__)
            text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // Underscore bold with word-boundary-like guards to avoid mid-word underscores
            text = text.replace(/(^|[^A-Za-z0-9_])__([^_][\s\S]*?)__(?![A-Za-z0-9_])/g, '$1<strong>$2</strong>');
            // Italic with asterisk (*text*)
            text = text.replace(/(^|[^A-Za-z0-9*])\*([^*\n][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
            // Italic with underscore (_text_) with guards to avoid mid-word matches and double underscores
            text = text.replace(/(^|[^A-Za-z0-9_])_([^_\n][^_]*?)_(?!_)/g, '$1<em>$2</em>');
            return text;
        };

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Fenced code blocks ```lang
            const fenceMatch = line.match(/^```\s*([A-Za-z0-9_+-]*)\s*$/);
            if (fenceMatch) {
                if (inCode) {
                    // closing fence
                    flushCode();
                } else {
                    // opening fence
                    closeParagraph();
                    closeLists();
                    closeBlockquote();
                    inCode = true;
                    codeLang = fenceMatch[1] || '';
                }
                continue;
            }

            if (inCode) { codeBuffer.push(line); continue; }

            // Horizontal rule
            if (/^\s*([-*_]){3,}\s*$/.test(line)) {
                closeParagraph();
                closeLists();
                closeBlockquote();
                out.push('<hr>');
                continue;
            }

            // Headings
            const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (hMatch) {
                const level = hMatch[1].length;
                const text = inline(hMatch[2].trim());
                closeParagraph();
                closeLists();
                closeBlockquote();
                out.push(`<h${level}>${text}</h${level}>`);
                continue;
            }

            // Blockquote (single level)
            const bqMatch = line.match(/^>\s?(.*)$/);
            if (bqMatch) {
                closeParagraph();
                closeLists();
                if (!inBlockquote) { out.push('<blockquote>'); inBlockquote = true; }
                const text = inline(bqMatch[1]);
                out.push(`<p>${text}</p>`);
                continue;
            } else {
                // Close blockquote if previously open and current line isn't a quote
                if (inBlockquote && line.trim() !== '') {
                    closeBlockquote();
                }
            }

            // Ordered list
            let olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
            if (olMatch) {
                closeParagraph();
                if (inUl) { out.push('</ul>'); inUl = false; }
                if (!inOl) { out.push('<ol>'); inOl = true; }
                out.push(`<li>${inline(olMatch[1].trim())}</li>`);
                continue;
            }

            // Unordered list
            let ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);
            if (ulMatch) {
                closeParagraph();
                if (inOl) { out.push('</ol>'); inOl = false; }
                if (!inUl) { out.push('<ul>'); inUl = true; }
                out.push(`<li>${inline(ulMatch[1].trim())}</li>`);
                continue;
            }

            // Blank line: close paragraph and blockquote (keep lists until a non-list line)
            if (line.trim() === '') {
                closeParagraph();
                if (inBlockquote) closeBlockquote();
                continue;
            }

            // Normal paragraph text
            const text = inline(line.trim());
            if (!inParagraph) {
                closeLists(); // lists end when a normal paragraph starts
                out.push('<p>');
                inParagraph = true;
                out.push(text);
            } else {
                out.push('<br>' + text);
            }
        }

        // Flush any open blocks
        flushCode();
        closeParagraph();
        closeLists();
        closeBlockquote();

        const html = out.join('\n');

        // Optional: trigger Prism highlighting if available
        let finalHtml = html;
        try {
            if (window.Prism) {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                window.Prism.highlightAllUnder(temp);
                finalHtml = temp.innerHTML;
            }
        } catch (_) { }

        // Wrap in .result-display for color-coded headings (unless disabled or already wrapped)
        if (wrap && !finalHtml.includes('class="result-display"')) {
            return `<div class="result-display">${finalHtml}</div>`;
        }
        return finalHtml;
    },

    // Date/time helpers
    getCurrentTimestamp() {
        return new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
    },

    getCurrentDate() {
        return new Date().toISOString().slice(0, 10);
    },

    // File size formatting
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Text processing
    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    // Word count
    countWords(text) {
        if (!text || typeof text !== 'string') return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Random selection helpers
    randomChoice(array) {
        if (!Array.isArray(array) || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    },

    randomChoices(array, count = 1) {
        if (!Array.isArray(array) || array.length === 0) return [];
        const result = [];
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // URL helpers
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    // Local storage helpers
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to storage:', error);
            return false;
        }
    },

    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to load from storage:', error);
            return defaultValue;
        }
    },

    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from storage:', error);
            return false;
        }
    },

    // Form helpers
    getFormData(formElement) {
        if (!formElement) return {};

        const formData = new FormData(formElement);
        const data = {};

        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes, multi-select)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    // Debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
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
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Generate unique ID
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Deep clone object
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    // Format number
    formatNumber(num, decimals = 0) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // File reading helper - text
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },

    // File reading helper - binary (for audio/video uploads)
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    },

    // Validate file size (default 100MB for audio/video)
    validateFileSize(file, maxMB = 100) {
        const maxBytes = maxMB * 1024 * 1024;
        return {
            valid: file.size <= maxBytes,
            size: file.size,
            limit: maxBytes,
            sizeFormatted: this.formatFileSize(file.size),
            limitFormatted: this.formatFileSize(maxBytes)
        };
    },

    // Format bytes to human-readable size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Format seconds to [HH:MM:SS] timestamp
    formatTimestamp(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `[${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}]`;
    },

    // ===== CENTRALIZED RESULT DISPLAY FUNCTIONS =====

    /**
     * Display AI-generated result with standard formatting and buttons
     * @param {string} containerId - ID of result container element
     * @param {string} markdownContent - Markdown content to display
     * @param {Object} options - Display options
     * @param {boolean} options.showButtons - Show copy/download buttons (default: true)
     * @param {string} options.buttonContainerId - ID for button container (default: containerId + '-actions')
     * @returns {void}
     */
    showResult(containerId, markdownContent, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        const htmlContent = this.formatMarkdown(markdownContent);

        container.innerHTML = `<div class="result-display">${htmlContent}</div>`;
        container.style.display = 'block';

        // Smooth scroll to result
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    },

    /**
     * Copy text to clipboard with visual feedback on button
     * @param {string} text - Text to copy
     * @param {HTMLElement} buttonElement - Button element to show feedback on
     * @returns {Promise<boolean>} - Success status
     */
    async copyWithFeedback(text, buttonElement) {
        const success = await this.copyToClipboard(text);

        if (success && buttonElement) {
            const originalText = buttonElement.innerHTML;
            const originalBg = buttonElement.style.background;

            buttonElement.innerHTML = '✅ Copied!';
            buttonElement.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.style.background = originalBg || '';
            }, 2000);
        }

        return success;
    },

    /**
     * Standard download function using downloadManager
     * @param {string} content - Content to download
     * @param {string} format - 'markdown', 'html', or 'txt'
     * @param {string} baseFilename - Base filename without extension
     * @returns {void}
     */
    downloadContent(content, format, baseFilename) {
        if (typeof downloadManager === 'undefined') {
            console.error('downloadManager not loaded');
            return;
        }

        const filename = `${baseFilename}_${this.getCurrentTimestamp()}`;
        downloadManager.setContent(content, 'markdown');
        downloadManager.download(format, filename);
    },

    /**
     * Show standard result with copy/download buttons
     * @param {Object} config - Configuration object
     * @param {string} config.resultContainerId - ID of result display container
     * @param {string} config.buttonsContainerId - ID of buttons container
     * @param {string} config.content - Markdown content to display
     * @param {string} config.toolName - Name for downloaded files
     * @returns {void}
     */
    displayResultWithActions(config) {
        const {
            resultContainerId,
            buttonsContainerId,
            content,
            toolName = 'ai-tool-output'
        } = config;

        // Display the result
        this.showResult(resultContainerId, content);

        // Update buttons to use the current content
        const buttonsContainer = document.getElementById(buttonsContainerId);
        if (buttonsContainer) {
            // Store content reference for button handlers
            window.__currentResult = content;
            window.__currentToolName = toolName;
        }
    },

    /**
     * Create standard copy function for tool
     * Returns a function that can be assigned to window.copyResult
     * @param {Function} getContentFn - Function that returns current content
     * @returns {Function} - Copy function
     */
    createCopyFunction(getContentFn) {
        return async function (event) {
            const content = getContentFn();
            if (!content) {
                console.error('No content to copy');
                return false;
            }

            const success = await window.utils.copyToClipboard(content);

            if (success && event?.target) {
                const btn = event.target;
                const originalText = btn.innerHTML;
                const originalBg = btn.style.background;

                btn.innerHTML = '✅ Copied!';
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = originalBg || '';
                }, 2000);
            } else if (!success) {
                window.utils.showError(
                    document.getElementById('errorDiv'),
                    'Failed to copy to clipboard. Please try selecting and copying manually.'
                );
            }

            return success;
        };
    },

    /**
     * Create standard download function for tool
     * Returns a function that can be assigned to window.downloadResult
     * @param {Function} getContentFn - Function that returns current content
     * @param {string} toolName - Base name for downloads
     * @returns {Function} - Download function
     */
    createDownloadFunction(getContentFn, toolName) {
        return function (format) {
            const content = getContentFn();
            if (!content) {
                console.error('No content to download');
                return false;
            }

            if (typeof downloadManager === 'undefined') {
                console.error('downloadManager not loaded');
                window.utils.showError(
                    document.getElementById('errorDiv'),
                    'Download manager not available. Please refresh the page.'
                );
                return false;
            }

            const filename = `${toolName}_${window.utils.getCurrentTimestamp()}`;
            downloadManager.setContent(content, 'markdown');
            downloadManager.download(format, filename);

            return true;
        };
    },

    /**
     * Register standard copy/download actions for a tool
     * Wires up window.copyResult and window.downloadResult with 2s visual feedback
     * @param {string} toolName - Base name for downloaded files
     * @param {Function} getContentFn - Function that returns current result content
     * @param {Object} options - Optional configuration
     * @param {Function} options.getFilenameFn - Custom filename generator (receives format)
     */
    registerToolActions(toolName, getContentFn, options = {}) {
        const { getFilenameFn } = options;

        // Standard copy with 2s feedback
        window.copyResult = async function(event) {
            const content = getContentFn();
            if (!content) {
                console.error('No content to copy');
                return false;
            }

            const success = await window.utils.copyToClipboard(content);
            const btn = event?.target?.closest('button') || event?.target;

            if (success && btn) {
                const originalText = btn.innerHTML;
                const originalBg = btn.style.background;

                btn.innerHTML = '✅ Copied!';
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = originalBg || '';
                }, 2000);
            }

            return success;
        };

        // Standard download with format support
        window.downloadResult = function(format) {
            const content = getContentFn();
            if (!content) {
                console.error('No content to download');
                return false;
            }

            if (typeof downloadManager === 'undefined') {
                console.error('downloadManager not loaded');
                return false;
            }

            // Use custom filename or default pattern
            const filename = getFilenameFn 
                ? getFilenameFn(format) 
                : `${toolName}_${window.utils.getCurrentTimestamp()}`;

            downloadManager.setContent(content, 'markdown');
            downloadManager.download(format, filename);

            return true;
        };

        console.log(`✅ Tool actions registered for: ${toolName}`);
    },

    // Normalize legacy buttons site-wide to ensure shared styles apply
    normalizeButtons(scope = document) {
        try {
            const buttons = scope.querySelectorAll('button');
            buttons.forEach(btn => {
                const id = btn.id || '';
                const cls = btn.className || '';
                // Primary generate actions
                if (/generate/i.test(id) || /generate-btn/.test(cls)) {
                    if (!btn.classList.contains('generate-btn')) btn.classList.add('generate-btn');
                    if (!btn.classList.contains('btn-primary')) btn.classList.add('btn-primary');
                    if (!btn.classList.contains('action-btn')) btn.classList.add('action-btn');
                }
                // Secondary actions (copy/download) - removed regenerate
                if (/(copy|download)/i.test(id) || /(copy-btn|download-btn)/.test(cls)) {
                    if (!btn.classList.contains('action-btn')) btn.classList.add('action-btn');
                }
            });
        } catch (e) {
            console.warn('Global button normalization failed:', e);
        }
    },

    /**
     * Render color swatches for color palette preview
     * Used by color-palette-story-prompt and similar color-aware tools
     * @param {Array<string>} colors - Array of color values (hex, rgb, etc.)
     * @param {string} containerId - ID of container element to render swatches into
     * @param {Object} options - Optional configuration
     * @param {boolean} options.large - Use large swatches with labels (default: false)
     * @param {boolean} options.showLabels - Show color value labels (default: false for small, true for large)
     * @returns {void}
     */
    renderColorSwatches(colors, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        if (!Array.isArray(colors) || colors.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        const { large = false, showLabels = large } = options;
        const swatchClass = large ? 'color-swatch-large' : 'color-swatch';

        const swatchesHtml = colors.map(color => {
            const colorValue = color.trim();
            if (large && showLabels) {
                return `<div class="${swatchClass}" style="background-color: ${colorValue};" title="${colorValue}">
                    <span class="color-label">${colorValue}</span>
                </div>`;
            }
            return `<div class="${swatchClass}" style="background-color: ${colorValue};" title="${colorValue}"></div>`;
        }).join('');

        container.innerHTML = swatchesHtml;
        container.className = 'color-preview-grid';
        container.style.display = colors.length > 0 ? 'grid' : 'none';
    }
};

// Global, non-invasive enhancement: normalize buttons after DOM load
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.utils && window.utils.normalizeButtons(document));
    } else {
        window.utils && window.utils.normalizeButtons(document);
    }
} catch (_) { }