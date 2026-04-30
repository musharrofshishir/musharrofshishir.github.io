/**
 * Footer — Minimal site footer
 */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-text-secondary">
          © {new Date().getFullYear()} Musharrof Shishir. Crafted with intention.
        </p>

        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-sans text-xs tracking-[0.15em] uppercase text-text-secondary hover:text-accent transition-colors duration-300 inline-flex items-center gap-2"
          data-cursor="hover"
        >
          Back to top
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </a>
      </div>
    </footer>
  )
}

export default Footer
