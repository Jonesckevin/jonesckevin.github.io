document.addEventListener('DOMContentLoaded', function () {
    let currentImageUrl = '';
    let currentImageData = null;
    let currentPrompt = '';

    // Global function for creativity slider
    window.updateCreativityDisplay = function (value) {
        document.getElementById('creativityDisplay').textContent = value;
    };

    // Global function to generate image
    window.generateImage = async function () {
        const apiKey = document.getElementById('ai-key').value.trim();
        const aiProvider = document.getElementById('ai-provider').value;
        const prompt = document.getElementById('prompt').value.trim();
        const imageStyle = document.getElementById('imageStyle').value;
        const imageQuality = document.getElementById('imageQuality').value;
        const aspectRatio = document.getElementById('aspectRatio').value;
        const colorPalette = document.getElementById('colorPalette').value;
        const lighting = document.getElementById('lighting').value;
        const negativePrompt = document.getElementById('negativePrompt').value.trim();
        const enhanceDetails = document.getElementById('enhanceDetails').checked;
        const enhanceColors = document.getElementById('enhanceColors').checked;
        const cinematicLook = document.getElementById('cinematicLook').checked;
        const professionalPhoto = document.getElementById('professionalPhoto').checked;
        const creativity = document.getElementById('creativity').value;

        // Validation
        if (!utils.validateApiKey(apiKey, aiProvider)) {
            const providerNames = { openai: 'OpenAI', deepseek: 'DeepSeek', anthropic: 'Anthropic', gemini: 'Gemini', grok: 'Grok (X.AI)' };
            utils.showError(document.getElementById('errorDiv'), `Please enter a valid ${providerNames[aiProvider]} API key`);
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        if (!prompt) {
            utils.showError(document.getElementById('errorDiv'), 'Please enter an image prompt');
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Check if the selected model supports image generation
        const selectedModel = document.getElementById('ai-model').value;
        const modelLower = selectedModel ? selectedModel.toLowerCase() : '';

        // Valid image generation models: DALL-E models, gpt-image-* models, and any model with "image" in the name
        const isImageModel = modelLower.includes('dall-e') ||
            modelLower.includes('dalle') ||
            modelLower.includes('image');

        if (!selectedModel || !isImageModel) {
            utils.showError(
                document.getElementById('errorDiv'),
                'Please select an image generation model (DALL-E 2, DALL-E 3, or gpt-image-*). Standard GPT chat models do not support direct image generation.'
            );
            document.getElementById('errorDiv').style.display = 'block';
            return;
        }

        // Show loading
        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            // Build enhanced prompt with all selections
            let enhancedPrompt = prompt;

            // Add style if selected
            if (imageStyle) {
                const styleDescriptions = {
                    'photorealistic': 'photorealistic style, highly detailed, sharp focus',
                    'digital-art': 'digital art style, modern illustration',
                    'oil-painting': 'oil painting style, classical art, brushstrokes visible',
                    'watercolor': 'watercolor painting style, soft edges, flowing colors',
                    'anime': 'anime style, Japanese animation aesthetic',
                    'comic-book': 'comic book style, graphic novel illustration',
                    '3d-render': '3D rendered, computer graphics, high quality render',
                    'pencil-sketch': 'pencil sketch, hand-drawn, artistic rendering',
                    'abstract': 'abstract art style, conceptual, non-representational',
                    'surreal': 'surreal style, dreamlike, imaginative',
                    'fantasy': 'fantasy illustration, magical, epic',
                    'sci-fi': 'science fiction style, futuristic, advanced technology',
                    'cyberpunk': 'cyberpunk aesthetic, neon lights, dystopian future',
                    'steampunk': 'steampunk style, Victorian era, brass and gears',
                    'minimalist': 'minimalist design, clean, simple composition',
                    'vintage': 'vintage style, retro aesthetic, nostalgic'
                };
                enhancedPrompt += `, ${styleDescriptions[imageStyle]}`;
            }

            // Add color palette
            if (colorPalette) {
                const colorDescriptions = {
                    'vibrant': 'vibrant colors, highly saturated',
                    'pastel': 'pastel colors, soft and light tones',
                    'monochrome': 'monochrome palette, single color scheme',
                    'warm': 'warm color palette, reds oranges yellows',
                    'cool': 'cool color palette, blues greens purples',
                    'earth-tones': 'earth tone colors, natural muted palette',
                    'neon': 'neon colors, bright electric palette',
                    'muted': 'muted colors, desaturated subtle tones'
                };
                enhancedPrompt += `, ${colorDescriptions[colorPalette]}`;
            }

            // Add lighting
            if (lighting) {
                const lightingDescriptions = {
                    'golden-hour': 'golden hour lighting, warm sunset glow',
                    'blue-hour': 'blue hour lighting, cool twilight atmosphere',
                    'dramatic': 'dramatic lighting, strong shadows and highlights',
                    'soft': 'soft diffused lighting, gentle illumination',
                    'studio': 'studio lighting, professional even light',
                    'natural': 'natural daylight, outdoor lighting',
                    'moody': 'moody lighting, dark atmospheric shadows',
                    'backlit': 'backlit subject, rim lighting from behind',
                    'rim-lighting': 'rim lighting, edge-lit subjects'
                };
                enhancedPrompt += `, ${lightingDescriptions[lighting]}`;
            }

            // Add enhancement flags
            const enhancements = [];
            if (enhanceDetails) enhancements.push('highly detailed, ultra sharp, crisp quality');
            if (enhanceColors) enhancements.push('enhanced colors, vibrant and rich');
            if (cinematicLook) enhancements.push('cinematic composition, film-like quality');
            if (professionalPhoto) enhancements.push('professional photography, shallow depth of field, bokeh');

            if (enhancements.length > 0) {
                enhancedPrompt += `, ${enhancements.join(', ')}`;
            }

            // Add quality modifiers
            const qualityModifiers = {
                'standard': '',
                'high': ', high quality, 4k',
                'ultra': ', ultra quality, 8k, masterpiece'
            };
            enhancedPrompt += qualityModifiers[imageQuality];

            // Store the enhanced prompt
            currentPrompt = enhancedPrompt;

            // Get dimensions based on aspect ratio
            const dimensions = getImageDimensions(aspectRatio);

            // Call image generation API
            const imageData = await generateImageWithAI(
                apiKey,
                aiProvider,
                selectedModel,
                enhancedPrompt,
                negativePrompt,
                dimensions,
                creativity
            );

            // Display the result
            displayImageResult(imageData, enhancedPrompt, selectedModel, aspectRatio, imageStyle);

        } catch (error) {
            console.error('Error generating image:', error);
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), error.message || 'Failed to generate image. Please try again.');
            document.getElementById('errorDiv').style.display = 'block';
        }
    };

    function getImageDimensions(aspectRatio) {
        const dimensions = {
            '1:1': { width: 1024, height: 1024 },
            '16:9': { width: 1792, height: 1024 },
            '9:16': { width: 1024, height: 1792 },
            '4:3': { width: 1536, height: 1152 },
            '3:4': { width: 1152, height: 1536 }
        };
        return dimensions[aspectRatio] || dimensions['1:1'];
    }

    async function generateImageWithAI(apiKey, provider, model, prompt, negativePrompt, dimensions, creativity) {
        // For OpenAI DALL-E or gpt-image-* models - use the images API
        const modelLower = model.toLowerCase();
        if (provider === 'openai' && (modelLower.includes('dall') || modelLower.includes('gpt-image'))) {
            return await generateWithDALLE(apiKey, model, prompt, dimensions);
        }

        // For other providers that support image generation via chat completions
        // We'll use the AI to generate a detailed description and then request image generation
        return await generateWithChatModel(apiKey, provider, model, prompt, negativePrompt, dimensions, creativity);
    }

    async function generateWithDALLE(apiKey, model, prompt, dimensions) {
        // DALL-E 3 supports: 1024x1024, 1024x1792, or 1792x1024
        // DALL-E 2 supports: 256x256, 512x512, or 1024x1024
        // gpt-image-* models support: 1024x1024, 1024x1536, 1536x1024, and 'auto'

        const modelLower = model.toLowerCase();
        let size = `${dimensions.width}x${dimensions.height}`;
        const isDallE3 = modelLower.includes('dall-e-3') || modelLower.includes('dalle-3');
        const isDallE2 = modelLower.includes('dall-e-2') || modelLower.includes('dalle-2');
        const isGptImage = modelLower.includes('gpt-image');

        // Map requested size to valid sizes based on model
        if (isDallE3) {
            // For DALL-E 3, map to supported sizes: 1024x1024, 1024x1792, or 1792x1024
            if (dimensions.width === dimensions.height) {
                size = '1024x1024';
            } else if (dimensions.width > dimensions.height) {
                size = '1792x1024';
            } else {
                size = '1024x1792';
            }
        } else if (isDallE2) {
            // For DALL-E 2, only 1024x1024 is available in the standard sizes
            size = '1024x1024';
        } else if (isGptImage) {
            // For gpt-image-* models, supported sizes: 1024x1024, 1024x1536, 1536x1024
            const supportedSizes = ['1024x1024', '1024x1536', '1536x1024'];
            if (!supportedSizes.includes(size)) {
                // Map to closest supported size
                if (dimensions.width === dimensions.height) {
                    size = '1024x1024';
                } else if (dimensions.width > dimensions.height) {
                    // Landscape: use 1536x1024
                    size = '1536x1024';
                } else {
                    // Portrait: use 1024x1536
                    size = '1024x1536';
                }
            }
        }

        const requestBody = {
            model: model,
            prompt: prompt,
            n: 1,
            size: size
        };

        // Add response_format for DALL-E models (gpt-image-* might not support this parameter)
        if (isDallE2 || isDallE3) {
            requestBody.response_format = 'url';
        }

        // Add quality parameter with model-specific values
        if (isDallE3) {
            // DALL-E 3 uses 'hd' or 'standard'
            requestBody.quality = 'hd';
        } else if (isGptImage) {
            // gpt-image-* models use 'low', 'medium', 'high', or 'auto'
            requestBody.quality = 'high';
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate image');
        }

        const data = await response.json();
        return {
            url: data.data[0].url,
            revisedPrompt: data.data[0].revised_prompt || prompt
        };
    }

    async function generateWithChatModel(apiKey, provider, model, prompt, negativePrompt, dimensions, creativity) {
        // For models that support image generation via structured output
        // We'll make a chat completion request asking for image generation

        const systemPrompt = `You are an AI image generation assistant. When asked to generate an image, you will create a detailed description that can be used for image generation. Focus on visual details, composition, colors, lighting, and style.`;

        const userPrompt = `Generate an image based on this prompt: ${prompt}

${negativePrompt ? `Avoid these elements: ${negativePrompt}` : ''}

Dimensions: ${dimensions.width}x${dimensions.height}
Creativity level: ${creativity}%

Please provide a JSON response with the following structure:
{
    "imageUrl": "data:image/png;base64,<base64_encoded_image>",
    "description": "detailed description of the generated image"
}`;

        try {
            // Use the API manager to make the request
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];

            const result = await apiManager.makeRequest(messages, {
                provider: provider,
                apiKey: apiKey,
                model: model,
                temperature: parseFloat(creativity) / 100,
                maxTokens: 4000
            });

            // Try to parse JSON response
            let imageData;
            try {
                imageData = JSON.parse(result);
            } catch (parseError) {
                // If not JSON, assume it's a description and create a placeholder
                throw new Error('The selected model does not support direct image generation. Please use a model specifically designed for image generation (like DALL-E).');
            }

            return {
                url: imageData.imageUrl,
                revisedPrompt: imageData.description || prompt
            };

        } catch (error) {
            console.error('Image generation error:', error);
            throw new Error('This model does not support image generation. Please select an image generation model like DALL-E or similar.');
        }
    }

    function displayImageResult(imageData, prompt, model, aspectRatio, style) {
        const resultDiv = document.getElementById('resultDiv');
        const loadingDiv = document.getElementById('loadingDiv');

        // Store current image data
        currentImageUrl = imageData.url;
        currentImageData = imageData;

        // Check if result structure exists, create if missing
        let imgElement = document.getElementById('generatedImage');
        if (resultDiv && !imgElement) {
            console.log('generatedImage element missing, creating structure...');
            
            // Create the complete result structure
            resultDiv.innerHTML = `
                <h2>Generated Image</h2>
                <div class="result-actions">
                    <button onclick="window.downloadImage(event)" class="action-btn">Download Image</button>
                    <button onclick="window.openImageModal()" class="action-btn">View Full Size</button>
                    <button onclick="window.copyPromptToClipboard(event)" class="action-btn">Copy Prompt</button>
                </div>
                <div class="image-display">
                    <img id="generatedImage" alt="Generated image" />
                </div>
                <div class="image-info">
                    <p><strong>Model:</strong> <span id="imageModel"></span></p>
                    <p><strong>Size:</strong> <span id="imageSize"></span></p>
                    <p><strong>Style:</strong> <span id="imageStyleUsed"></span></p>
                    <p><strong>Prompt:</strong> <span id="imagePromptUsed"></span></p>
                </div>
            `;
            
            imgElement = document.getElementById('generatedImage');
        }

        if (!imgElement) {
            console.error('Cannot create generatedImage element');
            alert('Image generated but cannot display. URL: ' + imageData.url);
            return;
        }

        // Update image
        imgElement.src = imageData.url;
        imgElement.alt = prompt;

        // Update modal image if it exists
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = imageData.url;
        }

        // Update info (with null checks)
        const imageModelEl = document.getElementById('imageModel');
        const imageSizeEl = document.getElementById('imageSize');
        const imageStyleUsedEl = document.getElementById('imageStyleUsed');
        const imagePromptUsedEl = document.getElementById('imagePromptUsed');
        
        if (imageModelEl) imageModelEl.textContent = model;
        if (imageSizeEl) {
            const dimensions = getImageDimensions(aspectRatio);
            imageSizeEl.textContent = `${dimensions.width}x${dimensions.height} (${aspectRatio})`;
        }
        if (imageStyleUsedEl) imageStyleUsedEl.textContent = style || 'Default';
        if (imagePromptUsedEl) imagePromptUsedEl.textContent = imageData.revisedPrompt || prompt;

        // Show result
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'block';

        // Scroll to result
        if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Modal functions
    window.openImageModal = function () {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            // If modal doesn't exist, open image in new tab
            if (currentImageUrl) {
                window.open(currentImageUrl, '_blank');
            }
        }
    };

    window.closeModal = function () {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Download image
    window.downloadImage = async function (event) {
        if (!currentImageUrl) return;

        try {
            // For CORS-protected URLs (like OpenAI), use a different approach
            const a = document.createElement('a');
            a.href = currentImageUrl;
            a.download = `ai-generated-image-${new Date().getTime()}.png`;
            a.target = '_blank'; // Fallback to opening in new tab if download fails
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Show success message
            if (event && event.target) {
                const originalText = event.target.innerHTML;
                event.target.innerHTML = '✓ Downloaded!';
                setTimeout(() => {
                    event.target.innerHTML = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download image directly. The image has been opened in a new tab - please right-click and save from there.');
        }
    };

    // Copy prompt
    window.copyPromptToClipboard = async function (event) {
        const promptElement = document.getElementById('imagePromptUsed');
        const promptText = promptElement ? promptElement.textContent : currentPrompt;
        
        if (!promptText) {
            alert('No prompt to copy');
            return;
        }

        const success = await utils.copyToClipboard(promptText);

        if (success) {
            if (event && event.target) {
                const originalText = event.target.textContent;
                event.target.textContent = '✓ Copied!';
                setTimeout(() => {
                    event.target.textContent = originalText;
                }, 2000);
            }
        } else {
            alert('Failed to copy prompt to clipboard');
        }
    };

    // Regenerate with same settings
    window.regenerateImage = function () {
        generateImage();
    };

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
