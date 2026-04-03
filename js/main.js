/* ═══════════════════════════════════════════════════════════
   HelpHub ISP | Site de Vendas | JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initTypedEffect();
    initParticles();
    initScreenshotTabs();
    initSideNav(); // New
    initSmartScroll(); // New
    initMobileMenu();
});

/* ── Navbar Scroll ── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ── Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ── Typed Effect ── */
function initTypedEffect() {
    const target = document.getElementById('typed-target');
    if (!target) return;

    const words = ['acessível.', 'direta.', 'moderna.', 'inteligente.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            target.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ── Particles (Canvas) ── */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.4 + 0.1,
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 102, 255, ${p.opacity})`;
        ctx.fill();
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 102, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function update() {
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines();
        particles.forEach(drawParticle);
        update();
        requestAnimationFrame(animate);
    }

    init();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 250);
    });
}

/* ── Screenshot Tabs ── */
function initScreenshotTabs() {
    const tabs = document.querySelectorAll('.screenshot-tab');
    const images = document.querySelectorAll('.screenshot-body img');
    const placeholder = document.querySelector('.screenshot-placeholder');
    const caption = document.querySelector('.screenshot-caption');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');

            const target = tab.dataset.tab;

            images.forEach(img => {
                img.classList.remove('is-active');
                if (img.dataset.tab === target) {
                    img.classList.add('is-active');
                    if (placeholder) placeholder.style.display = 'none';
                }
            });

            // Check if any image is active (has src), show placeholder if not
            const activeImg = document.querySelector('.screenshot-body img.is-active');
            if (activeImg && !activeImg.src) {
                if (placeholder) placeholder.style.display = 'flex';
            }

            if (caption) {
                const captions = {
                    'dashboard': 'Dashboard com indicadores financeiros consolidados em tempo real',
                    'clientes': 'Perfil do cliente com abas contextuais e navegação cruzada',
                    'financeiro': 'Controle financeiro com previsão de entrada e inadimplência',
                    'chamados': 'Fila de chamados com atualização em tempo real (Live Sync)',
                    'agenda': 'Calendário de visitas com Drag & Drop e status por cor',
                    'rede': 'Gestão de equipamentos de rede e balanceamento de carga',
                    'mapa': 'Mapa georreferenciado com status técnico ao vivo dos clientes'
                };
                caption.textContent = captions[target] || '';
            }
        });
    });
}

/* ── Side Navigation Dots ── */
function initSideNav() {
    const sideNav = document.getElementById('side-nav');
    const sections = document.querySelectorAll('section[id]');
    if (!sideNav || !sections.length) return;

    // Clear and Generate Dots
    sideNav.innerHTML = '';
    const sectionLabels = {
        'hero': 'Início',
        'dores': 'Por que mudar?',
        'features': 'Funcionalidades',
        'screenshots': 'O Sistema',
        'comparacao': 'Comparativo',
        'preco': 'Preço',
        'contato': 'Contato'
    };

    sections.forEach(section => {
        const dot = document.createElement('div');
        dot.className = 'side-nav-dot';
        dot.dataset.section = section.id;
        dot.dataset.label = sectionLabels[section.id] || section.id;
        
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        
        sideNav.appendChild(dot);
    });

    // Observer to Highlight Active Dot
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.side-nav-dot').forEach(dot => {
                    dot.classList.toggle('is-active', dot.dataset.section === entry.target.id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ── Smart Scroll Snap Logic ── */
function initSmartScroll() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    let isScrolling = false;
    let lastScrollTime = Date.now();

    const smoothScrollTo = (target) => {
        if (!target) return;
        isScrolling = true;
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Block consecutive scroll events during transition
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    };

    window.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const now = Date.now();
        if (now - lastScrollTime < 100) return; // Debounce
        lastScrollTime = now;

        const direction = e.deltaY > 0 ? 'down' : 'up';
        
        // Find section currently in view
        const currentSectionIndex = sections.findIndex(section => {
            const rect = section.getBoundingClientRect();
            // True if the section top is near viewport top, 
            // OR if the section covers the top area of the viewport (long sections)
            return (rect.top <= 50 && rect.bottom >= 50);
        });

        if (currentSectionIndex === -1) return;

        const currentSection = sections[currentSectionIndex];
        const rect = currentSection.getBoundingClientRect();
        const winHeight = window.innerHeight;

        // "Smart" logic: Only move to next section if we are at the boundaries
        if (direction === 'down') {
            const isAtSectionBottom = Math.floor(rect.bottom) <= winHeight + 10;
            const isAtPageBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
            
            if (isAtSectionBottom && !isAtPageBottom && currentSectionIndex < sections.length - 1) {
                e.preventDefault();
                smoothScrollTo(sections[currentSectionIndex + 1]);
            }
        } else {
            const isAtSectionTop = Math.floor(rect.top) >= -10;
            
            if (isAtSectionTop && currentSectionIndex > 0) {
                e.preventDefault();
                smoothScrollTo(sections[currentSectionIndex - 1]);
            }
        }
    }, { passive: false });

    // Handle Anchor Links (Navbar)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
                
                // Close mobile menu
                const navLinks = document.querySelector('.navbar-links');
                const hamburger = document.querySelector('.navbar-hamburger');
                if (navLinks) navLinks.classList.remove('is-open');
                if (hamburger) hamburger.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        });
    });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
    const hamburger = document.querySelector('.navbar-hamburger');
    const navLinks = document.querySelector('.navbar-links');
    const body = document.body;

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        hamburger.classList.toggle('is-active');
        body.style.overflow = isOpen ? 'hidden' : '';
    });
}
