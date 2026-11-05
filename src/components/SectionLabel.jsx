/** Document-style section marker: index number, rule, name. */
export default function SectionLabel({ index, children, tone = 'ink', className = '' }) {
  const color = tone === 'ink' ? 'text-ink/60' : 'text-paper/55'
  const rule = tone === 'ink' ? 'bg-ink/20' : 'bg-paper/20'
  return (
    <div className={`flex items-center gap-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] ${color} ${className}`}>
      <span>{index}</span>
      <span className={`h-px w-10 ${rule}`} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
