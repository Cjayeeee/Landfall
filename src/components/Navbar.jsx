import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollToTarget, startScroll, stopScroll } from '../hooks/useLenis'
import Logo from './Logo'
import Button from './Button'

const LINKS = [
  { href: '#process', label: 'How a move runs' },
  { href: '#desks', label: 'For HR teams' },
  { href: '#handle', label: 'What we handle' },
  { href: '#case', label: 'Case file' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const wrap = useRef(null)
  const header = useRef(null)
  const panel = useRef(null)
  const tl = useRef(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      // Mobile menu timeline, built once, played/reversed on toggle.
      gsap.set(panel.current, { autoAlpha: 0 })
      tl.current = gsap
        .timeline({ paused: true })
        .to(panel.current, { autoAlpha: 1, duration: 0.25, ease: 'none' })
        .from(panel.current.querySelectorAll('.menu-item'), {
          yPercent: 110,
          duration: 0.7,
          stagger: 0.05,
          ease: 'expo.out',
        }, '<0.05')
        .from(panel.current.querySelector('.menu-foot'), { autoAlpha: 0, y: 12, duration: 0.4 }, '<0.25')

      // Hide on scroll down, reveal on scroll up.
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const hide = gsap.to(header.current, { yPercent: -100, duration: 0.45, ease: 'power3.inOut', paused: true })
        ScrollTrigger.create({
          start: 'top -120',
          end: 'max',
          onUpdate: (self) => (self.direction === 1 ? hide.play() : hide.reverse()),
          onLeaveBack: () => hide.reverse(),
        })
      })
    },
    { scope: wrap },
  )

  const toggle = (next) => {
    setOpen(next)
    if (next) {
      stopScroll()
      tl.current.timeScale(1).play()
    } else {
      startScroll()
      tl.current.timeScale(1.6).reverse()
    }
  }

  const go = (e, href) => {
    e.preventDefault()
    if (open) toggle(false)
    scrollToTarget(href)
  }

  return (
    <div ref={wrap}>
    <header
      ref={header}
      className={`fixed inset-x-0 top-0 z-50 border-b ${open ? 'border-transparent bg-ink' : 'border-ink/10 bg-paper'}`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:px-10" aria-label="Primary">
        <a href="#top" onClick={(e) => go(e, '#top')} aria-label="Landfall, back to top" className="relative">
          <Logo tone={open ? 'paper' : 'ink'} />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="text-[0.92rem] text-ink/75 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="#contact" variant="ink" className="!py-3 !px-5 !gap-4 text-[0.88rem]">
            Plan a move
          </Button>
        </div>

        <button
          type="button"
          className="relative -mr-2 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => toggle(!open)}
        >
          {open ? <X className="h-6 w-6 text-paper" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
    </header>

      <div
        ref={panel}
        id="mobile-menu"
        className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 text-paper lg:hidden"
        aria-hidden={!open}
      >
        <ul className="space-y-1">
          {LINKS.concat({ href: '#contact', label: 'Plan a move' }).map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={(e) => go(e, l.href)}
                className="menu-item flex items-baseline gap-4 py-1 font-display text-[2.4rem] font-medium leading-tight tracking-[-0.03em]"
              >
                <span className="font-mono text-xs text-paper/40">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="menu-foot max-w-xs font-mono text-xs leading-relaxed text-paper/50">
          moves@landfall.example. Replies within one working day, in your time zone.
        </p>
      </div>
    </div>
  )
}
