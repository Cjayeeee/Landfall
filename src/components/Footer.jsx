import { scrollToTarget } from '../hooks/useLenis'
import Logo from './Logo'

const COLUMNS = [
  {
    title: 'Services',
    links: [
      ['Immigration', '#handle'],
      ['Housing', '#handle'],
      ['Local admin', '#handle'],
      ['Family support', '#handle'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['How a move runs', '#process'],
      ['Case file', '#case'],
      ['FAQ', '#faq'],
      ['Plan a move', '#contact'],
    ],
  },
]

export default function Footer() {
  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="paper" />
            <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-paper/60">
              Relocation for international hires. Visas, housing, admin and family, run by one team from offer letter to
              the first ninety days.
            </p>
            <a
              href="mailto:moves@landfall.example"
              className="mt-8 inline-block font-display text-[1.5rem] font-medium tracking-[-0.02em] underline decoration-signal decoration-2 underline-offset-[8px]"
            >
              moves@landfall.example
            </a>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="md:col-span-2 md:col-start-auto">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/40">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} onClick={(e) => go(e, href)} className="text-[0.95rem] text-paper/75 hover:text-paper">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/40">Offices</p>
            <ul className="mt-5 space-y-3 text-[0.95rem] text-paper/75">
              <li className="flex justify-between gap-4">Berlin <span className="font-mono text-xs text-paper/40">CET</span></li>
              <li className="flex justify-between gap-4">Lisbon <span className="font-mono text-xs text-paper/40">WET</span></li>
              <li className="flex justify-between gap-4">Bengaluru <span className="font-mono text-xs text-paper/40">IST</span></li>
            </ul>
          </div>
        </div>

        <div
          className="mt-20 select-none font-display text-[clamp(4rem,29.5vw,28rem)] -ml-[0.04em] font-semibold leading-[0.8] tracking-[-0.07em] text-paper/[0.07]"
          aria-hidden="true"
        >
          Landfall
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-paper/10 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-paper/40 sm:flex-row">
          <span>© 2026 Landfall Relocation</span>
          <span>Portfolio concept. Brand, people and scenarios are fictional.</span>
        </div>
      </div>
    </footer>
  )
}
