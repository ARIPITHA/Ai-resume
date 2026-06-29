// OneStep Resume AI - Comprehensive Knowledge Base & AI Chatbot Engine

const companiesData = [
  {
    id: "google",
    name: "Google",
    logoText: "G",
    logoBg: "#4285F4",
    category: "Tech",
    location: "Mountain View, CA (Hybrid)",
    description: "Google's mission is to organize the world's information and make it universally accessible and useful. Known for search, cloud computing, systems infrastructure, and advanced AI systems.",
    hiringProcess: {
      rounds: [
        { title: "Recruiter Phone Screen", desc: "15-30 mins. Resume walk-through, behavior indicators, general role fit assessment." },
        { title: "Technical Phone Screen", desc: "45 mins. 1 coding problem (data structures & algorithms) using a shared document/editor." },
        { title: "Onsite Loop: Coding (x3)", desc: "45 mins each. Focus on algorithms, clean coding, edge cases, time/space complexity optimization." },
        { title: "Onsite Loop: System Design (x1)", desc: "45 mins. Scalability, caching, database partitioning, API design (for senior roles)." },
        { title: "Onsite Loop: Googliness & Leadership (x1)", desc: "45 mins. Behavioral interview evaluating team collaboration, ambiguity handling, and ethics." }
      ],
      duration: "4-8 weeks",
      successRate: "2.5%"
    },
    eligibility: {
      education: "BS, MS, or PhD in Computer Science, or equivalent practical experience.",
      experience: "Entry (Level 3) to Principal (Level 8+). Fresher hiring active through university channels.",
      sponsorship: "Yes (H-1B, L-1 transfers, Green Card sponsorship available)."
    },
    techSkills: [
      { name: "C++ / Java / Python / Go", level: "Expert" },
      { name: "Data Structures & Algorithms", level: "Expert (Graphs, Dynamic Programming)" },
      { name: "Distributed Systems & Scalability", level: "Strong" },
      { name: "Linux Systems & Networking", level: "Medium" }
    ],
    softSkills: ["Cognitive Ability", "Dealing with Ambiguity", "Intellectual Humility", "Leadership & Collaboration"],
    faq: [
      {
        question: "How should I design a globally scalable URL shortening service?",
        answer: "Discuss system scale (100M URLs generated per day). Cover hash generation (Base62 encoding), collision mitigation, database choice (NoSQL like Cassandra for fast writes and scalability), caching active keys with Redis, and custom load-balancer redirects.",
        difficulty: "Medium",
        lcLink: "https://leetcode.com/discuss/interview-question/system-design/"
      },
      {
        question: "Find the median of two sorted arrays in O(log(m+n)) time.",
        answer: "This is a classic binary search problem. Partition both arrays such that the left half has the same number of elements as the right half, and all elements in the left partition are less than or equal to elements in the right partition.",
        difficulty: "Hard",
        lcLink: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
      },
      {
        question: "What is the key to passing Google's Googliness round?",
        answer: "Googliness is Google's cultural match assessment. Be prepared to show how you resolve conflicts constructively, how you learn from failures, how you address ambiguous requirements, and how you prioritize user experience over short-term hacks.",
        difficulty: "Easy",
        lcLink: ""
      }
    ],
    resumeTips: [
      "Detail your individual impact. Use the format: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
      "List open-source projects or academic publications if relevant.",
      "Google parsers read PDF structures cleanly. Avoid dual-column sidebars if possible; use clean left-to-right rows.",
      "Avoid empty buzzwords. Show proficiency through code links (GitHub) and concrete results."
    ],
    interviewTips: [
      "Google engineers value communication. Think out loud! A correct solution coded in silence is often a fail.",
      "Validate edge cases before you start typing code (e.g. empty arrays, null pointer references, integer overflow).",
      "Know your Big-O complexities inside and out. You must state the time and space complexity of your solution immediately after coding it."
    ],
    salary: {
      levels: [
        { name: "L3 (Software Engineer I)", base: "$140k - $160k", tc: "$190k - $220k" },
        { name: "L4 (Software Engineer II)", base: "$165k - $185k", tc: "$250k - $290k" },
        { name: "L5 (Senior Software Engineer)", base: "$200k - $230k", tc: "$360k - $420k" }
      ]
    },
    hiringVelocity: "High"
  },
  {
    id: "meta",
    name: "Meta",
    logoText: "M",
    logoBg: "#0668E1",
    category: "Tech",
    location: "Menlo Park, CA (Hybrid/Remote)",
    description: "Meta builds technologies that help people connect, find communities, and grow businesses. Focus areas include social networks (Facebook, Instagram, WhatsApp), virtual reality, and open-source AI frameworks (PyTorch, Llama).",
    hiringProcess: {
      rounds: [
        { title: "Technical Screen", desc: "45 mins. Solve 2 coding problems in a live coderpad. Speed and accuracy are highly critical." },
        { title: "Onsite Coding (x2)", desc: "45 mins each. 2 coding problems per round. Complete working solution expected for both." },
        { title: "System Design / Product Architecture (x1)", desc: "45 mins. High-level structure for large-scale consumer applications (e.g. Messenger, News Feed API)." },
        { title: "Behavioral Loop (x1)", desc: "45 mins. Questions focused on Meta core values: Move Fast, Focus on Long-Term Impact, Build Awesome Things." }
      ],
      duration: "3-6 weeks",
      successRate: "3.0%"
    },
    eligibility: {
      education: "No formal degree required. Demonstrated industry experience and coding proficiency.",
      experience: "Junior (IC3) to Director (IC8). Extensive hiring for mobile developers and systems generalists.",
      sponsorship: "Yes. Highly supportive of visa transfers."
    },
    techSkills: [
      { name: "Python / JavaScript / Hack / PHP / C++", level: "Expert" },
      { name: "LeetCode Patterns", level: "Expert (Speed is highly valued)" },
      { name: "System Design Patterns", level: "Strong" },
      { name: "Product Engineering", level: "Strong" }
    ],
    softSkills: ["Move Fast Attitude", "Conflict Resolution", "Self-Driven Execution", "Direct Communication"],
    faq: [
      {
        question: "Merge intervals and return list of non-overlapping intervals.",
        answer: "Sort intervals by start time. Iterate through. If the current interval overlaps with the previous one, merge them by setting the end time to the max of both. Else, add the current to results list.",
        difficulty: "Medium",
        lcLink: "https://leetcode.com/problems/merge-intervals/"
      },
      {
        question: "How do you design Meta's News Feed system?",
        answer: "Explain Feed Generation (Fan-out on Write vs. Fan-out on Read), cache mechanisms, relational DB with Graph databases (like TAO), feed ranking engines, and push notifications gateway scaling.",
        difficulty: "Hard",
        lcLink: "https://leetcode.com/discuss/interview-question/system-design/"
      }
    ],
    resumeTips: [
      "Highlight speed of shipping. Mention projects launched end-to-end.",
      "Showcase mobile development (React Native, iOS, Android) or large-scale fullstack work.",
      "Detail optimization metrics: page loading speedups, network request reductions, or hosting bill cuts."
    ],
    interviewTips: [
      "Speed is king. You are expected to code two Medium/Hard LeetCode questions in 35 minutes of actual coding time.",
      "Don't spend too much time discussing options. Briefly state the optimal approach and jump into coding immediately.",
      "Be prepared for Meta-specific LeetCode tag questions; their pool is heavily tag-centric."
    ],
    salary: {
      levels: [
        { name: "IC3 (Software Engineer)", base: "$135k - $155k", tc: "$180k - $210k" },
        { name: "IC4 (Rotational/Senior SE)", base: "$160k - $185k", tc: "$240k - $280k" },
        { name: "IC5 (Senior Software Engineer)", base: "$195k - $225k", tc: "$370k - $430k" }
      ]
    },
    hiringVelocity: "Medium"
  },
  {
    id: "stripe",
    name: "Stripe",
    logoText: "S",
    logoBg: "#635BFF",
    category: "Startups",
    location: "San Francisco, CA (Remote Friendly)",
    description: "Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments, send payouts, and manage their businesses online.",
    hiringProcess: {
      rounds: [
        { title: "Technical Screen", desc: "60 mins. Build a functional client/server script with API integrations. Allowed full access to Google/docs." },
        { title: "Bug Hunt (Onsite)", desc: "60 mins. Find and fix bugs in a large, unfamiliar open-source codebase. Tests debugging and code reading." },
        { title: "Integration Round (Onsite)", desc: "60 mins. Write a feature extension in an existing, medium-sized application structure." },
        { title: "System Design (Onsite)", desc: "60 mins. Focuses on API design, payment idempotency, webhook delivery reliability, and database consistency." }
      ],
      duration: "4-6 weeks",
      successRate: "1.5%"
    },
    eligibility: {
      education: "BS/MS in Computer Science or equivalent. Self-taught programmers with strong portfolios are highly welcome.",
      experience: "Strong engineering execution. Senior-leaning hiring profile.",
      sponsorship: "Yes. Offers standard support."
    },
    techSkills: [
      { name: "Ruby / Python / Go / Java", level: "Expert" },
      { name: "API & Webhook Architecture", level: "Expert" },
      { name: "Debugging & Refactoring", level: "Expert" },
      { name: "Distributed Systems & DB Transactions", level: "Strong" }
    ],
    softSkills: ["Empathetic Communication", "Writing Clarity", "Design Craftsmanship", "Attention to Detail"],
    faq: [
      {
        question: "How do you ensure exactly-once payment processing?",
        answer: "Use Idempotency Keys. Clients generate a UUID and send it with the request. The server saves the key + response in Redis. If a request with the same key arrives again, the server returns the cached response instead of processing the payment twice.",
        difficulty: "Hard",
        lcLink: ""
      },
      {
        question: "Implement a rate-limiter for APIs.",
        answer: "Explain Token Bucket or Sliding Window Log algorithms. Write a functional program in your preferred language implementing Token Bucket with bucket sizes, refill rates, and timestamp checks.",
        difficulty: "Medium",
        lcLink: "https://leetcode.com/problems/design-hit-counter/"
      }
    ],
    resumeTips: [
      "Stripe values clean writing. Format your achievements with clear, technical explanations.",
      "Show projects that involve integration of external APIs, payments, or third-party webhooks.",
      "List testing frameworks you are comfortable with. Stripe values test coverage."
    ],
    interviewTips: [
      "Stripe's interviews are highly practical. They mimic real programming: you compile code, search Google, and write tests.",
      "Write clean, readable code with sensible variable names. They care about readability as much as correctness.",
      "Write unit tests for your code as you write the solutions."
    ],
    salary: {
      levels: [
        { name: "L1 (Software Engineer I)", base: "$145k - $165k", tc: "$195k - $225k" },
        { name: "L2 (Software Engineer II)", base: "$175k - $200k", tc: "$280k - $320k" },
        { name: "L3 (Staff Engineer)", base: "$210k - $245k", tc: "$450k - $520k" }
      ]
    },
    hiringVelocity: "High"
  },
  {
    id: "netflix",
    name: "Netflix",
    logoText: "N",
    logoBg: "#E50914",
    category: "Tech",
    location: "Los Gatos, CA (Hybrid)",
    description: "Netflix is the world's leading streaming entertainment service with hundreds of millions of paid memberships. Renowned for its highly independent culture, microservices architecture, and generous compensation.",
    hiringProcess: {
      rounds: [
        { title: "Technical Interview I", desc: "45 mins. Coding, debugging, and systems infrastructure concepts." },
        { title: "Technical Interview II", desc: "45 mins. Focused on specific domain expertise (e.g. UI performance, Java/Concurrency, Cloud infrastructure)." },
        { title: "Onsite Loop: Coding & System Design (x3)", desc: "45 mins each. In-depth algorithmic efficiency and massive scalability architectures." },
        { title: "Onsite Loop: Culture Fit (x2)", desc: "45 mins. Intensive interview with managers and directors exploring alignment with Netflix Culture Memo." }
      ],
      duration: "3-5 weeks",
      successRate: "1.8%"
    },
    eligibility: {
      education: "Degree preferred but not mandatory. Outstanding track record of shipping production-grade applications.",
      experience: "Leans heavily towards senior/staff level engineers. Historically did not hire freshers.",
      sponsorship: "Yes, standard support."
    },
    techSkills: [
      { name: "Java / Go / Node.js / JavaScript", level: "Expert" },
      { name: "Microservices & Cloud Architectures (AWS)", level: "Expert" },
      { name: "Concurrency & Multi-Threading", level: "Expert" },
      { name: "Caching & CDN Optimization", level: "Strong" }
    ],
    softSkills: ["Stunning Colleague Standards", "Freedom & Responsibility Alignment", "High Candor", "Independent Decision Making"],
    faq: [
      {
        question: "How does Netflix handle streaming traffic at scale?",
        answer: "Explain Open Connect (their custom CDN appliances placed in ISPs). Discuss how the application control plane runs in AWS (catalog search, user login, recommendations) while the actual high-bandwidth video chunks are cached and streamed from Open Connect edge servers.",
        difficulty: "Hard",
        lcLink: ""
      }
    ],
    resumeTips: [
      "Highlight senior-level ownership: leading architectural decisions, mentoring engineers, or driving system migrations.",
      "Show detailed metrics of resource optimizations: how much you reduced AWS spend, CPU cycles, or caching hits.",
      "Include links to tech talks or technical blog posts you have written."
    ],
    interviewTips: [
      "Read the Netflix Culture Memo multiple times. They reject highly skilled candidates if they don't align with their core values (e.g. candor, curiosity, selflessness).",
      "Explain your system designs in depth, highlighting trade-offs between speed, cost, and developer friction.",
      "Expect coding questions that simulate real-world concurrency, thread locks, or API pagination."
    ],
    salary: {
      levels: [
        { name: "Senior Software Engineer", base: "$350k - $450k", tc: "$500k - $600k (All cash options)" },
        { name: "Staff Software Engineer", base: "$450k - $550k", tc: "$620k - $750k" }
      ]
    },
    hiringVelocity: "Medium"
  },
  {
    id: "apple",
    name: "Apple",
    logoText: "A",
    logoBg: "#000000",
    category: "Tech",
    location: "Cupertino, CA (Onsite)",
    description: "Apple designs consumer electronics, software, and online services. Known for extreme attention to detail, hardware-software integration, and user privacy.",
    hiringProcess: {
      rounds: [
        { title: "Recruiter Screen", desc: "30 mins. Background review, interest evaluation." },
        { title: "Technical Screens (x2)", desc: "45-60 mins each. Practical coding and deep questions on your specialized field (e.g. iOS, hardware, OS kernel)." },
        { title: "Onsite Loop (x5)", desc: "45 mins each. 2 Coding rounds, 2 System/Product Design rounds, 1 Hiring Manager review." }
      ],
      duration: "4-8 weeks",
      successRate: "2.0%"
    },
    eligibility: {
      education: "BS/MS in Computer Engineering, Electrical Engineering, or Computer Science.",
      experience: "Positions from interns to senior principal engineers. Strong focus on domain expertise.",
      sponsorship: "Yes."
    },
    techSkills: [
      { name: "Swift / Objective-C / C / C++ / Rust", level: "Expert" },
      { name: "Memory Management & OS Internals", level: "Expert" },
      { name: "Domain Specifics (iOS/macOS APIs)", level: "Expert" }
    ],
    softSkills: ["Aesthetic Sensibility", "Discretion & Security Mindset", "Team-first Mentality", "Iterative Excellence"],
    faq: [
      {
        question: "Explain the difference between automatic reference counting (ARC) and garbage collection.",
        answer: "ARC operates at compile-time, inserting retain/release calls into the binary automatically. It has deterministic release cycles. Garbage collection runs at runtime, scanning the heap for unreachable nodes, causing CPU overhead and non-deterministic pauses.",
        difficulty: "Medium",
        lcLink: ""
      }
    ],
    resumeTips: [
      "Demonstrate low-level performance profiling: reducing frame drops, optimizing heap/stack layouts, or reducing memory footprints.",
      "List specialized SDKs/APIs you've integrated directly.",
      "Tailor your resume precisely to the team's description; Apple processes applications in highly siloed teams."
    ],
    interviewTips: [
      "Apple's interviews are team-specific. One team might ask hard LeetCode, another might ask deep questions on compiler optimizations.",
      "Ask clarifying questions. Apple products thrive on pixel-perfect details, and they want to see that precision in your design phase.",
      "Be prepared to code on a whiteboard if doing in-person loops."
    ],
    salary: {
      levels: [
        { name: "ICT3 (Software Engineer)", base: "$130k - $150k", tc: "$175k - $200k" },
        { name: "ICT4 (Senior Engineer)", base: "$165k - $190k", tc: "$260k - $310k" },
        { name: "ICT5 (Staff Engineer)", base: "$205k - $240k", tc: "$400k - $480k" }
      ]
    },
    hiringVelocity: "Medium"
  }
];

