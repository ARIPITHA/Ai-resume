// OneStep Resume AI - Administrative Dashboard & SVG Analytics Charts

function initAdminPanel() {
  renderDAUChart();
  renderMRRChart();
  renderAdminCompaniesTable();
  renderChatbotAnalytics();

  // Add Company click
  document.getElementById("btn-admin-add-company").onclick = handleAdminAddCompany;
}

// 1. RENDER SVG DAU LINE CHART
function renderDAUChart() {
  const svg = document.getElementById("admin-chart-dau");
  if (!svg) return;

  const dauData = [450, 480, 520, 490, 610, 580, 700, 780, 820, 790, 910, 980, 1120, 1248];
  const padding = 30;
  const width = 400;
  const height = 200;

  const minVal = Math.min(...dauData) * 0.9;
  const maxVal = Math.max(...dauData) * 1.1;
  const valRange = maxVal - minVal;

  let points = "";
  let areaPoints = `30,${height - padding} `;

  // Map values to coordinates
  dauData.forEach((val, idx) => {
    const x = padding + (idx * (width - 2 * padding) / (dauData.length - 1));
    const y = height - padding - ((val - minVal) * (height - 2 * padding) / valRange);
    points += `${x},${y} `;
    areaPoints += `${x},${y} `;

    // Add hover point node
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 4);
    dot.setAttribute("fill", "var(--primary)");
    dot.setAttribute("stroke", "var(--bg-surface)");
    dot.setAttribute("stroke-width", "2");
    dot.style.cursor = "pointer";

    // Add tooltip hover interaction
    dot.onmouseover = (e) => {
      dot.setAttribute("r", 6);
      showToastNotification(`Day ${idx + 1}: ${val} Active Sessions`);
    };
    dot.onmouseout = () => dot.setAttribute("r", 4);

    svg.appendChild(dot);
  });

  areaPoints += `${width - padding},${height - padding}`;

  // Draw Area fill
  const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  areaPath.setAttribute("points", areaPoints);
  areaPath.setAttribute("class", "chart-area");
  svg.insertBefore(areaPath, svg.firstChild);

  // Draw Line path
  const linePath = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  linePath.setAttribute("points", points);
  linePath.setAttribute("class", "chart-line");
  svg.insertBefore(linePath, svg.firstChild);

  // Draw Y/X axis ticks
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "var(--border-color)");
  svg.appendChild(xAxis);
}

// 2. RENDER SVG MRR BAR CHART
function renderMRRChart() {
  const svg = document.getElementById("admin-chart-mrr");
  if (!svg) return;

  const mrrData = [
    { label: "Jan", val: 12000 },
    { label: "Feb", val: 13200 },
    { label: "Mar", val: 14500 },
    { label: "Apr", val: 16000 },
    { label: "May", val: 17200 },
    { label: "Jun", val: 18432 }
  ];

  const padding = 30;
  const width = 400;
  const height = 200;

  const maxVal = Math.max(...mrrData.map(d => d.val)) * 1.15;
  const barWidth = 32;
  const gap = (width - 2 * padding - mrrData.length * barWidth) / (mrrData.length - 1);

  mrrData.forEach((item, idx) => {
    const barHeight = (item.val * (height - 2 * padding)) / maxVal;
    const x = padding + idx * (barWidth + gap);
    const y = height - padding - barHeight;

    // Create rect
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", x);
    bar.setAttribute("y", y);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", barHeight);
    bar.setAttribute("class", "chart-bar");
    bar.setAttribute("rx", 3);
    bar.style.cursor = "pointer";

    // Mouse events
    bar.onmouseover = () => {
      bar.setAttribute("fill", "var(--border-focus)");
      showToastNotification(`${item.label} MRR: $${item.val.toLocaleString()}`);
    };
    bar.onmouseout = () => bar.removeAttribute("fill");

    svg.appendChild(bar);

    // Label text
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + barWidth / 2);
    label.setAttribute("y", height - 10);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "var(--text-secondary)");
    label.setAttribute("font-size", "10");
    label.textContent = item.label;
    svg.appendChild(label);
  });
}

// 3. ADMIN CRUD MANAGEMENT - COMPANIES TABLE

