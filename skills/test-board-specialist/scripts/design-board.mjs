// scripts/design-board.mjs -- the BOARD OF TESTERS for a website.
//
// Written into the project by PManager (do not hand-edit; re-run to refresh).
// Each tester is a real visitor with a real condition -- a slow phone, a 400%
// zoom, a keyboard, no JavaScript, a screen reader's view -- and each check is
// measured in a real Chrome/Edge, not guessed. Findings carry a severity and a
// fix hint so the agent can act on them, then re-run.
//
//   npm i -D playwright-core          (uses your installed Chrome or Edge; no download)
//   node scripts/design-board.mjs --url index.html            (a file)
//   node scripts/design-board.mjs --url http://localhost:5173 (a running dev server)
//   options: --src . (folder scanned by the token-discipline tester)   --out docs/board   --only mobile-4g,keyboard   --budget 6 (max screen-heights; 12 for a scroll film)   --mb 1.5 (first-load megabytes; 4 for a scroll film)
//
// Writes <out>/report.md, <out>/latest.json and <out>/shots/*.png.
// Exit code 1 when any blocker or major finding is open.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const opt = (name, fallback) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback }
const target = opt('url', 'index.html')
const outDir = resolve(opt('out', 'docs/board'))
const only = opt('only', '').split(',').filter(Boolean)
const BUDGET = Number(opt('budget', '6'))
const MAX_MB = Number(opt('mb', '1.5'))
const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href
mkdirSync(join(outDir, 'shots'), { recursive: true })

let chromium
try { ({ chromium } = await import('playwright-core')) } catch {
  console.error('playwright-core is missing. Run: npm i -D playwright-core'); process.exit(2)
}
async function launch(extra = []) {
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel, args: extra }) } catch { /* try the next browser */ }
  }
  console.error('No Chrome or Edge found for playwright-core.'); process.exit(2)
}

const SEV = { blocker: 3, major: 2, minor: 1 }
const results = []

// One tester = one condition. `run` returns findings: { sev, msg, evidence?, fix? }.
async function tester(id, who, condition, run) {
  if (only.length && !only.includes(id)) return
  const findings = []
  const add = (sev, msg, fix, evidence) => findings.push({ sev, msg, fix, evidence })
  try { await run(add) } catch (e) { add('major', 'the tester itself could not finish: ' + e.message, 'make the page loadable in a plain browser first') }
  const worst = Math.max(0, ...findings.map((f) => SEV[f.sev]))
  results.push({ id, who, condition, verdict: worst >= 2 ? 'FAIL' : worst === 1 ? 'WARN' : 'PASS', findings })
  console.log((worst >= 2 ? 'FAIL ' : worst === 1 ? 'WARN ' : 'PASS ') + id + ' -- ' + who)
}

const throttle = async (page, { down, up, rtt, cpu }) => {
  const c = await page.context().newCDPSession(page)
  if (down) await c.send('Network.emulateNetworkConditions', { offline: false, downloadThroughput: down, uploadThroughput: up, latency: rtt })
  if (cpu) await c.send('Emulation.setCPUThrottlingRate', { rate: cpu })
  return c
}
const SLOW_4G = { down: (1.6 * 1024 * 1024) / 8, up: (750 * 1024) / 8, rtt: 150 }
const FAST_3G = { down: (1.6 * 1024 * 1024) / 8, up: (750 * 1024) / 8, rtt: 562 }

// Metrics collected inside the page before anything else runs.
const VITALS = `(() => {
  window.__v = { lcp: 0, cls: 0, longTasks: 0, errors: [] };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.longTasks += Math.max(0, e.duration - 50) }).observe({ type: 'longtask', buffered: true });
  addEventListener('error', (e) => window.__v.errors.push(String(e.message)));
  addEventListener('unhandledrejection', (e) => window.__v.errors.push(String(e.reason)));
})()`

async function open(browser, ctxOpts, prep) {
  const context = await browser.newContext(ctxOpts)
  await context.addInitScript(VITALS)
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  let bytes = 0
  page.on('response', async (r) => { try { const b = await r.body(); bytes += b.length } catch { /* redirects, aborted */ } })
  const cdp = prep ? await prep(page) : null
  const t0 = Date.now()
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1200)
  return { page, context, cdp, consoleErrors, loadMs: Date.now() - t0, bytes: () => bytes }
}

const shot = async (page, name, full = false) => {
  const p = join('shots', name + '.png')
  await page.screenshot({ path: join(outDir, p), fullPage: full })
  return p
}

// The project's own source files (CSS, markup, components), for the testers that read code rather than pixels.
async function sourceFiles(root) {
  const { readdirSync, statSync } = await import('node:fs')
  const skip = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'docs', 'scripts', 'public', 'coverage', 'out'])
  const files = []
  const walk = (dir, depth) => {
    if (depth > 6 || files.length > 400) return
    let entries
    try { entries = readdirSync(dir) } catch { return }
    for (const name of entries) {
      if (skip.has(name) || name.startsWith('.')) continue
      const full = join(dir, name)
      let st
      try { st = statSync(full) } catch { continue }
      if (st.isDirectory()) walk(full, depth + 1)
      else if (/\.(css|scss|html|jsx?|tsx?|vue|svelte)$/i.test(name) && st.size < 400000) files.push(full)
    }
  }
  walk(root, 0)
  return files
}

