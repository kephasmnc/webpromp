import type {
  AppState, Block, BlockType,
  NavbarData, HeroData, MarqueeData, FeaturesData, ChessData, StatsData,
  TestimonialsData, PricingData, FAQData, CTAData, FooterData,
} from '../types'

// ─── Helpers ───────────────────────────────────────────────────────────────────
function hasVideoBlock(blocks: Block[]): boolean {
  return blocks.some(b => {
    const d = b.data as unknown as Record<string, unknown>
    return (d.bgType === 'video' && d.bgUrl) || (d.bgVideo && (d.bgVideo as string).length > 0) || (d.mediaType === 'video' && d.mediaUrl)
  })
}

function hasGlassmorphism(_blocks: Block[], preset: string): boolean {
  return preset === 'liquid-glass'
}

function hasPricing(blocks: Block[]): boolean {
  return blocks.some(b => b.type === 'pricing')
}

function getBorderRadius(style: string): string {
  if (style === 'sharp') return '0'
  if (style === 'rounded') return '0.5rem'
  return '9999px'
}

function getAnimConfig(intensity: string): string {
  if (intensity === 'none') return 'No animations — static layout only'
  if (intensity === 'dramatic') return 'Framer Motion whileInView with viewport={{ once: true }}, ease [0.76, 0, 0.24, 1], staggered delays i * 0.15, scale from 0.92→1 + fade, slide from y:40'
  return 'Framer Motion whileInView with viewport={{ once: true }}, ease [0.25, 1, 0.5, 1], staggered delays i * 0.12, fade up from y:20'
}

function getCardStyle(preset: string): string {
  if (preset === 'liquid-glass') return '.liquid-glass — backdrop-filter: blur(4px), rgba(255,255,255,0.01) bg, gradient border mask via ::before pseudo'
  if (preset === 'light-corporate') return 'rounded-2xl border border-foreground/10 bg-foreground/[0.02] shadow-sm'
  return 'rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03]'
}

function getHeadingStyle(preset: string, displayFont: string, bodyFont: string): string {
  if (preset === 'light-corporate') {
    return `font-display (${displayFont}) italic for accent lines, font-body (${bodyFont}) font-light for main text. Size: clamp(2rem,4vw,3.5rem). Leading: 0.95. Tracking: -0.04em`
  }
  if (preset === 'liquid-glass') {
    return `font-body (${bodyFont}) font-semibold for main headings. Size: text-4xl md:text-5xl lg:text-6xl. Tracking: tight. Leading: 1.05`
  }
  return `font-light for main lines, font-display (${displayFont}) italic for the accent/third line. Size: clamp(2rem,4vw,3.5rem). Leading: 0.9. Tracking: -tracking-[0.04em]`
}

function getSectionTagStyle(preset: string): string {
  if (preset === 'liquid-glass') {
    return 'liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-foreground inline-flex items-center gap-1.5 mb-4'
  }
  return 'Arrow icon + uppercase text, tracking-[0.25em], text-xs font-medium text-foreground/60'
}

function getPillBadgeStyle(preset: string): string {
  if (preset === 'liquid-glass') return 'liquid-glass rounded-full px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-foreground/70'
  return 'border border-foreground/20 rounded-full px-5 py-1.5 text-[10px] tracking-[0.25em] uppercase text-foreground/60'
}

function getSignatureGradient(primary: string): string {
  return `bg-gradient-to-r from-[hsl(${primary})] to-[hsl(40,80%,82%)]`
}

// ─── Stack Builder ─────────────────────────────────────────────────────────────
function buildStack(blocks: Block[], preset: string): string {
  const libs = ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'lucide-react']
  if (hasVideoBlock(blocks)) libs.push('hls.js (for HLS video streams, with <video> mp4 fallback)')
  if (hasGlassmorphism(blocks, preset)) libs.push('shadcn/ui')
  if (hasPricing(blocks)) libs.push('tailwindcss-animate')
  const hasMarquee = blocks.some(b => {
    if (b.type === 'marquee') return true
    if (b.type === 'hero') return (b.data as HeroData).showMarquee
    return false
  })
  if (hasMarquee) libs.push('CSS keyframe marquee animation (custom)')
  return `Stack: ${libs.join(' + ')}`
}

