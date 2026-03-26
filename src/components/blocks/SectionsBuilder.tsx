import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import type { Block, BlockType, BlockData } from '../../types'
import { BlockCard } from './BlockCard'

const BLOCK_OPTIONS: { type: BlockType; label: string; desc: string; icon: string }[] = [
  { type: 'navbar',       label: 'Navbar',           desc: 'Navigation bar with logo & links',  icon: '▤' },
  { type: 'hero',         label: 'Hero',             desc: 'Full-viewport hero section',        icon: '⬛' },
  { type: 'marquee',      label: 'Partners Marquee', desc: 'Scrolling brand/partner names bar', icon: '↔' },
  { type: 'features',     label: 'Features',         desc: 'Card grid showcasing services',     icon: '⊞' },
  { type: 'chess',        label: 'Chess Layout',     desc: 'Image + text side by side',         icon: '◫' },
  { type: 'stats',        label: 'Stats / Numbers',  desc: 'Animated metrics with video bg',    icon: '◎' },
  { type: 'testimonials', label: 'Testimonials',     desc: 'Quote cards from customers',        icon: '❝' },
  { type: 'pricing',      label: 'Pricing',          desc: 'Pricing plans comparison',          icon: '₿' },
  { type: 'faq',          label: 'FAQ',              desc: 'Accordion Q&A section',             icon: '?' },
  { type: 'cta',          label: 'CTA Final',        desc: 'Call-to-action closing section',    icon: '→' },
  { type: 'footer',       label: 'Footer',           desc: 'Multi-column footer with links',    icon: '▬' },
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

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream border-b-2 border-sand px-7 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink">Sections</h2>
          <p className="text-[14px] text-mist font-semibold mt-0.5">Build your landing page section by section</p>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setShowMenu(!showMenu)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Add Section
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-3 w-76 bg-white border-2 border-sand rounded-2xl shadow-xl shadow-ink/10 z-50 overflow-hidden animate-slide-down">
              <div className="px-5 py-3.5 border-b-2 border-sand flex items-center justify-between">
                <span className="text-[15px] font-extrabold text-ink">Add Section</span>
                <button onClick={() => setShowMenu(false)} className="text-mist hover:text-ink transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-2 max-h-[380px] overflow-y-auto">
                {BLOCK_OPTIONS.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => { addBlock(opt.type); setShowMenu(false) }}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-parchment transition-colors text-left"
                  >
                    <span className="w-10 h-10 rounded-xl bg-beige border-2 border-sand flex items-center justify-center text-base text-mist flex-shrink-0">
                      {opt.icon}
                    </span>
                    <div>
                      <div className="text-[15px] font-bold text-ink">{opt.label}</div>
                      <div className="text-[13px] font-semibold text-mist mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blocks list */}
      <div className="flex-1 px-7 py-6 space-y-4">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-sand flex items-center justify-center mb-5">
              <Plus className="w-10 h-10 text-mist/50" />
            </div>
            <p className="text-lg font-extrabold text-ink/40">No sections yet</p>
            <p className="text-[15px] font-semibold text-mist mt-2">Click "Add Section" to start building</p>
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

      <div className="h-10" />
    </div>
  )
}
