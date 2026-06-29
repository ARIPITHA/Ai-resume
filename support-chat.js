// OneStep AI - Advanced Support Chatbot Subsystem (Modular Engine)

// 1. ANALYTICS LOGGER & LOCAL STORAGE MANAGER
const supportAnalytics = {
  get() {
    const raw = localStorage.getItem("onestep_support_analytics");
    return raw ? JSON.parse(raw) : { mostAsked: {}, failedQueries: [], featureUsage: {}, supportRequests: 0 };
  },
  save(data) {
    localStorage.setItem("onestep_support_analytics", JSON.stringify(data));
    // Trigger update in Admin panel if visible
    if (typeof renderChatbotAnalytics === "function") {
      renderChatbotAnalytics();
    }
  },
  logQuery(query, matched) {
    const data = this.get();
    const cleanQuery = query.trim().substring(0, 100);
    if (!cleanQuery) return;
    if (matched) {
      data.mostAsked[cleanQuery] = (data.mostAsked[cleanQuery] || 0) + 1;
    } else {
      if (!data.failedQueries.includes(cleanQuery)) {
        data.failedQueries.push(cleanQuery);
      }
    }
    this.save(data);
  },
  logFeatureClick(feature) {
    const data = this.get();
    data.featureUsage[feature] = (data.featureUsage[feature] || 0) + 1;
    this.save(data);
  },
  logSupportRequest() {
    const data = this.get();
    data.supportRequests = (data.supportRequests || 0) + 1;
    this.save(data);
  }
};

// 2. CONVERSATION CONTEXT MEMORY
let supportChatContext = {
  lastTopic: null, // "resume", "ats", "company", "roadmap", "coach", "coverletter", "portfolio", "account", "billing"
  pronounReferences: ["it", "them", "that", "this", "there", "use it", "run it", "download it", "scan it", "do it", "upgrade it"]
};

// Resolve contextual pronouns based on history
function resolveSupportContext(query) {
  const words = query.toLowerCase().split(/\s+/);
  const containsPronoun = words.some(w => supportChatContext.pronounReferences.includes(w));
  if (containsPronoun && supportChatContext.lastTopic) {
    return supportChatContext.lastTopic;
  }
  return null;
}

