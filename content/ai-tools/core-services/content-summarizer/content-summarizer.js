document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    let uploadedFile = null;
    const textInputGroup = document.getElementById('textInputGroup');
    const fileInputGroup = document.getElementById('fileInputGroup');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // File input handlers
    document.querySelector('input[name="inputMethod"][value="text"]').addEventListener('change', function () {
        textInputGroup.style.display = 'block';
        fileInputGroup.style.display = 'none';
        document.getElementById('textContent').required = true;
    });

    document.querySelector('input[name="inputMethod"][value="file"]').addEventListener('change', function () {
        textInputGroup.style.display = 'none';
        fileInputGroup.style.display = 'block';
        document.getElementById('textContent').required = false;
    });

    // File upload handlers
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255, 107, 53, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadedFile = files[0];
            document.getElementById('fileName').textContent = uploadedFile.name;
            document.getElementById('fileName').style.display = 'block';
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadedFile = e.target.files[0];
            document.getElementById('fileName').textContent = uploadedFile.name;
            document.getElementById('fileName').style.display = 'block';
        }
    });

    // Simple file reader function
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Utility functions
    function validateApiKey(apiKey, provider) {
        if (!apiKey || apiKey.trim() === '') return false;

        // Basic validation patterns
        switch (provider) {
            case 'openai':
                return apiKey.startsWith('sk-') && apiKey.length > 20;
            case 'anthropic':
                return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
            case 'deepseek':
                return apiKey.startsWith('sk-') && apiKey.length > 20;
            default:
                return apiKey.length > 10;
        }
    }

    function showError(element, message) {
        element.innerHTML = `<div style="color: #ff6666; padding: 10px; background: rgba(255,68,68,0.1); border-radius: 4px; border: 1px solid #ff4444;">${message}</div>`;
    }

    function formatMarkdown(text) {
        // Simple markdown formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }

    async function generateSummary(event) {
        // Prevent form submission
        if (event) {
            event.preventDefault();
        }

        // Check if API is configured
        if (!window.apiManager) {
            showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const currentApiKey = window.apiManager.getApiKey();
        if (!currentApiKey) {
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const inputMethod = document.querySelector('input[name="inputMethod"]:checked').value;
        const summaryLength = document.getElementById('summaryLength').value;
        const tone = document.getElementById('tone').value;
        const focusFilter = document.getElementById('focusFilter').value;
        const generateHeadline = document.getElementById('generateHeadline').checked;
        const generateHashtags = document.getElementById('generateHashtags').checked;

        let content;

        if (inputMethod === 'text') {
            content = document.getElementById('textContent').value.trim();
            if (!content) {
                showError(document.getElementById('errorDiv'), 'Please enter content to summarize');
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
        } else {
            if (!uploadedFile) {
                showError(document.getElementById('errorDiv'), 'Please upload a file to summarize');
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Get content
            if (inputMethod === 'file') {
                content = await readFileAsText(uploadedFile);
            }

            const lengthInstructions = {
                'brief': 'Provide a very concise summary in 1-2 sentences.',
                'medium': 'Provide a moderate summary in approximately one paragraph.',
                'detailed': 'Provide a comprehensive summary in 3-5 paragraphs.'
            };

            const toneInstructions = {
                'formal': 'Use formal, professional language.',
                'conversational': 'Use friendly, approachable language.',
                'neutral': 'Use clear, straightforward language.'
            };

            const focusInstructions = {
                'main-takeaway': 'Focus on the primary message and key points.',
                'actionable-insights': 'Emphasize practical applications and actionable information.',
                'key-statistics': 'Highlight important data, numbers, and research findings.',
                'emotional-impact': 'Focus on the human element and emotional aspects of the content.'
            };

            let systemPrompt = `You are a professional content summarizer. ${lengthInstructions[summaryLength]} ${toneInstructions[tone]} ${focusInstructions[focusFilter]}`;

            if (generateHeadline) {
                systemPrompt += ' Also provide a compelling headline suggestion.';
            }
            if (generateHashtags) {
                systemPrompt += ' Also suggest relevant hashtags for social media.';
            }

            systemPrompt += ' Ensure accuracy and avoid adding information not present in the original content.';

            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Please summarize the following content:\n\n${content}`
                }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: summaryLength === 'detailed' ? 1500 : summaryLength === 'medium' ? 800 : 300,
                temperature: 0.3
            });

            currentResult = response;

            // Convert to HTML and display
            const htmlContent = formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7;">${htmlContent}</div>
                </div>
            `;

            // Show result
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

            // Scroll to result
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error generating summary:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            showError(document.getElementById('errorDiv'), error.message || 'Failed to generate summary. Please check your API key and try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        // Check if API is configured
        if (!window.apiManager) {
            showError(document.getElementById('errorDiv'), 'API Manager not available. Please refresh the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const currentApiKey = window.apiManager.getApiKey();
        if (!currentApiKey) {
            showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️) at the top of the page.');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        const inputMethod = document.querySelector('input[name="inputMethod"]:checked').value;
        const summaryLength = document.getElementById('summaryLength').value;
        const tone = document.getElementById('tone').value;
        const focusFilter = document.getElementById('focusFilter').value;

        // Show loading
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            let content;
            if (inputMethod === 'text') {
                content = document.getElementById('textContent').value.trim();
            } else {
                content = await readFileAsText(uploadedFile);
            }

            const lengthInstructions = {
                'brief': 'Provide a very concise summary in 1-2 sentences.',
                'medium': 'Provide a moderate summary in approximately one paragraph.',
                'detailed': 'Provide a comprehensive summary in 3-5 paragraphs.'
            };

            const toneInstructions = {
                'formal': 'Use formal, professional language.',
                'conversational': 'Use friendly, approachable language.',
                'neutral': 'Use clear, straightforward language.'
            };

            const focusInstructions = {
                'main-takeaway': 'Focus on the primary message and key points.',
                'actionable-insights': 'Emphasize practical applications and actionable information.',
                'key-statistics': 'Highlight important data, numbers, and research findings.',
                'emotional-impact': 'Focus on the human element and emotional aspects of the content.'
            };

            const systemPrompt = `You are a professional content summarizer. Create a different variation of the summary with a fresh perspective. ${lengthInstructions[summaryLength]} ${toneInstructions[tone]} ${focusInstructions[focusFilter]} Use different wording and approach while maintaining accuracy.`;

            const messages = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Please create a new variation summary of the following content:\n\n${content}`
                }
            ];

            const response = await apiManager.makeRequest(messages, {
                max_tokens: summaryLength === 'detailed' ? 1500 : summaryLength === 'medium' ? 800 : 300,
                temperature: 0.5
            });

            currentResult = response;

            const htmlContent = formatMarkdown(response);
            document.getElementById('resultContent').innerHTML = `
                <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid rgba(255, 107, 53, 0.3); margin-bottom: 15px;">
                    <div style="line-height: 1.7;">${htmlContent}</div>
                </div>
            `;

            document.getElementById('loadingDiv').style.display = 'none';

        } catch (error) {
            console.error('Error generating variation:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            showError(document.getElementById('errorDiv'), 'Failed to generate variation. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult() {
        copyToClipboard(currentResult).then(success => {
            if (success) {
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                button.style.background = 'linear-gradient(135deg, #44ff44, #66ff66)';
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'linear-gradient(135deg, #ff6b35, #ff8c69)';
                }, 2000);
            }
        });
    }

    function downloadResult(format) {
        if (!currentResult) return;

        const summaryLength = document.getElementById('summaryLength').value;
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `content_summary_${summaryLength}_${timestamp}`;

        let content = currentResult;
        let mimeType = 'text/plain';
        let extension = '.txt';

        if (format === 'markdown') {
            mimeType = 'text/markdown';
            extension = '.md';
        } else if (format === 'html') {
            content = `<!DOCTYPE html>
<html>
<head>
    <title>Content Summary</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
    </style>
</head>
<body>
    ${formatMarkdown(currentResult)}
</body>
</html>`;
            mimeType = 'text/html';
            extension = '.html';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + extension;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('textContent').value = '';
        document.getElementById('summaryLength').value = 'medium';
        document.getElementById('tone').value = 'neutral';
        document.getElementById('focusFilter').value = 'main-takeaway';
        document.getElementById('generateHeadline').checked = false;
        document.getElementById('generateHashtags').checked = false;

        // Reset file upload
        uploadedFile = null;
        document.getElementById('fileName').style.display = 'none';
        document.getElementById('fileName').textContent = '';

        // Reset to text input method
        document.querySelector('input[name="inputMethod"][value="text"]').checked = true;
        textInputGroup.style.display = 'block';
        fileInputGroup.style.display = 'none';
        document.getElementById('textContent').required = true;
        document.getElementById('textContent').focus();
    }

    // Make functions globally available for onclick handlers
    window.generateSummary = generateSummary;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
});