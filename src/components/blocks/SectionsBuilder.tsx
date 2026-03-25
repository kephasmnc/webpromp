import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import type { Block, BlockType, BlockData } from '../../types'
import { BlockCard } from './BlockCard'

const BLOCK_OPTIONS: { type: BlockType; label: string; desc: string; icon: string }[] = [
  { type: 'navbar',       label: 'Navbar',          desc: 'Navigation bar with logo & links',      icon: '▤' },
  { type: 'hero',         label: 'Hero',             desc: 'Full-viewport hero section',            icon: '⬛' },
  { type: 'marquee',      label: 'Partners Marquee', desc: 'Scrolling brand/partner names bar',     icon: '↔' },
  { type: 'features',     label: 'Features',         desc: 'Card grid showcasing services',         icon: '⊞' },
  { type: 'chess',        label: 'Chess Layout',     desc: 'Image + text side by side',             icon: '◫' },
  { type: 'stats',        label: 'Stats / Numbers',  desc: 'Animated metrics with video bg',        icon: '◎' },
  { type: 'testimonials', label: 'Testimonials',     desc: 'Quote cards from customers',            icon: '❝' },
  { type: 'pricing',      label: 'Pricing',          desc: 'Pricing plans comparison',              icon: '₿' },
  { type: 'faq',          label: 'FAQ',              desc: 'Accordion Q&A section',                 icon: '?' },
  { type: 'cta',          label: 'CTA Final',        desc: 'Call-to-action closing section',        icon: '→' },
  { type: 'footer',       label: 'Footer',           desc: 'Multi-column footer with links',        icon: '▬' },
]

interface Props {
  blocks: Block[]
  addBlock: (type: BlockType) => void
  removeBlock: (id: string) => void
  toggleBlock: (id: string) => void
  moveBlock: (id: string, dir: 'up' | 'down') => void
  updateBlock: (id: string, data: Partial<BlockData>) => void
}

export function SectionsBuilder({ blocks, addBlock, removeBlock, toggleBlock, moveBlock, updateBlock }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleAdd = (type: BlockType) => {
    addBlock(type)
    setShowMenu(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-void border-b border-[#252836] px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Sections</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Build your landing page section by section</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 card-surface shadow-2xl shadow-black/50 z-50 overflow-hidden animate-slide-down">
              <div className="px-3 py-2 border-b border-[#252836] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Add Section</span>
                <button onClick={() => setShowMenu(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
                {BLOCK_OPTIONS.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => handleAdd(opt.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <span className="w-7 h-7 rounded-md bg-panel border border-[#252836] flex items-center justify-center text-sm text-slate-400 flex-shrink-0">
                      {opt.icon}
                    </span>
                    <div>
                      <div className="text-sm text-slate-200 font-medium">{opt.label}</div>
                      <div className="text-[11px] text-slate-500">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blocks list */}
      <div className="flex-1 px-6 py-4 space-y-3">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#252836] flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No sections yet</p>
            <p className="text-slate-600 text-xs mt-1">Click "Add Section" to start building</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <BlockCard
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              onToggle={() => toggleBlock(block.id)}
              onRemove={() => removeBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, 'up')}
              onMoveDown={() => moveBlock(block.id, 'down')}
              onUpdate={(data) => updateBlock(block.id, data)}
            />
          ))
        )}
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}
