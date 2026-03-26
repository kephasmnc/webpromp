import { useState, useCallback } from 'react'
import type {
  AppState, GlobalConfig, Block, BlockType, BlockData,
  NavbarData, HeroData, MarqueeData, FeaturesData, ChessData, StatsData,
  TestimonialsData, PricingData, FAQData, CTAData, FooterData,
  Preset
} from '../types'

// ─── Tone → Color Defaults ─────────────────────────────────────────────────────
// Applied automatically when user picks a tone in Layer 1 Vibe
export const TONE_COLOR_DEFAULTS: Record<string, Partial<GlobalConfig>> = {
  dark: {
    colors: { background: '0 0% 2%', foreground: '40 6% 95%', primary: '220 70% 78%', card: '0 0% 7%', muted: '0 0% 14%' },
    displayFont: 'Gilda Display',
    bodyFont: 'Geist',
  },
  light: {
    colors: { background: '40 30% 97%', foreground: '20 10% 10%', primary: '239 60% 60%', card: '40 20% 93%', muted: '40 15% 88%' },
    displayFont: 'Instrument Serif',
    bodyFont: 'Inter',
  },
  colorful: {
    colors: { background: '0 0% 5%', foreground: '0 0% 98%', primary: '291 90% 65%', card: '270 15% 10%', muted: '270 10% 18%' },
    displayFont: 'Geist Sans',
    bodyFont: 'Geist Sans',
  },
  charged: {
    colors: { background: '38 22% 86%', foreground: '20 12% 9%', primary: '330 100% 57%', card: '38 18% 80%', muted: '38 12% 73%' },
    displayFont: 'Gilda Display',
    bodyFont: 'Inter',
  },
}

// ─── Preset Configs ────────────────────────────────────────────────────────────
const PRESETS: Record<Preset, Partial<GlobalConfig>> = {
  'none': {},
  'dark-minimal': {
    displayFont: 'Gilda Display',
    bodyFont: 'Geist',
    colors: {
      background: '0 0% 0%',
      foreground: '0 0% 100%',
      primary: '220 70% 78%',
      card: '0 0% 6%',
      muted: '0 0% 15%',
    },
    buttonStyle: 'pill',
    animationIntensity: 'subtle',
  },
  'liquid-glass': {
    displayFont: 'Geist Sans',
    bodyFont: 'Geist Sans',
    colors: {
      background: '260 87% 3%',
      foreground: '40 6% 95%',
      primary: '121 95% 76%',
      card: '240 6% 9%',
      muted: '240 4% 16%',
    },
    buttonStyle: 'pill',
    animationIntensity: 'subtle',
  },
  'light-corporate': {
    displayFont: 'Instrument Serif',
    bodyFont: 'Inter',
    colors: {
      background: '0 0% 100%',
      foreground: '210 14% 17%',
      primary: '239 84% 67%',
      card: '0 0% 96%',
      muted: '0 0% 96%',
    },
    buttonStyle: 'pill',
    animationIntensity: 'subtle',
  },
}

