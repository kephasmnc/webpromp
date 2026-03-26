import { Layers } from 'lucide-react'
import { useStore } from './store/useStore'
import { GlobalSetup } from './components/setup/GlobalSetup'
import { SectionsBuilder } from './components/blocks/SectionsBuilder'
import { PromptPanel } from './components/PromptPanel'

export default function App() {
  const store = useStore()

  return (
    <div className="flex flex-col h-screen bg-cream overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-sand bg-white z-10 shadow-sm shadow-sand/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lilac-soft border border-lilac/25 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-lilac" />
          </div>
          <div>
            <span className="text-base font-800 text-ink tracking-tight">WebPromp</span>
            <span className="text-sm text-mist font-medium ml-2">Landing Page Prompt Generator</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-mist bg-beige px-3 py-1 rounded-full">
            {store.state.blocks.length} section{store.state.blocks.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Global Setup */}
        <aside className="w-[320px] flex-shrink-0 border-r border-sand bg-parchment scrollable">
          <GlobalSetup
            global={store.state.global}
            updateGlobal={store.updateGlobal}
            applyPreset={store.applyPreset}
          />
        </aside>

        {/* Center: Sections Builder */}
        <main className="flex-1 min-w-0 scrollable bg-cream">
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
        <aside className="w-[440px] flex-shrink-0 border-l border-sand bg-parchment">
          <PromptPanel state={store.state} />
        </aside>
      </div>
    </div>
  )
}
