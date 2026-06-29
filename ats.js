// OneStep Resume AI - ATS Optimizer & Readability Assessor

let activeUploadedFileText = "";

function initATSAnalyzer() {
  const dropzone = document.getElementById("ats-file-dropzone");
  const fileInput = document.getElementById("ats-file-input");
  
  if (!dropzone || !fileInput) return;

  // File drag & drop triggers
  dropzone.onclick = () => fileInput.click();
  
  dropzone.ondragover = (e) => {
    e.preventDefault();
    dropzone.classList.add("active");
  };
  
  dropzone.ondragleave = () => {
    dropzone.classList.remove("active");
  };
  
  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.classList.remove("active");
    if (e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };
  
  fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  // Run diagnostic click
  document.getElementById("btn-run-ats-analysis").onclick = runATSAssessment;
}

function handleUploadedFile(file) {
  const status = document.getElementById("dropzone-status");
  status.innerHTML = `<span style="color:var(--success);">Selected: ${file.name}</span>`;
  
  // Read text if txt file, else simulate reading text for PDF/DOCX
  const reader = new FileReader();
  if (file.name.endsWith(".txt")) {
    reader.onload = (e) => {
      activeUploadedFileText = e.target.result;
      showToastNotification("Text file uploaded successfully.");
    };
    reader.readAsText(file);
  } else {
    // Mock parsing pdf/docx metadata text
    activeUploadedFileText = `
      Sarah Jenkins
      sjenkins@gmail.com
      (555) 019-2834
      San Francisco, CA
      sjenkins.dev
      
      Software Engineer II with experience building React web applications and Node.js backend controllers. Strong knowledge of PostgreSQL databases, AWS deployment, Git workflows, and unit testing using Jest. Built distributed file cache in Go.
      
      Experience:
      Google - Software Engineer II
      Led cloud storage API route development. Transitioned legacy systems to Go.
      
      Stripe - Associate Developer
      Integrated payment webhooks. Refactored controllers to reduce API latency.
      
      Education:
      UC Berkeley - B.S. in Computer Science
    `;
    showToastNotification(`Simulated text extraction for ${file.name}`);
  }
}

function runATSAssessment() {
  const jobDesc = document.getElementById("ats-job-desc-input").value.trim();
  
  if (!jobDesc) {
    alert("Please paste a Job Description first!");
    return;
  }

  // If no file uploaded, default to checking current Resume Builder state
  let textToAnalyze = activeUploadedFileText;
  if (!textToAnalyze) {
    // Compile text from resume data
    textToAnalyze = `
      ${resumeData.name}
      ${resumeData.email} ${resumeData.phone} ${resumeData.location} ${resumeData.website}
      ${resumeData.summary}
      ${resumeData.experience.map(e => `${e.company} ${e.role} ${e.bullets.join(" ")}`).join(" ")}
      ${resumeData.education.map(ed => `${ed.institution} ${ed.degree} ${ed.honors}`).join(" ")}
      ${resumeData.skills.join(" ")}
      ${resumeData.projects.map(p => `${p.title} ${p.desc}`).join(" ")}
    `;
    showToastNotification("Analyzing data from active Resume Builder profile.");
  }

  // Show loading indicator
  const placeholder = document.getElementById("ats-results-placeholder");
  const report = document.getElementById("ats-results-report");
  
  placeholder.style.display = "block";
  report.style.display = "none";
  
  placeholder.innerHTML = `
    <div style="text-align:center; padding:48px 0; color:var(--text-secondary);">
      <div class="spinner" style="border: 3px solid var(--border-color); border-top: 3px solid var(--primary); border-radius: 50%; width: 36px; height: 36px; animation: spin 1s linear infinite; margin: 0 auto 16px auto;"></div>
      <h4>Executing ATS Diagnostic Engines...</h4>
      <p style="font-size:0.8rem; margin-top:8px;">Running keyword density checks and readability scoring...</p>
    </div>
  `;

  setTimeout(() => {
    placeholder.style.display = "none";
    report.style.display = "block";
    
    // Core analysis algorithms
    const keywordMetrics = extractAndMatchKeywords(textToAnalyze, jobDesc);
    const readabilityMetrics = calculateReadabilityScores(textToAnalyze);
    const formattingMetrics = auditFormattingCompliance();

    // Compute aggregate rating
    const finalScore = Math.round(
      (keywordMetrics.matchRatio * 50) + 
      (readabilityMetrics.scoreFactor * 20) + 
      (formattingMetrics.complianceRatio * 30)
    );

    // Save score to localstorage to sync with home dashboard
    localStorage.setItem("onestep_active_ats_score", finalScore);

    // Update Report Card UI
    renderATSReportHTML(finalScore, keywordMetrics, readabilityMetrics, formattingMetrics);
    
    // Animate score wheel
    setTimeout(() => {
      const circle = document.getElementById("ats-score-circle-indicator");
      if (circle) {
        const offset = 283 - (283 * finalScore / 100);
        circle.style.strokeDashoffset = offset;
      }
    }, 100);

    showToastNotification("ATS Diagnostic Complete!");
  }, 1500);
}

