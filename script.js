<<<<<<< HEAD
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
=======
/* ============================================
   GAMING PORTFOLIO — SCRIPT.JS
   Matrix Rain, Glitch, Achievements, Konami Code
   ============================================ */

(() => {
    'use strict';

    // ── State ──
    const state = {
        soundEnabled: false,
        achievementsUnlocked: new Set(),
        avatarClicks: 0,
        konamiProgress: 0,
        scrolledSections: new Set(),
        loaded: false,
    };

    const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    // ── Loading Screen ──
    function initLoadingScreen() {
        const bar = document.getElementById('loading-bar');
        const text = document.getElementById('loading-text');
        const screen = document.getElementById('loading-screen');

        const messages = [
            'Initializing data pipelines...',
            'Loading skill tree...',
            'Querying databases...',
            'Running Python scripts...',
            'Calibrating neon effects...',
            'Building dashboards...',
            'Rendering portfolio...',
            'READY TO BEGIN!'
        ];
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 18 + 5;
            if (progress > 100) progress = 100;
            bar.style.width = progress + '%';

            const msgIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
            text.textContent = messages[msgIndex];

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    screen.classList.add('hidden');
                    state.loaded = true;
                    // First visit achievement
                    setTimeout(() => unlockAchievement('🎮 First Visit — Welcome, Player!'), 800);
                }, 500);
            }
        }, 250);
    }

    // ── Matrix Rain ──
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]=/\\*+-';
        const charArr = chars.split('');
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00f0ff';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = charArr[Math.floor(Math.random() * charArr.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Varying brightness
                const alpha = Math.random() * 0.5 + 0.3;
                ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ── Glitch Effect ──
    function initGlitch() {
        const glitchEl = document.querySelector('.glitch');
        if (!glitchEl) return;

        function triggerGlitch() {
            glitchEl.classList.add('active');
            setTimeout(() => glitchEl.classList.remove('active'), 300);
        }

        // Random glitch every 3-7 seconds
        function scheduleGlitch() {
            const delay = 3000 + Math.random() * 4000;
            setTimeout(() => {
                triggerGlitch();
                scheduleGlitch();
            }, delay);
        }
        scheduleGlitch();
    }

    // ── Typewriter Effect ──
    function initTypewriter() {
        const target = document.getElementById('typewriter-target');
        if (!target) return;

        const text = 'B.Tech Computer Science fresher passionate about data engineering and analytics. Hands-on experience with SQL, Python, and JavaScript through internships and personal projects. Skilled in writing SQL queries, building data visualisations with Power BI, and automating data tasks with Python. Eager to learn and grow in data engineering — currently exploring cloud platforms, ETL tools, and big data technologies. Ready to contribute and learn in a collaborative team environment.';
        let index = 0;

        function typeChar() {
            if (index < text.length) {
                target.textContent += text[index];
                index++;
                setTimeout(typeChar, 15 + Math.random() * 25);
            }
        }

        // Start typing when the about section becomes visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && index === 0) {
                typeChar();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        const aboutSection = document.getElementById('about');
        if (aboutSection) observer.observe(aboutSection);
    }

    // ── Scroll Reveal ──
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Track sections for achievements
                    const section = entry.target.closest('section');
                    if (section && section.id) {
                        state.scrolledSections.add(section.id);
                        if (state.scrolledSections.size >= 5 && !state.achievementsUnlocked.has('scroll-master')) {
                            unlockAchievement('📜 Scroll Master — Explored 5 sections!');
                            state.achievementsUnlocked.add('scroll-master');
                        }
                    }
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => observer.observe(el));
    }

    // ── Skill Bar Animation ──
    function initSkillBars() {
        const bars = document.querySelectorAll('.skill-bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                    bar.classList.add('animated');
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(bar => observer.observe(bar));
    }

    // ── Navigation ──
    function initNavigation() {
        // Side dots
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = document.getElementById(dot.getAttribute('data-target'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Top nav links
        const navLinks = document.querySelectorAll('.top-nav-links a');

        // Active section tracking
        const sections = document.querySelectorAll('section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    // Update dots
                    dots.forEach(d => d.classList.remove('active'));
                    const activeDot = document.querySelector(`.nav-dot[data-target="${id}"]`);
                    if (activeDot) activeDot.classList.add('active');

                    // Update top nav
                    navLinks.forEach(l => l.classList.remove('active'));
                    const activeLink = document.querySelector(`.top-nav-links a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sec => sectionObserver.observe(sec));

        // Mobile menu
        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinksContainer = document.getElementById('nav-links');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                navLinksContainer.classList.toggle('mobile-open');
            });
            // Close menu on link click
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksContainer.classList.remove('mobile-open');
                });
            });
        }
    }

    // ── Achievement System ──
    function unlockAchievement(name) {
        const toast = document.getElementById('achievement-toast');
        const nameEl = document.getElementById('achievement-name');
        if (!toast || !nameEl) return;

        nameEl.textContent = name;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ── Avatar Easter Egg ──
    function initAvatarEgg() {
        const avatar = document.getElementById('avatar-wrapper');
        const counter = document.getElementById('avatar-counter');
        if (!avatar) return;

        avatar.addEventListener('click', () => {
            state.avatarClicks++;
            if (counter) counter.textContent = `Clicks: ${state.avatarClicks}/10`;

            // Bounce animation
            avatar.style.transform = 'scale(1.1) rotate(' + (Math.random() * 20 - 10) + 'deg)';
            setTimeout(() => avatar.style.transform = '', 300);

            if (state.avatarClicks === 10) {
                unlockAchievement('🥚 Easter Egg — You found a secret!');
                // Spin animation
                avatar.style.transition = 'transform 1s ease';
                avatar.style.transform = 'rotate(720deg) scale(1.3)';
                setTimeout(() => {
                    avatar.style.transform = '';
                    avatar.style.transition = '';
                }, 1200);
                state.avatarClicks = 0;
                if (counter) counter.textContent = '';
            }
        });
    }

    // ── Konami Code Easter Egg ──
    function initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            const expected = KONAMI_CODE[state.konamiProgress];
            if (e.key === expected) {
                state.konamiProgress++;
                if (state.konamiProgress === KONAMI_CODE.length) {
                    activateRainbowMode();
                    state.konamiProgress = 0;
                }
            } else {
                state.konamiProgress = 0;
            }
        });
    }

    function activateRainbowMode() {
        unlockAchievement('🌈 Code Breaker — Konami Code Activated!');
        document.body.classList.add('rainbow-mode');
        createConfetti();

        // Remove after 8 seconds
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
        }, 8000);
    }

    function createConfetti() {
        const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#8b00ff', '#ff00e5', '#00f0ff'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = -20 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.width = (Math.random() * 8 + 5) + 'px';
            confetti.style.height = (Math.random() * 8 + 5) + 'px';
            document.body.appendChild(confetti);

            const animDuration = 2000 + Math.random() * 3000;
            const xDrift = (Math.random() - 0.5) * 300;

            confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${xDrift}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: animDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }).onfinish = () => confetti.remove();
        }
    }

    // ── Cursor Trail ──
    function initCursorTrail() {
        // Only on desktop
        if (window.innerWidth < 768) return;

        const particles = [];
        const maxParticles = 12;

        document.addEventListener('mousemove', (e) => {
            const particle = document.createElement('div');
            particle.classList.add('cursor-particle');
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';

            // Random color variation
            const colors = ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-green)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 6px ${particle.style.background}`;

            document.body.appendChild(particle);
            particles.push(particle);

            setTimeout(() => {
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
                setTimeout(() => {
                    particle.remove();
                    particles.shift();
                }, 500);
            }, 100);

            // Limit particles
            if (particles.length > maxParticles) {
                const old = particles.shift();
                old.remove();
            }
        });
    }

    // ── Sound Toggle ──
    function initSoundToggle() {
        const btn = document.getElementById('sound-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            btn.textContent = state.soundEnabled ? '🔊 SFX' : '🔇 SFX';
        });
    }

    // ── Contact Link Hover Achievement ──
    function initContactAchievement() {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !state.achievementsUnlocked.has('explorer')) {
                setTimeout(() => {
                    unlockAchievement('🗺️ Explorer — You reached the end!');
                    state.achievementsUnlocked.add('explorer');
                }, 1500);
            }
        }, { threshold: 0.5 });

        observer.observe(contactSection);
    }

    // ── Top Nav Hide/Show on Scroll ──
    function initNavScrollBehavior() {
        let lastScroll = 0;
        const nav = document.getElementById('top-nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            nav.style.transition = 'transform 0.3s ease';
            lastScroll = currentScroll;
        });
    }

    // ── Hero Parallax ──
    function initParallax() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
        });
    }

    // ── Project Card Touch Support ──
    function initProjectCardTouch() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const inner = card.querySelector('.project-card-inner');
                if (!inner) return;
                const isFlipped = inner.style.transform === 'rotateY(180deg)';
                inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
            });
        });
    }

    // ── Keyboard-Accessible Skill Hover ──
    function initKeyboardSkills() {
        const skillTrees = document.querySelectorAll('.skill-tree');
        skillTrees.forEach(tree => {
            tree.setAttribute('tabindex', '0');
        });
    }

    // ── INIT ──
    function init() {
        initLoadingScreen();
        initMatrixRain();
        initGlitch();
        initTypewriter();
        initScrollReveal();
        initSkillBars();
        initNavigation();
        initAvatarEgg();
        initKonamiCode();
        initCursorTrail();
        initSoundToggle();
        initContactAchievement();
        initNavScrollBehavior();
        initParallax();
        initProjectCardTouch();
        initKeyboardSkills();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
>>>>>>> 809ace6cc72b1ccaacdc55577c6565ee6f3345b4
})();
