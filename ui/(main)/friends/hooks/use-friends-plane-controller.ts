import type { MouseEvent, PointerEvent } from 'react'
import type {
  DragState,
  PlaneCopy,
  PlaneItem,
  PlaneItemElement,
  PlaneMotion,
  PlaneOffset,
  PlaneVelocity,
} from '../types'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  centerFocusScale,
  defaultPlaneMotion,
  dragClickDelay,
  dragVelocitySmoothing,
  momentumStopSpeed,
  planeHeight,
  planeWidth,
} from '../constants'
import {
  createPlaneItems,
  getNormalizedPlaneOffset,
  getPlaneMotionFromVelocity,
  getPlaneTransform,
} from '../utils'

const initialDragState: DragState = {
  isDragging: false,
  hasMoved: false,
  startX: 0,
  startY: 0,
  pointerX: 0,
  pointerY: 0,
  time: 0,
}

export function useFriendsPlaneController() {
  const stageRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const itemElementMapRef = useRef(new Map<string, PlaneItemElement>())
  const offsetRef = useRef<PlaneOffset>({ x: 0, y: 0 })
  const motionRef = useRef<PlaneMotion>(defaultPlaneMotion)
  const velocityRef = useRef<PlaneVelocity>({ x: 0, y: 0 })
  const focusRadiusRef = useRef(260)
  const renderFrameRef = useRef(0)
  const momentumFrameRef = useRef(0)
  const lastDragAtRef = useRef(0)
  const dragStateRef = useRef<DragState>(initialDragState)
  const planeItems = useMemo(createPlaneItems, [])

  const updateStageMetrics = useCallback(() => {
    const stage = stageRef.current

    if (!stage) return

    const stageRect = stage.getBoundingClientRect()
    focusRadiusRef.current = Math.max(180, Math.min(stageRect.width, stageRect.height) * 0.46)
  }, [])

  const updatePlaneItemFocus = useCallback((offset: PlaneOffset) => {
    const focusRadius = focusRadiusRef.current

    itemElementMapRef.current.forEach(item => {
      const x = offset.x + item.x - planeWidth / 2
      const y = offset.y + item.y - planeHeight / 2
      const focus = Math.max(0, 1 - Math.hypot(x, y) / focusRadius)
      const scale = item.baseScale * (1 + focus * focus * centerFocusScale)
      const zIndex = Math.round(focus * 100)

      if (Math.abs(scale - item.scale) > 0.002) {
        item.scale = scale
        item.element.style.setProperty('--item-scale', scale.toFixed(4))
      }

      if (zIndex !== item.zIndex) {
        item.zIndex = zIndex
        item.element.style.zIndex = String(zIndex)
      }
    })
  }, [])

  const renderPlane = useCallback(() => {
    renderFrameRef.current = 0

    if (planeRef.current) {
      planeRef.current.style.transform = getPlaneTransform(offsetRef.current, motionRef.current)
    }

    updatePlaneItemFocus(offsetRef.current)
  }, [updatePlaneItemFocus])

  const schedulePlaneRender = useCallback(() => {
    if (renderFrameRef.current) return

    renderFrameRef.current = requestAnimationFrame(renderPlane)
  }, [renderPlane])

  const applyPlaneOffset = (
    offset: PlaneOffset,
    motion: PlaneMotion = motionRef.current,
    shouldRenderNow = false,
  ) => {
    offsetRef.current = getNormalizedPlaneOffset(offset)
    motionRef.current = motion

    if (shouldRenderNow) {
      cancelAnimationFrame(renderFrameRef.current)
      renderPlane()
      return
    }

    schedulePlaneRender()
  }

  const stopMomentum = () => {
    cancelAnimationFrame(momentumFrameRef.current)
    momentumFrameRef.current = 0
  }

  const startMomentum = () => {
    stopMomentum()

    let previousTime = performance.now()

    const tick = (time: number) => {
      const elapsed = Math.min(32, time - previousTime)
      previousTime = time

      const velocity = velocityRef.current
      const friction = Math.exp((-elapsed * 5) / 1000)
      const nextVelocity = {
        x: velocity.x * friction,
        y: velocity.y * friction,
      }
      const nextOffset = {
        x: offsetRef.current.x + ((velocity.x + nextVelocity.x) / 2) * elapsed,
        y: offsetRef.current.y + ((velocity.y + nextVelocity.y) / 2) * elapsed,
      }

      velocityRef.current = nextVelocity

      if (Math.hypot(nextVelocity.x, nextVelocity.y) < momentumStopSpeed) {
        velocityRef.current = { x: 0, y: 0 }
        applyPlaneOffset(nextOffset, defaultPlaneMotion, true)
        momentumFrameRef.current = 0
        return
      }

      applyPlaneOffset(nextOffset, getPlaneMotionFromVelocity(nextVelocity, false), true)
      momentumFrameRef.current = requestAnimationFrame(tick)
    }

    momentumFrameRef.current = requestAnimationFrame(tick)
  }

  const setPlaneItemRef = (
    key: string,
    element: HTMLElement | null,
    item: PlaneItem,
    copy: PlaneCopy,
  ) => {
    if (element) {
      itemElementMapRef.current.set(key, {
        element,
        x: item.x + copy.x * planeWidth,
        y: item.y + copy.y * planeHeight,
        baseScale: item.scale,
        scale: item.scale,
        zIndex: 0,
      })
      return
    }

    itemElementMapRef.current.delete(key)
  }

  useEffect(() => {
    const handleResize = () => {
      updateStageMetrics()
      schedulePlaneRender()
    }

    updateStageMetrics()
    schedulePlaneRender()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(renderFrameRef.current)
      cancelAnimationFrame(momentumFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [schedulePlaneRender, updateStageMetrics])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    stopMomentum()
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = 'true'
    event.currentTarget.dataset.moving = 'false'
    velocityRef.current = { x: 0, y: 0 }
    applyPlaneOffset(offsetRef.current, defaultPlaneMotion, true)
    dragStateRef.current = {
      isDragging: true,
      hasMoved: false,
      startX: event.clientX,
      startY: event.clientY,
      pointerX: event.clientX,
      pointerY: event.clientY,
      time: performance.now(),
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current

    if (!dragState.isDragging) return

    const deltaX = event.clientX - dragState.pointerX
    const deltaY = event.clientY - dragState.pointerY
    const startDeltaX = event.clientX - dragState.startX
    const startDeltaY = event.clientY - dragState.startY
    const time = performance.now()
    const elapsed = Math.max(16, time - dragState.time)
    const velocity = {
      x: deltaX / elapsed,
      y: deltaY / elapsed,
    }
    const smoothedVelocity = {
      x: velocityRef.current.x + (velocity.x - velocityRef.current.x) * dragVelocitySmoothing,
      y: velocityRef.current.y + (velocity.y - velocityRef.current.y) * dragVelocitySmoothing,
    }

    if (Math.hypot(startDeltaX, startDeltaY) > 4) {
      dragState.hasMoved = true
      event.currentTarget.dataset.moving = 'true'
    }

    dragState.pointerX = event.clientX
    dragState.pointerY = event.clientY
    dragState.time = time
    velocityRef.current = smoothedVelocity
    applyPlaneOffset(
      {
        x: offsetRef.current.x + deltaX,
        y: offsetRef.current.y + deltaY,
      },
      getPlaneMotionFromVelocity(smoothedVelocity, true),
    )
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (dragState.hasMoved) {
      lastDragAtRef.current = performance.now()
    }

    event.currentTarget.dataset.dragging = 'false'
    event.currentTarget.dataset.moving = 'false'
    dragStateRef.current = {
      ...dragState,
      isDragging: false,
    }

    if (dragState.hasMoved) {
      startMomentum()
      return
    }

    velocityRef.current = { x: 0, y: 0 }
    applyPlaneOffset(offsetRef.current, defaultPlaneMotion)
  }

  const handleFriendClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (performance.now() - lastDragAtRef.current < dragClickDelay) {
      event.preventDefault()
    }
  }

  return {
    handleFriendClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    offsetRef,
    planeItems,
    planeRef,
    setPlaneItemRef,
    stageRef,
  }
}
