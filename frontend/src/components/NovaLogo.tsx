interface Props { size?: number; className?: string; }

export default function NovaLogo({ size = 32, className = '' }: Props) {
    return (
          <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                  <defs>
                          <radialGradient id="ng" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#00D4FF" stopOpacity="1"/>
                                    <stop offset="100%" stopColor="#0066ff" stopOpacity="0.6"/>
                          </radialGradient>radialGradient>
                  </defs>defs>
            {[0,45,90,135].map(deg => (
                    <g key={deg} transform={`rotate(${deg} 16 16)`}>
                              <line x1="16" y1="2" x2="16" y2="8" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                              <line x1="16" y1="24" x2="16" y2="30" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
                    </g>g>
                  ))}
            {[22.5,67.5,112.5,157.5].map(deg => (
                    <g key={deg} transform={`rotate(${deg} 16 16)`}>
                              <line x1="16" y1="4" x2="16" y2="9" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                              <line x1="16" y1="23" x2="16" y2="28" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                    </g>g>
                  ))}
                <circle cx="16" cy="16" r="4" fill="url(#ng)"/>
                <circle cx="16" cy="16" r="2.5" fill="#00D4FF" opacity="0.95"/>
          </svg>svg>
        );
}
</defs>
