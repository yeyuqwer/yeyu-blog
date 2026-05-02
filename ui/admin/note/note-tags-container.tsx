'use client'

import type { NoteTag } from '@prisma/client'
import type { Dispatch, SetStateAction } from 'react'
import type { CarouselApi } from '@/ui/shadcn/carousel'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { NoteTagItemToggle } from '@/ui/components/shared/tag-item-toggle'
import { Carousel, CarouselContent, CarouselItem } from '@/ui/shadcn/carousel'

export function NoteTagsContainer({
  noteTagList,
  setSelectedTags,
}: {
  noteTagList: NoteTag[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const noteTags = noteTagList.map(tag => tag.tagName)

  useEffect(() => {
    if (api == null) {
      return
    }

    const updateMaskState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateMaskState()

    api.on('select', updateMaskState)
    api.on('reInit', updateMaskState)

    return () => {
      api.off('select', updateMaskState)
      api.off('reInit', updateMaskState)
    }
  }, [api])

  return (
    <Carousel
      opts={{
        align: 'start',
        dragFree: true,
      }}
      setApi={setApi}
      className="relative w-full min-w-0 shrink-0 overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-20 w-20',
          'bg-gradient-to-r from-white via-white/90 to-transparent dark:from-black dark:via-black/85',
          'shadow-[18px_0_24px_-24px_rgb(24_24_27/0.45)] dark:shadow-[18px_0_24px_-24px_rgb(0_0_0/0.7)]',
          'transition-opacity duration-200 ease-out',
          canScrollPrev ? 'opacity-100' : 'opacity-0',
        )}
      />

      <CarouselContent className="min-w-0">
        {noteTags.length === 0 ? (
          <CarouselItem className="m-auto text-muted-foreground">没有标签 (｡•́︿•̀｡)</CarouselItem>
        ) : (
          noteTags.map((tag, i) => (
            <CarouselItem className="basis-auto" key={tag.toLowerCase()}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 50,
                    damping: 12,
                    mass: 0.5,
                    delay: i * 0.15,
                  },
                }}
              >
                <NoteTagItemToggle tag={tag} setSelectedTags={setSelectedTags} />
              </motion.div>
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 right-0 z-20 w-20',
          'bg-gradient-to-l from-white via-white/90 to-transparent dark:from-black dark:via-black/85',
          'shadow-[-18px_0_24px_-24px_rgb(24_24_27/0.45)] dark:shadow-[-18px_0_24px_-24px_rgb(0_0_0/0.7)]',
          'transition-opacity duration-200 ease-out',
          canScrollNext ? 'opacity-100' : 'opacity-0',
        )}
      />
    </Carousel>
  )
}
