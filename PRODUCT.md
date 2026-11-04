# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitors are engineering leaders, CTOs, and founders evaluating NexaDuo as a technical partner for platform engineering, cloud infrastructure, and agentic AI workflows. Secondary visitors are developers and end users discovering NexaDuo's shipped products and open-source tools (Vaelo, mARC, Audio Blackbox). Visitors arrive in either Portuguese (`pt-BR`) or English (`en`).

## Product Purpose

`nexaduo.com` is the institutional and marketing presence for NexaDuo, a Brazilian technology consultancy and software studio based in Porto Alegre, RS. Its purpose is to establish immediate technical credibility with prospective consulting clients, demonstrate real shipped software as proof of engineering craft, and convert high-intent visitors into direct conversations (`contato@nexaduo.com` / direct contact with Alexandre Machado) or product users.

## Positioning

NexaDuo is a practitioner-led engineering consultancy and studio: rather than only advising on slides, NexaDuo architects production cloud/platform infrastructure and agentic AI systems (`mARC`) and proves its craft by building, maintaining, and shipping its own end-to-end encrypted and open-source software (`Vaelo`, `mARC`, `Audio Blackbox`) used every day.

## Operating Context

- Bilingual audience across Brazil (`pt-BR`) and international markets (`en`), with automatic browser language detection (`navigator.language`, `pt-BR` fallback) and persistent manual switching (`localStorage` key `nexaduo-lang`).
- Prospective clients evaluate NexaDuo by inspecting its service focus areas, live shipped products (`vaelo.club`, `app.vaelo.club`, `marc.nexaduo.com`, GitHub repositories), and direct founder contact details.
- Legal and compliance pages (`/privacy-policy`, `/terms-of-service`) reflect Brazilian LGPD (Lei nº 13.709/2018) and corporate identity (CNPJ 29.667.108/0001-14).

## Capabilities and Constraints

- Static website hosted on GitHub Pages (`https://nexaduo.com`) with no build step, no bundler, and vanilla HTML/CSS/JS (`index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`).
- Client-side i18n via shared `i18n.js` (`data-i18n` and `data-i18n-attr`) with an anti-FOUC inline `<head>` script; only static dictionary strings may reach `innerHTML`.
- Critical CSS is duplicated between each page's inline `<head>` `<style>` block and `styles.css` (and must stay synchronized, with `?v=YYYYMMDD` cache-busting query strings bumped on CSS/JS edits).
- Strict external-origin posture: no runtime external JS libraries; external origins limited to Google Fonts, Font Awesome CDN, and Microsoft Clarity.
- Automated Playwright test suite (`npm test` -> `node tests/site.test.mjs`) validates rendering, i18n, accessibility, and links before deployment.

## Brand Commitments

- **Name & Identity:** NexaDuo (`assets/logo.png`, `assets/logo-40.webp`, `assets/NexaDuo.png`, `assets/NexaDuo-40.webp`).
- **Voice:** Direct, technical, and grounded in real engineering deliverables—free of hollow agency buzzwords.
- **Leadership & Contact:** Direct human accountability featuring Alexandre Machado (`assets/alexandre.jpeg`, `alexandre@nexaduo.com`, `+55 (51) 994 410 700`), `contato@nexaduo.com`, LinkedIn, and GitHub (`github.com/NexaDuo`).

## Evidence on Hand

- **Vaelo (`https://vaelo.club`, `https://app.vaelo.club`):** End-to-end encrypted, offline-first group expense splitting app with Brazilian IPCA inflation adjustment. Assets: `assets/vaelo-screen.webp`, `assets/vaelo-icon.png`.
- **mARC — Multi-Agent Relay Control (`https://marc.nexaduo.com`, `https://github.com/NexaDuo/mARC`):** Open-source team of AI agents operating as specialists (`@dev`, `@sre`, `@design`, `@sec`, `@rev`) in an IRC-style console built on Claude Code, Google Antigravity, and Copilot CLI. Asset: `assets/marc-og-image.png`.
- **Audio Blackbox (`https://alexandre.machado.cc/audio-blackbox`, `https://github.com/alexandre-machado/audio-blackbox`):** Continuous-memory rolling audio recorder for Android written in Kotlin. Asset: `assets/audio-blackbox-icon.webp`.
- **No fabricated social proof:** Do not invent client logos, unverified testimonials, fake metrics, or pricing tiers.

## Product Principles

1. **Proof over promises:** Anchor consulting claims in live software, open-source repositories, and concrete architectures that visitors can inspect immediately.
2. **Practitioner directness:** Speak from one engineer/leader to another in both Portuguese and English; lead with substance and real mechanisms rather than generic agency filler.
3. **Zero-bloat reliability:** Keep delivery static, fast, accessible, and self-contained—every visual or interactive enhancement must respect the zero-bundler architecture and `prefers-reduced-motion`.
4. **Direct human access:** Make reaching real leadership (`contato@nexaduo.com`, Alexandre Machado) effortless without high-friction lead-capture gates.

## Accessibility & Inclusion

- Semantic HTML landmarks, keyboard navigation with visible skip-to-content link (`.skip-link`), ARIA state attributes on navigation and language toggles, and full `prefers-reduced-motion` support.
- Bilingual parity (`pt-BR` and `en`) across all pages, metadata, and alt text.
