import { useState } from 'react';
import { useStore } from '../store';
import type { Conversation } from '../types';
  import NovaLogo from './NovaLogo';

  function groupConversations(convs: Conversation[]) {
    const now = Date.now();
  const day = 86400000;
  const groups: { label: string; items: Conversation[] }[] = [
  { label: 'Today', items: [] },
  { label: 'Yesterday', items: [] },
  { label: 'Previous 7 Days', items: [] },
  { label: 'Older', items: [] },
    ];
  convs.forEach((c) => {
        const diff = now - c.updatedAt;
        if (diff < day) groups[0].items.push(c);
    else if (diff < 2 * day) groups[1].items.push(c);
    else if (diff < 7 * day) groups[2].items.push(c);
    else groups[3].items.push(c);
  });
  return groups.filter((g) => g.items.length > 0);
  }

export default function Sidebar() {
    const { conversations, activeConversationId, setActiveConversation, createConversation, deleteConversation } = useStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const groups = groupConversations(conversations);

  return (
        <div className="flex flex-col h-full w-[260px] bg-[#171717] border-r border-[#2a2a2a]">
    {/* Header */}
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <NovaLogo size={24} />
              <span className="font-semibold text-[#ececec] text-lg tracking-tight">Nova</span>
            </div>
            <button
              onClick={createConversation}
              className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-[#8e8ea0] hover:text-[#ececec] transition-colors"
              title="New chat (Cmd+K)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

    {/* New Chat Button */}
          <div className="px-2 pb-2">
            <button
              onClick={createConversation}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2a2a2a] text-[#ececec] text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New chat
        </button>
          </div>

    {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-2">
{groups.length === 0 ? (
          <p className="text-[#8e8ea0] text-xs px-2 py-4">No conversations yet</p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-[#8e8ea0] text-xs font-medium px-2 mb-1">{group.label}</p>
{group.items.map((conv) => (
                <div
                  key={conv.id}
                  className={`group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    conv.id === activeConversationId
                      ? 'bg-[#2a2a2a] text-[#ececec]'
                      : 'text-[#8e8ea0] hover:bg-[#1f1f1f] hover:text-[#ececec]'
}`}
                  onClick={() => setActiveConversation(conv.id)}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span className="flex-1 truncate">{conv.title}</span>
{hoveredId === conv.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                      className="flex-shrink-0 p-1 rounded hover:bg-[#3a3a3a] text-[#8e8ea0] hover:text-red-400 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>

            {/* Footer */}
                  <div className="px-2 pb-4 pt-2 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1f1f1f] cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0066ff] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        U
                      </div>
                      <span className="text-[#ececec] text-sm flex-1 truncate">User</span>
                      <button className="text-[#8e8ea0] hover:text-[#ececec] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
}