const browser = await launch()

// 1. THE IMPATIENT MOBILE SHOPPER: 390px phone, slow 4G, slowed CPU.
await tester('mobile-4g', 'Impatient shopper on a phone, slow 4G', '390x844, touch, Slow 4G, 4x CPU', async (add) => {
  const s = await open(browser, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, (p) => throttle(p, { ...SLOW_4G, cpu: 4 }))
  const v = await s.page.evaluate('window.__v')
  if (v.lcp > 4000) add('major', `LCP ${Math.round(v.lcp)}ms on Slow 4G (limit 4000)`, 'shrink or preload the hero image, inline critical CSS, defer scripts and any 3D canvas', { lcp: v.lcp })
  else if (v.lcp > 2500) add('minor', `LCP ${Math.round(v.lcp)}ms on Slow 4G (good is under 2500)`, 'compress the largest above-the-fold element', { lcp: v.lcp })
  if (v.cls > 0.25) add('major', `layout shift ${v.cls.toFixed(2)} (limit 0.25)`, 'give images and embeds width/height, reserve space for late content', { cls: v.cls })
  else if (v.cls > 0.1) add('minor', `layout shift ${v.cls.toFixed(2)} (good is under 0.1)`, 'reserve space for images, fonts and banners')
  if (s.bytes() > MAX_MB * 1e6) add('major', `${(s.bytes() / 1e6).toFixed(1)} MB transferred on first load (budget ${MAX_MB} MB; use --mb 4 for a scroll film)`, 'compress images (AVIF/WebP), lazy-load below the fold, drop unused libraries')
  const dom = await s.page.evaluate(`(() => {
    const vw = innerWidth, doc = document.documentElement
    const small = [...document.querySelectorAll('a[href],button,input,select,textarea,[role=button]')].filter((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e)
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && (r.width < 24 || r.height < 24) && !(e.tagName === 'A' && e.closest('p,li') && getComputedStyle(e).display === 'inline')
    }).slice(0, 5).map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30))
    const body = parseFloat(getComputedStyle(document.body).fontSize)
    const cta = [...document.querySelectorAll('a[href],button')].filter((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 60 && e.textContent.trim().length > 2 }).length
    return { overflow: doc.scrollWidth - vw, small, body, ctaInFold: cta, viewportMeta: !!document.querySelector('meta[name=viewport]') }
  })()`)
  if (dom.overflow > 1) add('blocker', `page scrolls sideways by ${dom.overflow}px at 390px`, 'find the element wider than the viewport (images, tables, fixed widths) and constrain it with max-width:100%')
  if (dom.small.length) add('major', `tap targets under 24px: ${dom.small.join(', ')}`, 'make interactive elements at least 44x44px on touch screens')
  if (dom.body < 16) add('minor', `body text is ${dom.body}px on a phone`, 'use at least 16px for body text')
  if (!dom.viewportMeta) add('blocker', 'no <meta name="viewport">', 'add <meta name="viewport" content="width=device-width, initial-scale=1">')
  if (dom.ctaInFold < 1) add('major', 'nothing tappable and prominent in the first screen', 'put the one primary action in the first viewport')
  await shot(s.page, 'mobile-390')
  await s.context.close()
})

