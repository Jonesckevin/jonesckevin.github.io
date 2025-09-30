/**
 * Download Manager Component
 * Provides standardized content conversion and download functionality
 */

class DownloadManager {
    constructor() {
        this.currentContent = {
            original: '',
            html: '',
            markdown: '',
            txt: ''
        };
    }

    // Set the content for download operations
    setContent(content, format = 'markdown') {
        this.currentContent.original = content;
        if (format === 'markdown') {
            // Clean up malformed markdown before setting
            this.currentContent.markdown = this.cleanMarkdown(content);
            this.currentContent.html = this.markdownToHtml(this.currentContent.markdown);
            this.currentContent.txt = this.markdownToText(this.currentContent.markdown);
        } else if (format === 'html') {
            this.currentContent.html = content;
            this.currentContent.markdown = this.htmlToMarkdown(content);
            this.currentContent.txt = this.htmlToText(content);
        }
    }

    // Clean up malformed markdown formatting
    cleanMarkdown(content) {
        return content
            // Fix standalone --- lines that might be malformed
            .replace(/^---\s*$/gm, '\n---\n')
            // Fix --- that appears mid-sentence by properly separating it
            .replace(/\s+---\s+/g, '\n\n---\n\n')
            .replace(/\s+---$/gm, '\n\n---\n')
            .replace(/^---\s+/gm, '\n---\n\n')
            // Clean up multiple consecutive newlines
            .replace(/\n{3,}/g, '\n\n')
            // Trim whitespace
            .trim();
    }

