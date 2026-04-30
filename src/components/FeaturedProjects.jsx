import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * FeaturedProjects — Horizontal scrolling project cards
 * 
 * Optimized for Lenis smooth scrolling compatibility.
 * Content is visible by default to ensure no "black screens".
 * IMPORTANT: Requires no parent transforms (like scale) to pin correctly.
 */

const projects = [
  {
    id: 'rylic',
    number: '01',
    title: 'Rylic Studio',
    subtitle: 'Design Agency',
    description:
      'A complete cutting-edge web presence for Rylic Studio. Featuring immersive animations, custom smooth scrolling, and a high-performance portfolio showcase.',
    tags: ['Next.js', 'GSAP', 'UI/UX', 'Animation'],
    color: '#4A2D3E',
    url: 'https://rylicstudio.com/',
  },
  {
    id: 'kagan',
    number: '02',
    title: 'Kagan Institute',
    subtitle: 'Educational Platform',
    description:
      'A premium educational interface for medical professionals. Focused on content hierarchy, accessibility, and a clean, high-end design language.',
    tags: ['React', 'SCSS', 'Medical', 'Education'],
    color: '#1A2D3E',
    url: 'https://www.kaganinstitute.com/',
  },
  {
    id: 'xeomin',
    number: '03',
    title: 'XeominPromo',
    subtitle: 'Healthcare Promotion',
    description:
        'A dedicated promotional platform designed for the Kagan Institute, featuring conversion-optimized layouts and high-performance frontend architecture.',
    tags: ['Marketing', 'Frontend', 'Optimization', 'Medical'],
    color: '#3E2D4A',
    url: 'https://xeominpromo.com/',
  },
  {
    id: 'impact',
    number: '04',
    title: 'Impact Lending Pros',
    subtitle: 'Financial Services',
    description:
      'A robust financial services dashboard for private lending. Built with a focus on data visualization, fast interactions, and secure user flows.',
    tags: ['FinTech', 'Dashboard', 'React', 'Data Viz'],
    color: '#1A3A5C',
    url: 'https://www.impactlendingpros.com/',
  },
  {
    id: 'stint',
    number: '05',
    title: 'Stint',
    subtitle: 'Chrome Extension',
    description:
      'A productivity-focused Chrome extension that helps users manage their time and tasks with a clean interface built with React.',
    tags: ['Chrome Extension', 'React', 'Productivity', 'V3'],
    color: '#2D4A3E',
    url: 'https://chromewebstore.google.com/detail/babnjknjffkajdinemgegbobpalcfdkp?utm_source=item-share-cb',
    hasChromeLogo: true,
  },
  {
    id: 'housiko',
    number: '06',
    title: 'Housiko',
    subtitle: 'Real Estate Platform',
    description:
      'A modern real estate marketplace developed while at Appifylab. Featuring interactive maps, property filtering, and seamless lead management.',
    tags: ['Next.js', 'Appifylab', 'Real Estate', 'TypeScript'],
    color: '#2D3E4A',
    url: 'https://housiko.com',
  },
]

function FeaturedProjects() {
  const sectionRef = useRef(null)
  const horizontalRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const horizontal = horizontalRef.current
      if (!horizontal) return

      // Measure the total horizontal scroll distance
      // Using a function for end ensures it re-calculates correctly
      const getScrollAmount = () => {
        return horizontal.scrollWidth - window.innerWidth
      }

      const scrollTween = gsap.to(horizontal, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, sectionRef)

    // Ensure ScrollTrigger refreshes after a tiny tick to sync with Lenis
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      ctx.revert()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-[#0A0A0A] overflow-hidden min-h-screen flex flex-col justify-center"
    >
      {/* Decorative background number */}
      <div className="absolute top-20 right-0 font-serif text-[15rem] md:text-[25rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none">
        03
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-10 pb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-accent">
            Selected Work
          </span>
        </div>
        <h2 className="font-serif text-heading text-text-primary">
          Featured projects<span className="text-accent">.</span>
        </h2>
      </div>

      {/* Horizontal Container */}
      <div 
        className="flex px-6 md:px-12 items-center" 
        ref={horizontalRef} 
        style={{ width: 'fit-content' }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] max-w-[1000px] mr-12 md:mr-24 last:mr-0"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#0C0C0C] hover:border-white/10 transition-all duration-500 shadow-2xl">
              <div
                className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px] md:min-h-[520px]"
                style={{
                  background: `linear-gradient(135deg, ${project.color}15 0%, #0A0A0A 100%)`,
                }}
              >
                {/* Image/Media Section */}
                <div className="project-media relative overflow-hidden flex items-center justify-center p-8 bg-white/[0.01]">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 glass shadow-2xl">
                    <div className="flex items-center gap-1.5 p-2 bg-white/[0.03] border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/40" />
                    </div>
                    
                    <div className="p-5 relative h-full flex flex-col">
                      <div className="h-2 w-1/2 rounded bg-white/5 mb-4" />
                      <div className="h-2 w-1/4 rounded bg-white/5 mb-10" />
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="h-full rounded bg-white/[0.02]" />
                        <div className="h-full rounded bg-white/[0.02]" />
                      </div>
                      
                      {/* Chrome Logo Integration */}
                      {project.hasChromeLogo && (
                        <div className="absolute bottom-6 right-6">
                           <img 
                            src="/assets/images/chrome.svg" 
                            alt="Chrome" 
                            className="w-12 h-12 opacity-90 drop-shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Watermark */}
                  <div className="absolute bottom-4 right-6 font-serif text-8xl font-bold text-white/[0.03]">
                    {project.number}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-accent font-sans text-xs tracking-widest">{project.number}</span>
                    <div className="w-10 h-[1px] bg-white/10" />
                  </div>
                  
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-text-primary mb-3">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-8">
                    {project.subtitle}
                  </p>
                  
                  <p className="font-sans text-sm md:text-base text-text-secondary leading-relaxed mb-10">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-4 py-1.5 border border-white/10 rounded-full text-text-secondary uppercase tracking-widest bg-white/[0.02]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-text-primary hover:text-accent transition-all duration-300"
                    data-cursor="hover"
                  >
                    <span>Explore more</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Indicator Hint */}
      <div className="mt-20 px-6 md:px-12 flex items-center gap-6 opacity-30">
        <div className="w-20 h-[1px] bg-white" />
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll down to explore work</span>
      </div>
    </section>
  )
}

export default FeaturedProjects
