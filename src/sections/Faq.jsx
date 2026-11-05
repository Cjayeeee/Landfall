import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { gsap, useGSAP } from '../lib/gsap'
import SectionLabel from '../components/SectionLabel'

const QUESTIONS = [
  {
    q: 'Which countries do you move people into?',
    a: 'Most of the EU, the UK, Canada, the UAE and Singapore. If a destination is outside the routes we run often, we will say so before you sign anything rather than learn on your hire’s time.',
  },
  {
    q: 'How is pricing structured?',
    a: 'A fixed fee per person, per move, agreed before anything is booked. Government visa fees, rent and deposits are passed through at cost and listed separately on the invoice.',
  },
  {
    q: 'Do you replace our immigration lawyer?',
    a: 'No. Filings are prepared and submitted by licensed immigration partners in each country. We coordinate them, collect documents and keep everyone updated, so your counsel can focus on policy rather than paperwork.',
  },
  {
    q: 'How early should we bring you in?',
    a: 'Before the offer letter goes out, if you can. A ten-minute eligibility check at that stage is what keeps a promised start date from slipping by two months.',
  },
  {
    q: 'What happens if a visa is refused?',
    a: 'We review the refusal with the immigration partner within two working days and come back with the options: appeal, a different route, or a remote start while it is resolved. Our fee for that leg is not charged twice.',
  },
]

function Item({ item, index, open, onToggle }) {
  const body = useRef(null)
  const icon = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(body.current, {
        height: open ? 'auto' : 0,
        autoAlpha: open ? 1 : 0,
        duration: reduce ? 0 : open ? 0.6 : 0.4,
        ease: open ? 'expo.out' : 'power3.inOut',
      })
      gsap.to(icon.current, { rotate: open ? 45 : 0, duration: reduce ? 0 : 0.4 })
    },
    { dependencies: [open] },
  )

  const id = `faq-${index}`
  return (
    <li className="border-b border-ink/15">
      <h3>
        <button
          type="button"
          className="flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          <span className="font-display text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-snug tracking-[-0.025em]">
            {item.q}
          </span>
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center border border-ink/25" aria-hidden="true">
            <span ref={icon} className="grid place-items-center">
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </span>
        </button>
      </h3>
      <div ref={body} id={id} role="region" className="h-0 overflow-hidden opacity-0" style={{ visibility: 'hidden' }}>
        <p className="max-w-2xl pb-8 pr-12 text-[1.02rem] leading-relaxed text-ink/70">{item.a}</p>
      </div>
    </li>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionLabel index="05">Questions</SectionLabel>
          <h2 className="mt-10 font-display text-[clamp(2.3rem,4.4vw,3.8rem)] font-medium leading-[1] tracking-[-0.045em]">
            Things HR teams ask on the first call.
          </h2>
        </div>
        <ul className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {QUESTIONS.map((item, i) => (
            <Item key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
