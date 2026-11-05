import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import SectionLabel from '../components/SectionLabel'

const AREAS = [
  {
    key: 'immigration',
    title: 'Immigration',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=75',
    alt: 'Aircraft wing above the clouds',
    body: 'Eligibility checks, work and family visas, residence permits and renewals, filed through licensed immigration partners in each destination.',
    included: ['Visa route assessment', 'Dependant visas', 'Permit renewals'],
  },
  {
    key: 'housing',
    title: 'Housing',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=75',
    alt: 'House keys resting beside a small model house',
    body: 'A furnished flat for the first weeks, then a guided search for a long-term home: viewings, contract review, deposits and utilities.',
    included: ['Temporary housing', 'Viewings & contracts', 'Utilities set-up'],
  },
  {
    key: 'admin',
    title: 'Local admin',
    img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=75',
    alt: 'A city avenue lined with tall buildings',
    body: 'Registration with the city, tax number, bank account, health insurance and a phone that works, ideally all in the first week.',
    included: ['City registration', 'Tax ID & bank', 'Health insurance'],
  },
  {
    key: 'family',
    title: 'Family',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=75',
    alt: 'A map, camera and notebook laid out for planning a trip',
    body: 'School and nursery places, support for a partner’s job search, and dependant paperwork, so the move works for the whole household.',
    included: ['School placement', 'Partner career support', 'Childcare search'],
  },
]

export default function Plate() {
  const root = useRef(null)
  const [active, setActive] = useState(0)

  const { contextSafe } = useGSAP(
    () => {
      gsap.set('.plate-img', { autoAlpha: 0 })
      gsap.set('.plate-img[data-i="0"]', { autoAlpha: 1 })
      gsap.set('.plate-copy', { autoAlpha: 0 })
      gsap.set('.plate-copy[data-i="0"]', { autoAlpha: 1 })
    },
    { scope: root },
  )

  const select = contextSafe((next) => {
    if (next === active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const d = reduce ? 0 : 1

    const prevImg = `.plate-img[data-i="${active}"]`
    const nextImg = `.plate-img[data-i="${next}"]`
    gsap.set(nextImg, { zIndex: 2 })
    gsap.set(prevImg, { zIndex: 1 })
    gsap.fromTo(
      nextImg,
      { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 100%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9 * d,
        ease: 'expo.inOut',
        overwrite: true,
        onComplete: () => gsap.set(prevImg, { autoAlpha: 0 }),
      },
    )

    gsap.to(`.plate-copy[data-i="${active}"]`, { autoAlpha: 0, y: -10, duration: 0.25 * d, overwrite: true })
    gsap.fromTo(
      `.plate-copy[data-i="${next}"]`,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.6 * d, delay: 0.2 * d, overwrite: true },
    )
    setActive(next)
  })

  const onKey = (e) => {
    const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (!(e.key in map)) return
    e.preventDefault()
    const next = (active + map[e.key] + AREAS.length) % AREAS.length
    select(next)
    root.current.querySelector(`#tab-${AREAS[next].key}`)?.focus()
  }

  return (
    <section ref={root} id="handle" className="bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionLabel index="03" tone="paper">
          What comes off your plate
        </SectionLabel>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-paper/60">
              Four areas where an international move usually stalls. Pick one to see what we take over.
            </p>
            <div role="tablist" aria-orientation="vertical" aria-label="Relocation service areas" className="mt-10 border-t border-paper/15" onKeyDown={onKey}>
              {AREAS.map((a, i) => (
                <button
                  key={a.key}
                  id={`tab-${a.key}`}
                  role="tab"
                  type="button"
                  aria-selected={active === i}
                  aria-controls={`panel-${a.key}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => select(i)}
                  className={`group flex w-full items-baseline gap-5 border-b border-paper/15 py-5 text-left md:py-6 ${
                    active === i ? 'text-paper' : 'text-paper/35 hover:text-paper/70'
                  }`}
                >
                  <span className="w-6 font-mono text-[0.7rem] text-paper/40">0{i + 1}</span>
                  <span className="flex-1 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.04em]">
                    {a.title}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 self-center rounded-full ${active === i ? 'bg-signal' : 'border border-paper/25'}`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -bottom-3 -right-3 hidden h-full w-full bg-signal md:block" aria-hidden="true" />
              <div className="relative aspect-[16/11] overflow-hidden bg-graphite">
                {AREAS.map((a, i) => (
                  <img
                    key={a.key}
                    data-i={i}
                    src={a.img}
                    alt={active === i ? a.alt : ''}
                    loading="lazy"
                    width="1400"
                    height="963"
                    className="plate-img photo absolute inset-0 h-full w-full object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-10 min-h-[220px] md:min-h-[180px]">
              {AREAS.map((a, i) => (
                <div
                  key={a.key}
                  id={`panel-${a.key}`}
                  data-i={i}
                  role="tabpanel"
                  aria-labelledby={`tab-${a.key}`}
                  aria-hidden={active !== i}
                  className={`plate-copy grid gap-8 md:grid-cols-[1.4fr_1fr] ${i === 0 ? 'relative' : 'absolute inset-x-0 top-0'}`}
                >
                  <p className="text-[1.08rem] leading-relaxed text-paper/80">{a.body}</p>
                  <ul className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper/70">
                    {a.included.map((x) => (
                      <li key={x} className="border-b border-paper/15 py-2.5 first:pt-0">
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
