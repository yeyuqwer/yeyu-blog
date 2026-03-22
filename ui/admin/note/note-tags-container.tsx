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
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(0)

  const noteTags = noteTagList.map(tag => tag.tagName)

  useEffect(() => {
    if (api == null) {
      return
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    setCount(api.scrollSnapList().length)
    updateCurrent()

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  return (
    <Carousel
      opts={{
        align: 'start',
        dragFree: true,
      }}
      setApi={setApi}
      className="relative"
    >
      <span
        className={cn(
          'absolute top-0 bottom-0 left-0 z-10 w-12',
          'bg-gradient-to-r from-white/80 to-transparent dark:from-black/60',
          'pointer-events-none transition-colors duration-300 ease-in-out',
          current === 1 && 'hidden',
        )}
      />

      <CarouselContent className="w-fit max-w-[calc(100vw-4rem)] shrink-0">
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
      {/* 右侧 fade 遮罩 */}
      <span
        className={cn(
          'absolute top-0 right-0 bottom-0 z-10 w-12',
          'bg-gradient-to-l from-white/80 to-transparent dark:from-black/60',
          'pointer-events-none transition-colors duration-300 ease-in-out',
          current === count && 'hidden',
        )}
      />
    </Carousel>
  )
}
