document.addEventListener('DOMContentLoaded', function () {
    let currentResult = '';
    if (!window.apiManager) window.apiManager = new APIManager();
    if (!window.downloadManager) window.downloadManager = new DownloadManager();

    document.getElementById('giftForm').addEventListener('submit', generateGiftIdeas);

    // Register standard copy/download actions
    utils.registerToolActions('gift-idea-generator', () => currentResult);

    async function generateGiftIdeas(event) {
        if (event) event.preventDefault();
        if (!window.apiManager?.getApiKey()) {
            utils.showError(document.getElementById('errorDiv'), 'Please set up your API key using the settings menu (⚙️).');
            return;
        }

        const recipient = document.getElementById('recipient').value;
        const occasion = document.getElementById('occasion').value;
        const recipientDetails = document.getElementById('recipientDetails').value.trim();
        const budget = document.getElementById('budget').value;
        const giftType = document.getElementById('giftType').value;
        const unique = document.getElementById('unique').checked;
        const personalized = document.getElementById('personalized').checked;
        const ecoFriendly = document.getElementById('ecoFriendly').checked;
        const lastMinute = document.getElementById('lastMinute').checked;

        if (!recipient) { utils.showError(document.getElementById('errorDiv'), 'Please select a recipient.'); return; }

        document.getElementById('errorDiv').style.display = 'none';
        document.getElementById('resultDiv').style.display = 'none';
        document.getElementById('loadingDiv').style.display = 'block';

        try {
            let systemPrompt = `You are an expert gift consultant with excellent taste and creativity. Suggest 5-7 thoughtful gift ideas for ${recipient} for ${occasion}.

Budget: ${budget}
${recipientDetails ? `Recipient Details: ${recipientDetails}` : ''}
${giftType !== 'any' ? `Preferred Type: ${giftType}` : ''}

Requirements:`;
            if (unique) systemPrompt += '\n- Focus on unique, uncommon gifts';
            if (personalized) systemPrompt += '\n- Include personalization options';
            if (ecoFriendly) systemPrompt += '\n- Prioritize eco-friendly/sustainable options';
            if (lastMinute) systemPrompt += '\n- Include gifts that can be obtained quickly';

            systemPrompt += `\n\nFor each gift provide:
1. Gift name/title
2. Brief description and why it's perfect
3. Approximate price range
4. Where to find it (general guidance)

Be creative, thoughtful, and consider the relationship and occasion. Format as a numbered list with clear sections for each gift.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Suggest gifts for ${recipient} for ${occasion}` }
            ];

            const response = await apiManager.makeRequest(messages, { max_tokens: 1500, temperature: 0.8 });
            currentResult = response;
            displayResults(response, recipient, occasion);

            document.getElementById('loadingDiv').style.display = 'none';
            document.getElementById('resultDiv').style.display = 'block';
            document.getElementById('resultDiv').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            document.getElementById('loadingDiv').style.display = 'none';
            utils.showError(document.getElementById('errorDiv'), `Failed to generate gift ideas: ${error.message}`);
        }
    }

    function displayResults(text, recipient, occasion) {
        let html = `<h3 style="color: #ff6b35; margin-bottom: 20px;">🎁 Gift Ideas for ${recipient} - ${occasion}</h3>`;
        
        // Parse gift ideas
        const gifts = parseGifts(text);
        
        if (gifts.length > 0) {
            gifts.forEach((gift, idx) => {
                // Split description by line breaks and format as list
                const descLines = gift.description.split('\n').filter(line => line.trim());
                
                html += `
                    <div class="gift-card" style="background: rgba(255,107,53,0.05); border-left: 3px solid #ff6b35; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                        <div class="gift-title" style="color: #ff6b35; font-size: 1.2em; font-weight: 600; margin-bottom: 10px;">${idx + 1}. ${formatMarkdown(gift.title)}</div>
                        <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                            ${descLines.map(line => `<li style="margin: 5px 0; color: #e0e0e0;">${formatMarkdown(line)}</li>`).join('')}
                        </ul>
                        ${gift.price ? `<div class="gift-meta" style="margin-top: 10px;"><span class="gift-price" style="background: rgba(255,107,53,0.2); color: #ff6b35; padding: 4px 12px; border-radius: 12px; font-size: 0.9em; font-weight: 600;">${escapeHtml(gift.price)}</span></div>` : ''}
                    </div>
                `;
            });
        } else {
            // Fallback formatting
            html += '<div class="gift-display">' + formatMarkdown(text) + '</div>';
        }
        
        document.getElementById('resultContent').innerHTML = html;
    }

    function parseGifts(text) {
        const gifts = [];
        const lines = text.split('\n');
        let currentGift = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // Check if this is a numbered gift item (not just "1. Here are...")
            const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/);
            
            if (numberMatch) {
                const number = parseInt(numberMatch[1]);
                const content = numberMatch[2].trim();
                
                // Skip intro lines (usually contain words like "Here are", "ideas", etc.)
                if (number === 1 && /\b(here are|following|below are|these are)\b/i.test(content)) {
                    continue;
                }
                
                // Save previous gift if exists
                if (currentGift && currentGift.title) {
                    gifts.push(currentGift);
                }
                
                // Start new gift
                currentGift = {
                    title: content.replace(/^\*\*|\*\*$/g, '').trim(),
                    description: '',
                    price: ''
                };
            } else if (currentGift) {
                // Check if this is an indented bullet point (starts with spaces/tabs then -)
                const isBulletPoint = /^\s+[-•*]\s*/.test(line);
                
                if (isBulletPoint) {
                    // Add as new line in description
                    const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '');
                    
                    // Extract price if present
                    const priceMatch = cleanLine.match(/(?:Price range:|Approximate price:)?\s*\$[\d,]+(?:[-–]\s*\$?[\d,]+)?|\d+[-–]\d+\s*dollars?/i);
                    if (priceMatch && !currentGift.price) {
                        currentGift.price = priceMatch[0].replace(/^(Price range:|Approximate price:)\s*/i, '');
                    }
                    
                    // Add to description with line break
                    if (currentGift.description) currentGift.description += '\n';
                    currentGift.description += cleanLine;
                } else {
                    // Regular continuation line
                    const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '');
                    
                    // Extract price if present
                    const priceMatch = cleanLine.match(/\$[\d,]+(?:[-–]\$?[\d,]+)?|\d+[-–]\d+\s*dollars?/i);
                    if (priceMatch && !currentGift.price) {
                        currentGift.price = priceMatch[0];
                    }
                    
                    // Add to description
                    if (currentGift.description) currentGift.description += ' ';
                    currentGift.description += cleanLine;
                }
            }
        }
        
        // Don't forget the last gift
        if (currentGift && currentGift.title) {
            gifts.push(currentGift);
        }
        
        return gifts;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatMarkdown(text) {
        if (!text) return '';
        
        let html = escapeHtml(text);
        
        // Handle bold (**text**)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italics (*text*)
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        return html;
    }
});
