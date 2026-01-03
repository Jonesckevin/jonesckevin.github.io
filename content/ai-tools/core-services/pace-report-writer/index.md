---
title: "PaCE Writer"
subtitle: "Canadian Armed Forces Performance and Career Evaluation Report Generator"
description: "Create PaCE Feedback Notes by providing some information. The more details you provide, the better the AI can assist you."
keywords: ["PaCE report", "CAF evaluation", "performance report", "military evaluation", "competency framework", "career evaluation", "Canadian Armed Forces", "military report writer", "performance assessment", "CAF tools"]
date: 2025-11-24
lastmod: 2025-12-14
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

# AI Tool Result Section (used by layouts/partials/ai-tools/result-section.html)
result_title: "Generated Result"
loading_text: "Generating your PaCE report using CAF competency framework..."
---

<link rel="icon" type="image/svg+xml" href="/ai-tools/core-services/pace-report-writer/PaCE.svg">

<link rel="stylesheet" href="/ai-tools/core-services/pace-report-writer/pace-report-writer.css">

# <img src="/ai-tools/core-services/pace-report-writer/PaCE.svg" alt="PaCE Report Writer" width="50" height="50" style="width:75px;height:75px;border:none!important;box-shadow:none!important;outline:none;background:transparent;display:inline-block;vertical-align:middle;" loading="lazy" decoding="async" /> CAF PaCE Writer

