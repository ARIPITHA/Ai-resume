// OneStep Resume AI - Resume Builder State & Template Engine

let resumeData = {
  name: "Sarah Jenkins",
  email: "sjenkins@gmail.com",
  phone: "(555) 019-2834",
  location: "San Francisco, CA",
  website: "sjenkins.dev",
  summary: "Results-oriented Software Engineer with 3+ years of experience designing and scaling web services, microservices architectures, and relational schemas. Passionate about developer workflows and codebase craftsmanship.",
  experience: [
    {
      id: "exp1",
      company: "Google",
      role: "Software Engineer II",
      duration: "2024 - Present",
      bullets: [
        "Led engineering for critical Google Cloud storage API routes, improving peak network write capacity by 35%.",
        "Collaborated with cross-functional infrastructure teams to transition legacy Java pipelines to high-performance Go routines, reducing database CPU load by 25%.",
        "Mentored 3 junior developers and established code review guidelines for continuous deployment."
      ]
    },
    {
      id: "exp2",
      company: "Stripe",
      role: "Associate Developer",
      duration: "2022 - 2024",
      bullets: [
        "Integrated third-party payment gateways and webhooks, resolving concurrency race conditions and ensuring 99.99% payment integrity.",
        "Refactored backend Ruby controllers and implemented Redis caching, lowering average API endpoint response latency from 680ms to 240ms."
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "UC Berkeley",
      degree: "B.S. in Computer Science",
      duration: "2018 - 2022",
      honors: "GPA: 3.82, Regents Scholar"
    }
  ],
  skills: ["React", "Node.js", "Go", "PostgreSQL", "AWS", "Git", "REST APIs", "Jest", "Docker", "System Design"],
  projects: [
    {
      id: "proj1",
      title: "Distributed File Cache",
      desc: "Developed a fault-tolerant distributed memory caching engine in Go, using consistent hashing to partition records across nodes and achieving 15,000 requests/sec throughput.",
      link: "github.com/sjenkins/dist-cache"
    }
  ]
};

// Initialize resume forms
function initResumeBuilder() {
  // Initialize editor tabs
  initEditorTabs();
  
  // Initialize template browser
  initTemplateBrowser();
  
  // Initialize color palette
  initColorPalette();
  
  // Initialize layout controls
  initLayoutControls();
  
  // Initialize section manager
  initSectionManager();

  // Initialize preview zoom controls
  initPreviewZoomControls();

  // Load from localstorage if available
  const saved = localStorage.getItem("onestep_resume_data");
  if (saved) {
    try {
      resumeData = JSON.parse(saved);
    } catch(e) {
      console.error("Failed to parse saved resume data.", e);
    }
  }

  // Bind personal contact inputs
  document.getElementById("res-fullname").value = resumeData.name;
  document.getElementById("res-email").value = resumeData.email;
  document.getElementById("res-phone").value = resumeData.phone;
  document.getElementById("res-location").value = resumeData.location;
  document.getElementById("res-website").value = resumeData.website;
  document.getElementById("res-summary").value = resumeData.summary;
  document.getElementById("res-skills-list-val").value = resumeData.skills.join(", ");

  // Bind change events
  const contactInputs = ["res-fullname", "res-email", "res-phone", "res-location", "res-website", "res-summary"];
  contactInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", (e) => {
      const field = id.replace("res-", "");
      let key = field;
      if (field === "fullname") key = "name";
      resumeData[key] = e.target.value;
      saveResumeState();
      renderActiveResume();
    });
  });

  document.getElementById("res-skills-list-val").addEventListener("input", (e) => {
    resumeData.skills = e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
    saveResumeState();
    renderActiveResume();
  });

  // Bind repeater buttons
  document.getElementById("btn-add-experience").onclick = addExperienceRow;
  document.getElementById("btn-add-education").onclick = addEducationRow;
  document.getElementById("btn-add-project").onclick = addProjectRow;

  document.getElementById("btn-reset-resume").onclick = () => {
    if (confirm("Are you sure you want to reset the resume to default? This will clear custom edits.")) {
      localStorage.removeItem("onestep_resume_data");
      location.reload();
    }
  };

  // Render arrays
  renderExperienceFormList();
  renderEducationFormList();
  renderProjectsFormList();

  // Template select
  document.getElementById("template-selector").onchange = (e) => {
    const paper = document.getElementById("resume-paper-target");
    paper.className = `resume-paper template-${e.target.value}`;
    localStorage.setItem("onestep_resume_template", e.target.value);
    renderActiveResume();
  };

  const savedTemplate = localStorage.getItem("onestep_resume_template");
  if (savedTemplate) {
    document.getElementById("template-selector").value = savedTemplate;
    document.getElementById("resume-paper-target").className = `resume-paper template-${savedTemplate}`;
  }

  // Collapsible accordion triggers
  const collapsibleHeaders = document.querySelectorAll(".collapsible-header");
  collapsibleHeaders.forEach(header => {
    header.onclick = () => {
      const section = header.parentElement;
      const body = section.querySelector(".collapsible-body");
      
      if (section.classList.contains("active")) {
        // Collapse
        body.style.maxHeight = body.scrollHeight + "px";
        requestAnimationFrame(() => {
          body.style.maxHeight = "0";
        });
        section.classList.remove("active");
      } else {
        // Expand
        section.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px";
        requestAnimationFrame(() => {
          body.style.maxHeight = "none";
        });
      }
    };
  });

  // Export events
  document.getElementById("btn-export-json").onclick = exportResumeJSON;
  document.getElementById("btn-export-docx").onclick = exportResumeDOCX;
  document.getElementById("btn-print-pdf").onclick = () => window.print();

  renderActiveResume();
  // Update AI score panel on load
  setTimeout(updateAIScoreBar, 100);
}

function saveResumeState() {
  localStorage.setItem("onestep_resume_data", JSON.stringify(resumeData));
}

// FORM GENERATOR UTILITIES

