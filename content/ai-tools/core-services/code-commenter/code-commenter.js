document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('commenterForm').addEventListener('submit', generateComments);
    document.getElementById('copyBtn')?.addEventListener('click', () => copyToClipboard());
    document.getElementById('downloadBtn')?.addEventListener('click', downloadResult);
    document.getElementById('regenerateBtn')?.addEventListener('click', generateComments);

    function showError(msg) {
        document.getElementById('errorDiv').innerHTML = `<div style="color: #ff6666; padding: 10px; background: rgba(255,68,68,0.1); border-radius: 4px;">${msg}</div>`;
        document.getElementById('errorDiv').style.display = 'block';
    }

    async function generateComments(event) {
        if (event) event.preventDefault();
        if (!window.apiManager?.getApiKey()) {
            showError('Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const language = document.getElementById('language').value;
        const code = document.getElementById('code').value.trim();
        const commentStyle = document.getElementById('commentStyle').value;

        if (!code) { showError('Please enter a code snippet.'); return; }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            let systemPrompt = `You are an expert programmer. Your task is to add comments to the following ${language} code snippet.
The user wants the comments in a "${commentStyle}" style.
- If "line-by-line", add comments explaining each significant line or block of code.
- If "block/docstring", add a detailed comment block at the beginning of the code, explaining its purpose, parameters, and return value.

Do not change the original code. Only add comments.
Return only the commented code.
`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: code }
            ];

            const response = await apiManager.makeRequest(messages, { max_tokens: 1500, temperature: 0.5 });
            currentResult = response;
            displayResults(response, language);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            showError(`Failed to generate comments: ${error.message}`);
        }
    }

    function displayResults(commentedCode, language) {
        const codeElement = document.getElementById('resultContent');
        codeElement.textContent = commentedCode;
        codeElement.className = `language-${language}`;
        // Re-run Prism syntax highlighting
        if (window.Prism) {
            Prism.highlightElement(codeElement);
        }
    }

    function copyToClipboard() {
        if (currentResult) {
            navigator.clipboard.writeText(currentResult).then(() => {
                alert('Copied to clipboard!');
            }, () => {
                alert('Failed to copy.');
            });
        }
    }

    function downloadResult() {
        if (currentResult) {
            const language = document.getElementById('language').value;
            const extension = {
                javascript: 'js',
                python: 'py',
                java: 'java',
                csharp: 'cs',
                go: 'go',
                rust: 'rs',
                typescript: 'ts',
                php: 'php',
                ruby: 'rb',
                swift: 'swift'
            }[language] || 'txt';
            const filename = 'commented-code';
            downloadManager.setContent(currentResult, 'markdown');
            downloadManager.download('markdown', filename);
        }
    }
});
