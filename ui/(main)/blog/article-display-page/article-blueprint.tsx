'use client'

import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'

export function ArticleBlueprint({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const planRef = useRef<HTMLDivElement>(null)
  const [shapes, setShapes] = useState<
    { kind: 'text' | 'box'; x: number; y: number; width: number; height: number }[]
  >([])

  useLayoutEffect(() => {
    const content = contentRef.current
    const plan = planRef.current
    if (
      content == null ||
      plan == null ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    const measure = () => {
      if (getComputedStyle(plan).visibility === 'hidden') return

      const bounds = plan.getBoundingClientRect()
      const nextShapes: typeof shapes = []
      const elements = content.querySelectorAll<HTMLElement>(
        '[data-article-blueprint-text], #article-content :is(h1, h2, h3, h4, h5, h6, p, li, pre, table, .md-image-frame, video)',
      )

      for (const element of elements) {
        if (nextShapes.length >= 48) break
        if (element.parentElement?.closest('pre, table') != null) continue

        const rect = element.getBoundingClientRect()
        if (rect.top >= bounds.bottom) break
        if (rect.bottom <= bounds.top || rect.width < 2 || rect.height < 2) continue

        if (element.matches('pre, table, .md-image-frame, video')) {
          const x = Math.max(rect.left, bounds.left)
          const y = Math.max(rect.top, bounds.top)
          const width = Math.min(rect.right, bounds.right) - x
          const height = Math.min(rect.bottom, bounds.bottom) - y
          if (width > 1 && height > 1) {
            nextShapes.push({ kind: 'box', x: x - bounds.left, y: y - bounds.top, width, height })
          }
          continue
        }

        // Nested blocks draw their own lines instead of duplicating the parent range.
        if (element.querySelector('p, li, .md-image-frame, video') != null) continue

        const range = document.createRange()
        range.selectNodeContents(element)
        const lines = new Map<
          number,
          { left: number; right: number; top: number; height: number }
        >()

        for (const line of range.getClientRects()) {
          if (line.top >= bounds.bottom) break
          if (line.width < 2 || line.bottom <= bounds.top) continue
          const key = Math.round(line.top)
          const previous = lines.get(key)
          lines.set(key, {
            left: previous ? Math.min(previous.left, line.left) : line.left,
            right: previous ? Math.max(previous.right, line.right) : line.right,
            top: line.top,
            height: line.height,
          })
        }

        for (const line of lines.values()) {
          if (nextShapes.length >= 48) break
          const x = Math.max(line.left, bounds.left)
          const width = Math.min(line.right, bounds.right) - x
          const height = Math.min(10, Math.max(4, line.height / 2))
          const y = line.top - bounds.top + (line.height - height) / 2
          if (width > 1 && y >= 0 && y + height <= bounds.height) {
            nextShapes.push({ kind: 'text', x: x - bounds.left, y, width, height })
          }
        }
      }

      setShapes(nextShapes)
    }

    measure()
    let active = true
    if (document.fonts.status === 'loading') {
      void document.fonts.ready.then(() => {
        if (active) measure()
      })
    }
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="motion-safe:animate-blueprint-rise relative w-full max-w-3xl">
      <div ref={contentRef} className="motion-safe:animate-article-blueprint-reveal">
        {children}
      </div>

      <div
        ref={planRef}
        aria-hidden
        className="motion-safe:animate-blueprint-plan pointer-events-none absolute inset-x-6 inset-y-2 z-10 hidden motion-safe:block"
      >
        <div className="absolute -inset-4 bg-[radial-gradient(circle,var(--theme-primary)_0.65px,transparent_0.8px)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] bg-size-[12px_12px] opacity-20" />
        <div className="border-theme-primary/30 absolute inset-0 rounded-sm border border-dashed" />
        <div className="border-theme-primary/15 absolute -inset-x-3 inset-y-0 border-y border-dashed" />
        <div className="border-theme-primary/15 absolute inset-x-0 -inset-y-3 border-x border-dashed" />

        <svg aria-hidden className="text-theme-primary absolute inset-0 size-full overflow-visible">
          {shapes.map((shape, index) => (
            <g
              key={`${shape.kind}-${shape.x}-${shape.y}`}
              className="motion-safe:animate-blueprint-rule"
              style={{ animationDelay: `${Math.min(index * 18, 140)}ms` }}
            >
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={shape.kind === 'text' ? shape.height / 2 : 6}
                fill="currentColor"
                fillOpacity={shape.kind === 'text' ? 0.14 : 0.03}
                stroke={shape.kind === 'box' ? 'currentColor' : 'none'}
                strokeOpacity={0.35}
                strokeDasharray="4 4"
              />
              {shape.kind === 'text' && (
                <path
                  d={`M ${shape.x + shape.width} ${shape.y - 2} v ${shape.height + 4}`}
                  stroke="currentColor"
                  strokeOpacity={0.4}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
