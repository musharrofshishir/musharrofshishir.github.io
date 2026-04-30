import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticlePortrait from './ParticlePortrait'

gsap.registerPlugin(ScrollTrigger)

/**
 * About — Personal introduction with cycling particle portrait
 *
 * ABOUT IMAGE INTERACTION 2:
 * - When section scrolls into view, particles zoom in to form image 1
 * - After 5s, particles dissolve out and image 2 zooms in
 * - Cycles between both images continuously
 * - Hover burst interaction works during idle phase
 */

const IMAGE_SOURCES = [
  '/assets/images/self.png',
  '/assets/images/self2.png',
]

function About() {
  const sectionRef = useRef(null)
  const portraitContainerRef = useRef(null)
  const [portraitActive, setPortraitActive] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-in for all reveal elements
      gsap.utils.toArray('.about-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Trigger particle zoom-in when section enters viewport
      ScrollTrigger.create({
        trigger: portraitContainerRef.current,
        start: 'top 80%',
        onEnter: () => setPortraitActive(true),
        once: true, // Only trigger once — the cycling handles the rest
      })

      // Parallax on the large decorative number
      gsap.to('.about-number', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Delivered' },
    { value: '1', label: 'Chrome Extension' },
  ]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 md:py-40 overflow-hidden"
    >
      {/* Large decorative background number */}
      <div className="about-number absolute top-20 right-0 font-serif text-[20rem] md:text-[30rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none">
        01
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="about-reveal mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-accent" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-accent">
              About
            </span>
          </div>
        </div>

        {/* Main layout: Portrait + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Particle Portrait */}
          <div
            ref={portraitContainerRef}
            className="lg:col-span-5 flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Soft glow */}
              <div
                className="absolute inset-0 blur-3xl opacity-[0.08] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, #C8A96E 0%, transparent 60%)',
                }}
              />

              {/* Decorative frame accent — thin corner lines */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-accent/20 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-accent/20 pointer-events-none" />

              <ParticlePortrait
                imageSources={IMAGE_SOURCES}
                width={440}
                height={540}
                active={portraitActive}
                className="relative z-10"
              />

              {/* Name tag below portrait */}
              <div className="mt-6 text-center lg:text-left pl-8">
                <p className="font-serif text-lg text-text-primary">
                  Musharrof Shishir
                </p>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mt-1">
                  Design & Product Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Right: Bio content */}
          <div className="lg:col-span-7">
            {/* Headline */}
            <div className="about-reveal mb-10">
              <h2 className="font-serif text-heading text-text-primary leading-tight">
                Crafting digital
                <br />
                experiences that
                <br />
                <span className="text-accent italic">resonate.</span>
              </h2>
            </div>

            {/* Bio paragraphs */}
            <div className="about-reveal space-y-6 mb-12">
              <p className="font-sans text-base md:text-lg text-text-secondary leading-relaxed">
                I'm a Design & Product Engineer with 5+ years of experience specializing in
                high-fidelity, motion-rich interfaces for SaaS and AI-driven platforms.
                At Appifylab, I evolved from a front-end developer into a Technical Lead —
                managing cross-functional teams, collaborating with C-suite leadership, and
                shipping production-level React & Next.js applications.
              </p>
              <p className="font-sans text-base md:text-lg text-text-secondary leading-relaxed">
                I obsess over the details that most overlook: sub-pixel alignment, motion timing curves,
                accessible color contrast, and the invisible craft that makes a UI feel{' '}
                <em className="text-text-primary not-italic font-medium">premium</em>.
              </p>
            </div>

            {/* Signature skills — horizontal tags */}
            <div className="about-reveal mb-12">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-text-secondary mb-4">
                Core expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'JavaScript (ES6+)', 'GSAP', 'Tailwind CSS', 'Figma', 'Technical Leadership', 'Shopify', 'WordPress'].map((skill) => (
                  <span
                    key={skill}
                    className="font-sans text-[11px] tracking-[0.05em] px-4 py-2 rounded-full border border-white/8 text-text-secondary hover:border-accent/30 hover:text-accent transition-colors duration-300"
                    data-cursor="hover"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="about-reveal pt-8 border-t border-white/5">
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-4xl md:text-5xl font-medium text-text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="font-sans text-xs tracking-[0.15em] uppercase text-text-secondary">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
