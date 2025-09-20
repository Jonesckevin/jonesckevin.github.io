/**
 * Utility functions for the AI Tools platform
 */

window.utils = {
    // API Key validation
    validateApiKey(key, provider = 'openai') {
        if (!key || typeof key !== 'string') return false;

        const patterns = {
            openai: /^sk-[A-Za-z0-9_-]+$/,
            deepseek: /^sk-[A-Za-z0-9_-]+$/,
            anthropic: /^sk-ant-[A-Za-z0-9_-]+$/,
            gemini: /^AIza[A-Za-z0-9_-]+$/
        };

        const pattern = patterns[provider];
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
    },

    // Error state management
    showError(container, message = 'An error occurred') {
        if (!container) return;
        container.innerHTML = `
            <div style="background: rgba(255, 68, 68, 0.1); border: 2px solid #ff4444; border-radius: 10px; padding: 20px; text-align: center; color: #ff4444;">
                <div style="font-size: 1.5rem; margin-bottom: 10px;">⚠️</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Error</div>
                <div>${message}</div>
            </div>
        `;
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
    },

    // Content formatting helpers
    formatMarkdown(content) {
        if (!content) return '';

        let html = content
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .replace(/^[\s\n]+|[\s\n]+$/g, ''); // Trim

        // Headers (must come before bold formatting)
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // Lists - Ordered lists
        html = html.replace(/^\d+\.\s+(.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

        // Lists - Unordered lists  
        html = html.replace(/^[-*+]\s+(.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Fix nested lists
        html = html.replace(/<\/ol>\s*<ol>/g, '');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // Bold and italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Blockquotes
        html = html.replace(/^>\s+(.*$)/gm, '<blockquote>$1</blockquote>');

        // Paragraphs - split by double newlines and wrap in <p> tags
        const paragraphs = html.split(/\n\s*\n/);
        html = paragraphs.map(p => {
            p = p.trim();
            if (!p) return '';
            // Don't wrap if it's already a block element
            if (p.match(/^<(h[1-6]|ul|ol|blockquote|div)/)) {
                return p;
            }
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).filter(p => p).join('\n');

        return html;
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

    // File reading helper
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
};