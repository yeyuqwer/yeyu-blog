'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '@/ui/components/interior/lightbox'

export function ArticleImageLoadEnhancer({ rootSelector }: { rootSelector: string }) {
  const originRef = useRef<HTMLImageElement>(null)
  const originVisibilityRef = useRef('')
  const [lightbox, setLightbox] = useState<{
    open: boolean
    src: string
    alt: string
    width?: number
    height?: number
  }>({
    open: false,
    src: '',
    alt: '',
  })

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) return

    const visibilityObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const frame = entry.target
        if (!(frame instanceof HTMLElement)) continue
        frame.dataset.articleImageVisible = String(entry.isIntersecting)
      }
    })

    const setImageState = (image: HTMLImageElement, state: 'loading' | 'loaded' | 'error') => {
      const frame = image.parentElement
      if (frame == null) return

      frame.dataset.articleImageState = state
      frame.setAttribute('aria-busy', String(state === 'loading'))
      image.tabIndex = state === 'loaded' ? 0 : -1

      if (state === 'loading') {
        visibilityObserver.observe(frame)
      } else {
        visibilityObserver.unobserve(frame)
        delete frame.dataset.articleImageVisible
      }
    }

    const markImage = (image: HTMLImageElement) => {
      image.setAttribute('role', 'button')
      image.setAttribute('aria-haspopup', 'dialog')
      image.dataset.articleImageLightbox = 'true'

      if (image.complete) {
        setImageState(image, image.naturalWidth > 0 ? 'loaded' : 'error')
        return
      }

      setImageState(image, 'loading')
    }

    const markImages = () => {
      root.querySelectorAll<HTMLImageElement>('.md-image-frame > img').forEach(markImage)
    }

    const handleImageSettled = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (!target.matches('.md-image-frame > img')) return

      setImageState(target, target.naturalWidth > 0 ? 'loaded' : 'error')
    }

    const openImage = (image: HTMLImageElement) => {
      originRef.current = image
      setLightbox({
        open: true,
        src: image.src,
        alt: image.alt,
        width: image.naturalWidth > 0 ? image.naturalWidth : undefined,
        height: image.naturalHeight > 0 ? image.naturalHeight : undefined,
      })
    }

    const handleImageClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (!target.matches('.md-image-frame > img')) return
      if (!target.complete || target.naturalWidth === 0) return

      event.preventDefault()
      openImage(target)
    }

    const handleImageKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return
      if (!target.matches('.md-image-frame > img')) return
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (!target.complete || target.naturalWidth === 0) return

      event.preventDefault()
      openImage(target)
    }

    markImages()

    const observer = new MutationObserver(() => {
      markImages()
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener('load', handleImageSettled, true)
    root.addEventListener('error', handleImageSettled, true)
    root.addEventListener('click', handleImageClick)
    root.addEventListener('keydown', handleImageKeyDown)

    return () => {
      observer.disconnect()
      visibilityObserver.disconnect()
      root.removeEventListener('load', handleImageSettled, true)
      root.removeEventListener('error', handleImageSettled, true)
      root.removeEventListener('click', handleImageClick)
      root.removeEventListener('keydown', handleImageKeyDown)
    }
  }, [rootSelector])

  const handleOriginVisibilityChange = (hidden: boolean) => {
    const origin = originRef.current
    if (origin == null) return

    if (hidden) {
      originVisibilityRef.current = origin.style.visibility
      origin.style.visibility = 'hidden'
      return
    }

    origin.style.visibility = originVisibilityRef.current
  }

  return (
    <Lightbox
      open={lightbox.open}
      onClose={() => setLightbox(current => ({ ...current, open: false }))}
      onOriginVisibilityChange={handleOriginVisibilityChange}
      src={lightbox.src}
      alt={lightbox.alt}
      width={lightbox.width}
      height={lightbox.height}
      originRef={originRef}
    />
  )
}
