import { Plus, X } from 'lucide-react'
import type { ChessData } from '../../../types'

interface Props {
  data: ChessData
  onUpdate: (data: Partial<ChessData>) => void
}

export function ChessForm({ data, onUpdate }: Props) {
  const addStat = () => {
    if (data.stats.length < 2) {
      onUpdate({ stats: [...data.stats, { value: '', label: '' }] })
    }
  }

  const updateStat = (i: number, field: 'value' | 'label', val: string) => {
    const stats = data.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    onUpdate({ stats })
  }

  const removeStat = (i: number) => {
    onUpdate({ stats: data.stats.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. How It Works"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Layout Direction</label>
        <div className="flex gap-2">
          {(['image-left', 'image-right'] as const).map(d => (
            <button
              key={d}
              onClick={() => onUpdate({ direction: d })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.direction === d
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {d === 'image-left' ? 'Image Left' : 'Image Right'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-base">Media Type</label>
        <div className="flex gap-2 mb-2">
          {(['image', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => onUpdate({ mediaType: t })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.mediaType === t
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="input-base text-xs font-mono"
          placeholder={data.mediaType === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
          value={data.mediaUrl}
          onChange={e => onUpdate({ mediaUrl: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading Line 1</label>
        <input
          className="input-base"
          placeholder="e.g. The intelligence layer"
          value={data.heading1}
          onChange={e => onUpdate({ heading1: e.target.value })}
        />
      </div>
      <div>
        <label className="label-base">Heading Line 2 <span className="text-mist/50 font-normal">(italic serif)</span></label>
        <input
          className="input-base"
          placeholder="e.g. for your entire stack"
          value={data.heading2}
          onChange={e => onUpdate({ heading2: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Description</label>
        <textarea
          className="input-base resize-none"
          rows={2}
          placeholder="Supporting description text..."
          value={data.description}
          onChange={e => onUpdate({ description: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">CTA Label <span className="text-mist/50 font-normal">(optional)</span></label>
        <input
          className="input-base"
          placeholder="e.g. Learn More"
          value={data.ctaLabel ?? ''}
          onChange={e => onUpdate({ ctaLabel: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label-base mb-0">Stats <span className="text-mist/50 font-normal">(max 2)</span></label>
          {data.stats.length < 2 && (
            <button onClick={addStat} className="text-xs text-lilac hover:text-lilac flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input-base text-xs w-24"
                placeholder="97%"
                value={stat.value}
                onChange={e => updateStat(i, 'value', e.target.value)}
              />
              <input
                className="input-base text-xs flex-1"
                placeholder="Client Retention"
                value={stat.label}
                onChange={e => updateStat(i, 'label', e.target.value)}
              />
              <button
                onClick={() => removeStat(i)}
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
