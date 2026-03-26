import type { TestimonialsData, Testimonial } from '../../../types'

interface Props {
  data: TestimonialsData
  onUpdate: (data: Partial<TestimonialsData>) => void
}

const COUNTS = [3, 4, 6] as const

export function TestimonialsForm({ data, onUpdate }: Props) {
  const setCount = (count: 3 | 4 | 6) => {
    let testimonials = [...data.testimonials]
    while (testimonials.length < count) {
      testimonials.push({ quote: '', name: `Customer ${testimonials.length + 1}`, role: '' })
    }
    testimonials = testimonials.slice(0, count)
    onUpdate({ count, testimonials })
  }

  const updateTestimonial = (i: number, field: keyof Testimonial, value: string) => {
    const testimonials = data.testimonials.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    onUpdate({ testimonials })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. What Customers Say"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading</label>
        <input
          className="input-base"
          placeholder="e.g. Trusted by teams worldwide"
          value={data.heading}
          onChange={e => onUpdate({ heading: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Number of Testimonials</label>
        <div className="flex gap-2">
          {COUNTS.map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                data.count === n
                  ? 'border-lilac/50 bg-lilac-soft text-lilac'
                  : 'border-sand text-mist hover:border-slate-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="label-base">Testimonials</label>
        {data.testimonials.slice(0, data.count).map((t, i) => (
          <div key={i} className="p-3 bg-white rounded-lg border border-sand space-y-2">
            <div className="text-[10px] font-semibold text-mist/70 uppercase tracking-wider">{i + 1}</div>
            <div>
              <label className="label-base">Quote</label>
              <textarea
                className="input-base text-xs resize-none"
                rows={2}
                placeholder="What this customer said about your product..."
                value={t.quote}
                onChange={e => updateTestimonial(i, 'quote', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label-base">Name</label>
                <input
                  className="input-base text-xs"
                  placeholder="Jane Smith"
                  value={t.name}
                  onChange={e => updateTestimonial(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Role / Company</label>
                <input
                  className="input-base text-xs"
                  placeholder="CTO at Acme Corp"
                  value={t.role}
                  onChange={e => updateTestimonial(i, 'role', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
