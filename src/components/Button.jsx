import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'

const VARIANTS = {
  ink: { base: 'bg-ink text-paper', fill: 'bg-signal', rest: '#FFFFFF', hover: '#141414' },
  signal: { base: 'bg-signal text-ink', fill: 'bg-ink', rest: '#141414', hover: '#FFFFFF' },
  paper: { base: 'bg-paper text-ink', fill: 'bg-ink', rest: '#141414', hover: '#FFFFFF' },
}

/**
 * Button with a GSAP-driven wipe fill. Renders an <a> when given href,
 * otherwise a <button>. Hash links scroll through Lenis.
 */
export default function Button({
  href,
  variant = 'ink',
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const root = useRef(null)
  const v = VARIANTS[variant]

  const { contextSafe } = useGSAP(
    () => {
      gsap.set('.btn-fill', { yPercent: 101 })
    },
    { scope: root },
  )

  const enter = contextSafe(() => {
    gsap.to('.btn-fill', { yPercent: 0, duration: 0.5, ease: 'expo.out', overwrite: true })
    gsap.to(root.current, { color: v.hover, duration: 0.3, overwrite: 'auto' })
    gsap.to('.btn-icon', { rotate: 45, duration: 0.5, ease: 'expo.out', overwrite: true })
  })

  const leave = contextSafe(() => {
    gsap.to('.btn-fill', { yPercent: -101, duration: 0.45, ease: 'expo.inOut', overwrite: true,
      onComplete: () => gsap.set('.btn-fill', { yPercent: 101 }) })
    gsap.to(root.current, { color: v.rest, duration: 0.3, overwrite: 'auto' })
    gsap.to('.btn-icon', { rotate: 0, duration: 0.45, ease: 'expo.out', overwrite: true })
  })

  const handleClick = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      scrollToTarget(href)
    }
    onClick?.(e)
  }

  const classes = `relative inline-flex items-center justify-between gap-6 overflow-hidden px-6 py-4 font-sans text-[0.95rem] font-medium tracking-[-0.01em] ${v.base} ${className}`

  const inner = (
    <>
      <span className={`btn-fill pointer-events-none absolute inset-0 ${v.fill}`} aria-hidden="true" />
      <span className="relative">{children}</span>
      <ArrowUpRight className="btn-icon relative h-[1.1em] w-[1.1em]" strokeWidth={1.75} aria-hidden="true" />
    </>
  )

  const handlers = {
    onMouseEnter: enter,
    onMouseLeave: leave,
    onFocus: enter,
    onBlur: leave,
  }

  if (href) {
    return (
      <a ref={root} href={href} className={classes} onClick={handleClick} {...handlers} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={root} type={type} className={classes} onClick={handleClick} {...handlers} {...rest}>
      {inner}
    </button>
  )
}
