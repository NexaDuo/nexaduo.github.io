/**
 * NexaDuo Website JavaScript - Optimized for performance
 */

// Main initialization function
function initApp() {
  // Use event delegation to handle all nav-related events
  setupNavigation();
  
  // Lazy load scroll effects with throttling
  setupScrollEffects();
  
  // Setup animations with IntersectionObserver
  setupAnimations();
}

// Setup navigation functionality with event delegation
function setupNavigation() {
  // Mobile Nav Toggle using single event listener
  document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-menu')?.classList.toggle('active');
  });
  
  // Event delegation for nav links (one listener instead of many)
  document.querySelector('.nav-menu')?.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;
    
    // Close mobile menu
    document.querySelector('.nav-menu')?.classList.remove('active');
    
    // Handle smooth scrolling
    const targetId = link.getAttribute('href');
    if (targetId?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      target?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
  
  // Handle other anchor links that might not be in the nav menu
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]:not(.nav-link)');
    if (!anchor) return;
    
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    target?.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
}

// Setup scroll effects with throttling to improve performance
function setupScrollEffects() {
  const header = document.querySelector('.header');
  let lastScrollPosition = 0;
  let ticking = false;
  
  // Throttle scroll events to improve performance
  window.addEventListener('scroll', () => {
    lastScrollPosition = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderOnScroll(lastScrollPosition);
        ticking = false;
      });
      ticking = true;
    }
  }, {passive: true}); // Using passive listener for better scrolling performance
  
  function updateHeaderOnScroll(scrollY) {
    if (!header) return;
    
    if (scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
}

// Setup animations using IntersectionObserver
function setupAnimations() {
  // Only setup animations after critical content is loaded
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(setupObserver);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(setupObserver, 200);
  }
  
  function setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(el => observer.observe(el));
  }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already loaded, initialize immediately
  initApp();
}