// 2. THE LOW-END ANDROID: 360px, 6x CPU, Fast 3G, watching for main-thread jank and errors.
await tester('low-end-android', 'Person on a cheap Android phone', '360x740, Fast 3G, 6x CPU', async (add) => {
  const s = await open(browser, { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, (p) => throttle(p, { ...FAST_3G, cpu: 6 }))
  const v = await s.page.evaluate('window.__v')
  if (v.longTasks > 1500) add('major', `${Math.round(v.longTasks)}ms of blocking main-thread work at load`, 'split or defer JavaScript, lazy-load heavy libraries and any 3D scene')
  else if (v.longTasks > 600) add('minor', `${Math.round(v.longTasks)}ms of blocking work at load`, 'defer non-critical scripts')
  const errs = [...s.consoleErrors, ...v.errors]
  if (errs.length) add('major', 'errors on load: ' + errs.slice(0, 3).join(' | '), 'fix every console error; a clean load is the baseline')
  if (s.loadMs > 12000) add('major', `load event took ${(s.loadMs / 1000).toFixed(1)}s`, 'cut requests and bytes')
  await s.context.close()
})

// 3. THE ZOOMING READER: 400% zoom equals a 320px-wide layout; text must reflow, not scroll sideways.
await tester('zoom-reflow', 'Reader who zooms to 400% (or has a small screen)', '320x256 CSS px, plus 200% text', async (add) => {
  const s = await open(browser, { viewport: { width: 320, height: 256 } })
  const r = await s.page.evaluate(`(() => {
    const over = document.documentElement.scrollWidth - innerWidth
    const wide = [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed').slice(0, 4).map((e) => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : ''))
    return { over, wide }
  })()`)
  if (r.over > 1) add('blocker', `content is wider than 320px by ${r.over}px (fails WCAG reflow)`, 'let wide elements wrap or shrink; widest offenders: ' + r.wide.join(', '))
  await s.page.evaluate("document.documentElement.style.fontSize = '200%'")
  const clipped = await s.page.evaluate(`[...document.querySelectorAll('h1,h2,h3,p,a,button,li')].filter((e) => { const c = getComputedStyle(e); const box = e.getBoundingClientRect(); if (box.width <= 2 || box.height <= 2) return false; return (c.overflow === 'hidden' || c.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 2 }).length`)  // a visually hidden (sr-only) heading is not cut-off text
  if (clipped > 0) add('major', `${clipped} text element(s) cut off when text is doubled`, 'do not fix text containers to a pixel height or hide their overflow')
  await shot(s.page, 'zoom-320')
  await s.context.close()
})

// 4. THE SCREEN-READER USER: the page as an outline of landmarks, headings and names.
await tester('screen-reader', 'Blind visitor using a screen reader', 'reads the accessibility tree, not the pixels', async (add) => {
  const s = await open(browser, { viewport: { width: 1280, height: 800 } })
  const a = await s.page.evaluate(`(() => {
    const q = (sel) => [...document.querySelectorAll(sel)]
    const heads = q('h1,h2,h3,h4,h5,h6').map((h) => +h.tagName[1])
    let skips = 0; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips++
    const name = (e) => (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.textContent || e.getAttribute('title') || e.querySelector('img[alt]')?.alt || '').trim()
    return {
      lang: document.documentElement.lang, title: document.title.trim(),
      h1: heads.filter((h) => h === 1).length, skips,
      main: q('main,[role=main]').length, nav: q('nav,[role=navigation]').length,
      imgNoAlt: q('img:not([alt])').length,
      unnamedLinks: q('a[href]').filter((e) => !name(e)).length,
      unnamedButtons: q('button,[role=button]').filter((e) => !name(e)).length,
      unlabelled: q('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').filter((e) => !(e.id && document.querySelector('label[for="' + e.id + '"]')) && !e.closest('label') && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby')).length,
      genericLinks: q('a[href]').filter((e) => /^(click here|here|read more|more|learn more)$/i.test(e.textContent.trim())).length,
    }
  })()`)
  if (!a.lang) add('major', 'the page has no lang attribute', 'set <html lang="en">')
  if (!a.title) add('major', 'the page has no <title>', 'give every page a specific title')
  if (a.h1 !== 1) add('major', `${a.h1} h1 elements (should be exactly 1)`, 'one h1 that names the page')
  if (a.skips > 0) add('minor', `${a.skips} heading level skip(s)`, 'do not jump from h2 to h4')
  if (a.main !== 1) add('major', `${a.main} main landmarks (should be 1)`, 'wrap the page content in one <main>')
  if (a.nav < 1) add('minor', 'no <nav> landmark', 'wrap the primary navigation in <nav>')
  if (a.imgNoAlt) add('major', `${a.imgNoAlt} image(s) without an alt attribute`, 'describe informative images; use alt="" for decoration')
  if (a.unnamedLinks) add('major', `${a.unnamedLinks} link(s) with no accessible name`, 'give icon links an aria-label')
  if (a.unnamedButtons) add('major', `${a.unnamedButtons} button(s) with no accessible name`, 'give icon buttons an aria-label')
  if (a.unlabelled) add('major', `${a.unlabelled} form field(s) with no label`, 'associate a <label> with every field')
  if (a.genericLinks) add('minor', `${a.genericLinks} vague link text ("click here", "read more")`, 'make link text describe its destination')
  await s.context.close()
})

// 5. THE KEYBOARD-ONLY USER: Tab through the page.
await tester('keyboard', 'Keyboard-only user', 'Tab / Shift+Tab, no mouse', async (add) => {
  const s = await open(browser, { viewport: { width: 1280, height: 800 } })
  const visited = []
  let hidden = 0
  for (let i = 0; i < 80; i++) {
    await s.page.keyboard.press('Tab')
    const f = await s.page.evaluate(`(() => {
      const e = document.activeElement; if (!e || e === document.body) return null
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect()
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none')
      return { id: e.tagName + '|' + (e.id || '') + '|' + (e.textContent || '').trim().slice(0, 24) + '|' + (e.getAttribute('href') || ''), ring, visible: r.width > 0 && r.height > 0 }
    })()`)
    if (!f) continue
    if (visited.includes(f.id)) break
    visited.push(f.id)
    if (!f.ring) hidden++
    if (!f.visible) hidden++
  }
  const total = await s.page.evaluate(`[...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((e) => e.getBoundingClientRect().width > 0).length`)
  if (visited.length === 0) add('blocker', 'Tab never reaches anything', 'use real links and buttons, not clickable divs')
  if (hidden > 0) add('major', `${hidden} focused element(s) show no visible focus indicator`, 'add a clear :focus-visible outline (2px, contrasting) to every interactive element')
  if (visited.length < total * 0.7) add('major', `Tab reached ${visited.length} of ${total} interactive elements`, 'remove tabindex traps, make custom controls focusable')
  const skip = await s.page.evaluate(`!!document.querySelector('a[href^="#"][class*="skip"], a[href="#main"], a[href="#content"]')`)
  if (!skip && total > 12) add('minor', 'no skip-to-content link on a page with many links', 'add a "Skip to content" link as the first focusable element')
  await s.context.close()
})

// 6. THE COLOUR-BLIND / LOW-CONTRAST READER.
await tester('contrast-colour', 'Colour-blind visitor and anyone in bright sunlight', 'contrast ratios plus vision-deficiency screenshots', async (add) => {
  const s = await open(browser, { viewport: { width: 1280, height: 800 } })
  const rows = await s.page.evaluate(`(() => {
    const parse = (c) => { const m = c.match(/[\\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 1] }
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    // Composites translucent layers over what is behind them; a semi-transparent fill is not white.
    const bgOf = (e) => { const layers = []; let opaque = false; for (let n = e; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); const a = c[3] === undefined ? 1 : c[3]; if (a > 0) layers.push([c, a]); if (a > 0.95) { opaque = true; break } } let base = opaque ? layers.pop()[0].slice(0, 3) : [255, 255, 255]; while (layers.length) { const [c, a] = layers.pop(); base = base.map((v, k) => v * (1 - a) + c[k] * a) } return base }
    const out = []; const seen = new Set()
    for (const e of document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,span,label,td')) {
      if (!e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e)
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue
      const bg = bgOf(e); if (!bg) continue
      const fg = parse(cs.color); const key = cs.color + '|' + bg.join(',') + '|' + cs.fontSize
      if (seen.has(key)) continue; seen.add(key)
      const l1 = lum(fg), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
      const size = parseFloat(cs.fontSize); const bold = +cs.fontWeight >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      out.push({ ratio: +ratio.toFixed(2), need: large ? 3 : 4.5, size, text: e.textContent.trim().slice(0, 30), fg: cs.color, bg: 'rgb(' + bg.slice(0, 3).join(',') + ')' })
    }
    return out
  })()`)
  const bad = rows.filter((r) => r.ratio < r.need).sort((x, y) => x.ratio - y.ratio)
  if (bad.length) add(bad.some((b) => b.ratio < 3) ? 'major' : 'minor', `${bad.length} text style(s) below WCAG AA contrast; worst: "${bad[0].text}" ${bad[0].ratio}:1 (needs ${bad[0].need}) ${bad[0].fg} on ${bad[0].bg}`, 'darken the text or lighten the surface until each pair reaches 4.5:1 (3:1 for large text)', bad.slice(0, 5))
  for (const kind of ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']) {
    const c = await s.context.newCDPSession(s.page)
    await c.send('Emulation.setEmulatedVisionDeficiency', { type: kind })
    await shot(s.page, 'vision-' + kind)
  }
  add('minor', 'review the four vision-deficiency screenshots: is every state (error, selected, link, price) still distinguishable without colour?', 'pair colour with an icon, underline or text label', ['shots/vision-protanopia.png', 'shots/vision-deficiency-others'])
  await s.context.close()
})

// 7. THE MOTION-SENSITIVE AND NO-GPU VISITOR.
await tester('reduced-motion-no-gpu', 'Motion-sensitive visitor on a machine with no working GPU', 'prefers-reduced-motion: reduce, WebGL disabled', async (add) => {
  const b2 = await launch(['--disable-3d-apis', '--disable-webgl', '--disable-gpu'])
  try {
    const s = await open(b2, { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
    const m = await s.page.evaluate(`(() => {
      const running = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations === Infinity).length
      const canvases = [...document.querySelectorAll('canvas')].filter((c) => c.getBoundingClientRect().width > 100)
      const text = document.body.innerText.trim().length
      const fallback = !!document.querySelector('picture, img, [data-fallback], .poster, noscript')
      const blankCanvas = canvases.length > 0 && !fallback
      return { running, canvases: canvases.length, text, blankCanvas, video: [...document.querySelectorAll('video')].filter((v) => !v.paused && v.autoplay).length }
    })()`)
    if (m.running > 0) add('major', `${m.running} endless animation(s) still run with reduced motion on`, 'wrap looping and parallax motion in @media (prefers-reduced-motion: no-preference)')
    if (m.video > 0) add('major', `${m.video} autoplaying video(s) ignore reduced motion`, 'do not autoplay video when reduced motion is set; show a poster')
    if (m.blankCanvas) add('blocker', 'a canvas is present but there is no fallback image for when WebGL is unavailable', 'detect WebGL and reduced motion before mounting the scene; otherwise show a designed poster')
    if (m.text < 120) add('major', 'almost no readable text without the 3D scene', 'the content must live in real DOM text beside the scene')
    const errs = [...s.consoleErrors, ...(await s.page.evaluate('window.__v.errors'))].filter((e) => !/GPU|GL |WebGL|swiftshader/i.test(e))
    if (errs.length) add('major', 'errors when WebGL is unavailable: ' + errs.slice(0, 2).join(' | '), 'guard scene creation with try/catch and feature detection')
    await shot(s.page, 'no-gpu-reduced-motion')
    await s.context.close()
  } finally { await b2.close() }
})

// 8. THE NO-JS VISITOR AND THE LINK-PREVIEW / SEARCH BOT.
await tester('no-js-bot', 'Search-engine crawler and chat link-preview bot', 'JavaScript disabled', async (add) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'load' })
  const m = await page.evaluate(`(() => {
    const meta = (n) => document.querySelector('meta[name="' + n + '"],meta[property="' + n + '"]')?.content || ''
    return { title: document.title.trim(), desc: meta('description'), ogTitle: meta('og:title'), ogImage: meta('og:image'), robots: meta('robots'), text: document.body.innerText.trim().length, h1: !!document.querySelector('h1'), canonical: !!document.querySelector('link[rel=canonical]') }
  })()`)
  if (m.text < 100) add('major', `only ${m.text} characters of text without JavaScript`, 'render the content in HTML (static or server-rendered) so crawlers and previews can read it')
  if (!m.title) add('major', 'no <title>', 'add a unique title')
  if (!m.desc) add('minor', 'no meta description', 'add a 150-160 character description')
  if (!m.ogTitle || !m.ogImage) add('minor', 'no Open Graph title/image, so shared links look bare', 'add og:title, og:description, og:image')
  if (/noindex/i.test(m.robots)) add('major', 'robots meta says noindex', 'remove it unless the page must stay private')
  await shot(page, 'no-js')
  await context.close()
})

