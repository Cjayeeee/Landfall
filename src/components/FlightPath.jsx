import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * A small plane that flies down the page as you scroll, leaving a curvy
 * dashed trail, and lands on the "Plan a move" ticket.
 *
 * Performance notes:
 * - The route is sampled once in plain JS (no per-frame SVG geometry calls).
 * - The trail is split into short chunks. Finished chunks are only shown or
 *   hidden; only the chunk the plane is currently drawing is updated each
 *   frame, so the browser repaints a small area instead of the whole page.
 * - Each chunk takes its colour from the section beneath it, so there is
 *   no full-page blend mode to composite.
 * - The plane is a small element moved with GSAP transforms (GPU only).
 * - Building waits until the hero intro has played, and rebuilds are debounced.
 */

const STEP = 6 // px between samples along the route
const CHUNK = 36 // samples per trail chunk (~200px)
const DASH = 7
const GAP = 9
const PERIOD = DASH + GAP
const INK = 'rgba(20,20,20,0.42)'
const LIGHT = 'rgba(255,255,255,0.5)'

// Catmull-Rom → cubic Bézier segments through every point.
function toCubics(pts) {
  const segs = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    segs.push([
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ])
  }
  return segs
}

const bez = (a, b, c, d, t) => {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

// Evenly spaced samples (by arc length) along the cubic chain.
function sample(segs) {
  const dense = []
  segs.forEach(([a, b, c, d], i) => {
    for (let k = i === 0 ? 0 : 1; k <= 40; k++) {
      const t = k / 40
      dense.push([bez(a[0], b[0], c[0], d[0], t), bez(a[1], b[1], c[1], d[1], t)])
    }
  })
  const xs = [dense[0][0]]
  const ys = [dense[0][1]]
  let carry = 0
  for (let i = 1; i < dense.length; i++) {
    const [x0, y0] = dense[i - 1]
    const [x1, y1] = dense[i]
    const seg = Math.hypot(x1 - x0, y1 - y0)
    let pos = STEP - carry
    while (pos <= seg) {
      const t = pos / seg
      xs.push(x0 + (x1 - x0) * t)
      ys.push(y0 + (y1 - y0) * t)
      pos += STEP
    }
    carry = seg - (pos - STEP)
  }
  return { xs: Float32Array.from(xs), ys: Float32Array.from(ys) }
}

function isDark(el) {
  const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)
  if (!m || (m.length === 4 && Number(m[3]) === 0)) return false
  const [r, g, b] = m.map(Number)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.4
}

function buildRoute(container) {
  const W = container.offsetWidth
  const H = container.offsetHeight
  const box = container.getBoundingClientRect()
  const sections = [...container.querySelectorAll(':scope > main > section')]
  const narrow = W < 768
  const wide = W >= 1024
  const left = narrow ? 0.1 : 0.06
  const right = narrow ? 0.9 : 0.94

  const bands = [] // [top, bottom, dark]
  const pts = []

  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect()
    const top = r.top - box.top
    const h = r.height
    bands.push([top, top + h, isDark(s)])

    if (s.id === 'contact') {
      // Touch down on the move-request ticket.
      pts.push([W * 0.78, top + 40])
      pts.push([W * (narrow ? 0.82 : 0.9), top + Math.min(h * 0.32, 260)])
      return
    }
    if (s.id === 'top') {
      // Hero: in from the left under the nav, then down the gutter between
      // the headline and the pass (desktop) or the right edge (smaller screens).
      pts.push([-80, 118], [W * 0.32, 100])
      if (wide) pts.push([W * 0.585, h * 0.42], [W * 0.56, h * 0.9])
      else pts.push([W * 0.93, h * 0.35], [W * 0.9, h * 0.88])
      return
    }
    const side = i % 2 === 0 ? right : left
    if (h < 300) {
      pts.push([W * (i % 2 ? 0.62 : 0.38), top + h / 2])
    } else {
      pts.push([W * side, top + h * 0.3])
      pts.push([W * (side === right ? 0.55 : 0.45), top + h * 0.72])
    }
  })

  const { xs, ys } = sample(toCubics(pts))
  const n = xs.length
  const darkAt = (y) => {
    for (const [t, b, d] of bands) if (y >= t && y < b) return d
    return false
  }

  // Chunks break every CHUNK samples and wherever the background changes tone.
  const chunks = []
  let start = 0
  let tone = darkAt(ys[0])
  for (let i = 1; i < n; i++) {
    const t = darkAt(ys[i])
    if (i - start >= CHUNK || t !== tone || i === n - 1) {
      let d = `M${xs[start].toFixed(1)} ${ys[start].toFixed(1)}`
      for (let k = start + 1; k <= i; k++) d += `L${xs[k].toFixed(1)} ${ys[k].toFixed(1)}`
      chunks.push({ start, end: i, d, color: tone ? LIGHT : INK, offset: (start * STEP) % PERIOD })
      start = i
      tone = t
    }
  }

  return { W, H, xs, ys, chunks, key: `${W}x${H}x${n}` }
}

