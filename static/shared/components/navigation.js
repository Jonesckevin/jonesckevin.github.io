// Shared Navigation Component with optional dynamic manifest support
// Optimized with caching and debouncing
class NavigationComponent {
    constructor() {
        this.currentPath = window.location.pathname.replace(/\\/g, '/');
        this.basePath = this.getBasePath();
        // Deprecated: Only used as last resort fallback
        this.manifestPath = `${this.basePath}shared/components/ai-tools-manifest.json`;
        
        // Performance optimizations
        this.manifestCache = new Map();
        this.navigationCache = null;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
        this.lastCacheTime = null;
    }
    
    // Utility: Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    getBasePath() {
        // For Hugo sites, always use root-relative paths
        return '/';
    }
    normalizeHref(href) {
        // Ensure all hrefs are absolute paths from root
        if (!href) return '/';
        // If already absolute path, return as-is
        if (href.startsWith('/')) return href;
        // If it's a relative file like 'index.html', convert to root
        if (href === 'index.html' || href === './index.html') return '/';
        // For other relative paths, make them absolute from root
        return '/' + href.replace(/^\.?\/?/, '');
    }
    isActive(href) {
        // Normalize both paths for comparison
        const normalizedHref = this.normalizeHref(href);
        const currentPath = this.currentPath;
        // Direct path match
        if (currentPath === normalizedHref) return true;
        // For home page, check if we're at root
        if (normalizedHref === '/' && (currentPath === '/' || currentPath === '/index.html')) return true;
        // For other paths, check if current path starts with the href (for section matching)
        if (normalizedHref !== '/' && currentPath.startsWith(normalizedHref.replace(/\/$/, ''))) return true;
        // Legacy filename matching (fallback)
        const name = normalizedHref.split('/').pop();
        return name && currentPath.includes(name);
    }
    async loadManifest() {
        // Check cache first
        if (this.navigationCache && this.lastCacheTime) {
            const cacheAge = Date.now() - this.lastCacheTime;
            if (cacheAge < this.cacheExpiry) {
                console.log('✓ Using cached navigation data');
                return this.navigationCache;
            }
        }
        
        try {
            // Primary: Use Hugo-generated data
            if (window.aiToolsData && window.aiToolsData.categories) {
                console.log('✓ Using Hugo-generated AI tools data, categories:', window.aiToolsData.categories.length);
                this.navigationCache = window.aiToolsData;
                this.lastCacheTime = Date.now();
                return window.aiToolsData;
            }

            // Secondary: Try to wait for Hugo data to load (in case script loads before template)
            console.log('Hugo data not immediately available, waiting...');
            await new Promise(resolve => setTimeout(resolve, 100));
            if (window.aiToolsData && window.aiToolsData.categories) {
                console.log('✓ Using Hugo-generated AI tools data (after wait), categories:', window.aiToolsData.categories.length);
                this.navigationCache = window.aiToolsData;
                this.lastCacheTime = Date.now();
                return window.aiToolsData;
            }

            // Fallback: Use default structure (Hugo data not configured)
            console.log('ℹ Hugo data not configured, using default navigation structure');
            const defaultStructure = this.getDefaultStructure();
            this.navigationCache = defaultStructure;
            this.lastCacheTime = Date.now();
            return defaultStructure;
        } catch (e) {
            console.log('ℹ Using default navigation structure');
            const defaultStructure = this.getDefaultStructure();
            this.navigationCache = defaultStructure;
            this.lastCacheTime = Date.now();
            return defaultStructure;
        }
    }
    getDefaultStructure() {
        // Minimal fallback structure - all data should come from Hugo
        return {
            categories: [
                {
                    title: 'AI Tools',
                    links: [
                        { label: 'Home', href: '/ai-tools/' },
                        { label: 'Core Services', href: '/ai-tools/core-services/' },
                        { label: 'Learning', href: '/ai-tools/learning/' },
                        { label: 'Creative', href: '/ai-tools/creative/' },
                        { label: 'Gaming', href: '/ai-tools/gaming/' }
                    ]
                }
            ]
        };
    }
    buildNavHTML(structure) {
        // Find and extract the Home link
        let homeLink = null;
        const categoriesWithoutHome = structure.categories.map(cat => {
            const linksWithoutHome = cat.links.filter(link => {
                if (link.href === 'index.html' || link.label.toLowerCase() === 'home') {
                    homeLink = link;
                    return false;
                }
                return true;
            });
            return { ...cat, links: linksWithoutHome };
        }).filter(cat => cat.links.length > 0); // Remove empty categories
        // Build home button HTML
        const homeHTML = homeLink ? `
            <li class="home-link">
                <a href="${this.normalizeHref(homeLink.href)}" class="nav-link ${this.isActive(homeLink.href) ? 'active' : ''}">${homeLink.label}</a>
            </li>
        ` : '';
        // Build categories HTML
        const categoriesHTML = categoriesWithoutHome.map(cat => {
            const linksHTML = cat.links.map(link => {
                const href = this.normalizeHref(link.href);
                const active = this.isActive(link.href) ? 'active' : '';
                return `<li><a href="${href}" class="nav-link ${active}">${link.label}</a></li>`;
            }).join('');
            return `
                <li class="menu-category">
                    <div class="category-title">${cat.title}</div>
                    <ul class="category-links">${linksHTML}</ul>
                </li>
            `;
        }).join('');
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="/" style="text-decoration:none;">
                        <h1 class="nav-logo" style="cursor:pointer;">AI Tools</h1>
                    </a>
                    <div class="nav-right">
                        <div class="ai-profile" id="aiProfile">
                            <button class="ai-profile-btn" id="aiProfileBtn" aria-label="AI Settings">
                                <svg class="ai-cog" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="12" cy="12" r="5.5"/>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                                </svg>
                                <span class="ai-badge">AI</span>
                            </button>
                            <div class="ai-dropdown" id="aiDropdown">
                                <div class="ai-dropdown-inner">
                                    <div class="ai-dropdown-header">AI Provider Settings</div>
                                    <div class="ai-field">
                                        <label for="ai-provider">Provider</label>
                                        <select id="ai-provider">
                                            <option value="openai">OpenAI</option>
                                            <option value="cohere">Cohere</option>
                                            <option value="deepseek">DeepSeek</option>
                                            <option value="anthropic">Anthropic (Claude)</option>
                                            <option value="gemini">Google Gemini</option>
                                        </select>
                                    </div>
                                    <div class="ai-field">
                                        <label for="ai-api-key">API Key</label>
                                        <input type="password" id="ai-api-key" placeholder="Enter your API key" />
                                    </div>
                                    <div class="ai-field">
                                        <label for="ai-model">Model</label>
                                        <select id="ai-model" disabled>
                                            <option value="">Enter API key to load models…</option>
                                        </select>
                                        <small id="ai-model-help" class="ai-help">Models are fetched from the selected provider after validating your API key.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="hamburger" id="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                    <ul class="nav-menu" id="navMenu">${homeHTML}${categoriesHTML}</ul>
                </div>
                <div class="nav-overlay" id="navOverlay"></div>
            </nav>
        `;
    }
    async init() {
        // Load manifest if available, otherwise fallback
        const manifest = await this.loadManifest();
        console.log('Navigation manifest loaded:', manifest ? 'SUCCESS' : 'FAILED - using fallback');
        if (manifest) {
            console.log('Manifest categories:', manifest.categories?.length || 0);
        }
        const structure = manifest && manifest.categories ? { categories: manifest.categories } : this.getDefaultStructure();
        // Insert navigation into the body
        const navHTML = this.buildNavHTML(structure);
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        // Initialize navigation functionality
        this.initializeNavigation();
        this.initializeAIProfile();
    }
    initializeNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        if (hamburger && navMenu && navOverlay) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                navOverlay.classList.toggle('active');
            });
            navOverlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    navOverlay.classList.remove('active');
                });
            });
        }
    }
    initializeAIProfile() {
        const btn = document.getElementById('aiProfileBtn');
        const dropdown = document.getElementById('aiDropdown');
        const overlay = document.getElementById('navOverlay');
        if (!btn || !dropdown) return;
        const toggle = (force) => {
            const isOpen = force !== undefined ? force : dropdown.classList.contains('open') === false;
            if (isOpen) {
                dropdown.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                dropdown.setAttribute('aria-hidden', 'false');
            } else {
                dropdown.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                toggle(false);
            }
        });
        if (overlay) overlay.addEventListener('click', () => toggle(false));
        // Prefill using session if available
        const providerEl = document.getElementById('ai-provider');
        const keyEl = document.getElementById('ai-api-key');
        const modelEl = document.getElementById('ai-model');
        const updateApiKeyPlaceholder = (provider) => {
            if (!keyEl) return;
            const placeholders = {
                openai: 'Enter your OpenAI API key (sk-...)',
                cohere: 'Enter your Cohere API key',
                deepseek: 'Enter your DeepSeek API key (sk-...)',
                anthropic: 'Enter your Anthropic API key (sk-ant-...)',
                gemini: 'Enter your Gemini API key (AIza...)'
            };
            keyEl.placeholder = placeholders[provider] || 'Enter your API key';
        };
        const resetModelSelect = () => {
            if (!modelEl) return;
            modelEl.innerHTML = '<option value="">Enter API key to load models…</option>';
            modelEl.disabled = true;
            const help = document.getElementById('ai-model-help');
            if (help) help.textContent = 'Models are fetched from the selected provider after validating your API key.';
        };
        const tryLoadModels = async () => {
            if (!window.apiManager || !window.utils || !providerEl || !keyEl || !modelEl) return;
            const provider = providerEl.value;
            const key = (keyEl.value || '').trim();
            const help = document.getElementById('ai-model-help');
            if (!provider || !window.utils.validateApiKey(key, provider)) {
                resetModelSelect();
                return;
            }
            try {
                if (help) help.textContent = 'Loading models…';
                const models = await window.apiManager.listModels(provider, key);
                if (!Array.isArray(models) || models.length === 0) {
                    if (help) help.textContent = 'No chat models available for this key/provider.';
                    return;
                }
                // Render models with category headers as optgroups
                console.log('📋 Rendering models with categorization...');
                let html = '';
                let currentCategory = null;

                models.forEach(m => {
                    if (m.isHeader) {
                        // Close previous optgroup if exists
                        if (currentCategory !== null) {
                            html += '</optgroup>';
                        }
                        // Start new optgroup for category
                        html += `<optgroup label="${m.label}">`;
                        currentCategory = m.category;
                    } else {
                        // Regular model option - add visual prefix for indentation
                        // Using simple bullet and spaces that work across all browsers
                        const prefix = '  • '; // 2 spaces + bullet point
                        html += `<option value="${m.id}">${prefix}${m.label}</option>`;
                    }
                });

                // Close last optgroup if exists
                if (currentCategory !== null) {
                    html += '</optgroup>';
                }

                modelEl.innerHTML = html;
                modelEl.disabled = false;
                const desired = window.apiManager.getModel(provider) || window.apiManager.getProviderConfig(provider).defaultModel;
                const found = Array.from(modelEl.options).some(opt => opt.value === desired);
                modelEl.value = found ? desired : modelEl.options[0].value;
                window.apiManager.setModel(modelEl.value, provider);
                if (help) help.textContent = 'Model list loaded from provider.';
            } catch (err) {
                console.error('Failed to load models:', err);
                const help = document.getElementById('ai-model-help');
                if (help) help.textContent = err.message || 'Failed to load models.';
            }
        };
        // Populate with stored values (if apiManager ready)
        const hydrate = () => {
            try {
                if (window.apiManager) {
                    const prov = window.apiManager.getProvider();
                    if (providerEl && prov) providerEl.value = prov;
                    updateApiKeyPlaceholder(prov || 'openai');
                    const k = window.apiManager.getApiKey();
                    if (keyEl && k) keyEl.value = k;
                } else {
                    updateApiKeyPlaceholder('openai');
                }
            } catch { /* noop */ }
        };
        hydrate();
        // Wire up changes; if API manager exists, persist immediately
        if (providerEl) {
            providerEl.addEventListener('change', (e) => {
                const val = e.target.value;
                updateApiKeyPlaceholder(val);
                if (window.apiManager) window.apiManager.setProvider(val);
                resetModelSelect();
                tryLoadModels();
            });
        }
        if (keyEl) {
            let t;
            keyEl.addEventListener('input', (e) => {
                const val = e.target.value;
                if (window.apiManager) window.apiManager.setApiKey(val);
                clearTimeout(t);
                t = setTimeout(tryLoadModels, 400);
            });
        }
        if (modelEl) {
            modelEl.addEventListener('change', (e) => {
                const val = e.target.value;
                if (window.apiManager) window.apiManager.setModel(val);
            });
        }
        // Attempt initial model load once everything is ready
        setTimeout(tryLoadModels, 0);

        // Add CSS styling for categorized model select
        const style = document.createElement('style');
        style.textContent = `
            #ai-model optgroup {
                font-weight: bold;
                font-style: normal;
                color: #ff6b35;
                background: rgba(255, 107, 53, 0.05);
                padding: 8px 0 4px 0;
                margin-top: 4px;
            }
            #ai-model optgroup option {
                font-weight: normal;
                color: #333;
                padding: 6px 12px 6px 24px !important;
                padding-left: 24px !important;
                margin-left: 12px;
            }
            #ai-model option {
                font-weight: normal;
                color: #333;
                padding: 6px 12px 6px 24px;
                text-indent: 12px;
            }
            #ai-model {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
        `;
        document.head.appendChild(style);
    }
}
// Auto-initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const nav = new NavigationComponent();
    nav.init();
});
