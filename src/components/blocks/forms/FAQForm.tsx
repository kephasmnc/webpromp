import { Plus, X } from 'lucide-react'
import type { FAQData } from '../../../types'

interface Props {
  data: FAQData
  onUpdate: (data: Partial<FAQData>) => void
}

export function FAQForm({ data, onUpdate }: Props) {
  const addItem = () => {
    onUpdate({ items: [...data.items, { question: '', answer: '' }] })
  }

  const updateItem = (i: number, field: 'question' | 'answer', value: string) => {
    const items = data.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onUpdate({ items })
  }

  const removeItem = (i: number) => {
    onUpdate({ items: data.items.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Section Tag</label>
        <input
          className="input-base"
          placeholder="e.g. FAQ"
          value={data.sectionTag}
          onChange={e => onUpdate({ sectionTag: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Heading</label>
        <input
          className="input-base"
          placeholder="e.g. Frequently asked questions"
          value={data.heading}
          onChange={e => onUpdate({ heading: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label-base mb-0">Questions & Answers</label>
          <button onClick={addItem} className="text-xs text-lilac hover:text-lilac flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Q&A
          </button>
        </div>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={i} className="p-3 bg-white rounded-lg border border-sand space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-mist/70 uppercase tracking-wider">Q{i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="p-1 text-mist/50 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <label className="label-base">Question</label>
                <input
                  className="input-base text-xs"
                  placeholder="e.g. How does pricing work?"
                  value={item.question}
                  onChange={e => updateItem(i, 'question', e.target.value)}
                />
              </div>
              <div>
                <label className="label-base">Answer</label>
                <textarea
                  className="input-base text-xs resize-none"
                  rows={2}
                  placeholder="The answer to this question..."
                  value={item.answer}
                  onChange={e => updateItem(i, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
