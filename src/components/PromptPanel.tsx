import { useState, useEffect, useMemo } from 'react'
import { Copy, Check, RefreshCw, Code2, Hash } from 'lucide-react'
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
  // Section headers: ═══ ... ═══ or ── SECTION N ──
  if (/^[═─]{3,}/.test(line)) {
    return [{ type: 'separator', text: line }]
  }
  // Section title lines: all caps with spaces
  if (/^[A-Z][A-Z\s\/\-0-9]+$/.test(line.trim()) && line.trim().length > 2) {
    return [{ type: 'section', text: line }]
  }
  // Comment lines: // ...
  if (line.trim().startsWith('//')) {
    return [{ type: 'comment', text: line }]
  }
  // Label: value lines
  const colonIdx = line.indexOf(':')
  if (colonIdx > 0 && colonIdx < 40 && !line.trim().startsWith('-')) {
    const label = line.slice(0, colonIdx + 1)
    const value = line.slice(colonIdx + 1)
    return [
      { type: 'label', text: label },
      { type: 'value', text: value },
    ]
  }
  // Bullet lines
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
    <div className="font-mono text-xs leading-5 whitespace-pre-wrap break-words">
      {lines.map((line, i) => {
        const tokens = tokenizeLine(line)
        return (
          <div key={i}>
            {tokens.map((token, j) => {
              let cls = 'text-slate-300'
              if (token.type === 'section') cls = 'text-emerald-400 font-bold'
              else if (token.type === 'separator') cls = 'text-slate-600'
              else if (token.type === 'comment') cls = 'text-slate-500 italic'
              else if (token.type === 'label') cls = 'text-amber-400'
              else if (token.type === 'value') cls = 'text-slate-200'
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
  const [key, setKey] = useState(0)

  const debouncedState = useDebounce(state, 300)

  const prompt = useMemo(() => generatePrompt(debouncedState), [debouncedState])
  const tokenCount = useMemo(() => estimateTokens(prompt), [prompt])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerate = () => {
    setKey(k => k + 1)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#252836] bg-surface">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">Generated Prompt</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live update" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Hash className="w-3 h-3" />
          <span>~{tokenCount.toLocaleString()} tokens</span>
          <span className="text-slate-700">·</span>
          <span>{state.blocks.filter(b => b.enabled).length} active sections</span>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="flex-1 overflow-y-auto scrollable">
        <div className="p-4">
          {state.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-slate-400 text-sm font-medium">No sections added yet</p>
              <p className="text-slate-600 text-xs mt-1">Add sections to generate your prompt</p>
            </div>
          ) : (
            <HighlightedPrompt key={key} text={prompt} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-2.5 border-t border-[#252836] bg-surface">
        <p className="text-[10px] text-slate-600 text-center">
          Optimized for Google Stitch · Updates live as you type
        </p>
      </div>
    </div>
  )
}