// ─── Block Defaults ────────────────────────────────────────────────────────────
function createBlockData(type: BlockType): BlockData {
  switch (type) {
    case 'navbar': return {
      logoPosition: 'left',
      links: [{ label: 'About' }, { label: 'Services' }, { label: 'Work' }, { label: 'Contact' }],
      ctaLabel: 'Get Started',
      ctaStyle: 'gradient',
      sticky: true,
    } as NavbarData

    case 'hero': return {
      sectionTag: '',
      headline1: 'Navigating the',
      headline2: 'route to impactful',
      headline3: 'regeneration',
      subtitle: 'Guiding organizations toward lasting performance through actionable strategy and measurable outcomes.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'Learn More',
      bgType: 'none',
      bgUrl: '',
      layout: 'bottom-left',
      showMarquee: false,
      marqueeItems: 'Partner One, Partner Two, Partner Three, Partner Four, Partner Five',
    } as HeroData

    case 'marquee': return {
      label: 'Trusted by leading brands',
      brands: ['Google', 'Microsoft', 'Stripe', 'Notion', 'Figma', 'Linear'],
      speed: 'medium',
    } as MarqueeData

    case 'features': return {
      sectionTag: 'What We Do',
      heading: 'Services built for meaningful change',
      subtitle: 'Everything you need to build something extraordinary.',
      cardCount: 3,
      cards: [
        { icon: 'Zap', tag: 'Strategy', title: 'Sustainable Strategy', description: 'We craft tailored roadmaps that align business objectives with long-term resilience.' },
        { icon: 'BarChart3', tag: 'Analytics', title: 'Impact Measurement', description: 'Rigorous data frameworks that quantify your footprint and track progress against targets.' },
        { icon: 'Shield', tag: 'Compliance', title: 'Global Compliance', description: 'Navigate evolving regulations across markets with confidence and precision.' },
      ],
      bgType: 'dark',
    } as FeaturesData

    case 'chess': return {
      sectionTag: 'Our Approach',
      direction: 'image-left',
      mediaType: 'video',
      mediaUrl: '',
      heading1: 'Designing systems that',
      heading2: 'regenerate, not deplete',
      description: 'We go beyond conventional approaches. Our methodology embeds circular principles into your operations — reducing waste, restoring ecosystems, and creating value at every stage.',
      stats: [{ value: '12x', label: 'ROI Average' }, { value: '6mo', label: 'Time to Impact' }],
      ctaLabel: 'Explore More',
    } as ChessData

    case 'stats': return {
      sectionTag: 'By the Numbers',
      heading1: 'Measurable outcomes,',
      heading2: 'not empty promises',
      bgVideo: '',
      metrics: [
        { value: '200+', label: 'Projects Delivered', sublabel: 'Across 40 countries' },
        { value: '97%', label: 'Client Retention', sublabel: 'Year over year' },
        { value: '4.2M', label: 'Tons CO₂ Offset', sublabel: 'Since 2019' },
        { value: '30+', label: 'Global Partners', sublabel: 'Fortune 500 brands' },
      ],
      animated: true,
    } as StatsData

    case 'testimonials': return {
      sectionTag: 'Testimonials',
      heading: 'Trusted by leaders driving real change',
      count: 3,
      testimonials: [
        { quote: 'This transformed how we approach our strategy — not as a cost center, but as a strategic advantage. The results exceeded every projection.', name: 'Sarah Chen', role: 'Chief Sustainability Officer, Under Armour' },
        { quote: "Their data-driven methodology gave our board the confidence to commit to our goals. Within 18 months, we'd already surpassed our first-year targets.", name: 'Marcus Webb', role: 'VP of Operations, ECCO' },
        { quote: 'Working with this team felt like gaining an extension of our own team. They understood our constraints and delivered a roadmap we could actually execute.', name: 'Amara Osei', role: 'Managing Director, ORUM' },
      ],
    } as TestimonialsData

    case 'pricing': return {
      sectionTag: 'Pricing',
      heading: 'Simple, transparent pricing',
      planCount: 3,
      plans: [
        { name: 'Starter', price: '$49', period: '/month', features: ['Up to 5 projects', 'Basic analytics', 'Email support'], ctaLabel: 'Get Started', highlighted: false },
        { name: 'Pro', price: '$149', period: '/month', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom integrations'], ctaLabel: 'Start Free Trial', highlighted: true },
        { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'Dedicated account manager', 'SLA guarantee', 'Custom contracts'], ctaLabel: 'Contact Sales', highlighted: false },
      ],
    } as PricingData

    case 'faq': return {
      sectionTag: 'FAQ',
      heading: 'Frequently asked questions',
      items: [
        { question: 'How does the onboarding process work?', answer: "Our onboarding is fully managed. You'll have a dedicated team member guiding you through setup, integration, and your first milestone within the first 30 days." },
        { question: 'What results can I expect and when?', answer: 'Most clients see measurable impact within 6 months. We set clear KPIs at the start and report on them monthly so you always know where you stand.' },
        { question: 'Do you work with companies of all sizes?', answer: 'Yes. We work with startups, mid-market, and Fortune 500 companies. Our approach is tailored to your scale and constraints.' },
      ],
    } as FAQData

    case 'cta': return {
      sectionTag: 'Get Started',
      heading1: 'Ready to build a',
      heading2: 'regenerative future?',
      description: "Partner with us to transform your ambitions into measurable, lasting impact. Let's start the conversation.",
      ctaPrimary: 'Book a Consultation →',
      ctaSecondary: 'View Case Studies',
      bgType: 'none',
    } as CTAData

    case 'footer': return {
      logo: '',
      columnCount: 4,
      columns: [
        { heading: 'Product', links: [{ label: 'Features', url: '#' }, { label: 'Pricing', url: '#' }, { label: 'Integrations', url: '#' }, { label: 'Changelog', url: '#' }] },
        { heading: 'Company', links: [{ label: 'About', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Careers', url: '#' }, { label: 'Press', url: '#' }] },
        { heading: 'Resources', links: [{ label: 'Documentation', url: '#' }, { label: 'Community', url: '#' }, { label: 'Support', url: '#' }, { label: 'Status', url: '#' }] },
        { heading: 'Legal', links: [{ label: 'Privacy', url: '/privacy' }, { label: 'Terms', url: '/terms' }, { label: 'Cookies', url: '#' }] },
      ],
      copyright: `© ${new Date().getFullYear()} Company Inc. All rights reserved.`,
      bottomLinks: { privacy: '/privacy', terms: '/terms', contact: '/contact' },
    } as FooterData

    default: return {} as BlockData
  }
}

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState: AppState = {
  global: {
    brandName: '',
    tagline: '',
    logoType: 'text',
    logoUrl: '',
    vibes: ['dark', 'premium'],
    preset: 'none',
    displayFont: 'Gilda Display',
    bodyFont: 'Geist',
    colors: {
      background: '0 0% 2%',
      foreground: '40 6% 95%',
      primary: '220 70% 78%',
      card: '0 0% 7%',
      muted: '0 0% 14%',
    },
    buttonStyle: 'pill',
    animationIntensity: 'subtle',
  },
  blocks: [
    { id: '1', type: 'navbar',   enabled: true, data: createBlockData('navbar') },
    { id: '2', type: 'hero',     enabled: true, data: createBlockData('hero') },
    { id: '3', type: 'features', enabled: true, data: createBlockData('features') },
    { id: '4', type: 'cta',      enabled: true, data: createBlockData('cta') },
    { id: '5', type: 'footer',   enabled: true, data: createBlockData('footer') },
  ],
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useStore() {
  const [state, setState] = useState<AppState>(initialState)

  const updateGlobal = useCallback((updates: Partial<GlobalConfig>) => {
    setState(s => ({ ...s, global: { ...s.global, ...updates } }))
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    const p = PRESETS[preset]
    setState(s => ({
      ...s,
      global: {
        ...s.global,
        preset,
        ...(p.displayFont && { displayFont: p.displayFont }),
        ...(p.bodyFont && { bodyFont: p.bodyFont }),
        ...(p.colors && { colors: p.colors }),
        ...(p.buttonStyle && { buttonStyle: p.buttonStyle }),
        ...(p.animationIntensity && { animationIntensity: p.animationIntensity }),
      },
    }))
  }, [])

  const addBlock = useCallback((type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      enabled: true,
      data: createBlockData(type),
    }
    setState(s => ({ ...s, blocks: [...s.blocks, newBlock] }))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setState(s => ({ ...s, blocks: s.blocks.filter(b => b.id !== id) }))
  }, [])

  const toggleBlock = useCallback((id: string) => {
    setState(s => ({
      ...s,
      blocks: s.blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b),
    }))
  }, [])

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setState(s => {
      const idx = s.blocks.findIndex(b => b.id === id)
      if (idx === -1) return s
      const newBlocks = [...s.blocks]
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1
      if (targetIdx < 0 || targetIdx >= newBlocks.length) return s
      ;[newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]]
      return { ...s, blocks: newBlocks } as AppState
    })
  }, [])

  const updateBlock = useCallback((id: string, data: Partial<BlockData>) => {
    setState(s => ({
      ...s,
      blocks: s.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } as BlockData } : b),
    } as AppState))
  }, [])

  return {
    state,
    updateGlobal,
    applyPreset,
    addBlock,
    removeBlock,
    toggleBlock,
    moveBlock,
    updateBlock,
  }
}

export { createBlockData }
