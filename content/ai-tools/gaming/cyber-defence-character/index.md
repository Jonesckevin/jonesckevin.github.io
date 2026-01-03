---
title: "Cyber Defence Character Sheet"
subtitle: "D&D-Style Character Sheets for Cybersecurity Professionals"
description: "Create D&D-inspired character sheets for cybersecurity roles with stats, skills, and AI-generated backstories. Perfect for team building, training exercises, and gamifying cyber defence education."
keywords: ["cybersecurity character sheet", "cyber defence RPG", "security training game", "D&D cybersecurity", "infosec character generator", "SOC analyst RPG", "cyber defence gamification", "security team building"]
date: 2025-12-04
lastmod: 2025-12-14
draft: false
tags: ["Gaming", "Cybersecurity", "Character Generator", "RPG", "Training", "Team Building", "AI", "Tools"]
categories: ["AI Tools", "Gaming"]
type: ai-tools
seo_title: "Free Cyber Defence Character Sheet Generator - D&D for InfoSec"
canonical: "/ai-tools/gaming/cyber-character-sheet/"
featured_image: "/images/featured/aitools/cyber-character-sheet.png"
schema_type: "SoftwareApplication"
sitemap_priority: 0.7
sitemap_changefreq: "monthly"
social_media:
  og_title: "Cyber Defence Character Sheet Generator - D&D for Cybersecurity"
  og_description: "Create D&D-style character sheets for cybersecurity professionals with stats, skills, and AI-generated backstories."
  og_image: "/images/featured/aitools/cyber-character-sheet.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "Cyber Defence Character Sheet Generator"
  twitter_description: "Gamify cybersecurity with D&D-inspired character sheets for security professionals."
  twitter_image: "/images/featured/aitools/cyber-character-sheet.png"

# AI Tool Result Section (used by layouts/partials/ai-tools/result-section.html)
result_title: "Generated Result"
loading_text: ""
---

<link rel="stylesheet" href="cyber-defence-character.css">

# 🛡️ Cyber Defence Character Sheet Generator

Create D&D-inspired character sheets for cybersecurity professionals! Generate unique characters with stats, skills, tools, and AI-powered backstories. Perfect for team building, training exercises, or gamifying cyber defence education.

