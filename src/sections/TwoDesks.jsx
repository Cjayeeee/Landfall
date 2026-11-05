import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import SectionLabel from '../components/SectionLabel'

const DESKS = [
  {
    tag: 'For HR & People teams',
    title: 'One owner, one tracker, one invoice.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=75',
    alt: 'Two colleagues celebrating a decision at a shared desk',
    points: [
      'A single move lead per hire, on Slack or email',
      'A shared tracker with every person, document and deadline',
      'Per-person pricing fixed before anything is booked',
      'Ready-made policies for lump-sum or fully managed packages',
    ],
  },
  {
    tag: 'For the person moving',
    title: 'Someone who knows the city, on their side.',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=75',
    alt: 'A bright, furnished apartment living room',
    points: [
      'A named lead who replies in their own time zone',
      'A housing shortlist they choose from, not an assigned flat',
      'Help for partners and children, not just the employee',
      'Someone beside them at the registration office',
    ],
  },
]

function Desk({ desk, index }) {
  return (
    <article className={`desk ${index === 1 ? 'md:mt-40' : ''}`}>
      <div className="desk-media relative overflow-hidden">
        <img
          src={desk.img}
          alt={desk.alt}
          loading="lazy"
          width="1200"
          height="900"
          className="desk-img photo aspect-[4/3] w-full scale-[1.12] object-cover"
        />
        <span className="absolute left-0 top-0 bg-paper px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
          {desk.tag}
        </span>
      </div>
      <h3 className="mt-8 max-w-md font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-[1.08] tracking-[-0.035em]">
        {desk.title}
      </h3>
      <ul className="mt-6 max-w-md">
        {desk.points.map((p, i) => (
          <li key={p} className="flex gap-5 border-t border-ink/15 py-3.5 text-[0.98rem] leading-snug text-ink/80">
            <span className="pt-0.5 font-mono text-[0.68rem] text-ink/40">{String(i + 1).padStart(2, '0')}</span>
            {p}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function TwoDesks() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('.desk').forEach((desk) => {
          const media = desk.querySelector('.desk-media')
          const img = desk.querySelector('.desk-img')
          gsap.from(media, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.3,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: media, start: 'top 85%' },
          })
          gsap.fromTo(
            img,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="desks" className="py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <SectionLabel index="02" className="lg:col-span-3 lg:pt-4">
            Two sides of the desk
          </SectionLabel>
          <h2 className="font-display text-[clamp(2.3rem,5vw,4.3rem)] font-medium leading-[1] tracking-[-0.045em] lg:col-span-9">
            The same move looks very different to the person filing it and the person living it.
            <span className="text-ink/35"> We plan for both.</span>
          </h2>
        </div>

        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-10 lg:gap-20">
          {DESKS.map((d, i) => (
            <Desk key={d.tag} desk={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
