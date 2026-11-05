import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * A small plane that flies down the page as you scroll, leaving a curvy
 * dashed trail. The route is rebuilt from the real section positions, so it
 * always threads through the layout and lands on the "Plan a move" ticket.
 *
 * - The trail layer uses mix-blend-mode: difference, so the same white stroke
 *   reads as dark on white sections and light on dark ones.
 * - Position is driven by GSAP (quickTo) from ScrollTrigger progress.
 * - Reduced motion: the full route is shown statically, no plane.
 */

const SAMPLES = 600

// Catmull-Rom → cubic Bézier for a smooth curve through every point.
function smoothPath(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

function buildRoute(container) {
  const W = container.offsetWidth
  const H = container.offsetHeight
  const box = container.getBoundingClientRect()
  const sections = [...container.querySelectorAll(':scope > main > section')]
  const narrow = W < 768
  const left = narrow ? 0.1 : 0.06
  const right = narrow ? 0.9 : 0.94

  const wide = W >= 1024
  const pts = []

  sections.forEach((s, i) => {
    if (s.id === 'contact') return
    if (s.id === 'top') {
      // Hero: enter from the left under the nav, then descend through the
      // gutter between the headline and the relocation pass (desktop), or
      // down the right edge on smaller screens.
      const h = s.offsetHeight
      pts.push([-80, 118], [W * 0.32, 100])
      if (wide) pts.push([W * 0.585, h * 0.42], [W * 0.56, h * 0.9])
      else pts.push([W * 0.93, h * 0.35], [W * 0.9, h * 0.88])
      return
    }
    const r = s.getBoundingClientRect()
    const top = r.top - box.top
    const h = r.height
    const side = i % 2 === 0 ? right : left
    // Short sections (the corridor strip) get one gentle point; tall ones get an S-bend.
    if (h < 300) {
      pts.push([W * (i % 2 ? 0.62 : 0.38), top + h / 2])
    } else {
      pts.push([W * side, top + h * 0.3])
      pts.push([W * (side === right ? 0.55 : 0.45), top + h * 0.72])
    }
  })

  // Touch down on the move-request ticket.
  const contact = container.querySelector('#contact')
  if (contact) {
    const r = contact.getBoundingClientRect()
    const top = r.top - box.top
    pts.push([W * 0.78, top + 40])
    pts.push([W * (narrow ? 0.82 : 0.9), top + Math.min(r.height * 0.32, 260)])
  }

  return { d: smoothPath(pts), W, H }
}

function Plane() {
  // Top-down silhouette pointing along +x, so rotation = path angle.
  return (
    <g stroke="#141414" strokeWidth="0.9" strokeLinejoin="round">
      <path
        d="M-17 0 C-17 -2.2 -14 -3 -10 -3 L12 -3 C17 -3 20 -1.5 21 0 C20 1.5 17 3 12 3 L-10 3 C-14 3 -17 2.2 -17 0 Z"
        fill="#FF5A1F"
      />
      <path d="M2 -2.5 L-6 -19 L-1.5 -19 L11 -2.5 Z M2 2.5 L-6 19 L-1.5 19 L11 2.5 Z" fill="#FF5A1F" />
      <path d="M-11 -2 L-16 -9 L-13 -9 L-7 -2 Z M-11 2 L-16 9 L-13 9 L-7 2 Z" fill="#FF5A1F" />
      <path d="M12 -1.6 L17 -1.2 L17 1.2 L12 1.6 Z" fill="#141414" opacity="0.55" />
    </g>
  )
}

export default function FlightPath({ containerRef }) {
  const [route, setRoute] = useState(null)
  const routePath = useRef(null)
  const maskPath = useRef(null)
  const plane = useRef(null)
  const reduce = useRef(false)

  // Build (and rebuild) the route from the live layout.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let lastKey = ''
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const key = `${el.offsetWidth}x${el.offsetHeight}`
        if (key === lastKey) return
        lastKey = key
        setRoute(buildRoute(el))
      })
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [containerRef])

  // Fly the plane: scroll position → the point on the route level with mid-screen.
  useEffect(() => {
    if (!route || reduce.current) return
    const path = routePath.current
    const total = path.getTotalLength()

    // Lookup table: length → y, so we can find where the route crosses any height.
    const ys = new Float32Array(SAMPLES + 1)
    for (let i = 0; i <= SAMPLES; i++) ys[i] = path.getPointAtLength((total * i) / SAMPLES).y
    const lengthAtY = (y) => {
      // Furthest sample whose y is still above the target (route is mostly downward).
      let best = 0
      for (let i = 0; i <= SAMPLES; i++) if (ys[i] <= y) best = i
      if (best >= SAMPLES) return total
      const y0 = ys[best]
      const y1 = ys[best + 1]
      const t = y1 > y0 ? Math.min(1, Math.max(0, (y - y0) / (y1 - y0))) : 0
      return (total * (best + t)) / SAMPLES
    }

    const state = { len: 0 }
    const render = () => {
      const l = Math.max(0.01, Math.min(total, state.len))
      const p = path.getPointAtLength(l)
      const q = path.getPointAtLength(Math.min(total, l + 1))
      const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
      plane.current.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`)
      maskPath.current.style.strokeDashoffset = String(total - l)
    }

    maskPath.current.style.strokeDasharray = `${total} ${total}`
    const fly = gsap.quickTo(state, 'len', { duration: 0.9, ease: 'power3.out', onUpdate: render })

    const el = containerRef.current
    const target = () => {
      const top = el.getBoundingClientRect().top
      // Aim slightly above the middle of the viewport so the plane leads the reader.
      return lengthAtY(window.innerHeight * 0.45 - top)
    }

    state.len = target()
    render()
    gsap.fromTo(plane.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.6 })

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
  const { d, W, H } = route
  const staticOnly = reduce.current

  return (
    <>
      {/* Trail: the blend mode sits on the layer root so it blends with the page itself. */}
      <div
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        style={{ mixBlendMode: 'difference' }}
        aria-hidden="true"
      >
      <svg className="absolute left-0 top-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <mask id="flight-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <path
              ref={maskPath}
              d={d}
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              strokeLinecap="round"
              style={staticOnly ? undefined : { strokeDasharray: '0 1e9' }}
            />
          </mask>
        </defs>
        {/* Measuring path (invisible) */}
        <path ref={routePath} d={d} fill="none" stroke="none" />
        {/* The visible dashed trail */}
        <path
          d={d}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
          mask={staticOnly ? undefined : 'url(#flight-reveal)'}
        />
      </svg>
      </div>

      {!staticOnly && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
        <svg className="absolute left-0 top-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g ref={plane} style={{ opacity: 0 }}>
            <g transform={`scale(${W < 768 ? 0.8 : 1.05})`}>
              <Plane />
            </g>
          </g>
        </svg>
        </div>
      )}
    </>
  )
}
