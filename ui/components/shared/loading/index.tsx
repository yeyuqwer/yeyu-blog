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

const particleIndexes = Array.from({ length: loadingConfig.particleCount }, (_, index) => index)

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1
}

function getDetailScale(time: number) {
  const pulseProgress = (time % loadingConfig.pulseDurationMs) / loadingConfig.pulseDurationMs
  const pulseAngle = pulseProgress * Math.PI * 2

  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48
}

function getRotation(time: number) {
  return -((time % loadingConfig.rotationDurationMs) / loadingConfig.rotationDurationMs) * 360
}

function getPoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const a = loadingConfig.roseA + detailScale * loadingConfig.roseABoost
  const r =
    a *
    (loadingConfig.roseBreathBase + detailScale * loadingConfig.roseBreathBoost) *
    Math.cos(4 * t)

  return {
    x: 50 + Math.cos(t) * r * loadingConfig.roseScale,
    y: 50 + Math.sin(t) * r * loadingConfig.roseScale,
  }
}

function buildPath(detailScale: number, steps = 480) {
  const commands: string[] = []

  for (let index = 0; index <= steps; index++) {
    const point = getPoint(index / steps, detailScale)
    commands.push(`${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
  }

  return commands.join(' ')
}

function getParticle(index: number, progress: number, detailScale: number) {
  const tailOffset = index / (loadingConfig.particleCount - 1)
  const point = getPoint(
    normalizeProgress(progress - tailOffset * loadingConfig.trailSpan),
    detailScale,
  )
  const fade = (1 - tailOffset) ** 0.56

  return {
    x: point.x,
    y: point.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  }
}

export default function Loading() {
  const groupRef = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const circleRefs = useRef<Array<SVGCircleElement | null>>([])

  useEffect(() => {
    const group = groupRef.current
    const path = pathRef.current

    if (!group || !path) {
      return
    }

    let frameId = 0
    const startedAt = performance.now()

    function render(now: number) {
      const time = now - startedAt
      const progress = (time % loadingConfig.durationMs) / loadingConfig.durationMs
      const detailScale = getDetailScale(time)

      group?.setAttribute('transform', `rotate(${getRotation(time)} 50 50)`)
      path?.setAttribute('d', buildPath(detailScale))

      circleRefs.current.forEach((node, index) => {
        if (!node) {
          return
        }

        const particle = getParticle(index, progress, detailScale)

        node.setAttribute('cx', particle.x.toFixed(2))
        node.setAttribute('cy', particle.y.toFixed(2))
        node.setAttribute('r', particle.radius.toFixed(2))
        node.setAttribute('opacity', particle.opacity.toFixed(3))
      })

      frameId = requestAnimationFrame(render)
    }

    render(startedAt)

    return () => {
      cancelAnimationFrame(frameId)
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
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={loadingConfig.strokeWidth}
            opacity="0.1"
          />
          {particleIndexes.map(index => (
            <circle
              key={index}
              ref={node => {
                circleRefs.current[index] = node
              }}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