// ─── Font Section ──────────────────────────────────────────────────────────────
function buildFonts(g: AppState['global']): string {
  const lines: string[] = ['Fonts (Google Fonts):']
  if (g.displayFont !== g.bodyFont) {
    lines.push(`${g.displayFont} — display/serif font-display (used for italic accent headings)`)
    lines.push(`${g.bodyFont} (weights 300–700) — body/sans font-sans`)
  } else {
    lines.push(`${g.bodyFont} (weights 300–700) — primary font`)
  }
  return lines.join('\n')
}

// ─── Design System ─────────────────────────────────────────────────────────────
function buildDesignSystem(g: AppState['global']): string {
  const r = getBorderRadius(g.buttonStyle)
  const gradient = getSignatureGradient(g.colors.primary)
  const lines = [
    `Design System (CSS variables in :root, all HSL):`,
    `--background: ${g.colors.background}`,
    `--foreground: ${g.colors.foreground}`,
    `--card: ${g.colors.card}`,
    `--muted: ${g.colors.muted}`,
    `--muted-foreground: (auto-derived ~60% opacity of foreground)`,
    `--border: (auto-derived ~20% opacity of foreground)`,
    `--radius: ${r}`,
    ``,
    `Signature gradient accent: ${gradient}`,
    `Used on all CTA buttons and highlighted elements.`,
  ]
  if (g.preset === 'liquid-glass') {
    lines.push(``, `Liquid Glass utility class (.liquid-glass):`)
    lines.push(`background: rgba(255,255,255,0.01); backdrop-filter: blur(4px); border: none;`)
    lines.push(`box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden;`)
    lines.push(`::before pseudo: gradient border mask — linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.45) 100%)`)
    lines.push(`-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;`)
  }
  return lines.join('\n')
}

// ─── Global Patterns ──────────────────────────────────────────────────────────
function buildGlobalPatterns(g: AppState['global']): string {
  const animConfig = getAnimConfig(g.animationIntensity)
  const cardStyle = getCardStyle(g.preset)
  const headingStyle = getHeadingStyle(g.preset, g.displayFont, g.bodyFont)
  const sectionTagStyle = getSectionTagStyle(g.preset)
  const pillBadge = getPillBadgeStyle(g.preset)

  const vibeStr = g.vibes.length > 0 ? g.vibes.join(', ') : 'dark, premium'

  return `Global patterns (vibe: ${vibeStr}):
Section tags: ${sectionTagStyle}
Pill badges: ${pillBadge}
Headings: ${headingStyle}
Cards: ${cardStyle}
Animations: ${animConfig}`
}

// ─── Section Generators ────────────────────────────────────────────────────────

function buildNavbar(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as NavbarData
  const brand = g.brandName || 'BRAND'
  const linksStr = d.links.map(l => `"${l.label}"`).join(', ')

  let ctaStyle = ''
  if (d.ctaStyle === 'gradient') ctaStyle = `bg-gradient-to-r from-[hsl(${g.colors.primary})] to-[hsl(40,80%,82%)] text-background rounded-${g.buttonStyle === 'pill' ? 'full' : g.buttonStyle === 'rounded' ? 'lg' : 'none'} px-5 py-2 text-sm font-medium`
  else if (d.ctaStyle === 'solid') ctaStyle = `bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium`
  else ctaStyle = `border border-foreground/30 rounded-full px-5 py-2 text-sm font-medium text-foreground`

  return `SECTION ${idx} — Navbar${d.sticky ? ' (sticky, z-50)' : ''}
Component: Navbar.tsx
Layout: flex justify-between items-center px-6 md:px-10 py-4 ${d.sticky ? 'fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/[0.08]' : 'relative'}
${d.logoPosition === 'center' ? `Center: "${brand}" logo — absolute left-1/2 -translate-x-1/2, text-2xl font-bold tracking-wider
Left: Hamburger "Menu" button — pill-shaped with border-foreground/30 rounded-full, two horizontal bars + "MENU" text
Right (desktop only): ${linksStr} pill buttons + "${d.ctaLabel}" CTA button` : `Left: "${brand}" logo — text-2xl font-bold tracking-wider
Center/Right (desktop): ${linksStr} links — text-sm text-foreground/60 hover:text-foreground
Right: "${d.ctaLabel}" CTA button — ${ctaStyle}`}`
}

