import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Experience — Vertical timeline
 * 
 * Displays a 5-year career progression at Appifylab,
 * with items that fade and slide in on scroll.
 * Features a vertical line with animated progress.
 */

const experiences = [
  {
    year: 'Nov 2024 — Mar 2026',
    title: 'Senior UI Developer / Senior Technical Support / Bug Fixing Team Lead',
    company: 'Appifylab',
    description:
      'Directed a bug-fixing team, streamlining the end-to-end issue lifecycle and reducing Time-to-Resolution. Spearheaded the transition of legacy UI components to Next.js & Tailwind CSS. Partnered with CEO and COO on product research, feature prioritization, and translating user feedback into technical requirements. Conducted high-conversion technical product demos for international clients.',
    tags: ['Next.js', 'Tailwind CSS', 'Team Leadership', 'Product Ops', 'Calendly', 'Trello', 'Crisp', 'Zapier'],
  },
  {
    year: 'Nov 2021 — Apr 2024',
    title: 'Senior Front End Developer / UI Engineer',
    company: 'Appifylab',
    description:
      'Took ownership of complex UI features — real-time dashboards, multi-step wizards, and scalable component architecture. Built the frontend for Housiko, an international real estate marketplace, with high-speed search filters. Championed accessibility standards (WCAG 2.1 AA) and modular component libraries. During this period, I did the Housiko UI design as well from Figma to production.',
    tags: ['React', 'Javascript', 'Figma', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    year: 'Apr 2021 — Oct 2021',
    title: 'Front End Developer',
    company: 'Appifylab',
    description:
      'Started professional journey executing frontend layouts and interactive components using HTML, CSS, and JavaScript. Contributed to Appifylab\'s clients & flagship products from day one, rapidly growing from junior to mid to senior-level capabilities.',
    tags: ['HTML/CSS', 'JavaScript', 'React', 'Figma'],
  },
]

function Experience() {
  const sectionRef = useRef(null)
  const timelineLineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the timeline line growing as user scrolls
      gsap.fromTo(
        timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      )

      // Reveal each experience item
      gsap.utils.toArray('.exp-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Animate the dots
      gsap.utils.toArray('.exp-dot').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-20 md:py-40 overflow-hidden"
    >
      {/* Large decorative background number */}
      <div className="absolute top-20 left-0 font-serif text-[20rem] md:text-[30rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none">
        02
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-accent" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-accent">
              Experience
            </span>
          </div>
          <h2 className="font-serif text-heading text-text-primary">
            The journey<span className="text-accent">.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] md:-translate-x-[0.5px]">
            <div className="absolute inset-0 bg-white/5" />
            <div
              ref={timelineLineRef}
              className="absolute inset-0 bg-gradient-to-b from-accent via-accent/50 to-transparent origin-top"
            />
          </div>

          {/* Items */}
          <div className="space-y-16 md:space-y-24">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`exp-item relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${index % 2 === 0 ? '' : 'md:text-right'
                  }`}
              >
                {/* Dot on timeline */}
                <div className="exp-dot absolute left-0 md:left-1/2 top-2 w-3 h-3 rounded-full bg-accent -translate-x-[5px] md:-translate-x-[6px] z-10 shadow-[0_0_12px_rgba(200,169,110,0.4)]" />

                {/* Content - alternating sides on desktop */}
                <div
                  className={`pl-8 md:pl-0 ${index % 2 === 0
                      ? 'md:pr-16'
                      : 'md:col-start-2 md:pl-16'
                    }`}
                >
                  {/* Year */}
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3 block">
                    {exp.year}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xl md:text-2xl text-text-primary mb-2 leading-tight">
                    {exp.title}
                  </h3>

                  {/* Company */}
                  <p className="font-sans text-sm text-text-secondary mb-4">
                    {exp.company}
                  </p>

                  {/* Description */}
                  <p className="font-sans text-sm text-text-secondary/80 leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Tags */}
                  <div className={`flex flex-wrap gap-2 ${index % 2 !== 0 ? 'md:justify-end' : ''}`}>
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border border-white/10 text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
