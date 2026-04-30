import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import FeaturedProjects from './components/FeaturedProjects'
import Contact from './components/Contact'
import Footer from './components/Footer'

/**
 * App — Main orchestrator
 * Manages loading state and renders all sections
 * inside the SmoothScroll wrapper.
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)
  const mainContentRef = useRef(null)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // After loading completes → hero zoom-in effect
  useEffect(() => {
    if (!isLoading && mainContentRef.current) {
      gsap.to(
        mainContentRef.current,
        {
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.1,
          clearProps: 'transform',
        }
      )
    }
  }, [isLoading])

  // Lock scroll during loading and reset scroll position
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  return (
    <>
      {/* Custom cursor — always visible */}
      <CustomCursor />

      {/* Loading screen */}
      <Loader onComplete={handleLoadingComplete} />

      {/* Main content — animated in after loading */}
      <div
        ref={mainContentRef}
        style={{ opacity: 0 }}
      >
        <SmoothScroll>
          {/* Noise texture overlay */}
          <div className="noise" />

          <Navbar />

          <main>
            <Hero />
            <About />
            <Experience />
            <FeaturedProjects />
            <Contact />
          </main>

          <Footer />
        </SmoothScroll>
      </div>
    </>
  )
}

export default App