function buildHero(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as HeroData
  const brand = g.brandName || 'Your Brand'
  const tag = d.sectionTag || brand

  let bgSpec = 'Background: solid bg-background (no media)'
  if (d.bgType === 'video' && d.bgUrl) {
    bgSpec = `Background video:
<video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 object-[37%_center]" src="${d.bgUrl}" />
Top gradient overlay: absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-background to-transparent z-[1]
Bottom gradient: absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-[1]`
  } else if (d.bgType === 'image' && d.bgUrl) {
    bgSpec = `Background image: absolute inset-0 w-full h-full object-cover z-0 opacity-60 src="${d.bgUrl}"
Gradient overlay: absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-background to-transparent z-[1]`
  }

  let layoutSpec = ''
  if (d.layout === 'centered') {
    layoutSpec = 'Layout: min-h-screen flex flex-col items-center justify-center text-center px-6'
  } else if (d.layout === 'bottom-left') {
    layoutSpec = 'Layout: min-h-screen flex flex-col justify-between. Content pushed to bottom-left. px-6 md:px-10 pb-16'
  } else {
    layoutSpec = 'Layout: min-h-screen flex flex-col justify-between. Content pushed to bottom-right. px-6 md:px-10 pb-16'
  }

  const h1 = `${d.headline1 || 'Your Headline'}\n${d.headline2 || 'Goes Here'}\n${d.headline3 || 'In Italic Serif'}`

  let marqueeSection = ''
  if (d.showMarquee && d.marqueeItems) {
    const items = d.marqueeItems.split(',').map(s => s.trim())
    marqueeSection = `
Client/Partners Marquee bar (bottom, z-10):
Top row: "Our Partners" left, "Backed by leading brands" right
border-t border-foreground/10 py-5, CSS keyframe marquee: translateX(0) → translateX(-50%) at 20s linear infinite
Brand names (duplicated for seamless loop): ${items.join(', ')}
Each name: text-foreground/50 text-lg font-medium tracking-wide, gap-16`
  }

  return `SECTION ${idx} — Hero (full viewport height)
Component: HeroSection.tsx
${layoutSpec}
${bgSpec}

Hero content (${d.layout === 'centered' ? 'centered' : d.layout === 'bottom-left' ? 'bottom-left' : 'bottom-right'}):
Tag line: Arrow icon + "${tag}"

H1 headline (3 lines):
${h1}
First two lines: font-light. Third line: font-display (${g.displayFont} italic serif).
Size: clamp(2rem,6vw,5rem). Leading: 0.9. Tracking: -0.2em.

Description: "${d.subtitle}"
text-foreground/70 text-sm md:text-base leading-relaxed max-w-md

CTA buttons:
Primary: "${d.ctaPrimary}" — gradient pill bg-gradient-to-r from-[hsl(${g.colors.primary})] to-[hsl(40,80%,82%)] text-background rounded-full px-6 py-3 font-medium
${d.ctaSecondary ? `Secondary: "${d.ctaSecondary}" — border border-foreground/20 rounded-full px-6 py-3 text-foreground/70` : ''}
${marqueeSection}`
}

function buildMarquee(b: Block, _g: AppState['global'], idx: number): string {
  const d = b.data as MarqueeData
  const speedMs = d.speed === 'slow' ? '40s' : d.speed === 'fast' ? '15s' : '25s'
  const items = d.brands.length > 0 ? d.brands : ['Brand One', 'Brand Two', 'Brand Three', 'Brand Four', 'Brand Five']

  return `SECTION ${idx} — Partners Marquee
Component: MarqueeSection.tsx
Layout: py-8 border-y border-foreground/[0.08] overflow-hidden
${d.label ? `Label: "${d.label}" — text-xs text-foreground/30 uppercase tracking-[0.25em] text-center mb-4` : ''}

CSS keyframe marquee animation: translateX(0) → translateX(-50%) at ${speedMs} linear infinite
Items duplicated × 2 for seamless loop
Brand names: ${items.join(', ')}
Each name: text-foreground/40 text-sm font-medium tracking-[0.15em] uppercase, gap-12
Hover: animation pauses (animation-play-state: paused)`
}