// 3. SMART PLATFORM KNOWLEDGE BASE
function getSupportChatbotResponse(message) {
  if (!message) return "";
  const lowerQuery = message.toLowerCase().trim();

  // Primary topic detection
  let topic = null;
  if (lowerQuery.includes("resume") || lowerQuery.includes("cv") || lowerQuery.includes("build") || lowerQuery.includes("download") || lowerQuery.includes("export") || lowerQuery.includes("save")) {
    topic = "resume";
  } else if (lowerQuery.includes("ats") || lowerQuery.includes("scan") || lowerQuery.includes("analyzer") || lowerQuery.includes("compatibility") || lowerQuery.includes("score")) {
    topic = "ats";
  } else if (lowerQuery.includes("company") || lowerQuery.includes("interview") || lowerQuery.includes("google") || lowerQuery.includes("stripe") || lowerQuery.includes("meta") || lowerQuery.includes("netflix") || lowerQuery.includes("prep")) {
    topic = "company";
  } else if (lowerQuery.includes("roadmap") || lowerQuery.includes("path") || lowerQuery.includes("skill") || lowerQuery.includes("learn")) {
    topic = "roadmap";
  } else if (lowerQuery.includes("coach") || lowerQuery.includes("mentor") || lowerQuery.includes("career") || lowerQuery.includes("mock")) {
    topic = "coach";
  } else if (lowerQuery.includes("cover letter") || lowerQuery.includes("letter") || lowerQuery.includes("generator") || lowerQuery.includes("draft")) {
    topic = "coverletter";
  } else if (lowerQuery.includes("portfolio") || lowerQuery.includes("website") || lowerQuery.includes("publish") || lowerQuery.includes("site")) {
    topic = "portfolio";
  } else if (lowerQuery.includes("account") || lowerQuery.includes("profile") || lowerQuery.includes("settings") || lowerQuery.includes("username") || lowerQuery.includes("email") || lowerQuery.includes("change")) {
    topic = "account";
  } else if (lowerQuery.includes("billing") || lowerQuery.includes("premium") || lowerQuery.includes("pricing") || lowerQuery.includes("cost") || lowerQuery.includes("free") || lowerQuery.includes("upgrade") || lowerQuery.includes("plan")) {
    topic = "billing";
  } else if (lowerQuery.includes("contact") || lowerQuery.includes("human") || lowerQuery.includes("agent") || lowerQuery.includes("representative") || lowerQuery.includes("support")) {
    topic = "contact";
  }

  // Fallback to memory context if pronoun is detected
  if (!topic) {
    topic = resolveSupportContext(lowerQuery);
  }

  // Persist topic context
  if (topic && topic !== "contact") {
    supportChatContext.lastTopic = topic;
  }

  // Route responses based on matched topics
  switch (topic) {
    case "resume":
      supportAnalytics.logQuery("Resume Builder Info", true);
      return `### Resume Builder Support 📑
Our **Resume Builder** allows you to input details and live-generate polished resumes.
- **Exporting**: Click **Download JSON** (to back up/load details later) or **Export Word (DOC)** to save in Microsoft Word format.
- **AI Enhancement**: Click the purple **AI Enhance** button next to work history bullets to automatically improve them with metric-focused phrases.
*Try saying*: "How do I download it?" or navigate to the **Resume Builder** tab in the sidebar!`;

    case "ats":
      supportAnalytics.logQuery("ATS Analyzer Info", true);
      return `### ATS Analyzer Support 📊
The **ATS Analyzer** verifies your resume compatibility against job descriptions.
- **How to scan**: Paste any job description text into the checker box on the ATS page, then click **Run Diagnostic Scan**.
- **Results**: You will get a score out of 100, keyword match analysis, and specific improvement actions.
*Try saying*: "How do I scan with it?" or click the **ATS Analyzer** menu in the sidebar!`;

    case "company":
      supportAnalytics.logQuery("Company Preparation Info", true);
      return `### Company Interview Prep 🏢
We offer specialized templates and salary info for top tech firms:
- **Available Profiles**: Google, Meta, Stripe, and Netflix.
- **Details**: Access mock interview Q&As, salary benchmarks, and targeted study roadmaps.
*Try saying*: "Where do I find company tips?" or head directly to the **Company Prep** tab!`;

    case "roadmap":
      supportAnalytics.logQuery("Skill Roadmaps Info", true);
      return `### Skill Roadmaps 🗺️
The **Skill Roadmaps** feature generates a customized 6-month technical training plan.
- **Tailoring**: It reads your current skills list and aligns them with target company preferences.
- **Outcome**: Outputs monthly topics, required tools, and online learning references.
*Try saying*: "How do I make a roadmap?" or navigate to the **Skill Roadmaps** view in the sidebar!`;

    case "coach":
      supportAnalytics.logQuery("AI Career Coach Info", true);
      return `### AI Career Coach 🤖
The **AI Career Coach** is your conversational mentor page.
- **Interactive**: Ask questions about technical topics, run coding mock interviews, or get feedback on career directions.
- **Custom Context**: It reads your resume details automatically to give highly customized advice.
*Try saying*: "Open the coach" or click **AI Career Coach** in the sidebar to chat with it!`;

    case "coverletter":
      supportAnalytics.logQuery("Cover Letter Info", true);
      return `### Cover Letter Generator ✉️
Tailor your application introductions:
- **Input**: Supply the role title, company name, and your personal motivation hook.
- **Output**: Generates a high-quality letter formatted for either metric-focused or mission-focused applications.
*Try saying*: "How to make a letter?" or click **Cover Letter Gen** in the sidebar!`;

    case "portfolio":
      supportAnalytics.logQuery("Portfolio Builder Info", true);
      return `### Static Portfolio Builder 🌐
Convert your resume into a personal website:
- **Exporting**: Select a layout template, configure portfolio details, and click **Publish Portfolio**.
- **Output**: A single-file static HTML codebase ready to host on GitHub Pages or Vercel.
*Try saying*: "How to build a site?" or navigate to the **Portfolio Builder** tab!`;

    case "account":
      supportAnalytics.logQuery("Account Settings Info", true);
      return `### Account & Profile Settings ⚙️
To manage your details:
- **Access**: Click your user profile card at the bottom left of the sidebar.
- **Modifiable Details**: Modify your name, email, target role, company, and account tier.
- **Save**: Click **Save Settings** to persist changes globally.`;

    case "billing":
      supportAnalytics.logQuery("Billing & Upgrade Info", true);
      return `### Billing, Pricing & Premium Tiers 💎
- **Basic Account**: Core editor access, single template.
- **Premium Account**: Unlimited AI Enhancements, Cover Letter generator, custom roadmaps, and all designer templates.
- **Test Mode**: In this local session, your user is automatically upgraded to a **Premium Member** for free!`;

    case "contact":
      supportAnalytics.logSupportRequest();
      return `### Contact Human Support 📞
Our support team is available 24/7.
- **Email Support**: support@onestep.ai (replies within 2 hours)
- **Phone Support**: 1-800-555-STEP (Mon-Fri, 9 AM - 6 PM EST)
- **FAQ Center**: Visit our support portal at [help.onestep.ai](https://help.onestep.ai)`;

    default:
      // Greeting detection
      if (lowerQuery.includes("hi") || lowerQuery.includes("hello") || lowerQuery.includes("hey") || lowerQuery.includes("welcome")) {
        supportAnalytics.logQuery("Greeting", true);
        return `Hi 👋 Welcome to OneStep AI Support.

I can help you with:
• Resume Builder
• ATS Analyzer
• Company Preparation
• Skill Roadmaps
• AI Career Coach
• Billing & Account Issues

How can I help you today?`;
      }
      
      // Fallback
      supportAnalytics.logQuery(message, false);
      return `### Help & Navigation 🔍
I couldn't find an exact answer to that question. 

Would you like me to connect you with human support or help you navigate the platform? You can also use the **Quick Action Buttons** below, or reach us at:
- **Email**: support@onestep.ai
- **Phone**: 1-800-555-STEP`;
  }
}

