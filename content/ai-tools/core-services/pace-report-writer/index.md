---
title: "PaCE Writer"
subtitle: "Canadian Armed Forces Performance and Career Evaluation Report Generator"
description: "Create PaCE Feedback Notes by providing some information. The more details you provide, the better the AI can assist you."
keywords: ["PaCE report", "CAF evaluation", "performance report", "military evaluation", "competency framework", "career evaluation", "Canadian Armed Forces", "military report writer", "performance assessment", "CAF tools"]
date: 2025-11-22
lastmod: 2025-11-24
draft: false
tags: ["Core Services", "Military", "PaCE Report", "Performance Evaluation", "Career Assessment", "CAF", "Professional Development", "AI", "Tools"]
categories: ["AI Tools"]
type: ai-tools
seo_title: "Free CAF PaCE Writer - Generate Performance Evaluations"
canonical: "/ai-tools/core-services/pace-report-writer/"
featured_image: "/images/featured/aitools/pace-writer.png"
schema_type: "SoftwareApplication"
sitemap_priority: 0.7
sitemap_changefreq: "monthly"
social_media:
  og_title: "CAF PaCE Writer - Performance Evaluation Generator"
  og_description: "Generate professional PaCE reports for Canadian Armed Forces members with structured competency frameworks and detailed evaluations."
  og_image: "/images/featured/aitools/pace-writer.png"
  og_type: "website"
  twitter_card: "summary_large_image"
  twitter_title: "Free CAF PaCE Writer Tool"
  twitter_description: "Create professional Performance and Career Evaluation reports for CAF members with AI assistance."
  twitter_image: "/images/featured/aitools/pace-writer.png"
---

<link rel="icon" type="image/svg+xml" href="/ai-tools/core-services/pace-report-writer/PaCE.svg">

<link rel="stylesheet" href="/shared/styles/result-display.css">
<link rel="stylesheet" href="/ai-tools/core-services/pace-report-writer/pace-report-writer.css">

# <img src="/ai-tools/core-services/pace-report-writer/PaCE.svg" alt="PaCE Report Writer" width="50" height="50" style="width:75px;height:75px;border:none!important;box-shadow:none!important;outline:none;background:transparent;display:inline-block;vertical-align:middle;" loading="lazy" decoding="async" /> CAF PaCE Writer

<div style="gap: 7px; flex-wrap: wrap;">
  <button type="button" class="btn-secondary" onclick="openFrameworkModal()" style="font-size: 0.95em; padding: 5px 5px;">📚 Competency</button>
  <button type="button" class="btn-secondary" onclick="openReferencesModal()" style="font-size: 0.95em; padding: 5px 5px;">🔗 Reference</button>
  <button type="button" class="btn-secondary info-toggle-btn" id="infoToggleBtn" onclick="showInfoNotice()" aria-label="Show tool information" title="Tool Information" style="font-size: 0.95em; padding: 5px 5px; display: none;">ℹ️ Info</button>
</div>

**⚠️ Security Notice:**  
Do not put sensitive information into the form.   

