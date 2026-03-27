import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export const FONT_LIST: { name: string; category: 'Serif' | 'Sans' | 'Display' | 'Mono' }[] = [
  // Serif / Editorial
  { name: 'Gilda Display',       category: 'Serif' },
  { name: 'Playfair Display',    category: 'Serif' },
  { name: 'Cormorant Garamond',  category: 'Serif' },
  { name: 'Fraunces',            category: 'Serif' },
  { name: 'Instrument Serif',    category: 'Serif' },
  { name: 'DM Serif Display',    category: 'Serif' },
  { name: 'Bodoni Moda',         category: 'Serif' },
  { name: 'EB Garamond',         category: 'Serif' },
  { name: 'Lora',                category: 'Serif' },
  { name: 'Libre Baskerville',   category: 'Serif' },
  { name: 'Merriweather',        category: 'Serif' },
  { name: 'PT Serif',            category: 'Serif' },
  { name: 'Crimson Text',        category: 'Serif' },
  { name: 'Spectral',            category: 'Serif' },
  { name: 'Bitter',              category: 'Serif' },
  { name: 'Domine',              category: 'Serif' },
  // Display / Impact
  { name: 'Abril Fatface',       category: 'Display' },
  { name: 'Bebas Neue',          category: 'Display' },
  { name: 'Syne',                category: 'Display' },
  { name: 'Bricolage Grotesque', category: 'Display' },
  { name: 'Unbounded',           category: 'Display' },
  { name: 'Oswald',              category: 'Display' },
  { name: 'Righteous',           category: 'Display' },
  { name: 'Michroma',            category: 'Display' },
  { name: 'Exo 2',               category: 'Display' },
  { name: 'Orbitron',            category: 'Display' },
  // Sans-serif
  { name: 'Inter',               category: 'Sans' },
  { name: 'Montserrat',          category: 'Sans' },
  { name: 'Poppins',             category: 'Sans' },
  { name: 'Open Sans',           category: 'Sans' },
  { name: 'Lato',                category: 'Sans' },
  { name: 'Roboto',              category: 'Sans' },
  { name: 'Source Sans 3',       category: 'Sans' },
  { name: 'Nunito',              category: 'Sans' },
  { name: 'Nunito Sans',         category: 'Sans' },
  { name: 'Plus Jakarta Sans',   category: 'Sans' },
  { name: 'DM Sans',             category: 'Sans' },
  { name: 'Outfit',              category: 'Sans' },
  { name: 'Space Grotesk',       category: 'Sans' },
  { name: 'Urbanist',            category: 'Sans' },
  { name: 'Manrope',             category: 'Sans' },
  { name: 'Work Sans',           category: 'Sans' },
  { name: 'Raleway',             category: 'Sans' },
  { name: 'Mulish',              category: 'Sans' },
  { name: 'Josefin Sans',        category: 'Sans' },
  { name: 'Jost',                category: 'Sans' },
  { name: 'Karla',               category: 'Sans' },
  { name: 'Barlow',              category: 'Sans' },
  { name: 'Figtree',             category: 'Sans' },
  { name: 'Lexend',              category: 'Sans' },
  { name: 'Geist',               category: 'Sans' },
  { name: 'IBM Plex Sans',       category: 'Sans' },
  { name: 'Noto Sans',           category: 'Sans' },
  // Mono
  { name: 'JetBrains Mono',      category: 'Mono' },
  { name: 'Space Mono',          category: 'Mono' },
  { name: 'Fira Code',           category: 'Mono' },
  { name: 'IBM Plex Mono',       category: 'Mono' },
  { name: 'Roboto Mono',         category: 'Mono' },
  { name: 'Source Code Pro',     category: 'Mono' },
  { name: 'Inconsolata',         category: 'Mono' },
]

const CATEGORY_ORDER = ['Serif', 'Display', 'Sans', 'Mono'] as const
const CATEGORY_LABELS: Record<string, string> = {
  Serif:   'Serif / Editorial',
  Display: 'Display / Impacto',
  Sans:    'Sans-serif / Moderno',
  Mono:    'Monospace',
}
const CATEGORY_BADGE: Record<string, string> = {
  Serif:   'bg-amber-50 text-amber-600',
  Display: 'bg-rose-50 text-rose-600',
  Sans:    'bg-beige text-mist',
  Mono:    'bg-sky-soft text-sky-DEFAULT',
}

interface Props {
  label: string
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch('')
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const filtered = FONT_LIST.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat, fonts: filtered.filter(f => f.category === cat),
  })).filter(g => g.fonts.length > 0)

  const selectedFont = FONT_LIST.find(f => f.name === value)

  return (
    <div className="relative" ref={ref}>
      <label className="label-base">{label}</label>
      <button
        onClick={() => { setOpen(!open); setSearch('') }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
          open ? 'border-lilac/60 ring-2 ring-lilac/10 bg-white' : 'border-sand bg-white hover:border-lilac/30'
        }`}
      >
        <span className={`text-[15px] font-semibold truncate ${value ? 'text-ink' : 'text-mist/50'}`}>
          {value || 'Escolha uma fonte…'}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {selectedFont && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[selectedFont.category]}`}>
              {selectedFont.category}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-mist transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-sand rounded-2xl shadow-xl shadow-ink/10 z-50 overflow-hidden">
          <div className="px-3 py-3 border-b border-sand">
            <div className="flex items-center gap-2.5 bg-beige rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-mist flex-shrink-0" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-[14px] font-semibold text-ink placeholder:text-mist/50 outline-none"
                placeholder="Buscar fonte…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {grouped.map(({ cat, fonts }) => (
              <div key={cat}>
                <div className="px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-mist/50 bg-parchment/60 sticky top-0">
                  {CATEGORY_LABELS[cat]}
                </div>
                {fonts.map(font => {
                  const active = value === font.name
                  return (
                    <button
                      key={font.name}
                      onClick={() => { onChange(font.name); setOpen(false); setSearch('') }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                        active ? 'bg-lilac-soft' : 'hover:bg-parchment'
                      }`}
                    >
                      <span className={`text-[14px] font-semibold ${active ? 'text-lilac' : 'text-ink'}`}>
                        {font.name}
                      </span>
                      {active && <Check className="w-4 h-4 text-lilac flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-[14px] font-semibold text-mist">Nenhuma fonte encontrada</div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-sand bg-parchment/40">
            <p className="text-[11px] font-semibold text-mist">Catálogo Google Fonts · carregam automaticamente</p>
          </div>
        </div>
      )}
    </div>
  )
}
