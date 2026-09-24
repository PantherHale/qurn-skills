// scripts/style-signals.mjs -- does the built site actually USE the style it declared?
//
// Written into the project by PManager next to design-board.mjs (do not hand-edit).
// The web designer picks a style direction (glassmorphism, brutalism, ...) and the
// design foundation records it as a `Style:` line in docs/design/DESIGN.md. Naming a
// style is not building it (operator, 2026-09-23: "I sent it minimalism, maximalism,
// skeuomorphism, glassmorphism ... it did not implement in any"). So each style here
// is a set of CSS signals that must appear in the source, plus signals it must not
// lean on. Plain regex over CSS and class strings (Tailwind included): no browser,
// so the board's style-fidelity tester and PManager's tests share one definition.
// The human-readable recipes are in docs/design/STYLE_RECIPES.md.

const LEN = String.raw`-?\d+(?:\.\d+)?(?:px|rem|em)?`
const POS = String.raw`\d+(?:\.\d+)?(?:px|rem|em)\s+\d+(?:\.\d+)?(?:px|rem|em)`
const NEG = String.raw`-\d+(?:\.\d+)?(?:px|rem|em)\s+-\d+(?:\.\d+)?(?:px|rem|em)`
// One shadow layer: anything but a separator, or a parenthesised group (rgba(...) carries commas).
const LAYER = String.raw`(?:[^;},(]|\([^)]*\))+`
const WHITE = String.raw`(?:rgba?\(\s*255\s*,\s*255\s*,\s*255|rgb\(\s*255\s+255\s+255|hsla?\([^)]*100%|#fff\b|#ffffff\b|white\b)`

const counter = (source) => {
  const re = new RegExp(source, 'gi')
  return (text) => (text.match(re) || []).length
}

const MANY_COLOURS = 14
const HEX = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi
const FUNCTIONAL = /\b(?:rgba?|hsla?|oklch|oklab|lch|lab)\((?:[^()]|\([^()]*\))*\)/gi
function distinctColours(text) {
  const seen = new Set()
  for (const raw of text.match(HEX) || []) {
    const h = raw.toLowerCase()
    seen.add(h.length === 4 ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h)
  }
  // Functional colours too (research 2026-09-23: HSL and OKLCH token palettes were invisible). Colours with an alpha
  // channel are skipped: they are shadow and overlay tints, not palette entries.
  for (const fn of text.match(FUNCTIONAL) || []) {
    if (fn.includes('/') || (fn.match(/,/g) || []).length >= 3) continue
    seen.add(fn.toLowerCase().replace(/\s+/g, ' '))
  }
  return seen.size
}

