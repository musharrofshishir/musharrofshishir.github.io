import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * Loader — Full-page loading animation
 * 
 * Sequence:
 * 1. Counter counts 0 → 100 (centered)
 * 2. Counter fades out
 * 3. "Musharrof" reveals via clip-path from LEFT → RIGHT
 * 4. "Shishir" reveals via clip-path from RIGHT → LEFT
 * 5. Horizontal accent line expands + subtitle fades in
 * 6. Hold briefly
 * 7. Center content fades out
 * 8. Split-screen wipe (top goes up, bottom goes down) reveals site
 */
function Loader({ onComplete }) {
  const loaderRef = useRef(null)
  const counterRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const lineRef = useRef(null)
  const subtitleRef = useRef(null)
  const centerContentRef = useRef(null)
  const overlayTopRef = useRef(null)
  const overlayBottomRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const [counter, setCounter] = useState(0)

  // Keep the callback ref in sync
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.2, () => onCompleteRef.current?.())
        },
      })

      // Phase 1: Count 0 → 100
      const countObj = { value: 0 }
      tl.to(countObj, {
        value: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          setCounter(Math.round(countObj.value))
        },
      })

      // Phase 2: Counter fades out & up
      tl.to(counterRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
      }, '-=0.2')

      // Phase 3: "Musharrof" — clip-path from LEFT to RIGHT
      tl.fromTo(
        firstNameRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '-=0.1'
      )

      // Phase 4: "Shishir" — clip-path from RIGHT to LEFT
      tl.fromTo(
        lastNameRef.current,
        { clipPath: 'inset(0 0 0 100%)', opacity: 1 },
        {
          clipPath: 'inset(0 0 0 0%)',
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '-=0.5'
      )

      // Accent line expands
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power3.inOut' },
        '-=0.3'
      )

      // Subtitle fade in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      )

      // Hold
      tl.to({}, { duration: 0.5 })

      // Phase 5: Fade out ALL center content BEFORE the wipe
      tl.to(centerContentRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      })

      // Phase 6: Split-screen wipe
      tl.to(overlayTopRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      })
      tl.to(
        overlayBottomRef.current,
        {
          yPercent: 100,
          duration: 0.9,
          ease: 'power4.inOut',
        },
        '<'
      )
    }, loaderRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Top half — slides up when done */}
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-base"
      />

      {/* Bottom half — slides down when done */}
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-base"
      />

      {/* Centered content — fades out before wipe */}
      {/* Counter */}
      <div ref={counterRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="font-sans text-8xl md:text-9xl font-extralight text-text-secondary/60 tracking-tighter tabular-nums">
          {String(counter).padStart(3, '0')}
        </span>
      </div>
      <div
        ref={centerContentRef}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div className="text-center">


          {/* Name: Musharrof */}
          <div ref={firstNameRef} className="opacity-0">
            <h1 className="font-serif text-display font-medium text-text-primary tracking-tight leading-none">
              Musharrof
            </h1>
          </div>

          {/* Name: Shishir */}
          <div ref={lastNameRef} className="opacity-0 mt-1">
            <h1 className="font-serif text-display font-medium text-text-primary tracking-tight leading-none">
              Shishir
            </h1>
          </div>

          {/* Accent line */}
          <div
            ref={lineRef}
            className="w-20 h-[1px] bg-accent mx-auto mt-6 origin-center"
            style={{ transform: 'scaleX(0)' }}
          />

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-sans text-xs tracking-[0.3em] uppercase text-text-secondary mt-5 opacity-0"
          >
            Creative Developer
          </p>
        </div>
      </div>
    </div>
  )
}

export default Loader