// 9. THE SKEPTICAL FIRST-TIME VISITOR: the five-second test, measured.
await tester('first-five-seconds', 'Skeptical first-time visitor', '1440x900, first screen only', async (add) => {
  const s = await open(browser, { viewport: { width: 1440, height: 900 } })
  const f = await s.page.evaluate(`(() => {
    const h1 = document.querySelector('h1'); const words = h1 ? h1.textContent.trim().split(/\\s+/).length : 0
    const inFold = (e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight && r.width > 0 }
    const visibleText = [...document.querySelectorAll('body *')].filter((e) => inFold(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((e) => e.textContent.trim()).join(' ')
    const ctas = [...document.querySelectorAll('a[href],button')].filter((e) => inFold(e) && e.getBoundingClientRect().width > 80 && e.textContent.trim().length > 2)
    const visual = [...document.querySelectorAll('img,svg,canvas,video,picture')].some((e) => inFold(e) && e.getBoundingClientRect().width > 200)
    const bigOpening = [...document.querySelectorAll('h1,h2')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 12 && r.top >= 0 && r.top < 320 && parseFloat(getComputedStyle(e).fontSize) >= 40 }).map((e) => e.textContent.trim().slice(0, 50))
    const all = document.body.innerText
    return {
      bigOpening,
      h1: h1 ? h1.textContent.trim() : '', words, foldWords: visibleText.split(/\\s+/).length, ctas: ctas.length, visual,
      contact: /(tel:|mailto:|whatsapp|wa\\.me)/i.test(document.body.innerHTML) || /\\+?\\d[\\d\\s-]{8,}/.test(all),
      placeholders: (all.match(/lorem ipsum|your text here|placeholder|coming soon/gi) || []).length,
      todos: (all.match(/TODO\\(user\\)|TODO/g) || []).length,
    }
  })()`)
  if (!f.h1) add('blocker', 'no h1: a visitor cannot tell what this page is', 'state in one line what this is and who it is for')
  else if (f.words > 12) add('major', `the headline is ${f.words} words; five-second visitors will not read it`, 'cut it to a plain sentence under 12 words')
  if (f.bigOpening.length) add('major', `the page opens with a large heading block ("${f.bigOpening[0]}"): the generated-site default`, 'open with the real content, the demo or the product; keep one h1 for screen readers (visually hidden) and let sections earn headings further down')
  if (f.ctas < 1) add('major', 'no clear action in the first screen', 'show the ONE thing you want the visitor to do, as a button')
  else if (f.ctas > 4) add('minor', `${f.ctas} competing actions in the first screen`, 'keep one primary and at most one secondary action')
  if (f.foldWords > 90) add('minor', `${f.foldWords} words in the first screen; it reads as a wall`, 'trim the first screen to a headline, one line of support and an action')
  if (!f.visual) add('minor', 'no image, illustration or scene in the first screen', 'a strong visual anchors the first impression')
  if (!f.contact) add('minor', 'no phone, email or WhatsApp anywhere: a skeptical visitor has no way to check you are real', 'show a real contact route')
  if (f.placeholders) add('major', `${f.placeholders} placeholder phrase(s) such as lorem ipsum or coming soon`, 'replace with real content or an honest TODO(user) note')
  if (f.todos) add('minor', `${f.todos} TODO note(s) still visible: fine for the agent, but the owner must fill them`, 'list them in README under "Needs you"')
  await shot(s.page, 'first-screen-1440')
  await s.context.close()
})