/** Each signal counts its matches in the project's source text. */
export const SIGNALS = Object.freeze({
  'backdrop-blur': { label: 'backdrop blur (backdrop-filter: blur())', test: counter(String.raw`backdrop-filter\s*:[^;}]*blur\(|\bbackdrop-blur(?:-[\w\[\]]+)?\b`) },
  'translucent-surface': {
    label: 'translucent background (rgba alpha under 1, bg-white/10)',
    test: counter(String.raw`background(?:-color)?\s*:[^;}]*(?:rgba|hsla)\([^)]*,\s*0?\.\d+\s*\)|background(?:-color)?\s*:[^;}]*\/\s*(?:0?\.\d+|\d{1,2}%)\s*\)|background(?:-color)?\s*:[^;}]*color-mix\([^)]*transparent|\bbg-[a-z]+(?:-\d{2,3})?\/\d{1,2}\b|--[\w-]*(?:glass|surface|panel|bg)[\w-]*\s*:\s*(?:rgba|hsla)\([^)]*,\s*0?\.\d+\s*\)`),
  },
  'hairline-light-border': {
    label: 'light 1px hairline border (1px solid rgba(255,255,255,.2))',
    test: counter(String.raw`border(?:-[a-z]+)?\s*:\s*1px\s+solid\s+(?:${WHITE}|color-mix\([^)]*white|var\(--[\w-]*(?:glass|highlight|edge)[\w-]*\))|\bborder-white\/\d{1,2}\b`),
  },
  'saturate-backdrop': { label: 'saturated backdrop (backdrop-filter: saturate())', test: counter(String.raw`backdrop-filter\s*:[^;}]*saturate\(|\bbackdrop-saturate-`) },
  'specular-highlight': { label: 'specular top highlight (inset 0 1px 0 white)', test: counter(String.raw`inset\s+0(?:px)?\s+1px\s+(?:0(?:px)?\s+|1px\s+)?${WHITE}|inset_0_1px_0`) },
  'displacement-filter': { label: 'SVG displacement or turbulence filter', test: counter(String.raw`feDisplacementMap|feTurbulence`) },
  'dual-shadow': {
    label: 'paired light and dark shadows at opposite offsets',
    test: counter(String.raw`box-shadow\s*:\s*(?:inset\s+)?${NEG}${LAYER}?,\s*(?:inset\s+)?${POS}|box-shadow\s*:\s*(?:inset\s+)?${POS}${LAYER}?,\s*(?:inset\s+)?${NEG}|shadow-\[[^\]]*-\d+px_-\d+px`),
  },
  'inset-shadow': { label: 'inset shadow', test: counter(String.raw`box-shadow\s*:[^;}]*\binset\b|\bshadow-inner\b|\binset-shadow-`) },
  'hard-offset-shadow': {
    label: 'hard offset shadow with no blur (6px 6px 0 #000, any colour)',
    // Any colour once the blur is zero: neo-brutalism's signature shadow is often coloured (research 2026-09-23).
    test: counter(String.raw`box-shadow\s*:\s*-?[1-9]\d*(?:\.\d+)?(?:px|rem|em)?\s+${LEN}\s+0(?:px)?\s+(?:0(?:px)?\s+)?(?:#[0-9a-f]{3,8}\b|[a-z]+\b|(?:rgba?|hsla?|oklch|var)\()|shadow-\[-?\d+px_-?\d+px_0(?:px)?_`),
  },
  'thick-border': { label: 'thick solid border (2px or more)', test: counter(String.raw`border(?:-(?:top|right|bottom|left))?\s*:\s*(?:[2-9]|\d{2})(?:\.\d+)?px\s+solid|\bborder-[248]\b|\bborder-\[\d+px\]`) },
  'zero-radius': { label: 'square corners (border-radius: 0)', test: counter(String.raw`border-radius\s*:\s*0(?:px)?\s*[;}!]|\brounded-none\b`) },
  'large-radius': {
    label: 'large radius (24px or more)',
    test: counter(String.raw`border-radius\s*:\s*(?:(?:2[4-9]|[3-9]\d|\d{3,})px|(?:1\.[5-9]|[2-9](?:\.\d+)?)rem)|\brounded-(?:3xl|\[(?:2[4-9]|[3-9]\d)px\])`),
  },
  rounded: { label: 'rounded corners (8px or more)', test: counter(String.raw`border-radius\s*:\s*(?:(?:[89]|[1-9]\d)px|(?:0?\.[5-9]|[1-9](?:\.\d+)?)rem)|\brounded-(?:lg|xl|2xl|3xl)\b`) },
  'soft-large-shadow': {
    label: 'soft large shadow (10px+ offset, 20px+ blur)',
    test: counter(String.raw`box-shadow\s*:\s*(?:inset\s+)?${LEN}\s+(?:1\d|[2-9]\d)(?:\.\d+)?px\s+(?:[2-9]\d|\d{3})(?:\.\d+)?px|\bshadow-(?:xl|2xl)\b`),
  },
  'multi-shadow': { label: 'three or more stacked shadow layers', test: counter(String.raw`box-shadow\s*:\s*${LAYER},\s*${LAYER},\s*${LAYER}`) },
  gradient: { label: 'gradient', test: counter(String.raw`\b(?:linear|radial|conic)-gradient\(|\bbg-gradient-to-[a-z]+|\bbg-(?:linear|radial|conic)-`) },
  texture: { label: 'texture or image surface (background url, grain, noise)', test: counter(String.raw`background(?:-image)?\s*:[^;}]*url\(|repeating-(?:conic|linear|radial)-gradient\(|feTurbulence|\.(?:grain|noise)\b|url\([^)]*(?:grain|noise|paper|texture)`) },
  'mix-blend': { label: 'blend mode', test: counter(String.raw`mix-blend-mode\s*:|\bmix-blend-[a-z]`) },
  'display-type': {
    label: 'display type (4rem / 40px or larger)',
    test: counter(String.raw`font-size\s*:\s*(?:clamp\([^;}]*?(?:[4-9]|1\d)(?:\.\d+)?(?:rem|vw)\s*\)|(?:[4-9]\d|\d{3})px|(?:[4-9]|1\d)(?:\.\d+)?rem)|\btext-[6-9]xl\b`),
  },
  'generous-spacing': {
    label: 'generous section spacing (6rem / 96px or more)',
    test: counter(String.raw`(?:padding|margin|gap|row-gap)(?:-[a-z]+)?\s*:\s*[^;}]*?(?:\b(?:9[6-9]|[1-9]\d\d)px|\b(?:[6-9]|1\d)(?:\.\d+)?rem)|\b(?:p|py|pt|pb|m|my|mt|mb|gap|space-y)-(?:2[4-9]|[3-6]\d)\b|--[\w-]*(?:space|gap|section)[\w-]*\s*:\s*[^;]*(?:\b(?:9[6-9]|1\d\d)px|\b(?:[6-9]|1\d)(?:\.\d+)?rem)`),
  },
  'grid-layout': { label: 'CSS grid layout', test: counter(String.raw`display\s*:\s*grid|\bgrid-cols-\d+|grid-template-columns\s*:`) },
  'grid-span': { label: 'grid tiles spanning several tracks (span 2, col-span-2, grid-template-areas)', test: counter(String.raw`grid-template-areas\s*:|grid-(?:column|row)(?:-end)?\s*:\s*span\s+[2-9]|\b(?:col|row)-span-[2-9]\b`) },
  '3d-depth': {
    label: '3D depth (perspective, translateZ, preserve-3d, three.js)',
    test: counter(String.raw`perspective\s*:\s*\d|perspective\(\s*\d|translateZ\(\s*-?[1-9]|translate3d\([^)]*,[^)]*,\s*-?[1-9]|transform-style\s*:\s*preserve-3d|\bperspective-\d|\btranslate-z-|from\s+['"](?:three|@react-three/fiber)['"]`),
  },
  'many-colours': { label: 'a wide palette (' + MANY_COLOURS + '+ distinct colours)', test: (text) => { const n = distinctColours(text); return n >= MANY_COLOURS ? n : 0 } },
  'supports-fallback': { label: 'an @supports fallback for backdrop-filter', test: counter(String.raw`@supports\s+(?:not\s*)?\(\s*(?:-webkit-)?backdrop-filter`) },
  'reduced-transparency': { label: 'a prefers-reduced-transparency fallback', test: counter(String.raw`prefers-reduced-transparency`) },
  'reduced-motion': { label: 'a prefers-reduced-motion fallback', test: counter(String.raw`prefers-reduced-motion|\bmotion-(?:reduce|safe):`) },
})

