import NovaLogo from './NovaLogo';

const SUGGESTIONS = [
{ icon: '\u270D\uFE0F', text: 'Help me write a professional email' },
{ icon: '\uD83D\uDCBB', text: 'Explain a coding concept step by step' },
{ icon: '\uD83D\uDCA1', text: 'Brainstorm creative ideas for my project' },
{ icon: '\uD83D\uDCCA', text: 'Analyze this data and give insights' },
];

interface EmptyStateProps { onSend: (text: string) => void; }

export default function EmptyState({ onSend }: EmptyStateProps) {
  return (
        <div className="flex flex-col items-center justify-center h-full px-4 py-8 min-h-[calc(100vh-120px)]">
          <div className="mb-4">
            <NovaLogo size={56} />
          </div>
          <h1 className="text-2xl font-semibold text-[#ececec] mb-2 text-center">
            What can I help with?
          </h1>
          <p className="text-[#8e8ea0] text-sm mb-8 text-center">Ask me anything — I&apos;m Nova, your AI assistant.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
    {SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                onClick={() => onSend(s.text)}
                className="flex items-start gap-3 p-3.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:bg-[#222] hover:border-[#3a3a3a] transition-all text-left group"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{s.icon}</span>
                <span className="text-sm text-[#ececec] leading-snug">{s.text}</span>
              </button>
            ))}
      </div>
        </div>
      );
}
