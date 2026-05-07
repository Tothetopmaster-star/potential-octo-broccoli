import { useRef, useState, useEffect } from 'react';
  import { useStore } from '../store';

interface InputBarProps {
    onSend: (text: string) => void;
  onStop: () => void;
}

export default function InputBar({ onSend, onStop }: InputBarProps) {
  const { isStreaming } = useStore();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
}
}, [value]);

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value.trim());
    setValue('');
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
}
};

  const hasText = value.trim().length > 0;

  return (
    <div className="px-4 pb-4 pt-2 flex-shrink-0">
      <div className={`flex items-end gap-2 bg-[#1a1a1a] border rounded-2xl px-4 py-3 transition-colors ${
            hasText ? 'border-[#00D4FF]/40' : 'border-[#2a2a2a]'
    }`}>
{/* Left icons */}
        <div className="flex items-center gap-1 pb-0.5">
          <button className="p-1 rounded-lg text-[#555] hover:text-[#8e8ea0] hover:bg-[#2a2a2a] transition-colors" title="Attach file">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
        </div>

{/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Nova..."
          rows={1}
          className="flex-1 bg-transparent text-[#ececec] text-sm placeholder-[#555] resize-none outline-none leading-relaxed max-h-[200px] overflow-y-auto py-0.5"
          style={{ minHeight: '24px' }}
          disabled={isStreaming && !hasText}
        />

{/* Right: send or stop */}
{isStreaming ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-8 h-8 bg-[#ececec] hover:bg-white rounded-full flex items-center justify-center transition-all"
            title="Stop generating"
          >
            <div className="w-3 h-3 bg-[#0d0d0d] rounded-sm" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!hasText}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              hasText
                ? 'bg-[#00D4FF] hover:bg-[#00b8d9] shadow-[0_0_12px_rgba(0,212,255,0.4)]'
                : 'bg-[#2a2a2a] cursor-not-allowed'
}`}
            title="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hasText ? '#000' : '#555'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        )}
      </div>
      <p className="text-center text-[10px] text-[#3a3a3a] mt-2">
        Nova can make mistakes. Verify important info.
      </p>
    </div>
  );
}
