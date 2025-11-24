/**
 * API Manager - Centralized AI provider management
 * Wrapped in an IIFE to avoid re-declaration when included multiple times.
 */
(function () {
    if (window.APIManager) {
        console.log('APIManager constructor already defined; skipping redefinition');
        return;
    }

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
            cohere: {
                name: 'Cohere',
                // Cohere OpenAI-compatible base. If this changes, swap to native adapter.
                baseURL: 'https://api.cohere.ai/compatibility/v1',
                // Use a common Cohere chat-capable default; user can pick others from list
                defaultModel: 'command-r-plus',
                // Cohere keys vary; accept permissive non-empty token format
                keyPattern: /^[A-Za-z0-9_\-]+$/,
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
                defaultModel: 'claude-sonnet-4-5-20250929',
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
            perplexity: {
                name: 'Perplexity',
                baseURL: 'https://api.perplexity.ai',
                defaultModel: 'sonar',
                keyPattern: /^pplx-[A-Za-z0-9_\-]+$/,
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

        // Defaults for auto-continuation; can be overridden per call
        this.defaults = {
            autoContinue: false,
            autoContinueMaxSteps: 1,
            ensureCompleteStory: false,
            fullStoryMode: false,
            fullStoryMaxLoops: 4
        };
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
        localStorage.setItem('ai-provider', provider);
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
        localStorage.setItem('ai-api-key', key);
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
        localStorage.setItem('ai-model-' + p, model);
        sessionStorage.setItem('ai_model_' + p, model);
    }

    // Storage helpers
    getStoredProvider() {
        return localStorage.getItem('ai-provider') || sessionStorage.getItem('ai_provider');
    }

    getStoredApiKey() {
        return localStorage.getItem('ai-api-key') || sessionStorage.getItem('ai_api_key');
    }

    getStoredModel(provider) {
        return localStorage.getItem('ai-model-' + provider) || sessionStorage.getItem('ai_model_' + provider);
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

    // Helper function to remove thinking/reasoning tags and their content
    // Supports multiple formats used by different AI models:
    // - <thinking>...</thinking> (standard XML-style)
    // - ◁think▷...◁/think▷ (DeepSeek R1 and similar models)
    _stripThinkingTags(text) {
        if (!text) return text;

        const original = text;

        // Use a small state machine to reliably strip only the content between
        // well-formed thinking tags without truncating the remainder.
        const OPEN = '◁think▷';
        const CLOSE = '◁/think▷';
        const OPEN_XML = '<thinking>';
        const CLOSE_XML = '</thinking>';

        let i = 0;
        let depth = 0; // support nested just in case
        let cleanedBuilder = '';

        while (i < text.length) {
            // Opening tags
            if (text.startsWith(OPEN, i)) {
                depth++;
                i += OPEN.length;
                continue;
            }
            if (text.startsWith(OPEN_XML, i)) {
                depth++;
                i += OPEN_XML.length;
                continue;
            }

            // When inside a thinking block, skip until the matching close
            if (depth > 0) {
                if (text.startsWith(CLOSE, i)) {
                    depth = Math.max(0, depth - 1);
                    i += CLOSE.length;
                    continue;
                }
                if (text.startsWith(CLOSE_XML, i)) {
                    depth = Math.max(0, depth - 1);
                    i += CLOSE_XML.length;
                    continue;
                }
                // Skip current character (we're inside thinking content)
                i++;
                continue;
            }

            // Outside of any thinking block, keep the character
            cleanedBuilder += text[i];
            i++;
        }

        // If we ended while still "inside" a thinking block (unbalanced tags),
        // fall back to a conservative strategy: remove only the tag tokens
        // themselves and leave content intact to avoid cutting off the reply.
        let cleaned = cleanedBuilder;
        if (depth > 0) {
            cleaned = original
                .replaceAll(OPEN, '')
                .replaceAll(CLOSE, '')
                .replaceAll(OPEN_XML, '')
                .replaceAll(CLOSE_XML, '');
        }

        // After core removal, strip additional common bracketed variants for 'thinking'/'think'
        const blockPatterns = [
            /\[thinking\][\s\S]*?\[\/thinking\]/gi,
            /\(thinking\)[\s\S]*?\(\/thinking\)/gi,
            /\{thinking\}[\s\S]*?\{\/thinking\}/gi,
            /«thinking»[\s\S]*?«\/thinking»/gi,
            /〈thinking〉[\s\S]*?〈\/thinking〉/gi,
            /《thinking》[\s\S]*?《\/thinking》/gi,
            /「thinking」[\s\S]*?「\/thinking」/gi,
            /『thinking』[\s\S]*?『\/thinking』/gi,
            /⟪thinking⟫[\s\S]*?⟪\/thinking⟫/gi,
            /⟨thinking⟩[\s\S]*?⟨\/thinking⟩/gi,
            // also support 'think' keyword
            /\[think\][\s\S]*?\[\/think\]/gi,
            /\(think\)[\s\S]*?\(\/think\)/gi,
            /\{think\}[\s\S]*?\{\/think\}/gi,
            /«think»[\s\S]*?«\/think»/gi,
            /〈think〉[\s\S]*?〈\/think〉/gi,
            /《think》[\s\S]*?《\/think》/gi,
            /「think」[\s\S]*?「\/think」/gi,
            /『think』[\s\S]*?『\/think』/gi,
            /⟪think⟫[\s\S]*?⟪\/think⟫/gi,
            /⟨think⟩[\s\S]*?⟨\/think⟩/gi,
        ];
        blockPatterns.forEach(rx => {
            cleaned = cleaned.replace(rx, '');
        });

        // Remove stray open/close tokens if blocks were malformed
        const tokenPatterns = [
            /\[\/?thinking\]/gi, /\(\/?thinking\)/gi, /\{\/?thinking\}/gi,
            /«\/?thinking»/gi, /〈\/?thinking〉/gi, /《\/?thinking》/gi,
            /「\/?thinking」/gi, /『\/?thinking』/gi, /⟪\/?thinking⟫/gi, /⟨\/?thinking⟩/gi,
            /\[\/?think\]/gi, /\(\/?think\)/gi, /\{\/?think\}/gi,
            /«\/?think»/gi, /〈\/?think〉/gi, /《\/?think》/gi,
            /「\/?think」/gi, /『\/?think』/gi, /⟪\/?think⟫/gi, /⟨\/?think⟩/gi
        ];
        tokenPatterns.forEach(rx => {
            cleaned = cleaned.replace(rx, '');
        });

        // Heuristic: remove 'thinking' or 'think' if surrounded by non-space characters
        // Examples: .thinking.  ./thinking.  <thinking>  (thinking)
        try {
            cleaned = cleaned.replace(/(?<=\S)thinking(?=\S)/gi, '');
            cleaned = cleaned.replace(/(?<=\S)think(?=\S)/gi, '');
        } catch (e) {
            // Older JS engines without lookbehind: fallback manual replace
            cleaned = cleaned.replace(/(\S)thinking(\S)/gi, '$1$2');
            cleaned = cleaned.replace(/(\S)think(\S)/gi, '$1$2');
        }

        // Normalize any excessive blank lines introduced by removals
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        // Debug logging when thinking tags are detected
        if (original !== cleaned && (original.includes('◁think▷') || original.includes('<thinking>'))) {
            console.log('[API Manager] Stripped thinking tags from response');
            console.log('[API Manager] Original length:', original.length, 'Cleaned length:', cleaned.length);
        }

        // Trim only at the ends to avoid altering interior spacing
        return cleaned.trim();
    }

    // Extract only the story/narrative content, stripping tool/meta wrappers.
    _purifyStory(text) {
        if (!text) return text;
        let t = text;

        // Common prefixes to drop
        t = t.replace(/^(?:Here is (?:the )?story:?|Sure, (?:here'?s|here is) (?:a|the) story:?|Story:?|Narrative:?|Output:?)[\s\-]*\n?/i, '');
        t = t.replace(/^```(?:markdown|text)?\n([\s\S]*?)```\s*$/i, '$1');

        // Drop trailing analysis or meta sections if present
        t = t.replace(/\n+(?:Analysis|Notes|Explanation|Outline|Postscript|Epilogue):[\s\S]*$/i, '');

        // Remove accidental "assistant:" or role headers
        t = t.replace(/^\s*(?:assistant|system|user)\s*:\s*/i, '');

        // Trim repeated leading/trailing quotes or code fences
        t = t.replace(/^"{3,}/, '').replace(/"{3,}$/,'');

        // Ensure we end on a sentence terminator if present nearby
        const lastSentence = t.match(/[\s\S]*[.!?)(\]](?=\s*$)/);
        if (lastSentence) t = lastSentence[0];

        return t.trim();
    }

    // Common post-processing pipeline for model outputs
    _postProcess(text, options) {
        let out = this._stripThinkingTags(text || '');
        if (options?.storyOnly) out = this._purifyStory(out);
        return out;
    }

    // Unified cutoff heuristic
    _isLikelyCutoffText(text) {
        if (!text) return false;
        const trimmed = String(text).trim();
        if (!trimmed) return false;
        // Ends with awkward punctuation
        if (/[,:;]$/.test(trimmed)) return true;
        // No sentence terminator and reasonably long
        if (!/[.!?)]$/.test(trimmed) && trimmed.length > 160) return true;
        // Dangling articles / prepositions / conjunctions
        if (/(?:\b(?:and|or|but|as|with|to|that|while|because|when|the|a|an|his|her|their|its|this|that|these|those|of|for|in|on|by|into|onto|from|at|over|under|through)\b)$/i.test(trimmed)) return true;
        return false;
    }

    _bumpMaxTokens(currentMax) {
        return Math.min(Math.max(1024, Math.floor((currentMax || 1500) * 1.5)), 4096);
    }

    _hasTerminalEnding(text) {
        if (!text) return false;
        const trimmed = text.trim();
        // Accept terminal punctuation or closing quote/bracket following punctuation
        return /[.!?]['")\]]?$/.test(trimmed);
    }

    _isCompleteStory(text) {
        if (!text) return false;
        const t = text.trim();
        // Explicit end markers
        if (/\bTHE\s+END\b/i.test(t)) return true;
        // Terminal punctuation heuristics (last 2 sentences end cleanly)
        const sentences = t.split(/(?<=[.!?])\s+/);
        if (sentences.length >= 2) {
            const last = sentences[sentences.length - 1];
            const penultimate = sentences[sentences.length - 2];
            if (/[.!?]['")\]]?$/.test(last) && penultimate.length > 20) return true;
        }
        // Length threshold with terminal ending
        if (t.length > 800 && this._hasTerminalEnding(t)) return true;
        return false;
    }

    // Get a short tail anchor from the end of the text for safe continuation
    _getTailAnchor(text, charCount = 600) {
        if (!text) return '';
        const slice = String(text).slice(-Math.max(150, charCount));
        const candidates = ['\n\n', '. ', '? ', '! '];
        let idx = -1;
        for (const sep of candidates) {
            const found = slice.lastIndexOf(sep);
            if (found > idx) idx = found;
        }
        // Start after the boundary, keep only the most recent fragment
        return idx >= 0 ? slice.slice(idx + 2) : slice;
    }

    // Trim leading overlap where the new chunk repeats the end of the prior text
    _trimLeadingOverlap(prevText, newChunk, maxOverlap = 400) {
        if (!prevText || !newChunk) return newChunk || '';
        const win = prevText.slice(-Math.max(50, Math.min(maxOverlap, prevText.length)));
        const maxK = Math.min(win.length, newChunk.length);
        for (let k = maxK; k >= 20; k--) {
            const suffix = win.slice(win.length - k);
            if (newChunk.startsWith(suffix)) {
                return newChunk.slice(k);
            }
        }
        return newChunk;
    }

    _continuationMaxTokens(options) {
        const base = options?.maxTokens || 1500;
        const capped = Math.min(Math.floor(base * 0.6), 768); // keep continuations tight
        return Math.max(196, capped);
    }

    // Shared continuation handler to reduce duplicate code across providers
    async _finalizeWithContinuation({ content, baseMessages, adjustedMessages, options, isInitiallyTruncated, reRequest }) {
        let result = content || '';
        let steps = Math.max(0, options?.autoContinueMaxSteps ?? 1);

        const shouldContinue = (chunk, wasTruncated) => {
            if (!options?.autoContinue) return false;
            if (wasTruncated) return true;
            return this._isLikelyCutoffText(chunk);
        };

        while (steps > 0 && shouldContinue(result, isInitiallyTruncated)) {
            try {
                const tail = this._getTailAnchor(result, options?.anchorChars || 600);
                const msgs = [
                    ...((adjustedMessages && adjustedMessages.length) ? adjustedMessages : baseMessages),
                    { role: 'assistant', content: tail },
                    { role: 'user', content: 'Repeat the overlap and finish the cut-off sentence/paragraph ONLY. Do not add new scenes or plot points. Stop after completing the thought.' }
                ];

                const followOptions = {
                    ...options,
                    maxTokens: this._continuationMaxTokens(options),
                    autoContinue: false,
                    autoContinueMaxSteps: 0
                };

                const nextChunk = await reRequest(msgs, followOptions);
                const trimmed = this._trimLeadingOverlap(result, nextChunk);
                const before = result;
                result = before + (before.endsWith('\n') ? '' : '\n') + trimmed;

                // For subsequent iterations, evaluate only by text shape
                isInitiallyTruncated = false;
                steps -= 1;
                if (!this._isLikelyCutoffText(nextChunk)) break;
            } catch (e) {
                console.warn('Continuation request failed:', e);
                break;
            }
        }
        // Ensure story ends cleanly if requested
        if (options?.ensureCompleteStory && !this._hasTerminalEnding(result)) {
            try {
                const tail = this._getTailAnchor(result, options?.anchorChars || 600);
                const msgs = [
                    ...((adjustedMessages && adjustedMessages.length) ? adjustedMessages : baseMessages),
                    { role: 'assistant', content: tail },
                    { role: 'user', content: 'Finish the final sentence naturally by repeating the last words and completing the sentence. Provide ONLY the continuation. No new events.' }
                ];
                const followOptions = {
                    ...options,
                    maxTokens: this._continuationMaxTokens(options),
                    autoContinue: false,
                    autoContinueMaxSteps: 0,
                    ensureCompleteStory: false
                };
                const finalTailChunk = await reRequest(msgs, followOptions);
                if (finalTailChunk && finalTailChunk.trim()) {
                    // Avoid duplication: remove any leading overlap
                    const cleanedTail = this._trimLeadingOverlap(result, finalTailChunk.replace(/^\s+/, ''));
                    result += (result.endsWith('\n') ? '' : '\n') + cleanedTail;
                }
            } catch (e) {
                console.warn('ensureCompleteStory tail request failed:', e);
            }
        }
        return result;
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

        // Merge defaults
        options = { ...this.defaults, ...options };

        // If fullStoryMode enabled, override continuation flags to avoid nested loops
        if (options.fullStoryMode) {
            options.autoContinue = false; // we'll manage loops manually
            options.ensureCompleteStory = false; // handled by _isCompleteStory
        }

        let baseCall;
        switch (provider) {
            case 'openai':
            case 'cohere':
            case 'deepseek':
            case 'grok':
            case 'mistral':
            case 'perplexity':
            case 'custom': // Custom servers use OpenAI-compatible API
                baseCall = (msgs, opts) => this._makeOpenAIStyleRequest(config, apiKey, model, msgs, opts);
                break;
            case 'anthropic':
                baseCall = (msgs, opts) => this._makeAnthropicRequest(config, apiKey, model, msgs, opts);
                break;
            case 'gemini':
                baseCall = (msgs, opts) => this._makeGeminiRequest(config, apiKey, model, msgs, opts);
                break;
            default:
                throw new Error('Unsupported provider: ' + provider);
        }

        // Standard single request path
        if (!options.fullStoryMode) {
            return baseCall(messages, options);
        }

        // Full story iterative retrieval
        let loop = 0;
        let assembled = '';
        let workingMessages = [...messages];
        let lastChunk = '';

        while (loop < options.fullStoryMaxLoops) {
            const chunkOptions = { ...options, autoContinue: false, ensureCompleteStory: false };
            const chunk = await baseCall(workingMessages, chunkOptions);
            lastChunk = chunk.trim();
            // Avoid duplication: if chunk starts with previous tail segment, trim overlap
            if (assembled) lastChunk = this._trimLeadingOverlap(assembled, lastChunk, 400);
            assembled += (assembled && !assembled.endsWith('\n') ? '\n' : '') + lastChunk;

            if (this._isCompleteStory(assembled)) break;

            // Prepare continuation prompt
            const tail = this._getTailAnchor(assembled, options?.anchorChars || 600);
            workingMessages = [
                ...messages,
                { role: 'assistant', content: tail },
                { role: 'user', content: 'Repeat the overlap and finish the cut-off sentence/paragraph ONLY. Do not add new scenes or plot points. Provide ONLY the continuation.' }
            ];

            loop += 1;
        }

        // Final polish if not terminal but loops exhausted
        if (!this._isCompleteStory(assembled) && this._hasTerminalEnding(assembled) === false) {
            assembled = assembled.trimEnd() + '...'; // indicate unresolved ending
        }
        return assembled;
    }

    async _makeOpenAIStyleRequest(config, apiKey, model, messages, options) {
        // If storyOnly is requested, inject a system instruction to output only the story text
        let adjustedMessages = messages;
        if (options.storyOnly) {
            const storySystem = { role: 'system', content: 'Output only the story narrative as plain text. Do not include prefaces, analysis, titles, or meta commentary.' };
            const hasSystem = messages.some(m => m.role === 'system');
            adjustedMessages = hasSystem ? messages.map((m, i) => (i === 0 && m.role === 'system' ? { ...m, content: storySystem.content + '\n' + m.content } : m)) : [storySystem, ...messages];
        }
        const requestBody = {
            model: model,
            messages: adjustedMessages,
            max_tokens: options.maxTokens || 2000,
            temperature: options.temperature || 0.7,
            ...options.extraParams
        };

        // Add seed for randomization if available (not all providers support this)
        // Mistral doesn't support 'seed' parameter, so skip it for Mistral
        const provider = this.currentProvider;
        if (options.seed !== undefined && provider !== 'mistral') {
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

        let content = data.choices?.[0]?.message?.content || '';
        content = this._postProcess(content, options);

        const finishReason = data.choices?.[0]?.finish_reason;
        const isInitiallyTruncated = finishReason === 'length' || false;
        return await this._finalizeWithContinuation({
            content,
            baseMessages: messages,
            adjustedMessages,
            options,
            isInitiallyTruncated,
            reRequest: (msgs, opts) => this._makeOpenAIStyleRequest(config, apiKey, model, msgs, opts)
        });
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
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
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

        let content = data.content?.[0]?.text || '';
        content = this._postProcess(content, options);
        const stopReason = data.stop_reason;

        const isInitiallyTruncated = stopReason === 'max_tokens' || false;
        return await this._finalizeWithContinuation({
            content,
            baseMessages: messages,
            adjustedMessages: null,
            options,
            isInitiallyTruncated,
            reRequest: (msgs, opts) => this._makeAnthropicRequest(config, apiKey, model, msgs, opts)
        });
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

        let content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        content = this._postProcess(content, options);
        const finish = data.candidates?.[0]?.finishReason;

        const isInitiallyTruncated = finish === 'MAX_TOKENS' || false;
        return await this._finalizeWithContinuation({
            content,
            baseMessages: messages,
            adjustedMessages: null,
            options,
            isInitiallyTruncated,
            reRequest: (msgs, opts) => this._makeGeminiRequest(config, apiKey, model, msgs, opts)
        });
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
            case 'perplexity':
                return this._listPerplexityModels(config, key);
            case 'cohere':
                // Use Cohere native models endpoint; compatibility /models may not be available
                return this._listCohereModelsNative(key);
            case 'custom':
                return this._listOpenAIStyleModels(config, key, true); // Pass flag for optional key
            case 'anthropic':
                return this._listAnthropicModels(config, key);
            case 'gemini':
                return this._listGeminiModels(config, key);
            default:
                throw new Error('Unsupported provider: ' + p);
        }
    }

    async _listCohereModelsNative(apiKey) {
        const url = 'https://api.cohere.ai/v1/models';
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch models: ' + response.status);
        }

        const data = await response.json();
        const ids = [];
        // Cohere commonly returns { models: [{ name: 'command-r' }, ...] }
        if (Array.isArray(data?.models)) {
            data.models.forEach(m => {
                const name = m?.name || m?.id || '';
                if (name) ids.push(name);
            });
        } else if (Array.isArray(data?.data)) {
            data.data.forEach(m => { if (m?.id) ids.push(m.id); });
        }
        return this._categorizeAndFlatten(ids);
    }

    async _listAnthropicModels(config, apiKey) {
        let response;
        try {
            response = await fetch(config.baseURL + '/models', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                }
            });
        } catch (e) {
            // Network error
            throw new Error('Failed to fetch Anthropic models: ' + e.message);
        }

        if (!response.ok) {
            throw new Error('Failed to fetch models: ' + response.status);
        }

        const data = await response.json();
        // Normalize to a list of ids. Anthropic may return { data: [{ id: ... }] } or { models: [...] }
        const ids = [];
        if (Array.isArray(data?.data)) {
            data.data.forEach(m => { if (m?.id) ids.push(m.id); });
        } else if (Array.isArray(data?.models)) {
            data.models.forEach(m => { if (m?.id) ids.push(m.id); else if (m?.name) ids.push(m.name); });
        }
        return this._categorizeAndFlatten(ids);
    }

    async _listGeminiModels(config, apiKey) {
        const url = config.baseURL + '/models?key=' + encodeURIComponent(apiKey);
        const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) {
            throw new Error('Failed to fetch models: ' + response.status);
        }
        const data = await response.json();
        // Google returns { models: [ { name: 'models/gemini-1.5-flash', ... }, ... ] }
        const ids = [];
        if (Array.isArray(data?.models)) {
            data.models.forEach(m => {
                const name = m?.name || '';
                const id = name.includes('/') ? name.split('/').pop() : name;
                if (id) ids.push(id);
            });
        }
        return this._categorizeAndFlatten(ids);
    }

    async _listPerplexityModels(config, apiKey) {
        // Perplexity is OpenAI-compatible but doesn't have a /models endpoint yet
        // Try to query it anyway to validate the API key, fall back to static list
        const headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        };

        let apiAvailable = false;
        try {
            const response = await fetch(config.baseURL + '/models', { headers });
            if (response.ok) {
                // If they've added the endpoint, use it
                const data = await response.json();
                if (Array.isArray(data?.data)) {
                    const ids = data.data.map(m => m?.id).filter(Boolean);
                    if (ids.length > 0) {
                        return this._categorizeAndFlatten(ids);
                    }
                }
                apiAvailable = true;
            } else if (response.status === 401) {
                throw new Error('Invalid API key');
            } else if (response.status === 404) {
                // Endpoint doesn't exist yet, use static list (expected)
                apiAvailable = true; // Key is likely valid, endpoint just doesn't exist
            }
        } catch (e) {
            // If it's an auth error, propagate it
            if (e.message === 'Invalid API key') {
                throw e;
            }
            // Otherwise, network error - will use static list
        }

        // Return static list of Perplexity models
        // Based on: https://docs.perplexity.ai/getting-started/models
        const modelIds = [
            'sonar',
            'sonar-pro',
            'sonar-reasoning',
            'sonar-reasoning-pro',
            'sonar-deep-research'
        ];

        // Use the standard categorization function
        return this._categorizeAndFlatten(modelIds);
    }

    _categorizeAndFlatten(modelIds) {
        // Reuse categorization rules from _listOpenAIStyleModels
        const categorizedModels = {
            text: [], images: [], tts: [], audio: [], video: [], transcribe: [], ocr: [], other: []
        };

        const legacyPatterns = [
            'gpt-3.5-turbo-16k', 'gpt-4-32k', 'text-davinci', 'text-curie', 'text-babbage', 'text-ada', 'code-davinci', 'code-cushman'
        ];

        modelIds.forEach(modelId => {
            const modelIdLower = String(modelId || '').toLowerCase();
            if (!modelIdLower) return;
            if (legacyPatterns.some(pattern => modelIdLower.startsWith(pattern.toLowerCase()))) return;

            const modelInfo = { id: modelId, label: modelId, category: 'other' };

            if (modelIdLower.includes('ocr') || modelIdLower.includes('-ocr') || modelIdLower.includes('vision') ||
                modelIdLower.includes('document') || modelIdLower.includes('pixtral') || modelIdLower.includes('gpt-4o') ||
                modelIdLower.includes('gpt-4-turbo') || modelIdLower.includes('claude-3') ||
                (modelIdLower.includes('gemini') && modelIdLower.includes('vision'))) {
                modelInfo.category = 'ocr'; categorizedModels.ocr.push(modelInfo);
            } else if (modelIdLower.includes('gpt') || modelIdLower.includes('chat') || modelIdLower.includes('deepseek') ||
                modelIdLower.includes('grok') || modelIdLower.includes('llama') || modelIdLower.includes('mistral') ||
                modelIdLower.includes('gemma') || modelIdLower.includes('phi') || modelIdLower.includes('qwen') ||
                modelIdLower.includes('claude') || modelIdLower.includes('instruct') || modelIdLower.includes('conversation') ||
                modelIdLower.includes('command') || modelIdLower.includes('sonar')) {
                modelInfo.category = 'text'; categorizedModels.text.push(modelInfo);
            } else if (modelIdLower.includes('dall-e') || modelIdLower.includes('dalle') || modelIdLower.includes('gpt-image') || modelIdLower.includes('image')) {
                modelInfo.category = 'images'; categorizedModels.images.push(modelInfo);
            } else if (modelIdLower.includes('tts') || modelIdLower.includes('text-to-speech')) {
                modelInfo.category = 'tts'; categorizedModels.tts.push(modelInfo);
            } else if (modelIdLower.includes('whisper') || modelIdLower.includes('transcrib') || modelIdLower.includes('voxtral')) {
                modelInfo.category = 'transcribe'; categorizedModels.transcribe.push(modelInfo);
            } else if (modelIdLower.includes('audio')) {
                modelInfo.category = 'audio'; categorizedModels.audio.push(modelInfo);
            } else if (modelIdLower.includes('video') || modelIdLower.includes('sora')) {
                modelInfo.category = 'video'; categorizedModels.video.push(modelInfo);
            } else {
                categorizedModels.other.push(modelInfo);
            }
        });

        const categoryLabels = {
            text: '💬 Text Generation', images: '🎨 Image Generation', ocr: '👁️ Vision & OCR', tts: '🔊 Text-to-Speech',
            audio: '🎵 Audio Generation', video: '🎬 Video Generation', transcribe: '📝 Transcription', other: '🔧 Other Models'
        };

        const flattened = [];
        Object.keys(categoryLabels).forEach(category => {
            if (categorizedModels[category].length > 0) {
                flattened.push({ id: `header-${category}`, label: categoryLabels[category], isHeader: true, category });
                categorizedModels[category]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .forEach(m => flattened.push(m));
            }
        });
        return flattened;
    }

    async _listOpenAIStyleModels(config, apiKey, optionalKey = false) {
        const headers = {
            'Accept': 'application/json'
        };

        // Only add Authorization header if API key is provided
        if (apiKey) {
            headers['Authorization'] = 'Bearer ' + apiKey;
        }

        let response;
        try {
            response = await fetch(config.baseURL + '/models', { headers });
        } catch (e) {
            throw new Error('Failed to fetch models (network): ' + (e?.message || e));
        }

        // Provider-specific fallback for DeepSeek: try without /v1 if first attempt fails
        if (!response.ok && (config.baseURL.includes('api.deepseek.com'))) {
            try {
                const altBase = config.baseURL.replace(/\/v1$/, '');
                const altResp = await fetch(altBase + '/models', { headers });
                if (altResp.ok) {
                    response = altResp;
                }
            } catch (_) { /* ignore and fall through to error */ }
        }

        if (!response.ok) {
            const status = response.status;
            if (config.baseURL.includes('api.deepseek.com') && status === 401) {
                throw new Error('DeepSeek: Unauthorized (401). Verify API key; /models may not be enabled for your key.');
            }
            throw new Error('Failed to fetch models: ' + status);
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
        // Log can stay silent in production

        // Known legacy model patterns (specific, safe skips)
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

        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data?.models) ? data.models : []);
        list.forEach(model => {
            const modelId = model.id;
            const modelIdLower = modelId.toLowerCase();

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

    _getCohereModels() {
        return [
            { id: 'header-text', label: '💬 Text Generation', isHeader: true, category: 'text' },
            { id: 'command-r-plus', label: 'Cohere Command R+', category: 'text' },
            { id: 'command-r', label: 'Cohere Command R', category: 'text' },
            { id: 'command', label: 'Cohere Command', category: 'text' },
            { id: 'command-light', label: 'Cohere Command Light', category: 'text' }
        ];
    }

    _getAnthropicModels() {
        return [
            { id: 'header-text', label: '💬 Text Generation', isHeader: true, category: 'text' },
            // Claude 4 models (latest)
            { id: 'claude-4-opus-20250514', label: 'Claude 4 Opus (Latest)', category: 'text' },
            { id: 'claude-4-sonnet-20250514', label: 'Claude 4 Sonnet (Latest)', category: 'text' },
            { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5 (Sep 2024)', category: 'text' },
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

})();
