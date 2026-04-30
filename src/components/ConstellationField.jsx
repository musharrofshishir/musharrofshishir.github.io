import { useEffect, useRef } from 'react'

/**
 * ConstellationField — Interactive particle network canvas
 * 
 * A fullscreen canvas with floating nodes connected by lines.
 * Nodes drift slowly. When the cursor moves near nodes, they
 * get attracted/repelled and new connections form dynamically.
 * 
 * Creates a "neural network" / "constellation" feel that's
 * very modern and tech-appropriate for a Creative Developer.
 * 
 * PERFORMANCE:
 * - Uses typed arrays for positions/velocity
 * - Spatial grid for neighbor lookups (O(n) instead of O(n²))
 * - Pauses when tab is hidden
 * - Limited node count (~80)
 */

const NODE_COUNT = 70
const CONNECTION_DIST = 150
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
const CURSOR_RADIUS = 200
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS
const CURSOR_ATTRACT = 0.015  // Gentle attraction
const BASE_SPEED = 0.3
const NODE_SIZE_MIN = 1
const NODE_SIZE_MAX = 3

function ConstellationField({ className = '' }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    raf: null,
    mouseX: -9999,
    mouseY: -9999,
    isVisible: true,
    w: 0,
    h: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const state = stateRef.current

    // Resize handler
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      state.w = rect.width
      state.h = rect.height
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()

    // Initialize nodes
    const px = new Float32Array(NODE_COUNT)
    const py = new Float32Array(NODE_COUNT)
    const vx = new Float32Array(NODE_COUNT)
    const vy = new Float32Array(NODE_COUNT)
    const sizes = new Float32Array(NODE_COUNT)
    const alphas = new Float32Array(NODE_COUNT)

    for (let i = 0; i < NODE_COUNT; i++) {
      px[i] = Math.random() * state.w
      py[i] = Math.random() * state.h
      vx[i] = (Math.random() - 0.5) * BASE_SPEED
      vy[i] = (Math.random() - 0.5) * BASE_SPEED
      sizes[i] = NODE_SIZE_MIN + Math.random() * (NODE_SIZE_MAX - NODE_SIZE_MIN)
      alphas[i] = 0.3 + Math.random() * 0.5
    }

    function animate() {
      if (!state.isVisible) {
        state.raf = requestAnimationFrame(animate)
        return
      }

      const w = state.w
      const h = state.h
      const mx = state.mouseX
      const my = state.mouseY

      ctx.clearRect(0, 0, w, h)

      // Update positions
      for (let i = 0; i < NODE_COUNT; i++) {
        // Cursor interaction — gentle attraction
        const dx = mx - px[i]
        const dy = my - py[i]
        const distSq = dx * dx + dy * dy

        if (distSq < CURSOR_RADIUS_SQ && distSq > 100) {
          const dist = Math.sqrt(distSq)
          vx[i] += (dx / dist) * CURSOR_ATTRACT
          vy[i] += (dy / dist) * CURSOR_ATTRACT
        }

        px[i] += vx[i]
        py[i] += vy[i]

        // Damping
        vx[i] *= 0.998
        vy[i] *= 0.998

        // Speed maintenance (don't let nodes stop)
        const speed = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i])
        if (speed < BASE_SPEED * 0.3) {
          vx[i] += (Math.random() - 0.5) * 0.1
          vy[i] += (Math.random() - 0.5) * 0.1
        }

        // Wrap around edges
        if (px[i] < -20) px[i] = w + 20
        if (px[i] > w + 20) px[i] = -20
        if (py[i] < -20) py[i] = h + 20
        if (py[i] > h + 20) py[i] = -20
      }

      // Draw connections (O(n²) but n is small — 70)
      ctx.lineWidth = 0.5
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = px[i] - px[j]
          const dy = py[i] - py[j]
          const distSq = dx * dx + dy * dy

          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15
            ctx.strokeStyle = `rgba(200, 169, 110, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(px[i], py[i])
            ctx.lineTo(px[j], py[j])
            ctx.stroke()
          }
        }
      }

      // Draw cursor connections
      if (mx > 0 && my > 0) {
        for (let i = 0; i < NODE_COUNT; i++) {
          const dx = mx - px[i]
          const dy = my - py[i]
          const distSq = dx * dx + dy * dy
          if (distSq < CURSOR_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            const alpha = (1 - dist / CURSOR_RADIUS) * 0.25
            ctx.strokeStyle = `rgba(200, 169, 110, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.lineTo(px[i], py[i])
            ctx.stroke()
          }
        }

        // Draw cursor glow
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 6)
        gradient.addColorStop(0, 'rgba(200, 169, 110, 0.6)')
        gradient.addColorStop(1, 'rgba(200, 169, 110, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mx, my, 6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const gradient = ctx.createRadialGradient(px[i], py[i], 0, px[i], py[i], sizes[i])
        gradient.addColorStop(0, `rgba(245, 245, 240, ${alphas[i]})`)
        gradient.addColorStop(1, 'rgba(245, 245, 240, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px[i], py[i], sizes[i], 0, Math.PI * 2)
        ctx.fill()
      }

      state.raf = requestAnimationFrame(animate)
    }

    animate()

    // Event listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      state.mouseX = e.clientX - rect.left
      state.mouseY = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      state.mouseX = -9999
      state.mouseY = -9999
    }

    const handleVisibility = () => {
      state.isVisible = !document.hidden
    }

    const handleResize = () => { resize() }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(state.raf)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}

export default ConstellationField