<form id="paceForm">
  <div class="form-group">
    <label for="rankSelect" class="tooltip">
      Member Rank *
      <span class="tooltiptext">Select the member's rank to load rank-specific competency framework</span>
    </label>
    <select id="rankSelect" required onchange="updateCompetencyFramework()">
      <option value="">-- Select Rank --</option>
      <optgroup label="Junior NCMs">
        <option value="pte">Pte - Private</option>
        <option value="cpl">Cpl - Corporal</option>
      </optgroup>
      <optgroup label="Senior NCMs">
        <option value="mcpl-ms">MCpl/MS - Master Corporal / Master Seaman</option>
        <option value="sgt-po2">Sgt/PO2 - Sergeant / Petty Officer 2nd Class</option>
        <option value="wo-po1">WO/PO1 - Warrant Officer / Petty Officer 1st Class</option>
        <option value="mwo-cpo2">MWO/CPO2 - Master Warrant Officer / Chief Petty Officer 2nd Class</option>
        <option value="cwo-cpo1">CWO/CPO1 - Chief Warrant Officer / Chief Petty Officer 1st Class</option>
      </optgroup>
      <optgroup label="Junior Officers">
        <option value="ocdt">OCdt - Officer Cadet</option>
        <option value="2lt-aslt">2Lt/A/SLt - Second Lieutenant / Acting Sub-Lieutenant</option>
        <option value="lt-slt">Lt/SLt - Lieutenant / Sub-Lieutenant</option>
        <option value="capt-lt">Capt/Lt(N) - Captain / Lieutenant (Navy)</option>
      </optgroup>
      <optgroup label="Senior Officers">
        <option value="maj-lcdr">Maj/LCdr - Major / Lieutenant Commander</option>
        <option value="lcol-cdr">LCol/Cdr - Lieutenant Colonel / Commander</option>
        <option value="col-capt">Col/Capt(N) - Colonel / Captain (Navy)</option>
      </optgroup>
    </select>
    <div id="rankWarning" style="display: none; margin-top: 12px;"></div>
  </div>

  <div class="form-group">
    <label for="competencyCount" class="tooltip">
      Number of Competencies: <span id="competencyCountValue" style="color:#ff6b35;font-weight:600;">3</span>
      <span class="tooltiptext">Select how many competencies (1-15) the AI should identify in order of priority/relevance.</span>
    </label>
    <input type="range" id="competencyCount" min="1" max="15" value="3" step="1" 
           oninput="document.getElementById('competencyCountValue').textContent = this.value" 
           style="width:100%;cursor:pointer;">
    <div class="helper-text" style="display:flex;justify-content:space-between;margin-top:5px;">
      <span>1 (Most focused)</span>
      <span>15 (Comprehensive)</span>
    </div>
  </div>

  <div class="form-group">
    <label for="eventDescription" class="tooltip">
      Event Description *
      <span class="tooltiptext">Describe the member's performance, actions, and contributions during the evaluation period. Be specific and detailed.</span>
    </label>
    <textarea id="eventDescription" rows="8" placeholder="Describe the event, member's actions, responsibilities, challenges overcome, and contributions made. Include specific examples and measurable outcomes where possible." required></textarea>
  </div>

  <div class="form-group">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <label class="tooltip" style="flex:1;margin:0;">
        Pre-Select Competencies
        <span class="tooltiptext">Enable the toggle to reveal up to 3 optional competencies you believe are most relevant. The AI may choose different ones if more appropriate and will explain why.</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="competencyToggle" onchange="toggleCompetencySelectors()" aria-controls="competencySelectors" aria-expanded="false">
        <span class="slider"></span>
      </label>
    </div>
    <div id="competencySelectors" style="display:none; margin-top:10px;">
      <div class="helper-text">⚠️ Select up to 3 competencies. AI will evaluate your selections and may suggest alternatives with explanation.</div>
      <select id="competency1" class="competency-select" aria-label="Optional competency 1">
        <option value="">-- Select 1st Competency --</option>
      </select>
      <select id="competency2" class="competency-select" aria-label="Optional competency 2">
        <option value="">-- Select 2nd Competency --</option>
      </select>
      <select id="competency3" class="competency-select" aria-label="Optional competency 3">
        <option value="">-- Select 3rd Competency --</option>
      </select>
    </div>
  </div>

  <!-- Optional CCG Assessment (toggleable) -->
  <div class="form-group">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <label class="tooltip" style="flex:1;margin:0;">
        CCG Assessment
        <span class="tooltiptext">Enable to include Complexity, Consistency, and Guidance context assessment in the note.</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="ccgToggle" aria-controls="ccgInfo" aria-expanded="false">
        <span class="slider"></span>
      </label>
    </div>
    <div id="ccgInfo" style="display:none; margin-top:8px;">
      <div class="helper-text">ℹ️ The AI will assess Complexity (task difficulty), Consistency (performance patterns), and Guidance (level of supervision needed).</div>
    </div>
  </div>

  <!-- Optional Competency Demonstration Analysis (toggleable) -->
  <div class="form-group">
    <div style="display:flex;align-items:left;gap:12px;margin-bottom:10px;">
      <label class="tooltip" style="flex:1;margin:0;">
        Competency Analysis
        <span class="tooltiptext">Enable to include detailed analysis of how each competency was demonstrated during the event.</span>
      </label>
      <label class="switch">
        <input type="checkbox" id="analysisToggle" aria-controls="analysisInfo" aria-expanded="false">
        <span class="slider"></span>
      </label>
    </div>
  </div>

  <button type="button" class="btn-primary" onclick="generatePaceReport()" style="display:flex;align-items:center;justify-content:center;gap:10px;">
    <img src="/ai-tools/core-services/pace-report-writer/PaCE.svg" alt="" style="width:28px;height:28px;border:none!important;box-shadow:none!important;outline:none;background:transparent;margin:0;padding:0;" loading="lazy" decoding="async" />
    <span>Generate PaCEr</span>
  </button>
</form>

<div class="loading" id="loadingDiv" style="display: none;">
  Generating your PaCE report using CAF competency framework...
</div>

<div id="errorDiv" style="display: none;"></div>

<div id="resultDiv" style="display: none;">
  <h3 style="color: #ff6b35; margin-bottom: 20px;">PaCE Report</h3>
  <div id="resultContent"></div>
  <div class="result-actions">
    <button class="action-btn copy-btn" onclick="copyResult(event)">📋 Copy to Clipboard</button>
    <button class="action-btn download-btn" onclick="downloadResult('markdown')">📄 Download Markdown</button>
    <button class="action-btn download-btn" onclick="downloadResult('html')">🌐 Download HTML</button>
  </div>
</div>

<!-- Competency Framework Modal -->
<div id="frameworkModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>📚 CAF Competency Framework Reference Library</h3>
      <button class="modal-close" onclick="closeFrameworkModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="library-intro">
        <strong>⚠️ Select a rank from the form to view the appropriate competency framework.</strong><br>
        The competencies and descriptions will adjust based on the member's rank level. Reference this framework when describing events.
      </div>
      <div id="competencyFrameworkContent">
        <p style="text-align: center; color: #aaa; padding: 40px 20px;">Please select a rank from the dropdown to load the competency framework.</p>
      </div>
    </div>
  </div>
</div>

<!-- References Modal -->
<div id="referencesModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>🔗 Reference Links & Resources</h3>
      <button class="modal-close" onclick="closeReferencesModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="helper-text" style="margin-bottom: 20px;">
        Quick access to official CAF resources and policies. These are for your reference only and will not be included in the generated report.
      </div>
      <div class="reference-links">
        <div class="reference-link">
          <strong>Official CAF Resources:</strong>
          <ul>
            <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp" target="_blank">PaCE - Training Documentation</a></li>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/policies-standards/defence-administrative-orders-directives.html" target="_blank">Defence Administrative Orders and Directives (DAODs)</a></li>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/policies-standards/canadian-forces-military-personnel-instructions/performance-and-competency-evaluation-pace.html" target="_blank">PaCE Official Guidelines</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Shared components already loaded in head.html -->
<script src="/shared/components/utils.js"></script>
<script src="/shared/components/api-manager.js"></script>
<script src="/shared/components/download-manager.js"></script>
<script src="/ai-tools/core-services/pace-report-writer/pace-report-writer.js"></script>
