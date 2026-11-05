import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

// Routes Landfall runs regularly: a service map, not a client list.
const ROUTES = [
  ['BLR', 'BER'],
  ['GRU', 'LIS'],
  ['LOS', 'LHR'],
  ['MNL', 'YYZ'],
  ['CAI', 'AMS'],
  ['SGN', 'SIN'],
  ['MEX', 'MAD'],
  ['KHI', 'DXB'],
  ['NBO', 'DUB'],
]

function Track() {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {ROUTES.map(([a, b]) => (
        <li key={a + b} className="flex items-center gap-4 px-8 font-display text-[1.6rem] font-medium tracking-[-0.02em] text-paper md:px-12 md:text-[2rem]">
          <span>{a}</span>
          <span className="flex items-center" aria-hidden="true">
            <span className="h-px w-8 bg-paper/40 md:w-12" />
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          <span className="text-paper/55">{b}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Corridors() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const loop = gsap.to('.corridor-track', { xPercent: -50, duration: 48, ease: 'none', repeat: -1 })
        // Pause the ticker strip while it is off screen.
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? loop.play() : loop.pause()))
        io.observe(root.current)
        return () => io.disconnect()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="bg-ink py-7 text-paper" aria-label="Relocation corridors we run every month">
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper/45 md:px-10">
        <span>Corridors we run every month</span>
        <span className="hidden sm:inline">Origin → destination</span>
      </div>
      <p className="sr-only">
        Bengaluru to Berlin, São Paulo to Lisbon, Lagos to London, Manila to Toronto, Cairo to Amsterdam, Ho Chi Minh City
        to Singapore, Mexico City to Madrid, Karachi to Dubai, Nairobi to Dublin.
      </p>
      <div className="overflow-hidden">
        <div className="corridor-track flex w-max">
          <Track />
          <Track />
        </div>
      </div>
    </section>
  )
}