const roadmapsData = {
  backend: [
    {
      title: "Phase 1: Foundations (Weeks 1-2)",
      duration: "2 Weeks",
      skills: [
        {
          title: "Programming Language Mastery",
          duration: "5 days",
          desc: "Gain fluency in one major backend language (Go, Python, Java, or Node.js). Focus on concurrency models.",
          resources: {
            videos: [
              { name: "Python OOP Tutorial by Corey Schafer", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLyM", type: "free", duration: "1.5 hours", difficulty: "Beginner" },
              { name: "Go Programming Course by freeCodeCamp", url: "https://www.youtube.com/watch?v=YS4e4q9oBaU", type: "free", duration: "6.5 hours", difficulty: "Intermediate" }
            ],
            documentation: [
              { name: "The Go Programming Language Tour", url: "https://go.dev/tour/", type: "free", duration: "2 hours", difficulty: "Beginner" },
              { name: "Python 3 Official Tutorial: Classes", url: "https://docs.python.org/3/tutorial/classes.html", type: "free", duration: "1 hour", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "LeetCode: Two Sum (Go/Python)", url: "https://leetcode.com/problems/two-sum/", type: "free", duration: "30 mins", difficulty: "Beginner" },
              { name: "HackerRank: Python Basic Certification", url: "https://www.hackerrank.com/skills-verification/python_basic", type: "free", duration: "2 hours", difficulty: "Intermediate" }
            ],
            projects: [
              { name: "Build a Simple HTTP Server in Go", url: "https://github.com/hoanhan101/golang-web-server", type: "free", duration: "4 hours", difficulty: "Intermediate" },
              { name: "Python CLI Todo Application Project", url: "https://github.com/realpython/cli-todo-app", type: "free", duration: "3 hours", difficulty: "Beginner" }
            ],
            certifications: [
              { name: "Google Go Specialization (Coursera)", url: "https://www.coursera.org/specializations/google-golang", type: "paid", duration: "1 month", difficulty: "Intermediate" },
              { name: "Python for Everybody Specialization", url: "https://www.coursera.org/specializations/python", type: "paid", duration: "2 months", difficulty: "Beginner" }
            ]
          }
        },
        {
          title: "Git & Collaboration",
          duration: "2 days",
          desc: "Master version control, branches, pull requests, resolving merge conflicts, and commit hygiene.",
          resources: {
            videos: [
              { name: "Git and GitHub for Beginners", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "free", duration: "1 hour", difficulty: "Beginner" },
              { name: "Advanced Git Tutorial: Rebase, Cherry-Pick", url: "https://www.youtube.com/watch?v=ecK3-H1WdMk", type: "free", duration: "45 mins", difficulty: "Intermediate" }
            ],
            documentation: [
              { name: "Git Flight Rules for common issues", url: "https://github.com/k88hudson/git-flight-rules", type: "free", duration: "3 hours", difficulty: "Advanced" },
              { name: "GitHub Skills Interactive Guide", url: "https://skills.github.com/", type: "free", duration: "1.5 hours", difficulty: "Beginner" }
            ],
            practice: [
              { name: "Learn Git Branching Interactive Sandbox", url: "https://learngitbranching.js.org/", type: "free", duration: "2 hours", difficulty: "Intermediate" },
              { name: "Git Immersion Guided Exercises", url: "https://gitimmersion.com/", type: "free", duration: "2 hours", difficulty: "Beginner" }
            ],
            projects: [
              { name: "Collaborate on Open Source: Good First Issues", url: "https://github.com/collections/good-first-issues", type: "free", duration: "4 hours", difficulty: "Intermediate" }
            ],
            certifications: [
              { name: "Version Control with Git by Atlassian", url: "https://www.coursera.org/learn/version-control-with-git", type: "paid", duration: "10 hours", difficulty: "Beginner" }
            ]
          }
        }
      ]
    },
    {
      title: "Phase 2: Database Systems (Weeks 3-6)",
      duration: "4 Weeks",
      skills: [
        {
          title: "Relational Databases & SQL",
          duration: "10 days",
          desc: "Understand relational schemas, indexes, joins, ACID transactions, and query optimization (EXPLAIN).",
          resources: {
            videos: [
              { name: "SQL Tutorial for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "free", duration: "4 hours", difficulty: "Beginner" },
              { name: "Advanced SQL Execution Plans Deep Dive", url: "https://www.youtube.com/watch?v=Fst5jP5cK2c", type: "free", duration: "1.5 hours", difficulty: "Advanced" }
            ],
            documentation: [
              { name: "PostgreSQL Official Documentation", url: "https://www.postgresql.org/docs/current/index.html", type: "free", duration: "5 hours", difficulty: "Intermediate" },
              { name: "Use The Index, Luke! Database Indexing Guide", url: "https://use-the-index-luke.com/", type: "free", duration: "4 hours", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "LeetCode Database Problem Set", url: "https://leetcode.com/problemset/database/", type: "free", duration: "4 hours", difficulty: "Intermediate" },
              { name: "SQLZoo Interactive Exercises", url: "https://sqlzoo.net/", type: "free", duration: "3 hours", difficulty: "Beginner" }
            ],
            projects: [
              { name: "Build a Database Schema for E-Commerce", url: "https://github.com/dbdiagram/dbdiagram.io", type: "free", duration: "6 hours", difficulty: "Intermediate" }
            ],
            certifications: [
              { name: "PostgreSQL for Everybody (Coursera)", url: "https://www.coursera.org/specializations/postgresql-for-everybody", type: "paid", duration: "1 month", difficulty: "Intermediate" }
            ]
          }
        },
        {
          title: "NoSQL & Caching",
          duration: "8 days",
          desc: "Key-value stores (Redis), Document DBs (MongoDB), and horizontal scaling tradeoffs (CAP Theorem).",
          resources: {
            videos: [
              { name: "Redis Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", type: "free", duration: "1 hour", difficulty: "Beginner" },
              { name: "MongoDB Beginners Tutorial", url: "https://www.youtube.com/watch?v=ExcRbA7fy_A", type: "free", duration: "2 hours", difficulty: "Beginner" }
            ],
            documentation: [
              { name: "Redis Developer Documentation Hub", url: "https://redis.io/docs/", type: "free", duration: "3 hours", difficulty: "Intermediate" },
              { name: "MongoDB Official Manual", url: "https://www.mongodb.com/docs/manual/", type: "free", duration: "4 hours", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "Redis University: Basic Data Structures", url: "https://university.redis.com/courses/ru101/", type: "free", duration: "5 hours", difficulty: "Beginner" }
            ],
            projects: [
              { name: "Implement Redis as a Cache in a Node/Python App", url: "https://github.com/redis-developer/basic-redis-caching-demo-nodejs", type: "free", duration: "5 hours", difficulty: "Intermediate" }
            ],
            certifications: [
              { name: "Redis Certified Developer Exam", url: "https://university.redis.com/certification/", type: "paid", duration: "10 hours", difficulty: "Advanced" },
              { name: "MongoDB Certified Developer Path", url: "https://learn.mongodb.com/pages/certification", type: "paid", duration: "15 hours", difficulty: "Intermediate" }
            ]
          }
        }
      ]
    },
    {
      title: "Phase 3: Algorithms & Interview Prep (Weeks 7-12)",
      duration: "6 Weeks",
      skills: [
        {
          title: "Data Structures & Big-O",
          duration: "14 days",
          desc: "Arrays, Strings, Linked Lists, Stacks, Queues, Heaps, and Hash Maps. Analyse runtime complexities.",
          resources: {
            videos: [
              { name: "Data Structures Easy to Advanced (freeCodeCamp)", url: "https://www.youtube.com/watch?v=RBSGKlAvoid", type: "free", duration: "8 hours", difficulty: "Intermediate" }
            ],
            documentation: [
              { name: "Big-O Cheat Sheet Reference Guide", url: "https://www.bigocheatsheet.com/", type: "free", duration: "30 mins", difficulty: "Beginner" }
            ],
            practice: [
              { name: "LeetCode Top Interview 150 List", url: "https://leetcode.com/studyplan/top-interview-150/", type: "free", duration: "20 hours", difficulty: "Intermediate" },
              { name: "NeetCode Practice Roadmap", url: "https://neetcode.io/practice", type: "free", duration: "15 hours", difficulty: "Intermediate" }
            ],
            projects: [
              { name: "Implement custom Hash Map & Linked List in Go/Python", url: "https://github.com/donnemartin/interactive-coding-challenges", type: "free", duration: "8 hours", difficulty: "Advanced" }
            ],
            certifications: [
              { name: "Algorithms Specialization by Stanford (Coursera)", url: "https://www.coursera.org/specializations/algorithms", type: "paid", duration: "3 months", difficulty: "Advanced" }
            ]
          }
        },
        {
          title: "Advanced Algorithms",
          duration: "14 days",
          desc: "Graph traversals (BFS, DFS), Dynamic Programming, sliding window, and backtracking.",
          resources: {
            videos: [
              { name: "Dynamic Programming - Learn to Solve (freeCodeCamp)", url: "https://www.youtube.com/watch?v=oBt53Yn9YY0", type: "free", duration: "5 hours", difficulty: "Advanced" },
              { name: "Graph Algorithms for Technical Interviews", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU", type: "free", duration: "6 hours", difficulty: "Advanced" }
            ],
            documentation: [
              { name: "NeetCode.io Study Guides", url: "https://neetcode.io/", type: "free", duration: "1 hour", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "LeetCode 75 Curated Study Plan", url: "https://leetcode.com/studyplan/leetcode-75/", type: "free", duration: "12 hours", difficulty: "Intermediate" }
            ],
            projects: [
              { name: "Shortest Path Algorithm Visualizer Project", url: "https://github.com/clementmihailescu/Pathfinding-Visualizer", type: "free", duration: "10 hours", difficulty: "Advanced" }
            ],
            certifications: []
          }
        }
      ]
    },
    {
      title: "Phase 4: Systems & API Architecture (Weeks 13-16)",
      duration: "4 Weeks",
      skills: [
        {
          title: "System Design & Scalability",
          duration: "14 days",
          desc: "Load balancers, sharding, replication, DNS, CDN, message queues (Kafka), and microservices architectures.",
          resources: {
            videos: [
              { name: "System Design Course for Beginners", url: "https://www.youtube.com/watch?v=m8IOfR6hTvU", type: "free", duration: "5 hours", difficulty: "Intermediate" },
              { name: "Designing Uber - System Design Case Study", url: "https://www.youtube.com/watch?v=UmGb5D1-kEE", type: "free", duration: "45 mins", difficulty: "Advanced" }
            ],
            documentation: [
              { name: "The System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", type: "free", duration: "10 hours", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "Pragmatic System Design Mock Cases", url: "https://www.youtube.com/playlist?list=PLMCXHnjXn3rEysZ7L28xLwYn5b1V08T1s", type: "free", duration: "8 hours", difficulty: "Advanced" }
            ],
            projects: [
              { name: "Build a Scalable URL Shortener Service", url: "https://github.com/denji/awesome-system-design", type: "free", duration: "12 hours", difficulty: "Advanced" }
            ],
            certifications: [
              { name: "Grokking the System Design Interview", url: "https://www.designgurus.io/course/grokking-the-system-design-interview", type: "paid", duration: "15 hours", difficulty: "Advanced" }
            ]
          }
        }
      ]
    }
  ],
  frontend: [
    {
      title: "Phase 1: Styling & Markup (Weeks 1-2)",
      duration: "2 Weeks",
      skills: [
        {
          title: "Semantic HTML5 & Modern CSS",
          duration: "7 days",
          desc: "Flexbox, Grid, CSS custom variables, keyframe animations, media queries, accessibility parameters.",
          resources: {
            videos: [
              { name: "CSS Grid and Flexbox Course by Kevin Powell", url: "https://www.youtube.com/watch?v=rg7Fvvl3taU", type: "free", duration: "3 hours", difficulty: "Beginner" },
              { name: "CSS Custom Properties & Variables Deep Dive", url: "https://www.youtube.com/watch?v=PHO6TBq_auI", type: "free", duration: "45 mins", difficulty: "Intermediate" }
            ],
            documentation: [
              { name: "MDN Web Docs: CSS Layouts Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout", type: "free", duration: "3 hours", difficulty: "Beginner" },
              { name: "W3C Web Accessibility (WCAG) Guidelines", url: "https://www.w3.org/WAI/standards-guidelines/wcag/", type: "free", duration: "4 hours", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "CSS Battles Gamified Challenges", url: "https://cssbattle.dev/", type: "free", duration: "5 hours", difficulty: "Intermediate" },
              { name: "Flexbox Froggy Game", url: "https://flexboxfroggy.com/", type: "free", duration: "1 hour", difficulty: "Beginner" }
            ],
            projects: [
              { name: "Build a Responsive CSS Grid Landing Page", url: "https://github.com/bradtraversy/grid-portfolio", type: "free", duration: "4 hours", difficulty: "Intermediate" }
            ],
            certifications: [
              { name: "CSS for JS Developers Course", url: "https://css-for-js.dev/", type: "paid", duration: "2 weeks", difficulty: "Intermediate" }
            ]
          }
        }
      ]
    },
    {
      title: "Phase 2: Modern Frameworks (Weeks 3-8)",
      duration: "6 Weeks",
      skills: [
        {
          title: "React 18 & State Management",
          duration: "20 days",
          desc: "Hooks (useState, useEffect, useMemo), custom hooks, component lifecycles, and global state (Zustand).",
          resources: {
            videos: [
              { name: "React 18 Full Course for Beginners", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", type: "free", duration: "12 hours", difficulty: "Beginner" },
              { name: "Zustand State Management Crash Course", url: "https://www.youtube.com/watch?v=N4tLkr16Goc", type: "free", duration: "30 mins", difficulty: "Intermediate" }
            ],
            documentation: [
              { name: "React Official Documentation: Hooks Reference", url: "https://react.dev/reference/react/hooks", type: "free", duration: "4 hours", difficulty: "Intermediate" },
              { name: "Zustand Getting Started Guide", url: "https://zustand.docs.pmnd.rs/getting-started/introduction", type: "free", duration: "2 hours", difficulty: "Intermediate" }
            ],
            practice: [
              { name: "Frontend Mentor Interactive Practice Challenges", url: "https://www.frontendmentor.io/challenges", type: "free", duration: "8 hours", difficulty: "Intermediate" }
            ],
            projects: [
              { name: "Build a React 18 Task Dashboard Project", url: "https://github.com/pmndrs/zustand", type: "free", duration: "6 hours", difficulty: "Intermediate" }
            ],
            certifications: [
              { name: "Epic React Workshop Specialization", url: "https://epicreact.dev/", type: "paid", duration: "3 weeks", difficulty: "Advanced" }
            ]
          }
        }
      ]
    }
  ]
};

const aiCoachReplies = [
  {
    keywords: ["google", "prepare", "backend"],
    text: `### Google Backend Interview Roadmap 🚀
To prepare for a Backend position at Google:
1. **Algorithmic Mastery**: You must be extremely comfortable with data structures. Graphs (DFS, BFS, Dijkstra) and Dynamic Programming are heavily tested.
2. **System Design**: Google focuses on massive distributed architectures. Read about Bigtable, Spanner, MapReduce, and GFS.
3. **Googliness**: Focus on handling ambiguity, collaborating in diverse teams, and prioritizing user privacy.
*Tip*: Your current resume completed profile lacks distributed systems keywords. Add technical achievements referencing "Distributed Systems", "RPC/gRPC" or "Multi-Threading" to align with their standard JD!`
  },
  {
    keywords: ["improve", "resume", "bullet"],
    text: `### Writing High-Impact Resume Bullets ✍️
A weak bullet lists tasks: *'Responsible for maintaining the backend API.'*
A strong bullet shows impact using the **XYZ Formula**: *'Accomplished [X], as measured by [Y], by doing [Z].'*

**Examples of enhanced bullets**:
- ❌ *Built the signup page in React.*
- ✅ *Engineered an authenticated user signup flow in React/Zustand, reducing registration friction and increasing account creations by 22% over 3 months.*
- ❌ *Optimized database queries.*
- ✅ *Redesigned indexing on PostgreSQL accounts tables and query joins, reducing query latency by 45% and database CPU utilization from 80% to 35%.*

Would you like to paste one of your bullet points here? I can generate 3 specific, metric-enhanced variations for you!`
  },
  {
    keywords: ["system design", "scale"],
    text: `### System Design Core Prep Strategy 💻
Google and Meta look for structure in system design. Follow this 4-step framework in interviews:
1. **Requirements Clarification (5 mins)**: Define functional limits (e.g. read/write ratio) and scale bounds (e.g. 500M DAU).
2. **High-Level Design (10 mins)**: Sketch boxes for Clients, Load Balancer, Gateway, Services, Cache, and Database.
3. **Deep Dive (15 mins)**: Solve bottle-necks. Cover replica databases, Redis write-through caches, data partitioning (consistent hashing), and rate-limiting.
4. **Wrap-up (5 mins)**: Talk about monitoring, logging alerts, and operational scaling.
*Read*: [Designing Data-Intensive Applications](https://amazon.com) by Martin Kleppmann. It's the absolute gold standard!`
  },
  {
    keywords: ["cover letter"],
    text: `### Cover Letter Best Practices 📝
A premium cover letter should:
1. **Be highly custom**: Never send a generic 'To Whom It May Concern'. Research the hiring manager or address the specific engineering team.
2. **Hook the reader**: In the first 2 sentences, explain *why* you are passionate about *their* specific product (e.g. Stripe's developer experience focus).
3. **Bridge the gap**: Directly link 2 achievements from your resume to the core challenges stated in their job description.
Would you like me to draft a cover letter outline for you? Click the **Cover Letter Generator** tab in the sidebar for a fully interactive builder!`
  },
  {
    keywords: ["certification", "cert"],
    text: `### Top Technical Certifications 🎓
For Backend & DevOps engineers, these certifications add significant weight:
- **AWS Certified Solutions Architect**: Shows cloud expertise.
- **Certified Kubernetes Administrator (CKA)**: Highly valued for containerized platforms.
- **Google Cloud Professional Cloud Architect**: Valued for GCP-centric stacks.
- **Confluent Certified Developer for Apache Kafka**: Shows message stream competency.
*Note*: Certifications help freshers get noticed by recruiters, but actual hands-on projects on GitHub are always the decisive factor.`
  },
  {
    keywords: ["project", "ideas"],
    text: `### High-Impact Project Ideas for Your Resume 💡
To stand out, build a project that replicates real production conditions:
- **Real-Time Analytics Pipeline**: Use Kafka to stream log events, process them via Spark/Flink, and display metrics in a real-time dashboard.
- **Custom Key-Value Store**: Build a database in Go/Rust from scratch supporting SET/GET, logging (WAL), memtable memory storage, and SSTable disk files.
- **Distributed Crawler**: Build a web crawler using concurrency channels that respects robots.txt, distributes nodes, and deduplicates URL indexing.
*Tip*: Host these on Vercel or AWS, write a clean README with architecture diagrams, and link them directly on your resume!`
  },
  {
    keywords: ["meta", "coding"],
    text: `### Meta Interview Optimization 🎯
Meta coding interviews require speed and precision:
1. **Solve 2 Medium questions in 45 minutes**: You must code fast and write code that is free of bugs.
2. **Practice Top Meta Tagged Questions**: Over 70% of Meta questions are pulled from their LeetCode list.
3. **Communication**: Explain your logic as you code, but do not stop writing. Speed is highly prioritized here compared to Google.
*Focus Areas*: Binary Trees, Sliding Windows, Graph Traversals, and Array Merging.`
  }
];

const fallbackReplies = [
  "That is a great question! I'm here to help you get job-ready. You can ask me how to prepare for specific companies (Google, Meta, Stripe), how to write stronger resume bullets, or request project suggestions.",
  "I'm keeping track of your target resume details. To optimize your preparation, make sure you fill out your resume form fully so I can give you personalized tips for companies like Google or Stripe.",
  "To land your dream job, we should focus on: 1. A clean ATS-optimized resume, 2. Mastering core DSA/System Design, and 3. Writing personalized cover letters. Let me know which area you'd like to work on right now!"
];

// Helper chatbot responder
function getCoachResponse(message, resumeData = null, targetCompany = "") {
  const query = message.toLowerCase();

  // Check triggers
  for (const reply of aiCoachReplies) {
    if (reply.keywords.every(kw => query.includes(kw))) {
      return reply.text;
    }
  }

  // Custom response if they mention a company name
  if (query.includes("stripe")) {
    return `### Preparing for Stripe 💳
Stripe's interviews are highly practical. They test coding speed, API integrations, and code readability rather than abstract algorithms.
- **Resume Tip**: Focus on projects showing full integration of developer tools or financial systems.
- **Action**: Check out the **Company Prep** tab and select Stripe for full salary benchmarks, common questions, and interview tips!`;
  }

  if (query.includes("google") || query.includes("googliness")) {
    return `### Google Interview Highlights 🔍
Google focuses heavily on raw problem solving and distributed architectures.
- **Technical**: Graph traversals and trees are highly tested. Practice whiteboarding your approach before typing.
- **Culture**: They look for intellectual humility and dealing with ambiguity.
- **Action**: Head to the **Skill Roadmap** tab to generate a custom 6-month backend learning path tailored for Google!`;
  }

  if (query.includes("resume") || query.includes("format")) {
    let responseText = `### Resume Formatting & ATS Check 📑\nFor maximum ATS compatibility:\n- Keep your resume strictly to 1 page if under 5 years of experience.\n- Use standard headers: 'Work Experience', 'Education', 'Skills'.\n- Avoid using side-by-side columns, progress bars, or graphic icons as parsing tools often read columns out of order.`;
    if (resumeData && resumeData.name) {
      responseText += `\n\nLooking at your active resume for **${resumeData.name}**, your layout looks clean. Try clicking the **AI Enhance** button next to your work bullets in the builder to add metrics.`;
    }
    return responseText;
  }

  // Random fallback
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

const supportReplies = [
  {
    keywords: ["download", "export", "save"],
    text: `### Downloading/Saving Your Resume 💾
To download your resume:
1. Go to the **Resume Builder** view in the sidebar.
2. Fill in your details or use the AI Enhance features.
3. In the live preview panel on the right, scroll to the top and click **Download JSON** or **Export Word (DOC)** to save your copy.
*Tip*: You can also import a previously downloaded JSON resume using the **Import JSON** button!`
  },
  {
    keywords: ["ats", "scanner", "analyzer", "scan"],
    text: `### ATS Analyzer & Diagnostic Scanner 📊
To analyze your resume's ATS compatibility:
1. Navigate to the **ATS Analyzer** page in the sidebar.
2. Paste the target Job Description in the input field.
3. Click the **Run Diagnostic Scan** button.
4. The system will parse your current resume, check for key terminology, and provide a compatibility score out of 100 along with a breakdown of missing keywords.`
  },
  {
    keywords: ["template", "theme", "design"],
    text: `### Resume Templates & Styles 🎨
We offer four professionally crafted CSS templates:
- **Creative Neon**: A dark, vibrant theme for creative/UI positions.
- **Developer Dark**: A sleek terminal-style theme for engineers.
- **Executive Monospace**: A classic, structured layout for management.
- **Modern Minimalist**: A clean, light theme suitable for all industries.
*How to change*: Inside the **Resume Builder** view, use the dropdown menu at the top of the preview panel to swap templates instantly.`
  },
  {
    keywords: ["cover letter", "generate letter"],
    text: `### AI Cover Letter Generator ✉️
Need a tailored cover letter?
1. Click the **Cover Letter Gen** tool in the sidebar.
2. Enter the target company, role, and your personalized motivation.
3. Click **Generate Custom Letter** to create a formatted letter instantly.
4. You can edit the text directly in the card or copy it to your clipboard.`
  },
  {
    keywords: ["portfolio", "website", "publish"],
    text: `### Static Portfolio Builder 🌐
You can turn your resume into a stunning, hostable portfolio webpage:
1. Go to the **Portfolio Builder** page in the sidebar.
2. Choose a visual layout theme.
3. Toggle settings like including project details or social links.
4. Click **Publish Portfolio** to generate a single-file static HTML website that you can host anywhere (GitHub Pages, Netlify, etc.)!`
  },
  {
    keywords: ["premium", "pricing", "cost", "free"],
    text: `### Membership Tiers & Premium Features 💎
- **Basic Account**: Includes core resume editing, single template export, and basic ATS scanning.
- **Premium Membership**: Includes all templates, unlimited AI bullet point enhancements, detailed ATS keyword gap insights, custom Skill Roadmaps, and the Cover Letter generator.
*Note*: As a test environment user, you are automatically signed in as a **Premium Member**!`
  },
  {
    keywords: ["profile", "settings", "username", "email", "change"],
    text: `### Updating Profile/Account Settings ⚙️
To change your user profile settings:
1. Click your user avatar/card at the bottom of the sidebar.
2. The **Account Profile Settings** modal will pop open.
3. You can change your name, email, target role, target company, and account tier.
4. Click **Save Settings** to persist the changes across all pages.`
  },
  {
    keywords: ["contact", "support", "email", "human", "agent", "phone"],
    text: `### Contact Human Support 📞
If you need personal assistance from our team:
- **Email Support**: support@onestep.ai (replies within 2 hours)
- **Phone Support**: 1-800-555-STEP (Mon-Fri, 9 AM - 6 PM EST)
- **FAQ Center**: Visit our support portal at help.onestep.ai`
  }
];

const fallbackSupportReplies = [
  "Hello! I am the OneStep Support Assistant. How can I help you today? You can ask me about:\n- How to download/export your resume\n- Using the ATS scanner\n- Changing resume templates\n- Creating a cover letter or portfolio website\n- Profile or account settings",
  "I'm here to help with any platform questions! Could you clarify if you're asking about the Resume Builder, ATS Scanner, Company Prep, or your Account settings?",
  "I want to make sure I give you the correct advice. Try asking something like: 'how do I download my resume?' or 'what templates do you have?' or 'how do I run an ATS scan?'"
];

function getSupportResponse(message) {
  if (!message) return "";
  const query = message.toLowerCase();

  // Check triggers
  for (const reply of supportReplies) {
    if (reply.keywords.some(kw => query.includes(kw))) {
      return reply.text;
    }
  }

  // Greeting detection
  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("support")) {
    return fallbackSupportReplies[0];
  }

  // Random fallback
  return fallbackSupportReplies[Math.floor(Math.random() * fallbackSupportReplies.length)];
}

