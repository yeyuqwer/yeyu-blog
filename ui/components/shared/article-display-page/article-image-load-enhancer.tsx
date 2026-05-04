'use client'

import { useEffect } from 'react'

export function ArticleImageLoadEnhancer({ rootSelector }: { rootSelector: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) return

    const markImage = (image: HTMLImageElement) => {
      image.loading = 'lazy'
      image.decoding = 'async'

      if (image.complete) {
        delete image.dataset.articleImageLoading
        return
      }

      image.dataset.articleImageLoading = 'true'
    }

    const markImages = () => {
      root.querySelectorAll<HTMLImageElement>('.md-image-frame > img').forEach(markImage)
    }

    const handleImageLoad = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLImageElement)) return

      delete target.dataset.articleImageLoading
    }

    markImages()

    const observer = new MutationObserver(() => {
      markImages()
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener('load', handleImageLoad, true)

    return () => {
      observer.disconnect()
      root.removeEventListener('load', handleImageLoad, true)
    }
  }, [rootSelector])

  return null
}