const GLASS_FALLBACK = [['supports-fallback', 'reduced-transparency']]
/** An avoided signal is flagged from this many matches: one stray gradient is not a betrayal of a style. */
const AVOID_AT = 3

/**
 * Each style: `required` is a list of any-of groups (every group needs one of its signals),
 * `avoid` the signals it must not lean on, `caveats` the accessibility fallbacks it owes.
 */
export const STYLES = Object.freeze({
  minimalism: {
    label: 'Minimalism', look: 'few elements, a small palette, lots of space, type doing the work',
    required: [['generous-spacing']], avoid: ['many-colours', 'gradient', 'texture', 'multi-shadow', 'mix-blend'],
    fix: 'give sections 6rem+ of space, cut the palette to a few tokens, drop gradients and stacked shadows',
  },
  maximalism: {
    label: 'Maximalism', look: 'dense, loud, layered: many colours, huge type, pattern and blend',
    required: [['many-colours'], ['display-type'], ['gradient', 'texture', 'mix-blend']], avoid: [],
    fix: 'widen the palette to 14+ tokens, set display type at 4rem+, and layer pattern, gradient or blend modes',
  },
  skeuomorphism: {
    label: 'Skeuomorphism', look: 'real materials: gradients, bevels, inner highlights, texture',
    required: [['gradient'], ['inset-shadow', 'specular-highlight'], ['texture', 'multi-shadow']], avoid: [],
    fix: 'build surfaces from gradients, an inset top highlight and stacked shadows, with a real texture image',
  },
  neumorphism: {
    label: 'Neumorphism', look: 'soft extruded shapes: paired light and dark shadows on one base colour',
    required: [['dual-shadow'], ['inset-shadow']], avoid: ['thick-border', 'many-colours'],
    caveats: [],
    fix: 'use paired shadows (9px 9px 16px dark, -9px -9px 16px light) on the base colour, inset for pressed states, and keep text contrast at 4.5:1',
  },
  glassmorphism: {
    label: 'Glassmorphism', look: 'frosted translucent panels floating over colour',
    required: [['backdrop-blur'], ['translucent-surface'], ['hairline-light-border', 'specular-highlight']], avoid: ['hard-offset-shadow'],
    caveats: GLASS_FALLBACK,
    fix: 'panels need background rgba(255,255,255,.08-.2), backdrop-filter: blur(12-24px) and a 1px rgba(255,255,255,.2) border, over a colourful backdrop',
  },
  'liquid-glass': {
    label: 'Liquid glass', look: 'Apple-style refractive glass: blur plus saturation, a specular edge, depth',
    required: [['backdrop-blur'], ['saturate-backdrop', 'displacement-filter'], ['specular-highlight'], ['translucent-surface']], avoid: ['hard-offset-shadow'],
    caveats: GLASS_FALLBACK,
    fix: 'combine backdrop-filter: blur(20px) saturate(180%), a translucent fill, an inset 0 1px 0 white highlight, and optionally an SVG displacement filter',
  },
  claymorphism: {
    label: 'Claymorphism', look: 'puffy clay shapes: big radius, soft outer shadow, inner light and shade',
    required: [['large-radius'], ['inset-shadow'], ['soft-large-shadow', 'dual-shadow']], avoid: ['hard-offset-shadow', 'zero-radius'],
    fix: 'use 32px+ radius, an outer shadow (8px 8px 16px) and two inset shadows at opposite offsets for inner light and shade',
  },
  brutalism: {
    label: 'Brutalism', look: 'raw and loud: thick black borders, hard offset shadows, square corners',
    required: [['thick-border'], ['hard-offset-shadow', 'zero-radius']], avoid: ['soft-large-shadow', 'backdrop-blur'],
    fix: 'use 2-4px solid black borders, hard shadows with zero blur (6px 6px 0 #000) and square corners',
  },
  flat: {
    label: 'Flat', look: 'solid colour fills, no depth effects',
    required: [], avoid: ['gradient', 'soft-large-shadow', 'dual-shadow', 'texture', 'backdrop-blur', 'multi-shadow'], avoidAt: 2,
    fix: 'remove gradients, blurs and shadows; separate surfaces with solid fills and spacing',
  },
  bento: {
    label: 'Bento grid', look: 'a grid of rounded tiles of mixed sizes, each one idea',
    required: [['grid-span'], ['rounded', 'large-radius']], avoid: [],
    fix: 'lay tiles on a CSS grid where feature tiles span 2 columns or rows, with rounded corners and one idea per tile',
  },
  spatial: {
    label: 'Spatial UI', look: 'layers in depth: perspective, z-translation, blur and deep shadows',
    required: [['3d-depth'], ['backdrop-blur', 'soft-large-shadow']], avoid: [],
    caveats: [['reduced-motion']],
    fix: 'give the scene perspective and translateZ layers, separate planes with blur or deep shadows, and flatten under reduced motion',
  },
  swiss: {
    label: 'Swiss / international typographic', look: 'a strict grid, big sans type, asymmetry, no ornament',
    required: [['grid-layout'], ['display-type']], avoid: ['gradient', 'texture', 'soft-large-shadow', 'large-radius'],
    fix: 'set a 12-column grid, large tight sans display type, flush-left text and no decorative effects',
  },
})

