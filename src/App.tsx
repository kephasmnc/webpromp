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
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b-2 border-sand bg-white z-10 shadow-sm shadow-sand/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lilac-soft border-2 border-lilac/25 flex items-center justify-center">
            <Layers className="w-5 h-5 text-lilac" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-ink tracking-tight">WebPromp</span>
            <span className="text-[14px] text-mist font-semibold ml-2.5">Landing Page Prompt Generator</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold text-mist bg-beige px-4 py-1.5 rounded-full">
            {store.state.blocks.length} section{store.state.blocks.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2 text-[13px] font-bold text-emerald-700 bg-emerald-50 border-2 border-emerald-200 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Global Setup */}
        <aside className="w-[330px] flex-shrink-0 border-r-2 border-sand bg-parchment scrollable">
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
        <aside className="w-[460px] flex-shrink-0 border-l-2 border-sand bg-parchment">
          <PromptPanel state={store.state} />
        </aside>
      </div>
    </div>
  )
}
