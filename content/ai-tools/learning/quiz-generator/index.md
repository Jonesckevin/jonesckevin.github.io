---
title: "Interactive Quiz Generator"
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


<link rel="stylesheet" href="quiz-generator.css">
<main class="main-content">
<div class="quiz-container">
<h1 style="text-align: center; margin-bottom: 30px; color: #ff6b35;">Interactive Learning Quiz Generator</h1>
<p style="text-align: center; margin-bottom: 40px; opacity: 0.9;">
                Test your knowledge across educational topics with AI-generated quizzes. Track your progress 
                and improve your understanding.
            </p>
<!-- Setup Form -->
<div class="form-container" id="setupForm">
<div class="form-group">
<label for="topicSelect">Select Quiz Topic *</label>
<select id="topicSelect" required="" onchange="toggleCustomTopic()">
<option value="">Choose a topic...</option>
<option value="computers-tech-cybersecurity">Computers, Technology &amp; Cyber Security</option>
<option value="mathematics">Mathematics</option>
<option value="world-history">World History</option>
<option value="environmental-science">Environmental Science</option>
<option value="english-language">English Language</option>
<option value="space-astronomy">Space &amp; Astronomy</option>
<option value="human-anatomy">Human Anatomy</option>
<option value="programming-fundamentals">Programming Fundamentals</option>
<option value="economics">Economics</option>
<option value="art-culture">Art &amp; Culture</option>
<option value="global-current-events">Global Current Events</option>
<option value="custom">Custom Topic</option>
</select>
</div>
<div class="form-group" id="customTopicGroup" style="display: none;">
<label for="customTopic">Enter Custom Topic *</label>
<input id="customTopic" placeholder="Enter your custom quiz topic" type="text"/>
</div>
<div class="form-group">
<label for="difficultySelect">Difficulty Level: <span id="difficultyDisplay">University (7)</span></label>
<input type="range" id="difficultySelect" min="1" max="10" value="7" oninput="updateDifficultyDisplay(this.value)" onchange="updateDifficultyDisplay(this.value)"/>
<div style="display: flex; justify-content: space-between; font-size: 0.8em; color: rgba(255,255,255,0.6); margin-top: 5px;">
<span>Elementary</span>
<span>High School</span>
<span>College</span>
<span>University</span>
<span>PhD</span>
</div>
</div>
<div class="form-group">
<label for="questionCount">Number of Questions: <span id="questionCountDisplay">10</span></label>
<input type="range" id="questionCount" min="1" max="100" value="10" oninput="updateQuestionCount(this.value)"/>
<div style="display: flex; justify-content: space-between; font-size: 0.8em; color: rgba(255,255,255,0.6); margin-top: 5px;">
<span>1</span>
<span>50</span>
<span>100</span>
</div>
</div>
<button class="btn-primary" onclick="startQuiz()">Start Quiz</button>
</div>
<!-- Quiz Interface -->
<div id="quizInterface" style="display: none;">
<div class="progress-bar">
<div class="progress-fill" id="progressFill"></div>
</div>
<div style="text-align: center; margin-bottom: 30px; color: #ff6b35; font-weight: bold;">
                    Question <span id="currentQuestion">1</span> of <span id="totalQuestions">10</span>
                </div>
<div class="question-container">
<div class="question-text" id="questionText">Loading question...</div>
<div id="answerOptions"></div>
<button class="btn-primary" id="nextButton" onclick="nextQuestion()" style="margin-top: 20px; display: none;">Next Question</button>
</div>
</div>
<!-- Results Interface -->
<div id="resultsInterface" style="display: none;">
<div class="quiz-results">
<h2 style="color: #ff6b35; margin-bottom: 20px;">Quiz Complete!</h2>
<div class="score-display" id="scoreDisplay">0/10</div>
<div id="resultsDetails"></div>
<div style="margin-top: 30px; gap: 15px; display: flex; justify-content: center; flex-wrap: wrap;">
<button class="btn-primary" onclick="retakeQuiz()" style="width: auto; padding: 10px 20px;">Retake Quiz</button>
<button class="btn-primary" onclick="newTopic()" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #666, #888);">Try New Topic</button>
<button class="btn-primary" onclick="copyQuizResults()" style="width: auto; padding: 10px 20px;">📋 Copy to Clipboard</button>
<button class="btn-primary" onclick="downloadQuizResults('markdown')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #28a745, #34ce57);">📄 Download Markdown</button>
<button class="btn-primary" onclick="downloadQuizResults('html')" style="width: auto; padding: 10px 20px; background: linear-gradient(135deg, #17a2b8, #20c997);">🌐 Download HTML</button>
</div>
</div>
</div>
<div class="loading" id="loadingDiv" style="display: none;">
                Generating quiz questions...
            </div>
<div id="errorDiv" style="display: none;"></div>
</div>
</main>

<script src="quiz-generator.js"></script>


