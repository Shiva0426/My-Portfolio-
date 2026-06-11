(() => {
  'use strict';

  // ── State Management ──
  const state = {
    bioTyped: false,
    activeTerminalCmd: 'location',
    pipelineStep: 0, // 0: Ingest, 1: Transform, 2: Load
    logCounter: 0,
  };

  // ── Presets for Terminal Bio ──
  const terminalData = {
    location: `📍 <span class="sub-highlight">Current Coordinates:</span> Hyderabad, India\n🗺️ <span class="sub-highlight">Relocation:</span> Open to opportunities in Bengaluru, Pune, NCR, and Hybrid/Remote setups.`,
    interests: `📊 <span class="sub-highlight">Data Pipelines & Analytics:</span> ETL, Data Cleansing, Data Lineage\n☁️ <span class="sub-highlight">Cloud Technologies:</span> AWS (Cloud Essentials), Azure (AZ-900 Study)\n🏏 <span class="sub-highlight">Offline Interests:</span> Cricket, Kabaddi (Led College Team as Captain)`,
    education: `🎓 <span class="sub-highlight">B.Tech - Computer Science & Engineering (Data Science)</span>\n🏫 KG Reddy College of Engineering & Technology, JNTUH (2020 - 2024)\n⚡ <span class="sub-highlight">Coursework:</span> SQL Database Design, Python Programming, Data Structures & Algorithms, Machine Learning Foundations.`,
    certifications: `📈 <span class="sub-highlight">Active Learning Objectives:</span>\n- Studying Microsoft Azure Data Fundamentals (AZ-900)\n- Mastering Power BI Data Modeling & DAX Query Optimization\n- Practicing Big Data pipelines with Apache Spark & Airflow`
  };

  // ── Presets for SQL Playground ──
  const sqlQueries = {
    flights_summary: {
      query: "SELECT airline, COUNT(*) AS total_flights, ROUND(AVG(delay_minutes), 1) AS avg_delay_min FROM flights GROUP BY airline ORDER BY avg_delay_min;",
      headers: ["airline", "total_flights", "avg_delay_min"],
      rows: [
        ["Akasa Air", "180", "8.2"],
        ["Indigo", "450", "12.4"],
        ["Air India", "320", "24.8"]
      ]
    },
    high_delays: {
      query: "SELECT flight_id, airline, origin, destination, delay_minutes FROM flights WHERE delay_minutes > 45 ORDER BY delay_minutes DESC;",
      headers: ["flight_id", "airline", "origin", "destination", "delay_minutes"],
      rows: [
        ["AI-128", "Air India", "BOM", "DEL", "78"],
        ["6E-201", "Indigo", "HYD", "BLR", "52"],
        ["QP-1054", "Akasa Air", "DEL", "HYD", "48"]
      ]
    },
    route_delays: {
      query: "SELECT origin, destination, ROUND(AVG(delay_minutes), 1) AS avg_route_delay FROM flights GROUP BY origin, destination ORDER BY avg_route_delay DESC LIMIT 3;",
      headers: ["origin", "destination", "avg_route_delay"],
      rows: [
        ["BOM", "DEL", "18.2"],
        ["DEL", "HYD", "14.0"],
        ["HYD", "BLR", "9.5"]
      ]
    },
    schema_info: {
      query: "EXPLAIN SELECT * FROM flights WHERE delay_minutes > 10;",
      headers: ["query_plan"],
      rows: [
        ["-> Seq Scan on flights  (cost=0.00..35.50 rows=480 width=32)"],
        ["   Filter: (delay_minutes > 10)"],
        ["   Planning Time: 0.18 ms"],
        ["   Execution Time: 1.12 ms"]
      ]
    }
  };

  // ── Ingest & Log Simulation Constants ──
  const logTemplates = {
    ingest: [
      "[INFO] Ingesting flight_delays_stream.csv (1,450 records)",
      "[INFO] Connection established to cloud source: S3://delays-raw-feed/",
      "[INFO] Ingestion complete. Raw staging table populated."
    ],
    transform: [
      "[WARN] Column 'delay_minutes' contains 12 nulls. Imputing with median value (12.0).",
      "[INFO] Applying regex schema validation on flight codes.",
      "[INFO] Data transformation: Grouped by airline carrier and calculated delay aggregates."
    ],
    load: [
      "[INFO] Opening transaction connection to PostgreSQL target...",
      "[SUCCESS] Bulk loaded 1,438 records into schema 'airline_analytics.airline_kpis'",
      "[SUCCESS] Power BI reporting gateway triggered. Refreshed Airline Operations dashboard."
    ]
  };

  // ── Mobile Menu toggle ──
  function initMobileMenu() {
    const btn = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      menu.classList.toggle('active');
      btn.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        btn.classList.remove('active');
      });
    });
  }

  // ── Typewriter effect for terminal bio ──
  function runBioTypewriter() {
    const target = document.getElementById('typewriter-output');
    if (!target) return;

    const text = "I am a B.Tech Computer Science graduate specializing in Data Science and working as a Data Analyst Intern at Labmentix. I build robust data pipelines, clean complex sets using Python, query schemas in SQL, and construct interactive dashboards in Power BI. Welcome to my professional portfolio.";
    let index = 0;

    function type() {
      if (index < text.length) {
        target.innerHTML = text.slice(0, index + 1) + '<span class="terminal-cursor"></span>';
        index++;
        setTimeout(type, 15 + Math.random() * 20);
      } else {
        // Remove trailing cursor block or keep it blinking
        target.innerHTML = text + '<span class="terminal-cursor"></span>';
        state.bioTyped = true;
        showTerminalTab(state.activeTerminalCmd);
      }
    }

    type();
  }

  // ── Interactive Bio Terminal Tabs ──
  function showTerminalTab(cmd) {
    const contentBox = document.getElementById('terminal-content');
    if (!contentBox) return;

    // Set active button styling
    const btns = document.querySelectorAll('.terminal-btn');
    btns.forEach(btn => {
      if (btn.getAttribute('data-cmd') === cmd) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Only update content if bio has finished typing, or show placeholder
    if (!state.bioTyped) {
      contentBox.innerHTML = `<span class="terminal-prompt">$</span> cat ${cmd === 'interests' ? 'interests.log' : cmd === 'education' ? 'origin_story.txt' : cmd === 'certifications' ? 'goals.json' : 'location.sh'}... (awaiting shell initialize)`;
      return;
    }

    const output = terminalData[cmd] || '';
    contentBox.innerHTML = `
      <p class="terminal-line"><span class="terminal-prompt">$</span> cat ${cmd === 'interests' ? 'interests.log' : cmd === 'education' ? 'origin_story.txt' : cmd === 'certifications' ? 'goals.json' : 'location.sh'}</p>
      <pre>${output}</pre>
    `;
  }

  function initBioTerminal() {
    const btns = document.querySelectorAll('.terminal-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = e.target.getAttribute('data-cmd');
        state.activeTerminalCmd = cmd;
        showTerminalTab(cmd);
      });
    });

    // Scroll reveal logic triggers the typewriter
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runBioTypewriter();
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) observer.observe(aboutSection);
  }

  // ── Scroll Reveal & Active Links tracking ──
  function initScrollReveal() {
    const sections = document.querySelectorAll('.scroll-reveal');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Intersection Observer for reveals
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(sec => revealObserver.observe(sec));

    // Scroll listener to activate links
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const allSections = document.querySelectorAll('section');
      
      allSections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.id;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ── Skills Animation ──
  function initSkillsAnimation() {
    const progressBars = document.querySelectorAll('.progress');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          bar.style.width = width + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => observer.observe(bar));
  }

  // ── Live ETL Pipeline Simulation ──
  function appendLog(text, type = 'info') {
    const consoleBox = document.getElementById('log-console');
    if (!consoleBox) return;

    const logDiv = document.createElement('div');
    logDiv.className = `log-line ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour12: false });
    logDiv.innerHTML = `<span class="log-time">[${time}]</span> ${text}`;
    
    consoleBox.appendChild(logDiv);
    consoleBox.scrollTop = consoleBox.scrollHeight;

    // Prune logs if they get too numerous
    if (consoleBox.childNodes.length > 30) {
      consoleBox.removeChild(consoleBox.firstChild);
    }
  }

  function simulatePipeline() {
    const nodes = {
      0: document.getElementById('node-ingest'),
      1: document.getElementById('node-transform'),
      2: document.getElementById('node-load')
    };
    const arrows = {
      1: document.getElementById('arrow-1'),
      2: document.getElementById('arrow-2')
    };

    const rateEl = document.getElementById('metric-rate');
    const successEl = document.getElementById('metric-success');
    const latencyEl = document.getElementById('metric-latency');

    function executeStep() {
      // Clear previous active nodes & arrow flows
      Object.values(nodes).forEach(n => n?.classList.remove('active'));
      Object.values(arrows).forEach(a => a?.classList.remove('running'));

      // Ingest Step
      if (state.pipelineStep === 0) {
        if (nodes[0]) nodes[0].classList.add('active');
        
        // Pick random ingest log
        const list = logTemplates.ingest;
        appendLog(list[Math.floor(Math.random() * list.length)], 'info');

        // Stats update
        if (rateEl) rateEl.textContent = Math.floor(1000 + Math.random() * 500).toLocaleString();
        if (latencyEl) latencyEl.textContent = Math.floor(35 + Math.random() * 10) + 'ms';
        if (successEl) successEl.textContent = "100%";

        state.pipelineStep = 1;
      }
      // Transform Step
      else if (state.pipelineStep === 1) {
        if (nodes[1]) nodes[1].classList.add('active');
        if (arrows[1]) arrows[1].classList.add('running');

        const list = logTemplates.transform;
        const roll = Math.random();
        let logType = 'info';
        let logText = list[0]; // defaults to warning

        if (roll > 0.6) {
          logText = list[2];
        } else if (roll > 0.3) {
          logText = list[1];
        } else {
          logType = 'warn';
        }
        appendLog(logText, logType);

        if (latencyEl) latencyEl.textContent = Math.floor(45 + Math.random() * 15) + 'ms';

        state.pipelineStep = 2;
      }
      // Load Step
      else {
        if (nodes[2]) nodes[2].classList.add('active');
        if (arrows[2]) arrows[2].classList.add('running');

        const list = logTemplates.load;
        const roll = Math.random();
        let logText = list[0];
        if (roll > 0.5) logText = list[1];
        else if (roll > 0.2) logText = list[2];

        appendLog(logText, logText.includes('[SUCCESS]') ? 'success' : 'info');

        if (latencyEl) latencyEl.textContent = Math.floor(25 + Math.random() * 10) + 'ms';

        state.pipelineStep = 0;
      }
    }

    // Run pipeline step every 3 seconds
    setInterval(executeStep, 3000);
  }

  // ── SQL Query Sandbox Playground ──
  function runSqlQuery() {
    const select = document.getElementById('query-selector');
    const table = document.getElementById('sql-results-table');
    const preview = document.getElementById('sql-input-preview');
    const countEl = document.getElementById('results-count');

    if (!select || !table || !preview) return;

    const queryKey = select.value;
    const queryData = sqlQueries[queryKey];

    if (!queryData) return;

    // Update terminal editor text
    preview.textContent = queryData.query;

    // Render Table Headers
    const thead = table.querySelector('thead');
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    queryData.headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Render Table Rows
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    queryData.rows.forEach(r => {
      const tr = document.createElement('tr');
      r.forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Update results count
    if (countEl) {
      countEl.textContent = `(${queryData.rows.length} row${queryData.rows.length > 1 ? 's' : ''} returned)`;
    }
  }

  function initSqlPlayground() {
    const btn = document.getElementById('btn-run-query');
    const select = document.getElementById('query-selector');
    
    if (btn) btn.addEventListener('click', runSqlQuery);
    if (select) {
      select.addEventListener('change', () => {
        const queryKey = select.value;
        const preview = document.getElementById('sql-input-preview');
        if (preview && sqlQueries[queryKey]) {
          preview.textContent = sqlQueries[queryKey].query;
        }
      });
    }

    // Run initial query
    runSqlQuery();
  }

  // ── Copy to Clipboard ──
  function initCopyToClipboard() {
    const copies = ['copy-email', 'copy-phone'];
    
    copies.forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;

      const btn = container.querySelector('.btn-copy');
      const val = container.getAttribute('data-clipboard');

      if (!btn || !val) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        navigator.clipboard.writeText(val).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error("Clipboard copy failed:", err);
        });
      });
    });
  }

  // ── Header Scroll Hide/Show ──
  function initHeaderScroll() {
    const header = document.getElementById('top-header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 80) {
        // Scroll down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scroll up
        header.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  }

  // ── Initializer ──
  function init() {
    initMobileMenu();
    initBioTerminal();
    initScrollReveal();
    initSkillsAnimation();
    simulatePipeline();
    initSqlPlayground();
    initCopyToClipboard();
    initHeaderScroll();
  }

  // Load DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
