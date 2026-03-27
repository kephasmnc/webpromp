export type BlockType =
  | 'navbar'
  | 'hero'
  | 'marquee'
  | 'features'
  | 'chess'
  | 'stats'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'footer'

export type Preset = 'none' | 'dark-minimal' | 'liquid-glass' | 'light-corporate'
export type ButtonStyle = 'sharp' | 'rounded' | 'pill'
export type AnimationIntensity = 'none' | 'subtle' | 'dramatic'
export type TargetPlatform = 'lovable' | 'v0' | 'stitch' | 'claude-code'

export interface ColorPalette {
  background: string
  foreground: string
  primary: string
  card: string
  muted: string
}

export type LayoutStyle = 'classic' | 'asymmetric' | 'editorial' | 'immersive'

export interface GlobalConfig {
  brandName: string
  tagline: string
  logoType: 'text' | 'image'
  logoUrl: string
  vibes: string[]
  preset: Preset
  displayFont: string
  bodyFont: string
  colors: ColorPalette
  buttonStyle: ButtonStyle
  animationIntensity: AnimationIntensity
  layoutStyle: LayoutStyle
  targetPlatform: TargetPlatform
}

// ─── Block Data Types ─────────────────────────────────────────────────────────

export interface NavLink { label: string; url?: string }
export interface NavbarData {
  logoPosition: 'left' | 'center'
  links: NavLink[]
  ctaLabel: string
  ctaStyle: 'gradient' | 'solid' | 'outline'
  sticky: boolean
}

export interface HeroData {
  sectionTag: string
  headline1: string
  headline2: string
  headline3: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
  bgType: 'none' | 'image' | 'video'
  bgUrl: string
  layout: 'centered' | 'bottom-left' | 'bottom-right' | 'split-left' | 'split-right' | 'editorial' | 'fulltype'
  showMarquee: boolean
  marqueeItems: string
}

export interface MarqueeData {
  label: string
  brands: string[]
  speed: 'slow' | 'medium' | 'fast'
}

export interface FeatureCard {
  icon: string
  tag: string
  title: string
  description: string
  statValue?: string
  statLabel?: string
}
export interface FeaturesData {
  sectionTag: string
  heading: string
  subtitle: string
  cardCount: 2 | 3 | 4
  cards: FeatureCard[]
  bgType: 'dark' | 'video'
  bgUrl?: string
}

export interface StatPair { value: string; label: string }
export interface ChessData {
  sectionTag: string
  direction: 'image-left' | 'image-right'
  mediaType: 'image' | 'video'
  mediaUrl: string
  heading1: string
  heading2: string
  description: string
  stats: StatPair[]
  ctaLabel?: string
}

export interface Metric { value: string; label: string; sublabel?: string }
export interface StatsData {
  sectionTag: string
  heading1: string
  heading2: string
  bgVideo?: string
  metrics: Metric[]
  animated: boolean
}

export interface Testimonial { quote: string; name: string; role: string }
export interface TestimonialsData {
  sectionTag: string
  heading: string
  count: 3 | 4 | 6
  testimonials: Testimonial[]
}

export interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  ctaLabel: string
  highlighted: boolean
}
export interface PricingData {
  sectionTag: string
  heading: string
  planCount: 2 | 3
  plans: PricingPlan[]
}

export interface FAQItem { question: string; answer: string }
export interface FAQData {
  sectionTag: string
  heading: string
  items: FAQItem[]
}

export interface CTAData {
  sectionTag: string
  heading1: string
  heading2: string
  description: string
  ctaPrimary: string
  ctaSecondary?: string
  bgType: 'none' | 'image' | 'video'
  bgUrl?: string
}

export interface FooterLink { label: string; url: string }
export interface FooterColumn { heading: string; links: FooterLink[] }
export interface FooterData {
  logo: string
  columnCount: 1 | 2 | 4
  columns: FooterColumn[]
  copyright: string
  bottomLinks: { privacy: string; terms: string; contact: string }
}

export type BlockData =
  | NavbarData
  | HeroData
  | MarqueeData
  | FeaturesData
  | ChessData
  | StatsData
  | TestimonialsData
  | PricingData
  | FAQData
  | CTAData
  | FooterData

export interface Block {
  id: string
  type: BlockType
  enabled: boolean
  data: BlockData
}

export interface AppState {
  global: GlobalConfig
  blocks: Block[]
}
