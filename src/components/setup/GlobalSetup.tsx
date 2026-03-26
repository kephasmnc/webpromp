import { useState } from 'react'
import {
  Type, Palette, Sparkles, LayoutGrid, Sliders, Zap, ChevronDown
} from 'lucide-react'
import type { GlobalConfig, Preset, ButtonStyle, AnimationIntensity } from '../../types'

const VIBES = ['dark', 'premium', 'minimal', 'vibrant', 'elegant', 'bold', 'playful', 'modern', 'corporate', 'futuristic', 'glassmorphic', 'editorial']

const PRESETS: { id: Preset; label: string; desc: string; colors: string[] }[] = [
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
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-beige/60 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-mist">
          <span className="text-mist/70">{icon}</span>
          <span className="text-xs font-800 uppercase tracking-widest">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-mist/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

interface Props {
  global: GlobalConfig
  updateGlobal: (u: Partial<GlobalConfig>) => void
  applyPreset: (p: Preset) => void
}

export function GlobalSetup({ global: g, updateGlobal, applyPreset }: Props) {
  const toggleVibe = (vibe: string) => {
    const current = g.vibes
    if (current.includes(vibe)) {
      if (current.length > 1) updateGlobal({ vibes: current.filter(v => v !== vibe) })
    } else if (current.length < 4) {
      updateGlobal({ vibes: [...current, vibe] })
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
        <p className="text-sm text-mist font-medium leading-relaxed">
          Global settings apply to the entire generated landing page prompt.
        </p>
      </div>

      {/* Brand Identity */}
      <CollapsibleSection title="Brand" icon={<Type className="w-4 h-4" />}>
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
      <CollapsibleSection title="Vibe" icon={<Sparkles className="w-4 h-4" />}>
        <p className="text-sm text-mist font-medium -mt-1">Select 2–4 adjectives that define the feel</p>
        <div className="flex flex-wrap gap-2">
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
      <CollapsibleSection title="Preset" icon={<LayoutGrid className="w-4 h-4" />}>
        <p className="text-sm text-mist font-medium -mt-1">Pre-fills all design tokens. Fully editable after.</p>
        <div className="space-y-2.5">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 ${
                g.preset === p.id
                  ? 'border-lilac/50 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-sand hover:bg-beige/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${g.preset === p.id ? 'text-lilac' : 'text-ink'}`}>
                  {p.label}
                </span>
                <div className="flex gap-1.5">
                  {p.colors.map((c, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <p className={`text-xs font-medium mt-0.5 ${g.preset === p.id ? 'text-lilac/70' : 'text-mist'}`}>{p.desc}</p>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography" icon={<Type className="w-4 h-4" />} defaultOpen={false}>
        <div>
          <label className="label-base">Display Font (headings)</label>
          <input
            className="input-base font-mono"
            placeholder="e.g. Gilda Display"
            value={g.displayFont}
            onChange={e => updateGlobal({ displayFont: e.target.value })}
          />
        </div>
        <div>
          <label className="label-base">Body Font</label>
          <input
            className="input-base font-mono"
            placeholder="e.g. Geist, Inter"
            value={g.bodyFont}
            onChange={e => updateGlobal({ bodyFont: e.target.value })}
          />
        </div>
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection title="Colors" icon={<Palette className="w-4 h-4" />} defaultOpen={false}>
        <p className="text-sm text-mist font-medium -mt-1">HSL values — e.g. <code className="text-lilac font-mono font-bold">220 70% 78%</code></p>
        <div className="space-y-3">
          {colorTokens.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <div
                className="color-swatch shadow-sm"
                style={{ background: `hsl(${g.colors[key]})` }}
              />
              <div className="flex-1">
                <label className="label-base">{label}</label>
                <input
                  className="input-base font-mono text-sm"
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
      <CollapsibleSection title="Button Style" icon={<Sliders className="w-4 h-4" />} defaultOpen={false}>
        <div className="grid grid-cols-3 gap-2.5">
          {([
            { id: 'sharp',   label: 'Sharp',   preview: 'rounded-none' },
            { id: 'rounded', label: 'Rounded', preview: 'rounded-md' },
            { id: 'pill',    label: 'Pill',    preview: 'rounded-full' },
          ] as { id: ButtonStyle; label: string; preview: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ buttonStyle: opt.id })}
              className={`flex flex-col items-center gap-2.5 p-3.5 border-2 rounded-xl transition-all duration-150 ${
                g.buttonStyle === opt.id
                  ? 'border-lilac/50 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/20 hover:bg-beige/50'
              }`}
            >
              <div className={`h-5 w-14 border-2 ${g.buttonStyle === opt.id ? 'border-lilac' : 'border-mist/40'} ${opt.preview}`} />
              <span className={`text-xs font-bold ${g.buttonStyle === opt.id ? 'text-lilac' : 'text-mist'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Animation */}
      <CollapsibleSection title="Animation" icon={<Zap className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-2">
          {([
            { id: 'none',     label: 'None',     desc: 'Static layout, no motion' },
            { id: 'subtle',   label: 'Subtle',   desc: 'Gentle fade-ups, ease [0.25,1,0.5,1]' },
            { id: 'dramatic', label: 'Dramatic', desc: 'Strong reveals, ease [0.76,0,0.24,1]' },
          ] as { id: AnimationIntensity; label: string; desc: string }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => updateGlobal({ animationIntensity: opt.id })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                g.animationIntensity === opt.id
                  ? 'border-lilac/50 bg-lilac-soft'
                  : 'border-sand bg-white hover:border-lilac/20 hover:bg-beige/50'
              }`}
            >
              <span className={`text-sm font-bold ${g.animationIntensity === opt.id ? 'text-lilac' : 'text-ink'}`}>
                {opt.label}
              </span>
              <span className="text-xs font-medium text-mist max-w-[150px] text-right leading-snug">{opt.desc}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Bottom padding */}
      <div className="h-6" />
    </div>
  )
}
