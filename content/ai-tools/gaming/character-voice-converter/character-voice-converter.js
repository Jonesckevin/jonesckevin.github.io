document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';

    // Use centralized API manager for requests
    async function makeApiCall(apiKey, provider, prompt) {
        console.log('=== CHARACTER VOICE CONVERTER USING API MANAGER ===');
        console.log('Provider:', provider);
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        console.log('Prompt length:', prompt ? prompt.length : 0);

        try {
            // Convert prompt to messages format for API manager
            const messages = [{ role: 'user', content: prompt }];

            // Use the centralized API manager
            return await apiManager.makeRequest(messages, {
                provider: provider,
                apiKey: apiKey,
                maxTokens: 2000,
                temperature: 0.7
            });
        } catch (error) {
            console.error('Character Voice Converter API Manager request failed:', error);
            throw error;
        }
    }

    // Validate API key using shared utils (supports mistral, custom, etc.)
    function validateApiKey(apiKey, provider) {
        if (window.utils && typeof window.utils.validateApiKey === 'function') {
            return window.utils.validateApiKey(apiKey, provider);
        }
        // Fallback minimal check if utils not loaded
        return !!apiKey;
    }

    // Global functions for intensity sliders
    window.updatePrimaryIntensity = function (value) {
        document.getElementById('primaryIntensityDisplay').textContent = value;
    };

    window.updateSubIntensity = function (value) {
        document.getElementById('subIntensityDisplay').textContent = value;
    };

    // Show/hide custom voice descriptions
    document.getElementById('voiceStyle').addEventListener('change', function () {
        const customGroup = document.getElementById('customVoiceGroup');
        if (this.value === 'custom') {
            customGroup.style.display = 'block';
        } else {
            customGroup.style.display = 'none';
        }
    });

    document.getElementById('subVoiceStyle').addEventListener('change', function () {
        const customSubGroup = document.getElementById('customSubVoiceGroup');
        if (this.value === 'custom-sub') {
            customSubGroup.style.display = 'block';
        } else {
            customSubGroup.style.display = 'none';
        }
    });

    function randomizeVoiceStyle() {
        // Randomize primary voice style
        const voiceSelect = document.getElementById('voiceStyle');
        const options = Array.from(voiceSelect.options).filter(option => option.value && option.value !== 'custom');
        const randomOption = options[Math.floor(Math.random() * options.length)];
        voiceSelect.value = randomOption.value;
        document.getElementById('customVoiceGroup').style.display = 'none';

        // Randomize sub voice style (30% chance to have one)
        const subVoiceSelect = document.getElementById('subVoiceStyle');
        const subOptions = Array.from(subVoiceSelect.options).filter(option => option.value && option.value !== 'custom-sub');
        if (Math.random() < 0.3) {
            // 30% chance to add a sub voice
            const randomSubOption = subOptions[Math.floor(Math.random() * subOptions.length)];
            subVoiceSelect.value = randomSubOption.value;
        } else {
            // 70% chance to have no sub voice
            subVoiceSelect.value = '';
        }
        document.getElementById('customSubVoiceGroup').style.display = 'none';

        // Randomize primary intensity (3-9 to avoid extremes)
        const primaryIntensity = Math.floor(Math.random() * 7) + 3;
        document.getElementById('primaryIntensity').value = primaryIntensity;
        updatePrimaryIntensity(primaryIntensity);

        // Randomize sub intensity (1-5 to keep it lower than primary)
        const subIntensity = Math.floor(Math.random() * 5) + 1;
        document.getElementById('subIntensity').value = subIntensity;
        updateSubIntensity(subIntensity);

        // Randomize preserve options
        document.getElementById('preserveMeaning').checked = Math.random() < 0.8; // 80% chance to preserve meaning
        document.getElementById('preserveLength').checked = Math.random() < 0.4; // 40% chance to preserve length
        document.getElementById('addMannerisms').checked = Math.random() < 0.6; // 60% chance to add mannerisms
        document.getElementById('includeDialogueTags').checked = Math.random() < 0.3; // 30% chance for dialogue tags
    }

    async function convertVoice() {
        // Prefer global AI Settings from apiManager; fall back to header inputs if needed
        const aiProvider = (window.apiManager && window.apiManager.getProvider && window.apiManager.getProvider())
            || (document.getElementById('ai-provider')?.value) || 'openai';
        const apiKey = (window.apiManager && window.apiManager.getApiKey && window.apiManager.getApiKey())
            || (document.getElementById('ai-key')?.value?.trim()) || '';
        const originalText = document.getElementById('originalText').value.trim();
        const voiceStyle = document.getElementById('voiceStyle').value;
        const customVoice = document.getElementById('customVoice').value.trim();
        const subVoiceStyle = document.getElementById('subVoiceStyle').value;
        const customSubVoice = document.getElementById('customSubVoice').value.trim();
        const primaryIntensity = document.getElementById('primaryIntensity').value;
        const subIntensity = document.getElementById('subIntensity').value;
        const preserveMeaning = document.getElementById('preserveMeaning').checked;
        const preserveLength = document.getElementById('preserveLength').checked;
        const addMannerisms = document.getElementById('addMannerisms').checked;
        const includeDialogueTags = document.getElementById('includeDialogueTags').checked;

        // Provider/key validation with clear messaging
        if (!aiProvider) {
            document.getElementById('errorDiv').innerHTML = `<div class="error-message">Please select an AI provider in the AI Settings (top right) before converting.</div>`;
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!validateApiKey(apiKey, aiProvider)) {
            let providerLabel = aiProvider;
            try {
                providerLabel = (window.apiManager && window.apiManager.getProviderConfig(aiProvider)?.name) || aiProvider;
            } catch (_) { }

            // For Custom provider, key is optional; if we get here for custom, bypass message
            if (aiProvider === 'custom') {
                // proceed without error
            } else {
                document.getElementById('errorDiv').innerHTML = `<div class="error-message">Please enter a valid ${providerLabel} API key in the AI Settings (top right).</div>`;
                document.getElementById('errorDiv').style.display = 'block';
                return;
            }
        }

        if (!originalText) {
            document.getElementById('errorDiv').innerHTML = '<div class="error-message">Please enter the text you want to convert.</div>';
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!voiceStyle) {
            document.getElementById('errorDiv').innerHTML = '<div class="error-message">Please select a character voice style.</div>';
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (voiceStyle === 'custom' && !customVoice) {
            document.getElementById('errorDiv').innerHTML = '<div class="error-message">Please describe your custom character voice.</div>';
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (subVoiceStyle === 'custom-sub' && !customSubVoice) {
            document.getElementById('errorDiv').innerHTML = '<div class="error-message">Please describe your custom sub voice style.</div>';
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Build character voice description
            let characterDescription = '';
            if (voiceStyle === 'custom') {
                characterDescription = customVoice;
            } else {
                const voiceDescriptions = {
                    'pirate': 'a swashbuckling pirate character with "yarr", "matey", "ahoy", nautical terminology, and rough seafaring language',
                    'medieval': 'a medieval fantasy character using "thee", "thou", "hath", "doth", formal old English, and courtly speech',
                    'shakespeare': 'a Shakespearean character with elaborate Elizabethan English, flowery metaphors, iambic pentameter influences, and dramatic flair',
                    'formal-victorian': 'a proper Victorian character with refined language, formal address, elaborate courtesy, and sophisticated vocabulary',
                    'cowboy': 'a Wild West cowboy with "partner", "howdy", "reckon", frontier expressions, and rugged frontier dialect',
                    'sci-fi-formal': 'a formal sci-fi character with technical terminology, precise language, futuristic concepts, and logical speech patterns',
                    'robot': 'an AI/robot character with logical, systematic speech, technical precision, calculated responses, and mechanical expressions',
                    'child': 'a child character with simple vocabulary, innocent perspective, playful language, and wonder-filled expressions',
                    'elderly-wise': 'an elderly wise character with thoughtful speech, life experience references, measured words, and sage advice',
                    'street-smart': 'a street-smart urban character with casual slang, city expressions, confident attitude, and contemporary language',
                    'academic': 'an academic scholar with verbose intellectual language, complex vocabulary, scholarly references, and pedantic tendencies',
                    'military': 'a military officer with direct commands, authoritative tone, tactical language, and disciplined communication',
                    'detective': 'a film noir detective with cynical observations, mysterious tone, investigative language, and dramatic flair',
                    'valley-girl': 'a valley girl character with "like", "totally", "whatever", upspeak, and trendy expressions',
                    'southern-belle': 'a Southern belle with charming drawl, polite expressions, "darling", "honey", and gracious mannerisms',
                    'surfer': 'a surfer character with "dude", "gnarly", "rad", laid-back expressions, and beach culture slang',
                    'wizard': 'a wise wizard with mystical language, arcane terminology, cryptic wisdom, and magical references',
                    'villain': 'a classic villain with dramatic declarations, menacing tone, grandiose speech, and evil schemes'
                };
                characterDescription = voiceDescriptions[voiceStyle] || 'a unique character voice';
            }

            // Add sub voice if selected
            let subVoiceDescription = '';
            if (subVoiceStyle && subVoiceStyle !== '') {
                if (subVoiceStyle === 'custom-sub') {
                    subVoiceDescription = customSubVoice;
                } else {
                    const voiceDescriptions = {
                        'pirate': 'pirate elements with nautical terms and rough speech',
                        'medieval': 'medieval elements with old English and formal address',
                        'shakespeare': 'Shakespearean elements with dramatic flair and elaborate language',
                        'formal-victorian': 'Victorian elements with refined and proper speech',
                        'cowboy': 'cowboy elements with frontier expressions and rugged dialect',
                        'sci-fi-formal': 'sci-fi elements with technical and precise language',
                        'robot': 'robotic elements with logical and systematic speech',
                        'child': 'childlike elements with innocent and playful language',
                        'elderly-wise': 'wise elder elements with thoughtful and experienced speech',
                        'street-smart': 'street-smart elements with urban slang and casual tone',
                        'academic': 'academic elements with intellectual and verbose language',
                        'military': 'military elements with authoritative and direct speech',
                        'detective': 'detective elements with cynical and mysterious tone',
                        'valley-girl': 'valley girl elements with trendy expressions and upspeak',
                        'southern-belle': 'southern belle elements with charming drawl and polite speech',
                        'surfer': 'surfer elements with laid-back expressions and beach slang',
                        'wizard': 'wizard elements with mystical and cryptic language',
                        'villain': 'villain elements with dramatic and menacing tone'
                    };
                    subVoiceDescription = voiceDescriptions[subVoiceStyle] || '';
                }
            }

            // Build intensity descriptions
            const intensityLevels = ['minimal', 'very light', 'light', 'mild', 'moderate', 'noticeable', 'strong', 'very strong', 'heavy', 'extreme'];
            const primaryIntensityDesc = intensityLevels[primaryIntensity - 1] || 'moderate';
            const subIntensityDesc = intensityLevels[subIntensity - 1] || 'light';

            // Build preserve options
            let preserveInstructions = [];
            if (preserveMeaning) preserveInstructions.push('preserve the original meaning and intent');
            if (preserveLength) preserveInstructions.push('keep similar text length');
            if (addMannerisms) preserveInstructions.push('add character-specific mannerisms and gestures');
            if (includeDialogueTags) preserveInstructions.push('include dialogue tags and speech indicators');

            // Create prompt
            let prompt = `Transform the following text to match the voice and speaking style of ${characterDescription}. Apply a ${primaryIntensityDesc} level of character voice transformation.`;

            if (subVoiceDescription) {
                prompt += ` Additionally, blend in ${subIntensityDesc} elements of ${subVoiceDescription} as a secondary influence.`;
            }

            if (preserveInstructions.length > 0) {
                prompt += ` Please ${preserveInstructions.join(', ')}.`;
            }

            prompt += `\n\nOriginal text: "${originalText}"\n\nTransformed text:`;

            // Make API call using fetch
            const result = await makeApiCall(apiKey, aiProvider, prompt);

            currentResult = result;
            document.getElementById('resultContent').innerHTML = `<div class="result-text">${result.replace(/\n/g, '<br>')}</div>`;
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('errorDiv').innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    async function generateVariation() {
        if (!currentResult) return;

        const originalText = document.getElementById('originalText').value.trim();
        const aiProvider = (window.apiManager && window.apiManager.getProvider && window.apiManager.getProvider())
            || (document.getElementById('ai-provider')?.value) || 'openai';
        const apiKey = (window.apiManager && window.apiManager.getApiKey && window.apiManager.getApiKey())
            || (document.getElementById('ai-key')?.value?.trim()) || '';

        document.getElementById('loadingDiv').style.display = 'block';

        try {
            const prompt = `Create a different variation of this character voice conversion while maintaining the same character style and voice intensity. Keep the same meaning but use different word choices and expressions.\n\nOriginal text: "${originalText}"\n\nPrevious conversion: "${currentResult}"\n\nNew variation:`;

            const result = await makeApiCall(apiKey, aiProvider, prompt);

            currentResult = result;
            document.getElementById('resultContent').innerHTML = `<div class="result-text">${result.replace(/\n/g, '<br>')}</div>`;
            document.getElementById('loadingDiv').style.display = 'none';

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('errorDiv').innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
            document.getElementById('errorDiv').style.display = 'block';
        }
    }

    function copyResult(evt) {
        const btn = evt?.target;
        if (window.utils && typeof window.utils.copyWithFeedback === 'function' && btn) {
            window.utils.copyWithFeedback(currentResult, btn);
            return;
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(currentResult).then(() => {
                if (!btn) return;
                const originalText = btn.textContent;
                const originalBg = btn.style.background;
                btn.textContent = '✓ Copied!';
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBg || '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyTextToClipboard(currentResult, btn);
            });
        } else {
            fallbackCopyTextToClipboard(currentResult, btn);
        }
    }

    function fallbackCopyTextToClipboard(text, btn) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful && btn) {
                const originalText = btn.textContent;
                const originalBg = btn.style.background;
                btn.textContent = '✓ Copied!';
                btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBg || '';
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function downloadResult(format, evt) {
        const voiceStyle = document.getElementById('voiceStyle').value || 'voice-conversion';
        const base = `voice-conversion_${voiceStyle}_${new Date().toISOString().slice(0, 10)}`;

        if (window.downloadManager) {
            window.downloadManager.setContent(currentResult, 'markdown');
            if (format === 'markdown') window.downloadManager.download('markdown', base);
            else if (format === 'html') window.downloadManager.download('html', base);
        } else {
            // Fallback simple download as text
            const blob = new Blob([currentResult], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${base}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // Button feedback
        const btn = evt?.target;
        if (btn) {
            const originalText = btn.innerHTML;
            const originalBg = btn.style.background;
            btn.innerHTML = '⬇️ Saved!';
            btn.style.background = 'linear-gradient(135deg, #17a2b8, #20c997)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = originalBg || '';
            }, 1500);
        }
    }

    function resetForm() {
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('originalText').value = '';
        document.getElementById('customVoice').value = '';
        document.getElementById('customSubVoice').value = '';
        document.getElementById('voiceStyle').value = '';
        document.getElementById('subVoiceStyle').value = '';
        document.getElementById('primaryIntensity').value = '7';
        document.getElementById('subIntensity').value = '3';
        document.getElementById('customVoiceGroup').style.display = 'none';
        document.getElementById('customSubVoiceGroup').style.display = 'none';
        updatePrimaryIntensity('7');
        updateSubIntensity('3');
    }

    // Make functions globally available for onclick handlers
    window.convertVoice = convertVoice;
    window.generateVariation = generateVariation;
    window.copyResult = copyResult;
    window.downloadResult = downloadResult;
    window.resetForm = resetForm;
    window.randomizeVoiceStyle = randomizeVoiceStyle;
});