// scripts/experience-testers.mjs -- the board's testers for how the site FEELS to use, next to design-board.mjs.
//
// Operator, 2026-09-24, on a coffee site the board had passed: "I wanted real scroll animations, not changing slides";
// "the space between the columns makes it look like the website has already ended"; "only three coffees visible while
// the other space is left out"; "there is no back button"; "clicking tabs should scroll to the section, not load it";
// "there should be only one column for the newsletter sign-up, and this looks AI". Each of those is measured here, in
// a real browser, so the web designer's orders are checked by evidence and not by opinion.

const AI_PHRASES = [
  /whatever just (arrived|landed)/i, /one click to (leave|unsubscribe)/i, /\belevate(s|d)? (your|the)\b/i, /\bseamless(ly)?\b/i,
  /\bunlock (your|the)\b/i, /\bcurated\b/i, /\bembark\b/i, /\bdelve\b/i, /\btapestry\b/i, /\bnot just [a-z]+[,.] (it'?s|but)\b/i,
  /\bmeticulous(ly)?\b/i, /\bin a world where\b/i,
]

/** Signature of everything that can move with scroll: transforms, opacity, masks, clips and stroke offsets. */
const MOTION_PROBE = `(() => {
  const out = {}
  let n = 0
  for (const el of document.querySelectorAll('body *')) {
    if (n > 1500) break
    const r = el.getBoundingClientRect()
    if (r.width < 8 || r.height < 8 || r.bottom < 0 || r.top > innerHeight) continue
    const cs = getComputedStyle(el)
    const v = [cs.transform, cs.opacity, cs.clipPath, cs.maskPosition || '', cs.maskImage || cs.webkitMaskImage || '', cs.strokeDashoffset, el.getAttribute('d') || ''].join('|')
    if (v === 'none|1|none|0% 0%|none|0px|' || v === 'none|1|none||none|0px|') continue
    let key = el.tagName
    for (let p = el, i = 0; p && p !== document.body && i < 6; p = p.parentElement, i++) key = p.tagName + ':' + [...(p.parentElement?.children || [])].indexOf(p) + '>' + key
    out[key] = v
    n++
  }
  return out
})()`

async function scrollTo(page, y) {
  await page.evaluate((to) => window.scrollTo(0, to), y)
  await page.mouse.wheel(0, 1) // smooth-scroll libraries listen for wheel
  await page.waitForTimeout(700)
}

/** A cheap image fingerprint of every visible canvas, to see WebGL and canvas scenes move. */
async function canvasPrint(page) {
  const boxes = await page.evaluate(`[...document.querySelectorAll('canvas')].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 100 && r.height > 100 && r.bottom > 0 && r.top < innerHeight).map((r) => ({ x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight - Math.max(0, r.y)) }))`)
  const prints = []
  for (const clip of boxes.slice(0, 2)) {
    if (clip.width < 10 || clip.height < 10) continue
    const buf = await page.screenshot({ clip, type: 'jpeg', quality: 20 })
    let h = 0
    for (let i = 0; i < buf.length; i += 97) h = (h * 31 + buf[i]) >>> 0
    prints.push(h)
  }
  return prints.join(',')
}

export async function experienceTesters({ browser, open, tester, opt }) {
  // 17. SCROLL MOTION: is anything actually animated BY the scroll, continuously, or is it a stack of slides?
  await tester('scroll-motion', 'Visitor who came for the scroll story', '1440x900, ten scroll positions, what changes between them', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    const steps = 10
    const seen = new Map()
    let prevProbe = null; let prevCanvas = null; let canvasMoves = 0
    for (let i = 0; i <= steps; i++) {
      await scrollTo(s.page, Math.round((height - 900) * i / steps))
      const probe = await s.page.evaluate(MOTION_PROBE)
      const canvas = await canvasPrint(s.page)
      if (prevProbe) {
        for (const [k, v] of Object.entries(probe)) if (prevProbe[k] !== undefined && prevProbe[k] !== v) seen.set(k, (seen.get(k) || 0) + 1)
      }
      if (prevCanvas !== null && canvas !== '' && canvas !== prevCanvas) canvasMoves++
      prevProbe = probe; prevCanvas = canvas
    }
    // A mover changes between at least three pairs of positions: something driven by scroll, not a one-off reveal.
    const movers = [...seen.values()].filter((n) => n >= 3).length
    const sticky = await s.page.evaluate(`[...document.querySelectorAll('body *')].some((e) => ['sticky', 'fixed'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().height > innerHeight * 0.5)`)
    if (movers === 0 && canvasMoves < 3) add('major', 'nothing on the page moves continuously with scroll (no transform, mask, clip or stroke that changes across the ten positions, and no canvas scene that changes)', 'build the signature motion from docs/design/SCROLL_CRAFT.md (T2 pinned stage, T3 travelling object, T4 line, T5 mask, T6 3D) driven by one scrubbed timeline')
    else if (!sticky && canvasMoves < 3) add('minor', `${movers} element(s) move with scroll but nothing is pinned or fixed, so the story scrolls past instead of playing`, 'hold the stage with position: sticky (T2) or a fixed layer (T3/T4) while the scroll drives it')
    await s.context.close()
  })

  // 18. DEAD SPACE: a band of bare background tall enough to look like the end of the page.
  await tester('dead-space', 'Visitor who thinks the page has ended', '1440x900, gaps between content down the whole page', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    for (let y = 0; y < height; y += 800) await scrollTo(s.page, y) // let lazy sections mount
    await scrollTo(s.page, 0)
    const gaps = await s.page.evaluate(`(() => {
      const spans = []
      const add = (r) => { if (r.height > 0 && r.width > 40) spans.push([r.top + scrollY, r.bottom + scrollY]) }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (!t.textContent.trim()) continue
        const el = t.parentElement; const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"]')) continue
        const range = document.createRange(); range.selectNodeContents(t); add(range.getBoundingClientRect())
      }
      for (const el of document.querySelectorAll('img, svg, canvas, video, picture, input, button, iframe')) {
        if (getComputedStyle(el).position === 'fixed') continue
        add(el.getBoundingClientRect())
      }
      // A pinned stage holds its content for the whole tall section: that section is not empty.
      // (A sticky HEADER does not count: its parent is the whole page.)
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position !== 'sticky' || !el.parentElement || el.parentElement === document.body) continue
        if (el.getBoundingClientRect().height >= innerHeight * 0.5) add(el.parentElement.getBoundingClientRect())
      }
      // GSAP ScrollTrigger pins through a .pin-spacer, not CSS sticky: the pinned stage fills it.
      for (const el of document.querySelectorAll('.pin-spacer')) add(el.getBoundingClientRect())
      spans.sort((a, b) => a[0] - b[0])
      const out = []
      let end = spans.length ? spans[0][1] : 0
      for (const [a, b] of spans) { if (a - end > 0) out.push({ at: Math.round(end), gap: Math.round(a - end) }); end = Math.max(end, b) }
      return out.sort((x, y) => y.gap - x.gap).slice(0, 3)
    })()`)
    const worst = gaps[0]
    if (worst && worst.gap > 240) add('major', `${worst.gap}px of empty page at y=${worst.at} (looks like the site ended; limit about 160px)`, 'tighten the section padding, or put the next section\'s content, the motif or an image into that band')
    else if (worst && worst.gap > 160) add('minor', `${worst.gap}px of empty page at y=${worst.at}`, 'keep the gap between sections under about 160px at desktop')
    await s.context.close()
  })

  // 19. GRID FILL: three cards and half a screen of nothing beside them.
  await tester('grid-fill', 'Shopper looking at the range', '1440x900, every card grid and row on the home page', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    for (let y = 0; y < height; y += 800) await scrollTo(s.page, y)
    // A CARD grid: at least three in-flow children of similar size, each carrying a picture or a heading.
    const grids = await s.page.evaluate(`[...document.querySelectorAll('body *')].filter((g) => {
      const cs = getComputedStyle(g); if (!(cs.display === 'grid' || (cs.display === 'flex' && cs.flexWrap === 'wrap'))) return false
      const kids = [...g.children].filter((c) => { const r = c.getBoundingClientRect(); const p = getComputedStyle(c).position
        return r.width > 120 && r.height > 120 && p !== 'absolute' && p !== 'fixed' && c.querySelector('img, svg, picture, canvas, h2, h3, h4') })
      return kids.length >= 3 && g.getBoundingClientRect().width > 700
    }).map((g) => {
      const box = g.getBoundingClientRect()
      const tracks = getComputedStyle(g).display === 'grid' ? getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length : 0
      const kids = [...g.children].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 120 && r.height > 120)
      const firstTop = Math.min(...kids.map((r) => r.top))
      const row = kids.filter((r) => Math.abs(r.top - firstTop) < 20)
      const lastTop = Math.max(...kids.map((r) => r.top))
      const last = kids.filter((r) => Math.abs(r.top - lastTop) < 20)
      const similar = Math.max(...kids.map((r) => r.width)) < Math.min(...kids.map((r) => r.width)) * 1.6
      return { cls: String(g.className).slice(0, 40), n: kids.length, cols: row.length, lastRow: last.length, similar, tracks,
        emptyRight: Math.round((box.right - Math.max(...row.map((r) => r.right))) / box.width * 100), top: Math.round(box.top + scrollY) }
    }).filter((g) => g.similar)`)
    for (const g of grids) {
      if (g.tracks > g.n) add('major', `${g.n} cards in a ${g.tracks}-column grid (.${g.cls}) leave ${g.tracks - g.n} empty column(s) at y=${g.top}`, 'show as many items as the grid has columns (or a multiple), or give the grid as many columns as items')
      else if (g.emptyRight > 20) add('major', `a grid of ${g.n} cards (.${g.cls}) leaves ${g.emptyRight}% of its row empty at y=${g.top}`, 'show enough items to fill the row (3 columns: 3, 6 or 9), or make the columns span the width')
      else if (g.cols > 1 && g.lastRow < g.cols && g.n > g.cols) add('minor', `the last row of .${g.cls} has ${g.lastRow} of ${g.cols} cards at y=${g.top}`, 'use a count that fills the rows, or centre or feature the last row deliberately')
    }
    await s.context.close()
  })

  // 20. BACK LINK: every detail page lets the visitor return to the list they came from.
  await tester('back-link', 'Visitor who opened one product and wants the others', 'each detail page reached from the home page, top 700px', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const origin = new URL(s.page.url()).origin
    const details = await s.page.evaluate(`[...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => { try { const u = new URL(h); return u.origin === location.origin && u.pathname.split('/').filter(Boolean).length >= 2 && !u.hash } catch { return false } }))].slice(0, 5)`)
    for (const href of details) {
      await s.page.goto(href, { waitUntil: 'load' }); await s.page.waitForTimeout(800)
      const ok = await s.page.evaluate(`[...document.querySelectorAll('a[href], button')].some((a) => {
        const r = a.getBoundingClientRect(); if (r.top > 700 || r.width === 0) return false
        const t = ((a.textContent || '') + ' ' + (a.getAttribute('aria-label') || '')).toLowerCase()
        return /back|all (coffees|products|items|posts|work)|\\u2190|\\u2039|see all|return/.test(t) || a.getAttribute('rel') === 'prev'
      })`)
      if (!ok) add('major', `no back link near the top of ${href.replace(origin, '')}`, 'put a "Back to <the list>" link above the title that returns to the list (or its section on the home page)')
    }
    await s.context.close()
  })

  // 21. ANCHOR NAVIGATION: nav items that name a home-page section scroll there smoothly instead of loading a page.
  await tester('anchor-nav', 'Visitor using the menu on the home page', '1440x900, each header link clicked on the home page', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const home = s.page.url()
    const links = await s.page.evaluate(`(() => {
      const ids = new Set([...document.querySelectorAll('main [id], section[id]')].map((e) => e.id.toLowerCase()))
      const nav = document.querySelector('header nav, nav, header')
      return [...(nav ? nav.querySelectorAll('a[href]') : [])].slice(0, 8).map((a, i) => {
        const u = new URL(a.href); const slug = (u.hash.slice(1) || u.pathname.split('/').filter(Boolean).pop() || '').toLowerCase()
        return { i, text: a.textContent.trim().slice(0, 30), hash: u.hash, samePage: u.pathname === location.pathname, slug, homeHasSection: ids.has(slug) }
      }).filter((l) => l.slug !== '')
    })()`)
    for (const l of links) {
      if (!l.hash && l.homeHasSection) { add('major', `"${l.text}" loads a new page although the home page has a #${l.slug} section`, 'link it to /#' + l.slug + ' and scroll there smoothly (T1: lenis.scrollTo or scroll-behavior: smooth)'); continue }
      if (!l.hash || !l.samePage) continue
      await s.page.goto(home, { waitUntil: 'load' }); await s.page.waitForTimeout(600)
      const before = await s.page.evaluate('scrollY')
      await s.page.evaluate((i) => { const nav = document.querySelector('header nav, nav, header'); nav.querySelectorAll('a[href]')[i].click() }, l.i)
      await s.page.waitForTimeout(90)
      const mid = await s.page.evaluate('scrollY')
      await s.page.waitForTimeout(1600)
      const after = await s.page.evaluate(`({ y: scrollY, top: document.getElementById(${JSON.stringify(l.hash.slice(1))})?.getBoundingClientRect().top ?? null, path: location.pathname })`)
      if (after.top === null) { add('major', `"${l.text}" points at ${l.hash} but no element has that id`, 'give the section that id'); continue }
      if (Math.abs(after.top) > 160) add('major', `"${l.text}" did not bring ${l.hash} to the top (it is ${Math.round(after.top)}px away)`, 'scroll to the section on click, offset by the header height')
      else if (after.y !== before && mid === after.y) add('minor', `"${l.text}" jumps instantly instead of scrolling`, 'scroll smoothly (T1) unless prefers-reduced-motion is set')
    }
    await s.context.close()
  })

  // 22. SIGN-UP: one line, one column, no essay and no numbered steps around it.
  await tester('signup-form', 'Visitor who just wants the newsletter', '1440x900, every form with an email field', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const forms = await s.page.evaluate(`[...document.querySelectorAll('form')].filter((f) => f.querySelector('input[type=email]')).map((f) => {
      const email = f.querySelector('input[type=email]').getBoundingClientRect()
      const btn = f.querySelector('button, input[type=submit]')?.getBoundingClientRect()
      const block = f.closest('section, aside, footer') || f.parentElement
      const words = (block.innerText || '').split(/\\s+/).filter(Boolean).length
      const numbered = [...block.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^0?[1-9]$/.test(e.textContent.trim())).length
      const cols = getComputedStyle(block).display === 'grid' ? getComputedStyle(block).gridTemplateColumns.split(' ').length : 1
      return { sameRow: btn ? Math.abs(btn.top - email.top) < 12 : false, words, numbered, cols }
    })`)
    for (const f of forms) {
      if (f.numbered >= 2) add('major', `the sign-up block carries ${f.numbered} numbered steps`, 'cut the steps: one sentence, the email field and the button')
      if (f.words > 70) add('major', `the sign-up block carries ${f.words} words`, 'keep it to one short sentence, the field, the button and the consent line')
      if (f.cols > 1 && f.words > 40) add('minor', 'the sign-up sits in a multi-column block', 'one column: sentence, then field + button on one line, then consent')
      if (!f.sameRow) add('minor', 'the email field and the button are not on one line at desktop', 'put the button beside the field')
    }
    await s.context.close()
  })

  // 23. REAL IMAGERY: a brand page shows the real thing, not only flat drawings.
  await tester('real-imagery', 'Visitor deciding whether the product is real', '1440x900, the home page', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    for (let y = 0; y < height; y += 800) await scrollTo(s.page, y)
    const m = await s.page.evaluate(`({
      raster: [...document.images].filter((i) => !/\\.svg(\\?|$)/i.test(i.currentSrc || i.src) && i.naturalWidth >= 300).length,
      video: document.querySelectorAll('video').length,
      webgl: [...document.querySelectorAll('canvas')].filter((c) => c.width >= 300).length,
    })`)
    if (m.raster + m.video + m.webgl === 0) add('major', 'no photograph, video or rendered 3D anywhere on the home page', 'show the real product: CC0 photos (Openverse), a turned 3D object (T6) or a short loop; see docs/design/SCROLL_CRAFT.md "Resources"')
    else if (m.raster + m.video < 3 && m.webgl === 0) add('minor', `only ${m.raster + m.video} photograph(s) or video(s) on the home page`, 'photograph the product where the visitor decides (the range, the place)')
    await s.context.close()
  })

  // 24. AI VOICE: copy that reads as generated.
  await tester('ai-copy', 'Editor who can smell generated copy', 'reads every visible sentence on the home page', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const text = await s.page.evaluate('document.body.innerText')
    const numbered = await s.page.evaluate(`[...document.querySelectorAll('body *')].filter((e) => e.children.length === 0 && /^0[1-9]$/.test(e.textContent.trim())).length`)
    const eyebrows = await s.page.evaluate(`[...document.querySelectorAll('h2')].filter((h) => { const p = h.previousElementSibling; if (!p) return false; const cs = getComputedStyle(p); return cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0.8 && p.textContent.trim().length < 32 }).length`)
    const triads = (text.match(/\bno [a-z]+(?: [a-z]+)?, (?:and )?no [a-z]+/gi) || [])
    const phrases = AI_PHRASES.filter((re) => re.test(text)).map((re) => text.match(re)[0])
    if (numbered >= 3) add('major', `${numbered} "01 / 02 / 03" style step numbers that carry no information`, 'drop the numbers, or show a real sequence the visitor needs')
    if (eyebrows >= 4) add('minor', `${eyebrows} sections open with a tracked uppercase eyebrow over the heading`, 'keep one named kicker at most; let the headings speak')
    if (triads.length) add('minor', `"No X, no Y" copy: ${triads.slice(0, 2).join(' | ')}`, 'say what it IS, concretely')
    if (phrases.length) add('minor', 'generated-sounding phrases: ' + phrases.slice(0, 4).join(', '), 'rewrite in the plain words a real shop would print')
    await s.context.close()
  })

  // 25. LIVING OBJECT (T15): a photographed product that is lit or steaming must not be a dead picture.
  await tester('living-object', 'Visitor who expects the candle to be lit', '1440x900, first screen, running CSS animations and their reaction to scroll', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    await s.page.waitForTimeout(600)
    const at0 = await s.page.evaluate(`(() => {
      const found = []
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect()
        if (cs.animationName !== 'none' && cs.animationIterationCount === 'infinite' && r.bottom > 0 && r.top < innerHeight && r.width > 6 && r.height > 6) found.push(el)
      }
      return { running: found.length, halo: found.some((e) => /screen|plus-lighter|overlay/.test(getComputedStyle(e).mixBlendMode)) }
    })()`)
    const big = await s.page.evaluate(`[...document.images].some((i) => { const r = i.getBoundingClientRect(); return r.width > innerWidth * 0.6 && r.height > innerHeight * 0.6 })`)
    if (big && at0.running === 0) add('major', 'a full-screen photograph fills the first screen and nothing on it is alive (no running CSS animation: flame, steam, glow, shimmer)', 'add the living detail from docs/design/SCROLL_CRAFT.md T15: an SVG or CSS overlay positioned in percent over the lit or steaming spot, infinite keyframes on transform and opacity only, and a halo that brightens with scroll')
    else if (big && !at0.halo) add('minor', 'the first-screen animation has no glow/halo layer that can react to scroll', 'add a screen-blended halo whose opacity is tied to the scroll progress variable (T15)')
    await s.context.close()
  })

  // 26. SCROLL BEATS (T16): the page keeps moving after the opening, in several separate places.
  await tester('scroll-beats', 'Visitor who scrolls past the opening', '1440x900, ten positions, how many separate elements change after the first screen', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    if (height < 1800) { await s.context.close(); return }
    const changed = new Set()
    let prev = null
    for (let i = 0; i <= 10; i++) {
      await scrollTo(s.page, Math.round((height - 900) * i / 10))
      const probe = await s.page.evaluate(MOTION_PROBE)
      if (prev) for (const [k, v] of Object.entries(probe)) if (prev[k] !== undefined && prev[k] !== v) changed.add(k)
      prev = probe
    }
    const pinned = await s.page.evaluate(`[...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height > innerHeight * 0.8).length`)
    if (changed.size < 4) add('minor', `only ${changed.size} element(s) change across the scroll after the first screen; the page goes still once the opening ends`, 'add the quiet beats from docs/design/SCROLL_CRAFT.md T16 (card reveal, photo settle, heading write-on, one parallax image, count-up, light shift) to at least four sections')
    if (pinned > 2) add('minor', `${pinned} full-screen pinned stages: two big scenes compete`, 'keep one main spectacle and turn the others into quiet beats (T16)')
    await s.context.close()
  })

  // 27. HERO LAYERS AND OVERFLOW (T13/T14): layered art must not push the page sideways at phone widths.
  await tester('hero-layers', 'Visitor on a phone and a small laptop', '320, 375 and 768px: sideways overflow and hero image loading', async (add) => {
    for (const width of [320, 375, 768]) {
      const s = await open(browser, { viewport: { width, height: 740 } })
      await s.page.waitForTimeout(500)
      const m = await s.page.evaluate(`({ over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        broken: [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight && i.complete && i.naturalWidth === 0).length })`)
      if (m.over > 1) add('major', `the page scrolls sideways at ${width}px (${m.over}px too wide)`, 'clip the pinned stage with overflow: hidden and reduce the cut-out travel on phones (T14: 22px sideways, 40px down)')
      if (m.broken > 0) add('major', `${m.broken} first-screen image(s) failed to load at ${width}px`, 'fix the asset paths; the opening is the picture')
      await s.context.close()
    }
  })

  // 28. PERFORMANCE BUDGET (T22): the costs that make a scroll story lag, counted in a real browser.
  await tester('perf-budget', 'Visitor on a mid-range laptop or phone', '1440x900, page load then a full scroll: animated properties, glass layers, images, canvases, DOM size', async (add) => {
    const s = await open(browser, { viewport: { width: 1440, height: 900 } })
    const height = await s.page.evaluate('document.documentElement.scrollHeight')
    for (let y = 0; y < height; y += 700) await scrollTo(s.page, y)
    await scrollTo(s.page, 0)
    const m = await s.page.evaluate(`(() => {
      const cheap = new Set(['transform', 'opacity', 'offset', 'easing', 'composite', 'computedOffset', 'translate', 'scale', 'rotate', 'clipPath', 'maskPosition', 'webkitMaskPosition', 'strokeDashoffset', 'visibility'])
      const costly = new Set()
      for (const a of document.getAnimations()) {
        let frames = []
        try { frames = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : [] } catch (e) { frames = [] }
        for (const f of frames) for (const k of Object.keys(f)) if (!cheap.has(k)) costly.add(k)
      }
      const all = [...document.querySelectorAll('body *')]
      const glass = all.filter((e) => { const cs = getComputedStyle(e); const b = cs.backdropFilter || cs.webkitBackdropFilter; return b && b !== 'none' }).length
      const willChange = all.filter((e) => { const w = getComputedStyle(e).willChange; return w && w !== 'auto' }).length
      const oversize = [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return i.naturalWidth > 1 && r.width > 0 && i.naturalWidth > Math.max(2000, r.width * 3) }).length
      const bytes = performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'img' || /\\.(png|jpe?g|webp|avif|gif)(\\?|$)/i.test(r.name)).reduce((n, r) => n + (r.transferSize || r.encodedBodySize || 0), 0)
      return { costly: [...costly].slice(0, 6), glass, willChange, oversize, bytes, canvases: document.querySelectorAll('canvas').length, nodes: all.length }
    })()`)
    if (m.costly.length) add('major', `animations run on properties that repaint or re-layout every frame: ${m.costly.join(', ')}`, 'animate only transform and opacity (T22 rule 1); fake shadows, sizes and blurs with extra layers, scale and opacity')
    if (m.glass > 3) add('minor', `${m.glass} elements use backdrop-filter (each blurs everything behind it every frame)`, 'keep one or two glass panels; use a translucent fill elsewhere (T22 rule 5)')
    if (m.willChange > 12) add('minor', `${m.willChange} elements carry will-change (memory and compositing cost)`, 'set will-change just before an animation and remove it after; keep it under about 12')
    if (m.oversize > 0) add('minor', `${m.oversize} image(s) are far larger than their box`, 'export at the display size (hero 1920 wide, cut-outs 900 wide) as WebP (T22 rule 6)')
    if (m.bytes > 3_500_000) add('major', `${(m.bytes / 1e6).toFixed(1)} MB of images loaded by a full scroll`, 'compress to WebP/AVIF, lazy-load below the fold, and cut image sequences to 60-90 KB frames (T22 rule 6)')
    else if (m.bytes > 2_000_000) add('minor', `${(m.bytes / 1e6).toFixed(1)} MB of images loaded`, 'aim for under 2 MB before the first scroll beat')
    if (m.canvases > 1) add('minor', `${m.canvases} canvases render at once`, 'use one canvas and pause it off screen (T22 rules 4 and 5)')
    if (m.nodes > 2500) add('minor', `${m.nodes} DOM elements`, 'virtualise long lists and drop wrapper elements; aim under about 1500')
    await s.context.close()
  })
}