// Loose names accepted on a Style: line, where any mention is meant as a style.
const LINE_ALIASES = Object.freeze({
  minimal: 'minimalism', minimalist: 'minimalism', maximal: 'maximalism', maximalist: 'maximalism',
  skeuomorphic: 'skeuomorphism', skeuo: 'skeuomorphism', neumorphic: 'neumorphism', 'soft ui': 'neumorphism', neomorphism: 'neumorphism',
  glass: 'glassmorphism', glassmorphic: 'glassmorphism', 'glass morphism': 'glassmorphism', 'frosted glass': 'glassmorphism',
  'liquid glass': 'liquid-glass', clay: 'claymorphism', claymorphic: 'claymorphism',
  brutalist: 'brutalism', 'neo-brutalism': 'brutalism', neobrutalism: 'brutalism', 'neo brutalism': 'brutalism', 'neo-brutalist': 'brutalism',
  'flat design': 'flat', 'bento grid': 'bento', 'spatial ui': 'spatial', 'spatial design': 'spatial',
  'swiss style': 'swiss', 'international typographic': 'swiss', 'international typographic style': 'swiss',
})

// Strict names found in free text (a goal): only words that can mean nothing but a style.
const GOAL_NAMES = Object.freeze([
  ['minimalism', /\bminimalis[mt]\b/i],
  ['maximalism', /\bmaximalis[mt]\b/i],
  ['skeuomorphism', /\bskeuomorph(?:ism|ic)\b/i],
  ['neumorphism', /\bneu?morph(?:ism|ic)\b|\bsoft ui\b/i],
  ['glassmorphism', /\bglass\s?morph(?:ism|ic)\b|\bfrosted glass\b/i],
  ['liquid-glass', /\bliquid glass\b/i],
  ['claymorphism', /\bclaymorph(?:ism|ic)\b/i],
  ['brutalism', /\b(?:neo[- ]?)?brutalis[mt]\b/i],
  ['flat', /\bflat design\b/i],
  ['bento', /\bbento\b/i],
  ['spatial', /\bspatial (?:ui|design|interface)\b/i],
  ['swiss', /\bswiss style\b|\binternational typographic\b/i],
])

