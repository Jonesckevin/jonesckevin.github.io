/**
 * API Manager - Centralized AI provider management
 * Features:
 * - Multi-provider support (OpenAI, DeepSeek, Anthropic, Gemini, Grok)
 * - Automatic seed randomization for unique responses
 * - Centralized configuration and error handling
 */

class APIManager {
    constructor() {
        this.providers = {
            openai: {
                name: 'OpenAI',
                baseURL: 'https://api.openai.com/v1',
                defaultModel: 'gpt-4o-mini',
                keyPattern: /^sk-[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            deepseek: {
                name: 'DeepSeek',
                baseURL: 'https://api.deepseek.com/v1',
                defaultModel: 'deepseek-chat',
                keyPattern: /^sk-[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            anthropic: {
                name: 'Anthropic',
                baseURL: 'https://api.anthropic.com/v1',
                defaultModel: 'claude-3-haiku-20240307',
                keyPattern: /^sk-ant-[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            gemini: {
                name: 'Google Gemini',
                baseURL: 'https://generativelanguage.googleapis.com/v1beta',
                defaultModel: 'gemini-1.5-flash',
                keyPattern: /^AIza[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            grok: {
                name: 'Grok (X.AI)',
                baseURL: 'https://api.x.ai/v1',
                defaultModel: 'grok-beta',
                keyPattern: /^xai-[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            mistral: {
                name: 'Mistral AI',
                baseURL: 'https://api.mistral.ai/v1',
                defaultModel: 'mistral-small-latest',
                keyPattern: /^[A-Za-z0-9_\-]+$/,
                requiresKey: true
            },
            custom: {
                name: 'Custom Server (Ollama/LMStudio)',
                baseURL: 'http://localhost:11434/v1', // Default Ollama
                defaultModel: 'llama2',
                keyPattern: null, // No pattern required - API key is optional
                requiresKey: false,
                presets: {
                    ollama: { host: 'localhost', port: '11434', name: 'Ollama' },
                    lmstudio: { host: 'localhost', port: '1234', name: 'LM Studio' }
                }
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
            throw new Error('Unsupported provider: ' + provider);
        }
        this.currentProvider = provider;
        sessionStorage.setItem('ai_provider', provider);
    }

    getProviderConfig(provider = null) {
        const p = provider || this.currentProvider;
        const config = this.providers[p] || this.providers.openai;

        // For custom provider, use stored endpoint or default
        if (p === 'custom') {
            const customEndpoint = this.getStoredCustomEndpoint();
            if (customEndpoint) {
                return {
                    ...config,
                    baseURL: customEndpoint
                };
            }
        }

        return config;
    }

    // Custom endpoint management for custom provider
    setCustomEndpoint(host, port, protocol = 'http') {
        const endpoint = `${protocol}://${host}:${port}/v1`;
        sessionStorage.setItem('ai_custom_endpoint', endpoint);
        sessionStorage.setItem('ai_custom_host', host);
        sessionStorage.setItem('ai_custom_port', port);
        sessionStorage.setItem('ai_custom_protocol', protocol);

        // Update the provider config
        if (this.currentProvider === 'custom') {
            this.providers.custom.baseURL = endpoint;
        }
    }

    getStoredCustomEndpoint() {
        return sessionStorage.getItem('ai_custom_endpoint');
    }

    getStoredCustomHost() {
        return sessionStorage.getItem('ai_custom_host') || 'localhost';
    }

    getStoredCustomPort() {
        return sessionStorage.getItem('ai_custom_port') || '11434';
    }

    getStoredCustomProtocol() {
        return sessionStorage.getItem('ai_custom_protocol') || 'http';
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
        sessionStorage.setItem('ai_model_' + p, model);
    }

    // Storage helpers
    getStoredProvider() {
        return sessionStorage.getItem('ai_provider');
    }

    getStoredApiKey() {
        return sessionStorage.getItem('ai_api_key');
    }

    getStoredModel(provider) {
        return sessionStorage.getItem('ai_model_' + provider);
    }

    // Generate a random seed based on current time for unique responses
    _generateRandomSeed() {
        const now = new Date();
        const timeComponents = [
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
        ];

        // Create a pseudo-random seed using time components
        const timeString = timeComponents.join('');
        let seed = 0;
        for (let i = 0; i < timeString.length; i++) {
            seed = ((seed << 5) - seed + parseInt(timeString.charAt(i))) & 0xffffffff;
        }

        // Ensure positive integer and reasonable range for AI models
        return Math.abs(seed) % 2147483647;
    }

    // Allow manual seed setting for reproducible results
    setRandomSeed(seed) {
        this.customSeed = seed;
        console.log('Custom seed set: ' + seed);
    }

    // Clear custom seed to return to time-based randomization
    clearCustomSeed() {
        this.customSeed = undefined;
        console.log('Custom seed cleared, returning to time-based randomization');
    }

    // Helper function to remove <thinking> tags and their content
    _stripThinkingTags(text) {
        if (!text) return text;
        // Remove <thinking>...</thinking> blocks (including multiline)
        return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
    }

    // API operations
    async makeRequest(messages, options = {}) {
        const provider = options.provider || this.currentProvider;
        const apiKey = options.apiKey || this.currentApiKey;
        const model = options.model || this.getModel(provider);

        const config = this.getProviderConfig(provider);

        // Check if API key is required for this provider
        if (config.requiresKey && !apiKey) {
            throw new Error('API key is required for ' + config.name);
        }

        // Add random seed if not explicitly provided
        if (!options.seed && !options.extraParams?.seed) {
            options.seed = this.customSeed || this._generateRandomSeed();
            console.log('Using seed for unique response: ' + options.seed + ' ' + (this.customSeed ? '(custom)' : '(time-based)'));
        }

        switch (provider) {
            case 'openai':
            case 'deepseek':
            case 'grok':
            case 'mistral':
            case 'custom': // Custom servers use OpenAI-compatible API
                return this._makeOpenAIStyleRequest(config, apiKey, model, messages, options);
            case 'anthropic':
                return this._makeAnthropicRequest(config, apiKey, model, messages, options);
            case 'gemini':
                return this._makeGeminiRequest(config, apiKey, model, messages, options);
            default:
                throw new Error('Unsupported provider: ' + provider);
        }
    }

    async _makeOpenAIStyleRequest(config, apiKey, model, messages, options) {
        const requestBody = {
            model: model,
            messages: messages,
            max_tokens: options.maxTokens || 2000,
            temperature: options.temperature || 0.7,
            ...options.extraParams
        };

        // Add seed for randomization if available
        if (options.seed !== undefined) {
            requestBody.seed = options.seed;
        }

        // Build headers - API key is optional for custom providers
        const headers = {
            'Content-Type': 'application/json'
        };

        if (apiKey) {
            headers['Authorization'] = 'Bearer ' + apiKey;
        }

        const response = await fetch(config.baseURL + '/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let error;
            try {
                error = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse error response as JSON:', jsonError);
                error = { error: { message: 'Unknown error' } };
            }
            throw new Error(error.error?.message || 'API request failed: ' + response.status);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse API response as JSON:', jsonError);
            throw new Error('Invalid JSON response from API');
        }

        const content = data.choices?.[0]?.message?.content || '';
        return this._stripThinkingTags(content);
    }

    async _makeAnthropicRequest(config, apiKey, model, messages, options) {
        // Convert OpenAI format to Anthropic format
        const systemMessage = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');

        // Add subtle randomness to temperature if seed is provided (Anthropic doesn't support seed directly)
        let adjustedTemperature = options.temperature || 0.7;
        if (options.seed !== undefined) {
            // Add small random variation based on seed (±0.05 max)
            const seedVariation = ((options.seed % 100) / 1000) - 0.05;
            adjustedTemperature = Math.max(0.1, Math.min(1.0, adjustedTemperature + seedVariation));
        }

        const requestBody = {
            model: model,
            messages: userMessages,
            system: systemMessage?.content || '',
            max_tokens: options.maxTokens || 2000,
            temperature: adjustedTemperature,
            ...options.extraParams
        };

        const response = await fetch(config.baseURL + '/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let error;
            try {
                error = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse error response as JSON:', jsonError);
                error = { error: { message: 'Unknown error' } };
            }
            throw new Error(error.error?.message || 'API request failed: ' + response.status);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse API response as JSON:', jsonError);
            throw new Error('Invalid JSON response from API');
        }

        const content = data.content?.[0]?.text || '';
        return this._stripThinkingTags(content);
    }

    async _makeGeminiRequest(config, apiKey, model, messages, options) {
        // Convert OpenAI format to Gemini format
        const parts = messages.map(m => ({ text: m.role + ': ' + m.content }));

        // Add subtle randomness to temperature if seed is provided (Gemini doesn't support seed directly)
        let adjustedTemperature = options.temperature || 0.7;
        if (options.seed !== undefined) {
            // Add small random variation based on seed (±0.05 max)
            const seedVariation = ((options.seed % 100) / 1000) - 0.05;
            adjustedTemperature = Math.max(0.1, Math.min(1.0, adjustedTemperature + seedVariation));
        }

        const generationConfig = {
            maxOutputTokens: options.maxTokens || 2000,
            temperature: adjustedTemperature,
            ...options.extraParams
        };

        // Add seed if supported by Gemini (for future compatibility)
        if (options.seed !== undefined) {
            generationConfig.seed = options.seed;
        }

        const response = await fetch(config.baseURL + '/models/' + model + ':generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: generationConfig
            })
        });

        if (!response.ok) {
            let error;
            try {
                error = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse error response as JSON:', jsonError);
                error = { error: { message: 'Unknown error' } };
            }
            throw new Error(error.error?.message || 'API request failed: ' + response.status);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse API response as JSON:', jsonError);
            throw new Error('Invalid JSON response from API');
        }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return this._stripThinkingTags(content);
    }

    async listModels(provider = null, apiKey = null) {
        const p = provider || this.currentProvider;
        const key = apiKey || this.currentApiKey;
        const config = this.getProviderConfig(p);

        // For custom providers, API key is optional
        if (config.requiresKey && !key) {
            throw new Error('API key is required to list models for ' + config.name);
        }

        switch (p) {
            case 'openai':
            case 'deepseek':
            case 'grok':
            case 'mistral':
                return this._listOpenAIStyleModels(config, key);
            case 'custom':
                return this._listOpenAIStyleModels(config, key, true); // Pass flag for optional key
            case 'anthropic':
                // Anthropic currently requires manual model enumeration (API model listing limited)
                return this._getAnthropicModels();
            case 'gemini':
                return this._getGeminiModels();
            default:
                throw new Error('Unsupported provider: ' + p);
        }
    }

    async _listOpenAIStyleModels(config, apiKey, optionalKey = false) {
        const headers = {};

        // Only add Authorization header if API key is provided
        if (apiKey) {
            headers['Authorization'] = 'Bearer ' + apiKey;
        }

        const response = await fetch(config.baseURL + '/models', {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch models: ' + response.status);
        }

        const data = await response.json();

        // OpenAI /models API response structure:
        // {
        //   "object": "list",
        //   "data": [
        //     {
        //       "id": "gpt-4o",              // Model identifier
        //       "object": "model",            // Always "model"
        //       "created": 1234567890,        // Unix timestamp
        //       "owned_by": "system"          // Owner (e.g., "system", "openai", "organization-...")
        //     },
        //     ...
        //   ]
        // }
        // Log first model to see available properties (for debugging)
        if (data.data && data.data.length > 0) {
            console.log('Sample model properties:', Object.keys(data.data[0]));
            console.log('Sample model:', data.data[0]);
        }

        // Patterns to identify legacy/deprecated models
        // Only filter models that ONLY have dates/versions (not legitimate versioned models)
        const pureVersionPattern = /^(\w+-)?(gpt-3\.5-turbo|gpt-4|(dev|mi|code|magi|vox)stral)(-\w+)?-\d{4}$/; // Like gpt-4-0613 (pure version)
        const legacyDateOnlyPattern = /^\w+-\d{4}-\d{2}-\d{2}$/; // Like davinci-2023-01-15 (only date)
        const endingDatePattern = /-\d{4}-\d{2}-\d{2}$/; // Models ending with -YYYY-MM-DD pattern
        const endingDatePattern2 = /-\d{8}$/; // Models ending with -YYYYMMDD pattern (like -20241022)

        // Known legacy model patterns
        const legacyPatterns = [
            'gpt-3.5-turbo-16k',
            'gpt-4-32k',
            'text-davinci',
            'text-curie',
            'text-babbage',
            'text-ada',
            'code-davinci',
            'code-cushman'
        ];

        // Categorize models
        const categorizedModels = {
            text: [],
            images: [],
            tts: [],
            audio: [],
            video: [],
            transcribe: [],
            ocr: [],
            other: []
        };

        data.data.forEach(model => {
            const modelId = model.id;
            const modelIdLower = modelId.toLowerCase();

            // Skip pure version-only models (like gpt-4-0613 which are outdated snapshots)
            if (pureVersionPattern.test(modelId)) {
                console.log('Skipping pure version model:', modelId);
                return;
            }

            // Skip legacy date-only models (but allow models with dates as part of their name)
            if (legacyDateOnlyPattern.test(modelId)) {
                console.log('Skipping legacy date-only model:', modelId);
                return;
            }

            // Skip models ending with date patterns (like claude-3-opus-20240229 or gpt-4-20241022)
            if (endingDatePattern.test(modelId) || endingDatePattern2.test(modelId)) {
                console.log('Skipping model with ending date pattern:', modelId);
                return;
            }

            // Skip known legacy model patterns (but be specific - don't block all *-002 models)
            const isLegacy = legacyPatterns.some(pattern => modelIdLower.startsWith(pattern.toLowerCase()));
            if (isLegacy) {
                console.log('Skipping legacy model:', modelId);
                return;
            }

            const modelInfo = {
                id: model.id,
                label: model.id,
                category: 'other',
                created: model.created || null,
                owned_by: model.owned_by || null
            };

            // Categorize by model type (expanded patterns for custom models)
            // Check OCR/Vision models FIRST (before text generation)
            if (modelIdLower.includes('ocr') ||
                modelIdLower.includes('-ocr') ||
                modelIdLower.includes('vision') ||
                modelIdLower.includes('document') ||
                modelIdLower.includes('pixtral') ||
                modelIdLower.includes('gpt-4o') ||
                modelIdLower.includes('gpt-4-turbo') ||
                modelIdLower.includes('claude-3') ||
                (modelIdLower.includes('gemini') && modelIdLower.includes('vision'))) {
                modelInfo.category = 'ocr';
                categorizedModels.ocr.push(modelInfo);
            } else if (modelId.includes('gpt') ||
                modelId.includes('chat') ||
                modelId.includes('deepseek') ||
                modelId.includes('grok') ||
                modelId.includes('llama') ||
                modelId.includes('mistral') ||
                modelId.includes('gemma') ||
                modelId.includes('phi') ||
                modelId.includes('qwen') ||
                modelId.includes('claude') ||
                modelIdLower.includes('instruct') ||
                modelIdLower.includes('conversation')) {
                modelInfo.category = 'text';
                categorizedModels.text.push(modelInfo);
            } else if (modelId.includes('dall-e') || modelId.includes('dalle') || modelId.includes('gpt-image') || modelId.includes('image')) {
                modelInfo.category = 'images';
                categorizedModels.images.push(modelInfo);
            } else if (modelId.includes('tts') || modelId.includes('text-to-speech')) {
                modelInfo.category = 'tts';
                categorizedModels.tts.push(modelInfo);
            } else if (modelId.includes('whisper') || modelId.includes('transcrib') || modelId.includes('voxtral')) {
                modelInfo.category = 'transcribe';
                categorizedModels.transcribe.push(modelInfo);
            } else if (modelId.includes('audio')) {
                modelInfo.category = 'audio';
                categorizedModels.audio.push(modelInfo);
            } else if (modelId.includes('video') || modelId.includes('sora')) {
                modelInfo.category = 'video';
                categorizedModels.video.push(modelInfo);
            } else {
                // Uncategorized models go to "other" (likely custom models)
                modelInfo.category = 'other';
                categorizedModels.other.push(modelInfo);
            }
        });

        // Flatten categorized models with category headers
        const flattenedModels = [];

        const categoryLabels = {
            text: '💬 Text Generation',
            images: '🎨 Image Generation',
            ocr: '👁️ Vision & OCR',
            tts: '🔊 Text-to-Speech',
            audio: '🎵 Audio Generation',
            video: '🎬 Video Generation',
            transcribe: '📝 Transcription',
            other: '🔧 Other Models'
        };

        // Add models by category with headers
        Object.keys(categoryLabels).forEach(category => {
            if (categorizedModels[category].length > 0) {
                // Add category header
                flattenedModels.push({
                    id: `header-${category}`,
                    label: categoryLabels[category],
                    isHeader: true,
                    category: category
                });

                // Add models in this category (sorted)
                categorizedModels[category]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .forEach(model => flattenedModels.push(model));
            }
        });

        return flattenedModels;
    }

    _getAnthropicModels() {
        return [
            { id: 'header-text', label: '💬 Text Generation', isHeader: true, category: 'text' },
            // Claude 4 models (latest)
            { id: 'claude-4-opus-20250514', label: 'Claude 4 Opus (Latest)', category: 'text' },
            { id: 'claude-4-sonnet-20250514', label: 'Claude 4 Sonnet (Latest)', category: 'text' },
            // Claude 3.5 models
            { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Oct 2024)', category: 'text' },
            { id: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet (Jun 2024)', category: 'text' },
            // Claude 3 models
            { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', category: 'text' },
            { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', category: 'text' },
            { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', category: 'text' }
        ];
    }

    _getGeminiModels() {
        return [
            { id: 'header-text', label: '💬 Text Generation', isHeader: true, category: 'text' },
            { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', category: 'text' },
            { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', category: 'text' },
            { id: 'gemini-pro', label: 'Gemini Pro', category: 'text' }
        ];
    }

    _getFallbackModels() {
        // Deprecated: explicit fallback removed per requirements.
        return [];
    }
}

// Initialize stored models on load (only if not already initialized)
document.addEventListener('DOMContentLoaded', () => {
    if (window.apiManager) {
        console.log('APIManager already initialized, skipping...');
        return;
    }

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

// Export for use in other files (only if not already defined)
if (!window.APIManager) {
    window.APIManager = APIManager;
}