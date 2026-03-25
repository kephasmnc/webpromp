import { Plus, X } from 'lucide-react'
import type { PricingData, PricingPlan } from '../../../types'

interface Props {
  data: PricingData
  onUpdate: (data: Partial<PricingData>) => void
}

const PLAN_COUNTS = [2, 3] as const

export function PricingForm({ data, onUpdate }: Props) {
  const setPlanCount = (count: 2 | 3) => {
    let plans = [...data.plans]
    while (plans.length < count) {
      plans.push({
        name: `Plan ${plans.length + 1}`,
        price: '$0',
        period: '/month',
        features: ['Feature 1', 'Feature 2'],
        ctaLabel: 'Get Started',
        highlighted: false,
      })
    }
    plans = plans.slice(0, count)
    onUpdate({ planCount: count, plans })
  }

  const updatePlan = (i: number, field: keyof PricingPlan, value: any) => {
    const plans = data.plans.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    onUpdate({ plans })
  }

  const addFeature = (planIdx: number) => {
    const plan = data.plans[planIdx]
    updatePlan(planIdx, 'features', [...plan.features, 'New feature'])
  }

  const updateFeature = (planIdx: number, featIdx: number, value: string) => {
    const plan = data.plans[planIdx]
    const features = plan.features.map((f, i) => i === featIdx ? value : f)
    updatePlan(planIdx, 'features', features)
  }

  const removeFeature = (planIdx: number, featIdx: number) => {
    const plan = data.plans[planIdx]
    updatePlan(planIdx, 'features', plan.features.filter((_, i) => i !== featIdx))
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. Pricing"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading</label>
        <input
          className="input-base"
          placeholder="e.g. Simple, transparent pricing"
          value={data.heading}
          onChange={e => onUpdate({ heading: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Number of Plans</label>
        <div className="flex gap-2">
          {PLAN_COUNTS.map(n => (
            <button
              key={n}
              onClick={() => setPlanCount(n)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                data.planCount === n
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-[#252836] text-slate-400 hover:border-slate-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="label-base">Plans</label>
        {data.plans.slice(0, data.planCount).map((plan, i) => (
          <div key={i} className="p-3 bg-surface rounded-lg border border-[#252836] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Plan {i + 1}</span>
              <button
                onClick={() => updatePlan(i, 'highlighted', !plan.highlighted)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                  plan.highlighted
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-[#252836] text-slate-500 hover:border-slate-600'
                }`}
              >
                {plan.highlighted ? '★ Highlighted' : '☆ Highlight'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="label-base">Name</label>
                <input
                  className="input-base text-xs"
                  placeholder="Pro"
                  value={plan.name}
                  onChange={e => updatePlan(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Price</label>
                <input
                  className="input-base text-xs"
                  placeholder="$99"
                  value={plan.price}
                  onChange={e => updatePlan(i, 'price', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Period</label>
                <input
                  className="input-base text-xs"
                  placeholder="/month"
                  value={plan.period}
                  onChange={e => updatePlan(i, 'period', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label-base">CTA Label</label>
              <input
                className="input-base text-xs"
                placeholder="Get Started"
                value={plan.ctaLabel}
                onChange={e => updatePlan(i, 'ctaLabel', e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label-base mb-0">Features</label>
                <button onClick={() => addFeature(i)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-1">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex gap-2">
                    <input
                      className="input-base text-xs"
                      placeholder="Feature description"
                      value={feat}
                      onChange={e => updateFeature(i, j, e.target.value)}
                    />
                    <button
                      onClick={() => removeFeature(i, j)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded border border-[#252836] transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
