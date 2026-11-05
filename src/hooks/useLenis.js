import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

let lenis = null
const NAV_OFFSET = -76

/** Smooth-scroll to a selector or element; falls back to native when Lenis is off. */
export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.3 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
    window.scrollTo({ top, behavior: 'auto' })
  }
}

export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

/**
 * Lenis driven by GSAP's ticker so ScrollTrigger and smooth scroll share one clock.
 * Skipped entirely for users who prefer reduced motion.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 })
    lenis = instance

    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [])
}
