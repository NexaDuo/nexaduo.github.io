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

    function toggleIcon(isOpen) {
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.remove(isOpen ? 'fa-bars' : 'fa-xmark');
            icon.classList.add(isOpen ? 'fa-xmark' : 'fa-bars');
        }
    }

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        toggleIcon(isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    });

    function closeMenu() {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggleIcon(false);
        document.body.classList.remove('menu-open');
    }

    function smoothScrollTo(targetId, e) {
        if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;

        try {
            const target = document.querySelector(targetId);
            if (target) {
                if (e) e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', window.location.pathname);
                return true;
            }
        } catch (err) {
            console.warn('Invalid selector:', targetId);
        }
        return false;
    }

    menu.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (!link) return;

        closeMenu();
        smoothScrollTo(link.getAttribute('href'), e);
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

        smoothScrollTo(anchor.getAttribute('href'), e);
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

    const reveals = document.querySelectorAll('.reveal');
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            reveals.forEach((el) => observer.observe(el));
        });
    } else {
        setTimeout(() => {
            reveals.forEach((el) => observer.observe(el));
        }, 200);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