function buildFeatures(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as FeaturesData
  const cardStyle = getCardStyle(g.preset)

  let bgSpec = 'Background: inherits bg-background'
  if (d.bgType === 'video' && d.bgUrl) {
    bgSpec = `Background HLS video: ${d.bgUrl}
Gradient overlays: bg-gradient-to-b from-background via-background/80 to-transparent (top 40%) + bg-gradient-to-t from-background (bottom 40%) + bg-background/40 overall darkening`
  }

  const cardsStr = d.cards.slice(0, d.cardCount).map((c, i) => {
    const stat = c.statValue ? `\n  Stat: "${c.statValue}" / "${c.statLabel}" — border-t border-border/50 mt-auto pt-4` : ''
    return `Card ${i + 1} — "${c.title}" / badge "${c.tag || c.icon}"
  Icon: ${c.icon} (lucide-react, w-8 h-8)
  Description: "${c.description}"${stat}`
  }).join('\n')

  return `SECTION ${idx} — Features (${d.cardCount}-card grid)
Component: FeaturesSection.tsx
Layout: py-24 md:py-36 px-6 md:px-10, max-w-7xl mx-auto
${bgSpec}

Header row (flex, items-end, justify-between):
Left: Section tag "${d.sectionTag}" + H2: "${d.heading}"
Right: subtitle "${d.subtitle}" — text-foreground/50 text-sm max-w-sm

${d.cardCount} cards (grid grid-cols-1 md:grid-cols-${d.cardCount} gap-6):
Each card: ${cardStyle} backdrop-blur-sm p-8 md:p-10
Hover: border-foreground/[0.15] bg-foreground/[0.05]. Transition: duration-500.

${cardsStr}

"Learn more →" link per card: text-foreground/40, hover brightens + arrow translates right
Framer Motion: staggered fade-up, delays i * 0.12`
}

function buildChess(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as ChessData
  const cardStyle = getCardStyle(g.preset)

  const mediaSpec = d.mediaUrl
    ? (d.mediaType === 'video'
        ? `HLS video via hls.js: ${d.mediaUrl}\nContainer: ${cardStyle} overflow-hidden, aspect-[4/3] on mobile, min-h-[500px] on desktop`
        : `Image: ${d.mediaUrl}\nContainer: ${cardStyle} overflow-hidden, aspect-[4/3]`)
    : `Media placeholder: ${cardStyle} overflow-hidden, aspect-[4/3] bg-card flex items-center justify-center`

  const statsStr = d.stats.filter(s => s.value).map(s =>
    `{ "${s.value}": "${s.label}" }`
  ).join(', ')

  const direction = d.direction === 'image-left' ? 'image-left, text-right' : 'text-left, image-right'

  return `SECTION ${idx} — Chess Layout (${direction})
Component: ChessSection.tsx direction="${d.direction}"
Layout: max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch
Padding: py-16 md:py-28 px-6 md:px-10

${d.direction === 'image-left' ? `Left — Media block:\n${mediaSpec}\n\nRight — Text block:` : `Left — Text block:`}
Tag: Arrow icon + "${d.sectionTag}"
H2: "${d.heading1} / ${d.heading2}" — italic serif accent on second line
Size: clamp(1.8rem,3.5vw,3rem)
Description: "${d.description}"
${statsStr ? `Stats row: ${statsStr} — value is text-3xl font-light, label is text-xs tracking-[0.15em] uppercase text-foreground/40` : ''}
${d.ctaLabel ? `CTA button: "${d.ctaLabel}" — gradient pill button` : ''}

${d.direction === 'image-right' ? `Right — Media block:\n${mediaSpec}` : ''}

Framer Motion: scale 0.96→1 + fade in on both columns, duration: 0.8`
}

