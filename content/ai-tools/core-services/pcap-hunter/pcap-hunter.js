document.addEventListener('DOMContentLoaded', () => {
  let currentResult = '';
  let currentExampleIndex = 0;

  // Example queries for cycling
  const exampleQueries = [
    "Show me top 5 conversations by packet count",
    "Find DNS queries to suspicious domains with high frequency",
    "Detect potential port scanning activity",
    "Identify large data transfers that could indicate exfiltration",
    "Look for C2 beaconing patterns with regular intervals",
    "Find all HTTP POST requests with unusual payloads",
    "Show me connections to known malicious IPs"
  ];

  // Initialize managers
  if (!window.apiManager) window.apiManager = new APIManager();
  if (!window.downloadManager) window.downloadManager = new DownloadManager();

  // Get DOM elements
  const form = document.getElementById('pcapHunterForm');
  const queryInput = document.getElementById('huntQuery');
  const optionalTarget = document.getElementById('optionalTarget');
  const showExplanations = document.getElementById('showExplanations');
  const showConfigHints = document.getElementById('showConfigHints');
  const resultDiv = document.getElementById('resultDiv');
  const errorDiv = document.getElementById('errorDiv');
  const loadingDiv = document.getElementById('loadingDiv');
  const resultContent = document.getElementById('resultContent');

  // Tool checkboxes
  const toolCheckboxes = {
    cli: document.getElementById('tool-cli'),
    zeek: document.getElementById('tool-zeek'),
    tcpdump: document.getElementById('tool-tcpdump'),
    'tshark-suite': document.getElementById('tool-tshark-suite'),
    tshark: document.getElementById('tool-tshark'),
    mergecap: document.getElementById('tool-mergecap'),
    capinfos: document.getElementById('tool-capinfos'),
    editcap: document.getElementById('tool-editcap'),
    dumpcap: document.getElementById('tool-dumpcap'),
    snort: document.getElementById('tool-snort'),
    suricata: document.getElementById('tool-suricata')
  };

  // Wireshark Suite toggle handler
  const tsharkSuiteCheckbox = document.getElementById('tool-tshark-suite');
  const tsharkSuboptions = document.getElementById('tshark-suboptions');
  const tsharkSubTools = ['tshark', 'mergecap', 'capinfos', 'editcap', 'dumpcap'];

  if (tsharkSuiteCheckbox) {
    tsharkSuiteCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      if (tsharkSuboptions) {
        if (!isChecked) {
          // Collapse and disable all sub-options when suite is unchecked
          tsharkSuboptions.classList.add('disabled');
          tsharkSuboptions.classList.add('collapsed');
          tsharkSubTools.forEach(tool => {
            if (toolCheckboxes[tool]) {
              toolCheckboxes[tool].checked = false;
              toolCheckboxes[tool].disabled = true;
            }
          });
        } else {
          // Expand and enable sub-options when suite is checked
          tsharkSuboptions.classList.remove('disabled');
          tsharkSuboptions.classList.remove('collapsed');
          tsharkSubTools.forEach(tool => {
            if (toolCheckboxes[tool]) {
              toolCheckboxes[tool].disabled = false;
            }
          });
          // Re-enable TShark by default
          if (toolCheckboxes.tshark) {
            toolCheckboxes.tshark.checked = true;
          }
        }
      }
    });
  }

  // Cycle example queries
  window.cycleExample = () => {
    queryInput.value = exampleQueries[currentExampleIndex];
    currentExampleIndex = (currentExampleIndex + 1) % exampleQueries.length;
    queryInput.focus();
  };

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateCommands();
  });

  async function generateCommands() {
    // Validate inputs
    const query = queryInput.value.trim();
    if (!query) {
      utils.showError(errorDiv, 'Please describe what you\'re hunting for.');
      return;
    }

    // Get selected tools (excluding tshark-suite parent)
    const selectedTools = Object.keys(toolCheckboxes).filter(
      tool => tool !== 'tshark-suite' && toolCheckboxes[tool] && toolCheckboxes[tool].checked && !toolCheckboxes[tool].disabled
    );

    if (selectedTools.length === 0) {
      utils.showError(errorDiv, 'Please select at least one tool.');
      return;
    }

    // Check if CLI tool is selected
    const cliToolSelected = selectedTools.includes('cli');
    
    // Get CLI toggle settings for non-CLI tools
    const cliTools = {};
    selectedTools.forEach(tool => {
      if (tool !== 'cli') {
        const cliCheckbox = document.getElementById(`cli-${tool}`);
        cliTools[tool] = cliCheckbox ? cliCheckbox.checked : false;
      }
    });

    // Get target file
    const targetFile = document.getElementById('targetFile').value.trim();

    // Clear previous results
    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    // Show loading
    utils.showLoading(loadingDiv, 'Generating commands for your hunt...');
    loadingDiv.style.display = 'block';

    try {
      // Build context for each tool
      const toolContexts = selectedTools.map(tool => {
        // For TShark sub-tools, use the tshark-suite file type
        const isTsharkSubtool = ['tshark', 'mergecap', 'capinfos', 'editcap', 'dumpcap'].includes(tool);
        const fileTypeSelect = document.getElementById(isTsharkSubtool ? 'fileType-tshark-suite' : `fileType-${tool}`);
        const fileType = fileTypeSelect ? fileTypeSelect.value : '';
        return { tool, fileType, cliEnabled: cliTools[tool] || false };
      });

      // Build system prompt
      const systemPrompt = buildSystemPrompt(selectedTools, toolContexts, cliToolSelected, targetFile);

      // Build user prompt
      const userPrompt = buildUserPrompt(query, toolContexts, optionalTarget.value.trim(), targetFile, cliToolSelected);

      // Make API request
      const response = await apiManager.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        maxTokens: 4000,
        temperature: 0.3
      });

      // Store result
      currentResult = response;

      // Display result
      loadingDiv.style.display = 'none';
      displayResults(response, selectedTools);
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      loadingDiv.style.display = 'none';
      utils.showError(errorDiv, 'Failed to generate commands: ' + error.message);
      errorDiv.style.display = 'block';
    }
  }

  function buildSystemPrompt(selectedTools, toolContexts, cliToolSelected, targetFile) {
    const showExpl = showExplanations.checked;
    const showConfig = showConfigHints.checked;

    let prompt = `You are an expert network forensics analyst specializing in PCAP analysis. Generate command-line snippets for hunting malicious activity in network captures.
${targetFile ? `\n**TARGET FILE CONTEXT:** User is working with "${targetFile}". Use this filename to infer context (e.g., alerts.log suggests IDS alerts, rdp.log suggests RDP traffic, http.pcap suggests HTTP capture).` : ''}

**CRITICAL INSTRUCTIONS:**

1. For each selected tool, provide EXACTLY 3 commands with increasing complexity:
   - **Basic**: Simple, beginner-friendly command
   - **Intermediate**: Adds filtering or output formatting
   - **Advanced**: Complex analysis with multiple filters or post-processing

2. Format each tool section based on tool type:
   - **For main tools** (CLI, Zeek, TCPDump, Snort, Suricata): Use \`## [Tool Name]\`
   - **For Wireshark Suite sub-tools** (tshark, mergecap, capinfos, editcap, dumpcap): Use \`### [Tool Name]\` (as subcategories of Wireshark)

   \`\`\`markdown
   ## [Tool Name]  <!-- or ### for Wireshark sub-tools -->
   
   ### Basic
   ${showExpl ? `Brief explanation of what this command does.

**Command Breakdown:**
- \`flag\`: What it does
- \`filter/expression\`: Detailed explanation of complex parts (e.g., BPF filters, display filters)
` : ''}
   \`\`\`bash
   [command]
   \`\`\`
   
   ### Intermediate
   ${showExpl ? `Brief explanation.

