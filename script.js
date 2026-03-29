/**
 * NexaDuo Website - JavaScript
 */

function initApp() {
    setupNavigation();
    setupScrollEffects();
    setupRevealAnimations();
}

function setupNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        toggle.querySelector('i').className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
        document.body.classList.toggle('menu-open', isOpen);
    });

    function closeMenu() {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('i').className = 'fas fa-bars';
        document.body.classList.remove('menu-open');
    }

    menu.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (!link) return;

        closeMenu();

        const targetId = link.getAttribute('href');
        if (targetId?.startsWith('#') && targetId.length > 1) {
            e.preventDefault();
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', window.location.pathname);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
            toggle.focus();
        }
    });

    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]:not(.nav-link)');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', window.location.pathname);
    });
}

function setupScrollEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function setupRevealAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        });
    } else {
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        }, 200);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
