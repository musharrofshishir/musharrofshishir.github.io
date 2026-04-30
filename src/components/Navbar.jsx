import { useEffect, useRef } from 'react'

/**
 * Navbar — Minimal fixed navigation
 * 
 * Uses a container with the logo absolutely on the left,
 * nav links in the center, and status indicator on the right.
 */
function Navbar() {
  const navRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > 100) {
        nav.classList.add('backdrop-blur-md')
        nav.style.backgroundColor = 'rgba(10, 10, 10, 0.8)'
      } else {
        nav.classList.remove('backdrop-blur-md')
        nav.style.backgroundColor = 'transparent'
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      ref={navRef}
      id="navbar"
      className="fixed top-0 left-0 w-full z-[100]"
      style={{ transition: 'background-color 0.5s' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('hero') }}
          className="me-[60px] font-serif text-2xl font-medium text-text-primary hover:text-accent transition-colors duration-300 shrink-0"
          data-cursor="hover"
        >
          MS.
        </a>

        {/* Center: Nav links — uses flex-1 + justify-center for true centering */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {['About', 'Experience', 'Work', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()) }}
              className="font-sans text-xs tracking-[0.15em] uppercase text-text-secondary hover:text-text-primary transition-colors duration-300"
              data-cursor="hover"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right: Status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-sans text-xs text-text-secondary hidden sm:inline">
            Available for work
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
