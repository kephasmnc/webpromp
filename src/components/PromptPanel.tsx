import { useState, useEffect, useMemo } from 'react'
import { Copy, Check, Code2, Hash } from 'lucide-react'
import type { AppState } from '../types'
import { generatePrompt, estimateTokens } from '../utils/promptGenerator'

interface Props {
  state: AppState
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

type SyntaxToken = { type: 'section' | 'label' | 'value' | 'separator' | 'comment' | 'plain'; text: string }

function tokenizeLine(line: string): SyntaxToken[] {
  if (/^[═─]{3,}/.test(line)) {
    return [{ type: 'separator', text: line }]
  }
  if (/^[A-Z][A-Z\s\/\-0-9]+$/.test(line.trim()) && line.trim().length > 2) {
    return [{ type: 'section', text: line }]
  }
  if (line.trim().startsWith('//')) {
    return [{ type: 'comment', text: line }]
  }
  const colonIdx = line.indexOf(':')
  if (colonIdx > 0 && colonIdx < 40 && !line.trim().startsWith('-')) {
    return [
      { type: 'label', text: line.slice(0, colonIdx + 1) },
      { type: 'value', text: line.slice(colonIdx + 1) },
    ]
  }
  if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
    return [
      { type: 'label', text: line.slice(0, line.indexOf(' ') + 1) },
      { type: 'value', text: line.slice(line.indexOf(' ') + 1) },
    ]
  }
  return [{ type: 'plain', text: line }]
}

function HighlightedPrompt({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="font-mono text-[13px] leading-[1.65] whitespace-pre-wrap break-words">
      {lines.map((line, i) => {
        const tokens = tokenizeLine(line)
        return (
          <div key={i}>
            {tokens.map((token, j) => {
              let cls = 'text-ink/80'
              if (token.type === 'section')   cls = 'text-lilac font-bold'
              else if (token.type === 'separator') cls = 'text-sand'
              else if (token.type === 'comment')   cls = 'text-mist italic'
              else if (token.type === 'label')     cls = 'text-sky font-semibold'
              else if (token.type === 'value')     cls = 'text-ink/80'
              return <span key={j} className={cls}>{token.text}</span>
            })}
          </div>
        )
      })}
    </div>
  )
}

export function PromptPanel({ state }: Props) {
  const [copied, setCopied] = useState(false)

  const debouncedState = useDebounce(state, 300)

  const prompt = useMemo(() => generatePrompt(debouncedState), [debouncedState])
  const tokenCount = useMemo(() => estimateTokens(prompt), [prompt])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-sand bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lilac-soft border border-lilac/25 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-lilac" />
            </div>
            <div>
              <h2 className="text-sm font-800 text-ink">Generated Prompt</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-mist">Live update</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              copied
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-lilac text-white border-2 border-lilac hover:bg-lilac-dim shadow-sm shadow-lilac/20'
            }`}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy</>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-mist bg-beige rounded-lg px-3 py-2">
          <Hash className="w-3.5 h-3.5" />
          <span>~{tokenCount.toLocaleString()} tokens</span>
          <span className="text-sand">·</span>
          <span>{state.blocks.filter(b => b.enabled).length} active sections</span>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="flex-1 overflow-y-auto scrollable bg-cream">
        <div className="p-5">
          {state.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-lilac-soft border border-lilac/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-lilac" />
              </div>
              <p className="text-base font-bold text-ink/40">No sections added yet</p>
              <p className="text-sm font-medium text-mist mt-1.5">Add sections to generate your prompt</p>
            </div>
          ) : (
            <HighlightedPrompt text={prompt} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-sand bg-white">
        <p className="text-xs font-semibold text-mist text-center">
          Optimized for Google Stitch · Updates live as you type
        </p>
      </div>
    </div>
  )
}
