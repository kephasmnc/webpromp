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

type TokenType = 'section' | 'label' | 'value' | 'separator' | 'comment' | 'plain'

function tokenizeLine(line: string): { type: TokenType; text: string }[] {
  if (/^[═─]{3,}/.test(line)) return [{ type: 'separator', text: line }]
  if (/^[A-Z][A-Z\s\/\-0-9]+$/.test(line.trim()) && line.trim().length > 2) return [{ type: 'section', text: line }]
  if (line.trim().startsWith('//')) return [{ type: 'comment', text: line }]
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
  return (
    <div className="font-mono text-[13.5px] leading-[1.8] whitespace-pre-wrap break-words">
      {text.split('\n').map((line, i) => (
        <div key={i}>
          {tokenizeLine(line).map((token, j) => {
            const cls =
              token.type === 'section'   ? 'text-lilac font-extrabold' :
              token.type === 'separator' ? 'text-sand' :
              token.type === 'comment'   ? 'text-mist italic' :
              token.type === 'label'     ? 'text-sky-DEFAULT font-bold' :
              'text-ink/90'
            return <span key={j} className={cls}>{token.text}</span>
          })}
        </div>
      ))}
    </div>
  )
}

export function PromptPanel({ state }: Props) {
  const [copied, setCopied] = useState(false)
  const debouncedState = useDebounce(state, 300)
  const prompt  = useMemo(() => generatePrompt(debouncedState), [debouncedState])
  const tokens  = useMemo(() => estimateTokens(prompt), [prompt])

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(prompt) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-5 border-b-2 border-sand bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lilac-soft border-2 border-lilac/30 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-lilac" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-ink">Generated Prompt</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[13px] font-bold text-emerald-700">Live update</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[15px] font-bold transition-all duration-200 ${
              copied
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-lilac text-white border-2 border-lilac hover:bg-lilac-dim shadow-md shadow-lilac/25'
            }`}
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        <div className="flex items-center gap-2.5 text-[13px] font-bold text-mist bg-beige rounded-xl px-4 py-2.5">
          <Hash className="w-4 h-4" />
          <span>~{tokens.toLocaleString()} tokens</span>
          <span className="text-sand mx-1">·</span>
          <span>{state.blocks.filter(b => b.enabled).length} active sections</span>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="flex-1 overflow-y-auto scrollable bg-white">
        <div className="p-5">
          {state.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-lilac-soft border-2 border-lilac/25 flex items-center justify-center mb-4">
                <Code2 className="w-7 h-7 text-lilac" />
              </div>
              <p className="text-lg font-extrabold text-ink/40">No sections yet</p>
              <p className="text-[14px] font-semibold text-mist mt-2">Add sections to generate your prompt</p>
            </div>
          ) : (
            <HighlightedPrompt text={prompt} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-3 border-t-2 border-sand bg-white">
        <p className="text-[13px] font-bold text-mist text-center">
          Optimized for Google Stitch · Updates live as you type
        </p>
      </div>
    </div>
  )
}
