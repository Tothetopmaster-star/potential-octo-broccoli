import { useRef, useEffect, useState } from 'react';
  import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store';
import type { Message } from '../types';
  import TopBar from './TopBar';
  import EmptyState from './EmptyState';
  import MessageItem from './MessageItem';
  import InputBar from './InputBar';

  export default function ChatArea() {
    const {
    getActiveConversation, addMessage, appendToLastMessage,
          setLastMessageError, isStreaming, setIsStreaming,
          updateConversationTitle, currentModel,
      } = useStore();

  const conv = getActiveConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<(() => void) | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
};

  useEffect(() => {
    scrollToBottom(false);
}, [conv?.id]);

  useEffect(() => {
    if (isStreaming) scrollToBottom();
}, [conv?.messages.length, isStreaming]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
};

  const generateTitle = async (convId: string, firstMsg: string) => {
    try {
      const res = await fetch('/api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstMessage: firstMsg }),
});
      const data = await res.json();
      if (data.title) updateConversationTitle(convId, data.title);
} catch {}
};

  const sendMessage = async (text: string, retryConvId?: string) => {
    if (!text.trim() || isStreaming) return;

    let convId = conv?.id;
    const { createConversation, setActiveConversation, getActiveConversation: getConv } = useStore.getState();

    if (!convId) {
      convId = createConversation();
      setActiveConversation(convId);
}

    const userMsg: Message = { id: uuidv4(), role: 'user', content: text, timestamp: Date.now() };
    addMessage(convId, userMsg);

    const aiMsg: Message = { id: uuidv4(), role: 'assistant', content: '', timestamp: Date.now() };
    addMessage(convId, aiMsg);

    setIsStreaming(true);

    const messages = (getConv()?.messages ?? [])
      .filter(m => !m.error)
      .slice(0, -1)
      .map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: text });

    let aborted = false;
    const controller = new AbortController();
    abortRef.current = () => { aborted = true; controller.abort(); };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, model: currentModel }),
        signal: controller.signal,
});

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done || aborted) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'delta') appendToLastMessage(convId!, data.text);
            if (data.type === 'error') { setLastMessageError(convId!); break; }
            if (data.type === 'done') break;
} catch {}
}
}
} catch (err: any) {
      if (!aborted) setLastMessageError(convId!);
} finally {
      setIsStreaming(false);
      abortRef.current = null;
}

    const currentConv = getConv();
    if (currentConv && currentConv.title === 'New conversation') {
      generateTitle(convId!, text);
}
};

  const stopStreaming = () => { abortRef.current?.(); };

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
{!conv || conv.messages.length === 0 ? (
          <EmptyState onSend={sendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6">
{conv.messages.map((msg, i) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isLast={i === conv.messages.length - 1}
                isStreaming={isStreaming && i === conv.messages.length - 1 && msg.role === 'assistant'}
                onRetry={msg.error ? () => {
                  const prev = conv.messages[i - 1];
                  if (prev) sendMessage(prev.content);
} : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

{showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="fixed bottom-24 right-6 z-10 w-9 h-9 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full flex items-center justify-center text-[#8e8ea0] hover:text-[#ececec] hover:bg-[#3a3a3a] transition-all shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      <InputBar onSend={sendMessage} onStop={stopStreaming} />
    </div>
  );
}
