import type { CTAData } from '../../../types'

interface Props {
  data: CTAData
  onUpdate: (data: Partial<CTAData>) => void
}

export function CTAForm({ data, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag / Pill Badge</label>
        <input
          className="input-base"
          placeholder="e.g. Get Started Today"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading Line 1</label>
        <input
          className="input-base"
          placeholder="e.g. Ready to transform"
          value={data.heading1}
          onChange={e => onUpdate({ heading1: e.target.value })}
        />
      </div>
      <div>
        <label className="label-base">Heading Line 2 <span className="text-mist/50 font-normal">(accent)</span></label>
        <input
          className="input-base"
          placeholder="e.g. your business?"
          value={data.heading2}
          onChange={e => onUpdate({ heading2: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Description</label>
        <textarea
          className="input-base resize-none"
          rows={2}
          placeholder="Closing argument for your product..."
          value={data.description}
          onChange={e => onUpdate({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base">CTA Primary</label>
          <input
            className="input-base"
            placeholder="e.g. Start Free Trial"
            value={data.ctaPrimary}
            onChange={e => onUpdate({ ctaPrimary: e.target.value })}
          />
        </div>
        <div>
          <label className="label-base">CTA Secondary <span className="text-mist/50 font-normal">(opt)</span></label>
          <input
            className="input-base"
            placeholder="e.g. Talk to Sales"
            value={data.ctaSecondary ?? ''}
            onChange={e => onUpdate({ ctaSecondary: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label-base">Background</label>
        <div className="flex gap-2 mb-2">
          {(['none', 'image', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => onUpdate({ bgType: t })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.bgType === t
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {data.bgType !== 'none' && (
          <input
            className="input-base text-xs font-mono"
            placeholder={data.bgType === 'image' ? 'https://example.com/bg.jpg' : 'https://example.com/bg.mp4'}
            value={data.bgUrl ?? ''}
            onChange={e => onUpdate({ bgUrl: e.target.value })}
          />
        )}
      </div>
    </div>
  )
}
