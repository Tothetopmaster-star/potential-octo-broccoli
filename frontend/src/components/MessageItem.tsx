import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../types';
  import NovaLogo from './NovaLogo';

  interface MessageItemProps {
    message: Message;
  isLast: boolean;
  isStreaming: boolean;
  onRetry?: () => void;
}

function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageItem({ message, isLast, isStreaming, onRetry }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const isUser = message.role === 'user';

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
};

  const isThinking = isStreaming && message.content === '';

  return (
    <div
      className={`msg-enter flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
{/* Avatar */}
{isUser ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0066ff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
          U
        </div>
      ) : (
        <div className="flex-shrink-0 mt-1">
          <NovaLogo size={28} />
        </div>
      )}

{/* Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
{isUser ? (
          <div className="px-4 py-2.5 bg-[#2a2a2a] rounded-2xl rounded-tr-sm text-[#ececec] text-sm leading-relaxed">
{message.content}
          </div>
        ) : (
          <div className={`text-sm text-[#ececec] leading-relaxed ${isStreaming && isLast ? 'streaming-cursor' : ''}`}>
{isThinking ? (
                <div className="flex items-center gap-1 py-2">
  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-[#00D4FF] rounded-full opacity-60"
                      style={{ animation: `pulseDot 1.4s ease-in-out ${i * 0.16}s infinite` }}
                    />
                  ))}
                </div>
              ) : message.error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Something went wrong.</span>
{onRetry && (
                  <button onClick={onRetry} className="underline hover:text-red-300 transition-colors">
                      Retry
                    </button>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const inline = !match;
                        return inline ? (
                          <code className={className} {...props}>{children}</code>
                        ) : (
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: '0.5em 0', borderRadius: '8px', fontSize: '0.8rem' }}
                        >
{String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
},
}}
                >
{message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

{/* Action buttons + timestamp */}
{hovering && !isThinking && (
          <div className={`flex items-center gap-1 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-[10px] text-[#555] px-1">{formatTime(message.timestamp)}</span>
            <button
              onClick={copyMessage}
              className="p-1 rounded hover:bg-[#2a2a2a] text-[#555] hover:text-[#8e8ea0] transition-colors"
              title="Copy"
            >
{copied ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
            </button>
{!isUser && (
              <>
                <button className="p-1 rounded hover:bg-[#2a2a2a] text-[#555] hover:text-[#8e8ea0] transition-colors" title="Good response">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-[#2a2a2a] text-[#555] hover:text-[#8e8ea0] transition-colors" title="Bad response">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
