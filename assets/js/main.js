// Theme Manager with localStorage optimization
const themeManager = {
  cache: null,
  
  get() {
    if (!this.cache) {
      this.cache = window.localStorage && window.localStorage.getItem("theme");
    }
    return this.cache;
  },
  
  set(value) {
    this.cache = value;
    if (window.localStorage) {
      localStorage.setItem("theme", value);
    }
  },
  
  remove() {
    this.cache = null;
    if (window.localStorage) {
      localStorage.removeItem("theme");
    }
  }
};

const themeToggle = document.querySelector(".theme-toggle");
const chosenTheme = themeManager.get();
const chosenThemeIsDark = chosenTheme == "dark";
const chosenThemeIsLight = chosenTheme == "light";

function detectOSColorTheme() {
  if (chosenThemeIsDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (chosenThemeIsLight) {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function switchTheme(e) {
  if (chosenThemeIsDark) {
    themeManager.set("light");
  } else if (chosenThemeIsLight) {
    themeManager.set("dark");
  } else {
    if (document.documentElement.getAttribute("data-theme") == "dark") {
      themeManager.set("light");
    } else {
      themeManager.set("dark");
    }
  }

  detectOSColorTheme();
  window.location.reload();
}

if (themeToggle) {
  themeToggle.addEventListener("click", switchTheme, false);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());

  detectOSColorTheme();
} else {
  themeManager.remove();
}

// Code Block Enhancement
document.addEventListener('DOMContentLoaded', function() {
  // Legacy AI Tools button class normalization (consolidation safety net)
  try {
    const upgradeBtn = (el, role) => {
      if (!el) return;
      el.classList.add('action-btn');
      if (role === 'copy') el.classList.add('copy-btn');
      if (role === 'download') el.classList.add('download-btn');
      el.classList.remove('btn-copy');
      el.classList.remove('btn-download');
      // Clean accidental primary styling on non-generate buttons
      if (role !== 'generate') el.classList.remove('btn-primary');
    };

    // Upgrade standalone legacy copy/download buttons
    document.querySelectorAll('.btn-copy').forEach(btn => upgradeBtn(btn, 'copy'));
    document.querySelectorAll('.btn-download').forEach(btn => upgradeBtn(btn, 'download'));

    // Fix hybrid patterns like "btn-primary btn-download"
    document.querySelectorAll('button.btn-primary.btn-download').forEach(btn => upgradeBtn(btn, 'download'));

    // Normalize ad-hoc custom classes to standard roles
    document.querySelectorAll('.analogy-copy-btn, .hook-copy-btn, .copy-btn:not(.action-btn)').forEach(btn => upgradeBtn(btn, 'copy'));

    // Normalize legacy container class if present
    document.querySelectorAll('.action-buttons').forEach(box => {
      box.classList.remove('action-buttons');
      box.classList.add('result-actions');
    });
  } catch (e) {
    console.warn('Legacy button normalization skipped:', e);
  }

  // Add copy button to code blocks
  const codeBlocks = document.querySelectorAll('.code-block-wrapper');
  
  codeBlocks.forEach(wrapper => {
    const header = wrapper.querySelector('.code-block-header');
    const codeElement = wrapper.querySelector('code');
    
    if (header && codeElement) {
      // Create copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.innerHTML = '📋 Copy';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      
      // Insert before the arrow
      header.appendChild(copyBtn);
      
      copyBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent collapsing when clicking copy
        
        // Get code text without line numbers
        const code = Array.from(codeElement.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('line-number')))
          .map(node => node.textContent)
          .join('');
        
        navigator.clipboard.writeText(code.trim()).then(() => {
          copyBtn.innerHTML = '✓ Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy:', err);
          copyBtn.innerHTML = '✗ Failed';
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy';
          }, 2000);
        });
      });
    }
  });
  
  // Store collapse state in localStorage
  const collapsibles = document.querySelectorAll('.code-block-collapsible');
  collapsibles.forEach((details, index) => {
    const storageKey = `code-block-${index}-open`;
    
    // Restore state
    const savedState = localStorage.getItem(storageKey);
    if (savedState !== null) {
      details.open = savedState === 'true';
    }
    
    // Save state on toggle
    details.addEventListener('toggle', function() {
      localStorage.setItem(storageKey, details.open);
    });
  });
});