    // Markdown to HTML with proper lists, headings, and paragraphs
    markdownToHtml(markdown) {
        const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const inline = (s) => s
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
        let html = [];
        let inCode = false, codeLines = [];
        let listStack = []; // e.g., ['ul','ul'] depth 2
        let paraBuf = [];

        const closeParagraph = () => {
            if (paraBuf.length) {
                html.push('<p>' + inline(paraBuf.join(' ')) + '</p>');
                paraBuf = [];
            }
        };
        const closeLists = (toDepth = 0) => {
            while (listStack.length > toDepth) {
                const type = listStack.pop();
                html.push(`</${type}>`);
            }
        };
        const ensureList = (type, depth) => {
            // Close if changing type at same depth
            while (listStack.length > depth) closeLists(depth);
            const current = listStack[depth - 1];
            if (listStack.length < depth) {
                // Open missing levels as current type
                while (listStack.length < depth) {
                    listStack.push(type);
                    html.push(`<${type}>`);
                }
            } else if (current !== type) {
                // Switch type at this depth
                closeLists(depth - 1);
                listStack.push(type);
                html.push(`<${type}>`);
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i];
            const line = raw.replace(/\t/g, '    ');

            // Code block fences
            const fence = line.match(/^```(.*)$/);
            if (fence) {
                if (inCode) {
                    // Close code block
                    html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
                    codeLines = []; inCode = false;
                } else {
                    closeParagraph(); closeLists(0); inCode = true; codeLines = [];
                }
                continue;
            }
            if (inCode) { codeLines.push(raw); continue; }

            // Horizontal rule (--- for paragraph breaks)
            if (/^---+\s*$/.test(line)) {
                closeParagraph();
                closeLists(0);
                html.push('<hr style="margin: 20px 0; border: none; border-top: 1px solid rgba(255, 107, 53, 0.3);">');
                continue;
            }

            // Blank line
            if (/^\s*$/.test(line)) { closeParagraph(); closeLists(0); continue; }

            // Headings H1..H6
            let m = line.match(/^(#{1,6})\s+(.*)$/);
            if (m) {
                closeParagraph(); closeLists(0);
                const level = m[1].length; const text = inline(m[2].trim());
                html.push(`<h${level}>${text}</h${level}>`);
                continue;
            }

            // List items (unordered or ordered)
            m = line.match(/^(\s*)([-*+])\s+(.+)$/);
            let ordered = false;
            if (!m) {
                const mo = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
                if (mo) { m = mo; ordered = true; }
            }
            if (m) {
                closeParagraph();
                const indent = m[1].length;
                const depth = Math.floor(indent / 2) + 1; // 0-1 spaces => depth 1; 2-3 => depth 2
                const type = ordered ? 'ol' : 'ul';
                ensureList(type, depth);
                const content = inline(m[3].trim());
                html.push(`<li>${content}</li>`);
                continue;
            }

            // Paragraph text (accumulate)
            paraBuf.push(line.trim());
        }
        // Close remaining
        closeParagraph();
        closeLists(0);

        return html.join('');
    }

    // Markdown to plain text
    markdownToText(markdown) {
        return markdown
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            .replace(/```[\s\S]*?```/g, function (match) {
                return match.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
            })
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^---+\s*$/gm, '\n') // Convert horizontal rules to line breaks
            .replace(/^\* /gm, '• ')
            .replace(/^\- /gm, '• ')
            .replace(/^\+ /gm, '• ')
            .replace(/^\d+\. /gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\r\n/g, '\n')
            .trim();
    }

    // HTML to plain text
    htmlToText(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const elements = tempDiv.querySelectorAll('*');
        elements.forEach(function (el) {
            switch (el.tagName ? el.tagName.toLowerCase() : '') {
                case 'br':
                    el.replaceWith('\n');
                    break;
                case 'p':
                case 'div':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    el.insertAdjacentText('afterend', '\n\n');
                    break;
                case 'li':
                    el.insertAdjacentText('beforebegin', '• ');
                    el.insertAdjacentText('afterend', '\n');
                    break;
                case 'ul':
                case 'ol':
                    el.insertAdjacentText('afterend', '\n');
                    break;
                default:
                    break;
            }
        });
        let textContent = tempDiv.textContent || tempDiv.innerText || '';
        return textContent
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\r\n/g, '\n')
            .replace(/^\s+|\s+$/gm, '')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
    }

    // Download helpers
    download(format, filename) {
        const timestamp = new Date().toISOString().slice(0, 10);
        const baseFilename = filename + '_' + timestamp;
        if (format === 'markdown') this._downloadFile(this.currentContent.markdown, baseFilename + '.md', 'text/markdown');
        else if (format === 'html') this._downloadFile(this._createStyledHtml(this.currentContent.html), baseFilename + '.html', 'text/html');
        else if (format === 'txt') this._downloadFile(this.currentContent.txt, baseFilename + '.txt', 'text/plain');
        else throw new Error('Unsupported format. Use: markdown, html, or txt');
    }

    async copyToClipboard(format = 'markdown') {
        let content = this.currentContent.markdown;
        if (format === 'html') content = this.currentContent.html;
        else if (format === 'txt') content = this.currentContent.txt;
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            return false;
        }
    }

    createDownloadButtons(baseName = 'generated-content') {
        return `
            <div class="result-buttons">
                <button onclick="downloadManager.copyToClipboard('markdown').then(success => downloadManager._showCopyFeedback(event.target, success))" 
                        class="btn-primary btn-download">
                    Copy Output
                </button>
                <button onclick="downloadManager.download('markdown', '${baseName}')" 
                        class="btn-primary btn-download">
                    MD
                </button>
                <button onclick="downloadManager.download('html', '${baseName}')" 
                        class="btn-primary btn-download">
                    HTML
                </button>
            </div>
        `;
    }

    _downloadFile(content, filename, mimeType) {
        const element = document.createElement('a');
        const file = new Blob([content], { type: mimeType });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    _createStyledHtml(htmlContent) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Content</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 { 
            color: #ff6b35; 
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 { font-size: 2em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.3em; }
        code { 
            background: #f0f0f0; 
            padding: 2px 4px; 
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre { 
            background: #f8f8f8; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto;
            border-left: 4px solid #ff6b35;
            margin: 1em 0;
        }
        pre code {
            background: none;
            padding: 0;
        }
        ul, ol { 
            padding-left: 28px; 
            margin: 1em 0;
        }
        ul ul, ol ul, ul ol, ol ol { padding-left: 24px; }
        li { 
            margin: 6px 0; 
        }
        p {
            margin: 1em 0;
        }
        hr {
            border: none;
            height: 1px;
            background-color: #ddd;
            margin: 1.5em 0;
        }
        a { 
            color: #ff6b35; 
            text-decoration: none; 
        }
        a:hover { 
            text-decoration: underline; 
        }
        strong { font-weight: 600; }
        em { font-style: italic; }
        blockquote {
            border-left: 4px solid #ff6b35;
            margin: 1em 0;
            padding-left: 1em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="content">
        ${htmlContent}
    </div>
</body>
</html>`;
    }

    _showCopyFeedback(button, success) {
        const originalText = button.innerHTML;
        const originalStyle = button.style.background;
        if (success) {
            button.innerHTML = '✅ Copied!';
            button.style.background = 'linear-gradient(135deg, #44ff44, #66ff66)';
        } else {
            button.innerHTML = '❌ Failed';
            button.style.background = 'linear-gradient(135deg, #ff4444, #ff6666)';
        }
        setTimeout(function () {
            button.innerHTML = originalText;
            button.style.background = originalStyle;
        }, 2000);
    }
}

// Create global instance
window.downloadManager = new DownloadManager();