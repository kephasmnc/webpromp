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
  navbar:       { label: 'Navbar',           icon: '▤',  accent: 'text-sky',         bg: 'bg-sky-soft' },
  hero:         { label: 'Hero',             icon: '⬛', accent: 'text-lilac',        bg: 'bg-lilac-soft' },
  marquee:      { label: 'Partners Marquee', icon: '↔',  accent: 'text-sky',         bg: 'bg-sky-soft' },
  features:     { label: 'Features',         icon: '⊞',  accent: 'text-emerald-700', bg: 'bg-emerald-50' },
  chess:        { label: 'Chess Layout',     icon: '◫',  accent: 'text-orange-600',  bg: 'bg-orange-50' },
  stats:        { label: 'Stats / Numbers',  icon: '◎',  accent: 'text-amber-700',   bg: 'bg-amber-50' },
  testimonials: { label: 'Testimonials',     icon: '❝',  accent: 'text-pink-600',    bg: 'bg-pink-50' },
  pricing:      { label: 'Pricing',          icon: '₿',  accent: 'text-lilac',       bg: 'bg-lilac-soft' },
  faq:          { label: 'FAQ',              icon: '?',  accent: 'text-teal-700',    bg: 'bg-teal-50' },
  cta:          { label: 'CTA Final',        icon: '→',  accent: 'text-rose-600',    bg: 'bg-rose-50' },
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
      <div className="flex items-center gap-3 px-5 py-4">
        <GripVertical className="w-4 h-4 text-sand flex-shrink-0 cursor-grab" />

        {/* Index badge */}
        <span className="text-[13px] font-extrabold text-mist w-6 flex-shrink-0 text-center">{index + 1}</span>

        {/* Icon chip */}
        <span className={`w-9 h-9 rounded-xl ${meta.bg} border border-black/[0.06] flex items-center justify-center text-[15px] ${meta.accent} flex-shrink-0`}>
          {meta.icon}
        </span>

        {/* Block name */}
        <span className="text-[15px] font-extrabold text-ink flex-1 min-w-0 truncate">{meta.label}</span>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-2.5 rounded-xl text-mist hover:text-ink hover:bg-beige disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-2.5 rounded-xl text-mist hover:text-ink hover:bg-beige disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2.5 rounded-xl text-mist hover:text-ink hover:bg-beige transition-all"
          >
            {block.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-2.5 rounded-xl text-mist hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all ml-1 ${
              expanded
                ? 'bg-lilac text-white shadow-sm shadow-lilac/30'
                : 'bg-beige text-mist hover:bg-lilac-soft hover:text-lilac border border-sand hover:border-lilac/30'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            {expanded ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Expanded Form */}
      {expanded && (
        <div className="border-t border-sand px-6 py-6 bg-parchment/60 rounded-b-2xl">
          {renderForm()}
        </div>
      )}
    </div>
  )
}
