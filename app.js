// OneStep Resume AI - Central Core Subsystems & Navigation Router

let supabaseClient = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Authentication Check
  const isLoggedIn = localStorage.getItem("onestep_logged_in") === "true";
  if (!isLoggedIn && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  // Initialize Supabase sync
  initSupabase();
  if (supabaseClient) {
    await syncSupabaseProgress();
  }

  // Sync role & user info
  const userRole = localStorage.getItem("onestep_role") || "user";
  const userName = localStorage.getItem("onestep_username") || "Sarah Jenkins";
  const sidebarUser = document.getElementById("sidebar-username");
  const sidebarTier = document.getElementById("sidebar-usertier");
  if (sidebarUser) sidebarUser.textContent = userName;
  if (sidebarTier) sidebarTier.textContent = userRole === "admin" ? "Administrator Portal" : "Premium Member";

  // If admin logged in, show admin nav button distinctly
  const adminNav = document.getElementById("nav-admin");
  if (adminNav && userRole === "admin") {
    adminNav.style.border = "1px solid rgba(168,85,247,0.4)";
    adminNav.style.background = "rgba(168,85,247,0.15)";
  }

  // Initialize Routing
  initNavigation();
  
  // Initialize Global Theme
  initThemeSystem();

  // Initialize Subsystem Bindings
  initResumeBuilder();
  initATSAnalyzer();
  initAdminPanel();
  initProfileModal();
  
  // Load view datasets
  renderCompanyListCards();
  generateActiveRoadmap();
  initChatBot();
  initSupportChatBot();
  initCoverLetterGen();
  initPortfolioBuilder();
  
  // Load dashboard widgets
  updateDashboardMetrics();
});

function logoutUser() {
  localStorage.removeItem("onestep_logged_in");
  localStorage.removeItem("onestep_role");
  window.location.href = "login.html";
}

// ==========================================================================
// 1. ROUTING & NAVIGATION
// ==========================================================================

function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.dataset.target;
      navigateTo(targetId);
    });
  });

  // Check Hash Router or initial state
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    navigateTo(hash);
  } else {
    navigateTo("landing-view");
  }
}

function navigateTo(viewId) {
  // Update nav menu active states
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.dataset.target === viewId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Toggle page visibility with premium transitions
  const views = document.querySelectorAll(".page-view, .page-view-flex");
  const currentView = document.querySelector(".page-view.active, .page-view-flex.active");
  const targetView = document.getElementById(viewId);

  if (currentView && currentView.id !== viewId) {
    // Animate current view out
    currentView.classList.remove("active");
    currentView.classList.add("exit");
    
    setTimeout(() => {
      currentView.classList.remove("exit");
    }, 600);
  }

  if (targetView) {
    // Animate target view in
    targetView.classList.add("enter");
    targetView.classList.add("active");
    
    setTimeout(() => {
      targetView.classList.remove("enter");
      targetView.classList.add("active");
    }, 50);
  }

  // Scroll main view pane back to top
  document.getElementById("main-content").scrollTop = 0;

  // Set Page Title header
  const titleMap = {
    "landing-view": "Welcome to OneStep",
    "dashboard-view": "Candidate Dashboard",
    "resume-view": "AI Resume Builder",
    "ats-view": "ATS Diagnostics Analyzer",
    "companies-view": "Company Interview Preparation",
    "roadmap-view": "Interactive Career Roadmaps",
    "coach-view": "Conversational Career Coach",
    "coverletter-view": "AI Cover Letter Generator",
    "portfolio-view": "Portfolio Website Generator",
    "admin-view": "Platform Administrator Control"
  };

  document.getElementById("header-page-title").textContent = titleMap[viewId] || "OneStep Career platform";
  window.location.hash = viewId;

  // Sync dashboard details on view enter
  if (viewId === "dashboard-view") {
    updateDashboardMetrics();
  }
}

// ==========================================================================
// 2. THEME SYSTEM (Dark / Light Mode)
// ==========================================================================