function renderExperienceFormList() {
  const container = document.getElementById("res-experience-list");
  container.innerHTML = "";
  resumeData.experience.forEach((exp, idx) => {
    const item = document.createElement("div");
    item.className = "dynamic-list-item";
    item.innerHTML = `
      <button class="btn-remove-item" onclick="removeExperienceRow('${exp.id}')">
        <i data-lucide="trash-2"></i>
      </button>
      <div class="form-group">
        <label>Company</label>
        <input type="text" class="form-control exp-company" data-id="${exp.id}" value="${exp.company}">
      </div>
      <div class="form-group">
        <label>Role</label>
        <input type="text" class="form-control exp-role" data-id="${exp.id}" value="${exp.role}">
      </div>
      <div class="form-group">
        <label>Dates / Duration</label>
        <input type="text" class="form-control exp-duration" data-id="${exp.id}" value="${exp.duration}">
      </div>
      <div class="form-group">
        <label>Achievements & Bullets</label>
        <div class="bullets-edit-list" id="exp-bullets-list-${exp.id}">
          ${exp.bullets.map((b, bidx) => `
            <div class="ai-bullet-wrapper">
              <input type="text" class="form-control exp-bullet-input" data-exp-id="${exp.id}" data-bullet-idx="${bidx}" value="${b}">
              <button class="btn-ai-enhance" onclick="enhanceBulletPoint('${exp.id}', ${bidx})" title="Enhance with AI (Claude)">
                <i data-lucide="sparkles"></i>
              </button>
            </div>
          `).join("")}
        </div>
        <button class="btn-add-repeater" style="margin-top:8px; font-size:0.75rem;" onclick="addExperienceBulletRow('${exp.id}')">
          <i data-lucide="plus"></i> Add Bullet
        </button>
      </div>
    `;
    container.appendChild(item);
  });
  lucide.createIcons();

  // Bind change handlers
  document.querySelectorAll(".exp-company").forEach(el => {
    el.oninput = (e) => {
      const exp = resumeData.experience.find(x => x.id === e.target.dataset.id);
      if (exp) exp.company = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".exp-role").forEach(el => {
    el.oninput = (e) => {
      const exp = resumeData.experience.find(x => x.id === e.target.dataset.id);
      if (exp) exp.role = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".exp-duration").forEach(el => {
    el.oninput = (e) => {
      const exp = resumeData.experience.find(x => x.id === e.target.dataset.id);
      if (exp) exp.duration = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".exp-bullet-input").forEach(el => {
    el.oninput = (e) => {
      const exp = resumeData.experience.find(x => x.id === e.target.dataset.expId);
      if (exp) {
        exp.bullets[parseInt(e.target.dataset.bulletIdx)] = e.target.value;
        saveResumeState();
        renderActiveResume();
      }
    };
  });
}

function renderEducationFormList() {
  const container = document.getElementById("res-education-list");
  container.innerHTML = "";
  resumeData.education.forEach((edu) => {
    const item = document.createElement("div");
    item.className = "dynamic-list-item";
    item.innerHTML = `
      <button class="btn-remove-item" onclick="removeEducationRow('${edu.id}')">
        <i data-lucide="trash-2"></i>
      </button>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" class="form-control edu-inst" data-id="${edu.id}" value="${edu.institution}">
      </div>
      <div class="form-group">
        <label>Degree</label>
        <input type="text" class="form-control edu-degree" data-id="${edu.id}" value="${edu.degree}">
      </div>
      <div class="form-group">
        <label>Dates / Duration</label>
        <input type="text" class="form-control edu-duration" data-id="${edu.id}" value="${edu.duration}">
      </div>
      <div class="form-group">
        <label>Honors / Details (e.g. GPA)</label>
        <input type="text" class="form-control edu-honors" data-id="${edu.id}" value="${edu.honors}">
      </div>
    `;
    container.appendChild(item);
  });
  lucide.createIcons();

  document.querySelectorAll(".edu-inst").forEach(el => {
    el.oninput = (e) => {
      const edu = resumeData.education.find(x => x.id === e.target.dataset.id);
      if (edu) edu.institution = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".edu-degree").forEach(el => {
    el.oninput = (e) => {
      const edu = resumeData.education.find(x => x.id === e.target.dataset.id);
      if (edu) edu.degree = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".edu-duration").forEach(el => {
    el.oninput = (e) => {
      const edu = resumeData.education.find(x => x.id === e.target.dataset.id);
      if (edu) edu.duration = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".edu-honors").forEach(el => {
    el.oninput = (e) => {
      const edu = resumeData.education.find(x => x.id === e.target.dataset.id);
      if (edu) edu.honors = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
}

function renderProjectsFormList() {
  const container = document.getElementById("res-projects-list");
  container.innerHTML = "";
  resumeData.projects.forEach((proj) => {
    const item = document.createElement("div");
    item.className = "dynamic-list-item";
    item.innerHTML = `
      <button class="btn-remove-item" onclick="removeProjectRow('${proj.id}')">
        <i data-lucide="trash-2"></i>
      </button>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="form-control proj-title" data-id="${proj.id}" value="${proj.title}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="form-control proj-desc" data-id="${proj.id}">${proj.desc}</textarea>
      </div>
      <div class="form-group">
        <label>Project Link (GitHub/live)</label>
        <input type="text" class="form-control proj-link" data-id="${proj.id}" value="${proj.link}">
      </div>
    `;
    container.appendChild(item);
  });
  lucide.createIcons();

  document.querySelectorAll(".proj-title").forEach(el => {
    el.oninput = (e) => {
      const proj = resumeData.projects.find(x => x.id === e.target.dataset.id);
      if (proj) proj.title = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".proj-desc").forEach(el => {
    el.oninput = (e) => {
      const proj = resumeData.projects.find(x => x.id === e.target.dataset.id);
      if (proj) proj.desc = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
  document.querySelectorAll(".proj-link").forEach(el => {
    el.oninput = (e) => {
      const proj = resumeData.projects.find(x => x.id === e.target.dataset.id);
      if (proj) proj.link = e.target.value;
      saveResumeState();
      renderActiveResume();
    };
  });
}

// REPEATER ACTIONS

function addExperienceRow() {
  const newId = `exp_${Date.now()}`;
  resumeData.experience.push({
    id: newId,
    company: "New Company",
    role: "New Position",
    duration: "2026 - Present",
    bullets: ["Added a new work bullet point. Click to modify or enhance with AI."]
  });
  saveResumeState();
  renderExperienceFormList();
  renderActiveResume();
}

function removeExperienceRow(id) {
  if (confirm("Remove this work position?")) {
    resumeData.experience = resumeData.experience.filter(x => x.id !== id);
    saveResumeState();
    renderExperienceFormList();
    renderActiveResume();
  }
}

function addExperienceBulletRow(expId) {
  const exp = resumeData.experience.find(x => x.id === expId);
  if (exp) {
    exp.bullets.push("Developed core features yielding measurable positive outcomes.");
    saveResumeState();
    renderExperienceFormList();
    renderActiveResume();
  }
}

function addEducationRow() {
  const newId = `edu_${Date.now()}`;
  resumeData.education.push({
    id: newId,
    institution: "University",
    degree: "Degree Major",
    duration: "2022 - 2026",
    honors: "GPA: 3.5, Honors"
  });
  saveResumeState();
  renderEducationFormList();
  renderActiveResume();
}

function removeEducationRow(id) {
  if (confirm("Remove this education row?")) {
    resumeData.education = resumeData.education.filter(x => x.id !== id);
    saveResumeState();
    renderEducationFormList();
    renderActiveResume();
  }
}

function addProjectRow() {
  const newId = `proj_${Date.now()}`;
  resumeData.projects.push({
    id: newId,
    title: "New Project",
    desc: "Detailed summary of technologies, architecture design and key deliverables of this project.",
    link: "github.com/project"
  });
  saveResumeState();
  renderProjectsFormList();
  renderActiveResume();
}

function removeProjectRow(id) {
  if (confirm("Remove this project row?")) {
    resumeData.projects = resumeData.projects.filter(x => x.id !== id);
    saveResumeState();
    renderProjectsFormList();
    renderActiveResume();
  }
}

// AI BULLET ENHANCEMENT SIMULATION

function enhanceBulletPoint(expId, bulletIdx) {
  const exp = resumeData.experience.find(x => x.id === expId);
  if (!exp) return;
  const originalText = exp.bullets[bulletIdx];
  
  document.getElementById("ai-modal-original").value = originalText;
  
  // Show loading indicator inside target modal
  const variationsBox = document.getElementById("ai-variations-target");
  variationsBox.innerHTML = `
    <div style="text-align:center; padding:24px; color:var(--text-secondary);">
      <div class="spinner" style="border: 3px solid var(--border-color); border-top: 3px solid var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 12px auto;"></div>
      <p style="font-size:0.85rem;">Claude is rewriting bullet point with action verbs and metrics...</p>
    </div>
  `;
  
  document.getElementById("ai-enhance-modal").classList.add("active");
  
  // Generate variations after 1.2s delay
  setTimeout(() => {
    const variations = generateAIVariations(originalText, exp.company);
    variationsBox.innerHTML = variations.map((v, vidx) => `
      <div class="bullet-variation-card" onclick="selectAIVariation('${expId}', ${bulletIdx}, '${v.replace(/'/g, "\\'")}')">
        <strong style="font-size:0.75rem; color:var(--primary); text-transform:uppercase; display:block; margin-bottom:4px;">${vidx === 0 ? 'Metric Enhanced' : vidx === 1 ? 'Action Oriented' : 'Leadership Focused'}</strong>
        <p style="font-size:0.875rem; line-height:1.5;">${v}</p>
      </div>
    `).join("");
  }, 1200);
}

function generateAIVariations(text, company) {
  // Cleans keywords
  const base = text.replace(/[.,]/g, "").toLowerCase();
  
  // Rule-based variation builders to simulate Claude API
  if (base.includes("led") || base.includes("critical") || base.includes("storage")) {
    return [
      "Optimized Google Cloud storage API routes, boosting peak throughput capacity by 35% and reducing request timeout rates from 1.2% to 0.05%.",
      "Architected high-throughput storage endpoints in Google Cloud storage pipeline, supporting active request flows up to 25k requests/sec.",
      "Spearheaded redesign of Google Cloud storage API interfaces, aligning storage protocols across 4 cross-functional development groups."
    ];
  }
  
  if (base.includes("transition") || base.includes("legacy") || base.includes("java")) {
    return [
      "Migrated 14 legacy backend Java microservices to Go, reducing average processing latency by 60% and saving $45k/year in hosting resources.",
      "Re-engineered legacy JVM pipelines into optimized Go executables, dropping database CPU load by 25% under high workloads.",
      "Directed transition of legacy services to modern Go architectures, decreasing technical debt metrics and deployment fail rates."
    ];
  }
  
  if (base.includes("payment") || base.includes("integrity") || base.includes("webhook")) {
    return [
      "Refactored payment gateway endpoint logic to handle parallel webhook delivery, resolving critical locks and securing 99.99% transaction integrity.",
      "Engineered a resilient webhook ingestion queue using Redis, preventing loss of payment confirmations during peak traffic up to 8x load.",
      "Led integration of 4 international banking gateways, expanding available payment endpoints and raising customer checkouts by 14%."
    ];
  }

  // Generics fallback builders
  return [
    `Developed core system enhancements at ${company}, improving query response efficiency by 24% and elevating platform scalability benchmarks.`,
    `Refactored codebase endpoints and database interactions at ${company}, yielding a 30% latency reduction across user-facing pages.`,
    `Spearheaded modular code restructures at ${company}, facilitating team feature onboarding and shaving 10 days off release cycles.`
  ];
}

function selectAIVariation(expId, bulletIdx, value) {
  const exp = resumeData.experience.find(x => x.id === expId);
  if (exp) {
    exp.bullets[bulletIdx] = value;
    saveResumeState();
    renderExperienceFormList();
    renderActiveResume();
    showToastNotification("Bullet point updated successfully!");
    updateAIScoreBar(); // Refresh the score bar after applying AI changes
  }
  document.getElementById("ai-enhance-modal").classList.remove("active");
}

// ===========================================================================
//  AI ASSISTANT PANEL FUNCTIONS
// ===========================================================================

function updateAIScoreBar() {
  // Compute a simple completeness score
  let score = 0;
  if (resumeData.name && resumeData.name.trim()) score += 10;
  if (resumeData.email && resumeData.email.trim()) score += 5;
  if (resumeData.phone && resumeData.phone.trim()) score += 5;
  if (resumeData.location && resumeData.location.trim()) score += 5;
  if (resumeData.website && resumeData.website.trim()) score += 5;
  if (resumeData.summary && resumeData.summary.length > 80) score += 15;
  score += Math.min(25, resumeData.experience.length * 10);
  score += Math.min(10, resumeData.education.length * 5);
  score += Math.min(10, resumeData.skills.length >= 5 ? 10 : resumeData.skills.length * 2);
  score += Math.min(10, resumeData.projects.length * 5);
  score = Math.min(100, score);
  
  const fillBar = document.getElementById("ai-score-fill-bar");
  const fillVal = document.getElementById("ai-score-fill-val");
  const scoreText = document.getElementById("ai-panel-score-text");
  if (fillBar) fillBar.style.width = score + "%";
  if (fillVal) fillVal.textContent = score + "%";
  if (scoreText) scoreText.textContent = `Resume Score: ${score}%`;
  
  return score;
}

function aiGenerateSummary() {
  const btn = document.getElementById("btn-ai-gen-summary");
  btn.disabled = true;
  btn.style.opacity = "0.6";
  showToastNotification("Claude is crafting your professional summary...");

  setTimeout(() => {
    // Build a context-aware summary from the resume data
    const topCompany = resumeData.experience.length > 0 ? resumeData.experience[0].company : "industry-leading companies";
    const topRole = resumeData.experience.length > 0 ? resumeData.experience[0].role : "Software Engineer";
    const skillsList = resumeData.skills.slice(0, 5).join(", ");
    const yearsXp = resumeData.experience.length >= 2 ? "3+" : "1+";
    
    // Select a diverse template based on role/data
    const summaries = [
      `${yearsXp} years of experience as a ${topRole} building production-grade systems at scale. Expert in ${skillsList}. Passionate about solving complex engineering problems with clean, maintainable code and data-driven architectural decisions.`,
      `Results-driven ${topRole} with a track record of delivering high-impact software at ${topCompany} and other top-tier companies. Deep expertise in ${skillsList}. Known for engineering robust distributed systems, mentoring developers, and consistently delivering projects ahead of schedule.`,
      `Full-stack software engineer with ${yearsXp} years delivering performant, scalable solutions. Proven ability to architect microservices, optimize databases, and ship features that meaningfully improve user experience. Technical stack includes ${skillsList}.`
    ];
    
    const chosen = summaries[Math.floor(Math.random() * summaries.length)];
    resumeData.summary = chosen;
    
    const summaryField = document.getElementById("res-summary");
    if (summaryField) {
      summaryField.value = chosen;
      // Animate the textarea briefly
      summaryField.style.borderColor = "var(--primary)";
      summaryField.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)";
      setTimeout(() => {
        summaryField.style.borderColor = "";
        summaryField.style.boxShadow = "";
      }, 1500);
    }
    
    saveResumeState();
    renderActiveResume();
    updateAIScoreBar();
    showToastNotification("✨ Professional summary generated!");
    btn.disabled = false;
    btn.style.opacity = "";
  }, 1400);
}

function aiSuggestSkills() {
  const btn = document.getElementById("btn-ai-suggest-skills");
  btn.disabled = true;
  btn.style.opacity = "0.6";
  showToastNotification("Analyzing role and suggesting high-demand skills...");

  setTimeout(() => {
    // Pool of in-demand skills based on current stack
    const allSkills = ["TypeScript", "GraphQL", "Kubernetes", "Redis", "gRPC", "Terraform", "CI/CD", "System Design", "Docker", "Prometheus", "Kafka", "Elasticsearch", "Next.js", "PostgreSQL", "MongoDB"];
    const existing = resumeData.skills.map(s => s.toLowerCase());
    const suggested = allSkills.filter(s => !existing.includes(s.toLowerCase()));
    const toAdd = suggested.slice(0, 4); // Add up to 4 new skills
    
    if (toAdd.length === 0) {
      showToastNotification("Your skills list is already comprehensive!");
      btn.disabled = false;
      btn.style.opacity = "";
      return;
    }
    
    resumeData.skills = [...resumeData.skills, ...toAdd];
    const skillsField = document.getElementById("res-skills-list-val");
    if (skillsField) {
      skillsField.value = resumeData.skills.join(", ");
      skillsField.style.borderColor = "var(--success)";
      skillsField.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.15)";
      setTimeout(() => {
        skillsField.style.borderColor = "";
        skillsField.style.boxShadow = "";
      }, 1500);
    }
    
    saveResumeState();
    renderActiveResume();
    updateAIScoreBar();
    showToastNotification(`✨ Added ${toAdd.length} in-demand skills: ${toAdd.join(", ")}`);
    btn.disabled = false;
    btn.style.opacity = "";
  }, 1200);
}

function aiQuickScore() {
  const btn = document.getElementById("btn-ai-quick-score");
  btn.disabled = true;
  btn.style.opacity = "0.6";
  showToastNotification("Running AI quality evaluation...");

  setTimeout(() => {
    const score = updateAIScoreBar();
    
    let feedback = "";
    let color = "var(--success)";
    if (score >= 85) {
      feedback = `🏆 Excellent! Your resume scores ${score}%. It is well-rounded and competitive for senior roles.`;
    } else if (score >= 65) {
      feedback = `✅ Good resume at ${score}%. Add more quantified bullet metrics and a project link to push higher.`;
      color = "var(--warning)";
    } else {
      feedback = `⚠️ Your resume scores ${score}%. Complete all sections and add at least 2 work experiences to improve.`;
      color = "var(--error)";
    }

    // Flash the score bar
    const fillBar = document.getElementById("ai-score-fill-bar");
    if (fillBar) {
      fillBar.style.boxShadow = `0 0 12px rgba(99, 102, 241, 0.5)`;
      setTimeout(() => { fillBar.style.boxShadow = ""; }, 1500);
    }

    showToastNotification(feedback);
    btn.disabled = false;
    btn.style.opacity = "";
  }, 900);
}

function openAIImportModal() {
  document.getElementById("ai-import-modal").classList.add("active");
  document.getElementById("ai-import-status").style.display = "none";
  lucide.createIcons();
  // Wire up close buttons
  document.getElementById("btn-close-import-modal").onclick = () => {
    document.getElementById("ai-import-modal").classList.remove("active");
  };
  document.getElementById("btn-cancel-import").onclick = () => {
    document.getElementById("ai-import-modal").classList.remove("active");
  };
}

function runAIImport() {
  const rawText = document.getElementById("ai-import-raw-text").value.trim();
  if (!rawText || rawText.length < 50) {
    alert("Please paste a more complete resume text to import.");
    return;
  }

  const statusEl = document.getElementById("ai-import-status");
  const btn = document.getElementById("btn-run-import");
  btn.disabled = true;
  btn.style.opacity = "0.6";
  statusEl.style.display = "block";
  statusEl.style.backgroundColor = "rgba(99, 102, 241, 0.08)";
  statusEl.style.border = "1px solid rgba(99, 102, 241, 0.2)";
  statusEl.style.color = "var(--text-secondary)";
  statusEl.innerHTML = `<div style="display:flex; align-items:center; gap:8px;"><div class="spinner" style="border: 2px solid var(--border-color); border-top: 2px solid var(--primary); border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite; flex-shrink:0;"></div><span>Claude is parsing your resume structure...</span></div>`;

  setTimeout(() => {
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    // Extract name (first non-empty line usually)
    const firstLine = lines[0] || "";
    if (firstLine && !firstLine.includes("@") && !firstLine.match(/\d{3}/)) {
      resumeData.name = firstLine;
    }
    
    // Extract email
    const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) resumeData.email = emailMatch[0];
    
    // Extract phone
    const phoneMatch = rawText.match(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
    if (phoneMatch) resumeData.phone = phoneMatch[0];
    
    // Extract location (City, State pattern)
    const locationMatch = rawText.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*[A-Z]{2}/);
    if (locationMatch) resumeData.location = locationMatch[0];
    
    // Extract skills (look for SKILLS section)
    const skillsMatch = rawText.match(/SKILLS?[:\s\n]+([^\n]+(?:\n[^\n]+)*?)(?=\n[A-Z]{3,}|\n\n|$)/i);
    if (skillsMatch) {
      const skillText = skillsMatch[1];
      const parsed = skillText.split(/[,|•·\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
      if (parsed.length > 0) resumeData.skills = [...new Set([...resumeData.skills, ...parsed.slice(0, 12)])];
    }
    
    // Re-populate the form fields
    document.getElementById("res-fullname").value = resumeData.name;
    document.getElementById("res-email").value = resumeData.email;
    document.getElementById("res-phone").value = resumeData.phone;
    document.getElementById("res-location").value = resumeData.location;
    document.getElementById("res-skills-list-val").value = resumeData.skills.join(", ");
    
    saveResumeState();
    renderActiveResume();
    updateAIScoreBar();
    
    statusEl.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
    statusEl.style.border = "1px solid rgba(16, 185, 129, 0.25)";
    statusEl.style.color = "var(--success)";
    statusEl.innerHTML = `✅ Import complete! Name, email, phone, location, and skills have been populated. Review the form to verify and edit.`;
    
    btn.disabled = false;
    btn.style.opacity = "";
    showToastNotification("✨ Resume parsed and imported successfully!");
  }, 2000);
}

// TEMPLATE PREVIEW RENDER ENGINE


function renderActiveResume() {
  const target = document.getElementById("resume-paper-target");
  if (!target) return;

  const styleClass = target.className; // Maintain template css class
  
  // Format Skills Markup
  let skillsMarkup = "";
  if (resumeData.skills.length > 0) {
    if (styleClass.includes("template-classic")) {
      skillsMarkup = `
        <div class="section-heading">Skills</div>
        <div class="skills-grid" style="font-size:0.8rem;">
          <strong>Technical Skills:</strong> ${resumeData.skills.join(", ")}
        </div>
      `;
    } else {
      skillsMarkup = `
        <div class="section-heading">Skills</div>
        <div class="skills-grid">
          ${resumeData.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
        </div>
      `;
    }
  }

  // Compile full template
  if (styleClass.includes("template-creative")) {
    // Creative dual columns template rendering
    target.innerHTML = `
      <div class="creative-left">
        <h1>${resumeData.name}</h1>
        <div style="font-size:0.75rem; color:#38bdf8; font-weight:600; margin-top:-4px;">Software Engineer</div>
        <div class="resume-contact-bar">
          <div><i data-lucide="mail" style="width:10px; height:10px; display:inline; vertical-align:middle; margin-right:4px;"></i> ${resumeData.email}</div>
          <div><i data-lucide="phone" style="width:10px; height:10px; display:inline; vertical-align:middle; margin-right:4px;"></i> ${resumeData.phone}</div>
          <div><i data-lucide="map-pin" style="width:10px; height:10px; display:inline; vertical-align:middle; margin-right:4px;"></i> ${resumeData.location}</div>
          <div><i data-lucide="globe" style="width:10px; height:10px; display:inline; vertical-align:middle; margin-right:4px;"></i> ${resumeData.website}</div>
        </div>
        
        <div class="section-heading">Skills</div>
        <div style="margin-top:8px;">
          ${resumeData.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
        </div>
      </div>
      
      <div class="creative-right">
        <div style="font-size:0.825rem; line-height:1.5; color:#475569; font-style:italic; margin-bottom:16px;">
          "${resumeData.summary}"
        </div>
        
        <div class="section-heading">Experience</div>
        ${resumeData.experience.map(exp => `
          <div class="timeline-item">
            <div class="timeline-header">
              <span>${exp.company}</span>
              <span style="font-weight:400; font-size:0.75rem; color:#64748b;">${exp.duration}</span>
            </div>
            <div class="timeline-subtitle">${exp.role}</div>
            <ul class="bullet-list">
              ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
        
        <div class="section-heading">Education</div>
        ${resumeData.education.map(edu => `
          <div class="timeline-item">
            <div class="timeline-header">
              <span>${edu.institution}</span>
              <span style="font-weight:400; font-size:0.75rem; color:#64748b;">${edu.duration}</span>
            </div>
            <div class="timeline-subtitle">${edu.degree}</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${edu.honors}</div>
          </div>
        `).join("")}

        <div class="section-heading">Projects</div>
        ${resumeData.projects.map(proj => `
          <div class="timeline-item">
            <div class="timeline-header">
              <span>${proj.title}</span>
              <span style="font-weight:400; font-size:0.75rem; color:#0369a1;">${proj.link}</span>
            </div>
            <p style="font-size:0.775rem; color:#334155; margin-top:4px; line-height:1.5;">${proj.desc}</p>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    // Standard rows formats (Modern, Classic, Minimal)
    target.innerHTML = `
      <div style="text-align: ${styleClass.includes("template-classic") ? 'center' : 'left'}">
        <h1>${resumeData.name}</h1>
        <div class="resume-contact-bar">
          <span>${resumeData.email}</span> • 
          <span>${resumeData.phone}</span> • 
          <span>${resumeData.location}</span> • 
          <span>${resumeData.website}</span>
        </div>
      </div>
      
      <p style="font-size:0.825rem; line-height:1.5; color:#475569; margin-bottom:20px; font-style:${styleClass.includes("template-classic") ? 'italic' : 'normal'}">
        ${resumeData.summary}
      </p>
      
      <div class="section-heading">Experience</div>
      ${resumeData.experience.map(exp => `
        <div class="timeline-item">
          <div class="timeline-header">
            <span>${exp.company}</span>
            <span style="font-weight:400; font-size:0.775rem; color:#64748b;">${exp.duration}</span>
          </div>
          <div class="timeline-subtitle">
            <span>${exp.role}</span>
          </div>
          <ul class="bullet-list">
            ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
      
      <div class="section-heading">Education</div>
      ${resumeData.education.map(edu => `
        <div class="timeline-item">
          <div class="timeline-header">
            <span>${edu.institution}</span>
            <span style="font-weight:400; font-size:0.775rem; color:#64748b;">${edu.duration}</span>
          </div>
          <div class="timeline-subtitle">
            <span>${edu.degree}</span>
            <span style="font-weight:400; font-size:0.75rem; color:#64748b;">${edu.honors}</span>
          </div>
        </div>
      `).join("")}
      
      ${skillsMarkup}
      
      <div class="section-heading">Projects</div>
      ${resumeData.projects.map(proj => `
        <div class="timeline-item">
          <div class="timeline-header">
            <span>${proj.title}</span>
            <span style="font-weight:400; font-size:0.75rem; color:#6366f1;">${proj.link}</span>
          </div>
          <p style="font-size:0.775rem; color:#475569; margin-top:4px; line-height:1.5;">${proj.desc}</p>
        </div>
      `).join("")}
    `;
  }
  lucide.createIcons();
  
  // Calculate completion percentage to store on Dashboard
  calculateCompletionRating();
}

function calculateCompletionRating() {
  let score = 20; // base contact info
  if (resumeData.summary.length > 50) score += 15;
  if (resumeData.experience.length > 0) {
    score += 20;
    const bulletsCount = resumeData.experience.reduce((acc, curr) => acc + curr.bullets.length, 0);
    if (bulletsCount >= 3) score += 15;
  }
  if (resumeData.education.length > 0) score += 15;
  if (resumeData.skills.length > 3) score += 15;
  
  localStorage.setItem("onestep_resume_completion", score);
}

// EXPORT FUNCTIONS

function exportResumeJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `onestep_resume_${resumeData.name.toLowerCase().replace(/ /g, "_")}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToastNotification("JSON export started.");
}

function exportResumeDOCX() {
  // MS Word supports reading clean HTML natively. Wrapping our resume structure in standard HTML format
  // and saving as .doc triggers a perfect Word formatting translation.
  const previewHtml = document.getElementById("resume-paper-target").innerHTML;
  
  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Resume - ${resumeData.name}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333333; }
        h1 { font-size: 20pt; margin-bottom: 2pt; font-weight: bold; }
        .resume-contact-bar { font-size: 9pt; color: #666666; margin-bottom: 12pt; border-bottom: 1px solid #cccccc; padding-bottom: 6pt; }
        .section-heading { font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #333333; border-bottom: 1.5px solid #333333; padding-bottom: 2pt; margin-top: 18pt; margin-bottom: 8pt; }
        .timeline-item { margin-bottom: 10pt; }
        .timeline-header { font-weight: bold; display: table; width: 100%; }
        .timeline-subtitle { font-style: italic; color: #555555; }
        .bullet-list { margin-top: 4pt; margin-bottom: 4pt; }
        .skill-tag { background-color: #f0f0f0; border-radius: 4px; padding: 2px 6px; margin-right: 4px; font-size: 9.5pt; display: inline-block; }
      </style>
    </head>
    <body>
      ${previewHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + docHtml], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `onestep_resume_${resumeData.name.toLowerCase().replace(/ /g, "_")}.doc`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToastNotification("Word (DOCX) export started.");
}

// ===========================================================================
//  AI RESUME CHAT DRAWER
// ===========================================================================

let aiDrawerOpen = false;

function toggleAIResumeChat() {
  const drawer = document.getElementById("ai-resume-chat-drawer");
  const toggleBtn = document.getElementById("btn-toggle-ai-chat");
  if (!drawer) return;

  aiDrawerOpen = !aiDrawerOpen;
  
  if (aiDrawerOpen) {
    drawer.classList.add("open");
    if (toggleBtn) toggleBtn.classList.add("ai-chat-active");
    lucide.createIcons();
    // Scroll to bottom of messages
    setTimeout(() => {
      const msgs = document.getElementById("ai-drawer-messages-container");
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 350);
  } else {
    drawer.classList.remove("open");
    if (toggleBtn) toggleBtn.classList.remove("ai-chat-active");
  }
}

function sendAIDrawerChip(prompt) {
  document.getElementById("ai-drawer-input-field").value = prompt;
  sendAIDrawerMessage();
}

function handleAIDrawerKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendAIDrawerMessage();
  }
}

function sendAIDrawerMessage() {
  const input = document.getElementById("ai-drawer-input-field");
  const msg = input.value.trim();
  if (!msg) return;
  
  input.value = "";
  input.style.height = "36px";

  // Add user message
  appendAIDrawerMessage("user", msg);
  
  // Show typing indicator
  showAIDrawerTyping();
  
  // Generate response after delay
  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    removeAIDrawerTyping();
    const response = generateAIDrawerResponse(msg.toLowerCase());
    appendAIDrawerMessage("ai", response.text, response.applyFn, response.applyLabel);
  }, delay);
}

function appendAIDrawerMessage(role, text, applyFn, applyLabel) {
  const container = document.getElementById("ai-drawer-messages-container");
  if (!container) return;

  const msgEl = document.createElement("div");
  msgEl.className = `ai-drawer-msg ${role}`;

  const avatarEl = document.createElement("div");
  avatarEl.className = "ai-drawer-msg-avatar";
  avatarEl.textContent = role === "ai" ? "AI" : "You";

  const contentWrapper = document.createElement("div");
  
  const bubble = document.createElement("div");
  bubble.className = "ai-drawer-msg-bubble";
  bubble.innerHTML = text;

  const timeEl = document.createElement("span");
  timeEl.className = "ai-drawer-msg-time";
  timeEl.textContent = "Just now";
  bubble.appendChild(timeEl);

  // Add apply button if provided
  if (applyFn && applyLabel) {
    const applyBtn = document.createElement("button");
    applyBtn.className = "ai-apply-btn";
    applyBtn.innerHTML = `<i data-lucide="check"></i> ${applyLabel}`;
    applyBtn.onclick = () => {
      applyFn();
      applyBtn.textContent = "✓ Applied!";
      applyBtn.disabled = true;
      applyBtn.style.opacity = "0.6";
    };
    bubble.appendChild(applyBtn);
  }

  contentWrapper.appendChild(bubble);

  if (role === "user") {
    msgEl.appendChild(contentWrapper);
    msgEl.appendChild(avatarEl);
  } else {
    msgEl.appendChild(avatarEl);
    msgEl.appendChild(contentWrapper);
  }

  container.appendChild(msgEl);
  lucide.createIcons();
  container.scrollTop = container.scrollHeight;
}

function showAIDrawerTyping() {
  const container = document.getElementById("ai-drawer-messages-container");
  if (!container) return;

  const wrapper = document.createElement("div");
  wrapper.className = "ai-drawer-msg ai";
  wrapper.id = "ai-typing-bubble";

  const avatar = document.createElement("div");
  avatar.className = "ai-drawer-msg-avatar";
  avatar.textContent = "AI";

  const indicator = document.createElement("div");
  indicator.className = "ai-typing-indicator";
  indicator.innerHTML = `<div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>`;

  wrapper.appendChild(avatar);
  wrapper.appendChild(indicator);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function removeAIDrawerTyping() {
  const el = document.getElementById("ai-typing-bubble");
  if (el) el.remove();
}

function generateAIDrawerResponse(query) {
  // Context-rich response engine using current resume data
  const name = resumeData.name.split(" ")[0];
  const topCompany = resumeData.experience.length > 0 ? resumeData.experience[0].company : "your company";
  const topRole = resumeData.experience.length > 0 ? resumeData.experience[0].role : "your role";
  const skills = resumeData.skills.slice(0, 6).join(", ");
  const bulletsCount = resumeData.experience.reduce((a, e) => a + e.bullets.length, 0);

  // Summary improvement
  if (query.includes("summar") || query.includes("improve") && query.includes("profile")) {
    const newSummary = `Results-driven ${topRole} at ${topCompany} with a proven record of delivering high-impact engineering solutions. Expert in ${skills}. Known for building scalable distributed systems, leading cross-functional engineering teams, and shipping features that measurably improve performance and reliability.`;
    return {
      text: `Here's a stronger professional summary I've crafted based on your experience at <strong>${topCompany}</strong>:<br><br><em>"${newSummary}"</em><br><br>This version emphasizes impact, expertise, and leadership — key signals recruiters look for.`,
      applyFn: () => {
        resumeData.summary = newSummary;
        const field = document.getElementById("res-summary");
        if (field) field.value = newSummary;
        saveResumeState();
        renderActiveResume();
        updateAIScoreBar();
        showToastNotification("✨ Summary updated by AI!");
      },
      applyLabel: "Apply to Resume"
    };
  }

  // Skills suggestions
  if (query.includes("skill") || query.includes("add") && query.includes("tech")) {
    const existing = resumeData.skills.map(s => s.toLowerCase());
    const suggestions = ["Kubernetes", "gRPC", "Terraform", "Kafka", "Redis", "TypeScript", "GraphQL", "Prometheus", "Elasticsearch", "OpenTelemetry"];
    const toAdd = suggestions.filter(s => !existing.includes(s.toLowerCase())).slice(0, 4);
    return {
      text: `Based on your current stack (${skills}), here are the most in-demand skills to add for senior backend roles at top companies:<br><br>🔹 <strong>${toAdd.join("</strong><br>🔹 <strong>")}</strong><br><br>These are consistently listed in backend engineering JDs at Google, Stripe, and Meta.`,
      applyFn: () => {
        resumeData.skills = [...resumeData.skills, ...toAdd];
        const field = document.getElementById("res-skills-list-val");
        if (field) field.value = resumeData.skills.join(", ");
        saveResumeState();
        renderActiveResume();
        updateAIScoreBar();
        showToastNotification(`✨ Added ${toAdd.length} skills to your resume!`);
      },
      applyLabel: `Add ${toAdd.length} Skills`
    };
  }

  // Bullet/metric improvement
  if (query.includes("bullet") || query.includes("metric") || query.includes("impact") || query.includes("quantif")) {
    return {
      text: `Your resume currently has <strong>${bulletsCount} bullet points</strong> across your work history. Here's the XYZ formula for high-impact bullets:<br><br>
      📌 <strong>X</strong> = Accomplished [X]<br>
      📌 <strong>Y</strong> = As measured by [Y]<br>
      📌 <strong>Z</strong> = By doing [Z]<br><br>
      <strong>Example (weak):</strong> "Worked on API improvements"<br>
      <strong>Example (strong):</strong> "Reduced API response latency by <em>40%</em> by implementing Redis caching and query optimization, improving P99 from 820ms to 490ms."<br><br>
      Click the ✨ <strong>sparkle button</strong> next to any bullet in the editor to get AI-enhanced versions!`,
      applyFn: null,
      applyLabel: null
    };
  }

  // ATS tips
  if (query.includes("ats") || query.includes("applicant") || query.includes("tracking") || query.includes("keyword")) {
    const score = updateAIScoreBar();
    return {
      text: `Your current ATS score is <strong>${score}%</strong>. Here's how to push it higher:<br><br>
      ✅ <strong>Use exact keyword matches</strong> — Copy key phrases from the JD verbatim<br>
      ✅ <strong>Avoid tables and columns</strong> — Use the Modern or Classic template<br>
      ✅ <strong>Include your tech stack in context</strong> — Don't just list "Go", say "built in Go"<br>
      ✅ <strong>Quantify every bullet</strong> — Numbers improve keyword density<br>
      ⚠️ <strong>Avoid graphics/icons in the resume body</strong> — ATS can't parse images<br><br>
      Run the <strong>ATS Analyzer</strong> tool with a specific job description for a detailed score breakdown.`,
      applyFn: null,
      applyLabel: null
    };
  }

  // Missing sections
  if (query.includes("missing") || query.includes("section") || query.includes("review") || query.includes("complete")) {
    const missing = [];
    if (!resumeData.website || resumeData.website.trim() === "") missing.push("Portfolio/LinkedIn URL");
    if (resumeData.projects.length === 0) missing.push("Personal Projects section");
    if (resumeData.experience.length < 2) missing.push("A second work experience entry");
    if (bulletsCount < 4) missing.push("More achievement bullets (aim for 3+ per role)");
    if (resumeData.skills.length < 8) missing.push("A broader skills list (aim for 8-12 skills)");
    
    const missingText = missing.length > 0
      ? `Your resume could benefit from these additions:<br><br>⚠️ ${missing.join("<br>⚠️ ")}`
      : "🎉 Your resume looks quite complete! Consider tailoring it specifically to a job description using the ATS Analyzer for maximum impact.";

    return { text: missingText, applyFn: null, applyLabel: null };
  }

  // Company-specific advice  
  if (query.includes("google") || query.includes("meta") || query.includes("amazon") || query.includes("faang")) {
    const company = query.includes("meta") ? "Meta" : query.includes("amazon") ? "Amazon" : "Google";
    return {
      text: `To optimize your resume for <strong>${company}</strong>:<br><br>
      📌 <strong>Emphasize scale</strong> — Mention system size (users, TPS, QPS, data volume)<br>
      📌 <strong>Show ownership</strong> — Use "Led", "Designed", "Owned" instead of "Helped" or "Worked on"<br>
      📌 <strong>Algorithms & Data Structures</strong> — Mention DSA or complexity improvements<br>
      📌 <strong>Cross-team collaboration</strong> — ${company} values cross-functional work<br>
      📌 <strong>Impact metrics</strong> — Every bullet should have a measurable outcome<br><br>
      Your experience at <strong>${topCompany}</strong> is highly relevant. Make sure to highlight the scale of systems you worked on!`,
      applyFn: null,
      applyLabel: null
    };
  }

  // Generic helpful response
  const genericResponses = [
    {
      text: `Great question! Based on your current resume with <strong>${resumeData.experience.length} work experience(s)</strong> and <strong>${resumeData.skills.length} skills</strong>, here are my top 3 recommendations:<br><br>
      1️⃣ <strong>Quantify your impact</strong> — Add specific metrics to your ${topCompany} bullets<br>
      2️⃣ <strong>Tailor for each application</strong> — Mirror the JD's exact language<br>
      3️⃣ <strong>Strengthen your summary</strong> — Lead with your biggest wins<br><br>
      Try the quick action chips above for specific improvements!`
    },
    {
      text: `I've reviewed your resume profile for <strong>${name}</strong>. Your background at <strong>${topCompany}</strong> as a <strong>${topRole}</strong> is strong!<br><br>
      Key areas to focus on:<br>
      • Add more quantified metrics to your work bullets<br>
      • Ensure your skills list includes modern tools relevant to your target role<br>
      • Consider adding a strong "Projects" section if you haven't already<br><br>
      Which specific section would you like me to help improve?`
    }
  ];

  const chosen = genericResponses[Math.floor(Math.random() * genericResponses.length)];
  return { text: chosen.text, applyFn: null, applyLabel: null };
}

// ============================================================
// EDITOR TABS SYSTEM
// ============================================================
function initEditorTabs() {
  const tabs = document.querySelectorAll('.editor-tab');
  const contents = document.querySelectorAll('.editor-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active content
      contents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('active');
        }
      });
    });
  });
}

// ============================================================
// TEMPLATE BROWSER SYSTEM
// ============================================================
function initTemplateBrowser() {
  // Template card selection
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const template = card.dataset.template;
      
      // Add switching animation to all cards
      templateCards.forEach(c => c.classList.add('switching'));
      
      setTimeout(() => {
        // Remove switching animation
        templateCards.forEach(c => c.classList.remove('switching'));
        
        // Update active state
        templateCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Add selected animation pulse
        card.classList.add('selected');
        setTimeout(() => {
          card.classList.remove('selected');
        }, 500);

        // Update preview
        const paper = document.getElementById('resume-paper-target');
        if (paper) {
          paper.className = `resume-paper template-${template}`;
        }

        // Update dropdown
        const selector = document.getElementById('template-selector');
        if (selector) {
          selector.value = template;
        }

        // Save preference
        localStorage.setItem('onestep_resume_template', template);
        renderActiveResume();
      }, 300);
    });
  });

  // Category filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter templates
      templateCards.forEach(card => {
        const template = card.dataset.template;
        let shouldShow = true;

        if (filter === 'ats') {
          shouldShow = ['modern', 'classic', 'minimal'].includes(template);
        } else if (filter === 'creative') {
          shouldShow = template === 'creative';
        } else if (filter === 'popular') {
          shouldShow = ['modern', 'classic'].includes(template);
        }

        card.style.display = shouldShow ? 'block' : 'none';
      });
    });
  });
}

// ============================================================
// COLOR PALETTE SYSTEM
// ============================================================
function initColorPalette() {
  const colorSwatches = document.querySelectorAll('.color-swatch');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.dataset.color;

      // Update active state
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Apply color theme to resume
      applyColorTheme(color);

      // Save preference
      localStorage.setItem('onestep_resume_color', color);
    });
  });

  // Load saved color preference
  const savedColor = localStorage.getItem('onestep_resume_color');
  if (savedColor) {
    const savedSwatch = document.querySelector(`.color-swatch[data-color="${savedColor}"]`);
    if (savedSwatch) {
      savedSwatch.click();
    }
  }
}

// Structured theme objects for professional resume builder
const resumeThemes = {
  soft: {
    resumeBg: "#ffffff",
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    text: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    tagBg: "#F3F4F6",
    tagText: "#111827",
    sidebarBg: "#111827",
    sidebarText: "#ffffff"
  },
  blue: {
    resumeBg: "#EFF6FF",
    primary: "#2563EB",
    secondary: "#60A5FA",
    text: "#1E3A8A",
    muted: "#64748B",
    border: "#BFDBFE",
    tagBg: "#DBEAFE",
    tagText: "#1E3A8A",
    sidebarBg: "#1E3A8A",
    sidebarText: "#ffffff"
  },
  green: {
    resumeBg: "#ECFDF5",
    primary: "#059669",
    secondary: "#34D399",
    text: "#064E3B",
    muted: "#047857",
    border: "#A7F3D0",
    tagBg: "#D1FAE5",
    tagText: "#064E3B",
    sidebarBg: "#064E3B",
    sidebarText: "#ffffff"
  },
  red: {
    resumeBg: "#FEF2F2",
    primary: "#DC2626",
    secondary: "#F87171",
    text: "#7F1D1D",
    muted: "#991B1B",
    border: "#FECACA",
    tagBg: "#FEE2E2",
    tagText: "#7F1D1D",
    sidebarBg: "#7F1D1D",
    sidebarText: "#ffffff"
  },
  purple: {
    resumeBg: "#FAF5FF",
    primary: "#9333EA",
    secondary: "#C084FC",
    text: "#581C87",
    muted: "#7C3AED",
    border: "#E9D5FF",
    tagBg: "#F3E8FF",
    tagText: "#581C87",
    sidebarBg: "#581C87",
    sidebarText: "#ffffff"
  },
  black: {
    resumeBg: "#F9FAFB",
    primary: "#1F2937",
    secondary: "#4B5563",
    text: "#111827",
    muted: "#6B7280",
    border: "#D1D5DB",
    tagBg: "#E5E7EB",
    tagText: "#111827",
    sidebarBg: "#111827",
    sidebarText: "#ffffff"
  },
  minimal: {
    resumeBg: "#F9FAFB",
    primary: "#111827",
    secondary: "#374151",
    text: "#111827",
    muted: "#6B7280",
    border: "#D1D5DB",
    tagBg: "#E5E7EB",
    tagText: "#111827",
    sidebarBg: "#111827",
    sidebarText: "#ffffff"
  }
};

function applyColorTheme(themeName) {
  const root = document.documentElement;
  const theme = resumeThemes[themeName] || resumeThemes.soft;

  // Apply all CSS variables instantly
  root.style.setProperty('--resume-bg', theme.resumeBg);
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--secondary-color', theme.secondary);
  root.style.setProperty('--text-color', theme.text);
  root.style.setProperty('--muted-color', theme.muted);
  root.style.setProperty('--border-color', theme.border);
  root.style.setProperty('--tag-bg', theme.tagBg);
  root.style.setProperty('--tag-text', theme.tagText);
  root.style.setProperty('--sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--sidebar-text', theme.sidebarText);

  // Update resume preview immediately without full rerender
  const resumePaper = document.querySelector('.resume-paper');
  if (resumePaper) {
    resumePaper.style.backgroundColor = theme.resumeBg;
    resumePaper.style.color = theme.text;
  }
}

// ============================================================
// LAYOUT CONTROLS SYSTEM
// ============================================================
function initLayoutControls() {
  // Font size slider
  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeValue = document.getElementById('font-size-value');
  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      fontSizeValue.textContent = `${value}px`;
      document.documentElement.style.setProperty('--resume-font-size', `${value}px`);
    });
  }

  // Line height slider
  const lineHeightSlider = document.getElementById('line-height-slider');
  const lineHeightValue = document.getElementById('line-height-value');
  if (lineHeightSlider && lineHeightValue) {
    lineHeightSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      lineHeightValue.textContent = value;
      document.documentElement.style.setProperty('--resume-line-height', value);
    });
  }

  // Section spacing slider
  const sectionSpacingSlider = document.getElementById('section-spacing-slider');
  const sectionSpacingValue = document.getElementById('section-spacing-value');
  if (sectionSpacingSlider && sectionSpacingValue) {
    sectionSpacingSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      sectionSpacingValue.textContent = `${value}px`;
      document.documentElement.style.setProperty('--resume-section-spacing', `${value}px`);
    });
  }

  // Margin slider
  const marginSlider = document.getElementById('margin-slider');
  const marginValue = document.getElementById('margin-value');
  if (marginSlider && marginValue) {
    marginSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      marginValue.textContent = `${value}px`;
      document.documentElement.style.setProperty('--resume-margin', `${value}px`);
    });
  }

  // Header alignment selector
  const headerAlignmentSelect = document.getElementById('header-alignment-select');
  if (headerAlignmentSelect) {
    headerAlignmentSelect.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--resume-header-align', e.target.value);
      renderActiveResume();
    });
  }

  // Density selector
  const densitySelect = document.getElementById('density-select');
  if (densitySelect) {
    densitySelect.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--resume-density', e.target.value);
      renderActiveResume();
    });
  }
}

// ============================================================
// SECTION MANAGER SYSTEM
// ============================================================
function initSectionManager() {
  const sectionToggles = document.querySelectorAll('.section-toggle input');
  
  sectionToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const section = e.target.dataset.section;
      const isVisible = e.target.checked;

      // Update resume preview
      const sectionElement = document.querySelector(`.resume-paper .resume-section-${section}`);
      if (sectionElement) {
        sectionElement.style.display = isVisible ? 'block' : 'none';
      }

      // Save state
      const hiddenSections = JSON.parse(localStorage.getItem('onestep_hidden_sections') || '[]');
      if (isVisible) {
        const index = hiddenSections.indexOf(section);
        if (index > -1) hiddenSections.splice(index, 1);
      } else {
        if (!hiddenSections.includes(section)) {
          hiddenSections.push(section);
        }
      }
      localStorage.setItem('onestep_hidden_sections', JSON.stringify(hiddenSections));
    });
  });

  // Load saved section visibility
  const hiddenSections = JSON.parse(localStorage.getItem('onestep_hidden_sections') || '[]');
  hiddenSections.forEach(section => {
    const toggle = document.querySelector(`.section-toggle input[data-section="${section}"]`);
    if (toggle) {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
    }
  });

  // Initialize drag-and-drop for section reordering
  initSectionDragDrop();
}

function initSectionDragDrop() {
  const sectionList = document.getElementById('section-list');
  if (!sectionList) return;

  const sectionItems = sectionList.querySelectorAll('.section-item');
  
  sectionItems.forEach(item => {
    const handle = item.querySelector('.section-handle');
    
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      item.setAttribute('draggable', 'true');
    });

    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.section);
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      item.setAttribute('draggable', 'false');
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingItem = sectionList.querySelector('.dragging');
      if (draggingItem && draggingItem !== item) {
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        
        if (e.clientY < midY) {
          sectionList.insertBefore(draggingItem, item);
        } else {
          sectionList.insertBefore(draggingItem, item.nextSibling);
        }
      }
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      // Update resume section order
      updateSectionOrder();
    });
  });
}

function updateSectionOrder() {
  const sectionList = document.getElementById('section-list');
  const sectionItems = sectionList.querySelectorAll('.section-item');
  const newOrder = Array.from(sectionItems).map(item => item.dataset.section);
  
  // Save new order
  localStorage.setItem('onestep_section_order', JSON.stringify(newOrder));
  
  // Update resume preview order
  const resumePaper = document.querySelector('.resume-paper');
  if (resumePaper) {
    newOrder.forEach(section => {
      const sectionElement = resumePaper.querySelector(`.resume-section-${section}`);
      if (sectionElement) {
        resumePaper.appendChild(sectionElement);
      }
    });
  }
}

// ============================================================
// PREVIEW ZOOM CONTROLS SYSTEM
// ============================================================
function initPreviewZoomControls() {
  let currentZoom = 100;
  const zoomLevelDisplay = document.getElementById('zoom-level');
  const resumePaper = document.getElementById('resume-paper-target');
  const previewContainer = document.querySelector('.resume-preview-container');

  // Zoom in
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    currentZoom = Math.min(currentZoom + 10, 200);
    updateZoom();
  });

  // Zoom out
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    currentZoom = Math.max(currentZoom - 10, 50);
    updateZoom();
  });

  // Fit width
  document.getElementById('btn-fit-width').addEventListener('click', () => {
    if (previewContainer && resumePaper) {
      const containerWidth = previewContainer.clientWidth - 80;
      const paperWidth = resumePaper.offsetWidth;
      currentZoom = Math.floor((containerWidth / paperWidth) * 100);
      currentZoom = Math.min(Math.max(currentZoom, 50), 200);
      updateZoom();
    }
  });

  // Fit height
  document.getElementById('btn-fit-height').addEventListener('click', () => {
    if (previewContainer && resumePaper) {
      const containerHeight = previewContainer.clientHeight - 80;
      const paperHeight = resumePaper.offsetHeight;
      currentZoom = Math.floor((containerHeight / paperHeight) * 100);
      currentZoom = Math.min(Math.max(currentZoom, 50), 200);
      updateZoom();
    }
  });

  // Fullscreen
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (previewContainer) {
      if (!document.fullscreenElement) {
        previewContainer.requestFullscreen().catch(err => {
          console.log('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  });

  function updateZoom() {
    if (resumePaper) {
      resumePaper.style.transform = `scale(${currentZoom / 100})`;
      resumePaper.style.transformOrigin = 'top center';
    }
    if (zoomLevelDisplay) {
      zoomLevelDisplay.textContent = `${currentZoom}%`;
    }
    localStorage.setItem('onestep_resume_zoom', currentZoom);
  }

  // Load saved zoom level
  const savedZoom = localStorage.getItem('onestep_resume_zoom');
  if (savedZoom) {
    currentZoom = parseInt(savedZoom, 10);
    updateZoom();
  }
}

