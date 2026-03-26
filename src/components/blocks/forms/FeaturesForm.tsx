import type { FeaturesData, FeatureCard } from '../../../types'

interface Props {
  data: FeaturesData
  onUpdate: (data: Partial<FeaturesData>) => void
}

const CARD_COUNTS = [2, 3, 4] as const

export function FeaturesForm({ data, onUpdate }: Props) {
  const setCardCount = (count: 2 | 3 | 4) => {
    let cards = [...data.cards]
    while (cards.length < count) {
      cards.push({ icon: 'Zap', tag: '', title: `Feature ${cards.length + 1}`, description: '' })
    }
    cards = cards.slice(0, count)
    onUpdate({ cardCount: count, cards })
  }

  const updateCard = (i: number, field: keyof FeatureCard, value: string) => {
    const cards = data.cards.map((c, idx) => idx === i ? { ...c, [field]: value } : c)
    onUpdate({ cards })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. What We Do"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading</label>
        <input
          className="input-base"
          placeholder="e.g. Everything you need to scale"
          value={data.heading}
          onChange={e => onUpdate({ heading: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Subtitle</label>
        <input
          className="input-base"
          placeholder="e.g. One unified platform for your entire growth stack"
          value={data.subtitle}
          onChange={e => onUpdate({ subtitle: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Number of Cards</label>
        <div className="flex gap-2">
          {CARD_COUNTS.map(n => (
            <button
              key={n}
              onClick={() => setCardCount(n)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                data.cardCount === n
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-base">Background</label>
        <div className="flex gap-2 mb-2">
          {(['dark', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => onUpdate({ bgType: t })}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                data.bgType === t
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {t === 'dark' ? 'Dark' : 'Video URL'}
            </button>
          ))}
        </div>
        {data.bgType === 'video' && (
          <input
            className="input-base text-xs font-mono"
            placeholder="https://example.com/bg.mp4"
            value={data.bgUrl ?? ''}
            onChange={e => onUpdate({ bgUrl: e.target.value })}
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="label-base">Cards</label>
        {data.cards.slice(0, data.cardCount).map((card, i) => (
          <div key={i} className="p-3 bg-white rounded-lg border border-sand space-y-2">
            <div className="text-xs font-semibold text-mist/70 uppercase tracking-wider">Card {i + 1}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label-base">Icon (lucide name)</label>
                <input
                  className="input-base text-xs"
                  placeholder="e.g. Zap, Globe, Lock"
                  value={card.icon}
                  onChange={e => updateCard(i, 'icon', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Badge / Tag</label>
                <input
                  className="input-base text-xs"
                  placeholder="e.g. New"
                  value={card.tag}
                  onChange={e => updateCard(i, 'tag', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label-base">Title</label>
              <input
                className="input-base text-xs"
                placeholder="e.g. AI-Powered Analytics"
                value={card.title}
                onChange={e => updateCard(i, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="label-base">Description</label>
              <textarea
                className="input-base text-xs resize-none"
                rows={2}
                placeholder="Brief description of this feature..."
                value={card.description}
                onChange={e => updateCard(i, 'description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label-base">Stat Value <span className="text-mist/50 font-normal">(opt)</span></label>
                <input
                  className="input-base text-xs"
                  placeholder="e.g. 200+"
                  value={card.statValue ?? ''}
                  onChange={e => updateCard(i, 'statValue', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Stat Label <span className="text-mist/50 font-normal">(opt)</span></label>
                <input
                  className="input-base text-xs"
                  placeholder="e.g. Integrations"
                  value={card.statLabel ?? ''}
                  onChange={e => updateCard(i, 'statLabel', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
