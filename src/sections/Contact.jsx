import { useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Button from '../components/Button'

function Field({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-stone">{label}</span>
      <input
        id={id}
        name={id}
        className="mt-2 w-full border-b border-ink/25 bg-transparent pb-2 font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink placeholder:text-ink/25 focus:border-ink focus:outline-none"
        {...props}
      />
    </label>
  )
}

/** Half-circle cut-outs where the perforation meets the ticket edge. */
function Notch({ className }) {
  return (
    <span
      className={`absolute h-7 w-7 rounded-full border border-ink bg-paper ${className}`}
      aria-hidden="true"
    />
  )
}

export default function Contact() {
  const root = useRef(null)
  const [sent, setSent] = useState(false)

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.request', start: 'top 75%' } })
        tl.from('.request', { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out' })
          .from('.cta-line', { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=0.7')
          .from('.cta-underline', { scaleX: 0, duration: 0.8, ease: 'power4.inOut' }, '-=0.5')
      })
    },
    { scope: root },
  )

  const onSubmit = contextSafe((e) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to('.contact-form', {
      autoAlpha: 0,
      y: -12,
      duration: reduce ? 0 : 0.35,
      onComplete: () => {
        setSent(true)
        requestAnimationFrame(() => {
          gsap.fromTo('.contact-done', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.6 })
          gsap.fromTo(
            '.done-stamp',
            { scale: 1.9, autoAlpha: 0, rotate: -40 },
            { scale: 1, autoAlpha: 1, rotate: -12, duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.25, ease: 'back.out(2.2)' },
          )
        })
      },
    })
  })

  return (
    <section ref={root} id="contact" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <article className="request relative overflow-hidden border border-ink bg-paper-warm">
          {/* Ticket header */}
          <div className="flex items-center justify-between bg-ink px-6 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/80 md:px-10">
            <span className="flex items-center gap-3">
              <span className="h-2 w-2 bg-signal" aria-hidden="true" />
              Move request
            </span>
            <span>
              <span className="hidden sm:inline">LF-NEW · Reply in </span>1 working day
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_auto_1fr]">
            {/* Stub: the pitch */}
            <div className="px-6 py-12 md:px-10 md:py-16">
              <h2 className="font-display text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
                <span className="block overflow-hidden pb-[0.05em]">
                  <span className="cta-line block">Tell us who’s</span>
                </span>
                <span className="block overflow-hidden pb-[0.05em]">
                  <span className="cta-line block">moving, and</span>
                </span>
                <span className="block overflow-hidden pb-[0.1em]">
                  <span className="cta-line relative inline-block">
                    where to.
                    <span
                      className="cta-underline absolute -bottom-[0.02em] left-0 h-[0.09em] w-full origin-left bg-signal"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </h2>
              <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-ink/70">
                You’ll get a move plan with a realistic start date and a fixed quote within one working day. No sales
                sequence follows.
              </p>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-ink/15 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.1em]">
                {[
                  ['Plan', 'Start date'],
                  ['Quote', 'Fixed fee'],
                  ['Owner', 'One move lead'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-stone">{k}</dt>
                    <dd className="mt-1 font-sans text-[0.9rem] normal-case tracking-normal text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Perforation: vertical on desktop, horizontal on mobile */}
            <div className="relative hidden w-px lg:block" aria-hidden="true">
              <span
                className="absolute inset-y-6 left-0 w-px"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, rgb(20 20 20 / 0.35) 50%, transparent 50%)',
                  backgroundSize: '1px 10px',
                }}
              />
              <Notch className="-bottom-3.5 -left-3.5" />
            </div>
            <div className="relative mx-6 h-px lg:hidden" aria-hidden="true">
              <span
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(to right, rgb(20 20 20 / 0.35) 50%, transparent 50%)',
                  backgroundSize: '10px 1px',
                }}
              />
              <Notch className="-left-[2.35rem] -top-3.5" />
              <Notch className="-right-[2.35rem] -top-3.5" />
            </div>

            {/* Form */}
            <div className="relative px-6 py-12 md:px-10 md:py-16">
              {!sent ? (
                <form className="contact-form grid gap-8" onSubmit={onSubmit} noValidate>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/60">Route</p>
                  <div className="-mt-4 grid gap-8 sm:grid-cols-2">
                    <Field id="from" label="Moving from" placeholder="Bengaluru" required autoComplete="off" />
                    <Field id="to" label="Moving to" placeholder="Berlin" required autoComplete="off" />
                  </div>
                  <div className="grid gap-8 sm:grid-cols-[0.6fr_1.4fr]">
                    <Field id="people" label="People" type="number" min="1" placeholder="3" required inputMode="numeric" />
                    <Field id="email" label="Work email" type="email" placeholder="you@company.com" required autoComplete="email" />
                  </div>
                  <Button type="submit" variant="ink" className="mt-2 w-full sm:w-auto sm:justify-self-start">
                    Request a move plan
                  </Button>
                </form>
              ) : (
                <div className="contact-done relative" role="status">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-stone">Status</p>
                  <p className="mt-4 max-w-sm font-display text-[2rem] font-medium leading-tight tracking-[-0.03em]">
                    Received. A move lead will reply within one working day.
                  </p>
                  <div
                    className="done-stamp relative mt-10 grid h-[118px] w-[118px] place-items-center rounded-full border-2 border-signal text-center text-signal"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-[6px] rounded-full border border-signal/70" />
                    <p className="font-mono text-[0.6rem] uppercase leading-tight tracking-[0.16em]">
                      Request
                      <br />
                      <span className="font-display text-[1.2rem] font-bold tracking-[-0.02em]">LOGGED</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
