// Audio & Video Transcriber Script
document.addEventListener('DOMContentLoaded', function () {
    console.log('Audio transcriber script loaded');

    let currentResult = '';
    let currentSegments = [];
    let uploadedFile = null;
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    // Supported file extensions
    const SUPPORTED_FORMATS = ['.mp3', '.mp4', '.wav', '.m4a', '.webm', '.ogg', '.flac', '.mpeg', '.mpga'];
    const MAX_FILE_SIZE_MB = 25; // OpenAI Whisper limit is 25MB

    // Initialize file upload handlers
    function initFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        if (!uploadArea || !fileInput) {
            console.error('File upload elements not found');
            return;
        }

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ff6b35';
            uploadArea.style.background = 'rgba(255, 107, 53, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    // Check provider support on load and when provider changes
    function checkProviderSupport() {
        const providerWarning = document.getElementById('providerWarning');
        const provider = apiManager?.getProvider() || 'openai';
        const isSupported = provider === 'openai' || provider === 'mistral' || provider === 'groq';
        
        if (providerWarning) {
            providerWarning.style.display = isSupported ? 'none' : 'block';
        }
        
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = !isSupported;
            submitBtn.style.opacity = isSupported ? '1' : '0.5';
        }

        return isSupported;
    }

    // Initialize on load
    initFileUpload();
    setTimeout(checkProviderSupport, 100);

    // Listen for provider changes
    document.addEventListener('apiManagerReady', checkProviderSupport);
    
    // Also listen for storage changes (provider switch)
    window.addEventListener('storage', (e) => {
        if (e.key === 'ai-provider') {
            checkProviderSupport();
        }
    });

    // Periodically check (for same-tab changes)
    setInterval(checkProviderSupport, 2000);

    function handleFileSelect(file) {
        const fileName = file.name.toLowerCase();
        const ext = '.' + fileName.split('.').pop();

        // Show loading state
        const uploadArea = document.getElementById('uploadArea');
        const fileNameDiv = document.getElementById('fileName');
        
        if (uploadArea) {
            uploadArea.classList.add('loading');
        }
        
        if (fileNameDiv) {
            fileNameDiv.innerHTML = `
                <div class="file-name-loading">
                    <div class="spinner-sm"></div>
                    <span>Loading file...</span>
                </div>
            `;
            fileNameDiv.style.display = 'block';
        }

        // Simulate brief loading for UX (file validation happens quickly)
        setTimeout(() => {
            // Validate format
            if (!SUPPORTED_FORMATS.includes(ext)) {
                if (uploadArea) uploadArea.classList.remove('loading');
                if (fileNameDiv) fileNameDiv.style.display = 'none';
                showError(`Unsupported file format: ${ext}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
                return;
            }

            // Validate size
            const sizeCheck = utils.validateFileSize(file, MAX_FILE_SIZE_MB);
            if (!sizeCheck.valid) {
                if (uploadArea) uploadArea.classList.remove('loading');
                if (fileNameDiv) fileNameDiv.style.display = 'none';
                showError(`File too large: ${sizeCheck.sizeFormatted}. Maximum size: ${sizeCheck.limitFormatted}`);
                return;
            }

            uploadedFile = file;
            
            // Update UI with success state
            if (uploadArea) {
                uploadArea.classList.remove('loading');
                uploadArea.classList.add('file-loaded');
            }
            
            if (fileNameDiv) {
                const fileIcon = getFileIcon(ext);
                fileNameDiv.innerHTML = `
                    <div class="file-info-success">
                        <span class="file-icon">${fileIcon}</span>
                        <div class="file-details">
                            <div class="file-name-text">${file.name}</div>
                            <div class="file-size-text">${sizeCheck.sizeFormatted}</div>
                        </div>
                        <span class="success-check">✅</span>
                    </div>
                `;
                fileNameDiv.style.display = 'block';
            }

            // Hide any previous errors
            hideError();
        }, 400); // Brief delay for loading feedback
    }

    function getFileIcon(ext) {
        const videoFormats = ['.mp4', '.webm', '.mpeg'];
        if (videoFormats.includes(ext)) return '🎥';
        return '🎵';
    }

    function showError(message) {
        const errorDiv = document.getElementById('errorDiv');
        if (errorDiv) {
            errorDiv.innerHTML = `<div class="error-message">${message}</div>`;
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function hideError() {
        const errorDiv = document.getElementById('errorDiv');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    function ensureProgressDiv() {
        let progressDiv = document.getElementById('progressDiv');
        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'progressDiv';
            progressDiv.style.display = 'none';
            progressDiv.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div id="progressText">Uploading file...</div>
                    <progress id="progressBar" value="0" max="100" style="width: 100%; height: 20px; margin-top: 15px;"></progress>
                    <div id="progressPercent" style="margin-top: 8px; font-size: 14px; opacity: 0.8;">0%</div>
                </div>
            `;
            const errorDiv = document.getElementById('errorDiv');
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.parentNode.insertBefore(progressDiv, errorDiv.nextSibling);
            }
        }
        return progressDiv;
    }

    function showProgress(show = true) {
        const progressDiv = ensureProgressDiv();
        
        if (progressDiv) {
            progressDiv.style.display = show ? 'block' : 'none';
            
            if (show) {
                progressDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function updateProgress(percent, text = null) {
        ensureProgressDiv(); // Make sure it exists
        
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) progressBar.value = percent;
        if (progressPercent) progressPercent.textContent = `${percent}%`;
        if (progressText && text) progressText.textContent = text;
    }

    // Main transcription function
    window.transcribeAudio = async function() {
        // Check provider support
        if (!checkProviderSupport()) {
            showError('Transcription requires OpenAI (Whisper) or Mistral (Voxtral). Please switch your provider in the header settings.');
            return;
        }

        // Validate file
        if (!uploadedFile) {
            showError('Please select an audio or video file to transcribe.');
            return;
        }

        const language = document.getElementById('language')?.value || 'en';
        const includeTimestamps = document.getElementById('includeTimestamps')?.checked || false;

        const provider = apiManager.getProvider();
        const apiKey = apiManager.getApiKey();
        const model = apiManager.getModel(provider);

        if (!apiKey) {
            showError('API key is required. Please configure your API key in the header settings.');
            return;
        }

        // Show progress
        hideError();
        showProgress(true);
        updateProgress(0, 'Uploading file...');

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const result = await apiManager.transcribeAudio(uploadedFile, {
                provider,
                apiKey,
                model, // Uses model selected in header via apiManager.getModel()
                language,
                timestamps: includeTimestamps,
                onProgress: (percent) => {
                    if (percent < 100) {
                        updateProgress(percent, 'Uploading file...');
                    } else {
                        updateProgress(100, 'Processing transcription...');
                    }
                }
            });

            // Store result
            currentSegments = result.segments || [];
            
            // Format output
            if (includeTimestamps && currentSegments.length > 0) {
                currentResult = formatWithTimestamps(currentSegments);
            } else {
                currentResult = result.text || '';
            }

            // Display result
            displayResult(result);

        } catch (error) {
            console.error('Transcription error:', error);
            showError(error.message || 'Transcription failed. Please try again.');
        } finally {
            showProgress(false);
            if (submitBtn) submitBtn.disabled = false;
        }
    };

    function formatWithTimestamps(segments) {
        return segments.map(seg => {
            const timestamp = utils.formatTimestamp(seg.start || 0);
            return `${timestamp} ${seg.text.trim()}`;
        }).join('\n\n');
    }

    function displayResult(result) {
        const resultDiv = document.getElementById('resultDiv');
        const resultContent = document.getElementById('resultContent');
        const resultMeta = document.getElementById('resultMeta');

        if (!resultDiv || !resultContent) return;

        // Show metadata
        if (resultMeta) {
            const metaParts = [];
            if (result.language) metaParts.push(`Language: ${result.language.toUpperCase()}`);
            if (result.duration) metaParts.push(`Duration: ${formatDuration(result.duration)}`);
            if (currentSegments.length > 0) metaParts.push(`Segments: ${currentSegments.length}`);
            resultMeta.textContent = metaParts.join(' • ');
        }

        // Display transcript
        const htmlContent = currentResult
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>')
            .replace(/\[(\d{2}:\d{2}:\d{2})\]/g, '<span style="color: #ff6b35; font-weight: 600;">[$1]</span>');

        resultContent.innerHTML = `<div class="result-display" style="white-space: pre-wrap; font-family: inherit;">${htmlContent}</div>`;
        resultDiv.style.display = 'block';

        setTimeout(() => {
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
            return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    // Copy result
    window.copyResult = async function(event) {
        if (!currentResult) return;

        const button = event?.target;
        const success = await utils.copyToClipboard(currentResult);

        if (success && button) {
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Copied!';
            button.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }
    };

    // Download result
    window.downloadResult = function(format) {
        if (!currentResult) return;

        const timestamp = utils.getCurrentTimestamp ? utils.getCurrentTimestamp() : new Date().toISOString().slice(0, 10);
        const baseFilename = `transcript-${timestamp}`;

        if (format === 'srt' && currentSegments.length > 0) {
            // Generate SRT format
            const srtContent = generateSRT(currentSegments);
            downloadFile(srtContent, `${baseFilename}.srt`, 'text/srt');
        } else {
            // Plain text
            downloadFile(currentResult, `${baseFilename}.txt`, 'text/plain');
        }
    };

    function generateSRT(segments) {
        return segments.map((seg, index) => {
            const startTime = formatSRTTime(seg.start || 0);
            const endTime = formatSRTTime(seg.end || seg.start + 5);
            return `${index + 1}\n${startTime} --> ${endTime}\n${seg.text.trim()}\n`;
        }).join('\n');
    }

    function formatSRTTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
