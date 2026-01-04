---
title: "PCAP Command Hunter"
subtitle: "AI-powered network forensics command generator"
description: "Generate contextual command-line snippets for hunting malicious activity in PCAP files using Zeek, TCPDump, TShark, Snort, and Suricata. Get basic to advanced commands tailored to your investigation."
keywords: ["pcap analysis", "network forensics", "zeek commands", "tcpdump", "tshark", "snort", "suricata", "packet analysis", "cybersecurity", "DFIR", "incident response"]
date: 2026-01-04
lastmod: 2026-01-04
draft: false
tags: ["Network Security", "DFIR", "Packet Analysis", "CLI", "Forensics"]
categories: ["AI Tools"]
type: ai-tools
seo_title: "PCAP Command Hunter - AI Network Forensics CLI Generator | 4n6Post"
canonical: "/ai-tools/core-services/pcap-hunter/"
result_title: "Generated Commands"
loading_text: "Generating commands for your hunt..."
show_svg_download: false
show_pdf_download: false
---

<link rel="stylesheet" href="pcap-hunter.css">

# 🔍 PCAP Command Hunter

Generate context-aware command-line snippets for hunting malicious activity in network captures. Describe what you're looking for, select your tools, and get ready-to-use commands from basic to advanced complexity.

<form id="pcapHunterForm">
  <div class="form-section">
    <!-- Query Input -->
    <div class="form-group">
      <label for="huntQuery">What are you hunting? *</label>
      <textarea id="huntQuery" rows="3" required placeholder="Example: Show me top 5 conversations by packet count"></textarea>
      <button type="button" class="btn-example" onclick="cycleExample()">
        <span class="btn-icon">🎲</span>
        <span class="btn-text">Cycle Examples</span>
      </button>
    </div>
    <!-- Target File Input -->
    <div class="form-group">
      <label for="targetFile">Target File (Optional)</label>
      <input type="text" id="targetFile" placeholder="e.g., alerts.log, Pri1-Alerts.log, rdp.log, http.pcap">
      <small class="form-helper">Filename will guide command generation context</small>
    </div>
    <!-- Tool Selection -->
    <div class="form-group">
      <label>Select Tools *</label>
      <div class="tool-list">
        <div class="tool-row">
          <button type="button" class="btn-ref-icon btn-ref-placeholder"></button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-cli" value="cli" checked>
            <span class="tool-icon">⚙️</span>
            <span class="tool-name">CLI Tools</span>
          </label>
          <select id="fileType-cli" class="file-type-select-inline">
            <option value="*.log">*.log (log files)</option>
            <option value="*.txt">*.txt (text files)</option>
            <option value="*.csv">*.csv (CSV files)</option>
            <option value="*.json">*.json (JSON files)</option>
          </select>
        </div>
        <div class="tool-row">
          <button type="button" class="btn-ref-icon" onclick="openFlagModal('zeek')" title="Flag Reference">📖</button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-zeek" value="zeek">
            <span class="tool-icon">🔷</span>
            <span class="tool-name">Zeek/Bro</span>
          </label>
          <select id="fileType-zeek" class="file-type-select-inline">
            <option value="conn.log">conn.log</option>
            <option value="dns.log">dns.log</option>
            <option value="http.log">http.log</option>
            <option value="ssl.log">ssl.log</option>
            <option value="files.log">files.log</option>
            <option value="*.log">*.log (all logs)</option>
          </select>
          <label class="cli-toggle-inline">
            <input type="checkbox" id="cli-zeek" class="cli-checkbox" checked>
            <span class="cli-label">CLI</span>
          </label>
        </div>
        <div class="tool-row">
          <button type="button" class="btn-ref-icon" onclick="openFlagModal('tcpdump')" title="Flag Reference">📖</button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-tcpdump" value="tcpdump">
            <span class="tool-icon">📦</span>
            <span class="tool-name">TCPDump</span>
          </label>
          <select id="fileType-tcpdump" class="file-type-select-inline">
            <option value="capture.pcap">*.pcap</option>
            <option value="capture.pcapng">*.pcapng</option>
          </select>
          <label class="cli-toggle-inline">
            <input type="checkbox" id="cli-tcpdump" class="cli-checkbox" checked>
            <span class="cli-label">CLI</span>
          </label>
        </div>
        <div class="tool-row">
          <button type="button" class="btn-ref-icon" onclick="openFlagModal('tshark')" title="Flag Reference">📖</button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-tshark-suite" value="tshark-suite">
            <span class="tool-icon">🦈</span>
            <span class="tool-name">Wireshark Suite</span>
          </label>
          <select id="fileType-tshark-suite" class="file-type-select-inline">
            <option value="capture.pcap">*.pcap</option>
            <option value="capture.pcapng">*.pcapng</option>
          </select>
          <label class="cli-toggle-inline">
            <input type="checkbox" id="cli-tshark" class="cli-checkbox" checked>
            <span class="cli-label">CLI</span>
          </label>
        </div>
        <div class="tool-subrow disabled collapsed" id="tshark-suboptions">
          <div class="tool-sub-item">
            <label class="tool-checkbox-inline">
              <input type="checkbox" id="tool-tshark" value="tshark" checked disabled>
              <span class="tool-name">TShark</span>
            </label>
          </div>
          <div class="tool-sub-item">
            <label class="tool-checkbox-inline">
              <input type="checkbox" id="tool-mergecap" value="mergecap" disabled>
              <span class="tool-name">mergecap</span>
            </label>
          </div>
          <div class="tool-sub-item">
            <label class="tool-checkbox-inline">
              <input type="checkbox" id="tool-capinfos" value="capinfos" disabled>
              <span class="tool-name">capinfos</span>
            </label>
          </div>
          <div class="tool-sub-item">
            <label class="tool-checkbox-inline">
              <input type="checkbox" id="tool-editcap" value="editcap" disabled>
              <span class="tool-name">editcap</span>
            </label>
          </div>
          <div class="tool-sub-item">
            <label class="tool-checkbox-inline">
              <input type="checkbox" id="tool-dumpcap" value="dumpcap" disabled>
              <span class="tool-name">dumpcap</span>
            </label>
          </div>
        </div>
        <div class="tool-row">
          <button type="button" class="btn-ref-icon" onclick="openFlagModal('snort')" title="Flag Reference">📖</button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-snort" value="snort">
            <span class="tool-icon">🐗</span>
            <span class="tool-name">Snort</span>
          </label>
          <select id="fileType-snort" class="file-type-select-inline">
            <option value="capture.pcap">*.pcap (live analysis)</option>
            <option value="alert">alert (unified2)</option>
            <option value="/var/log/snort/alert">/var/log/snort/alert</option>
            <option value="/var/log/snort/snort.log.*">/var/log/snort/snort.log.*</option>
          </select>
          <label class="cli-toggle-inline">
            <input type="checkbox" id="cli-snort" class="cli-checkbox" checked>
            <span class="cli-label">CLI</span>
          </label>
        </div>
        <div class="tool-row">
          <button type="button" class="btn-ref-icon" onclick="openFlagModal('suricata')" title="Flag Reference">📖</button>
          <label class="tool-checkbox-inline">
            <input type="checkbox" id="tool-suricata" value="suricata">
            <span class="tool-icon">🛡️</span>
            <span class="tool-name">Suricata</span>
          </label>
          <select id="fileType-suricata" class="file-type-select-inline">
            <option value="capture.pcap">*.pcap (live analysis)</option>
            <option value="/var/log/suricata/eve.json">eve.json (EVE log)</option>
            <option value="/var/log/suricata/fast.log">fast.log (alerts)</option>
            <option value="/var/log/suricata/stats.log">stats.log (statistics)</option>
          </select>
          <label class="cli-toggle-inline">
            <input type="checkbox" id="cli-suricata" class="cli-checkbox" checked>
            <span class="cli-label">CLI</span>
          </label>
        </div>
      </div>
    </div>
    <!-- Optional Target -->
    <div class="form-group">
      <label for="optionalTarget">Optional Target (IP/Port/Protocol)</label>
      <input type="text" id="optionalTarget" placeholder="e.g., 192.168.1.100, port 443, tcp">
      <small class="form-helper">Leave blank for general queries</small>
    </div>
    <!-- Control Toggles -->
    <div class="form-group">
      <label>Output Options</label>
      <div class="checkbox-group">
        <label class="checkbox-inline">
          <input type="checkbox" id="showExplanations">
          <span class="toggle-switch"><span class="toggle-slider"></span></span>
          <span class="toggle-label">Show Explanations</span>
        </label>
        <label class="checkbox-inline">
          <input type="checkbox" id="showConfigHints">
          <span class="toggle-switch"><span class="toggle-slider"></span></span>
          <span class="toggle-label">Show Config Hints</span>
        </label>
      </div>
    </div>
  </div>

  <button type="submit" class="btn btn-primary">
    <span class="btn-icon">🎯</span>
    <span class="btn-text">Generate Commands</span>
  </button>
