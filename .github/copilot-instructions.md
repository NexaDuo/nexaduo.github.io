# NexaDuo – AI Coding Agent Guide

Purpose: make agents productive in this static GitHub Pages site by encoding the concrete patterns, workflows, and constraints used here.

## Project Overview
- Static site hosted on GitHub Pages; no build system or backend.
- Key files: `index.html` (critical above-the-fold CSS inline), `styles.css`, `script.js` (source), `script.min.js` (served), `assets/` (images, favicon, webmanifest).
- Visual identity and UX choices are documented in `DESIGN_DOCUMENTATION.md`.

## Architecture & Data Flow
- HTML-first with performance optimizations:
  - Critical CSS is inlined in `<head>`; the rest is loaded via `<link rel="preload" as="style" onload=...>` with a `<noscript>` fallback.
  - Fonts and Font Awesome are preloaded; includes a small “preload polyfill” script.
  - `script.min.js` is loaded with `defer` at the end of `body`.
- JS responsibilities (`script.js` → `script.min.js`):
  - Navigation: mobile menu toggle and smooth in-page scrolling via event delegation.
  - Header state: adds/removes `header-scrolled` when `window.scrollY > 100` (throttled with `requestAnimationFrame`).
  - Animations: `IntersectionObserver` adds the `animated` class to `.service-card` elements as they enter viewport; CSS handles transitions.
- CSS structure (`styles.css`):
  - Dark theme based on brand colors; responsive grid for services; mobile nav as off-canvas panel.
  - `.service-card.animated` transitions from opacity/translateY to visible.

## Developer Workflow
- Local preview (pick one):
  - Python: `python -m http.server 8000`
  - Live Server: `live-server --port=8080`
- Deployment: push to default branch; GitHub Pages serves from repository root (no CI step).
- JS changes: edit `script.js` and regenerate `script.min.js` before commit.
  - Using Terser (no package.json required): `npx terser script.js -c -m -o script.min.js`
  - Or using esbuild: `npx esbuild script.js --minify --outfile=script.min.js`

## Conventions & Patterns
- Performance:
  - Keep critical CSS minimal and inlined in `index.html`; place the rest in `styles.css` and continue using `preload` + `onload` + `<noscript>` pattern.
  - Use passive listeners for scroll; throttle with `requestAnimationFrame` (see `setupScrollEffects()` in `script.js`).
  - Prefer `IntersectionObserver` over scroll/resize polling for reveal animations.
- HTML:
  - Maintain `<picture>` with WebP source + PNG/JPEG fallback for images; always set `width`/`height` to avoid CLS and add `loading="lazy"` for non-critical images.
  - External links should include `rel="noopener noreferrer"`.
  - Keep Microsoft Clarity snippet intact in `index.html` unless explicitly disabling analytics.
- CSS:
  - Respect dark theme palette informed by `DESIGN_DOCUMENTATION.md` (brand blues, slate backgrounds, subtle borders/shadows).
  - Use existing class names (`.header`, `.nav-menu`, `.service-card`, `.footer` …); don’t rename without updating HTML and JS.
  - Media queries follow desktop-first breakpoints: 1024px, 768px, 480px.
- JS:
  - Use event delegation for links and nav (see `setupNavigation()`), and avoid attaching many listeners.
  - When adding scroll-driven UI, extend `updateHeaderOnScroll()`/existing pattern rather than creating new global listeners.
  - Gate non-critical work behind `requestIdleCallback` fallback (see `setupAnimations()`).

## Assets & Favicons
- Favicons and webmanifest live under `assets/favicon/` and are referenced in `index.html`. Preserve paths and sizes.
- New images should live under `assets/` and include a WebP variant when feasible.

## Python Utilities (Design Aid)
- Color analysis helpers: `analyze_logo.py` and `analyze_logo_detailed.py` (require Pillow).
  - Install: `pip install Pillow`
  - Default logo path: `assets/NexaDuo.png`. Scripts print top colors and suggested CSS variables; use results to keep palette consistent.

## When Extending the Site
- New sections:
  - Add markup in `index.html` using existing section structure (container, header, grid).
  - Style in `styles.css`; if the section has above-the-fold presence, mirror minimal critical styles inline.
  - Hook reveal animations by giving elements a class observed in JS (e.g., `.service-card`) or extend the observer selector in `setupAnimations()`.
- New interactions:
  - Add logic in `script.js` following the existing modular functions; re-minify to `script.min.js`.
  - Prefer progressive enhancement; no dependencies on frameworks.

## Do/Don’t
- Do keep the site framework-free and static; avoid adding build steps or runtime dependencies.
- Do regenerate `script.min.js` whenever `script.js` changes.
- Don’t introduce blocking CSS/JS or remove the preload/noscript patterns.
- Don’t rename public classes/IDs without updating all references across HTML/CSS/JS.