<form id="cyberCharacterForm">
  <div class="form-group">
    <label for="characterName" class="tooltip">
      Character Name *
      <span class="tooltiptext">Enter your character's name or codename</span>
    </label>
    <input type="text" id="characterName" placeholder="e.g., Shadow Cipher, Phoenix Guardian, Null Knight" required>
  </div>

  <div class="form-group">
    <label for="characterClass" class="tooltip">
      Cybersecurity Class *
      <span class="tooltiptext">Choose your primary cybersecurity role</span>
    </label>
    <select id="characterClass" required>
      <option value="">Select a class...</option>
      <optgroup label="Defensive Roles">
        <option value="incident-responder">🚨 Incident Responder - First line of defence against active threats</option>
        <option value="soc-analyst">👁️ SOC Analyst - Vigilant monitor of security operations</option>
        <option value="blue-team">🛡️ Blue Team Defender - Master of defensive strategies</option>
        <option value="threat-hunter">🔍 Threat Hunter - Proactive seeker of hidden dangers</option>
        <option value="security-architect">🏛️ Security Architect - Designer of fortress-like systems</option>
      </optgroup>
      <optgroup label="Offensive Roles">
        <option value="red-team">⚔️ Red Team Specialist - Offensive security expert</option>
        <option value="penetration-tester">🎯 Penetration Tester - Ethical hacker and vulnerability finder</option>
        <option value="exploit-developer">💣 Exploit Developer - Weaponizes vulnerabilities</option>
      </optgroup>
      <optgroup label="Analysis Roles">
        <option value="malware-analyst">🦠 Malware Analyst - Dissector of malicious code</option>
        <option value="forensics-investigator">🔬 Forensics Investigator - Digital crime scene examiner</option>
        <option value="threat-intelligence">🌐 Threat Intelligence Analyst - Global threat tracker</option>
        <option value="reverse-engineer">🔧 Reverse Engineer - Code archeologist and deconstructor</option>
      </optgroup>
      <optgroup label="Governance & Strategy">
        <option value="security-engineer">⚙️ Security Engineer - Technical problem solver</option>
        <option value="compliance-officer">📋 Compliance Officer - Regulatory expert and auditor</option>
        <option value="risk-analyst">📊 Risk Analyst - Strategic threat assessor</option>
        <option value="cryptographer">🔐 Cryptographer - Master of codes and ciphers</option>
      </optgroup>
    </select>
  </div>

  <div class="form-group">
    <label for="characterGender" class="tooltip">
      Gender
      <span class="tooltiptext">Select gender for appropriate pronoun usage in backstory</span>
    </label>
    <select id="characterGender">
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="neutral">Prefer Not to Specify</option>
    </select>
  </div>

  <div class="stat-grid">
    <p class="helper-text"><button type="button" class="stats-help-btn" onclick="openStatsModal()">📖 Stats Guide</button></p>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">💪</span>
        <span class="stat-abbr">STR</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statStr">10</span>
        <span class="stat-modifier" id="modStr">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Str', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Str', -1)">−</button>
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">🏃</span>
        <span class="stat-abbr">DEX</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statDex">10</span>
        <span class="stat-modifier" id="modDex">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Dex', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Dex', -1)">−</button>
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">🛡️</span>
        <span class="stat-abbr">CON</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statCon">10</span>
        <span class="stat-modifier" id="modCon">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Con', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Con', -1)">−</button>
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">🧠</span>
        <span class="stat-abbr">INT</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statInt">10</span>
        <span class="stat-modifier" id="modInt">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Int', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Int', -1)">−</button>
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">🔮</span>
        <span class="stat-abbr">WIS</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statWis">10</span>
        <span class="stat-modifier" id="modWis">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Wis', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Wis', -1)">−</button>
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label">
        <span class="stat-icon">✨</span>
        <span class="stat-abbr">CHA</span>
      </div>
      <div class="stat-value">
        <span class="stat-number" id="statCha">10</span>
        <span class="stat-modifier" id="modCha">+0</span>
      </div>
      <div class="stat-controls">
        <button type="button" class="stat-btn stat-plus" onclick="adjustStat('Cha', 1)">+</button>
        <button type="button" class="stat-btn stat-minus" onclick="adjustStat('Cha', -1)">−</button>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label for="skills" class="tooltip">
      Security Skills
      <span class="tooltiptext">Select skills your character has mastered (hold Ctrl/Cmd for multiple selections)</span>
    </label>
    <select id="skills" multiple size="12">
      <optgroup label="Network Security">
        <option value="Network Traffic Analysis">Network Traffic Analysis</option>
        <option value="Firewall Configuration">Firewall Configuration</option>
        <option value="IDS/IPS Management">IDS/IPS Management</option>
        <option value="VPN Setup & Management">VPN Setup & Management</option>
        <option value="Network Segmentation">Network Segmentation</option>
        <option value="DNS Security">DNS Security & Analysis</option>
        <option value="Network Forensics">Network Forensics</option>
        <option value="Packet Analysis">Deep Packet Analysis</option>
      </optgroup>
      <optgroup label="Offensive Security">
        <option value="Penetration Testing">Penetration Testing</option>
        <option value="Social Engineering">Social Engineering</option>
        <option value="Exploit Development">Exploit Development</option>
        <option value="Red Team Operations">Red Team Operations</option>
        <option value="Web Application Testing">Web Application Testing</option>
        <option value="Wireless Security Testing">Wireless Security Testing</option>
        <option value="Physical Security Testing">Physical Security Testing</option>
        <option value="Password Cracking">Password Cracking & Analysis</option>
        <option value="Privilege Escalation">Privilege Escalation Techniques</option>
      </optgroup>
      <optgroup label="Defensive Security">
        <option value="Incident Response">Incident Response</option>
        <option value="Threat Intelligence">Threat Intelligence</option>
        <option value="SIEM Operations">SIEM Operations</option>
        <option value="Forensics Analysis">Forensics Analysis</option>
        <option value="Malware Reverse Engineering">Malware Reverse Engineering</option>
        <option value="Memory Forensics">Memory Forensics</option>
        <option value="Endpoint Detection">Endpoint Detection & Response</option>
        <option value="Threat Hunting">Threat Hunting Methodologies</option>
        <option value="Log Analysis">Log Analysis & Correlation</option>
      </optgroup>
      <optgroup label="Application Security">
        <option value="Secure Code Review">Secure Code Review</option>
        <option value="OWASP Top 10">OWASP Top 10 Mitigation</option>
        <option value="API Security">API Security Testing</option>
        <option value="Static Analysis">Static Application Security Testing</option>
        <option value="Dynamic Analysis">Dynamic Application Security Testing</option>
      </optgroup>
      <optgroup label="Compliance & Governance">
        <option value="Risk Assessment">Risk Assessment</option>
        <option value="Security Auditing">Security Auditing</option>
        <option value="Policy Development">Policy Development</option>
        <option value="Compliance Management">Compliance Management</option>
        <option value="Security Awareness Training">Security Awareness Training</option>
        <option value="GRC Implementation">GRC Implementation</option>
        <option value="ISO 27001">ISO 27001 Standards</option>
        <option value="NIST Framework">NIST Cybersecurity Framework</option>
      </optgroup>
      <optgroup label="Cloud & DevSecOps">
        <option value="Cloud Security">Cloud Security Architecture</option>
        <option value="Container Security">Container Security</option>
        <option value="CI/CD Security">CI/CD Pipeline Security</option>
        <option value="Infrastructure as Code">Infrastructure as Code Security</option>
        <option value="Security Automation">Security Automation & Orchestration</option>
        <option value="Kubernetes Security">Kubernetes Security</option>
        <option value="Serverless Security">Serverless Security</option>
        <option value="Cloud Compliance">Cloud Compliance & Governance</option>
      </optgroup>
      <optgroup label="Specialized">
        <option value="Cryptography">Cryptography & PKI</option>
        <option value="IoT Security">IoT Security</option>
        <option value="Mobile Security">Mobile Security (iOS/Android)</option>
        <option value="OT/ICS Security">OT/ICS/SCADA Security</option>
        <option value="Threat Modeling">Threat Modeling</option>
        <option value="AI/ML Security">AI/ML Security</option>
        <option value="Blockchain Security">Blockchain Security</option>
        <option value="Zero Trust Architecture">Zero Trust Architecture</option>
        <option value="Purple Teaming">Purple Team Operations</option>
      </optgroup>
    </select>
    <div class="helper-text">💡 Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple skills</div>
  </div>

  <div class="form-group">
    <label for="customSkills" class="tooltip">
      Custom Skills (Optional)
      <span class="tooltiptext">Add any additional skills not listed above, one per line</span>
    </label>
    <textarea id="customSkills" rows="4" placeholder="Zero-Day Research&#10;Quantum Cryptanalysis&#10;AI-Powered Threat Detection&#10;Custom skill here..."></textarea>
  </div>

  <div class="form-group">
    <label for="tools" class="tooltip">
      Cyber Tools & Technologies
      <span class="tooltiptext">Select tools and technologies your character is proficient with</span>
    </label>
    <select id="tools" multiple size="12">
      <optgroup label="Analysis & Monitoring">
        <option value="Wireshark">Wireshark</option>
        <option value="tcpdump">tcpdump</option>
        <option value="Zeek (Bro)">Zeek (Bro)</option>
        <option value="Splunk">Splunk</option>
        <option value="ELK Stack">ELK Stack (Elasticsearch, Logstash, Kibana)</option>
        <option value="Suricata">Suricata</option>
        <option value="Snort">Snort</option>
        <option value="Graylog">Graylog</option>
        <option value="Nagios">Nagios</option>
        <option value="Zabbix">Zabbix</option>
      </optgroup>
      <optgroup label="Penetration Testing">
        <option value="Metasploit">Metasploit Framework</option>
        <option value="Burp Suite">Burp Suite Pro</option>
        <option value="Nmap">Nmap</option>
        <option value="OWASP ZAP">OWASP ZAP</option>
        <option value="Cobalt Strike">Cobalt Strike</option>
        <option value="BloodHound">BloodHound</option>
        <option value="Kali Linux">Kali Linux</option>
        <option value="Parrot OS">Parrot Security OS</option>
        <option value="Nikto">Nikto</option>
        <option value="SQLMap">SQLMap</option>
        <option value="John the Ripper">John the Ripper</option>
        <option value="Hashcat">Hashcat</option>
        <option value="Aircrack-ng">Aircrack-ng</option>
        <option value="Hydra">Hydra</option>
      </optgroup>
      <optgroup label="Malware & Forensics">
        <option value="IDA Pro">IDA Pro</option>
        <option value="Ghidra">Ghidra</option>
        <option value="x64dbg">x64dbg</option>
        <option value="Volatility">Volatility Framework</option>
        <option value="Autopsy">Autopsy</option>
        <option value="FTK">FTK (Forensic Toolkit)</option>
        <option value="YARA">YARA</option>
        <option value="Cuckoo Sandbox">Cuckoo Sandbox</option>
        <option value="ANY.RUN">ANY.RUN</option>
        <option value="Remnux">REMnux</option>
        <option value="Radare2">Radare2</option>
        <option value="PE Studio">PE Studio</option>
        <option value="ProcessHacker">Process Hacker</option>
      </optgroup>
      <optgroup label="Security Operations">
        <option value="TheHive">TheHive</option>
        <option value="MISP">MISP</option>
        <option value="Cortex">Cortex</option>
        <option value="IBM QRadar">IBM QRadar</option>
        <option value="ArcSight">ArcSight</option>
        <option value="Sentinel">Microsoft Sentinel</option>
        <option value="Chronicle">Google Chronicle</option>
        <option value="Demisto">Palo Alto Cortex XSOAR</option>
        <option value="Rapid7 InsightIDR">Rapid7 InsightIDR</option>
      </optgroup>
      <optgroup label="Endpoint Security">
        <option value="CrowdStrike Falcon">CrowdStrike Falcon</option>
        <option value="Carbon Black">VMware Carbon Black</option>
        <option value="SentinelOne">SentinelOne</option>
        <option value="Microsoft Defender">Microsoft Defender for Endpoint</option>
        <option value="Cylance">Cylance</option>
        <option value="Sysinternals">Sysinternals Suite</option>
      </optgroup>
      <optgroup label="Cloud Security">
        <option value="AWS Security Hub">AWS Security Hub</option>
        <option value="Azure Defender">Azure Defender</option>
        <option value="Google Cloud SCC">Google Cloud Security Command Center</option>
        <option value="Prowler">Prowler</option>
        <option value="ScoutSuite">ScoutSuite</option>
        <option value="CloudSploit">CloudSploit</option>
        <option value="Prisma Cloud">Prisma Cloud</option>
        <option value="Lacework">Lacework</option>
      </optgroup>
      <optgroup label="Vulnerability Management">
        <option value="Nessus">Nessus</option>
        <option value="Qualys">Qualys</option>
        <option value="OpenVAS">OpenVAS</option>
        <option value="Nexpose">Nexpose</option>
        <option value="Acunetix">Acunetix</option>
        <option value="Nuclei">Nuclei</option>
      </optgroup>
      <optgroup label="Scripting & Automation">
        <option value="Python">Python</option>
        <option value="PowerShell">PowerShell</option>
        <option value="Bash">Bash/Shell Scripting</option>
        <option value="Go">Go (Golang)</option>
        <option value="Ansible">Ansible</option>
        <option value="Terraform">Terraform</option>
        <option value="Docker">Docker</option>
        <option value="Kubernetes">Kubernetes</option>
      </optgroup>
    </select>
    <div class="helper-text">💡 Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple tools</div>
  </div>

  <div class="form-group">
    <label for="customTools" class="tooltip">
      Custom Tools (Optional)
      <span class="tooltiptext">Add any additional tools not listed above, one per line</span>
    </label>
    <textarea id="customTools" rows="4" placeholder="Custom SIEM Platform&#10;Proprietary Analysis Tool&#10;In-house Script&#10;Custom tool here..."></textarea>
  </div>

  <div class="form-group">
    <label for="background" class="tooltip">
      Character Background (Optional)
      <span class="tooltiptext">Provide context for AI-generated backstory: past experiences, motivations, notable events</span>
    </label>
    <textarea id="background" rows="6" placeholder="Former military cryptanalyst turned private sector defender...&#10;&#10;Started career after experiencing a data breach...&#10;&#10;Known for discovering a critical zero-day vulnerability..."></textarea>
    <div class="helper-text">💡 AI will use this to generate a compelling backstory and special abilities</div>
  </div>

  <div class="form-group">
    <label class="tooltip">
      Generation Options
      <span class="tooltiptext">Select additional AI-generated content for your character</span>
    </label>
    <div class="toggle-options">
      <label class="toggle-option">
        <input type="checkbox" id="includeStatAnalysis" checked>
        <span class="toggle-label">📊 Stat-Based Character Analysis</span>
        <span class="toggle-description">Describe character personality and playstyle based on stat distribution</span>
      </label>
      <label class="toggle-option">
        <input type="checkbox" id="includeUniqueAbilities" checked>
        <span class="toggle-label">⭐ Unique Special Abilities</span>
        <span class="toggle-description">Generate random signature abilities based on stats and class</span>
      </label>
      <label class="toggle-option">
        <input type="checkbox" id="includeStrengthsWeaknesses">
        <span class="toggle-label">⚖️ Strengths & Weaknesses</span>
        <span class="toggle-description">Identify character strengths and potential vulnerabilities from stats</span>
      </label>
    </div>
  </div>

  <div class="form-row">
    <button type="button" class="btn btn-primary" onclick="generateCharacter()">
      🎲 Generate Character Sheet
    </button>
    <button type="button" class="btn-secondary" onclick="randomizeCharacter()">
      🔀 Randomize All
    </button>
  </div>