function initThemeSystem() {
  const checkbox = document.getElementById("theme-checkbox");
  
  // Load preference
  const savedTheme = localStorage.getItem("onestep_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  checkbox.checked = (savedTheme === "dark");

  checkbox.onchange = (e) => {
    const theme = e.target.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("onestep_theme", theme);
    showToastNotification(`Theme switched to ${theme} mode.`);
  };

  // Pricing duration switcher checkbox
  const billingCheckbox = document.getElementById("pricing-billing-checkbox");
  if (billingCheckbox) {
    billingCheckbox.onchange = (e) => {
      const isAnnual = e.target.checked;
      const prem = document.getElementById("premium-price-val");
      const pro = document.getElementById("pro-price-val");
      
      if (isAnnual) {
        prem.innerHTML = "$7.99 <span>/ mo (billed annually)</span>";
        pro.innerHTML = "$15.99 <span>/ mo (billed annually)</span>";
      } else {
        prem.innerHTML = "$9.99 <span>/ mo</span>";
        pro.innerHTML = "$19.99 <span>/ mo</span>";
      }
    };
  }
}

// ==========================================================================
// 3. CANDIDATE PROFILE CONFIG
// ==========================================================================

function initProfileModal() {
  const btn = document.getElementById("profile-summary-btn");
  const modal = document.getElementById("profile-config-modal");
  
  if (!btn || !modal) return;

  btn.onclick = () => {
    // Populate form fields
    document.getElementById("prof-username").value = localStorage.getItem("onestep_username") || "Sarah Jenkins";
    document.getElementById("prof-target-company").value = localStorage.getItem("onestep_target_company") || "google";
    document.getElementById("prof-target-role").value = localStorage.getItem("onestep_target_role") || "backend";
    document.getElementById("prof-experience-level").value = localStorage.getItem("onestep_experience_level") || "mid";
    document.getElementById("prof-gemini-key").value = localStorage.getItem("onestep_gemini_api_key") || "";
    document.getElementById("prof-supabase-url").value = localStorage.getItem("onestep_supabase_url") || "";
    document.getElementById("prof-supabase-key").value = localStorage.getItem("onestep_supabase_key") || "";
    modal.classList.add("active");
  };

  const closeBtns = ["btn-close-profile-modal", "btn-close-profile-footer"];
  closeBtns.forEach(id => {
    document.getElementById(id).onclick = () => modal.classList.remove("active");
  });

  document.getElementById("btn-save-profile").onclick = async () => {
    const name = document.getElementById("prof-username").value.trim() || "Sarah Jenkins";
    const company = document.getElementById("prof-target-company").value;
    const role = document.getElementById("prof-target-role").value;
    const isPremium = document.getElementById("prof-membership").checked;
    const expLevel = document.getElementById("prof-experience-level").value;
    const geminiKey = document.getElementById("prof-gemini-key").value.trim();
    const supabaseUrl = document.getElementById("prof-supabase-url").value.trim();
    const supabaseKey = document.getElementById("prof-supabase-key").value.trim();

    localStorage.setItem("onestep_username", name);
    localStorage.setItem("onestep_target_company", company);
    localStorage.setItem("onestep_target_role", role);
    localStorage.setItem("onestep_user_tier", isPremium ? "Premium Member" : "Free Tier");
    localStorage.setItem("onestep_experience_level", expLevel);
    localStorage.setItem("onestep_gemini_api_key", geminiKey);
    localStorage.setItem("onestep_supabase_url", supabaseUrl);
    localStorage.setItem("onestep_supabase_key", supabaseKey);

    // Sync header elements
    document.getElementById("sidebar-username").textContent = name;
    document.getElementById("sidebar-usertier").textContent = isPremium ? "Premium Member" : "Free Tier";
    
    modal.classList.remove("active");
    
    // Re-initialize Supabase
    initSupabase();
    if (supabaseClient) {
      showToastNotification("Synchronizing with Supabase database...");
      await syncSupabaseProgress();
    }
    
    updateDashboardMetrics();
    generateActiveRoadmap();
    showToastNotification("Candidate settings saved successfully.");
  };

  // Sync initial sidebar details
  document.getElementById("sidebar-username").textContent = localStorage.getItem("onestep_username") || "Sarah Jenkins";
  document.getElementById("sidebar-usertier").textContent = localStorage.getItem("onestep_user_tier") || "Premium Member";
}

// ==========================================================================
// 4. USER DASHBOARD WIDGETS
// ==========================================================================

function updateDashboardMetrics() {
  const name = localStorage.getItem("onestep_username") || "Sarah Jenkins";
  const compKey = localStorage.getItem("onestep_target_company") || "google";
  const roleKey = localStorage.getItem("onestep_target_role") || "backend";

  const targetComp = companiesData.find(c => c.id === compKey) || companiesData[0];

  // Title
  document.getElementById("dash-username-span").textContent = name.split(" ")[0];

  // ATS score sync
  const score = localStorage.getItem("onestep_active_ats_score") || "76";
  document.getElementById("dash-ats-score").textContent = `${score}%`;
  document.getElementById("dash-ats-bar").style.width = `${score}%`;

  // Resume completion rating
  const completion = localStorage.getItem("onestep_resume_completion") || "85";
  document.getElementById("dash-resume-completion").textContent = `${completion}%`;
  document.getElementById("dash-resume-bar").style.width = `${completion}%`;

  // Target Badge
  document.getElementById("dash-target-logo").textContent = targetComp.logoText;
  document.getElementById("dash-target-logo").style.backgroundColor = targetComp.logoBg;
  document.getElementById("dash-target-company").textContent = targetComp.name;
  
  const roleDisplay = roleKey.charAt(0).toUpperCase() + roleKey.slice(1) + " Engineer";
  document.getElementById("dash-target-role").textContent = roleDisplay;

  // Activities list injection
  const activities = [
    { type: "blue", icon: "edit-3", title: "Resumed edited in Builder", time: "2 hours ago" },
    { type: "green", icon: "activity", title: `ATS Analyzer check run against ${targetComp.name} JD`, time: "Yesterday" },
    { type: "purple", icon: "check-circle", title: "Completed: Database Relational schemas module", time: "3 days ago" }
  ];

  const actContainer = document.getElementById("dashboard-activity-container");
  actContainer.innerHTML = activities.map(act => `
    <div class="activity-item">
      <div class="activity-icon ${act.type}"><i data-lucide="${act.icon}" style="width:16px; height:16px;"></i></div>
      <div class="activity-details">
        <span class="activity-title">${act.title}</span>
        <span class="activity-time">${act.time}</span>
      </div>
    </div>
  `).join("");

  // Recommended lessons list injection
  const courses = [
    { title: "System Design Frameworks", platform: "DesignGurus.io", level: "Intermediate" },
    { title: "Advanced PostgreSQL Indexes", platform: "Eduative.io", level: "Expert" }
  ];

  const courseContainer = document.getElementById("dashboard-courses-container");
  if (courseContainer) {
    const progress = JSON.parse(localStorage.getItem("onestep_resource_progress_cache") || "{}");
    const bookmarkedItems = [];
    for (const key in progress) {
      if (progress[key].bookmarked && progress[key].meta) {
        bookmarkedItems.push(progress[key].meta);
      }
    }
    
    if (bookmarkedItems.length > 0) {
      courseContainer.innerHTML = bookmarkedItems.map(item => `
        <div class="activity-item animate-fade" style="cursor:pointer;" onclick="navigateToRoadmapAndOpen('${item.companyKey}', '${item.roleKey}', ${item.skillIdx})">
          <div class="activity-icon purple" style="background-color:rgba(168,85,247,0.15); color:#a855f7;"><i data-lucide="bookmark" style="width:16px; height:16px;"></i></div>
          <div class="activity-details">
            <span class="activity-title" style="font-weight:600;">${item.name}</span>
            <span class="activity-time">${item.category.toUpperCase()} • ${item.difficulty} • ${item.duration}</span>
          </div>
        </div>
      `).join("");
    } else {
      courseContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-secondary); font-size: 0.8rem; background:rgba(255,255,255,0.01); border-radius:8px; border:1px dashed var(--border-color); width:100%;">
          <i data-lucide="bookmark" style="width: 28px; height: 28px; color: var(--text-muted); margin-bottom: 8px; stroke-width: 1.5; display:block; margin-left:auto; margin-right:auto;"></i>
          <p style="margin-bottom: 4px; font-weight: 600; color:var(--text-main);">No bookmarked resources</p>
          <p style="font-size: 0.72rem; color: var(--text-muted); line-height:1.4;">Go to your Skill Roadmap to bookmark curated videos, docs, and certifications!</p>
          <button class="btn-primary-glow" style="padding: 4px 12px; font-size: 0.72rem; margin-top: 10px; border-radius:4px; height:auto; width:auto;" onclick="navigateTo('roadmap-view')">Open Roadmap</button>
        </div>
      `;
    }
  }

  // Sync Roadmap progress bars
  const total = parseInt(localStorage.getItem(`roadmap_total_${compKey}_${roleKey}`) || "0");
  const checked = parseInt(localStorage.getItem(`roadmap_checked_${compKey}_${roleKey}`) || "0");
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  
  document.getElementById("dash-roadmap-progress").textContent = `${pct}%`;
  document.getElementById("dash-roadmap-bar").style.width = `${pct}%`;
  document.getElementById("dash-roadmap-trend").textContent = `${checked} of ${total} skills completed`;

  lucide.createIcons();
}

// ==========================================================================
// 5. COMPANY PREPARATION VIEWS
// ==========================================================================

function renderCompanyListCards() {
  const container = document.getElementById("company-grid-container");
  if (!container) return;

  const searchVal = document.getElementById("company-search-input").value.trim().toLowerCase();
  const filterCat = document.getElementById("company-filter-category").value;

  container.innerHTML = "";

  const filtered = companiesData.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchVal) || comp.description.toLowerCase().includes(searchVal);
    const matchesCat = (filterCat === "all") || (comp.category === filterCat);
    return matchesSearch && matchesCat;
  });

  filtered.forEach(comp => {
    const card = document.createElement("div");
    card.className = "glass-card company-card interactive";
    card.onclick = () => openCompanyDetails(comp.id);
    card.innerHTML = `
      <div class="company-card-header">
        <div class="company-card-logo" style="background-color:${comp.logoBg};">${comp.logoText}</div>
        <div class="company-meta-info">
          <span class="company-title">${comp.name}</span>
          <span class="company-loc">${comp.location}</span>
        </div>
      </div>
      <p class="company-desc">${comp.description}</p>
      
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:12px;">
        <span class="user-tier" style="font-size:0.75rem;">TC: ${comp.salary.levels[0].tc} avg</span>
        <span class="company-tag" style="background-color:rgba(16,185,129,0.1); color:var(--success); font-weight:600;">
          ${comp.hiringVelocity} Hiring
        </span>
      </div>
    `;
    container.appendChild(card);
  });

  // Bind live filters
  document.getElementById("company-search-input").oninput = renderCompanyListCards;
  document.getElementById("company-filter-category").onchange = renderCompanyListCards;
}

function openCompanyDetails(companyId) {
  const comp = companiesData.find(c => c.id === companyId);
  if (!comp) return;

  const listPane = document.getElementById("company-list-pane");
  const detailPane = document.getElementById("company-detail-pane");

  listPane.style.display = "none";
  detailPane.style.display = "block";
  detailPane.innerHTML = `
    <button class="btn-secondary-outline" onclick="closeCompanyDetails()" style="margin-bottom:20px;">
      <i data-lucide="arrow-left"></i> Back to Database
    </button>
    
    <div class="glass-card detail-header-card">
      <div style="display:flex; align-items:center; gap:20px;">
        <div class="company-card-logo" style="background-color:${comp.logoBg}; width:64px; height:64px; font-size:2rem;">${comp.logoText}</div>
        <div>
          <h2>${comp.name} Prep Dashboard</h2>
          <p class="subtitle" style="margin-top:2px;">${comp.location} • ${comp.category} Category</p>
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <button class="btn-secondary-outline" onclick="triggerCompanyRoadmap('${comp.id}')">
          <i data-lucide="git-branch"></i> Generate Path
        </button>
        <button class="btn-primary-glow" onclick="navigateTo('coach-view')">
          <i data-lucide="message-square"></i> Interview Coach
        </button>
      </div>
    </div>
    
    <div class="detail-tabs-nav">
      <button class="detail-tab-btn active" onclick="switchDetailTab(this, 'overview-sec')">Overview</button>
      <button class="detail-tab-btn" onclick="switchDetailTab(this, 'hiring-sec')">Hiring Process</button>
      <button class="detail-tab-btn" onclick="switchDetailTab(this, 'skills-sec')">Required Skills</button>
      <button class="detail-tab-btn" onclick="switchDetailTab(this, 'qa-sec')">Interview Q&As</button>
      <button class="detail-tab-btn" onclick="switchDetailTab(this, 'tips-sec')">Resume/Interview Tips</button>
      <button class="detail-tab-btn" onclick="switchDetailTab(this, 'salary-sec')">Salary Benchmarks</button>
    </div>
    
    <!-- SUB-SECTION 1: OVERVIEW -->
    <div id="overview-sec" class="company-sub-section active" style="margin-top:24px;">
      <div class="glass-card">
        <h3>About ${comp.name}</h3>
        <p style="margin-top:12px; line-height:1.6; color:var(--text-secondary);">${comp.description}</p>
        
        <h4 style="margin-top:24px;">Eligibility Requirements</h4>
        <ul style="list-style-type:disc; padding-left:20px; margin-top:10px; color:var(--text-secondary); display:flex; flex-direction:column; gap:8px; font-size:0.9rem;">
          <li><strong>Education:</strong> ${comp.eligibility.education}</li>
          <li><strong>Target Tracks:</strong> ${comp.eligibility.experience}</li>
          <li><strong>Visa Sponsorship:</strong> ${comp.eligibility.sponsorship}</li>
        </ul>
      </div>
    </div>
    
    <!-- SUB-SECTION 2: HIRING PROCESS -->
    <div id="hiring-sec" class="company-sub-section" style="margin-top:24px;">
      <div class="glass-card">
        <h3>Interview Progression pipeline</h3>
        <p class="subtitle">Typical duration is ${comp.hiringProcess.duration} with a success rate of approx ${comp.hiringProcess.successRate}.</p>
        
        <div class="rounds-timeline">
          ${comp.hiringProcess.rounds.map((round, idx) => `
            <div class="round-node animate-slide">
              <div class="round-title">Round ${idx+1}: ${round.title}</div>
              <div class="round-desc">${round.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    
    <!-- SUB-SECTION 3: REQUIRED SKILLS -->
    <div id="skills-sec" class="company-sub-section" style="margin-top:24px;">
      <div class="grid-2">
        <div class="glass-card">
          <h3>Technical Stack Focus</h3>
          <p class="subtitle">Core skills tested in software loops.</p>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
            ${comp.techSkills.map(s => `
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:6px; font-size:0.875rem;">
                <strong>${s.name}</strong>
                <span class="user-tier">${s.level}</span>
              </div>
            `).join("")}
          </div>
        </div>
        
        <div class="glass-card">
          <h3>Behavioral & Core Values</h3>
          <p class="subtitle">Cultural competencies interviewer panels score you on.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:16px;">
            ${comp.softSkills.map(s => `<span class="company-tag" style="font-size:0.8rem; padding:6px 12px; border-radius:20px;">${s}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
    
    <!-- SUB-SECTION 4: Q&As -->
    <div id="qa-sec" class="company-sub-section" style="margin-top:24px;">
      <div class="glass-card">
        <h3>Common Interview Scenarios</h3>
        <p class="subtitle">Top questions asked in technical panel reviews.</p>
        
        <div style="margin-top:20px;">
          ${comp.faq.map((q, idx) => `
            <div class="faq-qa-card">
              <div class="faq-qa-question">
                <span>Q${idx+1}: ${q.question}</span>
                ${q.lcLink ? `<a href="${q.lcLink}" target="_blank" class="lc-link"><i data-lucide="code"></i> Solve [LeetCode]</a>` : ""}
              </div>
              <div class="faq-qa-answer"><strong>AI Strategy:</strong> ${q.answer}</div>
            </div>
          `).join("")}
          ${comp.faq.length === 0 ? '<p style="color:var(--text-muted);">Questions directory loading soon.</p>' : ''}
        </div>
      </div>
    </div>

    <!-- SUB-SECTION 5: TIPS -->
    <div id="tips-sec" class="company-sub-section" style="margin-top:24px;">
      <div class="grid-2">
        <div class="glass-card">
          <h3>Resume Strategy</h3>
          <ul style="list-style-type:square; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:10px; font-size:0.875rem;">
            ${comp.resumeTips.map(tip => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
        
        <div class="glass-card">
          <h3>Interview Strategy</h3>
          <ul style="list-style-type:circle; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:10px; font-size:0.875rem;">
            ${comp.interviewTips.map(tip => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
    
    <!-- SUB-SECTION 6: SALARY -->
    <div id="salary-sec" class="company-sub-section" style="margin-top:24px;">
      <div class="glass-card">
        <h3>Compensation Packages (Levels.fyi Data Integration)</h3>
        <p class="subtitle">Estimated base and total compensation averages by level.</p>
        
        <table style="width:100%; border-collapse:collapse; margin-top:20px; text-align:left; font-size:0.875rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary);">
              <th style="padding-bottom:10px;">Level</th>
              <th>Base Salary</th>
              <th>Total Comp (Stocks + Bonus)</th>
            </tr>
          </thead>
          <tbody>
            ${comp.salary.levels.map(lvl => `
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px 0; font-weight:600;">${lvl.name}</td>
                <td>${lvl.base}</td>
                <td style="color:var(--primary); font-weight:700;">${lvl.tc}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function closeCompanyDetails() {
  document.getElementById("company-list-pane").style.display = "block";
  document.getElementById("company-detail-pane").style.display = "none";
}

function switchDetailTab(btn, secId) {
  // Toggle tab buttons active
  const tabs = btn.parentNode.querySelectorAll(".detail-tab-btn");
  tabs.forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  // Toggle sections active
  const sections = document.querySelectorAll(".company-sub-section");
  sections.forEach(s => {
    if (s.id === secId) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
}

function triggerCompanyRoadmap(companyId) {
  document.getElementById("roadmap-select-company").value = companyId;
  navigateTo("roadmap-view");
  generateActiveRoadmap();
}

// ==========================================================================
// 6. SKILL ROADMAP TIMELINE
// ==========================================================================

function generateActiveRoadmap() {
  const companyKey = document.getElementById("roadmap-select-company").value;
  const roleKey = document.getElementById("roadmap-select-role").value;

  const targetName = companiesData.find(c => c.id === companyKey)?.name || "Target Company";
  const titleText = `${targetName} ${roleKey.charAt(0).toUpperCase() + roleKey.slice(1)} Engineer Roadmap`;
  
  document.getElementById("roadmap-title-text").textContent = titleText;

  const timelineContainer = document.getElementById("roadmap-timeline-container");
  if (!timelineContainer) return;

  const phases = roadmapsData[roleKey] || [];
  timelineContainer.innerHTML = "";

  if (phases.length === 0) {
    timelineContainer.innerHTML = `<p style="color:var(--text-muted); padding:20px;">No customized timeline generated for this role yet.</p>`;
    return;
  }

  let globalSkillIdx = 0;
  const flatSkills = [];
  phases.forEach(phase => phase.skills.forEach(s => flatSkills.push(s)));

  phases.forEach((phase, pidx) => {
    const phaseNode = document.createElement("div");
    phaseNode.className = "roadmap-phase-card animate-slide";
    
    // Header row
    phaseNode.innerHTML = `
      <div class="roadmap-phase-circle" id="phase-circle-${pidx}"><i data-lucide="check"></i></div>
      <div class="roadmap-phase-title-row">
        <span class="roadmap-phase-title">${phase.title}</span>
        <span class="company-tag">${phase.duration}</span>
      </div>
      <div class="roadmap-skills-list" id="phase-skills-list-${pidx}">
        <!-- Skill items row -->
      </div>
    `;
    timelineContainer.appendChild(phaseNode);

    const list = document.getElementById(`phase-skills-list-${pidx}`);
    phase.skills.forEach(skill => {
      const idx = globalSkillIdx++;
      const item = document.createElement("div");
      item.className = "roadmap-skill-item animate-fade";
      item.id = `skill-row-${companyKey}-${roleKey}-${idx}`;
      
      const storageKey = `roadmap_checked_${companyKey}_${roleKey}_${idx}`;
      const isChecked = localStorage.getItem(storageKey) === "true";

      item.innerHTML = `
        <div class="roadmap-skill-header">
          <div class="roadmap-skill-left">
            <input type="checkbox" class="roadmap-checkbox" data-idx="${idx}" ${isChecked ? 'checked' : ''} style="width:16px; height:16px; accent-color:var(--success);">
            <div>
              <span class="roadmap-skill-title">${skill.title}</span>
              <div class="roadmap-skill-duration">${skill.duration} • ${skill.desc}</div>
            </div>
          </div>
          <span class="resource-drawer-btn" data-company="${companyKey}" data-role="${roleKey}" data-idx="${idx}" data-title="${skill.title}" data-desc="${skill.desc}" onclick="handleResourceDrawerClick(this)">Resources</span>
        </div>
        
        <div class="resources-drawer" id="resources-drawer-${companyKey}-${roleKey}-${idx}">
          <!-- Dynamically loaded on click -->
        </div>
      `;
      list.appendChild(item);
    });
  });

  lucide.createIcons();

  // Save total count of skills
  localStorage.setItem(`roadmap_total_${companyKey}_${roleKey}`, globalSkillIdx);

  // Bind checkboxes trigger
  const checkboxes = document.querySelectorAll(".roadmap-checkbox");
  checkboxes.forEach(cb => {
    cb.onchange = (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const skill = flatSkills[idx];
      
      // Resolve current cached or fallback resources
      const expLevel = localStorage.getItem("onestep_experience_level") || "mid";
      const cacheKey = `onestep_cache_resources_${roleKey}_${companyKey}_${skill.title.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase()}_${expLevel}`;
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      const resourcesObj = cached || skill.resources;
      
      handleSkillCheckboxChange(companyKey, roleKey, idx, e.target.checked, resourcesObj);
    };
  });

  calculateRoadmapCompletion(companyKey, roleKey);

  document.getElementById("btn-generate-roadmap").onclick = generateActiveRoadmap;
}

function calculateRoadmapCompletion(companyKey, roleKey) {
  const total = parseInt(localStorage.getItem(`roadmap_total_${companyKey}_${roleKey}`) || "0");
  let checkedCount = 0;
  
  for (let i = 0; i < total; i++) {
    if (localStorage.getItem(`roadmap_checked_${companyKey}_${roleKey}_${i}`) === "true") {
      checkedCount++;
    }
  }

  localStorage.setItem(`roadmap_checked_${companyKey}_${roleKey}`, checkedCount);

  // Calculate percentage
  const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  document.getElementById("roadmap-progress-percent").textContent = `${pct}%`;

  // Draw check circle headers states
  const phases = roadmapsData[roleKey] || [];
  let skillIdx = 0;
  phases.forEach((phase, idx) => {
    let phaseAllDone = true;
    phase.skills.forEach(() => {
      if (localStorage.getItem(`roadmap_checked_${companyKey}_${roleKey}_${skillIdx}`) !== "true") {
        phaseAllDone = false;
      }
      skillIdx++;
    });

    const circle = document.getElementById(`phase-circle-${idx}`);
    if (circle) {
      if (phaseAllDone && phase.skills.length > 0) {
        circle.classList.add("checked");
      } else {
        circle.classList.remove("checked");
      }
    }
  });
}

function toggleResourceDrawer(companyKey, roleKey, idx) {
  const drawer = document.getElementById(`resources-drawer-${companyKey}-${roleKey}-${idx}`);
  if (drawer) {
    if (drawer.style.display === "flex") {
      drawer.style.display = "none";
    } else {
      drawer.style.display = "flex";
      drawer.classList.add("animate-fade");
    }
  }
}

// ==========================================================================
// 7. AI CAREER COACH CHAT
// ==========================================================================

function initChatBot() {
  const sendBtn = document.getElementById("btn-chat-send");
  const input = document.getElementById("chat-input-field");

  if (!sendBtn || !input) return;

  sendBtn.onclick = handleSendChatMessage;
  input.onkeypress = (e) => {
    if (e.key === "Enter") handleSendChatMessage();
  };
}

function sendPromptChip(text) {
  document.getElementById("chat-input-field").value = text;
  handleSendChatMessage();
}

function handleSendChatMessage() {
  const input = document.getElementById("chat-input-field");
  const message = input.value.trim();
  if (!message) return;

  // Append user bubble
  appendChatBubble(message, "user");
  input.value = "";

  // Append typing loader
  const messagesContainer = document.getElementById("chat-messages-container");
  const typingNode = document.createElement("div");
  typingNode.className = "chat-msg coach typing-loader";
  typingNode.innerHTML = `
    <div style="display:flex; gap:4px; align-items:center; height:20px;">
      <span style="animation: pulse 1s infinite alternate; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%;"></span>
      <span style="animation: pulse 1s infinite alternate 0.2s; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%;"></span>
      <span style="animation: pulse 1s infinite alternate 0.4s; width:6px; height:6px; background-color:var(--text-muted); border-radius:50%;"></span>
    </div>
  `;
  messagesContainer.appendChild(typingNode);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Generate reply
  const company = localStorage.getItem("onestep_target_company") || "google";
  
  setTimeout(() => {
    typingNode.remove();
    const reply = getCoachResponse(message, resumeData, company);
    
    // Parse simple markdown headers and links inside responses
    const formattedReply = reply
      .replace(/### (.*?)\n/g, '<h4 style="margin-bottom:6px; font-weight:700; color:var(--primary);">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/-\s+(.*?)\n/g, '<li>$1</li>')
      .replace(/❌ (.*?)\n/g, '<li style="list-style-type:none; color:var(--error);">❌ $1</li>')
      .replace(/✅ (.*?)\n/g, '<li style="list-style-type:none; color:var(--success);">✅ $1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--info); text-decoration:underline;">$1</a>');

    appendChatBubble(formattedReply, "coach", true);
  }, 1000 + Math.random()*800);
}

function appendChatBubble(text, sender, isHTML = false) {
  const container = document.getElementById("chat-messages-container");
  const node = document.createElement("div");
  node.className = `chat-msg ${sender} animate-fade`;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isHTML) {
    node.innerHTML = `
      <div style="font-size:0.875rem; line-height:1.5;">${text}</div>
      <span class="chat-msg-time">${time}</span>
    `;
  } else {
    node.innerHTML = `
      <p>${escapeHTML(text)}</p>
      <span class="chat-msg-time">${time}</span>
    `;
  }
  
  container.appendChild(node);
  container.scrollTop = container.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// All support chatbot logic is now handled in support-chat.js

// ==========================================================================
// 8. COVER LETTER GENERATOR
// ==========================================================================

const coverLetterTemplates = [
  // Var 1: Metric Focused
  `Dear Hiring Team,

I am writing to express my strong interest in the [Role] position at [Company]. With over 3 years of software engineering experience deploying scalable, user-facing systems, I am excited about the opportunity to bring my development craft to your engineering loops.

In my recent position as a Software Engineer at Google, I led storage API optimizations that successfully boosted throughput capacities by 35% and dropped technical CPU load by 25%. Additionally, during my work with Stripe, I integrated core gateway endpoints resolving parallel webhook concurrency conditions to guarantee 99.99% payment transaction integrity. I thrive when building clean API definitions and refactoring systems to reduce operational latency.

[Company]'s technical direction aligns closely with my engineering values. I would welcome the opportunity to discuss how my metrics-driven approach can contribute to your upcoming projects. Thank you for your consideration.

Sincerely,
[Name]`,
  
  // Var 2: Mission Focused
  `Dear Hiring Manager,

As a developer who follows [Company]'s engineering blog, I have long admired your team's dedication to architectural craftsmanship. When I saw the opening for the [Role] position, I knew I had to apply.

My background is built on delivering high-impact solutions for complex environments. I believe that engineering is as much about communication as it is about clean code. My experience includes redesigning PostgreSQL schemas, caching active session records, and migrating legacy JVM pipelines over to Go. What excites me most about [Company] is [Motivation]. I am eager to apply my technical background to a culture that values developer velocity and customer-first design.

I look forward to discussing how my experience with scalable services fits your team's long-term objectives.

Best regards,
[Name]`,

  // Var 3: Concise
  `Dear [Manager],

Please accept this application for the [Role] role at [Company]. 

I am a Software Engineer with a track record of building performant distributed systems. In my previous roles, I have:
- Re-engineered legacy controllers, decreasing endpoint latency from 680ms to 240ms.
- Built a custom memory file cache system in Go, achieving 15,000 queries/sec.
- Mentored junior engineers and helped structure agile release lifecycles.

I am enthusiastic about the prospects of joining [Company] and contributing to your core codebase. Thank you for your time.

Sincerely,
[Name]`
];

function initCoverLetterGen() {
  document.getElementById("btn-generate-coverletter").onclick = () => {
    const company = document.getElementById("cl-company").value.trim() || "Stripe";
    const role = document.getElementById("cl-role").value.trim() || "Backend Software Engineer";
    const manager = document.getElementById("cl-manager").value.trim() || "Hiring Team";
    const motivation = document.getElementById("cl-motivation").value.trim() || "your dedication to developer experiences.";
    const variationIdx = parseInt(document.getElementById("cl-variation-select").value);

    // Populate template fields
    let template = coverLetterTemplates[variationIdx];
    let letter = template
      .replace(/\[Company\]/g, company)
      .replace(/\[Role\]/g, role)
      .replace(/\[Manager\]/g, manager)
      .replace(/\[Motivation\]/g, motivation)
      .replace(/\[Name\]/g, resumeData.name);

    document.getElementById("cl-output-text").value = letter;
    showToastNotification("Cover letter variation drafted.");
  };

  // Re-generate on selector change
  document.getElementById("cl-variation-select").onchange = () => {
    document.getElementById("btn-generate-coverletter").click();
  };

  // Copy letter
  document.getElementById("btn-copy-coverletter").onclick = () => {
    const text = document.getElementById("cl-output-text").value;
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToastNotification("Copied cover letter to clipboard!");
  };

  document.getElementById("btn-download-coverletter").onclick = () => {
    alert("Triggered PDF compilation. Your browser print dialog will launch; select save to PDF.");
    window.print();
  };
}

// ==========================================================================
// 9. PORTFOLIO WEBSITE GENERATOR
// ==========================================================================

function initPortfolioBuilder() {
  document.getElementById("btn-deploy-portfolio").onclick = () => {
    showToastNotification("Compiling assets and staging to Vercel CDN...");
    setTimeout(() => {
      showToastNotification("Domain linked! Portfolio is live at sjenkins.onestep.bio");
    }, 1200);
  };

  document.getElementById("btn-open-portfolio-window").onclick = () => {
    const iframe = document.getElementById("portfolio-preview-iframe");
    const newWin = window.open();
    newWin.document.write(iframe.srcdoc);
    newWin.document.close();
  };

  // Redraw on settings changes
  const inputs = ["pf-theme", "pf-custom-slug", "pf-show-exp", "pf-show-proj", "pf-show-skills"];
  inputs.forEach(id => {
    document.getElementById(id).onchange = compileLivePortfolio;
  });
  
  compileLivePortfolio();
}

function compileLivePortfolio() {
  const theme = document.getElementById("pf-theme").value;
  const slug = document.getElementById("pf-custom-slug").value || "sjenkins";
  const showExp = document.getElementById("pf-show-exp").checked;
  const showProj = document.getElementById("pf-show-proj").checked;
  const showSkills = document.getElementById("pf-show-skills").checked;

  document.getElementById("portfolio-live-url").textContent = `Live URL: ${slug}.onestep.bio`;

  // Establish theme specific CSS colors
  let cssVariables = "";
  if (theme === "dark-nebula") {
    cssVariables = `
      --bg: #090a0f;
      --card-bg: rgba(20, 23, 34, 0.65);
      --border: rgba(255,255,255,0.08);
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      --tag-bg: #1e1b4b;
      --tag-color: #a5b4fc;
    `;
  } else if (theme === "minimalist-light") {
    cssVariables = `
      --bg: #ffffff;
      --card-bg: #f8fafc;
      --border: rgba(15,23,42,0.08);
      --text: #0f172a;
      --muted: #475569;
      --accent: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      --tag-bg: #e0f2fe;
      --tag-color: #0369a1;
    `;
  } else {
    // Retro Terminal Hacker
    cssVariables = `
      --bg: #050505;
      --card-bg: #0a0a0a;
      --border: #00ff00;
      --text: #00ff00;
      --muted: #008800;
      --accent: #00ff00;
      --tag-bg: #001100;
      --tag-color: #00ff00;
      font-family: 'JetBrains Mono', monospace !important;
    `;
  }

  // Compile sections HTML based on checkboxes
  let expHTML = "";
  if (showExp) {
    expHTML = `
      <section class="section">
        <h2>Work Experience</h2>
        ${resumeData.experience.map(exp => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; font-weight:700;">
              <span>${exp.company}</span>
              <span class="muted">${exp.duration}</span>
            </div>
            <div style="font-weight:500; color:var(--muted); margin-bottom:8px;">${exp.role}</div>
            <ul>
              ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </section>
    `;
  }

  let projHTML = "";
  if (showProj) {
    projHTML = `
      <section class="section">
        <h2>Personal Projects</h2>
        ${resumeData.projects.map(proj => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; font-weight:700;">
              <span>${proj.title}</span>
              <a href="https://${proj.link}" target="_blank" style="color:var(--accent); font-size:0.8rem;">Link</a>
            </div>
            <p style="margin-top:6px; color:var(--muted); font-size:0.9rem;">${proj.desc}</p>
          </div>
        `).join("")}
      </section>
    `;
  }

  let skillsHTML = "";
  if (showSkills) {
    skillsHTML = `
      <section class="section">
        <h2>Skills Focus</h2>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${resumeData.skills.map(s => `<span class="tag">${s}</span>`).join("")}
        </div>
      </section>
    `;
  }

  // Final srcdoc assembly
  const srcdoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resumeData.name} - Portfolio</title>
      <style>
        :root {
          ${cssVariables}
        }
        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: system-ui, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
        }
        header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        h1 {
          font-size: 2.2rem;
          margin: 0 0 10px 0;
          background: var(--accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: ${theme === 'developer-terminal' ? 'var(--text)' : 'transparent'};
        }
        h2 {
          font-size: 1.4rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 6px;
          margin-top: 32px;
        }
        .card {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        ul {
          padding-left: 20px;
          margin: 0;
        }
        li {
          margin-bottom: 6px;
        }
        .muted {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .tag {
          background-color: var(--tag-bg);
          color: var(--tag-color);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>${resumeData.name}</h1>
          <p class="muted" style="font-size:1.1rem; margin:0 0 10px 0;">Software Systems Engineer</p>
          <div style="font-size:0.85rem; display:flex; gap:12px; flex-wrap:wrap;">
            <span>📧 ${resumeData.email}</span>
            <span>📱 ${resumeData.phone}</span>
            <span>📍 ${resumeData.location}</span>
            <span>🌐 ${resumeData.website}</span>
          </div>
        </header>
        
        <p style="font-size:1.05rem; margin-bottom:30px;">${resumeData.summary}</p>
        
        ${expHTML}
        ${projHTML}
        ${skillsHTML}
      </div>
    </body>
    </html>
  `;

  document.getElementById("portfolio-preview-iframe").srcdoc = srcdoc;
}

// ==========================================================================
// 10. GLOBAL SYSTEM NOTIFIER (Toasts Helper)
// ==========================================================================

function showToastNotification(text) {
  // Check or create container
  let container = document.getElementById("toast-notifier-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-notifier-container";
    container.style.position = "fixed";
    container.style.top = "24px";
    container.style.right = "24px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    document.body.appendChild(container);
  }

  // Create toast bubble
  const toast = document.createElement("div");
  toast.style.background = "var(--bg-sidebar)";
  toast.style.color = "var(--text-primary)";
  toast.style.border = "1px solid var(--border-color)";
  toast.style.borderRadius = "8px";
  toast.style.padding = "12px 20px";
  toast.style.fontSize = "0.85rem";
  toast.style.fontWeight = "500";
  toast.style.boxShadow = "var(--shadow-lg)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "10px";
  toast.style.minWidth = "220px";
  toast.style.animation = "fadeIn 0.2s forwards";
  
  toast.innerHTML = `
    <i data-lucide="info" style="width:16px; height:16px; color:var(--primary);"></i>
    <span>${text}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = "fadeIn 0.2s reverse forwards";
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Global hook for plan clicks
function selectPricingPlan(tier) {
  localStorage.setItem("onestep_user_tier", `${tier} Tier`);
  document.getElementById("sidebar-usertier").textContent = `${tier} Tier`;
  showToastNotification(`Successfully subscribed to the ${tier} plan!`);
  updateDashboardMetrics();
}

// ==========================================================================
// SUPABASE DATABASE SYNC MODULE
// ==========================================================================

function initSupabase() {
  const url = localStorage.getItem("onestep_supabase_url");
  const key = localStorage.getItem("onestep_supabase_key");
  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      console.log("Supabase Client initialized successfully!");
      return true;
    } catch (e) {
      console.error("Failed to initialize Supabase client:", e);
    }
  }
  supabaseClient = null;
  return false;
}

async function syncSupabaseProgress() {
  if (!supabaseClient) return;
  const username = localStorage.getItem("onestep_username") || "Sarah Jenkins";
  try {
    const { data, error } = await supabaseClient
      .from("onestep_resource_progress")
      .select("resource_id, bookmarked, completed, meta")
      .eq("username", username);
      
    if (error) {
      console.warn("Could not fetch progress from Supabase (table may not exist yet):", error.message);
      return;
    }
    
    if (data) {
      const cacheKey = "onestep_resource_progress_cache";
      const progress = JSON.parse(localStorage.getItem(cacheKey) || "{}");
      
      data.forEach(row => {
        progress[row.resource_id] = {
          bookmarked: row.bookmarked,
          completed: row.completed,
          ...(row.meta ? { meta: row.meta } : {})
        };
      });
      
      localStorage.setItem(cacheKey, JSON.stringify(progress));
      console.log("Synchronized progress from Supabase successfully!");
    }
  } catch (e) {
    console.error("Error during Supabase progress sync:", e);
  }
}

function getResourceState(progressKey, field) {
  const progress = JSON.parse(localStorage.getItem("onestep_resource_progress_cache") || "{}");
  if (progress[progressKey]) {
    return !!progress[progressKey][field];
  }
  return false;
}

async function saveResourceState(progressKey, field, value, resourceMeta = null) {
  const cacheKey = "onestep_resource_progress_cache";
  const progress = JSON.parse(localStorage.getItem(cacheKey) || "{}");
  if (!progress[progressKey]) {
    progress[progressKey] = { bookmarked: false, completed: false };
  }
  progress[progressKey][field] = value;
  
  if (field === "bookmarked") {
    if (value && resourceMeta) {
      progress[progressKey].meta = resourceMeta;
    } else if (!value) {
      delete progress[progressKey].meta;
    }
  }
  
  localStorage.setItem(cacheKey, JSON.stringify(progress));
  
  // Upsert to Supabase
  if (supabaseClient) {
    const username = localStorage.getItem("onestep_username") || "Sarah Jenkins";
    const payload = {
      username,
      resource_id: progressKey,
      bookmarked: progress[progressKey].bookmarked,
      completed: progress[progressKey].completed,
      updated_at: new Date()
    };
    if (progress[progressKey].meta) {
      payload.meta = progress[progressKey].meta;
    }
    
    try {
      const { error } = await supabaseClient
        .from("onestep_resource_progress")
        .upsert(payload, { onConflict: "username,resource_id" });
      if (error) {
        console.warn("Supabase progress save failed:", error.message);
      }
    } catch (e) {
      console.error("Supabase upsert exception:", e);
    }
  }
}

// ==========================================================================
// DYNAMIC RESOURCE GENERATION (GEMINI AI)
// ==========================================================================

async function fetchGeminiResources(skillTitle, skillDesc, roleKey, companyKey, experienceLevel) {
  const apiKey = localStorage.getItem("onestep_gemini_api_key");
  const normalizedTitle = skillTitle.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  const cacheKey = `onestep_cache_resources_${roleKey}_${companyKey}_${normalizedTitle}_${experienceLevel}`;
  
  // Check localStorage cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error("Failed to parse cached resources:", e);
    }
  }

  // If no API key, compile fallbacks directly
  if (!apiKey) {
    console.log("No Gemini API Key provided. Loading pre-curated fallback resources.");
    const fallback = getFallbackResources(skillTitle, roleKey);
    localStorage.setItem(cacheKey, JSON.stringify(fallback));
    return fallback;
  }

  const targetName = companiesData.find(c => c.id === companyKey)?.name || "Target Company";
  const roleName = roleKey === "backend" ? "Backend Engineer" : "Frontend Engineer";
  
  const prompt = `You are an expert technical career coach. Generate a JSON object containing 10 curated learning resources for the skill "${skillTitle}" (description: "${skillDesc}"), for someone targeting a "${roleName}" role at "${targetName}" with a "${experienceLevel}" experience level.
The resources must be grouped exactly into the following categories:
- videos (video tutorials or walkthroughs, e.g. YouTube, Coursera)
- documentation (official guides, documentations, reference papers)
- practice (hands-on exercises, coding challenges, platforms like LeetCode, GitHub repos with templates)
- projects (guided projects, step-by-step build tutorials, open-source projects to replicate)
- certifications (relevant certification preparation or courses)

Each category must contain exactly 2 resources.
For each resource, you MUST provide:
- name: The specific title of the course/tutorial/video/documentation (do not include generic text)
- url: The EXACT deep link to the recommended learning page or specific video (DO NOT link to the homepage of the platform like youtube.com, udemy.com, etc. Provide the actual course URL, video URL, GitHub URL, or documentation page).
- type: Either "free" or "paid"
- duration: Estimated study or completion time (e.g. "30 mins", "4 hours", "2 days", "3 weeks")
- difficulty: One of "Beginner", "Intermediate", "Advanced"

Provide the output ONLY as a raw JSON object matching this structure:
{
  "videos": [{"name": "...", "url": "...", "type": "...", "duration": "...", "difficulty": "..."}],
  "documentation": [...],
  "practice": [...],
  "projects": [...],
  "certifications": [...]
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }
    
    const resJson = await response.json();
    const rawText = resJson.candidates[0].content.parts[0].text;
    
    // Clean output in case response has markdown wrapper
    let cleanText = rawText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    const data = JSON.parse(cleanText.trim());
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn("Gemini AI API call failed, using fallback resources database:", err.message);
    const fallback = getFallbackResources(skillTitle, roleKey);
    return fallback;
  }
}

function getFallbackResources(skillTitle, roleKey) {
  const skills = roadmapsData[roleKey] || [];
  for (const phase of skills) {
    const match = phase.skills.find(s => s.title.toLowerCase() === skillTitle.toLowerCase());
    if (match) {
      return match.resources;
    }
  }
  
  // Empty template fallback
  return { videos: [], documentation: [], practice: [], projects: [], certifications: [] };
}

// ==========================================================================
// INTERACTIVE RESOURCE DRAWER HANDLERS
// ==========================================================================

async function handleResourceDrawerClick(btn) {
  const companyKey = btn.dataset.company;
  const roleKey = btn.dataset.role;
  const idx = parseInt(btn.dataset.idx);
  const skillTitle = btn.dataset.title;
  const skillDesc = btn.dataset.desc;
  
  const drawer = document.getElementById(`resources-drawer-${companyKey}-${roleKey}-${idx}`);
  if (!drawer) return;
  
  if (drawer.style.display === "flex") {
    drawer.style.display = "none";
    drawer.classList.remove("active");
  } else {
    drawer.style.display = "flex";
    drawer.classList.add("active");
    
    // Show dynamic loader state
    drawer.innerHTML = `
      <div class="gemini-loading-container">
        <i data-lucide="sparkles" class="gemini-sparkle-loader" style="width:24px; height:24px;"></i>
        <span style="font-size:0.8rem; font-weight:500;">AI is curating personalized resources for you...</span>
      </div>
    `;
    lucide.createIcons();
    
    // Fetch (Gemini or cached/fallback)
    const expLevel = localStorage.getItem("onestep_experience_level") || "mid";
    const resources = await fetchGeminiResources(skillTitle, skillDesc, roleKey, companyKey, expLevel);
    
    // Render the resources
    renderResourceDrawerContent(companyKey, roleKey, idx, skillTitle, resources, drawer);
  }
}

function renderResourceDrawerContent(companyKey, roleKey, skillIdx, skillTitle, resources, drawer) {
  const categories = [
    { key: "videos", label: "Videos", icon: "video" },
    { key: "documentation", label: "Documentation", icon: "book-open" },
    { key: "practice", label: "Practice", icon: "code" },
    { key: "projects", label: "Projects", icon: "git-pull-request" },
    { key: "certifications", label: "Certifications", icon: "award" }
  ];
  
  let html = "";
  
  // Sync Connection Header
  const hasDb = !!supabaseClient;
  html += `
    <div class="sync-status-indicator animate-fade">
      <span class="sync-dot ${hasDb ? 'connected' : 'local'}"></span>
      <span>${hasDb ? 'Connected to Supabase Cloud' : 'Syncing locally (Configure Supabase in settings to sync in Cloud)'}</span>
    </div>
  `;
  
  let renderedAny = false;
  
  categories.forEach(cat => {
    const list = resources[cat.key] || [];
    if (list.length === 0) return;
    
    renderedAny = true;
    
    html += `
      <div class="resource-group-box animate-slide">
        <div class="resource-group-title">
          <i data-lucide="${cat.icon}" style="width:14px; height:14px;"></i>
          <span>${cat.label}</span>
        </div>
        <div class="resource-items-list">
          ${list.map((r, rIdx) => {
            const progressKey = `${companyKey}_${roleKey}_${skillIdx}_${cat.key}_${rIdx}`;
            const isCompleted = getResourceState(progressKey, "completed");
            const isBookmarked = getResourceState(progressKey, "bookmarked");
            
            // Assemble metadata object for bookmark recovery
            const metaObj = JSON.stringify({
              name: r.name,
              url: r.url,
              category: cat.label,
              difficulty: r.difficulty,
              duration: r.duration,
              companyKey,
              roleKey,
              skillIdx,
              categoryKey: cat.key,
              rIdx
            }).replace(/"/g, '&quot;');
            
            return `
              <div class="resource-item-card">
                <div class="resource-item-main">
                  <input type="checkbox" class="resource-completed-checkbox" 
                         data-progress-key="${progressKey}"
                         onchange="toggleResourceCompletion('${companyKey}', '${roleKey}', ${skillIdx}, '${cat.key}', ${rIdx}, this.checked)"
                         ${isCompleted ? 'checked' : ''}>
                  <div class="resource-item-details">
                    <span class="resource-item-name">${r.name}</span>
                    <div class="resource-item-meta">
                      <span class="resource-badge ${r.type.toLowerCase()}">${r.type.toUpperCase()}</span>
                      <span class="resource-meta-dot"></span>
                      <span>${r.duration}</span>
                      <span class="resource-meta-dot"></span>
                      <span>${r.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div class="resource-item-actions">
                  <button class="btn-bookmark-resource ${isBookmarked ? 'active' : ''}" 
                          onclick="toggleResourceBookmark('${companyKey}', '${roleKey}', ${skillIdx}, '${cat.key}', ${rIdx}, this, '${metaObj}')" 
                          title="Bookmark Resource">
                    <i data-lucide="star" style="width:14px; height:14px;"></i>
                  </button>
                  <a href="${r.url}" target="_blank" class="btn-link-resource" title="Open Learning Page">
                    <i data-lucide="external-link" style="width:14px; height:14px;"></i>
                  </a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  });
  
  if (!renderedAny) {
    html += `<p style="color:var(--text-secondary); font-size:0.775rem; padding:10px;">No customized resources generated yet.</p>`;
  }
  
  drawer.innerHTML = html;
  lucide.createIcons();
}

// Toggle resource completion status
async function toggleResourceCompletion(companyKey, roleKey, skillIdx, categoryKey, rIdx, isChecked) {
  const progressKey = `${companyKey}_${roleKey}_${skillIdx}_categoryKey_${rIdx}`.replace("categoryKey", categoryKey);
  
  // Load active resource set to check total items
  const expLevel = localStorage.getItem("onestep_experience_level") || "mid";
  const skillObj = getSkillObjectByIndex(roleKey, skillIdx);
  const cacheKey = `onestep_cache_resources_${roleKey}_${companyKey}_${skillObj.title.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase()}_${expLevel}`;
  const cached = JSON.parse(localStorage.getItem(cacheKey));
  const resources = cached || skillObj.resources;
  
  // Save to localStorage/Supabase
  await saveResourceState(progressKey, "completed", isChecked);
  
  // Update parent skill checkbox state
  updateSkillCheckboxFromResources(companyKey, roleKey, skillIdx, resources);
}

// Toggle bookmark status
async function toggleResourceBookmark(companyKey, roleKey, skillIdx, categoryKey, rIdx, btn, metaString) {
  const progressKey = `${companyKey}_${roleKey}_${skillIdx}_categoryKey_${rIdx}`.replace("categoryKey", categoryKey);
  const isBookmarked = btn.classList.contains("active");
  const nextState = !isBookmarked;
  
  const metaObj = JSON.parse(metaString);
  
  btn.classList.toggle("active", nextState);
  
  // Save to localStorage/Supabase
  await saveResourceState(progressKey, "bookmarked", nextState, nextState ? metaObj : null);
  
  // Sync dashboard recommended section
  updateDashboardMetrics();
  
  if (nextState) {
    showToastNotification("Resource added to bookmarks.");
  } else {
    showToastNotification("Resource removed from bookmarks.");
  }
}

function updateSkillCheckboxFromResources(companyKey, roleKey, skillIdx, resources) {
  let totalCount = 0;
  let completedCount = 0;
  const categories = ["videos", "documentation", "practice", "projects", "certifications"];
  categories.forEach(cat => {
    if (resources[cat]) {
      resources[cat].forEach((r, rIdx) => {
        totalCount++;
        const progressKey = `${companyKey}_${roleKey}_${skillIdx}_${cat}_${rIdx}`;
        if (getResourceState(progressKey, "completed")) {
          completedCount++;
        }
      });
    }
  });
  
  const checkbox = document.querySelector(`.roadmap-checkbox[data-idx="${skillIdx}"]`);
  if (checkbox) {
    const shouldBeChecked = totalCount > 0 && completedCount === totalCount;
    checkbox.checked = shouldBeChecked;
    localStorage.setItem(`roadmap_checked_${companyKey}_${roleKey}_${skillIdx}`, shouldBeChecked ? "true" : "false");
    calculateRoadmapCompletion(companyKey, roleKey);
    updateDashboardMetrics();
  }
}

async function handleSkillCheckboxChange(companyKey, roleKey, skillIdx, isChecked, resources) {
  const key = `roadmap_checked_${companyKey}_${roleKey}_${skillIdx}`;
  localStorage.setItem(key, isChecked ? "true" : "false");
  
  // Auto-complete or auto-uncomplete all resources for this skill
  if (resources) {
    const categories = ["videos", "documentation", "practice", "projects", "certifications"];
    for (const cat of categories) {
      if (resources[cat]) {
        for (let rIdx = 0; rIdx < resources[cat].length; rIdx++) {
          const progressKey = `${companyKey}_${roleKey}_${skillIdx}_${cat}_${rIdx}`;
          await saveResourceState(progressKey, "completed", isChecked);
          
          // Update checkboxes inside DOM if drawer is expanded
          const resCheckbox = document.querySelector(`input[data-progress-key="${progressKey}"]`);
          if (resCheckbox) {
            resCheckbox.checked = isChecked;
          }
        }
      }
    }
  }
  
  calculateRoadmapCompletion(companyKey, roleKey);
  updateDashboardMetrics();
}

function getSkillObjectByIndex(roleKey, skillIdx) {
  const phases = roadmapsData[roleKey] || [];
  let globalIdx = 0;
  for (const phase of phases) {
    for (const skill of phase.skills) {
      if (globalIdx === skillIdx) {
        return skill;
      }
      globalIdx++;
    }
  }
  return null;
}

// Switch to roadmap tab and load skill drawer from dashboard bookmark clicks
function navigateToRoadmapAndOpen(companyKey, roleKey, skillIdx) {
  // Set selectors in roadmap view
  const compSel = document.getElementById("roadmap-select-company");
  const roleSel = document.getElementById("roadmap-select-role");
  if (compSel) compSel.value = companyKey;
  if (roleSel) roleSel.value = roleKey;
  
  navigateTo("roadmap-view");
  generateActiveRoadmap();
  
  // Delay expansion to allow timeline drawing animation
  setTimeout(() => {
    const drawerBtn = document.querySelector(`.resource-drawer-btn[data-idx="${skillIdx}"]`);
    if (drawerBtn) {
      drawerBtn.click();
      const item = document.getElementById(`skill-row-${companyKey}-${roleKey}-${skillIdx}`);
      if (item) {
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, 400);
}
