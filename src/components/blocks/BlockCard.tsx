import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, GripVertical, Eye, EyeOff, Settings2 } from 'lucide-react'
import type { Block, BlockData } from '../../types'
import { NavbarForm } from './forms/NavbarForm'
import { HeroForm } from './forms/HeroForm'
import { FeaturesForm } from './forms/FeaturesForm'
import { ChessForm } from './forms/ChessForm'
import { StatsForm } from './forms/StatsForm'
import { TestimonialsForm } from './forms/TestimonialsForm'
import { PricingForm } from './forms/PricingForm'
import { FAQForm } from './forms/FAQForm'
import { CTAForm } from './forms/CTAForm'
import { FooterForm } from './forms/FooterForm'
import { MarqueeForm } from './forms/MarqueeForm'

const BLOCK_META: Record<string, { label: string; icon: string; accent: string; bg: string }> = {
  navbar:       { label: 'Navbar',           icon: '▤',  accent: 'text-sky',    bg: 'bg-sky-soft' },
  hero:         { label: 'Hero',             icon: '⬛', accent: 'text-lilac',  bg: 'bg-lilac-soft' },
  marquee:      { label: 'Partners Marquee', icon: '↔',  accent: 'text-sky',    bg: 'bg-sky-soft' },
  features:     { label: 'Features',         icon: '⊞',  accent: 'text-emerald-600', bg: 'bg-emerald-50' },
  chess:        { label: 'Chess Layout',     icon: '◫',  accent: 'text-orange-500',  bg: 'bg-orange-50' },
  stats:        { label: 'Stats / Numbers',  icon: '◎',  accent: 'text-amber-600',   bg: 'bg-amber-50' },
  testimonials: { label: 'Testimonials',     icon: '❝',  accent: 'text-pink-500',    bg: 'bg-pink-50' },
  pricing:      { label: 'Pricing',          icon: '₿',  accent: 'text-lilac',       bg: 'bg-lilac-soft' },
  faq:          { label: 'FAQ',              icon: '?',  accent: 'text-teal-600',    bg: 'bg-teal-50' },
  cta:          { label: 'CTA Final',        icon: '→',  accent: 'text-rose-500',    bg: 'bg-rose-50' },
  footer:       { label: 'Footer',           icon: '▬',  accent: 'text-mist',        bg: 'bg-beige' },
}

interface Props {
  block: Block
  index: number
  total: number
  onToggle: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onUpdate: (data: Partial<BlockData>) => void
}

export function BlockCard({ block, index, total, onToggle, onRemove, onMoveUp, onMoveDown, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const meta = BLOCK_META[block.type] ?? { label: block.type, icon: '□', accent: 'text-mist', bg: 'bg-beige' }

  const renderForm = () => {
    const props = { data: block.data as any, onUpdate }
    switch (block.type) {
      case 'navbar':       return <NavbarForm {...props} />
      case 'hero':         return <HeroForm {...props} />
      case 'marquee':      return <MarqueeForm {...props} />
      case 'features':     return <FeaturesForm {...props} />
      case 'chess':        return <ChessForm {...props} />
      case 'stats':        return <StatsForm {...props} />
      case 'testimonials': return <TestimonialsForm {...props} />
      case 'pricing':      return <PricingForm {...props} />
      case 'faq':          return <FAQForm {...props} />
      case 'cta':          return <CTAForm {...props} />
      case 'footer':       return <FooterForm {...props} />
      default:             return null
    }
  }

  return (
    <div className={`card-surface transition-all duration-200 ${!block.enabled ? 'opacity-40' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Drag handle */}
        <GripVertical className="w-4 h-4 text-mist/40 flex-shrink-0 cursor-grab" />

        {/* Index badge */}
        <span className="text-xs font-800 text-mist/50 w-5 flex-shrink-0 text-center">{index + 1}</span>

        {/* Icon chip */}
        <span className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center text-sm ${meta.accent} flex-shrink-0`}>
          {meta.icon}
        </span>

        {/* Name */}
        <span className="text-sm font-bold text-ink flex-1 min-w-0 truncate">{meta.label}</span>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-2 rounded-lg text-mist/60 hover:text-ink hover:bg-beige disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-2 rounded-lg text-mist/60 hover:text-ink hover:bg-beige disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-mist/60 hover:text-ink hover:bg-beige transition-all"
            title={block.enabled ? 'Disable section' : 'Enable section'}
          >
            {block.enabled
              ? <Eye className="w-4 h-4" />
              : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg text-mist/60 hover:text-rose-500 hover:bg-rose-50 transition-all"
            title="Remove section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ml-1 ${
              expanded
                ? 'bg-lilac-soft text-lilac'
                : 'bg-beige text-mist hover:bg-lilac-soft hover:text-lilac'
            }`}
            title={expanded ? 'Collapse' : 'Configure'}
          >
            <Settings2 className="w-3.5 h-3.5" />
            {expanded ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Expanded Form */}
      {expanded && (
        <div className="border-t border-sand px-5 py-5 bg-parchment/50 rounded-b-2xl">
          {renderForm()}
        </div>
      )}
    </div>
  )
}
