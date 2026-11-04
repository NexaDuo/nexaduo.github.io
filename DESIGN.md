---
name: NexaDuo
description: Practitioner-led platform engineering, agentic AI systems, and shipped software studio.
colors:
  obsidian-ground: "#030712"
  slate-surface: "#0f172a"
  telemetry-surface: "#0b1120"
  elevated-slate: "#1e293b"
  signal-indigo: "#4f46e5"
  signal-indigo-hover: "#5b52f0"
  luminous-indigo: "#818cf8"
  headline-indigo: "#a5b4fc"
  vaelo-amber: "#f5a524"
  vaelo-ink: "#16171a"
  status-emerald: "#34d399"
  text-primary: "#f8fafc"
  text-body: "#e2e8f0"
  text-secondary: "#94a3b8"
  text-muted: "#7c8ba0"
typography:
  display:
    fontFamily: "Inter, 'Inter Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, 'Inter Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.875rem, 3.2vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, 'Inter Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, 'Inter Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "36px"
  xl: "56px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.signal-indigo}"
    textColor: "#ffffff"
    rounded: "10px"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.signal-indigo-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-body}"
    rounded: "10px"
    padding: "14px 28px"
  button-vaelo:
    backgroundColor: "{colors.vaelo-amber}"
    textColor: "{colors.vaelo-ink}"
    rounded: "10px"
    padding: "12px 20px"
---

# Design System: NexaDuo

## Overview

**Creative North Star: "The Practitioner's Architectural Ledger"**

NexaDuo's visual system presents engineering authority through precision, structural honesty, and inspectable proof. Rather than decorating pages with generic agency illustrations or toy code snippets, the interface reads like an executive engineering specification paired with a production software ledger. Deep obsidian and slate grounds create a calm, high-contrast environment where architecture telemetry, capability matrices, and real shipped product interfaces (`Vaelo`, `mARC`, `Audio Blackbox`) command attention.

Every section is anchored by a horizontal architectural spine that pairs bold, un-kickered headings on the left with concise technical framing on the right. Monospace typography is reserved strictly for tabular indices, stack identifiers, and operational telemetry—never as a decorative costume.

