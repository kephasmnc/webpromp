import { Plus, X } from 'lucide-react'
import type { FooterData, FooterColumn } from '../../../types'

interface Props {
  data: FooterData
  onUpdate: (data: Partial<FooterData>) => void
}

const COL_COUNTS = [1, 2, 4] as const

export function FooterForm({ data, onUpdate }: Props) {
  const setColumnCount = (count: 1 | 2 | 4) => {
    let columns = [...data.columns]
    while (columns.length < count) {
      columns.push({ heading: `Column ${columns.length + 1}`, links: [{ label: 'Link', url: '#' }] })
    }
    columns = columns.slice(0, count)
    onUpdate({ columnCount: count, columns })
  }

  const updateColumn = (i: number, field: keyof FooterColumn, value: any) => {
    const columns = data.columns.map((col, idx) => idx === i ? { ...col, [field]: value } : col)
    onUpdate({ columns })
  }

  const addLink = (colIdx: number) => {
    const col = data.columns[colIdx]
    updateColumn(colIdx, 'links', [...col.links, { label: 'Link', url: '#' }])
  }

  const updateLink = (colIdx: number, linkIdx: number, field: 'label' | 'url', value: string) => {
    const col = data.columns[colIdx]
    const links = col.links.map((l, i) => i === linkIdx ? { ...l, [field]: value } : l)
    updateColumn(colIdx, 'links', links)
  }

  const removeLink = (colIdx: number, linkIdx: number) => {
    const col = data.columns[colIdx]
    updateColumn(colIdx, 'links', col.links.filter((_, i) => i !== linkIdx))
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="label-base">Logo Text</label>
        <input
          className="input-base"
          placeholder="e.g. APEX"
          value={data.logo}
          onChange={e => onUpdate({ logo: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Copyright Text</label>
        <input
          className="input-base"
          placeholder="e.g. © 2024 Apex Inc. All rights reserved."
          value={data.copyright}
          onChange={e => onUpdate({ copyright: e.target.value })}
        />
      </div>

      <div>
        <label className="label-base">Column Count</label>
        <div className="flex gap-2">
          {COL_COUNTS.map(n => (
            <button
              key={n}
              onClick={() => setColumnCount(n)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                data.columnCount === n
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                  : 'border-[#252836] text-slate-400 hover:border-slate-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="label-base">Columns</label>
        {data.columns.slice(0, data.columnCount).map((col, i) => (
          <div key={i} className="p-3 bg-surface rounded-lg border border-[#252836] space-y-2">
            <div>
              <label className="label-base">Column Heading</label>
              <input
                className="input-base text-xs"
                placeholder="e.g. Product"
                value={col.heading}
                onChange={e => updateColumn(i, 'heading', e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label-base mb-0">Links</label>
                <button onClick={() => addLink(i)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-1">
                {col.links.map((link, j) => (
                  <div key={j} className="flex gap-1.5">
                    <input
                      className="input-base text-xs w-1/2"
                      placeholder="Label"
                      value={link.label}
                      onChange={e => updateLink(i, j, 'label', e.target.value)}
                    />
                    <input
                      className="input-base text-xs flex-1 font-mono"
                      placeholder="/path"
                      value={link.url}
                      onChange={e => updateLink(i, j, 'url', e.target.value)}
                    />
                    <button
                      onClick={() => removeLink(i, j)}
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

      <div>
        <label className="label-base">Bottom Bar Links</label>
        <div className="grid grid-cols-3 gap-2">
          {(['privacy', 'terms', 'contact'] as const).map(key => (
            <div key={key}>
              <label className="label-base capitalize">{key}</label>
              <input
                className="input-base text-xs font-mono"
                placeholder="/privacy"
                value={data.bottomLinks[key]}
                onChange={e => onUpdate({ bottomLinks: { ...data.bottomLinks, [key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
