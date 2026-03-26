import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, Check, Type } from 'lucide-react'

// ─── Curated font list ────────────────────────────────────────────────────────
// All Google Fonts unless marked with googleFonts: false
export const FONT_LIST: { name: string; category: 'Serif' | 'Sans' | 'Display' | 'Mono'; googleFonts: boolean; previewText?: string }[] = [
  // Display / Serif — great for hero headlines
  { name: 'Gilda Display',        category: 'Serif',   googleFonts: true },
  { name: 'Playfair Display',     category: 'Serif',   googleFonts: true },
  { name: 'Cormorant Garamond',   category: 'Serif',   googleFonts: true },
  { name: 'Fraunces',             category: 'Serif',   googleFonts: true },
  { name: 'Instrument Serif',     category: 'Serif',   googleFonts: true },
  { name: 'DM Serif Display',     category: 'Serif',   googleFonts: true },
  { name: 'Bodoni Moda',          category: 'Serif',   googleFonts: true },
  { name: 'EB Garamond',          category: 'Serif',   googleFonts: true },
  { name: 'Lora',                 category: 'Serif',   googleFonts: true },
  { name: 'Libre Baskerville',    category: 'Serif',   googleFonts: true },
  { name: 'Abril Fatface',        category: 'Display', googleFonts: true },
  { name: 'Bebas Neue',           category: 'Display', googleFonts: true },
  // Sans — good for body and modern headings
  { name: 'Inter',                category: 'Sans',    googleFonts: true },
  { name: 'Plus Jakarta Sans',    category: 'Sans',    googleFonts: true },
  { name: 'DM Sans',              category: 'Sans',    googleFonts: true },
  { name: 'Outfit',               category: 'Sans',    googleFonts: true },
  { name: 'Syne',                 category: 'Sans',    googleFonts: true },
  { name: 'Space Grotesk',        category: 'Sans',    googleFonts: true },
  { name: 'Urbanist',             category: 'Sans',    googleFonts: true },
  { name: 'Manrope',              category: 'Sans',    googleFonts: true },
  { name: 'Work Sans',            category: 'Sans',    googleFonts: true },
  { name: 'Raleway',              category: 'Sans',    googleFonts: true },
  { name: 'Nunito',               category: 'Sans',    googleFonts: true },
  { name: 'Bricolage Grotesque',  category: 'Sans',    googleFonts: true },
  { name: 'Geist',                category: 'Sans',    googleFonts: false, previewText: 'Geist (Vercel)' },
  // Mono
  { name: 'JetBrains Mono',       category: 'Mono',    googleFonts: true },
  { name: 'Space Mono',           category: 'Mono',    googleFonts: true },
  { name: 'Fira Code',            category: 'Mono',    googleFonts: true },
]

const CATEGORY_ORDER = ['Serif', 'Display', 'Sans', 'Mono'] as const
const CATEGORY_LABELS: Record<string, string> = {
  Serif: 'Serif / Editorial',
  Display: 'Display / Impact',
  Sans: 'Sans-serif / Moderno',
  Mono: 'Monospace',
}

// Load Google Fonts dynamically
function loadFonts(fonts: string[]) {
  const googleFonts = fonts
    .filter(name => FONT_LIST.find(f => f.name === name && f.googleFonts))
  if (googleFonts.length === 0) return
  const families = googleFonts.map(name => `family=${name.replace(/ /g, '+')}:wght@400;700`).join('&')
  const url = `https://fonts.googleapis.com/css2?${families}&display=swap`
  if (!document.querySelector(`link[href="${url}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  label: string
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Load all fonts when picker opens
  useEffect(() => {
    if (open && !fontsLoaded) {
      loadFonts(FONT_LIST.map(f => f.name))
      setFontsLoaded(true)
    }
  }, [open, fontsLoaded])

  // Click outside to close
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  // Filter by search
  const filtered = FONT_LIST.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category (only if not searching)
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    fonts: filtered.filter(f => f.category === cat),
  })).filter(g => g.fonts.length > 0)

  const selectedFont = FONT_LIST.find(f => f.name === value)

  return (
    <div className="relative" ref={ref}>
      <label className="label-base">{label}</label>

      {/* Trigger button */}
      <button
        onClick={() => { setOpen(!open); setSearch('') }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
          open
            ? 'border-lilac/60 ring-2 ring-lilac/10 bg-white'
            : 'border-sand bg-white hover:border-lilac/30'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Type className="w-4 h-4 text-mist flex-shrink-0" />
          {value ? (
            <span
              className="text-[17px] text-ink truncate"
              style={{ fontFamily: `'${value}', serif` }}
            >
              {value}
            </span>
          ) : (
            <span className="text-[15px] text-mist/60">Escolha uma fonte…</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {selectedFont && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selectedFont.category === 'Serif' || selectedFont.category === 'Display'
                ? 'bg-amber-50 text-amber-600'
                : selectedFont.category === 'Mono'
                  ? 'bg-sky-soft text-sky-DEFAULT'
                  : 'bg-beige text-mist'
            }`}>
              {selectedFont.category}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-mist transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-sand rounded-2xl shadow-xl shadow-ink/10 z-50 overflow-hidden">
          {/* Search */}
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

          {/* Font list */}
          <div className="max-h-72 overflow-y-auto py-2">
            {grouped.map(({ cat, fonts }) => (
              <div key={cat}>
                <div className="px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-mist/60 bg-parchment/60">
                  {CATEGORY_LABELS[cat]}
                </div>
                {fonts.map(font => {
                  const active = value === font.name
                  return (
                    <button
                      key={font.name}
                      onClick={() => { onChange(font.name); setOpen(false); setSearch('') }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        active ? 'bg-lilac-soft' : 'hover:bg-parchment'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[18px] leading-none text-ink"
                          style={{ fontFamily: `'${font.name}', ${cat === 'Serif' || cat === 'Display' ? 'serif' : cat === 'Mono' ? 'monospace' : 'sans-serif'}` }}
                        >
                          Aa
                        </span>
                        <span className={`text-[14px] font-semibold ${active ? 'text-lilac' : 'text-ink'}`}>
                          {font.previewText ?? font.name}
                          {!font.googleFonts && (
                            <span className="ml-1.5 text-[11px] font-bold text-amber-500">npm</span>
                          )}
                        </span>
                      </div>
                      {active && <Check className="w-4 h-4 text-lilac flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-[14px] font-semibold text-mist">
                Nenhuma fonte encontrada
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-sand bg-parchment/40">
            <p className="text-[12px] font-semibold text-mist">
              Todas são Google Fonts — carregam automaticamente no projeto gerado
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
