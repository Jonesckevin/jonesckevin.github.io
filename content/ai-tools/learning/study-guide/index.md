---
title: "Study Guide Generator"
subtitle: "AI-Powered Tool"
author: JonesCKevin
date: 2025-09-13
tags:
- AI
- Tools
- Learning
- Productivity
type: ai-tools
---


<link rel="stylesheet" href="study-guide.css">
<main class="main-content">
<div class="form-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">AI Study Guide Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
                Transform your course material into comprehensive study guides. Create structured learning aids 
                with summaries, key concepts, practice questions, and memory techniques.
            </p>
<div class="form-group">
<label for="subject">Subject/Course *</label>
<input id="subject" placeholder="e.g., Biology 101, World History, Calculus, etc." required="" type="text"/>
</div>
<div class="form-group">
<label for="studyContent">Course Content/Material *</label>
<textarea id="studyContent" placeholder="Paste your course material, lecture notes, textbook chapters, or any content you want to study. The more detailed, the better the study guide." required="" rows="8"></textarea>
</div>
<div class="form-group">
<label for="studyLevel">Academic Level</label>
<select id="studyLevel">
<option value="high-school">High School</option>
<option value="undergraduate">Undergraduate</option>
<option value="graduate">Graduate</option>
<option value="professional">Professional/Certification</option>
</select>
</div>
<div class="form-group">
<label for="guideType">Study Guide Type</label>
<select id="guideType">
<option value="comprehensive">Comprehensive Review</option>
<option value="exam-prep">Exam Preparation</option>
<option value="quick-reference">Quick Reference</option>
<option value="concept-map">Concept Mapping</option>
<option value="practice-focused">Practice-Focused</option>
</select>
</div>
<div class="form-group">
<label for="includeQuestions">Include Practice Elements</label>
<div class="checkbox-group">
<div class="checkbox-row">
<label class="checkbox-inline"><input checked="" id="includeQuizzes" type="checkbox"/> Practice Questions</label>
<label class="checkbox-inline"><input checked="" id="includeFlashcards" type="checkbox"/> Flashcard Terms</label>
<label class="checkbox-inline"><input id="includeMnemonics" type="checkbox"/> Memory Techniques</label>
</div>
</div>
</div>
<div class="form-group">
<label for="focusAreas">Specific Focus Areas (Optional)</label>
<textarea id="focusAreas" placeholder="List specific topics, chapters, or concepts you want to emphasize in the study guide" rows="3"></textarea>
</div>
<button class="btn-primary" onclick="generateStudyGuide()">Generate Study Guide</button>
</div>
<div class="loading" id="loadingDiv" style="display: none;">
            Creating your personalized study guide...
        </div>
<div id="errorDiv" style="display: none;"></div>
<div id="resultDiv" style="display: none;">
<h3 style="color: #ff6b35; margin-bottom: 20px;">Your Study Guide</h3>
<div class="result-content" id="resultContent"></div>
<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="copyResult()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadResult('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="downloadResult('html')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #17a2b8, #20c997);">🌐 Download HTML</button>
<button class="btn-primary" onclick="generateNew()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">🔄 Generate New</button>
</div>
</div>
</main>

<script src="study-guide.js"></script>



