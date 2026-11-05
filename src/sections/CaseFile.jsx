import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import SectionLabel from '../components/SectionLabel'

const META = [
  ['Client', 'A 120-person fintech'],
  ['Corridor', 'Bengaluru → Berlin'],
  ['People', '14 engineers, 9 family members'],
  ['Window', 'Eight weeks, offer to keys'],
]

const LOG = [
  { w: 'W−8', title: 'Eligibility review', text: 'All 14 candidates and their families assessed. Two need a different visa route, and HR hears about it the same afternoon.' },
  { w: 'W−6', title: 'Start date locked', text: 'One shared first day, 2 March, agreed with the client. Each family gets a document pack and a named move lead.' },
  { w: 'W−3', title: 'Visas filed', text: 'Applications go in over two batches. Temporary flats are held in Kreuzberg and Friedrichshain, close to the office.' },
  { w: 'W0', title: 'Arrivals', text: 'Everyone lands across four days. Each person is met at BER and handed keys, and their SIM works before they leave the airport.' },
  { w: 'W+1', title: 'Local admin', text: 'City registration, tax IDs and bank accounts done for all 14, with someone from Landfall at every appointment.' },
  { w: 'W+10', title: 'Settling in', text: 'Twelve long-term leases signed, two families still viewing, three school places confirmed. Check-ins continue.' },
]

export default function CaseFile() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.log-row', {
          autoAlpha: 0,
          y: 22,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: { trigger: '.log', start: 'top 80%' },
        })
        gsap.from('.dossier', {
          autoAlpha: 0,
          y: 40,
          rotate: -1.5,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.dossier', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="case" className="doc-grid border-y border-ink/10 py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionLabel index="04">Case file</SectionLabel>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <div className="dossier lg:sticky lg:top-28">
              <div className="inline-block bg-ink px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper">
                File 027
              </div>
              <div className="border border-ink bg-paper-warm p-6 md:p-8">
                <p className="inline-block border border-signal-deep px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-signal-deep">
                  Illustrative scenario
                </p>
                <h2 className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.04em]">
                  Fourteen engineers, one start date.
                </h2>
                <dl className="mt-8">
                  {META.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-t border-ink/15 py-3">
                      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-stone">{k}</dt>
                      <dd className="text-[0.95rem]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[0.85rem] leading-relaxed text-ink/55">
                  A composite example that shows how we would run a team move of this size. It is not a client account or a
                  testimonial.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="log">
              {LOG.map((row) => (
                <li
                  key={row.w}
                  className="log-row grid grid-cols-[72px_1fr] gap-5 border-t border-ink/15 py-7 md:grid-cols-[110px_1fr] md:gap-8"
                >
                  <span className="font-display text-[1.7rem] font-medium leading-none tracking-[-0.03em] text-ink md:text-[2.2rem]">
                    {row.w}
                  </span>
                  <div>
                    <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink/55">{row.title}</h3>
                    <p className="mt-2 text-[1.04rem] leading-relaxed text-ink/85">{row.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <blockquote className="log-row mt-6 bg-ink p-7 text-paper md:p-10">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-signal">What the client’s HR team did</p>
              <p className="mt-4 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em]">
                Approved the budget, introduced us to the hires, and answered two emails.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