<div style="gap: 4px; flex-wrap: wrap; margin-bottom: 10px;">
  <button type="button" class="btn-secondary" onclick="openFrameworkModal()" style="font-size: 0.85em !important; padding: 4px 8px !important; line-height: 1.2 !important; width: auto !important; min-width: auto !important;">📚 Competency</button>
  <button type="button" class="btn-secondary" onclick="openReferencesModal()" style="font-size: 0.85em !important; padding: 4px 8px !important; line-height: 1.2 !important; width: auto !important; min-width: auto !important;">🔗 Reference</button>
  <button type="button" class="btn-secondary info-toggle-btn" id="infoToggleBtn" onclick="showInfoNotice()" aria-label="Show tool information" title="Tool Information" style="font-size: 0.85em !important; padding: 4px 8px !important; line-height: 1.2 !important; width: auto !important; min-width: auto !important; display: none;">ℹ️ Info</button>
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
        <option value="mcpl-ms">MCpl/MS - Master Corporal / Master Seaman</option>
      </optgroup>
      <optgroup label="Senior NCMs">
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
    <label for="jobTrade" class="tooltip">
      Military Occupation / Trade (Optional)
      <span class="tooltiptext">Enter the member's military occupation or trade (e.g., Cyber Operator, Signal Operator, Infantry, Armored, Cook, Supply Technician). This helps assess task complexity and relevance to their primary role.</span>
    </label>
    <input type="text" id="jobTrade" placeholder="e.g., Cyber Operator, Infantry, Armored, Cook, Supply Technician" aria-label="Military Occupation or Trade">
    <div class="helper-text">💡 Helps assess if tasks are within normal scope or demonstrate versatility beyond primary role</div>
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

  <!-- Optional CCG Assessment (toggleable) -->
  <div class="form-group">
    <label class="checkbox-inline">
      <input type="checkbox" id="ccgToggle" onchange="toggleCCG()" aria-controls="ccgInfo" aria-expanded="true" checked>
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">CCG Assessment</span>
      <span class="toggle-helper">Assess Complexity, Consistency, and Guidance context.</span>
    </label>
    <div id="ccgInfo" style="display:block; margin-top:8px;">
      <div class="helper-text">ℹ️ The AI will assess Complexity (task difficulty), Consistency (performance patterns), and Guidance (level of supervision needed).</div>
    </div>
  </div>

  <!-- Optional Meta-Competency Assessment (two-tier toggleable) -->
  <div class="form-group">
    <label class="checkbox-inline">
      <input type="checkbox" id="metaCompetencyToggle" onchange="toggleMetaCompetency()" aria-controls="metaCompetencyOptions" aria-expanded="true" checked>
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">Meta-Competency</span>
      <span class="toggle-helper">Identify which of the 5 meta-competencies are relevant.</span>
    </label>
    <div id="metaCompetencyOptions" style="display:block; margin-top:8px;">
      <div class="helper-text">ℹ️ Identify which meta-competencies.<br>(Rarely/Occasionally/Frequently/Consistently)</div>
      <!-- Nested toggle for detailed analysis -->
      <div style="margin-top:15px;padding-left:10px;border-left:3px solid #ff6b35;">
        <label class="checkbox-inline">
          <input type="checkbox" id="metaCompetencyDetailedToggle" onchange="toggleMetaCompetencyDetailed()" aria-controls="metaCompetencyDetailedInfo" aria-expanded="false">
          <span class="toggle-switch"><span class="toggle-slider"></span></span>
          <span class="toggle-label">Meta-Competency Details ⚠️ <i>(Loud)</i></span>
          <span class="toggle-helper">Include frequency ratings, behaviours, evidence & impact.</span>
        </label>
        <div id="metaCompetencyDetailedInfo" style="display:none; margin-top:8px;">
          <div class="helper-text">Frequency, sub-inclusive behaviours, and impact assessment for next-rank readiness.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="checkbox-inline">
      <input type="checkbox" id="competencyToggle" onchange="toggleCompetencySelectors()" aria-controls="competencySelectors" aria-expanded="false">
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">Pre-Select Competencies</span>
      <span class="toggle-helper">Select up to 3 competencies you believe are most relevant.</span>
    </label>
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

  <!-- Optional Competency Demonstration Analysis (toggleable) -->
  <div class="form-group">
    <label class="checkbox-inline">
      <input type="checkbox" id="analysisToggle" onchange="toggleAnalysis()" aria-controls="analysisInfo" aria-expanded="false">
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">Competency Analysis</span>
      <span class="toggle-helper">Include detailed analysis of how each competency was demonstrated.</span>
    </label>
    <div id="analysisInfo" style="display:none; margin-top:8px;">
      <div class="helper-text">ℹ️ The AI will provide detailed analysis of how each competency was demonstrated with concrete examples and impact.</div>
    </div>
  </div>
  
  <button type="button" class="btn btn-primary" onclick="generatePaceReport()" style="display:flex;align-items:center;justify-content:center;gap:10px;">
    <img src="/ai-tools/core-services/pace-report-writer/PaCE.svg" alt="" style="width:28px;height:28px;border:none!important;box-shadow:none!important;outline:none;background:transparent;margin:0;padding:0;" loading="lazy" decoding="async" />
    <span>Generate PaCEr</span>
  </button>
</form>

<!-- Loading State -->
<div id="loadingDiv" class="loading-container" style="display:none;">
    <div class="loading-spinner"></div>
    <div class="loading-text">Generating your PaCE report using CAF competency framework...<br>Make sure to tone it down a notch. You aren't a god. Yet...</div>
</div>

<!-- Error State -->
<div id="errorDiv" class="error-container" style="display:none;"></div>