</form>

<!-- Loading/Error/Result containers (auto-injected by layout) -->
<div id="loadingDiv" class="loading-container" style="display:none;"></div>
<div id="errorDiv" class="error-container" style="display:none;"></div>
<div id="resultDiv" class="result-container" style="display:none;">
  <div class="result-header">
    <h2>Hunt Commands</h2>
  </div>
  <div id="resultContent" class="result-content"></div>
  <div class="result-actions">
    <button class="action-btn copy-btn" onclick="copyAllResults(event)">📋 Copy All</button>
    <button class="action-btn download-btn" onclick="downloadResult('markdown')">📄 Download MD</button>
  </div>
</div>

<!-- Flag Reference Modal -->
<div id="flagModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="modalTitle">Flag Reference</h3>
      <button class="modal-close" onclick="closeFlagModal()">&times;</button>
    </div>
    <div class="modal-body" id="modalBody">
      <p>Loading...</p>
    </div>
    <div class="modal-footer">
      <a id="modalDocLink" href="#" target="_blank" class="btn-doc-link">📚 Official Documentation</a>
    </div>
  </div>
</div>

<!-- Required Scripts -->
<script src="/shared/components/utils.js"></script>
<script src="/shared/components/api-manager.js"></script>
<script src="/shared/components/download-manager.js"></script>
<script src="pcap-hunter.js"></script>
