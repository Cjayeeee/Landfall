import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import SectionLabel from '../components/SectionLabel'

const LEGS = [
  {
    n: '01',
    window: 'Weeks −8 to −6',
    title: 'Before the offer is signed',
    body: 'We check visa eligibility for the candidate and their family, estimate cost and timing, and give you a start date you can actually promise.',
    outputs: ['Eligibility check', 'Fixed quote', 'Start-date window'],
  },
  {
    n: '02',
    window: 'Weeks −6 to −2',
    title: 'Paperwork',
    body: 'Licensed immigration partners prepare and file the visa. We gather documents, chase appointments and explain every step in plain language.',
    outputs: ['Visa filing', 'Document pack', 'Embassy booking'],
  },
  {
    n: '03',
    window: 'Week 0',
    title: 'Arrival week',
    body: 'Airport pickup, keys to a furnished flat, a working SIM, and someone from our team at the registration office and the bank.',
    outputs: ['Temporary flat', 'Registration', 'Bank & SIM'],
  },
  {
    n: '04',
    window: 'Weeks 1 to 12',
    title: 'The first ninety days',
    body: 'Long-term lease search, school places, support for a partner’s job hunt, and a check-in every two weeks until the move feels finished.',
    outputs: ['Long-term lease', 'Schools', 'Fortnightly check-ins'],
  },
]

export default function Process() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // The route line draws itself as you read through the legs.
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        gsap.from('.rail-x', {
          scaleX: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.legs', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
        })
        gsap.from('.leg', {
          autoAlpha: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.9,
          scrollTrigger: { trigger: '.legs', start: 'top 78%' },
        })
      })

      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => {
        gsap.from('.rail-y', {
          scaleY: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.legs', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.process-head > *', {
          autoAlpha: 0,
          y: 24,
          stagger: 0.1,
          scrollTrigger: { trigger: '.process-head', start: 'top 80%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="process" className="relative bg-graphite py-24 text-paper md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionLabel index="01" tone="paper">
          How a move runs
        </SectionLabel>

        <div className="process-head mt-10 grid gap-8 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em] lg:col-span-7">
            Every move has four legs.
            <span className="text-paper/40"> We run all of them.</span>
          </h2>
          <p className="max-w-md self-end text-[1.02rem] leading-relaxed text-paper/65 lg:col-span-4 lg:col-start-9">
            Your HR team gets one contact for the whole move. The person moving gets a named lead who answers in their own
            time zone. Nobody gets passed between agencies.
          </p>
        </div>

        <div className="legs relative mt-20 lg:mt-28">
          {/* Desktop rail */}
          <div className="absolute inset-x-0 top-[7px] hidden h-px bg-paper/15 lg:block" aria-hidden="true">
            <div className="rail-x h-full w-full origin-left bg-signal" />
          </div>
          {/* Mobile rail */}
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/15 lg:hidden" aria-hidden="true">
            <div className="rail-y h-full w-full origin-top bg-signal" />
          </div>

          <ol className="grid gap-14 lg:grid-cols-4 lg:gap-10">
            {LEGS.map((leg) => (
              <li key={leg.n} className="leg relative pl-10 lg:pl-0 lg:pt-14">
                <span
                  className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-paper/60 bg-graphite lg:top-0"
                  aria-hidden="true"
                >
                  <span className="absolute inset-[4px] rounded-full bg-signal" />
                </span>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-paper/45">
                  Leg {leg.n} · {leg.window}
                </p>
                <h3 className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.03em]">{leg.title}</h3>
                <p className="mt-4 text-[0.96rem] leading-relaxed text-paper/65">{leg.body}</p>
                <ul className="mt-6 border-t border-paper/10">
                  {leg.outputs.map((o) => (
                    <li
                      key={o}
                      className="flex items-center justify-between border-b border-paper/10 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper/80"
                    >
                      {o}
                      <span className="text-paper/30" aria-hidden="true">
                        ↘
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
