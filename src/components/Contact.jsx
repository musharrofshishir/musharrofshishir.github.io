import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Contact — CTA section with orbiting rings
 * 
 * A big, bold call-to-action inviting collaboration.
 * Features animated text reveal, parallax gradient,
 * and a creative orbiting ring/particle animation.
 */
function Contact() {
  const sectionRef = useRef(null)
  const orbitRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations
      gsap.utils.toArray('.contact-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
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

      // Parallax on the decorative gradient
      gsap.to('.contact-orb', {
        yPercent: -20,
        xPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Continuous rotation for the orbit rings
      gsap.to('.orbit-ring-1', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })
      gsap.to('.orbit-ring-2', {
        rotation: -360,
        duration: 30,
        repeat: -1,
        ease: 'none',
      })
      gsap.to('.orbit-ring-3', {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: 'none',
      })

      // Floating dots phase animation
      gsap.utils.toArray('.orbit-dot').forEach((dot, i) => {
        gsap.to(dot, {
          scale: gsap.utils.random(0.6, 1.4),
          opacity: gsap.utils.random(0.3, 1),
          duration: gsap.utils.random(1.5, 3),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 md:py-40 overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div
        className="contact-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #C8A96E 0%, transparent 60%)',
        }}
      />

      {/* Orbiting rings — the creative moving element */}
      <div
        ref={orbitRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        {/* Ring 1 — large, tilted */}
        <div
          className="orbit-ring-1 absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full border border-white/[0.04]"
          style={{ transform: 'rotateX(60deg) rotateZ(0deg)' }}
        >
          <div className="orbit-dot absolute top-0 left-1/2 w-2 h-2 rounded-full bg-accent/60 -translate-x-1/2 -translate-y-1/2" />
          <div className="orbit-dot absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/40 -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Ring 2 — medium, differently tilted */}
        <div
          className="orbit-ring-2 absolute -top-[200px] -left-[200px] w-[400px] h-[400px] rounded-full border border-white/[0.06]"
          style={{ transform: 'rotateX(75deg) rotateZ(45deg)' }}
        >
          <div className="orbit-dot absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-text-primary/50 -translate-x-1/2 -translate-y-1/2" />
          <div className="orbit-dot absolute right-0 top-1/2 w-2.5 h-2.5 rounded-full bg-accent/50 translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Ring 3 — small, fastest tilt */}
        <div
          className="orbit-ring-3 absolute -top-[120px] -left-[120px] w-[240px] h-[240px] rounded-full border border-accent/[0.08]"
          style={{ transform: 'rotateX(50deg) rotateZ(-30deg)' }}
        >
          <div className="orbit-dot absolute left-0 top-1/2 w-1 h-1 rounded-full bg-accent/80 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center relative z-10">
        {/* Section label */}
        <div className="contact-reveal mb-8">
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-accent inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-accent" />
            Get in Touch
            <span className="w-8 h-[1px] bg-accent" />
          </span>
        </div>

        {/* Big headline */}
        <div className="contact-reveal mb-10">
          <h2 className="font-serif text-display text-text-primary">
            Let's build
            <br />
            something <span className="text-accent italic">great</span>
          </h2>
        </div>

        {/* Subtext */}
        <div className="contact-reveal mb-12">
          <p className="font-sans text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
            I'm always open to discussing new projects, creative ideas,
            or opportunities to be part of your vision.
          </p>
        </div>

        {/* CTA Button */}
        <div className="contact-reveal">
          <a
            href="mailto:hello@musharrofshishir.com"
            className="group inline-flex items-center gap-4 font-sans text-sm tracking-[0.15em] uppercase bg-accent text-base px-10 py-5 rounded-full hover:bg-accent-light transition-all duration-500 hover:shadow-[0_0_40px_rgba(200,169,110,0.3)]"
            data-cursor="hover"
          >
            Say hello
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Social links */}
        <div className="contact-reveal mt-16 flex items-center justify-center gap-8">
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kazi-shishir' },
            { label: 'GitHub', href: 'https://github.com/musharrofshishir' },
            { label: 'Discord', href: 'https://discord.gg/rSq3fEayHW' },
            // { label: 'Contra', href: 'https://contra.com/musharrof_shishir_98yzp5dh?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=musharrof_shishir_98yzp5dh' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.15em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
              data-cursor="hover"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact
