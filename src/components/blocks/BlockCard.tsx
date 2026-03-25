import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
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

const BLOCK_META: Record<string, { label: string; icon: string; color: string }> = {
  navbar:       { label: 'Navbar',           icon: '▤',  color: 'text-sky-400' },
  hero:         { label: 'Hero',             icon: '⬛', color: 'text-violet-400' },
  marquee:      { label: 'Partners Marquee', icon: '↔',  color: 'text-cyan-400' },
  features:     { label: 'Features',         icon: '⊞',  color: 'text-emerald-400' },
  chess:        { label: 'Chess Layout',     icon: '◫',  color: 'text-orange-400' },
  stats:        { label: 'Stats / Numbers',  icon: '◎',  color: 'text-yellow-400' },
  testimonials: { label: 'Testimonials',     icon: '❝',  color: 'text-pink-400' },
  pricing:      { label: 'Pricing',          icon: '₿',  color: 'text-indigo-400' },
  faq:          { label: 'FAQ',              icon: '?',  color: 'text-teal-400' },
  cta:          { label: 'CTA Final',        icon: '→',  color: 'text-rose-400' },
  footer:       { label: 'Footer',           icon: '▬',  color: 'text-slate-400' },
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
  const meta = BLOCK_META[block.type] ?? { label: block.type, icon: '□', color: 'text-slate-400' }

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
    <div className={`card-surface transition-all duration-200 ${!block.enabled ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle placeholder */}
        <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 cursor-grab" />

        {/* Index */}
        <span className="text-[10px] font-mono text-slate-600 w-4 flex-shrink-0">{index + 1}</span>

        {/* Icon + Name */}
        <span className={`text-sm flex-shrink-0 ${meta.color}`}>{meta.icon}</span>
        <span className="text-sm font-medium text-slate-200 flex-1 min-w-0 truncate">{meta.label}</span>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
            title={block.enabled ? 'Disable section' : 'Enable section'}
          >
            {block.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Remove section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all ml-0.5"
            title={expanded ? 'Collapse' : 'Configure'}
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Form */}
      {expanded && (
        <div className="border-t border-[#252836] px-3 py-3">
          {renderForm()}
        </div>
      )}
    </div>
  )
}
