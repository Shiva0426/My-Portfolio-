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
})();