function renderAdminCompaniesTable() {
  const tbody = document.getElementById("admin-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  companiesData.forEach(comp => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border-color)";
    tr.innerHTML = `
      <td style="padding:12px 0; font-weight:600; display:flex; align-items:center; gap:8px;">
        <span style="background-color:${comp.logoBg}; color:white; width:24px; height:24px; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem;">${comp.logoText}</span>
        ${comp.name}
      </td>
      <td>${comp.category}</td>
      <td>
        <span style="background-color:${comp.hiringVelocity === 'High' ? 'var(--success-bg)' : 'var(--warning-bg)'}; color:${comp.hiringVelocity === 'High' ? 'var(--success)' : 'var(--warning)'}; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:600;">
          ${comp.hiringVelocity} Velocity
        </span>
      </td>
      <td>${comp.salary.levels[0].base} - ${comp.salary.levels[2] ? comp.salary.levels[2].base : comp.salary.levels[0].base}</td>
      <td>
        <button class="btn-secondary-outline" style="padding:4px 8px; font-size:0.75rem; color:var(--error); border-color:transparent;" onclick="deleteAdminCompanyRow('${comp.id}')">
          <i data-lucide="trash-2" style="width:12px; height:12px;"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

function handleAdminAddCompany() {
  const name = prompt("Enter Company Name:");
  if (!name) return;
  const category = prompt("Enter Category (Tech/Startups/Finance):", "Tech");
  const baseSalary = prompt("Enter Entry Base Salary Range (e.g. $120k - $140k):", "$130k - $150k");

  const id = name.toLowerCase().replace(/ /g, "_");

  const newCompany = {
    id,
    name,
    logoText: name.charAt(0).toUpperCase(),
    logoBg: "#" + Math.floor(Math.random() * 16777215).toString(16),
    category,
    location: "United States (Remote)",
    description: `AI-added directory listing profile for ${name}.`,
    hiringProcess: {
      rounds: [{ title: "Phone Screen", desc: "General technical phone interview screening." }],
      duration: "4 weeks",
      successRate: "5.0%"
    },
    eligibility: {
      education: "Degree in Computer Science or equivalent experience.",
      experience: "Junior to Senior tracks.",
      sponsorship: "Yes."
    },
    techSkills: [{ name: "Systems Engineering", level: "Expert" }],
    softSkills: ["Collaboration"],
    faq: [],
    resumeTips: [],
    interviewTips: [],
    salary: {
      levels: [
        { name: "Entry SE", base: baseSalary, tc: baseSalary }
      ]
    },
    hiringVelocity: "Medium"
  };

  companiesData.push(newCompany);
  renderAdminCompaniesTable();

  // Sync the client list as well if open
  renderCompanyListCards();

  showToastNotification(`Added ${name} successfully to company registry.`);
}

function deleteAdminCompanyRow(id) {
  if (confirm("Are you sure you want to delete this company registry?")) {
    const idx = companiesData.findIndex(x => x.id === id);
    if (idx !== -1) {
      const name = companiesData[idx].name;
      companiesData.splice(idx, 1);
      renderAdminCompaniesTable();
      renderCompanyListCards();
      showToastNotification(`Deleted ${name} directory.`);
    }
  }
}

function renderChatbotAnalytics() {
  const analyticsClicks = document.getElementById("analytics-action-clicks");
  const analyticsRequests = document.getElementById("analytics-support-requests");
  const askedList = document.getElementById("analytics-most-asked-list");
  const failedList = document.getElementById("analytics-failed-list");

  if (!analyticsClicks || !analyticsRequests || !askedList || !failedList) return;

  const data = (window.supportAnalytics && typeof window.supportAnalytics.get === "function")
    ? window.supportAnalytics.get()
    : { mostAsked: {}, failedQueries: [], featureUsage: {}, supportRequests: 0 };

  // Calculate total feature clicks
  let totalClicks = 0;
  for (const feat in data.featureUsage) {
    totalClicks += data.featureUsage[feat];
  }

  analyticsClicks.textContent = totalClicks;
  analyticsRequests.textContent = data.supportRequests;

  // Render Most Asked
  const sortedAsked = Object.keys(data.mostAsked).sort((a, b) => data.mostAsked[b] - data.mostAsked[a]).slice(0, 5);
  if (sortedAsked.length === 0) {
    askedList.innerHTML = `<li style="color:var(--text-muted);">None recorded</li>`;
  } else {
    askedList.innerHTML = sortedAsked.map(q => `
      <li style="display:flex; justify-content:space-between; align-items:center;">
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:120px;" title="${q}">${q}</span>
        <span class="badge" style="background-color:rgba(99,102,241,0.15); color:var(--primary); font-size:0.7rem; padding:1px 5px; border-radius:10px;">${data.mostAsked[q]} asked</span>
      </li>
    `).join("");
  }

  // Render Failed Queries
  const failedQueriesSlice = data.failedQueries.slice(-5);
  if (failedQueriesSlice.length === 0) {
    failedList.innerHTML = `<li style="color:var(--text-muted);">None recorded</li>`;
  } else {
    failedList.innerHTML = failedQueriesSlice.map(q => `
      <li style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:160px; color:var(--text-secondary);" title="${q}">
        ❌ ${q}
      </li>
    `).join("");
  }
}
