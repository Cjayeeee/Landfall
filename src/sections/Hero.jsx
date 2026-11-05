import { useRef } from 'react'
import { Check, Circle } from 'lucide-react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import Button from '../components/Button'

const CHECKLIST = [
  { item: 'Work visa', status: 'Cleared', done: true },
  { item: 'Flat, Kreuzberg', status: 'Lease signed', done: true },
  { item: 'Bank account', status: 'Open', done: true },
  { item: 'City registration', status: 'Booked · 04 Mar', done: false },
]

function RelocationPass() {
  return (
    <article
      className="pass relative mx-auto w-full max-w-[440px] bg-paper-warm text-ink shadow-[0_1px_0_rgba(20,20,20,0.08),0_30px_60px_-30px_rgba(20,20,20,0.35)]"
      aria-label="Example relocation pass for an employee moving from Bengaluru to Berlin"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between bg-ink px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/80">
        <span>Relocation pass</span>
        <span>LF-0427 · 1 of 14</span>
      </div>

      {/* Route */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 px-5 pb-4 pt-5">
        <div>
          <p className="font-display text-[3.2rem] font-semibold leading-none tracking-[-0.04em]">BLR</p>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-stone">Bengaluru</p>
        </div>
        <div className="mb-6 flex w-16 items-center sm:w-24" aria-hidden="true">
          <span className="h-2 w-2 rounded-full border border-ink" />
          <span className="pass-route h-px flex-1 origin-left bg-ink" />
          <span className="h-2 w-2 rounded-full bg-signal" />
        </div>
        <div className="text-right">
          <p className="font-display text-[3.2rem] font-semibold leading-none tracking-[-0.04em]">BER</p>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-stone">Berlin</p>
        </div>
      </div>

      {/* Passenger */}
      <div className="grid grid-cols-[132px_1fr] gap-4 px-5 pb-5 sm:grid-cols-[150px_1fr]">
        <div className="relative">
          <div className="absolute -left-2 -top-2 h-full w-full bg-signal" aria-hidden="true" />
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=420&h=520&q=80"
            alt="Portrait of the employee on this pass"
            width="150"
            height="186"
            className="photo relative aspect-[150/186] w-full object-cover"
            fetchPriority="high"
          />
        </div>
        <dl className="flex flex-col justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-[0.1em]">
          {[
            ['Passenger', 'Mira Kovač'],
            ['Role', 'Backend engineer'],
            ['Travelling with', 'Partner, 1 child'],
            ['First day', 'Mon 02 Mar'],
          ].map(([k, val]) => (
            <div key={k}>
              <dt className="text-stone">{k}</dt>
              <dd className="mt-0.5 font-sans text-[0.95rem] normal-case tracking-normal text-ink">{val}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Perforation with notches */}
      <div className="relative h-5" aria-hidden="true">
        <span className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-paper" />
        <span className="perforation absolute inset-x-4 top-1/2 h-px" />
        <span className="absolute -right-2.5 top-0 h-5 w-5 rounded-full bg-paper" />
      </div>

      {/* Checklist */}
      <ul className="px-5 pb-5 pt-2">
        {CHECKLIST.map((c) => (
          <li key={c.item} className="pass-row flex items-center justify-between border-b border-ink/10 py-2.5 last:border-0">
            <span className="flex items-center gap-3 text-[0.92rem]">
              {c.done ? (
                <span className="grid h-5 w-5 place-items-center bg-ink text-paper">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
              ) : (
                <Circle className="h-5 w-5 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
              )}
              {c.item}
            </span>
            <span className={`font-mono text-[0.68rem] uppercase tracking-[0.08em] ${c.done ? 'text-ink/70' : 'text-signal-deep'}`}>
              {c.status}
            </span>
          </li>
        ))}
      </ul>

      {/* Stamp */}
      <div
        className="pass-stamp pointer-events-none absolute left-[78px] top-[47%] grid h-[96px] w-[96px] sm:left-auto sm:right-6 sm:top-[44%] sm:h-[118px] sm:w-[118px] rotate-[-14deg] place-items-center rounded-full border-2 border-signal text-center text-signal "
        aria-hidden="true"
      >
        <div className="absolute inset-[6px] rounded-full border border-signal/70" />
        <p className="font-mono text-[0.5rem] uppercase leading-tight tracking-[0.16em] sm:text-[0.6rem]">
          Cleared
          <br />
          <span className="font-display text-[1rem] font-bold sm:text-[1.25rem] tracking-[-0.02em]">DAY ONE</span>
          <br />
          ready
        </p>
      </div>
    </article>
  )
}

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Start only after fonts are ready and the first heavy frames have
        // painted, so the opening isn't half-skipped by a busy main thread.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        tl.from('.hero-line', { yPercent: 115, duration: 1.2, stagger: 0.09 })
          .from('.hero-underline', { scaleX: 0, duration: 0.9, ease: 'power4.inOut' }, '-=0.55')
          .from('.hero-fade', { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 }, '-=0.8')
          .from('.pass', { y: 70, rotate: 3, autoAlpha: 0, duration: 1.3 }, 0.25)
          .from('.pass-route', { scaleX: 0, duration: 0.9, ease: 'power3.inOut' }, '-=0.7')
          .from('.pass-row', { autoAlpha: 0, x: -10, duration: 0.6, stagger: 0.07 }, '-=0.6')
          .from('.pass-stamp', { scale: 1.9, autoAlpha: 0, rotate: -40, duration: 0.55, ease: 'back.out(2.2)' }, '-=0.15')

        let cancelled = false
        let raf = 0
        const go = () => {
          if (cancelled) return
          raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => !cancelled && tl.play())))
        }
        const fonts = document.fonts?.ready ?? Promise.resolve()
        // Never wait more than 1.2s, even if a font is slow.
        Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(go)
        return () => {
          cancelled = true
          cancelAnimationFrame(raf)
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden pt-[68px]">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-16 pt-12 md:px-10 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7 lg:pt-6">
          <p className="hero-fade mb-8 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/60">
            <span className="h-2 w-2 bg-signal" aria-hidden="true" />
            Relocation for international hires
          </p>

          <h1 className="font-display text-[clamp(3.4rem,17vw,7rem)] lg:text-[clamp(5rem,9vw,8.4rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line block">They move.</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line block text-ink/35">We handle</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="hero-line relative inline-block">
                the rest.
                <span
                  className="hero-underline absolute -bottom-[0.02em] left-0 h-[0.09em] w-full origin-left bg-signal"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,26rem)_auto] md:items-end md:gap-12">
            <p className="hero-fade text-[1.08rem] leading-relaxed text-ink/75">
              Landfall relocates your international hires end to end. Visas, housing, banking, schools and the
              confusing first week are covered, so your HR team gets its time back and new people start on day one,
              not day forty.
            </p>
            <div className="hero-fade flex flex-col items-start gap-4">
              <Button href="#contact" variant="ink">
                Plan a move
              </Button>
              <a
                href="#process"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget('#process')
                }}
                className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink/70 underline decoration-ink/30 underline-offset-[6px] hover:text-ink"
              >
                How a move runs
              </a>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          {/* Coordinates gridline behind the pass, a quiet nod to arrival boards */}
          <div className="absolute inset-y-0 left-1/2 hidden w-px bg-ink/10 lg:block" aria-hidden="true" />
          <p
            className="hero-fade absolute -top-1 right-0 hidden font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink/45 lg:block"
            aria-hidden="true"
          >
            52.52° N, 13.40° E
          </p>
          <div className="relative lg:pt-10">
            <RelocationPass />
          </div>
        </div>
      </div>
    </section>
  )
}
