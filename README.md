# Landfall: relocation for international hires

A portfolio concept: marketing site for a fictional global-mobility firm that relocates
international hires end to end (visas, housing, local admin, family support).

**Stack:** React 18 · Vite · Tailwind CSS v4 · GSAP + ScrollTrigger (`@gsap/react`) · Lenis · Lucide

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Creative direction

- **Concept:** travel documents. The hero is built around a "relocation pass" (a boarding-pass
  ticket with route, passenger fields, checklist and a stamp). Section labels, codes and metadata use a
  mono "document" voice.
- **Palette:** white `#FFFFFF` with a warm tint `#F6F3EC` for ticket surfaces, ink `#141414`, graphite `#1D1D1C`, one transit-signal orange `#FF5A1F`.
  Photography is uniformly greyscale.
- **Type:** Bricolage Grotesque (display) · Instrument Sans (body) · JetBrains Mono (labels). Self-hosted via Fontsource.
- **Honesty:** no fake logos, stats or testimonials. The "Case file" is labelled as an illustrative scenario,
  and the corridor strip is a service map, not a client list.

## Motion rules

GSAP is the only animation engine. There are no CSS transitions, keyframes or animation utilities.
CSS handles static styling only.

| Where | What |
| --- | --- |
| Hero | Line-mask headline, underline draw, pass entrance, checklist stagger, stamp |
| Corridors | Slow infinite ticker, paused when off screen |
| Process | Route line scrubbed with scroll (horizontal on desktop, vertical on mobile) |
| Two desks | Clip-path image reveal + gentle parallax |
| What we handle | Accessible vertical tabs with GSAP image wipe and copy crossfade |
| Flight path | Plane flies a curvy dashed route through every section as you scroll, landing on the move-request ticket |
| FAQ / buttons / nav | GSAP accordion, button fill wipe, hide-on-scroll nav, mobile menu timeline |

All scroll-driven motion is registered inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`,
and Lenis is skipped entirely for reduced-motion users. Every hook uses `useGSAP` for automatic cleanup
(safe under React Strict Mode). Lenis is driven by `gsap.ticker` and feeds `ScrollTrigger.update`.

## Structure

```
src/
  components/  Navbar, Footer, Button, Logo, SectionLabel
  sections/    Hero, Corridors, Process, TwoDesks, Plate, CaseFile, Faq, Contact
  hooks/       useLenis.js  (Lenis + scrollToTarget helper)
  lib/         gsap.js      (plugin registration, shared defaults)
```

Images are hot-linked from Unsplash. The contact form is front-end only (it shows a confirmation state and sends nothing).
