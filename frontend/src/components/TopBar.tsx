import { useState } from 'react';
import { useStore } from '../store';
import { MODELS } from '../types';
  import type { ModelId } from '../types';
import NovaLogo from './NovaLogo';

export default function TopBar() {
    const { sidebarOpen, toggleSidebar, currentModel, setCurrentModel } = useStore();
  const [showModelMenu, setShowModelMenu] = useState(false);
  const activeModel = MODELS.find(m => m.id === currentModel)!;

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a2a] h-12 flex-shrink-0">
{/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-[#8e8ea0] hover:text-[#ececec] transition-colors"
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>

{/* Model selector */}
      <div className="relative">
        <button
          onClick={() => setShowModelMenu(!showModelMenu)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#2a2a2a] text-[#ececec] text-sm font-medium transition-colors"
        >
          <NovaLogo size={16} />
          <span>{activeModel.name}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

{showModelMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowModelMenu(false)} />
            <div className="absolute top-full left-0 mt-1 w-60 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl z-20 overflow-hidden py-1">
{MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { setCurrentModel(model.id as ModelId); setShowModelMenu(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[#2a2a2a] transition-colors ${
                    model.id === currentModel ? 'text-[#ececec]' : 'text-[#8e8ea0]'
}`}
                >
                  <div>
                    <div className="font-medium text-left text-[#ececec]">{model.name}</div>
                    <div className="text-xs text-[#8e8ea0] text-left">{model.description}</div>
                  </div>
{model.id === currentModel && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