**Command Breakdown:**
- Break down each significant flag and filter
- Explain complex expressions in detail (e.g., tcp[12]&0xf0 extracts TCP header length)
` : ''}
   \`\`\`bash
   [command]
   \`\`\`
   
   ### Advanced
   ${showExpl ? `Brief explanation.

**Command Breakdown:**
- Detailed explanation of all components
- For BPF filters like (tcp[((tcp[12]&0xf0)>>2)]), explain: tcp[12]&0xf0 extracts data offset, >>2 converts to bytes
- Break down piped commands and their purpose
` : ''}
   \`\`\`bash
   [command]
   \`\`\`
   ${showConfig ? `
**⚙️ Configuration Hints:**

Provide detailed multi-step configuration instructions with exact file paths. Example format:
1. Edit config file: \`sudo nano /etc/tool/config.yaml\`
2. Add/modify specific settings with exact syntax
3. Restart service: \`sudo systemctl restart tool\`
` : ''}
   \`\`\`

3. Use REAL, WORKING commands that are specific to the user's query.
4. Include proper file paths and realistic filters.
5. Commands should be copy-paste ready.
6. Use the file types specified for each tool.

**Selected Tools:** ${selectedTools.join(', ')}

**Tool-Specific Guidelines:**
${toolContexts.map(({ tool, fileType, cliEnabled }) => {
  let guideline = '';
  switch(tool) {
    case 'cli':
      guideline = `- **CLI Tools**: Use text manipulation commands for ${fileType}. Focus on: cat (concatenate/read), awk (field processing), grep (pattern matching), sort (ordering), uniq (deduplication), sed (stream editing), cut (column extraction), wc (counting), head/tail (sampling). Example: \`cat *.log | awk '{print $5}' | sort | uniq -c | sort -rn\` to find top values in field 5.`;
      return guideline;
    case 'zeek':
      guideline = `- **Zeek/Bro**: Use zeek-cut, awk, or grep on ${fileType}. Consider conn, dns, http, ssl logs.`;
      if (cliEnabled) {
        guideline += `\n  **CLI Alternative**: Provide commands using \`cat ${fileType} | awk\`, \`grep\`, \`sort\`, \`uniq -c\` for parsing TSV log format.`;
      }
      if (showConfig) {
        guideline += `\n  Config: Edit /usr/share/zeek/site/local.zeek, add protocol analyzers (@load policy/...), enable file extraction, set log rotation, then run 'sudo zeekctl deploy'`;
      }
      return guideline;
    case 'tcpdump':
      guideline = `- **TCPDump**: Read from ${fileType} with -r flag. Use BPF filters for precision. When explaining BPF filters, break down byte offsets (e.g., tcp[12] = TCP header offset byte, &0xf0 = mask for data offset field, >>2 = convert to bytes).`;
      if (cliEnabled) {
        guideline += `\n  **CLI Alternative**: Use \`tcpdump -r ${fileType} -n -tttt | awk/grep/sed\` to extract and parse text output.`;
      }
      if (showConfig) {
        guideline += `\n  Config: Grant capabilities with 'sudo setcap cap_net_raw,cap_net_admin=eip /usr/bin/tcpdump', increase buffer (-B 4096) for high traffic`;
      }
      return guideline;
    case 'tshark':
      guideline = `- **TShark**: Read from ${fileType} with -r flag. Use display filters (-Y) and statistics. Explain display filter syntax when used.`;
      if (cliEnabled) {
        guideline += `\n  **CLI Alternative**: Use \`tshark -r ${fileType} -T fields -e [field] | awk/grep/sort\` for text processing.`;
      }
      if (showConfig) {
        guideline += `\n  Config: Edit ~/.config/wireshark/preferences, enable TCP stream reassembly, HTTP decompression, customize column formats`;
      }
      return guideline;
    case 'mergecap':
      guideline = `- **mergecap**: Merge multiple ${fileType} files into one. Use -w for output, -a for append mode. Example: mergecap -w output.pcap file1.pcap file2.pcap`;
      return guideline;
    case 'capinfos':
      guideline = `- **capinfos**: Display capture file information for ${fileType}. Shows statistics like packet count, file size, capture duration. Use -T for different output formats (text, table, xml).`;
      return guideline;
    case 'editcap':
      guideline = `- **editcap**: Edit and/or translate ${fileType} files. Can split, filter by time range, remove duplicates. Use -A/-B for time ranges, -d for duplicates, -F for format conversion.`;
      return guideline;
    case 'dumpcap':
      guideline = `- **dumpcap**: Capture network traffic to ${fileType}. Similar to tcpdump but with Wireshark's features. Use -i for interface, -w for output file, -b for ringbuffer.`;
      return guideline;
    case 'snort':
      guideline = `- **Snort**: ${fileType.includes('pcap') ? 'Process pcap with -r flag' : fileType.includes('alert') ? 'Read alert logs with barnyard2 or u2spewfoo' : 'Parse log file with grep/awk'}. For log analysis, use: grep, awk, tail -f, or barnyard2 for unified2 format. Reference /etc/snort/snort.conf for rules.`;
      if (cliEnabled) {
        guideline += `\n  **CLI Alternative**: Parse Snort logs with \`cat ${fileType} | grep -E "Priority: [1-2]" | awk '{print $1, $2, $7}' | sort | uniq -c\` for alert analysis.`;
      }
      if (showConfig) {
        guideline += `\n  Config: Edit /etc/snort/snort.conf, set HOME_NET variable, configure output plugins (alert_fast, unified2), include rule sets, add custom rules to /etc/snort/rules/local.rules, test with 'snort -T -c /etc/snort/snort.conf'`;
      }
      return guideline;
    case 'suricata':
      guideline = `- **Suricata**: ${fileType.includes('pcap') ? 'Process pcap with -r flag' : fileType.includes('eve.json') ? 'Parse EVE JSON logs with jq for structured querying' : fileType.includes('fast.log') ? 'Parse fast.log alerts with grep/awk' : 'Analyze statistics with grep/awk'}. For eve.json, use jq for filtering. For fast.log, use grep patterns. Reference /etc/suricata/suricata.yaml for config.`;
      if (cliEnabled) {
        guideline += `\n  **CLI Alternative**: For eve.json use \`cat ${fileType} | jq -c 'select(.event_type=="alert") | {timestamp, src_ip, dest_ip, alert.signature}'\`. For fast.log use \`grep -E "\\[Priority: [1-2]\\]" ${fileType} | awk '{print $1, $2, $7}' | sort | uniq -c | sort -rn\`.`;
      }
      if (showConfig) {
        guideline += `\n  Config: Edit /etc/suricata/suricata.yaml, set HOME_NET in vars, enable EVE JSON logging with alert/http/dns/tls types, configure outputs under 'outputs:', run 'sudo suricata-update' for rules, test with 'sudo suricata -T -c /etc/suricata/suricata.yaml'`;
      }
      return guideline;
    default:
      return '';
  }
}).join('\n')}`;

    return prompt;
  }

  function buildUserPrompt(query, toolContexts, target, targetFile, cliToolSelected) {
    let prompt = `Generate commands to: ${query}`;
    
    if (targetFile) {
      prompt += `\n\n**Target File:** ${targetFile} (use this filename in commands where applicable)`;
    }
    
    if (target) {
      prompt += `\n\n**Specific Target:** ${target}`;
    }

    prompt += `\n\n**File Types:**\n${toolContexts.map(({ tool, fileType, cliEnabled }) => {
      if (tool === 'cli') {
        return `- ${tool}: ${fileType} (pure CLI text manipulation)`;
      }
      let line = `- ${tool}: ${fileType}`;
      if (cliEnabled && !cliToolSelected) {
        line += ` (include CLI alternative)`;
      }
      return line;
    }).join('\n')}`;

    prompt += `\n\nProvide 3 commands (Basic/Intermediate/Advanced) for each tool.`;

    return prompt;
  }

  function displayResults(markdown, selectedTools) {
    // Parse markdown and enhance with individual copy buttons
    const enhanced = enhanceMarkdownWithCopyButtons(markdown);
    resultContent.innerHTML = enhanced;
    
    // Apply syntax highlighting if Prism is available
    if (window.Prism) {
      Prism.highlightAllUnder(resultContent);
    }
  }

  function enhanceMarkdownWithCopyButtons(markdown) {
    // Convert markdown to HTML
    let html = utils.formatMarkdown(markdown);
    
    // Add individual copy buttons to each code block
    html = html.replace(/<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g, 
      (match, code) => {
        const commandText = code.replace(/<[^>]*>/g, '').trim();
        const escapedCommand = commandText.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        return `
          <div class="command-block">
            <pre><code class="language-bash">${code}</code></pre>
            <button class="copy-command-btn" onclick="copyCommand(event, '${escapedCommand}')" title="Copy command">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <path d="M3 10V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>
        `;
      }
    );

    return html;
  }

  // Copy individual command
  window.copyCommand = async (event, command) => {
    const btn = event.currentTarget;
    const decodedCommand = command.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
    
    const success = await utils.copyToClipboard(decodedCommand);
    if (success) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6 11L13 4" stroke="#5cb85c" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
      btn.style.background = 'rgba(92, 184, 92, 0.2)';
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
      }, 2000);
    }
  };

  // Copy all results
  window.copyAllResults = async (event) => {
    if (!currentResult) return;
    const success = await utils.copyToClipboard(currentResult);
    if (success && event?.target) {
      const btn = event.target.closest('.copy-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✅ Copied All!';
      btn.style.background = 'linear-gradient(135deg, #28a745, #34ce57)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 2000);
    }
  };

  // Download result
  window.downloadResult = (format) => {
    if (!currentResult) return;
    downloadManager.setContent(currentResult, 'markdown');
    downloadManager.download(format, 'pcap-hunt-commands');
  };

  // Flag Reference Modal Functions
  let flagReferenceData = null;

  // Load flag reference data
  async function loadFlagReferenceData() {
    if (flagReferenceData) return flagReferenceData;
    
    try {
      console.log('Fetching flag reference data from /shared/data/flag-reference.json');
      const response = await fetch('/shared/data/flag-reference.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      flagReferenceData = await response.json();
      console.log('Flag reference data loaded successfully:', Object.keys(flagReferenceData));
      return flagReferenceData;
    } catch (error) {
      console.error('Failed to load flag reference data:', error);
      alert(`Failed to load flag reference: ${error.message}`);
      return null;
    }
  }

  window.openFlagModal = async (tool) => {
    console.log('Opening flag modal for tool:', tool);
    
    const modal = document.getElementById('flagModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalDocLink = document.getElementById('modalDocLink');

    // Verify elements exist
    if (!modal || !modalTitle || !modalBody || !modalDocLink) {
      console.error('Modal elements not found:', { modal, modalTitle, modalBody, modalDocLink });
      alert('Error: Modal elements not found. Please refresh the page.');
      return;
    }

    // Show modal with loading state (match pace-report-writer pattern)
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = `${tool.charAt(0).toUpperCase() + tool.slice(1)} Flag Reference`;
    modalBody.innerHTML = '<p class="loading-text">Loading flag reference...</p>';

    // Load data
    const data = await loadFlagReferenceData();
    
    if (!data) {
      console.error('Failed to load flag reference data');
      modalBody.innerHTML = '<p class="error-text">Failed to load flag reference data. Please check the console for details.</p>';
      return;
    }
    
    if (!data[tool]) {
      console.error(`No flag data found for tool: ${tool}`);
      modalBody.innerHTML = `<p class="error-text">No flag reference data available for ${tool}.</p>`;
      return;
    }

    const toolData = data[tool];
    console.log('Loaded flag data for tool:', tool, toolData);
    
    // Update documentation link
    modalDocLink.href = toolData.docUrl;
    
    // Build flag table
    let tableHTML = `
      <div class="flag-reference-table">
        <table>
          <thead>
            <tr>
              <th>Flag</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    toolData.commonFlags.forEach(flag => {
      tableHTML += `
        <tr>
          <td><code>${flag.flag}</code></td>
          <td>${flag.description}</td>
        </tr>
      `;
    });
    
    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
    
    modalBody.innerHTML = tableHTML;
  };

  window.closeFlagModal = (event) => {
    const modal = document.getElementById('flagModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      console.log('Modal closed');
    } else {
      console.error('Modal element not found when trying to close');
    }
  };

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFlagModal({ target: { classList: { contains: () => true } } });
    }
  });
});