// 10. THE BIG-SCREEN AND SMALL-LAPTOP VISITOR.
await tester('screen-sizes', 'People on a 1366px laptop, a 1080p monitor and a 3440px ultrawide', '1366x768, 1920x1080, 3440x1440', async (add) => {
  for (const [w, h] of [[1366, 768], [1920, 1080], [3440, 1440]]) {
    const s = await open(browser, { viewport: { width: w, height: h } })
    const r = await s.page.evaluate(`(() => {
      const over = document.documentElement.scrollWidth - innerWidth
      const ps = [...document.querySelectorAll('main p, article p, section p')].filter((p) => p.getBoundingClientRect().width > 0)
      const longest = ps.reduce((m, p) => Math.max(m, Math.round(p.getBoundingClientRect().width / (parseFloat(getComputedStyle(p).fontSize) * 0.5))), 0)
      const content = document.querySelector('main') || document.body
      return { over, longest, contentW: Math.round(content.getBoundingClientRect().width) }
    })()`)
    if (r.over > 1) add('blocker', `sideways scroll at ${w}px`, 'constrain the widest element')
    if (r.longest > 100) add('minor', `paragraph lines reach about ${r.longest} characters at ${w}px (read best at 45-90)`, 'cap paragraph width with max-width: 65ch')
    if (w >= 3440 && r.contentW > 2400) add('minor', `content stretches to ${r.contentW}px on an ultrawide`, 'give the page a max-width container and centre it')
    await shot(s.page, 'screen-' + w)
    await s.context.close()
  }
})