function PlaneShape() {
  // Top-down silhouette pointing along +x.
  return (
    <svg width="48" height="48" viewBox="-24 -24 48 48" className="block overflow-visible">
      <g stroke="#141414" strokeWidth="0.9" strokeLinejoin="round" fill="#FF5A1F">
        <path d="M-17 0 C-17 -2.2 -14 -3 -10 -3 L12 -3 C17 -3 20 -1.5 21 0 C20 1.5 17 3 12 3 L-10 3 C-14 3 -17 2.2 -17 0 Z" />
        <path d="M2 -2.5 L-6 -19 L-1.5 -19 L11 -2.5 Z M2 2.5 L-6 19 L-1.5 19 L11 2.5 Z" />
        <path d="M-11 -2 L-16 -9 L-13 -9 L-7 -2 Z M-11 2 L-16 9 L-13 9 L-7 2 Z" />
      </g>
    </svg>
  )
}

export default function FlightPath({ containerRef }) {
  const [route, setRoute] = useState(null)
  const chunkEls = useRef([])
  const live = useRef(null)
  const plane = useRef(null)
  const reduce = useRef(false)

  // Build after the hero intro, then rebuild (debounced) when the layout changes size.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer = 0
    let lastKey = ''
    let ready = false
    const rebuild = () => {
      const key = `${el.offsetWidth}x${el.offsetHeight}`
      if (key === lastKey) return
      lastKey = key
      setRoute(buildRoute(el))
    }
    const ro = new ResizeObserver(() => {
      if (!ready) return
      clearTimeout(timer)
      timer = setTimeout(rebuild, 250)
    })
    ro.observe(el)
    const first = setTimeout(() => {
      ready = true
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1))
      idle(rebuild, { timeout: 500 })
    }, reduce.current ? 0 : 1300)
    return () => {
      ro.disconnect()
      clearTimeout(timer)
      clearTimeout(first)
    }
  }, [containerRef])

  // Fly: scroll position → the route point level with ~45% of the viewport.
  useEffect(() => {
    if (!route || reduce.current) return
    const { xs, ys, chunks } = route
    const n = xs.length
    const total = (n - 1) * STEP
    const el = containerRef.current

    const lengthAtY = (y) => {
      let best = 0
      for (let i = 0; i < n; i++) if (ys[i] <= y) best = i
      if (best >= n - 1) return total
      const y0 = ys[best]
      const y1 = ys[best + 1]
      const t = y1 > y0 ? Math.min(1, Math.max(0, (y - y0) / (y1 - y0))) : 0
      return (best + t) * STEP
    }

    let shownUpTo = -1 // index of last fully shown chunk
    const state = { len: 0 }

    const render = () => {
      const l = Math.max(0, Math.min(total, state.len))
      const f = l / STEP
      const i = Math.min(n - 2, Math.floor(f))
      const t = f - i
      const x = xs[i] + (xs[i + 1] - xs[i]) * t
      const y = ys[i] + (ys[i + 1] - ys[i]) * t
      const angle = (Math.atan2(ys[i + 1] - ys[i], xs[i + 1] - xs[i]) * 180) / Math.PI
      gsap.set(plane.current, { x, y, rotation: angle, force3D: true })

      // Finished chunks: toggle only the ones that changed.
      let c = 0
      while (c < chunks.length && chunks[c].end <= i) c++
      const target = c - 1
      if (target !== shownUpTo) {
        const lo = Math.min(target, shownUpTo) + 1
        const hi = Math.max(target, shownUpTo)
        for (let k = lo; k <= hi; k++) {
          const node = chunkEls.current[k]
          if (node) node.style.display = k <= target ? '' : 'none'
        }
        shownUpTo = target
      }

      // The chunk being drawn right now.
      const cur = chunks[c]
      if (cur) {
        let d = `M${xs[cur.start].toFixed(1)} ${ys[cur.start].toFixed(1)}`
        for (let k = cur.start + 1; k <= i; k++) d += `L${xs[k].toFixed(1)} ${ys[k].toFixed(1)}`
        d += `L${x.toFixed(1)} ${y.toFixed(1)}`
        live.current.setAttribute('d', d)
        live.current.setAttribute('stroke', cur.color)
        live.current.style.strokeDashoffset = String(cur.offset)
      } else {
        live.current.setAttribute('d', '')
      }
    }

    chunkEls.current.length = chunks.length
    chunkEls.current.forEach((node) => node && (node.style.display = 'none'))
    const fly = gsap.quickTo(state, 'len', { duration: 0.45, ease: 'power2.out', onUpdate: render })
    const target = () => lengthAtY(window.innerHeight * 0.45 - el.getBoundingClientRect().top)

    state.len = target()
    render()
    gsap.fromTo(plane.current, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => fly(target()),
      onRefresh: () => fly(target()),
    })

    return () => {
      st.kill()
      gsap.killTweensOf(state)
      gsap.killTweensOf(plane.current)
    }
  }, [route, containerRef])

  if (!route) return null
  const { W, H, chunks } = route
  const staticOnly = reduce.current

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      <svg className="absolute left-0 top-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={`${DASH} ${GAP}`}>
          {chunks.map((c, k) => (
            <path
              key={`${route.key}-${k}`}
              ref={(node) => (chunkEls.current[k] = node)}
              d={c.d}
              stroke={c.color}
              style={{ strokeDashoffset: c.offset, display: staticOnly ? undefined : 'none' }}
            />
          ))}
          {!staticOnly && <path ref={live} d="" />}
        </g>
      </svg>

      {!staticOnly && (
        <div ref={plane} className="absolute left-0 top-0 -ml-6 -mt-6 h-12 w-12" style={{ visibility: 'hidden' }}>
          <div className={W < 768 ? 'scale-[0.8]' : ''}>
            <PlaneShape />
          </div>
        </div>
      )}
    </div>
  )
}
