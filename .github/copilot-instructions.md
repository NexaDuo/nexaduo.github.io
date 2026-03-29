# NexaDuo — AI Coding Guide

Static single-page site on GitHub Pages. No build system, no backend.

## Key Files

- `index.html` — critical CSS inlined in `<head>`, async loading for the rest
- `styles.css` — full styles, design tokens in `:root`
- `script.js` — loaded with `defer` (nav, scroll effects, reveal animations)
- `tests/site.test.mjs` — Playwright test suite (53 tests)
- `package.json` — `npm test` / `npm run test:headed`

## Architecture

### CSS
- Design tokens in `:root` variables (`--accent`, `--bg-primary`, `--text-*`, etc.)
- Color scheme: indigo (#4f46e5) / violet (#8b5cf6) / cyan (#06b6d4) on dark backgrounds (#030712, #0f172a)
- Floating pill navbar with `backdrop-filter: blur(20px)` on desktop, solid bg on mobile (avoids fixed positioning bugs)
- `.reveal` + `.visible` classes for scroll-triggered animations with stagger delays via `nth-child`
- Breakpoints: 1024px, 768px, 480px (desktop-first)
- `Inter Fallback` @font-face with `size-adjust` to reduce CLS

### JS
- `setupNavigation()` — mobile menu toggle, smooth scroll, `history.replaceState` to keep URLs clean (no hash)
- `setupScrollEffects()` — adds `header-scrolled` class when `scrollY > 50`, throttled with `requestAnimationFrame`
- `setupRevealAnimations()` — `IntersectionObserver` adds `.visible` to `.reveal` elements, gated behind `requestIdleCallback`
- Event delegation, passive scroll listeners, no dependencies

### HTML
- `<picture>` with WebP + PNG/JPEG fallback, `width`/`height` set, `loading="lazy"` on non-critical images
- Preload + onload pattern for async CSS/font loading with `<noscript>` fallback
- Microsoft Clarity analytics snippet at end of body

## Conventions

- Keep framework-free and static
- New sections: add markup following existing structure, use `.reveal` for animations
- CSS changes: update both inline critical CSS (above-the-fold) and `styles.css`
- External links: `rel="noopener noreferrer"`
- Accessibility: maintain Lighthouse 100 score (WCAG AA contrast, focus-visible, aria-labels, skip link)
- Don't rename public classes without updating HTML/CSS/JS references
- Run `npm test` to verify changes