// 4. UI HANDLERS & ACTIONS
let supportUnreadCount = 2; // Default unread badge count on initialization

function initAdvancedSupportChat() {
  const badgeEl = document.getElementById("floating-chat-badge");
  
  // Set initial unread count
  if (badgeEl && supportUnreadCount > 0) {
    badgeEl.textContent = supportUnreadCount;
    badgeEl.style.display = "flex";
  }

  // Welcome Messages setup
  const supportContainer = document.getElementById("support-chat-messages-container");
  const floatingContainer = document.getElementById("floating-chat-messages-container");
  
  const welcomeText = `Hi 👋 Welcome to OneStep AI Support.

I can help you with:
• Resume Builder
• ATS Analyzer
• Company Preparation
• Skill Roadmaps
• AI Career Coach
• Billing & Account Issues

How can I help you today?`;

  if (supportContainer && supportContainer.children.length <= 1) {
    supportContainer.innerHTML = "";
    appendSupportMessageBubble(welcomeText, "coach", false, supportContainer);
  }
  if (floatingContainer && floatingContainer.children.length <= 1) {
    floatingContainer.innerHTML = "";
    appendSupportMessageBubble(welcomeText, "coach", false, floatingContainer);
  }

  // Setup suggestion chips
  renderSupportQuickActions();

  // Register input bindings
  const mainInput = document.getElementById("support-chat-input-field");
  const mainSendBtn = document.getElementById("btn-support-chat-send");
  if (mainInput && mainSendBtn) {
    mainSendBtn.onclick = handleSupportSend;
    mainInput.onkeypress = (e) => {
      if (e.key === "Enter") handleSupportSend();
    };
  }

  const floatingInput = document.getElementById("floating-chat-input-field");
  const floatingSendBtn = document.getElementById("btn-floating-chat-send");
  if (floatingInput && floatingSendBtn) {
    floatingSendBtn.onclick = handleFloatingSend;
    floatingInput.onkeypress = (e) => {
      if (e.key === "Enter") handleFloatingSend();
    };
  }
}

