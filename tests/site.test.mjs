import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const PORT = 8080;
const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

const server = createServer(async (req, res) => {
    const filePath = join(ROOT, req.url === '/' ? 'index.html' : req.url);
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(data);
    } catch {
        res.writeHead(404);
        res.end();
    }
});

await new Promise(resolve => server.listen(PORT, resolve));
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
const browser = await chromium.launch({
    headless: !headed,
    args: ['--no-sandbox'],
    slowMo: headed ? 400 : 0,
});

// =============================================
// DESKTOP TESTS (1440x900)
// =============================================
console.log('\n🖥️  DESKTOP (1440x900)');
console.log('─'.repeat(40));

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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

// Nav links
console.log('\n🔗 Navigation');
const navLinks = desktop.locator('.nav-menu .nav-link');
assert(await navLinks.count() === 3, '3 nav links present');
assert(await desktop.locator('.nav-cta').isVisible(), 'CTA button visible');
assert(await desktop.locator('.nav-toggle').isHidden(), 'Hamburger hidden on desktop');

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
assert(await desktop.locator('.hero-badge').isVisible(), 'Hero badge visible');
assert(await desktop.locator('.hero-title').isVisible(), 'Hero title visible');
assert(await desktop.locator('.code-window').isVisible(), 'Code window visible');
assert(await desktop.locator('.hero-actions .btn-primary').isVisible(), 'Primary CTA visible');
assert(await desktop.locator('.hero-actions .btn-ghost').isVisible(), 'Secondary CTA visible');

const gradientText = desktop.locator('.gradient-text').first();
const bgClip = await gradientText.evaluate(el => getComputedStyle(el).webkitBackgroundClip);
assert(bgClip === 'text', 'Gradient text effect applied');

// Services section
console.log('\n💼 Services');
const cards = desktop.locator('.service-card');
assert(await cards.count() === 3, '3 service cards');

// Check grid layout (3 columns)
const card1 = await cards.nth(0).boundingBox();
const card2 = await cards.nth(1).boundingBox();
assert(Math.abs(card1.y - card2.y) < 5, 'Cards are in same row (3-col grid)');

// Reveal animations
await desktop.locator('#services').scrollIntoViewIfNeeded();
await desktop.waitForTimeout(800);
const animated = await cards.first().evaluate(el => el.classList.contains('visible'));
assert(animated, 'Service cards animate on scroll (reveal)');

// Contact section
console.log('\n📞 Contact');
await desktop.locator('#contact').scrollIntoViewIfNeeded();
await desktop.waitForTimeout(500);
assert(await desktop.locator('.contact-team').isVisible(), 'Team section visible');
assert(await desktop.locator('.contact-details').isVisible(), 'Details section visible');

const photos = desktop.locator('.contact-photo');
assert(await photos.count() === 2, '2 team member photos');

const socialLinks = desktop.locator('.contact-social .social-link');
assert(await socialLinks.count() === 2, '2 social links (LinkedIn, GitHub)');

// Footer
console.log('\n🔻 Footer');
assert(await desktop.locator('.footer').isVisible(), 'Footer visible');
assert(await desktop.locator('.footer-brand').isVisible(), 'Footer brand visible');
assert(await desktop.locator('.footer-nav').isVisible(), 'Footer nav visible');

await desktop.screenshot({ path: '/tmp/pw-desktop.png', fullPage: true });
await desktop.close();

// =============================================
// MOBILE TESTS (390x844)
// =============================================
console.log('\n📱 MOBILE (390x844)');
console.log('─'.repeat(40));

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE, { waitUntil: 'networkidle' });

console.log('\n📌 Header');
assert(await mobile.locator('.nav-toggle').isVisible(), 'Hamburger is visible');
assert(await mobile.locator('.nav-cta').isHidden(), 'CTA hidden on mobile');

// Check backdrop-filter is removed on mobile
const mobileBackdrop = await mobile.locator('.nav-container').evaluate(
    el => getComputedStyle(el).backdropFilter
);
assert(mobileBackdrop === 'none', `Backdrop-filter removed on mobile (${mobileBackdrop})`);

// Code window hidden on mobile
assert(await mobile.locator('.hero-visual').isHidden(), 'Code window hidden on mobile');

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

await mobile.screenshot({ path: '/tmp/pw-mobile.png' });
await mobile.close();

// =============================================
// TABLET TESTS (768x1024)
// =============================================
console.log('\n📋 TABLET (768x1024)');
console.log('─'.repeat(40));

const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
await tablet.goto(BASE, { waitUntil: 'networkidle' });

// At exactly 768px, mobile styles kick in
assert(await tablet.locator('.nav-toggle').isVisible(), 'Hamburger at 768px breakpoint');

await tablet.close();

// =============================================
// ACCESSIBILITY
// =============================================
console.log('\n♿ ACCESSIBILITY');
console.log('─'.repeat(40));

const a11y = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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
assert(h2Count === 2, `2 H2 sections: services + contact (found ${h2Count})`);

// Alt text on images
const imgsWithoutAlt = await a11y.locator('img:not([alt])').count();
assert(imgsWithoutAlt === 0, 'All images have alt text');

// Social links have aria-label
const socialNoLabel = await a11y.locator('.social-link:not([aria-label])').count();
assert(socialNoLabel === 0, 'All social links have aria-label');

await a11y.close();

// =============================================
// PERFORMANCE
// =============================================
console.log('\n⚡ PERFORMANCE');
console.log('─'.repeat(40));

const perf = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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
assert(lazyImgs >= 2, `Lazy-loaded images (${lazyImgs})`);

await perf.close();
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
