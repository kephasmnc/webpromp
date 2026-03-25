import { useState } from 'react'
import {
  Type, Palette, Sparkles, LayoutGrid, Sliders, Zap, ChevronDown
} from 'lucide-react'
import type { GlobalConfig, Preset, ButtonStyle, AnimationIntensity } from '../../types'

const VIBES = ['dark', 'premium', 'minimal', 'vibrant', 'elegant', 'bold', 'playful', 'modern', 'corporate', 'futuristic', 'glassmorphic', 'editorial']

const PRESETS: { id: Preset; label: string; desc: string; colors: string[] }[] = [
  { id: 'dark-minimal', label: 'Dark Minimal', desc: 'Pure black, Geist + Gilda Display', colors: ['#000', '#fff', '#8ba8e0'] },
  { id: 'liquid-glass', label: 'Liquid Glass', desc: 'Purple-black, glassmorphic, green accent', colors: ['#07030f', '#f0ede8', '#6dfc76'] },
  { id: 'light-corporate', label: 'Light Corporate', desc: 'White bg, Instrument Serif + Inter', colors: ['#fff', '#202a35', '#6366f1'] },
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
    <div className="border-b border-[#252836]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-slate-500">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-widest">{title}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

interface Props {
  global: GlobalConfig
  updateGlobal: (u: Partial<GlobalConfig>) => void
  applyPreset: (p: Preset) => void
}

export function GlobalSetup({ global: g, updateGlobal, applyPreset }: Props) {
  const handlePreset = (id: Preset) => {
    applyPreset(id)
  }

  const toggleVibe = (vibe: string) => {
    const current = g.vibes
    if (current.includes(vibe)) {
      if (current.length > 1) updateGlobal({ vibes: current.filter(v => v !== vibe) })
    } else if (current.length < 4) {
      updateGlobal({ vibes: [...current, vibe] })
    }
  }

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map((v, i) => i === 0 ? parseFloat(v) : parseFloat(v) / 100)
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const colorTokens: { key: keyof GlobalConfig['colors']; label: string }[] = [
    { key: 'background', label: 'Background' },
    { key: 'foreground', label: 'Foreground' },
    { key: 'primary', label: 'Primary / Accent' },
    { key: 'card', label: 'Card Surface' },
    { key: 'muted', label: 'Muted' },
  ]

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-[#252836]">
        <p className="text-xs text-slate-500">Global settings apply to the entire landing page</p>
      </div>

      {/* Brand Identity */}
      <CollapsibleSection title="Brand" icon={<Type className="w-3.5 h-3.5" />}>
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

      {/* Vibe Adjectives */}
      <CollapsibleSection title="Vibe" icon={<Sparkles className="w-3.5 h-3.5" />}>
        <p className="text-[11px] text-slate-500 mb-2">Select 2–4 adjectives that define the feel</p>
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map(v => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={`vibe-tag ${g.vibes.includes(v) ? 'active' : 'inactive'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Style Presets */}
      <CollapsibleSection title="Preset" icon={<LayoutGrid className="w-3.5 h-3.5" />}>
        <p className="text-[11px] text-slate-500 mb-2">Pre-fills all design tokens. Fully editable after.</p>
        <div className="space-y-2">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150 ${
                g.preset === p.id
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-[#252836] bg-panel hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${g.preset === p.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {p.label}
                </span>
                <div className="flex gap-1">
                  {p.colors.map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full border border-white/10" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography" icon={<Type className="w-3.5 h-3.5" />} defaultOpen={false}>
        <div>
          <label className="label-base">Display Font (headings)</label>
          <input
            className="input-base font-mono text-xs"
            placeholder="e.g. Gilda Display"
            value={g.displayFont}
            onChange={e => updateGlobal({ displayFont: e.target.value })}
          />
        </div>
        <div>
          <label className="label-base">Body Font</label>
          <input
            className="input-base font-mono text-xs"
            placeholder="e.g. Geist, Inter"
            value={g.bodyFont}
            onChange={e => updateGlobal({ bodyFont: e.target.value })}
          />
        </div>
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection title="Colors" icon={<Palette className="w-3.5 h-3.5" />} defaultOpen={false}>
        <p className="text-[11px] text-slate-500 mb-1">HSL values — e.g. <code className="text-indigo-400">220 70% 78%</code></p>
        <div className="space-y-2">
          {colorTokens.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="color-swatch"
                style={{ background: `hsl(${g.colors[key]})` }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-400">{label}</span>
                </div>
                <input
                  className="input-base text-xs font-mono"
                  placeholder="0 0% 100%"
                  value={g.colors[key]}
                  onChange={e => updateGlobal({ colors: { ...g.colors, [key]: e.target.value } })}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Button Style */}
      <CollapsibleSection title="Button Style" icon={<Sliders className="w-3.5 h-3.5" />} defaultOpen={false}>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: 'sharp', label: 'Sharp', preview: 'rounded-none' },
            { id: 'rounded', label: 'Rounded', preview: 'rounded-md' },
            { id: 'pill', label: 'Pill', preview: 'rounded-full' },
          ] as { id: ButtonStyle; label: string; preview: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ buttonStyle: opt.id })}
              className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-all duration-150 ${
                g.buttonStyle === opt.id
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-[#252836] hover:border-slate-600'
              }`}
            >
              <div className={`h-5 w-14 border-2 ${g.buttonStyle === opt.id ? 'border-indigo-400' : 'border-slate-500'} ${opt.preview}`} />
              <span className={`text-[11px] font-medium ${g.buttonStyle === opt.id ? 'text-indigo-300' : 'text-slate-400'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Animation */}
      <CollapsibleSection title="Animation" icon={<Zap className="w-3.5 h-3.5" />} defaultOpen={false}>
        <div className="space-y-1.5">
          {([
            { id: 'none', label: 'None', desc: 'Static layout, no motion' },
            { id: 'subtle', label: 'Subtle', desc: 'Gentle fade-ups, ease [0.25,1,0.5,1]' },
            { id: 'dramatic', label: 'Dramatic', desc: 'Strong reveals, ease [0.76,0,0.24,1]' },
          ] as { id: AnimationIntensity; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ animationIntensity: opt.id })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-150 ${
                g.animationIntensity === opt.id
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-[#252836] hover:border-slate-600'
              }`}
            >
              <span className={`text-sm font-medium ${g.animationIntensity === opt.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                {opt.label}
              </span>
              <span className="text-[11px] text-slate-500 max-w-[140px] text-right leading-tight">{opt.desc}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  )
}