<!-- Result Container -->
<div id="resultDiv" style="display: none;">
  <h3 style="color: #ff6b35; margin-bottom: 20px;">PaCEr</h3>
  <div id="resultContent"></div>
  <div class="result-actions">
    <button class="copy-btn" onclick="copyResult(event)">📋 Copy</button>
    <button class="download-btn" onclick="downloadResult('markdown')">📄 MD</button>
    <button class="download-btn-alt" onclick="downloadResult('html')">🌐 HTML</button>
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
      <h3>🔗 Reference Links </h3>
      <button class="modal-close" onclick="closeReferencesModal()">&times;</button>
    </div>
    <div class="modal-body" style="padding:16px;">
      <style>
        /* layout: stack on small, two-column on wide */
        .reference-links { display:block; gap:24px; }
        @media (min-width:900px) {
          .reference-links { display:flex; align-items:flex-start; }
          .reference-links .downloads { margin-left:auto; width:320px; }
        }
        /* remove bullets and control indents */
        .reference-links ul { list-style:none; margin:0 0 12px 0; padding:0; }
        .reference-links ul ul { margin-left:20px; padding-left:0; list-style:none; }
        .reference-links li { margin:6px 0; }
        /* keep inline-flex anchors consistent */
        .reference-links a { display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
        .chatgpt-logo { display:inline-block; margin-right:6px; }
        /* align downloads content right */
        .reference-links .downloads { text-align:right; }
        .reference-links .downloads ul { padding-right:0; }
        .reference-links .downloads a { justify-content:flex-end; }
      </style>
      <div class="reference-links">
        <div class="links" style="flex:1;">
          <ul>
            <li>
              <a href="https://chatgpt.com/g/g-67ec6a02d44c8191a150cc65560a15c0-unofficial-caf-pace-competency-analyst-3-0"
                 target="_blank" rel="noopener noreferrer">
                <span class="chatgpt-logo" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
                    <circle cx="32" cy="32" r="30" fill="#10a37f" />
                    <g fill="#ffffff" stroke="none">
                      <polygon points="28,28 36,28 38,34 36,38 28,38 26,34" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" transform="rotate(60 32 32)" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" transform="rotate(120 32 32)" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" transform="rotate(180 32 32)" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" transform="rotate(240 32 32)" />
                      <ellipse cx="32" cy="14" rx="5" ry="9" transform="rotate(300 32 32)" />
                    </g>
                  </svg>
                </span>
                <span>ChatGPT - Unofficial CAF PaCE Competency</span><br>
              </a>
            </li><br>
            <li>
              <a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp" target="_blank" rel="noopener noreferrer">🔗 Official - PaCE Resources</a>
              <ul>
                <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/pace-user-guide.pdf" target="_blank" rel="noopener noreferrer">⬇️ User Guide</a></li>
                <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/pace-manager-technical-manual.pdf" target="_blank" rel="noopener noreferrer">⬇️ Manager Manual </a></li>
                <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/performance-appraisal-par-writing-guidelines.pdf" target="_blank" rel="noopener noreferrer">⬇️ PAR Guidelines</a></li>
              </ul>
            </li>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/policies-standards/canadian-forces-military-personnel-instructions/performance-and-competency-evaluation-pace.html" target="_blank" rel="noopener noreferrer">🔗 CAF Personnel Instruction</a></li>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/policies-standards/defence-administrative-orders-directives.html" target="_blank" rel="noopener noreferrer">🔗 DAOD - 5002</a></li>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/policies-standards/canadian-forces-military-personnel-instructions/inclusion-and-the-performance-appraisal-process/canadian-armed-forces-military-personnel-instruction-03-21-annexes-inclusion-and-the-performance-appraisal-process.html#annc" target="_blank" rel="noopener noreferrer">🔗 Inclusive Behaviours Framework</a></li>
            <br>
            <li><a href="https://www.canada.ca/en/department-national-defence/corporate/video/other/2024/03-01-pace.html" target="_blank" rel="noopener noreferrer">📽️ PaCE Video - PaCE Turns One!</a></li>
          </ul>
        </div><br>
        <div class="downloads" style="min-width:260px;">
          <h3 style="margin:0 0 8px 20px; font-size:14px;">Additional Downloads</h3>
          <ul>
            <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp" alt="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/quick-reference-card-members.pdf">⬇️ Quick Ref - Members</a></li>
            <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp" alt="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/quick-reference-card-supervisors.pdf">⬇️ Quick Ref - Supervisors</a></li>
            <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp">⬇️ PaCE Cycle Aide</a></li>
            <li><a href="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/training-documentation.asp" alt="http://www.cmp-cpm.forces.gc.ca/pace-epc/en/understanding-the-ibr-mieux-comprendre-la-cci-bil.pdf" >⬇️ Understanding IBR</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Shared components already loaded in head.html -->