function buildStats(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as StatsData
  const cardStyle = getCardStyle(g.preset)

  let bgSpec = 'Background: inherits bg-background'
  if (d.bgVideo) {
    bgSpec = `Full-width video background (HLS): ${d.bgVideo}
Overlay: bg-background/0 (fully transparent — video shows at 100% opacity)
Background watermark text in font-display, size clamp(8rem,25vw,20rem), opacity foreground/[0.02]`
  }

  const metricsStr = d.metrics.filter(m => m.value).map(m =>
    `${m.value} — "${m.label}"${m.sublabel ? ` / "${m.sublabel}"` : ''}`
  ).join('\n')

  const colCount = Math.min(d.metrics.filter(m => m.value).length, 4)

  return `SECTION ${idx} — Numbers / Metrics${d.bgVideo ? ' (video background)' : ''}
Component: NumbersSection.tsx
${bgSpec}

Header (centered):
Pill badge: "${d.sectionTag}"
H2: "${d.heading1} / ${d.heading2}"
Size: clamp(2rem,4.5vw,3.8rem)

Metrics grid: grid grid-cols-2 md:grid-cols-${colCount} gap-px with bg-foreground/[0.06] rounded-2xl overflow-hidden border border-foreground/[0.08]
Each cell: ${cardStyle} p-8 md:p-12 text-center

${d.animated ? 'Animated counting numbers (on scroll into view, 1600ms duration, 40 steps):' : 'Static numbers:'}
${metricsStr}

Value: clamp(2.5rem,5vw,4.5rem) font-light. Label: text-sm font-medium text-foreground/70. Sublabel: text-xs text-foreground/30.`
}

function buildTestimonials(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as TestimonialsData
  const cardStyle = getCardStyle(g.preset)

  const testimonials = d.testimonials ?? []
  const count = d.count ?? testimonials.length
  const visible = testimonials.slice(0, count)

  const testimonialsStr = visible.map((t, i) =>
    `Testimonial ${i + 1}: ${t.name}, ${t.role} — "${t.quote}"`
  ).join('\n')

  const colCount = Math.min(visible.length, 3)

  return `SECTION ${idx} — Testimonials (${colCount}-card grid)
Component: TestimonialsSection.tsx
Layout: py-24 md:py-36 px-6 md:px-10, max-w-7xl mx-auto

Header:
Section tag: Arrow + "${d.sectionTag}"
H2: "${d.heading}"

${colCount} testimonial cards (grid grid-cols-1 md:grid-cols-${colCount} gap-6):
Each card: ${cardStyle} p-8 md:p-10 flex flex-col justify-between
Decorative " mark: absolute top-6 right-8 text-foreground/[0.06] text-7xl font-display
Quote text: text-foreground/70 text-[15px] leading-relaxed
Avatar circle: w-10 h-10 rounded-full with signature gradient bg-gradient-to-r from-[hsl(${g.colors.primary})] to-[hsl(40,80%,82%)], showing first initial letter
Name: text-sm font-medium, title/company: text-xs text-foreground/40

${testimonialsStr}

Framer Motion: staggered fade-up, delays i * 0.12`
}

function buildPricing(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as PricingData
  const cardStyle = getCardStyle(g.preset)
  const planCount = d.planCount ?? d.plans.length

  const plansStr = d.plans.slice(0, planCount).map((p, i) => {
    const featuresStr = p.features.map(f => `• ${f}`).join('\n    ')
    return `Plan ${i + 1} — "${p.name}"${p.highlighted ? ' (HIGHLIGHTED — use signature gradient border or accent bg)' : ''}
  Price: ${p.price}${p.period}
  Features:
    ${featuresStr}
  CTA: "${p.ctaLabel}"`
  }).join('\n\n')

  return `SECTION ${idx} — Pricing (${planCount} plans)
Component: PricingSection.tsx
Layout: py-24 md:py-36 px-6 md:px-10, max-w-7xl mx-auto

Header (centered):
Section tag: "${d.sectionTag}"
H2: "${d.heading}"

${planCount} pricing cards (grid grid-cols-1 md:grid-cols-${planCount} gap-6 items-start):
Each card: ${cardStyle} p-8. Highlighted card gets: border-foreground/[0.15] bg-foreground/[0.05] ring-1 ring-[hsl(${g.colors.primary})] relative.

${plansStr}

Framer Motion: staggered fade-up, delays i * 0.1`
}