// 11. THE SCROLL AUDITOR: length, nested scrollers, sideways scroll.
await tester('scroll-audit', 'Scroll auditor', 'page length in screens, nested scroll areas', async (add) => {
  const s = await open(browser, { viewport: { width: 1440, height: 900 } })
  const r = await s.page.evaluate(`(() => {
    const screens = +(document.documentElement.scrollHeight / innerHeight).toFixed(1)
    const scrollers = [...document.querySelectorAll('body *')].filter((e) => { const c = getComputedStyle(e); return /(auto|scroll)/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 4 && e.clientHeight > 40 }).map((e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : e.className ? '.' + String(e.className).split(' ')[0] : ''))
    const hscrollers = [...document.querySelectorAll('body *')].filter((e) => { const c = getComputedStyle(e); return /(auto|scroll)/.test(c.overflowX) && e.scrollWidth > e.clientWidth + 4 && e.clientWidth > 100 }).length
    const sections = document.querySelectorAll('main > section, body > section, section').length
    const sticky = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height > innerHeight * 0.6).length
    return { screens, scrollers, hscrollers, sections, sticky }
  })()`)
  if (r.screens > BUDGET + 2) add('major', `the page is ${r.screens} screens tall (budget ${BUDGET})`, 'cut sections, tighten spacing, or move detail to its own page')
  else if (r.screens > BUDGET) add('minor', `the page is ${r.screens} screens tall (budget ${BUDGET})`, 'consider trimming')
  if (r.scrollers.length > 0) add('major', `${r.scrollers.length} nested scroll area(s): ${r.scrollers.slice(0, 3).join(', ')}`, 'let the page scroll, not boxes inside it; one scroll region per view')
  if (r.hscrollers > 0) add('minor', `${r.hscrollers} horizontal scroll area(s)`, 'fine for a deliberate carousel; otherwise reflow')
  if (r.sections > 9) add('minor', `${r.sections} sections`, 'a marketing page works best with 7 or fewer')
  await shot(s.page, 'full-page', true)
  await s.context.close()
})

// 12. THE PAGE ITSELF: does scrolling stay smooth? Frames dropped while scrolling on a slowed CPU.
await tester('scroll-smoothness', 'Anyone scrolling on a mid-range laptop', '4x CPU slowdown, scrolling the whole page', async (add) => {
  const s = await open(browser, { viewport: { width: 1440, height: 900 } }, (p) => throttle(p, { cpu: 4 }))
  const r = await s.page.evaluate(`new Promise((resolve) => {
    const times = []; let last = performance.now(); const total = document.documentElement.scrollHeight - innerHeight
    const step = Math.max(8, total / 240); let y = 0
    const tick = (t) => { times.push(t - last); last = t; y += step; scrollTo(0, y); if (y < total) requestAnimationFrame(tick); else resolve(times) }
    requestAnimationFrame(tick)
  })`)
  const slow = r.filter((d) => d > 50).length
  const pct = r.length ? Math.round((slow / r.length) * 100) : 0
  if (pct > 20) add('major', `${pct}% of frames took over 50ms while scrolling (4x slower CPU)`, 'animate only transform and opacity, remove heavy scroll handlers, lower 3D cost')
  else if (pct > 8) add('minor', `${pct}% of frames took over 50ms while scrolling`, 'profile scroll-linked effects')
  await s.context.close()
})

