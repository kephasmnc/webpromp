import { Layers } from 'lucide-react'
import { useStore } from './store/useStore'
import { GlobalSetup } from './components/setup/GlobalSetup'
import { SectionsBuilder } from './components/blocks/SectionsBuilder'
import { PromptPanel } from './components/PromptPanel'

export default function App() {
  const store = useStore()

  return (
    <div className="flex flex-col h-screen bg-void overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-[#252836] bg-surface z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-slate-100 tracking-tight">WebPromp</span>
          <span className="text-xs text-slate-500 font-mono ml-1">— Landing Page Prompt Generator</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {store.state.blocks.length} section{store.state.blocks.length !== 1 ? 's' : ''}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live preview active" />
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Global Setup */}
        <aside className="w-[300px] flex-shrink-0 border-r border-[#252836] scrollable">
          <GlobalSetup
            global={store.state.global}
            updateGlobal={store.updateGlobal}
            applyPreset={store.applyPreset}
          />
        </aside>

        {/* Center: Sections Builder */}
        <main className="flex-1 min-w-0 scrollable bg-void">
          <SectionsBuilder
            blocks={store.state.blocks}
            addBlock={store.addBlock}
            removeBlock={store.removeBlock}
            toggleBlock={store.toggleBlock}
            moveBlock={store.moveBlock}
            updateBlock={store.updateBlock}
          />
        </main>

        {/* Right: Prompt Panel */}
        <aside className="w-[420px] flex-shrink-0 border-l border-[#252836]">
          <PromptPanel state={store.state} />
        </aside>
      </div>
    </div>
  )
}
