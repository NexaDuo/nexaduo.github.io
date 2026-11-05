import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, sep } from 'path';
import { fileURLToPath } from 'url';

const REQUESTED_PORT = Number(process.env.PORT) || 0;
const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

const server = createServer(async (req, res) => {
    const path = req.url.split('?')[0];
    const filePath = join(ROOT, path === '/' ? 'index.html' : path);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
        res.writeHead(403);
        return res.end();
    }
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(data);
    } catch {
        res.writeHead(404);
        res.end();
    }
});

await new Promise(resolve => server.listen(REQUESTED_PORT, '127.0.0.1', resolve));
const PORT = server.address().port;
console.log(`Server running on http://localhost:${PORT}`);

const BASE = `http://localhost:${PORT}`;
let passed = 0;
let failed = 0;

function assert(condition, name) {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}`);
        failed++;
    }
}

const headed = process.argv.includes('--headed');
const fallbackChrome = '/home/ubuntu-24/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
    || (existsSync(fallbackChrome) ? fallbackChrome : undefined);
const browser = await chromium.launch({
    headless: !headed,
    executablePath,
    args: ['--no-sandbox'],
    slowMo: headed ? 400 : 0,
});

// =============================================
// DESKTOP TESTS (1440x900)
// =============================================
console.log('\n🖥️  DESKTOP (1440x900)');
console.log('─'.repeat(40));

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
await desktop.goto(BASE, { waitUntil: 'networkidle' });

// Header
console.log('\n📌 Header');
const header = desktop.locator('.header');
assert(await header.isVisible(), 'Header is visible');

const pill = desktop.locator('.nav-container');
assert(await pill.isVisible(), 'Floating pill nav is visible');

const pillBox = await pill.boundingBox();
assert(pillBox.width < 900, `Pill is narrower than viewport (${Math.round(pillBox.width)}px)`);
assert(pillBox.y > 0, `Pill floats from top edge (y=${Math.round(pillBox.y)}px)`);

const borderRadius = await pill.evaluate(el => getComputedStyle(el).borderRadius);
assert(borderRadius === '100px', `Pill has rounded shape (${borderRadius})`);

const backdropFilter = await pill.evaluate(el => getComputedStyle(el).backdropFilter);
assert(backdropFilter.includes('blur'), `Glass effect active (${backdropFilter})`);

// Brand logo/text vertical alignment (regression for #5: <picture> wrapper
// broke .nav-brand flex centering so the logo sat above the text).
const brandImgBox = await desktop.locator('.nav-container .nav-brand img').first().boundingBox();
const brandSpanBox = await desktop.locator('.nav-container .nav-brand span').first().boundingBox();
const brandDeltaDesktop = Math.abs(
    (brandImgBox.y + brandImgBox.height / 2) - (brandSpanBox.y + brandSpanBox.height / 2)
);
assert(brandDeltaDesktop <= 1.5, `Logo & "NexaDuo" text share vertical center on desktop (Δ=${brandDeltaDesktop.toFixed(2)}px)`);

// Nav links
console.log('\n🔗 Navigation');
const navLinks = desktop.locator('.nav-menu .nav-link');
assert(await navLinks.count() === 4, '4 nav links present');
assert(await desktop.locator('.nav-cta').isVisible(), 'CTA button visible');
assert(await desktop.locator('.nav-toggle').isHidden(), 'Hamburger hidden on desktop');

// CTA hover must not jump/shift vertically (regression for #7: .nav-cta:hover
// used transform: translateY(-1px) which made the button visibly jump).
const ctaHover = desktop.locator('.nav-cta');
const langBefore = await desktop.locator('.lang-switch').boundingBox().catch(() => null);
const ctaBefore = await ctaHover.boundingBox();
await ctaHover.hover();
await desktop.waitForTimeout(300);
const ctaAfter = await ctaHover.boundingBox();
const langAfter = await desktop.locator('.lang-switch').boundingBox().catch(() => null);
const ctaDeltaY = Math.abs(ctaAfter.y - ctaBefore.y);
assert(ctaDeltaY <= 0.5, `CTA does not jump vertically on hover (Δy=${ctaDeltaY.toFixed(2)}px)`);
if (langBefore && langAfter) {
    const langDeltaY = Math.abs(langAfter.y - langBefore.y);
    assert(langDeltaY <= 0.5, `Language switch neighbor does not shift when CTA hovered (Δy=${langDeltaY.toFixed(2)}px)`);
}
const ctaHoverTransform = await ctaHover.evaluate(el => getComputedStyle(el).transform);
assert(ctaHoverTransform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(ctaHoverTransform),
    `CTA hover has no vertical transform (${ctaHoverTransform})`);
const ctaHoverShadow = await ctaHover.evaluate(el => getComputedStyle(el).boxShadow);
assert(ctaHoverShadow !== 'none', `CTA keeps a hover feedback shadow (${ctaHoverShadow})`);
// Move mouse off the CTA so it does not interfere with later interactions.
await desktop.mouse.move(0, 0);

// Smooth scroll + no hash
console.log('\n📜 Scroll & URL');
await desktop.locator('.nav-link', { hasText: 'Serviços' }).click();
await desktop.waitForTimeout(1000);
const urlAfterClick = desktop.url();
assert(!urlAfterClick.includes('#'), `No hash in URL after click (${urlAfterClick})`);

const servicesBox = await desktop.locator('#services').boundingBox();
assert(servicesBox && servicesBox.y < 900, 'Services section scrolled into view');

// Header scroll effect
await desktop.evaluate(() => window.scrollTo(0, 200));
await desktop.waitForTimeout(400);
const hasScrolledClass = await header.evaluate(el => el.classList.contains('header-scrolled'));
assert(hasScrolledClass, 'Header gets scrolled state on scroll');

// Hero section
console.log('\n🎯 Hero');
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForTimeout(300);
assert(await desktop.locator('.hero-title').isVisible(), 'Hero title visible');
assert(await desktop.locator('.hero-proof-bar').isVisible(), 'Hero practitioner proof bar visible');
assert(await desktop.locator('.telemetry-panel').isVisible(), 'Architecture telemetry panel visible');
assert(await desktop.locator('.telemetry-row').count() === 4, '4 architecture telemetry domains present');
assert(await desktop.locator('.hero-actions .btn-primary').isVisible(), 'Primary CTA visible');
assert(await desktop.locator('.hero-actions .btn-ghost').isVisible(), 'Secondary CTA visible');

const heroAccent = desktop.locator('.hero-accent').first();
const accentColor = await heroAccent.evaluate(el => getComputedStyle(el).color);
assert(accentColor !== 'rgb(248, 250, 252)', `Hero accent text has distinct emphasis color (${accentColor})`);

// Services section
console.log('\n💼 Services');
const cards = desktop.locator('.service-card');
assert(await cards.count() === 2, '2 service cards');

// Check grid layout (3 columns)
const card1 = await cards.nth(0).boundingBox();
const card2 = await cards.nth(1).boundingBox();
assert(Math.abs(card1.y - card2.y) < 5, 'Cards are in same row (2-col grid)');

// Reveal animations
await desktop.locator('#services').scrollIntoViewIfNeeded();
await desktop.waitForTimeout(800);
const animated = await cards.first().evaluate(el => el.classList.contains('visible'));
assert(animated, 'Service cards animate on scroll (reveal)');

// Cache busting: a stale styles.css with a new index.html left the
// products lists unstyled for returning visitors right after a deploy.
const unversioned = await desktop.evaluate(() => [
    ...document.querySelectorAll('link[href$=".css"], script[src$=".js"]'),
].map(el => el.getAttribute('href') || el.getAttribute('src')).filter(u => !/^https?:/.test(u)));
assert(unversioned.length === 0, `Local CSS/JS carry a ?v= version (${unversioned.join(', ') || 'all versioned'})`);

// Products section
console.log('\n📦 Products');
await desktop.locator('#products').scrollIntoViewIfNeeded();
await desktop.waitForTimeout(300);
const featured = desktop.locator('.product-featured');
assert(await featured.isVisible(), 'Featured product (Vaelo) is visible');
assert(await featured.locator('.product-featured-screen').isVisible(), 'Vaelo app screenshot is visible');
assert((await featured.locator('.product-name').textContent()).includes('Vaelo'), 'Featured product is Vaelo');
assert((await featured.locator('a[href*="play.google.com/store/apps/details?id=club.vaelo.android"]').count()) === 1, 'Vaelo Google Play link present');
assert(await featured.locator('.product-links .btn').count() === 3, '3 Vaelo links (app + Play + site) present');
const featuredBox = await featured.boundingBox();
assert(featuredBox.height < 640, `Featured product stays compact on desktop (${Math.round(featuredBox.height)}px)`);
// Regression for #16: the secondary card must stay a compact horizontal row.
const productCard = desktop.locator('.product-card').first();
assert(await productCard.isVisible(), 'Product card is visible');
const productCardBox = await productCard.boundingBox();
assert(productCardBox.height < 400, `Product card height stays under 400px on desktop (${Math.round(productCardBox.height)}px)`);
assert(await productCard.locator('.product-card-media img').isVisible(), 'Product thumbnail is visible');
assert(await productCard.locator('.project-tag').count() >= 1, 'Product tags present');
assert(await productCard.locator('.product-links .btn').count() === 2, '2 product links (site + repo) present');
assert(await desktop.locator('.product-card--lab').count() === 2, '2 open source and experiments cards present (Débora Whisper + Audio Blackbox)');
assert(await desktop.locator('.pub-card').count() === 3, '3 technical publications present');
assert(await desktop.locator('.pub-profile-link').count() === 3, '3 publication profile links (Medium, dev.to, LinkedIn) present');

// Contact section
console.log('\n📞 Contact');
await desktop.locator('#contact').scrollIntoViewIfNeeded();
await desktop.waitForTimeout(500);
assert(await desktop.locator('.contact-team').isVisible(), 'Team section visible');
assert(await desktop.locator('.contact-details').isVisible(), 'Details section visible');

const photos = desktop.locator('.contact-photo');
assert(await photos.count() === 1, '1 team member photo');

const socialLinks = desktop.locator('.contact-social .social-link');
assert(await socialLinks.count() === 2, '2 social links (LinkedIn, GitHub)');

// Footer
console.log('\n🔻 Footer');
assert(await desktop.locator('.footer').isVisible(), 'Footer visible');
assert(await desktop.locator('.footer-brand').isVisible(), 'Footer brand visible');
assert(await desktop.locator('.footer-nav').isVisible(), 'Footer nav visible');

await mkdir(join(ROOT, '.impeccable', 'review'), { recursive: true });
await desktop.evaluate(async () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    for (const img of document.querySelectorAll('img[loading="lazy"]')) {
        img.loading = 'eager';
        await img.decode().catch(() => {});
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
await desktop.waitForTimeout(200);
await desktop.screenshot({ path: join(ROOT, '.impeccable', 'review', 'desktop.png'), fullPage: true });
await desktop.screenshot({ path: '/tmp/pw-desktop.png', fullPage: true });
await desktop.close();

// =============================================
// MOBILE TESTS (390x844)
// =============================================
console.log('\n📱 MOBILE (390x844)');
console.log('─'.repeat(40));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'pt-BR' });
await mobile.goto(BASE, { waitUntil: 'networkidle' });

console.log('\n📌 Header');
assert(await mobile.locator('.nav-toggle').isVisible(), 'Hamburger is visible');
assert(await mobile.locator('.nav-cta').isHidden(), 'CTA hidden on mobile');

// Check backdrop-filter is removed on mobile
const mobileBackdrop = await mobile.locator('.nav-container').evaluate(
    el => getComputedStyle(el).backdropFilter
);
assert(mobileBackdrop === 'none', `Backdrop-filter removed on mobile (${mobileBackdrop})`);

// Brand logo/text vertical alignment on mobile (regression for #5)
const mBrandImgBox = await mobile.locator('.nav-container .nav-brand img').first().boundingBox();
const mBrandSpanBox = await mobile.locator('.nav-container .nav-brand span').first().boundingBox();
const brandDeltaMobile = Math.abs(
    (mBrandImgBox.y + mBrandImgBox.height / 2) - (mBrandSpanBox.y + mBrandSpanBox.height / 2)
);
assert(brandDeltaMobile <= 1.5, `Logo & "NexaDuo" text share vertical center on mobile (Δ=${brandDeltaMobile.toFixed(2)}px)`);

// Architecture telemetry panel stays visible and fits on mobile
const mobileTelemetryBox = await mobile.locator('.telemetry-panel').boundingBox();
assert(mobileTelemetryBox && mobileTelemetryBox.width <= 390, `Telemetry panel fits mobile viewport (${Math.round(mobileTelemetryBox?.width)}px)`);

// Open mobile menu
console.log('\n🍔 Mobile Menu');
await mobile.locator('.nav-toggle').click();
await mobile.waitForTimeout(400);

const menuVisible = await mobile.locator('.nav-menu').isVisible();
assert(menuVisible, 'Menu overlay opens on toggle click');

const menuBox = await mobile.locator('.nav-menu').boundingBox();
assert(menuBox && menuBox.width >= 380, `Menu covers full width (${Math.round(menuBox?.width)}px)`);
assert(menuBox && menuBox.height >= 800, `Menu covers full height (${Math.round(menuBox?.height)}px)`);

await mobile.screenshot({ path: '/tmp/pw-mobile-menu.png' });

// Logo stays above the menu overlay (regression for audit #10.1: the logo was
// hidden behind the full-screen .nav-menu overlay when the menu was open).
const brandVisibleOpen = await mobile.locator('.nav-container .nav-brand').isVisible();
assert(brandVisibleOpen, 'Logo visible while mobile menu is open');
const brandZ = await mobile.locator('.nav-container .nav-brand').evaluate(el => {
    const cs = getComputedStyle(el);
    return { z: parseInt(cs.zIndex, 10), pos: cs.position };
});
assert(brandZ.z >= 1000 && brandZ.pos !== 'static',
    `Logo stacks above overlay when menu open (z-index ${brandZ.z}, position ${brandZ.pos})`);
const brandOnTop = await mobile.locator('.nav-container .nav-brand').evaluate(el => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!(hit && hit.closest('.nav-brand'));
});
assert(brandOnTop, 'Logo is the top hit-target (not covered by menu overlay)');

// aria-expanded
const expanded = await mobile.locator('.nav-toggle').getAttribute('aria-expanded');
assert(expanded === 'true', `aria-expanded is true when open`);

// Click a link to close menu and navigate
await mobile.locator('.nav-menu .nav-link', { hasText: 'Contato' }).click();
await mobile.waitForTimeout(800);

const menuHidden = await mobile.locator('.nav-menu').evaluate(
    el => getComputedStyle(el).visibility === 'hidden'
);
assert(menuHidden, 'Menu closes after link click');

const mobileUrl = mobile.url();
assert(!mobileUrl.includes('#'), `No hash in mobile URL (${mobileUrl})`);

// Escape key closes menu
await mobile.locator('.nav-toggle').click();
await mobile.waitForTimeout(400);
await mobile.keyboard.press('Escape');
await mobile.waitForTimeout(400);
const menuHiddenEsc = await mobile.locator('.nav-menu').evaluate(
    el => getComputedStyle(el).visibility === 'hidden'
);
assert(menuHiddenEsc, 'Escape key closes menu');

// Body scroll lock
await mobile.locator('.nav-toggle').click();
await mobile.waitForTimeout(300);
const bodyOverflow = await mobile.evaluate(() => getComputedStyle(document.body).overflow);
assert(bodyOverflow === 'hidden', `Body scroll locked when menu open (${bodyOverflow})`);

await mobile.locator('.nav-toggle').click();
await mobile.waitForTimeout(300);
const bodyOverflow2 = await mobile.evaluate(() => getComputedStyle(document.body).overflow);
assert(bodyOverflow2 !== 'hidden', 'Body scroll unlocked when menu closed');

// Products stay legible on mobile (no horizontal overflow, stacked layout)
await mobile.locator('#products').scrollIntoViewIfNeeded();
await mobile.waitForTimeout(300);
for (const sel of ['.product-featured', '.product-card', '.pub-card']) {
    const box = await mobile.locator(sel).first().boundingBox();
    assert(box.width <= 390, `${sel} does not overflow mobile viewport (${Math.round(box.width)}px)`);
}
assert(await mobile.locator('.product-featured .product-links .btn').count() === 3, '3 Vaelo links present on mobile');

await mobile.evaluate(async () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    for (const img of document.querySelectorAll('img[loading="lazy"]')) {
        img.loading = 'eager';
        await img.decode().catch(() => {});
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
await mobile.waitForTimeout(200);
await mobile.screenshot({ path: join(ROOT, '.impeccable', 'review', 'mobile.png'), fullPage: true });
await mobile.screenshot({ path: '/tmp/pw-mobile.png' });
await mobile.close();

// =============================================
// TABLET TESTS (768x1024)
// =============================================
console.log('\n📋 TABLET (768x1024)');
console.log('─'.repeat(40));

const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 }, locale: 'pt-BR' });
await tablet.goto(BASE, { waitUntil: 'networkidle' });

// At exactly 768px, mobile styles kick in
assert(await tablet.locator('.nav-toggle').isVisible(), 'Hamburger at 768px breakpoint');

await tablet.close();

// =============================================
// ACCESSIBILITY
// =============================================
console.log('\n♿ ACCESSIBILITY');
console.log('─'.repeat(40));

const a11y = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
await a11y.goto(BASE, { waitUntil: 'networkidle' });

// Skip link
const skipLink = a11y.locator('.skip-link');
assert(await skipLink.count() === 1, 'Skip link exists');

// Tab to skip link and check visibility
await a11y.keyboard.press('Tab');
const skipVisible = await skipLink.isVisible();
assert(skipVisible, 'Skip link visible on focus');

// Heading hierarchy
const h1Count = await a11y.locator('h1').count();
assert(h1Count === 1, 'Single H1 on page');

const h2Count = await a11y.locator('h2').count();
assert(h2Count === 3, `3 H2 sections: services + products + contact (found ${h2Count})`);

// Alt text on images
const imgsWithoutAlt = await a11y.locator('img:not([alt])').count();
assert(imgsWithoutAlt === 0, 'All images have alt text');

// Social links have aria-label
const socialNoLabel = await a11y.locator('.social-link:not([aria-label])').count();
assert(socialNoLabel === 0, 'All social links have aria-label');

// Tap target sizes (regression for audit #10.2/#10.3: WCAG 2.5.8 min 24x24).
const langBtnBox = await a11y.locator('.lang-btn').first().boundingBox();
assert(langBtnBox && langBtnBox.height >= 24,
    `Language button meets min tap height (${Math.round(langBtnBox?.height)}px >= 24)`);
const socialBox = await a11y.locator('.social-link').first().boundingBox();
assert(socialBox && socialBox.width >= 44 && socialBox.height >= 44,
    `Social link is >= 44x44 (${Math.round(socialBox?.width)}x${Math.round(socialBox?.height)})`);

await a11y.close();

// nav-toggle tap size is measured on mobile where it is displayed.
const a11yToggle = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'pt-BR' });
await a11yToggle.goto(BASE, { waitUntil: 'networkidle' });
const toggleBox = await a11yToggle.locator('.nav-toggle').boundingBox();
assert(toggleBox && toggleBox.width >= 44 && toggleBox.height >= 44,
    `Hamburger toggle is >= 44x44 (${Math.round(toggleBox?.width)}x${Math.round(toggleBox?.height)})`);
await a11yToggle.close();

// =============================================
// PERFORMANCE
// =============================================
console.log('\n⚡ PERFORMANCE');
console.log('─'.repeat(40));

const perf = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const perfResponse = await perf.goto(BASE, { waitUntil: 'networkidle' });

assert(perfResponse.status() === 200, 'Page loads with 200 OK');

// Check critical CSS is inlined
const hasInlineStyle = await perf.locator('head style').count();
assert(hasInlineStyle >= 1, 'Critical CSS is inlined');

// Check async CSS loading (preload links convert to rel="stylesheet" after onload)
const asyncCSS = await perf.evaluate(() =>
    document.querySelectorAll('link[as="style"], link[rel="stylesheet"][href]').length
);
assert(asyncCSS >= 1, `External CSS loaded (${asyncCSS} stylesheets)`);

// Check that styles.css was loaded (preload→stylesheet conversion happened)
const stylesLoaded = await perf.evaluate(() =>
    [...document.styleSheets].some(s => s.href?.includes('styles.css'))
);
assert(stylesLoaded, 'styles.css loaded successfully');

// Lazy loading on contact images
const lazyImgs = await perf.locator('img[loading="lazy"]').count();
assert(lazyImgs >= 1, `Lazy-loaded images (${lazyImgs})`);

await perf.close();

// =============================================
// I18N (EN + PT-BR)
// =============================================
console.log('\n🌐 I18N (EN + PT-BR)');
console.log('─'.repeat(40));

// (1) An en-US browser context loads in English
const enCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
const enPage = await enCtx.newPage();
await enPage.goto(BASE, { waitUntil: 'networkidle' });

let htmlLang = await enPage.evaluate(() => document.documentElement.lang);
assert(htmlLang === 'en', `en-US visitor auto-detects English (<html lang="${htmlLang}">)`);

let firstLink = (await enPage.locator('.nav-menu .nav-link').first().textContent()).trim();
assert(firstLink === 'Home', `Nav rendered in EN (first link "${firstLink}")`);

let enPressed = await enPage.locator('.lang-btn[data-lang="en"]').getAttribute('aria-pressed');
assert(enPressed === 'true', 'EN selector marked active for en-US visitor');

const enTitle = await enPage.title();
assert(enTitle.includes('Innovative Technology'), `<title> translated to EN ("${enTitle}")`);

// (2) Clicking the toggle switches to PT-BR and updates <html lang> (no reload)
await enPage.locator('.lang-btn[data-lang="pt"]').click();
await enPage.waitForTimeout(100);

htmlLang = await enPage.evaluate(() => document.documentElement.lang);
assert(htmlLang === 'pt-BR', `Toggle switches <html lang> to pt-BR ("${htmlLang}")`);

firstLink = (await enPage.locator('.nav-menu .nav-link').first().textContent()).trim();
assert(firstLink === 'Início', `Content switched to PT instantly without reload ("${firstLink}")`);

// (3) Reload preserves the manual choice via localStorage (over auto-detection)
await enPage.reload({ waitUntil: 'networkidle' });

htmlLang = await enPage.evaluate(() => document.documentElement.lang);
assert(htmlLang === 'pt-BR', 'Manual PT choice persists after reload (localStorage beats en-US detection)');

const stored = await enPage.evaluate(() => localStorage.getItem('nexaduo-lang'));
assert(stored === 'pt', `Choice persisted in localStorage ("${stored}")`);

firstLink = (await enPage.locator('.nav-menu .nav-link').first().textContent()).trim();
assert(firstLink === 'Início', `PT content restored after reload ("${firstLink}")`);
await enCtx.close();

// (4) An unknown locale falls back to PT-BR
const xxCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' });
const xxPage = await xxCtx.newPage();
await xxPage.goto(BASE, { waitUntil: 'networkidle' });

htmlLang = await xxPage.evaluate(() => document.documentElement.lang);
assert(htmlLang === 'pt-BR', `Unknown locale (fr-FR) falls back to PT-BR ("${htmlLang}")`);

firstLink = (await xxPage.locator('.nav-menu .nav-link').first().textContent()).trim();
assert(firstLink === 'Início', `Fallback content is PT ("${firstLink}")`);

let ptPressed = await xxPage.locator('.lang-btn[data-lang="pt"]').getAttribute('aria-pressed');
assert(ptPressed === 'true', 'PT selector marked active on fallback');
await xxCtx.close();

// =============================================
// SEO — canonical / og:url on index + legal pages
// =============================================
console.log('\n🔎 SEO (canonical & og:url)');
console.log('─'.repeat(40));

const seoCases = [
    { path: '/index.html', url: 'https://nexaduo.com/' },
    { path: '/privacy-policy/index.html', url: 'https://nexaduo.com/privacy-policy/' },
    { path: '/terms-of-service/index.html', url: 'https://nexaduo.com/terms-of-service/' },
];
const seoPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
for (const { path, url } of seoCases) {
    await seoPage.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const ogUrl = await seoPage.locator('meta[property="og:url"]').getAttribute('content');
    const canonical = await seoPage.locator('link[rel="canonical"]').getAttribute('content').catch(() => null)
        || await seoPage.locator('link[rel="canonical"]').getAttribute('href');
    assert(ogUrl === url, `${path} og:url is directory URL (${ogUrl})`);
    assert(canonical === url, `${path} canonical matches directory URL (${canonical})`);
    assert(!/\.html/.test(ogUrl || ''), `${path} og:url has no .html`);
}
await seoPage.close();

await browser.close();
server.close();

// =============================================
// SUMMARY
// =============================================
console.log('\n' + '═'.repeat(40));
console.log(`  TOTAL: ${passed + failed} tests`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log('═'.repeat(40));

process.exit(failed > 0 ? 1 : 0);
