---
title: "NIST NICE Framework Position Mapper"
subtitle: "Generate Job Descriptions from NICE Framework"
description: "Create comprehensive cybersecurity job descriptions based on NIST NICE Framework components and the 11 Strategies of a World-Class SOC."
keywords: ["nist nice framework", "cybersecurity job description", "workforce framework", "job role mapper", "soc strategies"]
date: 2025-11-25
lastmod: 2025-12-14
draft: false
tags: ["Core Services", "Cybersecurity", "NIST", "Workforce", "Job Descriptions"]
categories: ["AI Tools"]
type: ai-tools
seo_title: "Free NIST NICE Framework Job Description Generator"
canonical: "/ai-tools/core-services/nist-nice-framework/"
featured_image: "/images/featured/aitools/nist-nice-framework.png"
sitemap_priority: 0.8
sitemap_changefreq: "monthly"

# AI Tool Result Section (used by layouts/partials/ai-tools/result-section.html)
result_title: "Generated Result"
loading_text: "Generating..."
---

<link rel="stylesheet" href="nist-nice-framework.css">

# 🎯 NIST NICE Framework Position Mapper

Generate comprehensive cybersecurity job descriptions based on the **NIST NICE Workforce Framework (SP 800-181 Rev 1)** and the **11 Strategies of a World-Class Cybersecurity Operations Center**.

<div class="tool-info">
  <p>📋 This tool maps job titles to relevant NIST NICE Framework components (Skills, Knowledge, Tasks) and generates professional job descriptions incorporating SOC best practices.</p>
</div>

<form id="nistForm">
  <div class="form-group">
    <label for="jobTitle">Job Title *</label>
    <input type="text" id="jobTitle" placeholder="e.g., SOC Analyst, Cybersecurity Architect, Incident Responder" required>
    <small>Enter the position title you want to create a job description for</small>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="jobTier">Job Tier/Level</label>
      <select id="jobTier">
        <option value="">None specified</option>
        <option value="Entry">Entry Level / Junior</option>
        <option value="Mid">Mid-Level / Intermediate</option>
        <option value="Senior">Senior / Expert</option>
        <option value="Lead">Lead / Principal</option>
        <option value="Manager">Manager / Supervisor</option>
        <option value="Director">Director / Executive</option>
      </select>
      <small>Select experience level to adjust requirements</small>
    </div>
    <div class="form-group">
      <label for="workRole">Work Role (Optional)</label>
      <select id="workRole">
        <option value="">Auto-detect from job title</option>
        <optgroup label="Cybersecurity Operations">
          <option value="PR-CDA-001">Cyber Defense Analyst</option>
          <option value="PR-CIR-001">Cyber Defense Incident Responder</option>
          <option value="PR-INF-001">Cyber Defense Infrastructure Support Specialist</option>
          <option value="AN-TWA-001">Threat/Warning Analyst</option>
          <option value="AN-EXP-001">Exploitation Analyst</option>
        </optgroup>
        <optgroup label="Oversight & Governance">
          <option value="OG-WRL-001">Communications Security (COMSEC) Management</option>
          <option value="OG-WRL-002">Cybersecurity Policy and Planning</option>
          <option value="OG-WRL-007">Executive Cybersecurity Leadership</option>
          <option value="OG-WRL-012">Security Control Assessment</option>
          <option value="OG-WRL-014">Systems Security Management</option>
        </optgroup>
        <optgroup label="Design & Development">
          <option value="DD-WRL-001">Cybersecurity Architecture</option>
          <option value="DD-WRL-002">Enterprise Architecture</option>
          <option value="DD-WRL-003">Secure Software Development</option>
          <option value="DD-WRL-004">Secure Systems Development</option>
          <option value="DD-WRL-005">Software Security Assessment</option>
        </optgroup>
        <optgroup label="Analyze">
          <option value="AN-ASA-001">All-Source Analyst</option>
          <option value="AN-EXP-001">Exploitation Analyst</option>
          <option value="AN-TGT-001">Target Analyst</option>
          <option value="AN-TWA-001">Threat/Warning Analyst</option>
        </optgroup>
      </select>
      <small>Select a specific NIST work role or let the tool auto-detect based on title</small>
    </div>
  </div>

  <div class="slider-container">
    <div class="slider-group">
      <label for="skillsCount">
        Number of Skills: <span id="skillsValue">5</span>
      </label>
      <input type="range" id="skillsCount" min="0" max="50" value="5" class="slider">
      <small>Skills: Practical abilities required for the position</small>
    </div>
    <div class="slider-group">
      <label for="knowledgeCount">
        Number of Knowledge Areas: <span id="knowledgeValue">5</span>
      </label>
      <input type="range" id="knowledgeCount" min="0" max="50" value="5" class="slider">
      <small>Knowledge: Understanding of concepts, facts, or procedures</small>
    </div>
    <div class="slider-group">
      <label for="tasksCount">
        Number of Tasks: <span id="tasksValue">5</span>
      </label>
      <input type="range" id="tasksCount" min="0" max="50" value="5" class="slider">
      <small>Tasks: Specific work activities and responsibilities</small>
    </div>
  </div>

  <div style="margin-top: 15px;">
    <label class="checkbox-inline">
      <input type="checkbox" id="outputFormat">
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">📄 Output Format: <span id="formatLabel">Role Definition</span></span>
      <span class="toggle-helper">Switches between Role Definition and Job Advertisement.</span>
    </label>
    <small style="display: block; margin-left: 54px; margin-top: 5px; color: #b3b3bd;">Toggle between Role Definition (for current employees) and Job Advertisement (for hiring)</small>
  </div>

  <div style="margin-top: 15px;">
    <label class="checkbox-inline">
    <input type="checkbox" id="includeSOC" checked>
    <span class="toggle-switch"><span class="toggle-slider"></span></span>
    <span class="toggle-label">
        📋 Include <a href="https://www.mitre.org/sites/default/files/2022-04/11-strategies-of-a-world-class-cybersecurity-operations-center.pdf" target="_blank" rel="noopener">11 SOC Strategies</a>
    </span>
    <span class="toggle-helper">Incorporates MITRE SOC best practices.</span>
    </label>
    <small style="display: block; margin-left: 54px; margin-top: 5px; color: #b3b3bd;">Incorporate best practices from MITRE's SOC strategies document</small>
  </div>

  <div style="margin-top: 15px;">
    <label class="checkbox-inline">
      <input type="checkbox" id="useAI">
      <span class="toggle-switch"><span class="toggle-slider"></span></span>
      <span class="toggle-label">🤖 Enhance with AI</span>
      <span class="toggle-helper">Customizes output using AI enhancement.</span>
    </label>
    <small style="display: block; margin-left: 54px; margin-top: 5px; color: #b3b3bd;">Use AI to customize and refine the output based on format and tier level</small>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" id="generateBtn">
      <span class="btn-icon">🎯</span> Generate Role Description
    </button>
    <button type="button" class="btn-secondary" id="resetBtn">Reset</button>
  </div>
</form>
