export default function Logo({ tone = 'ink', className = '' }) {
  const stroke = tone === 'ink' ? '#141414' : '#FFFFFF'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M5 8 C 12 8, 18 13, 21 21"
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeDasharray="2.4 2.4"
        />
        <path d="M3 24.5 H29" stroke={stroke} strokeWidth="1.8" />
        <circle cx="22" cy="21.6" r="3.1" fill="#FF5A1F" />
      </svg>
      <span
        className={`font-display text-[1.35rem] font-semibold tracking-[-0.03em] ${
          tone === 'ink' ? 'text-ink' : 'text-paper'
        }`}
      >
        Landfall
      </span>
    </span>
  )
}
