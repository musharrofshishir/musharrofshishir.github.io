import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ConstellationField from './ConstellationField'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero — Full-viewport hero section
 *
 * Features:
 * - Interactive constellation particle network (cursor-reactive)
 * - Large serif headline with staggered reveal
 * - Subtitle and CTA
 * - Subtle parallax on background elements
 * - Clickable scroll indicator
 */
function Hero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const decorRef = useRef(null)
  const constellationRef = useRef(null)

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set('.hero-line', { y: 120, opacity: 0 })
      gsap.set(subtitleRef.current, { y: 40, opacity: 0 })
      gsap.set(ctaRef.current, { y: 30, opacity: 0 })
      gsap.set(scrollIndicatorRef.current, { opacity: 0 })
      gsap.set(constellationRef.current, { opacity: 0 })

      // Entrance timeline — triggered after loader
      const tl = gsap.timeline({ delay: 5.5 })

      // Constellation fades in
      tl.to(constellationRef.current, {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      })

      // Staggered headline reveal
      tl.to('.hero-line', {
        y: 0, opacity: 1,
        duration: 1.2, stagger: 0.15,
        ease: 'power3.out',
      }, '-=1.5')

      // Subtitle
      tl.to(subtitleRef.current, {
        y: 0, opacity: 1,
        duration: 0.8, ease: 'power2.out',
      }, '-=0.6')

      // CTA
      tl.to(ctaRef.current, {
        y: 0, opacity: 1,
        duration: 0.6, ease: 'power2.out',
      }, '-=0.4')

      // Scroll indicator
      tl.to(scrollIndicatorRef.current, {
        opacity: 1, duration: 0.6,
      }, '-=0.2')

      // Parallax on scroll
      gsap.to(decorRef.current, {
        yPercent: -30, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top',
          scrub: 1,
        },
      })

      // Fade hero content on scroll
      gsap.to(headlineRef.current, {
        opacity: 0, y: -80, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '20% top', end: '60% top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Interactive constellation background */}
      <div ref={constellationRef} className="absolute inset-0 z-0" style={{ opacity: 0 }}>
        <ConstellationField />
      </div>

      {/* Background decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none z-[1]">
        {/* Subtle gradient orb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #C8A96E 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Main content */}
      <div ref={headlineRef} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center">
        {/* Eyebrow */}
        <div className="overflow-hidden mb-8">
          <p className="hero-line font-sans text-xs tracking-[0.3em] uppercase text-accent">
            Portfolio — 2021 / 2026
          </p>
        </div>

        {/* Headline — centered for more impact */}
        <div className="space-y-0">
          <div className="overflow-hidden">
            <h1 className="hero-line font-serif text-display font-medium text-text-primary">
              Creative
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-line font-serif text-display font-medium text-text-primary">
              Developer<span className="text-accent">.</span>
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-lg md:text-xl text-text-secondary max-w-lg mx-auto leading-relaxed mt-10"
        >
          Technical Product Specialist crafting pixel-perfect interfaces
          with React, Next.js & motion design.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-3 font-sans text-sm tracking-[0.15em] uppercase text-text-primary border border-white/10 rounded-full px-8 py-4 hover:border-accent hover:text-accent transition-all duration-500"
            data-cursor="hover"
          >
            View selected work
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0H8.25m11.25 0V8.25" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator — CLICKABLE */}
      <div
        ref={scrollIndicatorRef}
        onClick={scrollToNext}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none z-10"
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollToNext()}
        data-cursor="hover"
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-text-secondary">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-text-secondary/50 to-transparent relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-4 bg-accent"
            style={{ animation: 'scrollDown 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-16px); }
          50% { transform: translateY(48px); }
          100% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  )
}

export default Hero
