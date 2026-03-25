import { Plus, X } from 'lucide-react'
import type { StatsData } from '../../../types'

interface Props {
  data: StatsData
  onUpdate: (data: Partial<StatsData>) => void
}

export function StatsForm({ data, onUpdate }: Props) {
  const addMetric = () => {
    if (data.metrics.length < 6) {
      onUpdate({ metrics: [...data.metrics, { value: '', label: '', sublabel: '' }] })
    }
  }

  const updateMetric = (i: number, field: string, val: string) => {
    const metrics = data.metrics.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
    onUpdate({ metrics })
  }

  const removeMetric = (i: number) => {
    onUpdate({ metrics: data.metrics.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. By the Numbers"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading Line 1</label>
        <input
          className="input-base"
          placeholder="e.g. The numbers speak"
          value={data.heading1}
          onChange={e => onUpdate({ heading1: e.target.value })}
        />
      </div>
      <div>
        <label className="label-base">Heading Line 2 <span className="text-slate-600 font-normal">(accent)</span></label>
        <input
          className="input-base"
          placeholder="e.g. for themselves"
          value={data.heading2}
          onChange={e => onUpdate({ heading2: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Background Video <span className="text-slate-600 font-normal">(optional)</span></label>
        <input
          className="input-base text-xs font-mono"
          placeholder="https://example.com/bg.mp4"
          value={data.bgVideo ?? ''}
          onChange={e => onUpdate({ bgVideo: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Animated Counting</label>
        <div className="flex gap-2">
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => onUpdate({ animated: val })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.animated === val
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-[#252836] text-slate-400 hover:border-slate-600'
              }`}
            >
              {val ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label-base mb-0">Metrics <span className="text-slate-600 font-normal">(max 6)</span></label>
          {data.metrics.length < 6 && (
            <button onClick={addMetric} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {data.metrics.map((metric, i) => (
            <div key={i} className="p-2.5 bg-surface rounded-lg border border-[#252836] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Metric {i + 1}</span>
                <button
                  onClick={() => removeMetric(i)}
                  className="p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label-base">Value</label>
                  <input
                    className="input-base text-xs"
                    placeholder="200+"
                    value={metric.value}
                    onChange={e => updateMetric(i, 'value', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-base">Label</label>
                  <input
                    className="input-base text-xs"
                    placeholder="Clients"
                    value={metric.label}
                    onChange={e => updateMetric(i, 'label', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-base">Sublabel</label>
                  <input
                    className="input-base text-xs"
                    placeholder="worldwide"
                    value={metric.sublabel ?? ''}
                    onChange={e => updateMetric(i, 'sublabel', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
