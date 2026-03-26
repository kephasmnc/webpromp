import { useState } from 'react'
import {
  Palette, Sparkles, LayoutGrid, Sliders, Zap, ChevronDown, Type, Layers
} from 'lucide-react'
import type { GlobalConfig, Preset, ButtonStyle, AnimationIntensity, LayoutStyle } from '../../types'
import { FontPicker } from './FontPicker'

// ─── Layer 1: Tone (mutually exclusive — sets the background mood) ────────────
const TONE_VIBES: { id: string; label: string; desc: string; bg: string; dot: string; activeBorder: string; activeText: string }[] = [
  {
    id: 'dark',
    label: 'Dark',
    desc: 'Black / near-black',
    bg: 'bg-[#111010]',
    dot: 'bg-white',
    activeBorder: 'border-zinc-600',
    activeText: 'text-zinc-200',
  },
  {
    id: 'light',
    label: 'Light',
    desc: 'White / warm cream',
    bg: 'bg-[#F5F2EB]',
    dot: 'bg-[#1a1816]',
    activeBorder: 'border-amber-400',
    activeText: 'text-amber-700',
  },
  {
    id: 'colorful',
    label: 'Colorful',
    desc: 'Saturated palette',
    bg: 'bg-gradient-to-br from-violet-400 via-pink-400 to-orange-400',
    dot: 'bg-white',
    activeBorder: 'border-violet-500',
    activeText: 'text-violet-700',
  },
  {
    id: 'charged',
    label: 'Charged',
    desc: 'Neutral + electric accent',
    bg: 'bg-[#E8E4DC]',
    dot: 'bg-[#FF2D87]',
    activeBorder: 'border-pink-400',
    activeText: 'text-pink-700',
  },
]

const TONE_IDS = TONE_VIBES.map(t => t.id)

// ─── Layer 2: Personality (up to 2, stack with tone) ─────────────────────────
const STYLE_VIBES = [
  'minimal', 'premium', 'elegant', 'bold', 'playful',
  'modern', 'corporate', 'futuristic', 'glassmorphic', 'editorial',
]

const PRESETS: { id: Preset; label: string; desc: string; colors: string[] }[] = [
  { id: 'none',            label: 'Nenhum / Custom',  desc: 'Usa somente Vibe + Cores manuais',        colors: [] },
  { id: 'dark-minimal',    label: 'Dark Minimal',    desc: 'Pure black, Geist + Gilda Display',        colors: ['#000', '#fff', '#8ba8e0'] },
  { id: 'liquid-glass',    label: 'Liquid Glass',    desc: 'Purple-black, glassmorphic, green accent',  colors: ['#07030f', '#f0ede8', '#6dfc76'] },
  { id: 'light-corporate', label: 'Light Corporate', desc: 'White bg, Instrument Serif + Inter',        colors: ['#fff', '#202a35', '#6366f1'] },
]

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-sand">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-beige/50 transition-colors"
      >
        <div className="flex items-center gap-3 text-mist">
          <span className="text-mist">{icon}</span>
          <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-mist transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-6 space-y-4">{children}</div>}
    </div>
  )
}

interface Props {
  global: GlobalConfig
  updateGlobal: (u: Partial<GlobalConfig>) => void
  applyPreset: (p: Preset) => void
}

