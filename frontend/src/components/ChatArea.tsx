import { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store';
import type { Message } from '../types';
import TopBar from './TopBar';
import EmptyState from './EmptyState';
import MessageItem from './MessageItem';
import InputBar from './InputBar';

export default function ChatArea() {
    const { getActiveConversation, addMessage, appendToLastMessage, setLastMessageError,
               isStreaming, setIsStreaming, updateConversationTitle, currentModel } = useStore();
    const conv = getActiveConversation();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<(() => void) | null>(null);
    const [showScroll, setShowScroll] = useState(false);

  const toBottom = (smooth = true) =>
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });

  useEffect(() => { toBottom(false); }, [conv?.id]);
    useEffect(() => { if (isStreaming) toBottom(); }, [conv?.messages.length, isStreaming]);

  const handleScroll = () => {
        const el = scrollRef.current;
        if (el) setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  const genTitle = async (cid: string, msg: string) => {
        try {
                const r = await fetch('/api/title', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstMessage: msg }) });
                const d = await r.json();
                if (d.title) updateConversationTitle(cid, d.title);
        } catch {}
  };

  const send = async (text: string) => {
        if (!text.trim() || isStreaming) return;
        const { createConversation, setActiveConversation, getActiveConversation: getConv, activeConversationId } = useStore.getState();
        let cid = activeConversationId;
        if (!cid) { cid = createConversation(); setActiveConversation(cid); }
        const userMsg: Message = { id: uuidv4(), role: 'user', content: text, timestamp: Date.now() };
        const aiMsg: Message = { id: uuidv4(), role: 'assistant', content: '', timestamp: Date.now() };
        addMessage(cid, userMsg);
        addMessage(cid, aiMsg);
        setIsStreaming(true);
        const msgs = (getConv()?.messages ?? []).filter(m => !m.error).slice(0, -1).map(m => ({ role: m.role, content: m.content }));
        msgs.push({ role: 'user', content: text });
        let aborted = false;
        const ctrl = new AbortController();
        abortRef.current = () => { aborted = true; ctrl.abort(); };
        try {
                const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: msgs, model: currentModel }), signal: ctrl.signal });
                const reader = res.body?.getReader();
                if (!reader) throw new Error('no reader');
                let buf = '';
                while (true) {
                          const { done, value } = await reader.read();
                          if (done || aborted) break;
                          buf += new TextDecoder().decode(value, { stream: true });
                          const lines = buf.split('\n'); buf = lines.pop() ?? '';
                          for (const ln of lines) {
                                      if (!ln.startsWith('data: ')) continue;
                                      try { const d = JSON.parse(ln.slice(6)); if (d.type === 'delta') appendToLastMessage(cid!, d.text); } catch {}
                          }
                }
        } catch { if (!aborted) setLastMessageError(cid!); }
        finally { setIsStreaming(false); abortRef.current = null; }
        if (getConv()?.title === 'New conversation') genTitle(cid!, text);
  };

  return (
        <div className="flex flex-col h-full">
              <TopBar />
              <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
                {!conv || conv.messages.length === 0 ? <EmptyState onSend={send} /> : (
                    <div className="max-w-3xl mx-auto px-4 py-6">
                      {conv.messages.map((msg, i) => (
                                    <MessageItem key={msg.id} message={msg} isLast={i === conv.messages.length - 1}
                                                      isStreaming={isStreaming && i === conv.messages.length - 1 && msg.role === 'assistant'}
                                                      onRetry={msg.error ? () => { const p = conv.messages[i - 1]; if (p) send(p.content); } : undefined}
                                                    />
                                  ))}
                                <div ref={messagesEndRef} />
                    </div>div>
                      )}
              </div>div>
          {showScroll && (
                  <button onClick={() => toBottom()} className="fixed bottom-24 right-6 z-10 w-9 h-9 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full flex items-center justify-center text-[#8e8ea0] hover:text-[#ececec] transition-all shadow-lg">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>svg>
                  </button>button>
              )}
              <InputBar onSend={send} onStop={() => abortRef.current?.()} />
        </div>div>
      );
}
</div>
