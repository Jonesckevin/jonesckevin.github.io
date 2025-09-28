/**
 * API Manager - Centralized AI provider management
 */

class APIManager {
    constructor() {
        this.providers = {
            openai: {
                name: 'OpenAI',
                baseURL: 'https://api.openai.com/v1',
                defaultModel: 'gpt-4o-mini',
                keyPattern: /^sk-[A-Za-z0-9_-]+$/
            },
            deepseek: {
                name: 'DeepSeek',
                baseURL: 'https://api.deepseek.com/v1',
                defaultModel: 'deepseek-chat',
                keyPattern: /^sk-[A-Za-z0-9_-]+$/
            },
            anthropic: {
                name: 'Anthropic',
                baseURL: 'https://api.anthropic.com/v1',
                defaultModel: 'claude-3-haiku-20240307',
                keyPattern: /^sk-ant-[A-Za-z0-9_-]+$/
            },
            gemini: {
                name: 'Google Gemini',
                baseURL: 'https://generativelanguage.googleapis.com/v1beta',
                defaultModel: 'gemini-1.5-flash',
                keyPattern: /^AIza[A-Za-z0-9_-]+$/
            }
        };

        this.currentProvider = this.getStoredProvider() || 'openai';
        this.currentApiKey = this.getStoredApiKey() || '';
        this.currentModels = {};
    }

    // Provider management
    getProvider() {
        return this.currentProvider;
    }

    setProvider(provider) {
        if (!this.providers[provider]) {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        this.currentProvider = provider;
        sessionStorage.setItem('ai_provider', provider);
    }

    getProviderConfig(provider = null) {
        const p = provider || this.currentProvider;
        return this.providers[p] || this.providers.openai;
    }

    // API Key management
    getApiKey() {
        return this.currentApiKey;
    }

    setApiKey(key) {
        this.currentApiKey = key;
        sessionStorage.setItem('ai_api_key', key);
    }

    // Model management
    getModel(provider = null) {
        const p = provider || this.currentProvider;
        return this.currentModels[p] || this.getProviderConfig(p).defaultModel;
    }

    setModel(model, provider = null) {
        const p = provider || this.currentProvider;
        this.currentModels[p] = model;
        sessionStorage.setItem(`ai_model_${p}`, model);
    }

    // Storage helpers
    getStoredProvider() {
        return sessionStorage.getItem('ai_provider');
    }

    getStoredApiKey() {
        return sessionStorage.getItem('ai_api_key');
    }

    getStoredModel(provider) {
        return sessionStorage.getItem(`ai_model_${provider}`);
    }

    // API operations
    async makeRequest(messages, options = {}) {
        const provider = options.provider || this.currentProvider;
        const apiKey = options.apiKey || this.currentApiKey;
        const model = options.model || this.getModel(provider);

        if (!apiKey) {
            throw new Error('API key is required');
        }

        const config = this.getProviderConfig(provider);

        switch (provider) {
            case 'openai':
            case 'deepseek':
                return this._makeOpenAIStyleRequest(config, apiKey, model, messages, options);
            case 'anthropic':
                return this._makeAnthropicRequest(config, apiKey, model, messages, options);
            case 'gemini':
                return this._makeGeminiRequest(config, apiKey, model, messages, options);
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    async _makeOpenAIStyleRequest(config, apiKey, model, messages, options) {
        const response = await fetch(`${config.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.7,
                ...options.extraParams
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async _makeAnthropicRequest(config, apiKey, model, messages, options) {
        // Convert OpenAI format to Anthropic format
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        const response = await fetch(`${config.baseURL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                messages: userMessages,
                system: systemMessage?.content || '',
                max_tokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.7,
                ...options.extraParams
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async _makeGeminiRequest(config, apiKey, model, messages, options) {
        // Convert OpenAI format to Gemini format
        const parts = messages.map(m => ({ text: `${m.role}: ${m.content}` }));

        const response = await fetch(`${config.baseURL}/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    maxOutputTokens: options.maxTokens || 2000,
                    temperature: options.temperature || 0.7,
                    ...options.extraParams
                }
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async listModels(provider = null, apiKey = null) {
        const p = provider || this.currentProvider;
        const key = apiKey || this.currentApiKey;
        const config = this.getProviderConfig(p);

        if (!key) {
            throw new Error('API key is required to list models');
        }

        switch (p) {
            case 'openai':
            case 'deepseek':
                return this._listOpenAIStyleModels(config, key);
            case 'anthropic':
                // Anthropic currently requires manual model enumeration (API model listing limited)
                return this._getAnthropicModels();
            case 'gemini':
                return this._getGeminiModels();
            default:
                throw new Error(`Unsupported provider: ${p}`);
        }
    }

    async _listOpenAIStyleModels(config, apiKey) {
        const response = await fetch(`${config.baseURL}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.status}`);
        }

        const data = await response.json();
        return data.data
            .filter(model => model.id.includes('gpt') || model.id.includes('chat') || model.id.includes('deepseek'))
            .map(model => ({
                id: model.id,
                label: model.id
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    _getAnthropicModels() {
        return [
            { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
            { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
            { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
            { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' }
        ];
    }

    _getGeminiModels() {
        return [
            { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
            { id: 'gemini-pro', label: 'Gemini Pro' }
        ];
    }

    _getFallbackModels() {
        // Deprecated: explicit fallback removed per requirements.
        return [];
    }
}

// Initialize stored models on load
document.addEventListener('DOMContentLoaded', () => {
    const apiManager = new APIManager();

    // Load stored models for each provider
    Object.keys(apiManager.providers).forEach(provider => {
        const storedModel = apiManager.getStoredModel(provider);
        if (storedModel) {
            apiManager.currentModels[provider] = storedModel;
        }
    });

    window.apiManager = apiManager;
    // Dispatch a custom event so late listeners (like header) can react
    document.dispatchEvent(new CustomEvent('apiManagerReady'));
});

// Export for use in other files
window.APIManager = APIManager;