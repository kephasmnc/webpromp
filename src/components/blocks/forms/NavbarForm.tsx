import { Plus, X } from 'lucide-react'
import type { NavbarData } from '../../../types'

interface Props {
  data: NavbarData
  onUpdate: (data: Partial<NavbarData>) => void
}

export function NavbarForm({ data, onUpdate }: Props) {
  const addLink = () => {
    onUpdate({ links: [...data.links, { label: 'Link' }] })
  }

  const updateLink = (i: number, label: string) => {
    const links = [...data.links]
    links[i] = { ...links[i], label }
    onUpdate({ links })
  }

  const removeLink = (i: number) => {
    onUpdate({ links: data.links.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base">Logo Position</label>
          <div className="flex gap-2">
            {(['left', 'center'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => onUpdate({ logoPosition: pos })}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  data.logoPosition === pos
                    ? 'border-lilac/50 bg-lilac-soft text-lilac'
                    : 'border-sand text-mist hover:border-slate-600'
                }`}
              >
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-base">Sticky</label>
          <div className="flex gap-2">
            {[true, false].map(val => (
              <button
                key={String(val)}
                onClick={() => onUpdate({ sticky: val })}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  data.sticky === val
                    ? 'border-lilac/50 bg-lilac-soft text-lilac'
                    : 'border-sand text-mist hover:border-slate-600'
                }`}
              >
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label-base">CTA Button Label</label>
        <input
          className="input-base"
          placeholder="e.g. Get Started"
          value={data.ctaLabel}
          onChange={e => onUpdate({ ctaLabel: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">CTA Style</label>
        <div className="flex gap-2">
          {(['gradient', 'solid', 'outline'] as const).map(s => (
            <button
              key={s}
              onClick={() => onUpdate({ ctaStyle: s })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.ctaStyle === s
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label-base mb-0">Nav Links</label>
          <button onClick={addLink} className="text-xs text-lilac hover:text-lilac flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-1.5">
          {data.links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-base text-xs"
                placeholder="Link label"
                value={link.label}
                onChange={e => updateLink(i, e.target.value)}
              />
              <button
                onClick={() => removeLink(i)}
                className="p-2 text-mist/70 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-sand transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