// Render Quick Action Button Grid
function renderSupportQuickActions() {
  const actions = [
    { label: "Build Resume", query: "Tell me about the Resume Builder" },
    { label: "Improve ATS Score", query: "How do I improve my ATS score?" },
    { label: "Interview Preparation", query: "How do I prepare for technical interviews?" },
    { label: "Skill Roadmaps", query: "How do I create a custom skill roadmap?" },
    { label: "Upgrade Plan", query: "Tell me about pricing and premium upgrades" },
    { label: "Contact Support", query: "Contact customer support agent" }
  ];

  // Quick Action Container templates
  const floatingBox = document.getElementById("floating-chat-widget");
  const mainView = document.getElementById("support-chat-view");

  if (floatingBox) {
    let actionsRow = floatingBox.querySelector(".support-quick-actions-row");
    if (!actionsRow) {
      actionsRow = document.createElement("div");
      actionsRow.className = "support-quick-actions-row";
      // Insert right before input area
      const inputArea = floatingBox.querySelector(".floating-chat-input-area");
      floatingBox.insertBefore(actionsRow, inputArea);
    }
    actionsRow.innerHTML = "";
    actions.forEach(act => {
      const btn = document.createElement("button");
      btn.className = "support-action-chip";
      btn.textContent = act.label;
      btn.onclick = () => sendQuickActionQuery(act.query, act.label);
      actionsRow.appendChild(btn);
    });
  }

  if (mainView) {
    const container = mainView.querySelector(".chat-container");
    if (container) {
      let actionsRow = container.querySelector(".support-quick-actions-row");
      if (!actionsRow) {
        actionsRow = document.createElement("div");
        actionsRow.className = "support-quick-actions-row main-page";
        // Insert right before input area
        const inputArea = container.querySelector(".chat-input-area");
        container.insertBefore(actionsRow, inputArea);
      }
      actionsRow.innerHTML = "";
      actions.forEach(act => {
        const btn = document.createElement("button");
        btn.className = "support-action-chip";
        btn.textContent = act.label;
        btn.onclick = () => sendQuickActionQuery(act.query, act.label);
        actionsRow.appendChild(btn);
      });
    }
  }
}

// Send user message
function processSupportQuery(message) {
  if (!message) return;

  const supportContainer = document.getElementById("support-chat-messages-container");
  const floatingContainer = document.getElementById("floating-chat-messages-container");

  // Append user message bubble
  appendSupportMessageBubble(message, "user", false, supportContainer);
  appendSupportMessageBubble(message, "user", false, floatingContainer);

  // Append typing indicator
  const typingLoaderNode1 = showTypingIndicator(supportContainer);
  const typingLoaderNode2 = showTypingIndicator(floatingContainer);

  // Process response delay (1.2s typing animation)
  setTimeout(() => {
    // Remove loaders
    if (typingLoaderNode1) typingLoaderNode1.remove();
    if (typingLoaderNode2) typingLoaderNode2.remove();

    // Get response and format markdown
    const rawReply = getSupportChatbotResponse(message);
    const formattedReply = rawReply
      .replace(/### (.*?)\n/g, '<h4 style="margin-bottom:6px; font-weight:700; color:var(--primary);">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/-\s+(.*?)\n/g, '<li>$1</li>')
      .replace(/❌ (.*?)\n/g, '<li style="list-style-type:none; color:var(--error); margin-left: 0;">❌ $1</li>')
      .replace(/✅ (.*?)\n/g, '<li style="list-style-type:none; color:var(--success); margin-left: 0;">✅ $1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--info); text-decoration:underline;">$1</a>');

    // Append response bubble
    appendSupportMessageBubble(formattedReply, "coach", true, supportContainer);
    appendSupportMessageBubble(formattedReply, "coach", true, floatingContainer);
  }, 1000 + Math.random() * 500);
}

// Handle action chips clicks
function sendQuickActionQuery(query, label) {
  supportAnalytics.logFeatureClick(label);
  processSupportQuery(query);
}

// Typing Indicator rendering
function showTypingIndicator(container) {
  if (!container) return null;
  const node = document.createElement("div");
  node.className = "chat-msg coach typing-loader animate-fade";
  node.innerHTML = `
    <div class="typing-indicator-container">
      <span class="typing-label">OneStep AI is typing</span>
      <div class="typing-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  `;
  container.appendChild(node);
  container.scrollTop = container.scrollHeight;
  return node;
}

// Create and append message bubble to specific target container
function appendSupportMessageBubble(text, sender, isHTML = false, container) {
  if (!container) return;
  const node = document.createElement("div");
  node.className = `chat-msg ${sender} animate-fade-slide-up`;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isHTML) {
    node.innerHTML = `
      <div class="chat-bubble-content">${text}</div>
      <span class="chat-msg-time">${time}</span>
    `;
  } else {
    // Simple text lines formatting
    const formattedText = text.replace(/\n/g, "<br>");
    node.innerHTML = `
      <div class="chat-bubble-content">${formattedText}</div>
      <span class="chat-msg-time">${time}</span>
    `;
  }
  
  container.appendChild(node);
  container.scrollTop = container.scrollHeight;
}

// Input sends
function handleSupportSend() {
  const input = document.getElementById("support-chat-input-field");
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = "";
  processSupportQuery(val);
}