function buildFAQ(b: Block, _g: AppState['global'], idx: number): string {
  const d = b.data as FAQData

  const itemsStr = d.items.map((item, i) =>
    `${i + 1}. Q: "${item.question}"\n   A: "${item.answer}"`
  ).join('\n')

  return `SECTION ${idx} — FAQ (accordion)
Component: FAQSection.tsx
Layout: py-24 md:py-36 px-6 md:px-10, max-w-3xl mx-auto

Header (centered):
Section tag: "${d.sectionTag}"
H2: "${d.heading}"

Accordion items — each item: border-b border-foreground/[0.08] py-6
Question: text-base font-medium text-foreground flex justify-between items-center cursor-pointer
ChevronDown icon — rotates 180deg on open (transition-transform duration-300)
Answer: text-foreground/60 text-sm leading-relaxed overflow-hidden max-h-0 → max-h-96 on open (transition-all duration-300)

${itemsStr}

React useState for open/close tracking. Framer Motion: height animation on answer panel.`
}

function buildCTA(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as CTAData

  let bgSpec = 'Background: inherits bg-background with two decorative gradient orbs (bottom-left and top-right at 4% opacity)'
  if (d.bgType === 'video' && d.bgUrl) {
    bgSpec = `Background video: ${d.bgUrl}
absolute inset-0 w-full h-full object-cover opacity-60
Top gradient fade: absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-background to-transparent z-[1]
Gradient orbs: Two decorative blurred circles (bottom-left 500px primary color, top-right 400px warm gold) at 4% opacity`
  } else if (d.bgType === 'image' && d.bgUrl) {
    bgSpec = `Background image: ${d.bgUrl}
absolute inset-0 w-full h-full object-cover opacity-60
Top gradient fade: absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-background to-transparent z-[1]`
  }

  return `SECTION ${idx} — CTA Section
Component: CTASection.tsx
${bgSpec}

CTA content (centered, z-10, max-w-4xl):
Pill badge: "${d.sectionTag}"
H2: "${d.heading1} / ${d.heading2}" — size clamp(2.2rem,5vw,4.5rem)
Description: "${d.description}"

Two buttons:
"${d.ctaPrimary}" — gradient pill bg-gradient-to-r from-[hsl(${g.colors.primary})] to-[hsl(40,80%,82%)] text-background rounded-full px-8 py-4 text-base font-medium
${d.ctaSecondary ? `"${d.ctaSecondary}" — solid bg-foreground text-background rounded-full px-8 py-4 text-base font-medium` : ''}

Framer Motion fade-up, duration 0.7`
}

function buildFooter(b: Block, g: AppState['global'], idx: number): string {
  const d = b.data as FooterData
  const brand = d.logo || g.brandName || 'BRAND'
  const columnCount = d.columnCount ?? d.columns.length

  const colsStr = d.columns.slice(0, columnCount).map((col, i) => {
    const links = col.links.map(l => `"${l.label}"`).join(', ')
    return `Column ${i + 1}: "${col.heading}" — links: ${links}`
  }).join('\n')

  const bottomLinks = d.bottomLinks
    ? [d.bottomLinks.privacy && '"Privacy"', d.bottomLinks.terms && '"Terms"', d.bottomLinks.contact && '"Contact"'].filter(Boolean).join(', ')
    : ''

  return `SECTION ${idx} — Footer
Component: FooterSection.tsx
Layout: pt-20 pb-10 px-6 md:px-10 border-t border-foreground/[0.08]

${columnCount}-column grid:
${colsStr}

Links: text-foreground/40 text-xs tracking-[0.15em] uppercase hover:text-foreground/70

Bottom bar: flex justify-between items-center border-t border-foreground/[0.08] mt-12 pt-8
Left: "${brand}" logo (text-2xl font-bold)
Center nav: text-foreground/40 text-xs uppercase tracking-[0.15em]
Right: "${d.copyright}" — text-foreground/30${bottomLinks ? `\nBottom links: ${bottomLinks}` : ''}`
}

