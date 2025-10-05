// Shared Navigation Component with optional dynamic manifest support
class NavigationComponent {
    constructor() {
        this.currentPath = window.location.pathname.replace(/\\/g, '/');
        this.basePath = this.getBasePath();
        // Deprecated: Only used as last resort fallback
        this.manifestPath = `${this.basePath}shared/components/ai-tools-manifest.json`;
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
        try {
            // Primary: Use Hugo-generated data
            if (window.aiToolsData && window.aiToolsData.categories) {
                console.log('✓ Using Hugo-generated AI tools data, categories:', window.aiToolsData.categories.length);
                return window.aiToolsData;
            }

            // Secondary: Try to wait for Hugo data to load (in case script loads before template)
            console.log('Hugo data not immediately available, waiting...');
            await new Promise(resolve => setTimeout(resolve, 100));
            if (window.aiToolsData && window.aiToolsData.categories) {
                console.log('✓ Using Hugo-generated AI tools data (after wait), categories:', window.aiToolsData.categories.length);
                return window.aiToolsData;
            }

            // Deprecated: Fallback to JSON manifest (should not be needed)
            console.warn('⚠ Hugo data unavailable, attempting deprecated JSON manifest fallback');
            const res = await fetch(this.manifestPath, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log('📄 JSON manifest loaded, categories:', data.categories?.length || 0);
            return data;
        } catch (e) {
            console.error('❌ All manifest sources failed, using minimal fallback:', e);
            return this.getDefaultStructure();
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
                                <span class="ai-badge">AI</span>
                            </button>
                            <div class="ai-dropdown" id="aiDropdown">
                                <div class="ai-dropdown-inner">
                                    <div class="ai-dropdown-header">AI Provider Settings</div>
                                    <div class="ai-field">
                                        <label for="ai-provider">Provider</label>
                                        <select id="ai-provider">
                                            <option value="openai">OpenAI</option>
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
                modelEl.innerHTML = models.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
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
    }
}
// Auto-initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const nav = new NavigationComponent();
    nav.init();
});