function handleFloatingSend() {
  const input = document.getElementById("floating-chat-input-field");
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  input.value = "";
  processSupportQuery(val);
}

// Expand/Collapse Floating Chat Widget
function toggleSupportFloatingChat() {
  const widget = document.getElementById("floating-chat-widget");
  const badgeEl = document.getElementById("floating-chat-badge");
  const toggleBtn = document.getElementById("btn-floating-chat-toggle");
  
  if (widget) {
    const isActive = widget.classList.toggle("active");
    
    // Change launcher icon based on state
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (isActive) {
          // Widget is open - show X icon
          icon.setAttribute('data-lucide', 'x');
        } else {
          // Widget is closed - show message-circle icon
          icon.setAttribute('data-lucide', 'message-circle');
        }
        // Re-initialize lucide icons
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    }
    
    // Clear unread badge when opened
    if (isActive) {
      supportUnreadCount = 0;
      if (badgeEl) {
        badgeEl.style.display = "none";
      }
    }
  }
}

// Tab Switching Function
function switchToTab(tabName, categoryFilter = null) {
  // Get current active tab
  const currentActiveTab = document.querySelector('.tab-content.active');
  
  // Hide all tab contents with exit animation
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    if (content.classList.contains('active')) {
      content.classList.add('exit');
      content.classList.remove('active');
      setTimeout(() => {
        content.classList.remove('exit');
      }, 400);
    }
  });

  // Remove active class from all nav tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected tab content with enter animation
  setTimeout(() => {
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
      selectedTab.classList.add('enter');
      selectedTab.classList.add('active');
      
      setTimeout(() => {
        selectedTab.classList.remove('enter');
      }, 400);
    }

    // Add active class to selected nav tab
    const selectedNavTab = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
    if (selectedNavTab) {
      selectedNavTab.classList.add('active');
    }

    // If category filter is provided, filter help articles
    if (categoryFilter && tabName === 'help') {
      filterHelpArticles(categoryFilter);
    }
  }, 400);
}

// Filter help articles by category
function filterHelpArticles(category) {
  const helpItems = document.querySelectorAll('.help-item');
  helpItems.forEach(item => {
    const text = item.querySelector('span').textContent.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    // Simple matching logic - can be enhanced
    let shouldShow = false;
    if (categoryLower.includes('resume') && text.includes('resume')) shouldShow = true;
    if (categoryLower.includes('ats') && text.includes('ats')) shouldShow = true;
    if (categoryLower.includes('company') && text.includes('company')) shouldShow = true;
    if (categoryLower.includes('roadmap') && text.includes('roadmap')) shouldShow = true;
    if (categoryLower.includes('coach') && text.includes('coach')) shouldShow = true;
    if (categoryLower.includes('billing') && (text.includes('premium') || text.includes('subscription'))) shouldShow = true;
    
    item.style.display = shouldShow ? 'flex' : 'none';
  });
}

// Handle home section card clicks
function handleHomeCardClick(cardType) {
  switch(cardType) {
    case 'chat':
      switchToTab('messages');
      break;
    case 'faq':
      switchToTab('help');
      break;
    case 'guides':
      switchToTab('help');
      break;
    case 'tutorials':
      switchToTab('help');
      break;
  }
}

// Handle support category clicks
function handleCategoryClick(category) {
  switchToTab('help', category);
}

// Handle help article clicks - expand/collapse
function toggleHelpArticle(element) {
  const content = element.querySelector('.help-article-content');
  if (content) {
    const isExpanded = element.classList.toggle('expanded');
    content.classList.toggle('expanded');
    
    if (isExpanded) {
      // Expand with animation
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '0';
      setTimeout(() => {
        content.style.opacity = '1';
      }, 100);
    } else {
      // Collapse with animation
      content.style.opacity = '0';
      setTimeout(() => {
        content.style.maxHeight = '0';
      }, 200);
    }
  }
}

// Attach functions to global scope
window.getSupportResponse = getSupportChatbotResponse;
window.toggleFloatingChat = toggleSupportFloatingChat;
window.initSupportChatBot = initAdvancedSupportChat;
window.supportAnalytics = supportAnalytics;
window.switchToTab = switchToTab;
window.sendFloatingChatMessage = handleFloatingSend;
window.handleHomeCardClick = handleHomeCardClick;
window.handleCategoryClick = handleCategoryClick;
window.toggleHelpArticle = toggleHelpArticle;