export function GlobalSetup({ global: g, updateGlobal, applyPreset }: Props) {
  // Derive current tone and styles from the flat vibes array
  const currentTone = g.vibes.find(v => TONE_IDS.includes(v)) ?? 'dark'
  const currentStyles = g.vibes.filter(v => STYLE_VIBES.includes(v))

  const selectTone = (toneId: string) => {
    // Only update vibes — colors are controlled by the Colors section
    const styles = g.vibes.filter(v => STYLE_VIBES.includes(v))
    updateGlobal({ vibes: [toneId, ...styles] })
  }

  const toggleStyle = (style: string) => {
    const styles = g.vibes.filter(v => STYLE_VIBES.includes(v))
    const tone = g.vibes.find(v => TONE_IDS.includes(v)) ?? 'dark'

    if (styles.includes(style)) {
      // Remove it
      updateGlobal({ vibes: [tone, ...styles.filter(s => s !== style)] })
    } else if (styles.length >= 2) {
      // Swap oldest (first) out, add new at end
      updateGlobal({ vibes: [tone, styles[1], style] })
    } else {
      // Add it
      updateGlobal({ vibes: [tone, ...styles, style] })
    }
  }

  const colorTokens: { key: keyof GlobalConfig['colors']; label: string }[] = [
    { key: 'background', label: 'Background' },
    { key: 'foreground', label: 'Foreground' },
    { key: 'primary',    label: 'Primary / Accent' },
    { key: 'card',       label: 'Card Surface' },
    { key: 'muted',      label: 'Muted' },
  ]

  return (
    <div className="flex flex-col">
      {/* Subtitle */}
      <div className="px-5 py-4 border-b border-sand">
        <p className="text-[14px] text-mist font-semibold leading-relaxed">
          Global settings apply to the entire generated landing page prompt.
        </p>
      </div>

      {/* Brand Identity */}
      <CollapsibleSection title="Brand" icon={<Type className="w-4.5 h-4.5" />}>
        <div>
          <label className="label-base">Site Name</label>
          <input
            className="input-base"
            placeholder="e.g. EVR, APEX, Nexora"
            value={g.brandName}
            onChange={e => updateGlobal({ brandName: e.target.value })}
          />
        </div>
        <div>
          <label className="label-base">Tagline</label>
          <input
            className="input-base"
            placeholder="e.g. Revenue acceleration platform"
            value={g.tagline}
            onChange={e => updateGlobal({ tagline: e.target.value })}
          />
        </div>
      </CollapsibleSection>

      {/* Vibe — 2-layer system */}
      <CollapsibleSection title="Vibe" icon={<Sparkles className="w-4.5 h-4.5" />}>

        {/* Layer 1: Tone */}
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mist mb-3">
            Layer 1 — Background Tone <span className="text-sand ml-1">pick one</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {TONE_VIBES.map(tone => {
              const active = currentTone === tone.id
              return (
                <button
                  key={tone.id}
                  onClick={() => selectTone(tone.id)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all duration-150 ${
                    active
                      ? `${tone.activeBorder} bg-white shadow-sm`
                      : 'border-sand bg-white hover:border-sand hover:bg-beige/40'
                  }`}
                >
                  {/* Mini swatch */}
                  <div className={`relative w-9 h-9 rounded-lg flex-shrink-0 ${tone.bg} border border-black/[0.08]`}>
                    <span className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full ${tone.dot} border border-black/10`} />
                  </div>
                  <div>
                    <div className={`text-[14px] font-extrabold leading-tight ${active ? tone.activeText : 'text-ink'}`}>
                      {tone.label}
                    </div>
                    <div className="text-[12px] font-semibold text-mist leading-tight mt-0.5">
                      {tone.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Layer 2: Personality */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mist">
              Layer 2 — Personality <span className="text-sand ml-1">up to 2</span>
            </p>
            <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${
              currentStyles.length >= 2 ? 'bg-lilac text-white' : 'bg-beige text-mist'
            }`}>
              {currentStyles.length}/2
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STYLE_VIBES.map(style => {
              const active = currentStyles.includes(style)
              const maxed = !active && currentStyles.length >= 2
              return (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  disabled={maxed}
                  className={`px-4 py-2 rounded-full text-[14px] font-bold border transition-all duration-150 ${
                    active
                      ? 'bg-lilac text-white border-lilac shadow-sm shadow-lilac/20'
                      : maxed
                        ? 'border-sand text-sand bg-white cursor-not-allowed'
                        : 'border-sand text-mist bg-white hover:border-lilac/50 hover:text-lilac hover:bg-lilac-soft'
                  }`}
                >
                  {style}
                </button>
              )
            })}
          </div>
          {currentStyles.length >= 2 && (
            <p className="text-[12px] font-semibold text-mist mt-2.5">
              Max 2 selected. Click an active tag to swap it out.
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* Style Presets */}
      <CollapsibleSection title="Preset" icon={<LayoutGrid className="w-4.5 h-4.5" />}>
        <p className="text-[14px] text-mist font-semibold">Pre-fills all design tokens. Fully editable after.</p>
        <div className="space-y-3">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                g.preset === p.id
                  ? 'border-lilac/60 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/30 hover:bg-beige/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[15px] font-bold ${g.preset === p.id ? 'text-lilac' : 'text-ink'}`}>
                  {p.label}
                </span>
                <div className="flex gap-1.5">
                  {p.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <p className={`text-[13px] font-semibold mt-1 ${g.preset === p.id ? 'text-lilac/80' : 'text-mist'}`}>{p.desc}</p>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography" icon={<Type className="w-4.5 h-4.5" />} defaultOpen={false}>
        <FontPicker
          label="Display Font (títulos / headings)"
          value={g.displayFont}
          onChange={font => updateGlobal({ displayFont: font })}
        />
        <FontPicker
          label="Body Font (corpo do texto)"
          value={g.bodyFont}
          onChange={font => updateGlobal({ bodyFont: font })}
        />
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection title="Colors" icon={<Palette className="w-4.5 h-4.5" />} defaultOpen={false}>
        <p className="text-[13px] text-mist font-semibold">Cores em hex. Estas têm prioridade sobre o tom do Vibe.</p>
        <div className="space-y-3">
          {colorTokens.map(({ key, label }) => {
            const val = g.colors[key]
            const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(val)
            return (
              <div key={key} className="flex items-center gap-3">
                {/* Native color picker */}
                <label className="relative flex-shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={isValidHex ? val : '#888888'}
                    onChange={e => updateGlobal({ colors: { ...g.colors, [key]: e.target.value } })}
                    className="sr-only"
                  />
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-sand shadow-sm hover:border-lilac/40 transition-colors"
                    style={{ background: isValidHex ? val : '#888888' }}
                  />
                </label>
                {/* Hex text input */}
                <div className="flex-1">
                  <label className="label-base">{label}</label>
                  <input
                    className="input-base font-mono text-[13px]"
                    placeholder="#FFFFFF"
                    value={val}
                    maxLength={7}
                    onChange={e => {
                      const v = e.target.value
                      if (/^#?[0-9A-Fa-f]{0,6}$/.test(v)) {
                        updateGlobal({ colors: { ...g.colors, [key]: v.startsWith('#') ? v : `#${v}` } })
                      }
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Layout Style */}
      <CollapsibleSection title="Composição" icon={<Layers className="w-4.5 h-4.5" />} defaultOpen={false}>
        <p className="text-[13px] text-mist font-semibold">Define a linguagem compositiva de todos os layouts.</p>
        <div className="space-y-2.5">
          {([
            { id: 'classic',    label: 'Classic',      desc: 'Padrões web comprovados — grid limpo, hierarquia clara' },
            { id: 'asymmetric', label: 'Asymmetric',   desc: 'Ritmo quebrado, columns desiguais, sobreposições' },
            { id: 'editorial',  label: 'Editorial',    desc: 'Tipografia como elemento gráfico, estilo magazine' },
            { id: 'immersive',  label: 'Immersive',    desc: 'Full-bleed, cinematográfico, sem molduras visíveis' },
          ] as { id: LayoutStyle; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ layoutStyle: opt.id })}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                g.layoutStyle === opt.id
                  ? 'border-lilac/60 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/25 hover:bg-beige/40'
              }`}
            >
              <span className={`text-[15px] font-bold ${g.layoutStyle === opt.id ? 'text-lilac' : 'text-ink'}`}>
                {opt.label}
              </span>
              <span className={`text-[13px] font-semibold text-right max-w-[55%] ${g.layoutStyle === opt.id ? 'text-lilac/80' : 'text-mist'}`}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Button Style */}
      <CollapsibleSection title="Button Style" icon={<Sliders className="w-4.5 h-4.5" />} defaultOpen={false}>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'sharp',   label: 'Sharp',   preview: 'rounded-none' },
            { id: 'rounded', label: 'Rounded', preview: 'rounded-md' },
            { id: 'pill',    label: 'Pill',    preview: 'rounded-full' },
          ] as { id: ButtonStyle; label: string; preview: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ buttonStyle: opt.id })}
              className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all duration-150 ${
                g.buttonStyle === opt.id
                  ? 'border-lilac/60 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/25 hover:bg-beige/40'
              }`}
            >
              <div className={`h-5 w-14 border ${g.buttonStyle === opt.id ? 'border-lilac' : 'border-mist/50'} ${opt.preview}`} />
              <span className={`text-[13px] font-bold ${g.buttonStyle === opt.id ? 'text-lilac' : 'text-mist'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Animation */}
      <CollapsibleSection title="Animation" icon={<Zap className="w-4.5 h-4.5" />} defaultOpen={false}>
        <div className="space-y-2.5">
          {([
            { id: 'none',     label: 'None',     desc: 'Static layout, no motion' },
            { id: 'subtle',   label: 'Subtle',   desc: 'Gentle fade-ups' },
            { id: 'dramatic', label: 'Dramatic', desc: 'Strong reveals' },
          ] as { id: AnimationIntensity; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ animationIntensity: opt.id })}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                g.animationIntensity === opt.id
                  ? 'border-lilac/60 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/25 hover:bg-beige/40'
              }`}
            >
              <span className={`text-[15px] font-bold ${g.animationIntensity === opt.id ? 'text-lilac' : 'text-ink'}`}>
                {opt.label}
              </span>
              <span className={`text-[13px] font-semibold ${g.animationIntensity === opt.id ? 'text-lilac/80' : 'text-mist'}`}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <div className="h-8" />
    </div>
  )
}
