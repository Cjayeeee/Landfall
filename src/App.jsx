import { useEffect, useRef } from 'react'
import { useLenis } from './hooks/useLenis'
import { ScrollTrigger } from './lib/gsap'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FlightPath from './components/FlightPath'
import Hero from './sections/Hero'
import Corridors from './sections/Corridors'
import Process from './sections/Process'
import TwoDesks from './sections/TwoDesks'
import Plate from './sections/Plate'
import CaseFile from './sections/CaseFile'
import Faq from './sections/Faq'
import Contact from './sections/Contact'

export default function App() {
  useLenis()
  const page = useRef(null)

  // Images and web fonts change layout after mount; re-measure triggers once they settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      <div ref={page} className="relative">
        <main id="main">
        <Hero />
        <Corridors />
        <Process />
        <TwoDesks />
        <Plate />
        <CaseFile />
        <Faq />
        <Contact />
        </main>
        <FlightPath containerRef={page} />
      </div>
      <Footer />
    </>
  )
}
