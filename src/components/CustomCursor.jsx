import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * CustomCursor — Optimized interactive cursor
 * 
 * Hidden on touch devices (mobile/tablet) — no point showing
 * a custom cursor when there's no mouse.
 */
function CustomCursor() {
  const dotRef = useRef(null)
  const circleRef = useRef(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch device
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches

    if (isTouch) {
      setIsTouchDevice(true)
      return
    }

    const dot = dotRef.current
    const circle = circleRef.current
    if (!dot || !circle) return

    gsap.set([dot, circle], { xPercent: -50, yPercent: -50 })

    let mouseX = 0, mouseY = 0
    let circleX = 0, circleY = 0
    let isHovering = false

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const updateCircle = () => {
      circleX += (mouseX - circleX) * 0.15
      circleY += (mouseY - circleY) * 0.15
      circle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`
    }

    const isInteractive = (el) => {
      if (!el) return false
      return el.closest('a, button, [role="button"], .cursor-hover, [data-cursor="hover"]')
    }

    const handleMouseOver = (e) => {
      if (isInteractive(e.target) && !isHovering) {
        isHovering = true
        gsap.to(circle, {
          backgroundColor: 'rgba(200, 169, 110, 0.15)',
          borderColor: '#C8A96E',
          duration: 0.3,
          overwrite: true,
        })
        gsap.to(dot, { scale: 0, duration: 0.2, overwrite: true })
      }
    }

    const handleMouseOut = (e) => {
      if (isHovering && !isInteractive(e.relatedTarget)) {
        isHovering = false
        gsap.to(circle, {
          backgroundColor: 'transparent',
          borderColor: 'rgba(245, 245, 240, 0.4)',
          duration: 0.3,
          overwrite: true,
        })
        gsap.to(dot, { scale: 1, duration: 0.2, overwrite: true })
      }
    }

    const handleMouseLeaveWindow = () => {
      gsap.to([dot, circle], { opacity: 0, duration: 0.2 })
    }

    const handleMouseEnterWindow = () => {
      gsap.to([dot, circle], { opacity: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('mouseenter', handleMouseEnterWindow)
    gsap.ticker.add(updateCircle)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
      gsap.ticker.remove(updateCircle)
    }
  }, [])

  // Don't render anything on touch devices
  if (isTouchDevice) return null

  return (
    <div id="custom-cursor" className="pointer-events-none fixed inset-0 z-[9998]">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full"
        style={{ backgroundColor: '#F5F5F0', willChange: 'transform' }}
      />
      <div
        ref={circleRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border"
        style={{
          borderColor: 'rgba(245, 245, 240, 0.4)',
          backgroundColor: 'transparent',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

export default CustomCursor