// 13. THE COPY AND CRAFT EDITOR: no emoji, no shouting, no placeholder filler.
await tester('craft-no-emoji', 'Editor of a quality brand', 'reads every visible word, alt text and label', async (add) => {
  const s = await open(browser, { viewport: { width: 1440, height: 900 } })
  const r = await s.page.evaluate(`(() => {
    const emoji = /\\p{Extended_Pictographic}/u
    const hits = []
    const push = (where, text) => { if (emoji.test(text)) hits.push(where + ': ' + text.trim().slice(0, 40)) }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) { const n = walker.currentNode; if (n.parentElement && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)) push(n.parentElement.tagName.toLowerCase(), n.textContent) }
    for (const e of document.querySelectorAll('[alt],[aria-label],[title],[placeholder]')) for (const a of ['alt', 'aria-label', 'title', 'placeholder']) { const v = e.getAttribute(a); if (v) push(a, v) }
    push('document title', document.title)
    const text = document.body.innerText
    return { hits: hits.slice(0, 5), count: hits.length, bang: (text.match(/!/g) || []).length, caps: (text.match(/\\b[A-Z]{5,}\\b/g) || []).length }
  })()`)
  if (r.count > 0) add('major', `${r.count} emoji on the page (${r.hits.join(' | ')})`, 'remove every emoji; use drawn SVG icons or plain words. A quality brand does not use emoji')
  if (r.bang > 2) add('minor', `${r.bang} exclamation marks`, 'a confident brand does not shout; use full stops')
  await s.context.close()
})

// 14. THE SCROLL FILM: does the pinned stage actually change as you scroll, and can you get out of it?
await tester('scroll-film', 'Visitor scrubbing a scroll film or exploded product', 'five scroll positions, viewport compared frame to frame', async (add) => {
  const s = await open(browser, { viewport: { width: 1440, height: 900 } })
  const has = await s.page.evaluate(`(() => {
    const stage = [...document.querySelectorAll('body *')].some((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height >= innerHeight * 0.8)
    const media = [...document.querySelectorAll('canvas,video')].filter((e) => e.getBoundingClientRect().width > 200).length
    const videosNoPoster = [...document.querySelectorAll('video')].filter((v) => !v.getAttribute('poster')).length
    return { stage, media, videosNoPoster, screens: document.documentElement.scrollHeight / innerHeight }
  })()`)
  if (!has.stage && has.media === 0) { await s.context.close(); return }
  const crypto = await import('node:crypto')
  const total = await s.page.evaluate('document.documentElement.scrollHeight - innerHeight')
  const hashes = []
  for (const f of [0.05, 0.25, 0.5, 0.75, 0.95]) {
    await s.page.evaluate(`window.scrollTo(0, ${Math.round(total * f)})`)
    await s.page.waitForTimeout(700)
    const buf = await s.page.screenshot({ type: 'jpeg', quality: 40 })
    hashes.push(crypto.createHash('md5').update(buf).digest('hex'))
  }
  const distinct = new Set(hashes).size
  if (distinct < 3) add('major', `the screen barely changes as you scroll (${distinct} distinct views in 5)`, 'wire the stage to scroll progress so every chapter visibly advances')
  if (has.videosNoPoster > 0) add('major', `${has.videosNoPoster} video(s) with no poster image`, 'add a poster so something shows before the video loads and when it cannot play')
  const skip = await s.page.evaluate(`!!document.querySelector('a[href^="#"][class*="skip"], a[href*="skip"], a[href="#menu"], a[href="#order"], a[href="#contact"], a[href="#visit"]')`)
  if (has.screens > 8 && !skip) add('minor', `a ${has.screens.toFixed(1)}-screen page with no skip link past the film`, 'add a visible link that jumps to the menu, order or contact section')
  const progress = await s.page.evaluate(`!!document.querySelector('[role=progressbar],[class*="progress"],[data-progress]')`)
  if (has.screens > 8 && !progress) add('minor', 'no progress indicator on a long scroll film', 'show a thin progress rail or chapter marker so the visitor knows where they are')
  await s.context.close()
})

