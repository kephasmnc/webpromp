import { Plus, X } from 'lucide-react'
import type { MarqueeData } from '../../../types'

interface Props {
  data: MarqueeData
  onUpdate: (data: Partial<MarqueeData>) => void
}

export function MarqueeForm({ data, onUpdate }: Props) {
  const addBrand = () => {
    onUpdate({ brands: [...data.brands, 'Brand Name'] })
  }

  const updateBrand = (i: number, val: string) => {
    const brands = [...data.brands]
    brands[i] = val
    onUpdate({ brands })
  }

  const removeBrand = (i: number) => {
    onUpdate({ brands: data.brands.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Label <span className="text-slate-600 font-normal">(above marquee)</span></label>
        <input
          className="input-base"
          placeholder="e.g. Trusted by leading brands"
          value={data.label}
          onChange={e => onUpdate({ label: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label-base mb-0">Brand / Partner Names</label>
          <button onClick={addBrand} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-1.5">
          {data.brands.map((brand, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-base text-xs"
                placeholder="e.g. Google"
                value={brand}
                onChange={e => updateBrand(i, e.target.value)}
              />
              <button
                onClick={() => removeBrand(i)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-[#252836] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label-base">Speed</label>
        <div className="flex gap-2">
          {(['slow', 'medium', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => onUpdate({ speed: s })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.speed === s
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-[#252836] text-slate-400 hover:border-slate-600'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
