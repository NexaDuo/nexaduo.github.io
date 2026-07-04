# AGENTS.md

The authority @techlead and the specialists respect. Kept lean — records only
what is NOT obvious from reading the repo.

## Architecture
- Static marketing site (nexaduo.com) on **GitHub Pages**. Vanilla HTML/CSS/JS,
  **no build step**, no bundler.
- Pages: `index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`.
- **i18n is client-side**: shared `i18n.js` loaded by all pages. Text marked with
  `data-i18n` (innerHTML for content, textContent for `<title>`) and attributes
  with `data-i18n-attr`. Languages EN + PT-BR; auto-detect via
  `navigator.language` (PT-BR fallback); manual choice persisted in localStorage
  key `nexaduo-lang`; `<html lang>` set dynamically; anti-FOUC inline `<head>`
  script resolves language before render.
- **Critical CSS is DUPLICATED**: an inline `<style>` in each page's `<head>` AND
  `styles.css`. Any rule change must land in **both** or they drift (root cause of
  more than one bug this repo has seen).

## Constraints
- Pure client-side static: no runtime external libs. CSP posture relies on the
  only external origin being the CDN used for fonts — do not add script/CDN hosts.
- Reproducibility: every change in versioned HTML/CSS/JS; no manual drift.
- Respect `prefers-reduced-motion` (block in `styles.css`).
- i18n safety: only static dictionary strings may reach `innerHTML`; never pipe
  URL/localStorage/`navigator.language` into an HTML sink (they are whitelisted).

## Release phases
- **GitHub Pages, NO staging.** Deploy = merge to `main` → Pages publishes to
  **https://nexaduo.com**.
- Two GitHub Actions: **Tests** (Playwright, `node tests/site.test.mjs`) and
  **pages build and deployment**.
- Validation command: `npm test`. After merge, **confirm the "pages build and
  deployment" run conclusion** (not just Tests), then smoke-test nexaduo.com.
- **Mandatory pre-merge gate**: @sec review of the PR diff. No PR merges on
  high/critical findings (the PR author can't self-approve).

## Lessons
- **Pages deploy fails transiently** ("Deployment failed, try again later") after
  a green build — remedy is `gh run rerun <id> --failed`. Always check the deploy
  run, not only Tests, before smoke-testing.
- **Background specialists cut branches in the shared working tree**, so after a
  dispatch the tree can be left on a feature branch and local `main` stale. Sync
  back with `git checkout main && git fetch origin && git pull --ff-only`, and
  have specialists `git checkout main` after opening their PR. For parallel
  file-mutating work, use worktree isolation.
- GitHub **Issues were disabled** on this repo; enabled via
  `gh repo edit --enable-issues`. Issues are the source of truth (no Project board).
- Navbar logo alignment: the `<img>` is wrapped in `<picture>`; use
  `.nav-brand picture { display: contents }` so the img is the flex child again.
