'use client'

import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CloseHand } from './closedhand'
import { OpenHand } from './open-hand'
import { PointingHand } from './pointing-hand'

// * thanks https://www.figma.com/design/1NcaQZkoHK96RdmqTl69hc/Vector-macOS-cursors--Community-?node-id=1-280&t=sfK1gEo44jGt8322-0
// * Fuck Apple🤬, Fuck MacOS 26😡, Fuck Fuck Fuck !!!
const svgToCursorUrl = (svg: ReactElement) =>
  `url("data:image/svg+xml,${encodeURIComponent(renderToStaticMarkup(svg))}")`

const pointingHandCursor = svgToCursorUrl(<PointingHand width={16} height={17} />)
const openHandCursor = svgToCursorUrl(<OpenHand width={16} height={17} />)
const closeHandCursor = svgToCursorUrl(<CloseHand width={15} height={14} />)

const cursorCss = `
.main-cursor-scope {
  --main-cursor-pointer: ${pointingHandCursor} 6 1;
  --main-cursor-grab: ${openHandCursor} 8 8;
  --main-cursor-grabbing: ${closeHandCursor} 7 7;
}

.main-cursor-scope :is(
  a[href],
  button,
  summary,
  label[for],
  [role='button'],
  [tabindex]:not([tabindex='-1']),
  .cursor-pointer
) {
  cursor: var(--main-cursor-pointer), pointer;
}

.main-cursor-scope :is(.cursor-grab, .active\\:cursor-grab:active) {
  cursor: var(--main-cursor-grab), grab;
}

.main-cursor-scope :is(.cursor-grabbing, .cursor-grab:active, .active\\:cursor-grabbing:active) {
  cursor: var(--main-cursor-grabbing), grabbing;
}
`

export function MainCursorStyle() {
  return <style>{cursorCss}</style>
}
