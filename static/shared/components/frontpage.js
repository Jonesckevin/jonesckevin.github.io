// Front page renderer driven by nav-manifest.json
(function () {
    function getBasePath() {
        const path = window.location.pathname.replace(/\\/g, '/');
        // For Hugo sites, always use root-relative paths
        return '/';
    }

    async function loadManifest(basePath) {
        try {
            const res = await fetch(`${basePath}shared/components/nav-manifest.json`, { cache: 'no-cache' });
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    function renderHero(hero) {
        const heroEl = document.querySelector('.hero-section');
        if (!heroEl || !hero) return;
        heroEl.innerHTML = `
            <h1 class="hero-title">${hero.title || ''}</h1>
            <p class="hero-description">${hero.description || ''}</p>
        `;
    }

    function serviceCardHTML(item, basePath) {
        const meta = buildCardMeta(item);
        const title = meta.title;
        const desc = meta.description;
        const features = meta.features;
        const ctaText = meta.ctaText;
        // Handle absolute URLs properly - don't double up the basePath
        const href = item.href.startsWith('/') ? item.href : `${basePath}${item.href}`;
        const category = item._category || '';
        const searchText = [title, desc, features.join(' '), category, item.label || '', item.href || '']
            .join(' ').toLowerCase();
        return `
        <div class="service-card" data-searchtext="${searchText.replace(/"/g, '&quot;')}">
            <div class="card-header">
                <h3>${title} ${category ? `<span class=\"pill\" style=\"margin-left:8px;\">${category}</span>` : ''}</h3>
            </div>
            <div class="card-content">
                <div class="card-content-wrapper">
                    ${desc ? `<p>${desc}</p>` : ''}
                    ${features.length ? `<ul class="feature-list">${features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                </div>
            </div>
            <div class="card-footer">
                <a href="${href}" class="cta-button">${ctaText}</a>
            </div>
        </div>`;
    }

    function buildCardMeta(item) {
        const label = (item.label || '').trim();
        const href = (item.href || '').toLowerCase();
        const cat = (item._category || '').toLowerCase();
        const hasHome = item.home && typeof item.home === 'object';

        // If full metadata provided, normalize and return
        if (hasHome) {
            return {
                title: item.home.title || label,
                description: item.home.description || defaultDescription(label, href, cat),
                features: Array.isArray(item.home.features) && item.home.features.length
                    ? item.home.features
                    : defaultFeatures(label, href, cat),
                ctaText: item.home.ctaText || defaultCTA(label, href, cat)
            };
        }

        // Fallbacks for missing home metadata
        return {
            title: label,
            description: defaultDescription(label, href, cat),
            features: defaultFeatures(label, href, cat),
            ctaText: defaultCTA(label, href, cat)
        };
    }

    function defaultDescription(label, href, cat) {
        if (href.includes('thought-provoking-questions')) {
            return 'Practice thought-provoking interview questions with AI-crafted prompts and guidance.';
        }
        if (href.includes('visual-roadmap')) {
            return 'Build a clear, visual roadmap and preview multiple chart styles from generated plans.';
        }
        if (cat.includes('learning')) {
            return 'Learn faster with structured AI assistance and interactive outputs.';
        }
        if (cat.includes('gaming')) {
            return 'Enhance your tabletop and storytelling with AI-powered generators.';
        }
        return 'Open this tool to get started with AI-powered assistance.';
    }

    function defaultFeatures(label, href, cat) {
        if (href.includes('thought-provoking-questions')) {
            return ['Interview scenarios', 'Difficulty variety', 'Actionable follow-ups'];
        }
        if (href.includes('visual-roadmap')) {
            return ['Phase planning', 'Milestones & metrics', 'Chart previews'];
        }
        if (cat.includes('learning')) {
            return ['Guided structure', 'Clear outputs', 'Downloadable results'];
        }
        if (cat.includes('gaming')) {
            return ['Creative prompts', 'Configurable options', 'Export formats'];
        }
        return ['Fast to use', 'Secure & local', 'MD/HTML/TXT downloads'];
    }

    function defaultCTA(label, href, cat) {
        if (href.includes('thought-provoking-questions')) return 'Start';
        if (href.includes('visual-roadmap')) return 'Start';
        if (cat.includes('gaming')) return 'Start';
        if (cat.includes('learning')) return 'Start';
        return 'Open';
    }

    function ensureSearchBar() {
        const main = document.querySelector('main .main-content, main') || document.querySelector('main');
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return null;
        let searchWrap = document.querySelector('#frontpage-search-wrap');
        if (!searchWrap) {
            searchWrap = document.createElement('div');
            searchWrap.id = 'frontpage-search-wrap';
            searchWrap.style.display = 'flex';
            searchWrap.style.justifyContent = 'center';
            searchWrap.style.margin = '10px 0 20px';
            searchWrap.innerHTML = `
                <input id="frontpage-search" type="search" placeholder="Search tools..."
                       style="max-width:720px;width:100%;padding:10px 14px;border-radius:8px;border:1px solid rgba(255,107,53,.3);background:#0f1216;color:#e6e6e6;outline:none;" />
            `;
            servicesGrid.parentElement.insertBefore(searchWrap, servicesGrid);
        }
        return /** @type {HTMLInputElement} */(document.getElementById('frontpage-search'));
    }

    function hookSearch(inputEl, grid) {
        if (!inputEl || !grid) return;
        inputEl.addEventListener('input', () => {
            const q = inputEl.value.trim().toLowerCase();
            const cards = Array.from(grid.querySelectorAll('.service-card'));
            if (!q) {
                cards.forEach(c => (c.style.display = ''));
                return;
            }
            cards.forEach(card => {
                const hay = (card.getAttribute('data-searchtext') || '').toLowerCase();
                card.style.display = hay.includes(q) ? '' : 'none';
            });
        });
    }

    function renderServices(structure, basePath) {
        const grid = document.querySelector('.services-grid');
        if (!grid || !structure?.categories) return;

        const allLinks = [];
        structure.categories.forEach(cat => {
            (cat.links || []).forEach(link => {
                // Skip Home link from Core Services on the front page
                const href = (link.href || '').toLowerCase();
                const label = (link.label || '').toLowerCase();
                if (href.endsWith('index.html') || label === 'home') return;
                // Clone link to avoid mutating manifest object
                const item = Object.assign({}, link, { _category: cat.title || '' });
                allLinks.push(item);
            });
        });

        grid.innerHTML = allLinks.map(item => serviceCardHTML(item, basePath)).join('');

        // Ensure and bind search
        const input = ensureSearchBar();
        hookSearch(input, grid);
    }

    function renderSecurity(site) {
        const secWrap = document.querySelector('.security-section');
        const grid = document.querySelector('.security-grid');
        if (!secWrap || !grid || !site?.security) return;
        if (site.securityTitle) {
            const h2 = secWrap.querySelector('h2') || document.createElement('h2');
            h2.textContent = site.securityTitle;
            if (!h2.parentElement) secWrap.prepend(h2);
        }
        grid.innerHTML = site.security.map(s => `
            <div class="security-item">
                <h4>${s.title}</h4>
                <p>${s.description}</p>
            </div>
        `).join('');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const basePath = getBasePath();
        const manifest = await loadManifest(basePath);
        if (!manifest) return;

        // Render sections
        if (manifest.site?.hero) renderHero(manifest.site.hero);
        renderServices(manifest, basePath);
        renderSecurity(manifest.site);
    });
})();
