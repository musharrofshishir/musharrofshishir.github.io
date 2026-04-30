import { useEffect, useRef } from 'react'

/**
 * ParticlePortrait — Cycling particle effect with dissolve transitions
 *
 * INTERACTIONS:
 * - Click to switch between images (dissolve out → dissolve in next)
 * - Cursor hover: burst scatter effect
 * - ~20% of particles have "atom" movement — small orbital paths
 * - Remaining particles have subtle vibration/drift
 */

const PARTICLE_SIZE = 2
const PARTICLE_GAP = 5
const SCATTER_RADIUS = 100
const SCATTER_RADIUS_SQ = SCATTER_RADIUS * SCATTER_RADIUS
const BURST_FORCE = 18
const RETURN_SPEED = 0.04
const DAMPING = 0.88
const DRIFT_AMOUNT = 1.2
const PADDING = 30

const TRANSITION_DURATION = 2.0  // seconds for dissolve in/out
const ATOM_RATIO = 0.18          // 18% of particles are "atoms"

// Fast pseudo-random
let _seed = 42
function fastRandom() {
  _seed |= 0
  _seed = _seed + 0x6D2B79F5 | 0
  let t = Math.imul(_seed ^ _seed >>> 15, 1 | _seed)
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
  return ((t ^ t >>> 14) >>> 0) / 4294967296
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Extract particle data from an image */
function extractParticles(img, width, height) {
  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')
  offscreen.width = width
  offscreen.height = height

  const scale = Math.min(width / img.width, height / img.height)
  const drawW = img.width * scale
  const drawH = img.height * scale
  const offsetX = (width - drawW) / 2
  const offsetY = (height - drawH) / 2

  offCtx.drawImage(img, offsetX, offsetY, drawW, drawH)
  const imageData = offCtx.getImageData(0, 0, width, height)
  const data = imageData.data

  const particles = []
  for (let y = 0; y < height; y += PARTICLE_GAP) {
    for (let x = 0; x < width; x += PARTICLE_GAP) {
      const i = (y * width + x) * 4
      const a = data[i + 3]
      if (a < 100) continue
      const r = data[i], g = data[i + 1], b = data[i + 2]
      if ((r + g + b) / 3 < 15) continue

      particles.push({
        ox: x + PADDING,
        oy: y + PADDING,
        color: `rgba(${Math.min(255, r + 35)},${Math.min(255, g + 35)},${Math.min(255, b + 35)},${(Math.min(1, (a / 255) * 0.8)).toFixed(2)})`,
      })
    }
  }
  return particles
}

function ParticlePortrait({
  imageSources = [],
  width = 440,
  height = 540,
  className = '',
  active = false,
}) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  activeRef.current = active

  const stateRef = useRef({
    raf: null,
    mouseX: -9999,
    mouseY: -9999,
    isVisible: true,
    imageDataSets: [],
    currentImageIndex: 0,
    maxCount: 0,
    count: 0,
    ox: null, oy: null,
    sx: null, sy: null,
    px: null, py: null,
    vx: null, vy: null,
    colors: null,
    driftX: null, driftY: null,
    // Atom orbit data
    isAtom: null,          // boolean flag per particle
    orbitRadius: null,     // orbit radius
    orbitSpeed: null,      // orbit angular speed
    orbitPhase: null,      // starting phase offset
    // State machine
    phase: 'waiting',
    phaseStartTime: 0,
    imagesLoaded: false,
    activated: false,
    centerX: 0,
    centerY: 0,
    clickPending: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    const state = stateRef.current

    const canvasW = width + PADDING * 2
    const canvasH = height + PADDING * 2
    canvas.width = canvasW
    canvas.height = canvasH

    state.centerX = canvasW / 2
    state.centerY = canvasH / 2

    function randomScatterPos() {
      const angle = fastRandom() * Math.PI * 2
      const dist = 250 + fastRandom() * 350
      return {
        x: state.centerX + Math.cos(angle) * dist,
        y: state.centerY + Math.sin(angle) * dist,
      }
    }

    function loadImageParticles(imageIndex) {
      const particles = state.imageDataSets[imageIndex]
      if (!particles) return

      state.currentImageIndex = imageIndex
      state.count = particles.length

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        state.ox[i] = p.ox
        state.oy[i] = p.oy
        state.colors[i] = p.color
        state.driftX[i] = (fastRandom() - 0.5) * DRIFT_AMOUNT * 2
        state.driftY[i] = (fastRandom() - 0.5) * DRIFT_AMOUNT * 2

        // Random scattered position
        const scat = randomScatterPos()
        state.sx[i] = scat.x
        state.sy[i] = scat.y

        state.px[i] = scat.x
        state.py[i] = scat.y
        state.vx[i] = 0
        state.vy[i] = 0

        // Assign some particles as "atoms" with orbital movement
        state.isAtom[i] = fastRandom() < ATOM_RATIO ? 1 : 0
        state.orbitRadius[i] = 2 + fastRandom() * 6     // 2-8px orbit radius
        state.orbitSpeed[i] = 0.3 + fastRandom() * 1.2  // varying speeds
        state.orbitPhase[i] = fastRandom() * Math.PI * 2 // random start
      }
    }

    function tryActivate() {
      if (state.imagesLoaded && activeRef.current && !state.activated) {
        state.activated = true
        state.phase = 'dissolving-in'
        state.phaseStartTime = performance.now()
        loadImageParticles(0)
      }
    }

    // Load all images
    const srcs = imageSources.length > 0 ? imageSources : ['/assets/images/self.png']
    let loadedCount = 0

    srcs.forEach((src, idx) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        state.imageDataSets[idx] = extractParticles(img, width, height)
        loadedCount++

        if (loadedCount === srcs.length) {
          const maxCount = Math.max(...state.imageDataSets.map(d => d.length))
          state.maxCount = maxCount
          state.ox = new Float32Array(maxCount)
          state.oy = new Float32Array(maxCount)
          state.sx = new Float32Array(maxCount)
          state.sy = new Float32Array(maxCount)
          state.px = new Float32Array(maxCount)
          state.py = new Float32Array(maxCount)
          state.vx = new Float32Array(maxCount)
          state.vy = new Float32Array(maxCount)
          state.colors = new Array(maxCount).fill('rgba(0,0,0,0)')
          state.driftX = new Float32Array(maxCount)
          state.driftY = new Float32Array(maxCount)
          state.isAtom = new Uint8Array(maxCount)
          state.orbitRadius = new Float32Array(maxCount)
          state.orbitSpeed = new Float32Array(maxCount)
          state.orbitPhase = new Float32Array(maxCount)
          state.imagesLoaded = true

          tryActivate()
          animate()
        }
      }
    })

    // Animation loop
    let frameCount = 0
    let time = 0

    function animate() {
      if (!state.isVisible) {
        state.raf = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvasW, canvasH)

      if (!state.activated && activeRef.current && state.imagesLoaded) {
        tryActivate()
      }

      if (!state.activated || state.count === 0) {
        state.raf = requestAnimationFrame(animate)
        return
      }

      const n = state.count
      const mx = state.mouseX
      const my = state.mouseY
      const now = performance.now()
      frameCount++
      time = now * 0.001 // seconds

      const applyDrift = frameCount % 2 === 0
      const phase = state.phase
      const elapsed = (now - state.phaseStartTime) / 1000

      // Handle click → trigger dissolve out
      if (state.clickPending && phase === 'idle') {
        // Set up scatter targets
        for (let i = 0; i < n; i++) {
          const scat = randomScatterPos()
          state.sx[i] = scat.x
          state.sy[i] = scat.y
        }
        state.phase = 'dissolving-out'
        state.phaseStartTime = now
        state.clickPending = false
      } else {
        state.clickPending = false
      }

      // Phase transitions
      let t = 0
      if (phase === 'dissolving-in') {
        t = Math.min(1, elapsed / TRANSITION_DURATION)
        if (t >= 1) {
          state.phase = 'idle'
          state.phaseStartTime = now
        }
      } else if (phase === 'dissolving-out') {
        t = Math.min(1, elapsed / TRANSITION_DURATION)
        if (t >= 1) {
          const nextIdx = (state.currentImageIndex + 1) % state.imageDataSets.length
          loadImageParticles(nextIdx)
          state.phase = 'dissolving-in'
          state.phaseStartTime = now
        }
      }

      const easedT = easeInOutCubic(t)

      // Update & draw particles
      for (let i = 0; i < n; i++) {
        let drawAlpha = 1

        if (phase === 'dissolving-in') {
          state.px[i] = state.sx[i] + (state.ox[i] - state.sx[i]) * easedT
          state.py[i] = state.sy[i] + (state.oy[i] - state.sy[i]) * easedT
          drawAlpha = easedT
          state.vx[i] = 0
          state.vy[i] = 0

        } else if (phase === 'dissolving-out') {
          state.px[i] = state.ox[i] + (state.sx[i] - state.ox[i]) * easedT
          state.py[i] = state.oy[i] + (state.sy[i] - state.oy[i]) * easedT
          drawAlpha = 1 - easedT

        } else if (phase === 'idle') {
          // Cursor burst scatter
          const dx = mx - state.px[i]
          const dy = my - state.py[i]
          const distSq = dx * dx + dy * dy

          if (distSq < SCATTER_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            const force = ((SCATTER_RADIUS - dist) / SCATTER_RADIUS) * BURST_FORCE
            const invDist = 1 / (dist + 0.01)
            state.vx[i] -= dx * invDist * force
            state.vy[i] -= dy * invDist * force
          }

          // Target position: origin + drift + atom orbit
          let tx = state.ox[i] + state.driftX[i]
          let ty = state.oy[i] + state.driftY[i]

          // Atom movement — small circular orbit
          if (state.isAtom[i]) {
            const orbitAngle = time * state.orbitSpeed[i] + state.orbitPhase[i]
            tx += Math.cos(orbitAngle) * state.orbitRadius[i]
            ty += Math.sin(orbitAngle) * state.orbitRadius[i]
          }

          state.vx[i] += (tx - state.px[i]) * RETURN_SPEED
          state.vy[i] += (ty - state.py[i]) * RETURN_SPEED
          state.vx[i] *= DAMPING
          state.vy[i] *= DAMPING

          // Subtle drift vibration (non-atom particles)
          if (applyDrift && !state.isAtom[i]) {
            state.driftX[i] += (fastRandom() - 0.5) * 0.3
            state.driftY[i] += (fastRandom() - 0.5) * 0.3
            if (state.driftX[i] > DRIFT_AMOUNT * 4) state.driftX[i] = DRIFT_AMOUNT * 4
            if (state.driftX[i] < -DRIFT_AMOUNT * 4) state.driftX[i] = -DRIFT_AMOUNT * 4
            if (state.driftY[i] > DRIFT_AMOUNT * 4) state.driftY[i] = DRIFT_AMOUNT * 4
            if (state.driftY[i] < -DRIFT_AMOUNT * 4) state.driftY[i] = -DRIFT_AMOUNT * 4
          }

          state.px[i] += state.vx[i]
          state.py[i] += state.vy[i]
        }

        // Draw
        if (drawAlpha > 0.01) {
          ctx.globalAlpha = drawAlpha
          ctx.fillStyle = state.colors[i]
          ctx.fillRect(state.px[i], state.py[i], PARTICLE_SIZE, PARTICLE_SIZE)
        }
      }

      ctx.globalAlpha = 1
      state.raf = requestAnimationFrame(animate)
    }

    // --- Event listeners ---
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      state.mouseX = (e.clientX - rect.left) * (canvasW / rect.width)
      state.mouseY = (e.clientY - rect.top) * (canvasH / rect.height)
    }

    const handleMouseLeave = () => {
      state.mouseX = -9999
      state.mouseY = -9999
    }

    const handleClick = () => {
      // Only cycle if more than one image and currently idle
      if (state.imageDataSets.length > 1 && state.phase === 'idle') {
        state.clickPending = true
      }
    }

    const handleVisibility = () => {
      state.isVisible = !document.hidden
    }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(state.raf)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [imageSources, width, height])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: `${width + PADDING * 2}px`,
        height: `${height + PADDING * 2}px`,
        margin: `-${PADDING}px`,
        cursor: 'pointer',
      }}
      data-cursor="hover"
    />
  )
}

export default ParticlePortrait