// ─── Main Prompt Builder ───────────────────────────────────────────────────────
export function generatePrompt(state: AppState): string {
  const { global: g, blocks } = state
  const activeBlocks = blocks.filter(b => b.enabled !== false)
  if (activeBlocks.length === 0) return '// Add sections to generate your prompt'

  const brand = g.brandName || 'Your Company'
  const tagline = g.tagline || 'A premium landing page'

  const sections: string[] = []

  // Header
  sections.push(`FULL RECREATION PROMPT
Build a single-page landing page for "${brand}" — ${tagline}.`)

  // Stack
  sections.push(buildStack(activeBlocks, g.preset))

  // Fonts
  sections.push(buildFonts(g))

  // Design System
  sections.push(buildDesignSystem(g))

  // Global Patterns
  sections.push(buildGlobalPatterns(g))

  // Sections
  let sectionIdx = 1
  for (const block of activeBlocks) {
    let sectionStr = ''

    try {
      switch (block.type) {
        case 'navbar':       sectionStr = buildNavbar(block, g, sectionIdx); break
        case 'hero':         sectionStr = buildHero(block, g, sectionIdx); break
        case 'marquee':      sectionStr = buildMarquee(block, g, sectionIdx); break
        case 'features':     sectionStr = buildFeatures(block, g, sectionIdx); break
        case 'chess':        sectionStr = buildChess(block, g, sectionIdx); break
        case 'stats':        sectionStr = buildStats(block, g, sectionIdx); break
        case 'testimonials': sectionStr = buildTestimonials(block, g, sectionIdx); break
        case 'pricing':      sectionStr = buildPricing(block, g, sectionIdx); break
        case 'faq':          sectionStr = buildFAQ(block, g, sectionIdx); break
        case 'cta':          sectionStr = buildCTA(block, g, sectionIdx); break
        case 'footer':       sectionStr = buildFooter(block, g, sectionIdx); break
      }
    } catch (_e) {
      sectionStr = `SECTION ${sectionIdx} — ${block.type.toUpperCase()}\n// (configure this section to generate its prompt)`
    }

    if (sectionStr) {
      sections.push(sectionStr)
      sectionIdx++
    }
  }

  // Dependencies
  const deps = ['framer-motion', 'lucide-react', 'tailwindcss-animate']
  if (hasVideoBlock(activeBlocks)) deps.push('hls.js')
  if (hasGlassmorphism(activeBlocks, g.preset)) deps.push('@radix-ui/react-slot', 'class-variance-authority')
  if (activeBlocks.some(b => b.type === 'faq')) deps.push('@radix-ui/react-accordion')

  sections.push(`Key Dependencies\n${deps.join(', ')}`)

  // Tailwind Config
  const fontFamilyConfig = g.displayFont !== g.bodyFont
    ? `fontFamily: { sans: ["'${g.bodyFont}'", "sans-serif"], display: ["'${g.displayFont}'", "serif"] }`
    : `fontFamily: { sans: ["'${g.bodyFont}'", "sans-serif"] }`

  const hasMarquee = activeBlocks.some(b => b.type === 'marquee' || (b.type === 'hero' && (b.data as HeroData).showMarquee))
  const marqueeConfig = hasMarquee
    ? `\nMarquee keyframe: "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } — animation: marquee 20s linear infinite`
    : ''

  sections.push(`Tailwind Config Extras\n${fontFamilyConfig}${marqueeConfig}`)

  // PAGE STRUCTURE
  const componentNames = activeBlocks.map(b => {
    const names: Record<BlockType, string> = {
      navbar: 'Navbar', hero: 'HeroSection', marquee: 'MarqueeSection',
      features: 'FeaturesSection', chess: 'ChessSection', stats: 'NumbersSection',
      testimonials: 'TestimonialsSection', pricing: 'PricingSection',
      faq: 'FAQSection', cta: 'CTASection', footer: 'FooterSection',
    }
    return `<${names[b.type]} />`
  })

  sections.push(`PAGE STRUCTURE (App.tsx)\n${componentNames.join('\n')}`)

  return sections.join('\n\n—\n\n')
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