export function scanSignals(text) {
  const counts = {}
  for (const [id, signal] of Object.entries(SIGNALS)) counts[id] = signal.test(text)
  return counts
}

export function judgeStyle(id, counts) {
  const style = STYLES[id]
  if (style === undefined) throw new Error('unknown style: ' + id)
  const has = (s) => (counts[s] || 0) > 0
  const missing = style.required.filter((group) => !group.some(has))
  const avoided = style.avoid.filter((s) => (counts[s] || 0) >= (style.avoidAt ?? AVOID_AT))
  const caveats = (style.caveats || []).filter((group) => !group.some(has))
  return { id, label: style.label, missing, avoided, caveats, ok: missing.length === 0 }
}

export const describeGroup = (group) => group.map((s) => SIGNALS[s].label).join(' or ')

const normalise = (name) => name.toLowerCase().replace(/[*_`"']/g, ' ').replace(/\s+/g, ' ').trim()
const idFor = (name) => LINE_ALIASES[name] ?? (STYLES[name.replace(/ /g, '-')] !== undefined ? name.replace(/ /g, '-') : undefined)

/** The style line in DESIGN.md: `Style: glassmorphism`, `**Style:** glass + bento`. At most two styles count. */
export function declaredStyles(designMd) {
  const line = /^[\s>*#-]*\**\s*styles?(?:\s+direction)?\s*\**\s*[:=]\s*\**\s*(.+)$/im.exec(designMd)
  if (line === null) return { declared: false, styles: [], unknown: [] }
  const head = line[1].split(/\s(?:--|—|–|-)\s|[;(.]/)[0]
  const styles = []
  const unknown = []
  for (const part of head.split(/,|\+|\/|&|\band\b|\bwith\b/i)) {
    const name = normalise(part)
    if (name === '') continue
    const id = idFor(name)
    if (id === undefined) unknown.push(name)
    else if (!styles.includes(id)) styles.push(id)
  }
  return { declared: true, styles: styles.slice(0, 2), unknown }
}

/** Styles an operator named in a goal, in catalogue order. */
export function stylesNamedIn(text) {
  return GOAL_NAMES.filter(([, re]) => re.test(text)).map(([id]) => id)
}

/** A compact catalogue for a specialist's brief: each style, its look and what the board will look for. */
export function styleIndex() {
  return Object.entries(STYLES).map(([id, s]) => {
    const needs = s.required.length === 0 ? 'none of the avoided effects' : s.required.map(describeGroup).join('; ')
    return '- ' + id + ': ' + s.look + '. Needs: ' + needs + '.'
  }).join('\n')
}