</form>

<div id="resultDiv" style="display: none;">
  <h3 style="color: #ff6b35;">📜 Your Character Sheet</h3>
  <div id="characterSheet"></div>
  <div class="result-actions">
    <button class="action-btn copy-btn" onclick="copyResult(event)">
      📋 Copy Character Data
    </button>
    <button class="action-btn download-btn" onclick="downloadResult('markdown')">
      📄 Download Markdown
    </button>
    <button class="action-btn download-btn" onclick="downloadResult('html')">
      🌐 Download HTML
    </button>
    <button class="action-btn download-btn" onclick="downloadPDF()">
      📕 Download PDF
    </button>
  </div>
</div>

<!-- Stats Reference Modal -->
<div id="statsModal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="modal-close" onclick="closeStatsModal()">&times;</span>
    <h2>📖 Core Stats Reference Guide</h2>
    <div class="stats-modal-body">
      <div class="stat-description">
        <h3>💪 Strength (STR)</h3>
        <p>Physical power, stress resilience, and endurance during long operations. A high STR character can handle physically demanding situations, maintain composure under pressure, and push through exhausting incidents.</p>
      </div>
      <div class="stat-description">
        <h3>🏃 Dexterity (DEX)</h3>
        <p>Reaction speed, precision under pressure, and multitasking ability. High DEX represents quick thinking, nimble fingers for rapid keyboard work, and the ability to juggle multiple security events simultaneously.</p>
      </div>
      <div class="stat-description">
        <h3>🛡️ Constitution (CON)</h3>
        <p>Mental fortitude, resistance to burnout, and sustained focus. Characters with high CON can work long shifts, maintain concentration during extended investigations, and recover quickly from stressful incidents.</p>
      </div>
      <div class="stat-description">
        <h3>🧠 Intelligence (INT)</h3>
        <p>Technical knowledge, problem-solving, and analytical reasoning. This represents your character's technical expertise, ability to understand complex systems, and skill at connecting disparate pieces of information.</p>
      </div>
      <div class="stat-description">
        <h3>🔮 Wisdom (WIS)</h3>
        <p>Situational awareness, intuition, and pattern recognition. High WIS helps detect anomalies, sense when something is wrong, and make sound judgments based on incomplete information.</p>
      </div>
      <div class="stat-description">
        <h3>✨ Charisma (CHA)</h3>
        <p>Communication, leadership, influence, and social engineering. Essential for coordinating teams, explaining technical issues to non-technical stakeholders, and conducting social engineering assessments.</p>
      </div>
      <div class="modifier-explanation">
        <h3>💡 How Modifiers Work</h3>
        <p><strong>Formula:</strong> (Stat Value - 10) ÷ 2, rounded down</p>
        <div class="modifier-examples">
          <div>Stat 8 → Modifier -1</div>
          <div>Stat 10 → Modifier +0</div>
          <div>Stat 12 → Modifier +1</div>
          <div>Stat 16 → Modifier +3</div>
          <div>Stat 20 → Modifier +5</div>
        </div>
        <p>Modifiers represent how your stats influence your character's abilities. Higher modifiers mean greater expertise and effectiveness in related activities.</p>
      </div>
    </div>
  </div>
</div>

<!-- Load jsPDF Library -->
<!-- Load Shared Components -->
<!-- Load Tool-Specific Script -->
