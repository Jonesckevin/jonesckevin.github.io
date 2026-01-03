/**
 * Panel Resizer for AI Tools Layout
 * Handles resizable divider between form and results sections
 */

(function() {
    'use strict';

    const MIN_WIDTH = 300;
    const MAX_WIDTH = 800;
    const STORAGE_KEY = 'ai-tools-form-width';
    const DESKTOP_BREAKPOINT = 1024;

    function initPanelResizer() {
        const wrapper = document.querySelector('.ai-tools-layout');
        const formSection = document.querySelector('.ai-form-section');
        const divider = document.querySelector('.layout-divider');
        const resultsSection = document.querySelector('.ai-results-section');

        if (!wrapper || !formSection || !divider || !resultsSection) {
            return;
        }

        if (window.innerWidth >= DESKTOP_BREAKPOINT) {
            initLeftResizer(wrapper, formSection, divider);
            loadSavedWidth(wrapper);
        }

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (window.innerWidth >= DESKTOP_BREAKPOINT) {
                    loadSavedWidth(wrapper);
                } else {
                    // Reset to mobile layout
                    wrapper.style.gridTemplateColumns = '1fr';
                    formSection.style.width = '';
                    resultsSection.style.width = '';
                }
            }, 250);
        });
    }

    function initLeftResizer(wrapper, formSection, divider) {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        divider.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = formSection.offsetWidth;
            divider.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            let newWidth = startWidth + deltaX;

            // Constrain width
            newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));

            // Update grid template
            wrapper.style.gridTemplateColumns = `${newWidth}px 4px 1fr`;

            // Save to localStorage
            saveWidth(newWidth);
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                divider.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });

        // Touch support for mobile/tablet
        divider.addEventListener('touchstart', function(e) {
            isResizing = true;
            startX = e.touches[0].clientX;
            startWidth = formSection.offsetWidth;
            divider.classList.add('dragging');
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            if (!isResizing) return;

            const deltaX = e.touches[0].clientX - startX;
            let newWidth = startWidth + deltaX;
            newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
            wrapper.style.gridTemplateColumns = `${newWidth}px 4px 1fr`;
            saveWidth(newWidth);
        }, { passive: true });

        document.addEventListener('touchend', function() {
            if (isResizing) {
                isResizing = false;
                divider.classList.remove('dragging');
            }
        });
    }

    function saveWidth(width) {
        try {
            localStorage.setItem(STORAGE_KEY, width);
        } catch (e) {
            // Silently fail if localStorage is not available (incognito mode)
        }
    }

    function loadSavedWidth(wrapper) {
        try {
            const savedWidth = localStorage.getItem(STORAGE_KEY);
            if (savedWidth && window.innerWidth >= DESKTOP_BREAKPOINT) {
                const width = parseInt(savedWidth);
                if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
                    wrapper.style.gridTemplateColumns = `${width}px 4px 1fr`;
                    return;
                }
            }
        } catch (e) {
            // Silently fail
        }

        // Set default desktop layout
        if (window.innerWidth >= DESKTOP_BREAKPOINT) {
            wrapper.style.gridTemplateColumns = '500px 4px 1fr';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanelResizer);
    } else {
        initPanelResizer();
    }
})();
