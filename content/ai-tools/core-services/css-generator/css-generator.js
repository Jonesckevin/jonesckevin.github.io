// Global variables
let currentCSS = '';
let apiManager;
let downloadManager;

// Wait for API Manager to be ready
function waitForAPIManager() {
    return new Promise((resolve) => {
        if (window.apiManager) {
            resolve(window.apiManager);
        } else {
            document.addEventListener('apiManagerReady', () => {
                resolve(window.apiManager);
            }, { once: true });
        }
    });
}

// Wait for Download Manager to be ready
function waitForDownloadManager() {
    return new Promise((resolve) => {
        if (window.DownloadManager) {
            resolve(new DownloadManager());
        } else {
            // Poll for DownloadManager
            const checkInterval = setInterval(() => {
                if (window.DownloadManager) {
                    clearInterval(checkInterval);
                    resolve(new DownloadManager());
                }
            }, 100);
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    // Wait for managers to be ready
    apiManager = await waitForAPIManager();
    downloadManager = await waitForDownloadManager();
});

// Generate CSS function
async function generateCSS(event) {
    if (event) {
        event.preventDefault();
    }

    // Ensure API Manager is ready
    if (!apiManager) {
        apiManager = await waitForAPIManager();
    }

    // Get API settings from global header configuration
    const apiKey = document.getElementById('ai-key').value.trim();
    const aiProvider = document.getElementById('ai-provider').value;

    const cssRequest = document.getElementById('cssRequest').value.trim();
    const cssScope = document.getElementById('cssScope').value;
    const styleTheme = document.getElementById('styleTheme').value;

    // Validation
    if (!utils.validateApiKey(apiKey, aiProvider)) {
        const providerNames = {
            openai: 'OpenAI',
            deepseek: 'DeepSeek',
            anthropic: 'Anthropic',
            gemini: 'Gemini',
            grok: 'Grok (X.AI)'
        };
        utils.showError(
            document.getElementById('errorDiv'),
            `Please configure your ${providerNames[aiProvider]} API key in the AI Settings (top right corner)`
        );
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    if (!cssRequest) {
        utils.showError(document.getElementById('errorDiv'), 'Please describe your CSS needs');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    // Show loading
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';

    try {
        const scopeDescriptions = {
            general: 'various HTML elements',
            text: 'text and typography elements (headings, paragraphs, links, lists)',
            buttons: 'buttons and link elements',
            tables: 'tables and list elements',
            forms: 'form elements (inputs, textareas, selects, labels)',
            cards: 'card containers and their components',
            navigation: 'navigation and menu elements'
        };

        const themeDescriptions = {
            vibrant: 'vibrant and colorful design with bold colors and gradients',
            modern: 'modern and minimalist aesthetic with clean lines and subtle effects',
            professional: 'professional and corporate look with conservative colors',
            dark: 'dark mode theme with dark backgrounds and light text',
            light: 'light and airy theme with bright backgrounds and subtle shadows',
            retro: 'retro and vintage style with classic design patterns'
        };

        const systemPrompt = `You are a professional CSS developer. Generate clean, well-structured CSS code based on user requirements. Think about what the user might be trying to accomplish or describe to deliver the best possible CSS solution. Use a very clean contrast of colors to ensure readability.

Target Elements: ${scopeDescriptions[cssScope]}
Style Theme: ${themeDescriptions[styleTheme]}

IMPORTANT RULES:
1. Generate ONLY valid CSS code - no explanations, no markdown, no comments outside CSS
2. Use the class "preview-element" as the main selector for all styles
3. Make styles BOLD and VISIBLE - use strong colors, clear borders, noticeable effects
4. Include prominent hover states with clear visual feedback (color changes, transforms, shadows)
5. Use modern CSS properties (flexbox, grid, custom properties, gradients, shadows)
6. Ensure excellent contrast and readability - text should stand out clearly
7. Add visual impact with: borders, shadows, gradients, transitions, transforms
8. Include specific selectors for different element types (h1, h2, p, button, table, etc.)
9. Make tables compact with proper spacing - use padding: 8px-12px for cells
10. Do NOT use backticks, markdown code blocks, or any text outside the CSS

VISUAL IMPACT GUIDELINES:
- Headings: Use bold colors, larger sizes, text-shadow or underlines
- Buttons: Use gradients, shadows, transform on hover (scale or translateY)
- Tables: Use alternating row colors, border styling, hover effects on rows
- Links: Use distinct colors, underline on hover, color transition
- Cards: Use box-shadow, border-radius, background contrast
- Forms: Use border highlights, focus states with glow effects

Example structure with IMPACT:
.preview-element {
    /* Base styles with visual presence */
}

.preview-element h1 {
    /* Bold, colorful heading - use text-shadow, gradients, or borders */
    color: #vibrant-color;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.preview-element button {
    /* Eye-catching button - gradients, shadows */
    background: linear-gradient(135deg, color1, color2);
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
}

.preview-element button:hover {
    /* Clear hover feedback */
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.4);
}

.preview-element table {
    /* Compact, styled table */
    border-collapse: collapse;
}

.preview-element th,
.preview-element td {
    padding: 10px 12px; /* Compact padding */
    border: 1px solid #color;
}

.preview-element tr:hover {
    background-color: #hover-color;
}`;

        const userPrompt = `Create CSS for: ${cssRequest}

Requirements:
- Scope: ${scopeDescriptions[cssScope]}
- Theme: ${themeDescriptions[styleTheme]}
- Make it VISUALLY STRIKING with strong colors, borders, shadows, and gradients
- Create NOTICEABLE hover and active states that provide clear feedback
- Ensure high contrast and bold styling so changes are immediately visible
- Make tables COMPACT with padding around 8-12px for cells
- Use the "preview-element" class as the base selector

Generate the CSS code now (ONLY CSS, no explanations):`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ];

        // Use the global apiManager instance
        const response = await apiManager.makeRequest(messages, {
            provider: aiProvider,
            apiKey: apiKey,
            maxTokens: 2000,
            temperature: 0.7
        });

        // Clean up the response - remove markdown code blocks if present
        let cleanCSS = response
            .replace(/```css\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        currentCSS = cleanCSS;

        // Show result first (so elements are accessible)
        document.getElementById('loadingDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'block';

        // Update editor (after result div is visible)
        const editor = document.getElementById('cssCodeEditor');
        if (editor) {
            editor.value = cleanCSS;
        }

        // Apply CSS to preview
        applyLiveCSS(cleanCSS);

        // Scroll to result
        document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('Error generating CSS:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        utils.showError(
            document.getElementById('errorDiv'),
            error.message || 'Failed to generate CSS. Please check your API key and try again.'
        );
        document.getElementById('errorDiv').style.display = 'block';
    }
}

// Apply live CSS to preview
function applyLiveCSS(css) {
    const styleTag = document.getElementById('liveStyleTag');
    if (styleTag) {
        styleTag.textContent = css;
        currentCSS = css;
    }
}

// Apply CSS changes from editor (triggered by Apply button)
function applyCSS() {
    const editor = document.getElementById('cssCodeEditor');
    if (!editor) return;

    const cssCode = editor.value;
    applyLiveCSS(cssCode);

    // Show success feedback on the Apply button
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Applied!';
    btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// Copy CSS code
function copyCSSCode() {
    const editor = document.getElementById('cssCodeEditor');
    if (!editor) {
        alert('CSS editor not found.');
        return;
    }

    const cssCode = editor.value;

    navigator.clipboard.writeText(cssCode).then(() => {
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    });
}

// Download CSS file
function downloadCSS() {
    const editor = document.getElementById('cssCodeEditor');
    if (!editor) {
        alert('CSS editor not found.');
        return;
    }

    const cssCode = editor.value;
    const blob = new Blob([cssCode], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Copy full code (CSS + HTML example)
function copyFullCode() {
    const editor = document.getElementById('cssCodeEditor');
    if (!editor) {
        alert('CSS editor not found.');
        return;
    }

    const cssCode = editor.value;
    const previewContent = document.querySelector('.preview-content');

    let htmlExample = '';
    if (previewContent) {
        htmlExample = previewContent.innerHTML;
    }

    const fullCode = `<!-- CSS Styles -->
<style>
${cssCode}
</style>

<!-- HTML Examples (All Sections) -->
${htmlExample}`;

    navigator.clipboard.writeText(fullCode).then(() => {
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    });
}

// Generate variation
async function generateVariation() {
    // Ensure API Manager is ready
    if (!apiManager) {
        apiManager = await waitForAPIManager();
    }

    // Get API settings from global header configuration
    const apiKey = document.getElementById('ai-key').value.trim();
    const aiProvider = document.getElementById('ai-provider').value;

    const editor = document.getElementById('cssCodeEditor');
    if (!editor) {
        utils.showError(document.getElementById('errorDiv'), 'CSS editor not found.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    const currentCSSCode = editor.value;

    if (!currentCSSCode) {
        utils.showError(document.getElementById('errorDiv'), 'No CSS to regenerate. Please generate CSS first.');
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    if (!utils.validateApiKey(apiKey, aiProvider)) {
        utils.showError(
            document.getElementById('errorDiv'),
            'Please configure your API key in the AI Settings (top right corner)'
        );
        document.getElementById('errorDiv').style.display = 'block';
        return;
    }

    // Show loading
    document.getElementById('errorDiv').style.display = 'none';
    document.getElementById('loadingDiv').style.display = 'block';

    try {
        const systemPrompt = `You are an elite front-end and CSS art director. Your task: produce a DISTINCT, HIGH-IMPACT VARIATION of previously generated CSS while KEEPING EXACT SELECTORS and overall structural intent intact.

    PRIMARY OBJECTIVE:
    Transform the visual style (color system, depth, lighting, motion, accents, texture) WITHOUT breaking layout, semantics, or selector names. Output ONLY raw CSS. No commentary, markdown, backticks, or extraneous text.

    ALLOWED CHANGES (ENCOURAGED):
    - Color palette overhaul (e.g., neon cyberpunk, elegant monochrome + accent, luxurious dark gold, soft pastel, vibrant gradient fusion, glassmorphism, frosted UI, retro synthwave, brutalist flat blocks, claymorphism depth)
    - Typography contrast (sizes, weights, letter-spacing) while staying readable
    - Shadows (layered, colored, inner, glow, outline effects) for hierarchy / depth
    - Gradients (angular, conic, subtle noise-like via layered effects)
    - Borders (thickness, style, double, dashed, accent bars, asymmetry)
    - Spacing rhythm (padding / gap adjustments) while preserving general proportions
    - Border-radius experimentation (sharp, pill, mixed radii, geometric)
    - Motion (hover / active / focus transitions, gentle scale, translate, rotateX/Y, accent glow pulses)
    - Table striping, row hover emphasis, header differentiation
    - Button states: strong hover/active/focus feedback (color shift + depth + motion)
    - Link micro-interactions (underline reveal, gradient text shift, accent underline bar, glow)
    - Form control focus rings (accessible contrasting outline or glow)
    - Use CSS custom properties to unify palette if beneficial

    STRICT RULES:
    1. DO NOT: change, remove, or add selectors; keep all existing selector names exactly.
    2. DO NOT: strip existing functional properties that impact layout unless replaced with an equivalent.
    3. DO NOT: introduce external assets, fonts via @import, or libraries.
    4. DO NOT: output comments unless they are inside CSS comment syntax (/* ... */) and ONLY if essential (prefer minimal or none).
    5. MUST: ensure WCAG-friendly contrast for text vs background (especially buttons, links, headings, table cells, form inputs).
    6. MUST: provide CLEAR :hover, :focus, :active differentiation (focus visible for keyboard).
    7. MUST: keep table cell padding compact (approx 8–12px) unless a deliberate stylistic alternative (justify if changed with clarity).
    8. MUST: keep transitions performant (transform, opacity, color) – avoid layout thrash.
    9. MUST: no excessive animation loops (no infinite unless subtle and purposeful).
    10. Output ONLY VALID CSS. ABSOLUTELY NO extraneous prose.

    ADVANCED STYLING IDEAS (OPTIONAL – pick 1–2 coherent directions, do NOT mix too many):
    - Glassmorphism: layered translucency + subtle light borders + inner glow accents
    - Neo-brutalism: flat vivid blocks, thick borders, sharp shadows offset
    - Dark neon: deep charcoal backgrounds + saturated edge glows + gradient accents
    - Editorial modern: refined serif heading + precise hairline rules + muted palette + accent underline
    - Gradient energy: multi-stop angular gradients + layered hover sheen + subtle grain simulation (via layered shadows)
    - Retro synthwave: magenta/cyan gradients, grid-like underlines, luminous hover glows
    - Plush / clay: soft large radii + diffused multi-layer shadows + warm neutral palette
    - Minimal premium: monochrome + single metallic or electric accent, precise micro-interactions

    HOVER / ACTIVE / FOCUS GUIDELINES:
    - Hover: visible transformation (color shift + shadow depth OR light translation OR scale 1.03)
    - Active: compress / press effect (translateY(1–2px) or reduce shadow)
    - Focus (keyboard): strong outline OR glow distinct from hover
    - Links: underline reveal (e.g., scaleX animation), color shift, or gradient text on hover

    TABLES:
    - Compact, zebra stripes or subtle row separators
    - Hover row emphasis (background or outline glow)
    - Distinct header styling (contrast + weight + subtle background or gradient)

    FORMS:
    - Inputs: clear default, strong focus ring / glow, optional subtle inset or ambient shadow
    - Buttons near forms consistent with global button style but contextually harmonized

    REQUIRED:
    Produce a cohesive, opinionated aesthetic. Push visual identity confidently while remaining usable.

    RETURN:
    Only the full revised CSS (no explanations).`;

        const userPrompt = `Create a variation of this CSS with different styling:

${currentCSSCode}

Keep the same selectors and structure, but change the visual styling to create a different aesthetic.
Generate ONLY the CSS code:`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            }
        ];

        // Use the global apiManager instance
        const response = await apiManager.makeRequest(messages, {
            provider: aiProvider,
            apiKey: apiKey,
            maxTokens: 2000,
            temperature: 0.9
        });

        // Clean up the response
        let cleanCSS = response
            .replace(/```css\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        currentCSS = cleanCSS;

        // Update editor and preview (with null check)
        const editor = document.getElementById('cssCodeEditor');
        if (editor) {
            editor.value = cleanCSS;
        }
        applyLiveCSS(cleanCSS);

        // Hide loading
        document.getElementById('loadingDiv').style.display = 'none';

    } catch (error) {
        console.error('Error generating variation:', error);
        document.getElementById('loadingDiv').style.display = 'none';
        utils.showError(
            document.getElementById('errorDiv'),
            error.message || 'Failed to generate variation. Please try again.'
        );
        document.getElementById('errorDiv').style.display = 'block';
    }
}
