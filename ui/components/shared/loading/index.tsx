'use client'

// * thanks https://paidax01.github.io/math-curve-loaders/
import { useEffect, useRef } from 'react'

const loadingConfig = {
  particleCount: 140,
  trailSpan: 0.32,
  durationMs: 5400,
  rotationDurationMs: 28000,
  pulseDurationMs: 4500,
  strokeWidth: 4.6,
  roseA: 9.2,
  roseABoost: 0.6,
  roseBreathBase: 0.72,
  roseBreathBoost: 0.28,
  roseScale: 3.25,
}

const center = 50

function getRoseRadius(time: number) {
  const pulseProgress = (time % loadingConfig.pulseDurationMs) / loadingConfig.pulseDurationMs
  const pulseAngle = pulseProgress * Math.PI * 2
  const detailScale = 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48

  return (
    (loadingConfig.roseA + detailScale * loadingConfig.roseABoost) *
    (loadingConfig.roseBreathBase + detailScale * loadingConfig.roseBreathBoost) *
    loadingConfig.roseScale
  )
}

function getRotation(time: number) {
  return -((time % loadingConfig.rotationDurationMs) / loadingConfig.rotationDurationMs) * 360
}

function setRosePoint(progress: number, radius: number, point: { x: number; y: number }) {
  const angle = progress * Math.PI * 2
  const distance = radius * Math.cos(4 * angle)

  point.x = center + Math.cos(angle) * distance
  point.y = center + Math.sin(angle) * distance
}

function buildPath(radius: number, steps = 480) {
  const commands: string[] = []
  const point = { x: 0, y: 0 }

  for (let index = 0; index <= steps; index++) {
    setRosePoint(index / steps, radius, point)
    commands.push(`${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
  }

  return commands.join(' ')
}

const initialRadius = getRoseRadius(0)
const rosePath = buildPath(initialRadius)
const particles = Array.from({ length: loadingConfig.particleCount }, (_, index) => {
  const tailOffset = index / (loadingConfig.particleCount - 1)
  const offset = tailOffset * loadingConfig.trailSpan
  const fade = (1 - tailOffset) ** 0.56
  const point = { x: 0, y: 0 }
  setRosePoint(-offset, initialRadius, point)

  return {
    index,
    offset,
    cx: point.x.toFixed(2),
    cy: point.y.toFixed(2),
    radius: (0.9 + fade * 2.7).toFixed(2),
    opacity: (0.04 + fade * 0.96).toFixed(3),
  }
})

export default function Loading() {
  const groupRef = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const circleRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const group = groupRef.current
    const path = pathRef.current
    const svg = group?.ownerSVGElement

    if (!group || !path || !svg) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const point = { x: 0, y: 0 }
    let isInView = false
    let frameId: number | null = null
    let lastFrameAt: number | null = null
    let elapsed = 0

    const render = (now: number) => {
      if (lastFrameAt != null) elapsed += now - lastFrameAt
      lastFrameAt = now

      const progress = (elapsed % loadingConfig.durationMs) / loadingConfig.durationMs
      const radius = getRoseRadius(elapsed)
      const scale = radius / initialRadius

      group.setAttribute('transform', `rotate(${getRotation(elapsed)} ${center} ${center})`)
      path.setAttribute(
        'transform',
        `translate(${center} ${center}) scale(${scale}) translate(${-center} ${-center})`,
      )
      path.setAttribute('stroke-width', String(loadingConfig.strokeWidth / scale))

      for (const { index, offset } of particles) {
        const circle = circleRefs.current[index]
        if (!circle) continue

        setRosePoint(progress - offset, radius, point)
        circle.setAttribute('cx', point.x.toFixed(2))
        circle.setAttribute('cy', point.y.toFixed(2))
      }

      frameId = requestAnimationFrame(render)
    }

    const stopAnimation = () => {
      if (frameId != null) cancelAnimationFrame(frameId)
      frameId = null
      lastFrameAt = null
    }

    const syncAnimation = () => {
      if (!isInView || document.visibilityState !== 'visible' || reducedMotion.matches) {
        stopAnimation()
        return
      }

      frameId ??= requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return

      isInView = entry.isIntersecting
      syncAnimation()
    })
    observer.observe(svg)
    document.addEventListener('visibilitychange', syncAnimation)
    reducedMotion.addEventListener('change', syncAnimation)

    return () => {
      observer.disconnect()
      observer.takeRecords()
      document.removeEventListener('visibilitychange', syncAnimation)
      reducedMotion.removeEventListener('change', syncAnimation)
      stopAnimation()
    }
  }, [])

  return (
    <div className="m-auto flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="size-[100px] overflow-visible text-zinc-950 dark:text-zinc-50"
      >
        <g ref={groupRef}>
          <path
            ref={pathRef}
            d={rosePath}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={loadingConfig.strokeWidth}
            opacity="0.1"
          />
          {particles.map(({ index, cx, cy, radius, opacity }) => (
            <circle
              key={`loading-particle-${index}`}
              ref={node => {
                circleRefs.current[index] = node
              }}
              cx={cx}
              cy={cy}
              r={radius}
              opacity={opacity}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