// 15. THE DESIGN-SYSTEM AUDITOR: is styling coming from tokens, or from hard-coded values?
await tester('token-discipline', 'Design-system auditor', 'scans the project source for hard-coded colours and arbitrary values', async (add) => {
  const { readFileSync } = await import('node:fs')
  const root = resolve(opt('src', '.'))
  const files = await sourceFiles(root)
  const tokenFile = /(tokens?|theme|variables|globals?|index|main|styles?|base|reset)\.(css|scss)$|tailwind\.config|\.css$/i
  let raw = 0; let arbitrary = 0; let inTokens = 0
  const worst = new Map()
  for (const file of files) {
    let text
    try { text = readFileSync(file, 'utf8') } catch { continue }
    const isCss = /\.(css|scss)$/i.test(file)
    // Inside a CSS custom-property definition (--name: #fff) a raw value is the token itself.
    const stripped = isCss ? text.replace(/--[\w-]+\s*:\s*[^;]+;/g, '') : text
    const hexes = (stripped.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(\s*\d+/g) || []).length
    const arb = (text.match(/\b(?:p|m|px|py|mx|my|w|h|text|bg|border|gap)-\[[^\]]+\]/g) || []).length
    if (isCss && tokenFile.test(file)) inTokens += hexes
    raw += hexes; arbitrary += arb
    if (hexes + arb > 0) worst.set(file.replace(root, '').replace(/\\/g, '/'), hexes + arb)
  }
  const top = [...worst.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, n]) => `${f} (${n})`).join(', ')
  if (files.length === 0) return
  if (arbitrary > 10) add('major', `${arbitrary} arbitrary utility values such as p-[13px] or text-[#hex]`, 'replace with tokens or scale steps; worst files: ' + top)
  if (raw > 60) add('major', `${raw} hard-coded colour values outside token definitions`, 'move every colour into the tokens file and reference it by name; worst files: ' + top)
  else if (raw > 15) add('minor', `${raw} hard-coded colour values outside token definitions`, 'reference tokens instead; worst files: ' + top)
})

// 16. THE ART DIRECTOR: DESIGN.md names a style (glassmorphism, brutalism...); did the build actually use it?
// Operator, 2026-09-23: named styles were ignored. The signals live in scripts/style-signals.mjs, next to this file.
await tester('style-fidelity', 'Art director holding the build to its declared style', 'reads the Style line in docs/design/DESIGN.md, scans the source for that style', async (add) => {
  const { readFileSync } = await import('node:fs')
  const signals = await import(new URL('./style-signals.mjs', import.meta.url).href)
  const designPath = resolve(opt('design', 'docs/design/DESIGN.md'))
  if (!existsSync(designPath)) {
    add('minor', 'no docs/design/DESIGN.md, so there is no declared style to hold the build to', 'write DESIGN.md with a line such as "Style: glassmorphism" (see docs/design/STYLE_RECIPES.md)')
    return
  }
  const declared = signals.declaredStyles(readFileSync(designPath, 'utf8'))
  if (!declared.declared) {
    add('major', 'docs/design/DESIGN.md names no style direction', 'add one line "Style: <name>" chosen from docs/design/STYLE_RECIPES.md and build to that recipe')
    return
  }
  if (declared.unknown.length) add('minor', 'unknown style name(s) on the Style line: ' + declared.unknown.join(', '), 'use a name from docs/design/STYLE_RECIPES.md so the board can check it')
  if (!declared.styles.length) return
  let text = ''
  for (const file of await sourceFiles(resolve(opt('src', '.')))) { try { text += readFileSync(file, 'utf8') + '\n' } catch { /* unreadable file */ } }
  const counts = signals.scanSignals(text)
  for (const id of declared.styles) {
    const verdict = signals.judgeStyle(id, counts)
    const fix = signals.STYLES[id].fix + ' (docs/design/STYLE_RECIPES.md)'
    for (const group of verdict.missing) add('major', `declared ${verdict.label} but the source has no ${signals.describeGroup(group)}`, fix)
    for (const s of verdict.avoided) add('minor', `${verdict.label} leans on ${signals.SIGNALS[s].label} (${counts[s]} found), which the style avoids`, fix)
    for (const group of verdict.caveats) add('minor', `${verdict.label} without ${signals.describeGroup(group)}`, 'add the fallback so the style degrades safely')
  }
})

await browser.close()

// Reports -------------------------------------------------------------------
const open_ = results.flatMap((r) => r.findings.filter((f) => SEV[f.sev] >= 2))
const md = ['# Design board report', '', `URL: ${url}`, `Verdict: ${open_.length === 0 ? 'PASS -- no blocker or major finding open' : open_.length + ' blocker/major finding(s) open'}`, '',
  '| Tester | Condition | Verdict |', '|---|---|---|',
  ...results.map((r) => `| ${r.who} | ${r.condition} | ${r.verdict} |`), '']
for (const r of results) {
  if (!r.findings.length) continue
  md.push(`## ${r.who} -- ${r.verdict}`, '')
  for (const f of r.findings) md.push(`- **${f.sev}**: ${f.msg}`, f.fix ? `  - fix: ${f.fix}` : '')
  md.push('')
}
md.push('## Opinion testers (need a model, not a script)', '',
  '- Design critic: open shots/first-screen-1440.png, shots/mobile-390.png and shots/full-page.png. Judge hierarchy, spacing rhythm, palette, type pairing, distinctiveness. Name what looks generic.',
  '- Skeptical first-time visitor: from shots/first-screen-1440.png alone, say what this is, who it is for, and what you would click. If you cannot, that is a major finding.', '')
writeFileSync(join(outDir, 'report.md'), md.join('\n'))
writeFileSync(join(outDir, 'latest.json'), JSON.stringify({ url, at: new Date().toISOString(), results }, null, 2))
console.log(`\nReport: ${join(outDir, 'report.md')}  (${open_.length} blocker/major open)`)
process.exit(open_.length === 0 ? 0 : 1)
