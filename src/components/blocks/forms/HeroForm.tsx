import type { HeroData } from '../../../types'

interface Props {
  data: HeroData
  onUpdate: (data: Partial<HeroData>) => void
}

export function HeroForm({ data, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag <span className="text-mist/50 font-normal">(small label above headline)</span></label>
        <input
          className="input-base"
          placeholder="e.g. Evolve Responsible Ventures"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Headline Line 1 <span className="text-mist/50 font-normal">(font-light)</span></label>
        <input
          className="input-base"
          placeholder="e.g. Revenue acceleration"
          value={data.headline1}
          onChange={e => onUpdate({ headline1: e.target.value })}
        />
      </div>
      <div>
        <label className="label-base">Headline Line 2 <span className="text-mist/50 font-normal">(font-light)</span></label>
        <input
          className="input-base"
          placeholder="e.g. built for the"
          value={data.headline2}
          onChange={e => onUpdate({ headline2: e.target.value })}
        />
      </div>
      <div>
        <label className="label-base">Headline Line 3 <span className="text-mist/50 font-normal">(italic serif accent)</span></label>
        <input
          className="input-base"
          placeholder="e.g. modern enterprise"
          value={data.headline3}
          onChange={e => onUpdate({ headline3: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Subtitle / Description</label>
        <textarea
          className="input-base resize-none"
          rows={2}
          placeholder="e.g. The AI-powered platform that unifies your GTM stack..."
          value={data.subtitle}
          onChange={e => onUpdate({ subtitle: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base">CTA Primary</label>
          <input
            className="input-base"
            placeholder="e.g. Get Started"
            value={data.ctaPrimary}
            onChange={e => onUpdate({ ctaPrimary: e.target.value })}
          />
        </div>
        <div>
          <label className="label-base">CTA Secondary <span className="text-mist/50 font-normal">(optional)</span></label>
          <input
            className="input-base"
            placeholder="e.g. Watch Demo"
            value={data.ctaSecondary}
            onChange={e => onUpdate({ ctaSecondary: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="label-base">Layout</label>
        <div className="flex gap-2">
          {(['centered', 'bottom-left', 'bottom-right'] as const).map(l => (
            <button
              key={l}
              onClick={() => onUpdate({ layout: l })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.layout === l
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {l === 'centered' ? 'Centered' : l === 'bottom-left' ? 'Bot. Left' : 'Bot. Right'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-base">Background Media</label>
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
            placeholder={data.bgType === 'image' ? 'https://example.com/hero.jpg' : 'https://example.com/hero.mp4'}
            value={data.bgUrl}
            onChange={e => onUpdate({ bgUrl: e.target.value })}
          />
        )}
      </div>

      <div>
        <label className="label-base">Show Partners Marquee below</label>
        <div className="flex gap-2">
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => onUpdate({ showMarquee: val })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.showMarquee === val
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
  )
}