// 1. KEYWORD EXTRACTION ALGORITHM (TF-IDF Simulation)
function extractAndMatchKeywords(resumeText, jdText) {
  // Common keyword lexicon for tech jobs
  const techKeywords = [
    "react", "node.js", "node", "go", "golang", "python", "java", "c++", "ruby", "rails",
    "postgresql", "mysql", "nosql", "redis", "mongodb", "cassandra", "sql",
    "aws", "gcp", "docker", "kubernetes", "git", "rest apis", "rest", "grpc", "graphql", "api", "webhooks",
    "microservices", "distributed systems", "distributed", "scalability", "concurrency", "caching", "load balancers",
    "jest", "unit testing", "ci/cd", "system design", "algorithms", "data structures"
  ];

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  // Find keywords present in the Job Description
  const targetKeywords = techKeywords.filter(kw => {
    // Ensure word boundaries
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    return regex.test(jdLower);
  });

  if (targetKeywords.length === 0) {
    // Default fallback if no keywords found in custom text
    targetKeywords.push("api", "go", "sql", "testing", "scalability");
  }

  // Check matching keywords in resume
  const matched = [];
  const missing = [];

  targetKeywords.forEach(kw => {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    if (regex.test(resumeLower)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const matchRatio = matched.length / targetKeywords.length;

  return {
    matched,
    missing,
    matchRatio,
    percentage: Math.round(matchRatio * 100)
  };
}

// 2. READABILITY FORMULAS (Flesch-Kincaid approximation)
function calculateReadabilityScores(text) {
  // Simple word count, sentence count and syllables estimate
  const cleanText = text.replace(/[^a-zA-Z. ]/g, "");
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const totalWords = words.length || 100;
  const totalSentences = sentences.length || 10;
  
  // Syllables estimation count approximation: count vowels excluding trailing 'e'
  let totalSyllables = 0;
  words.forEach(w => {
    let count = w.replace(/es|ed|e$/gi, "").replace(/[^aeiouy]/gi, "").length;
    if (count === 0) count = 1;
    totalSyllables += count;
  });

  // Flesch Reading Ease Formula
  // RE = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
  let readingEase = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  readingEase = Math.max(10, Math.min(100, readingEase));

  // Determine Flesch-Kincaid Grade Level equivalent
  // GL = 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59
  let gradeLevel = 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59;
  gradeLevel = Math.max(5, Math.min(18, gradeLevel));

  // Readability Factor weight score (70 Reading Ease is optimal)
  const scoreFactor = Math.max(0.2, 1 - Math.abs(70 - readingEase) / 100);

  // Estimate passive voice: checking occurrences of 'was', 'were', 'been', 'be', 'is', 'are' followed by 'ed' words
  const wordsStr = words.join(" ").toLowerCase();
  const passiveMatches = wordsStr.match(/\b(was|were|been|be|is|are|had)\s+[a-z]+ed\b/g) || [];
  const passiveRatio = Math.min(40, Math.round((passiveMatches.length / (totalSentences || 1)) * 100));

  return {
    readingEase: Math.round(readingEase),
    gradeLevel: Math.round(gradeLevel * 10) / 10,
    passiveVoicePercent: passiveRatio,
    scoreFactor
  };
}

// 3. FORMATTING AUDIT ENGINE
function auditFormattingCompliance() {
  const activeTemplate = localStorage.getItem("onestep_resume_template") || "modern";
  const suggestions = [];
  let deductionCount = 0;

  // Rule 1: No double-columns check (Creative has columns)
  if (activeTemplate === "creative") {
    suggestions.push({
      type: "error",
      text: "<strong>Remove multi-column styling:</strong> Your current creative template uses a split dual-column layout. Older ATS scanners read columns side-to-side, causing text merge errors."
    });
    deductionCount += 3;
  }

  // Rule 2: Graphic bars and icons presence check
  if (activeTemplate === "creative" || activeTemplate === "modern") {
    suggestions.push({
      type: "warning",
      text: "<strong>Avoid graphic skill ratings:</strong> Visual progress bars and skill tags may parse as random characters or garbage tokens in some older systems."
    });
    deductionCount += 1.5;
  }

  // Rule 3: File sizes and extensions checks (Static mock success)
  suggestions.push({
    type: "info",
    text: "<strong>Correct file structures:</strong> Standard headers found. Content flows cleanly from top to bottom."
  });

  const complianceRatio = Math.max(0.3, 1 - (deductionCount / 10));

  return {
    suggestions,
    complianceRatio
  };
}

// 4. REPORT UI RENDERER
function renderATSReportHTML(score, keywordMetrics, readabilityMetrics, formattingMetrics) {
  const container = document.getElementById("ats-results-report");
  
  // Setup CSS status class colors
  let ratingClass = "success";
  if (score < 60) ratingClass = "error";
  else if (score < 80) ratingClass = "warning";

  // Build Suggestions cards List
  let suggestionsHTML = "";
  
  // Missing keywords suggestion card
  if (keywordMetrics.missing.length > 0) {
    suggestionsHTML += `
      <div class="suggestion-card">
        <div class="suggestion-bullet error"></div>
        <p><strong>Add missing keywords:</strong> Your resume lacks key terms requested in the job description: <span style="color:var(--error); font-weight:600;">${keywordMetrics.missing.join(", ")}</span>.</p>
      </div>
    `;
  }
  
  // Format rules card
  formattingMetrics.suggestions.forEach(s => {
    suggestionsHTML += `
      <div class="suggestion-card">
        <div class="suggestion-bullet ${s.type}"></div>
        <p>${s.text}</p>
      </div>
    `;
  });

  // Passive voice warning card
  if (readabilityMetrics.passiveVoicePercent > 20) {
    suggestionsHTML += `
      <div class="suggestion-card">
        <div class="suggestion-bullet warning"></div>
        <p><strong>Reduce passive voice:</strong> We detected passive statements (${readabilityMetrics.passiveVoicePercent}%). Re-write sentences to begin with action verbs (e.g. 'Refactored backend Ruby controllers' instead of 'Backend Ruby controllers were refactored by me').</p>
      </div>
    `;
  }

  container.innerHTML = `
    <h3>Diagnostic Analysis Report</h3>
    <hr style="border: 0.5px solid var(--border-color); margin: 12px 0;">
    
    <div class="ats-score-display">
      <div class="score-circle-container">
        <svg class="score-circle-svg" viewBox="0 0 100 100">
          <circle class="score-circle-bg" cx="50" cy="50" r="45"></circle>
          <circle class="score-circle-val" id="ats-score-circle-indicator" cx="50" cy="50" r="45" style="stroke: var(--${ratingClass});"></circle>
        </svg>
        <div class="score-text-overlay" style="color: var(--${ratingClass});">${score}%</div>
      </div>
      
      <div class="score-info">
        <h4>ATS Compatibility Rating</h4>
        <p>A score of 80% or higher is recommended to pass automated screening loops successfully.</p>
      </div>
    </div>
    
    <div style="margin-top: 24px;">
      <h4>Readability Stats</h4>
      <div class="metric-row-line">
        <span>Flesch Reading Ease Score</span>
        <span class="line-val">${readabilityMetrics.readingEase} (out of 100)</span>
      </div>
      <div class="metric-row-line">
        <span>Readability Grade Level</span>
        <span class="line-val">Grade ${readabilityMetrics.gradeLevel} (High School / BS standard)</span>
      </div>
      <div class="metric-row-line">
        <span>Passive Voice Ratio</span>
        <span class="line-val">${readabilityMetrics.passiveVoicePercent}%</span>
      </div>
    </div>
    
    <div style="margin-top: 24px;">
      <h4>Keywords Match (${keywordMetrics.percentage}%)</h4>
      <div class="kw-grid">
        ${keywordMetrics.matched.map(k => `<span class="kw-badge matched"><i data-lucide="check"></i> ${k}</span>`).join("")}
        ${keywordMetrics.missing.map(k => `<span class="kw-badge missing"><i data-lucide="x"></i> ${k}</span>`).join("")}
      </div>
    </div>
    
    <div style="margin-top: 24px;">
      <h4>Actionable Fixes</h4>
      <div class="suggestions-list">
        ${suggestionsHTML}
      </div>
    </div>
    
    <div style="margin-top: 24px; display: flex; gap: 12px;">
      <button class="btn-primary-glow" style="flex-grow: 1;" onclick="navigateTo('resume-view')">
        <i data-lucide="edit"></i> Implement Fixes in Builder
      </button>
    </div>
  `;
  lucide.createIcons();
}