**Key Characteristics:**
- Deep obsidian (`#030712`) and slate (`#0f172a`) tonal layering separated by 1px indigo-tinted hairline borders (`rgba(99, 102, 241, 0.12)`).
- Asymmetric 12-column grids (`11fr / 10fr` in the hero, `5fr / 6fr` in section spines and featured product stages).
- Solid typographic emphasis (`#a5b4fc`) and neutral dark elevation shadows (`rgba(0, 0, 0, 0.45)`) instead of decorative neon glows or gradient text.
- Product-specific sub-palettes scoped strictly to their own stage (such as Vaelo's warm amber `#f5a524` on `#16171a`).

## Colors

The palette pairs a cool, low-luminance obsidian/slate foundation with focused indigo accents for primary actions and scoped product accents for live software showcases.

### Primary
- **Signal Indigo** (`#4f46e5` / hover `#5b52f0`): Primary interactive CTA fill, active language toggle state, and focus indicators.
- **Luminous Indigo** (`#818cf8`): Monospace index badges, capability list markers, contact icons, and keyboard focus outlines.
- **Headline Indigo** (`#a5b4fc`): Solid typographic highlight inside the hero headline and interactive telemetry links.

### Secondary
- **Vaelo Amber** (`#f5a524` on `#16171a` Vaelo Ink): Scoped exclusively to the Vaelo featured product stage, status indicator, proof-point icons, and primary launch button.
- **Status Emerald** (`#34d399`): Live operational indicator dot and production badge inside the hero architecture telemetry panel.

### Neutral
- **Obsidian Ground** (`#030712`): Primary page canvas for Hero, Services, Contact, and Footer.
- **Slate Surface** (`#0f172a`) & **Telemetry Surface** (`#0b1120`): Secondary section ground (Products) and structured card/telemetry containers.
- **Elevated Slate** (`#1e293b`): Interactive row hover states, stack chips, and contact channel rows.
- **Crisp Alabaster** (`#f8fafc`) & **Slate Body** (`#e2e8f0`): Primary headings and high-contrast body copy.
- **Muted Slate** (`#94a3b8` / `#7c8ba0`): Secondary descriptions, metadata labels, and footer links.

### Named Rules
**The Solid Emphasis Rule.** Never apply CSS `background-clip: text` gradients to headings or metrics; typographic emphasis is achieved through solid color contrast (`#a5b4fc`) and weight.
**The Scoped Product Accent Rule.** Product-specific brand colors (such as Vaelo Amber `#f5a524`) remain strictly inside that product's card container and never bleed into global navigation or consulting sections.

## Typography

**Display & UI Font:** `Inter` (with metrics-calibrated `Inter Fallback` local Arial `@font-face` to prevent layout shift)
**Label / Telemetry Font:** `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`

**Character:** Clean geometric neo-grotesque for effortless long-form and executive scanning, paired with crisp system monospace strictly for tabular indices (`01`–`04`), stack tags, and telemetry headers.

### Hierarchy
- **Display (`h1`)** (`700`, `clamp(2.5rem, 4.6vw, 3.75rem)`, `line-height: 1.12`, `letter-spacing: -0.025em`): Hero manifesto statement, balanced with `text-wrap: balance`.
- **Headline (`h2`)** (`700`, `clamp(1.875rem, 3.2vw, 2.5rem)`, `line-height: 1.18`, `letter-spacing: -0.02em`): Section spine titles (`Services`, `Products`, `Contact`).
- **Title (`h3`)** (`700`, `1.5rem`, `line-height: 1.25`, `letter-spacing: -0.015em`): Service pillar headings, secondary product titles (`mARC`), and contact column titles.
- **Subtitle (`h4`)** (`700`, `1.2rem`, `line-height: 1.3`): Lab experiment titles (`Audio Blackbox`), team member names, and footer column headings.
- **Body** (`400`–`500`, `1rem` / `1.0625rem`, `line-height: 1.6`–`1.7`, `max-width: 60ch`–`70ch`): Section descriptions, product narratives, and legal prose.
- **Telemetry / Scope Label** (`600`, `0.75rem`, `letter-spacing: 0.04em`, `tabular-nums`): Architecture domain indices, stack badges, and service scope tags.

### Named Rules
**The No-Kicker Rule.** Headings (`h1`, `h2`, `h3`, `h4`) lead their containers directly without uppercase eyebrow labels or badge pills stacked above them. Metadata tags sit beside or below the heading.

## Layout

The layout uses a `1200px` centered `.container` (`padding: 0 24px`, `0 16px` under `480px`) with a `112px` vertical section rhythm on desktop (`80px` on tablet, `64px` on mobile).

- **Hero Split (`11fr / 10fr`, `48px` gap):** Left column holds the manifesto `h1`, description, CTA pair, and practitioner proof bar; right column houses the 4-domain Architecture Telemetry Panel. Collapses to a single column below `960px` while keeping the telemetry panel visible and full-width on mobile.
- **Section Spine (`5fr / 6fr`, `40px` gap):** Every major section opens with a two-column header bar (`h2` on the left, `.section-desc` on the right) anchored by a `1px` bottom border (`padding-bottom: 28px; margin-bottom: 56px`).
- **Services Blueprint (`1fr / 1fr`, `24px` gap):** Two equal-height specification cards, each containing a 2x2 capability grid separated by a top hairline rule.
- **Products Ledger:** Opens with the full-width Vaelo featured card (`5fr` device stage / `6fr` specification body), followed by horizontal media-left product rows (`280px 1fr` for `mARC`, `220px 1fr` for `Audio Blackbox`).

## Elevation & Depth

Depth is achieved through tonal slate layering (`#030712` → `#0b1120` → `#0f172a` → `#1e293b`), crisp `1px` borders (`rgba(99, 102, 241, 0.12)` warming to `0.24` on hover), and neutral dark elevation shadows.

### Shadow Vocabulary
- **Subtle Control Shadow** (`0 6px 18px rgba(0, 0, 0, 0.45)`): Navbar CTA hover feedback (without vertical transform shift).
- **Primary Button Elevation** (`0 8px 20px rgba(0, 0, 0, 0.35)` → `0 12px 28px rgba(0, 0, 0, 0.5)` on hover).
- **Featured Stage & Telemetry Depth** (`0 16px 40px rgba(0, 0, 0, 0.5)` / `0 24px 48px rgba(0, 0, 0, 0.5)`): Anchors the Hero Telemetry Panel and Featured Product card.

### Named Rules
**The Neutral Shadow Rule.** Shadows use neutral black alpha (`rgba(0, 0, 0, 0.35–0.5)`) with a vertical offset; never use zero-offset neon or purple glow halos (`box-shadow` color glows) on dark surfaces.

## Shapes

- **Navigation & Language Controls (`100px` pill):** The floating `.nav-container`, `.nav-link`, `.nav-cta`, and `.lang-switch` use full pill geometry to contrast with the rectangular architectural cards below.
- **Architectural Cards & Panels (`16px` / `var(--radius-lg)`):** Used consistently across `.telemetry-panel`, `.service-card`, `.product-featured`, `.product-card`, `.contact-team`, and `.contact-details`.
- **Interactive Buttons & Contact Rows (`10px`):** Primary, ghost, and Vaelo buttons plus contact channel rows.
- **Technical Chips (`6px` / `4px`):** Monospace stack badges (`.telemetry-stack`, `.project-tag`) and numeric indices (`.telemetry-index`).

## Components

### Floating Pill Navigation (`.nav-container`)
- **Shape & Ground:** `max-width: 880px`, `min-height: 56px`, `padding: 8px 10px 8px 20px`, `border-radius: 100px`, `background: rgba(3, 7, 18, 0.72)` with `backdrop-filter: blur(20px)` on desktop (`backdrop-filter: none` and `rgba(3, 7, 18, 0.94)` on mobile).
- **Behavior:** Transitions to `.header-scrolled` after `50px` scroll. `.nav-cta:hover` changes background and shadow without vertical `translateY` so neighboring `.lang-switch` controls never shift.

### Buttons (`.btn`)
- **Shape:** `10px` radius, `font-weight: 600`.
- **Variants:** `.btn-primary` (`#4f46e5` fill, `#ffffff` text), `.btn-ghost` (`1.5px solid rgba(226, 232, 240, 0.2)` border), `.btn-vaelo` (`#f5a524` fill, `#16171a` text).

### Architecture Telemetry Panel (`.telemetry-panel`)
- **Structure:** Header bar with live emerald dot, monospace title (`NEXADUO // ARCHITECTURE SPECIFICATION`), and `PRODUCTION` badge; 4-row `<dl>` specification list with tabular index (`01`–`04`), domain name, right-aligned stack chip, and description; footer bar linking directly to `#products`.

### Service Specification Cards (`.service-card`)
- **Structure:** Icon badge (`48x48px`, `12px` radius) beside `h3` title and monospace `.service-scope` subtitle, followed by prose summary and a 2-column `.service-list` separated by a `1px` top border.

## Do's and Don'ts

### Do:
- **Do** synchronize every Hero, Header, or root token change between `styles.css` and the inline `<style>` block in `index.html`, `privacy-policy/index.html`, and `terms-of-service/index.html`.
- **Do** bump the `?v=YYYYMMDD` cache-busting query string on `styles.css`, `i18n.js`, and `script.js` across all HTML files whenever CSS or JS changes.
- **Do** keep static default `pt-BR` copy in `index.html` identical to `DICT.pt` in `i18n.js`.
- **Do** ensure at least `8px` vertical and horizontal padding inside bordered or pill containers (such as `.nav-container`).

### Don't:
- **Don't** place kicker/eyebrow labels or status pills above `h1`, `h2`, `h3`, or `h4` headings.
- **Don't** use `background-clip: text` gradients or colored neon `box-shadow` glows.
- **Don't** use decorative pseudo-code windows or unverified social-proof claims.
- **Don't** apply `transform: translateY(...)` to `.nav-cta:hover`.
