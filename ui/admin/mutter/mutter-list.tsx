'use client'

import { Edit2, Eye, EyeOff, Trash } from 'lucide-react'
import Image, { type ImageLoaderProps } from 'next/image'
import { type ComponentProps, type FC, useState } from 'react'
import { sileo } from 'sileo'
import { useMutterPublishMutation, useMutterQuery } from '@/hooks/api/mutter'
import { prettyDateTime } from '@/lib/utils/time'
import { useModalStore } from '@/store/use-modal-store'
import Loading from '@/ui/components/shared/loading'
import { Button } from '@/ui/shadcn/button'

const httpsUrlPattern = /https:\/\/[^\s<>"'`]+/g
const trailingUrlTextPattern = /[),.;:!?，。！？；：、]+$/g
const passthroughImageLoader = ({ src }: ImageLoaderProps) => src

function MutterLink({
  faviconUrl,
  href,
  isPublished,
  label,
}: {
  faviconUrl: string
  href: string
  isPublished: boolean
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={href}
      className={`inline-flex max-w-full items-center gap-1.5 text-zinc-600 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 ${
        isPublished ? '' : 'text-muted-foreground line-through'
      }`}
    >
      <Image
        src={faviconUrl}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        loader={passthroughImageLoader}
        unoptimized
      />
      <span className="min-w-0 truncate">{label}</span>
    </a>
  )
}

function getMutterListContentBlocks(content: string) {
  const blocks: Array<
    | {
        kind: 'text'
        value: string
      }
    | {
        kind: 'link'
        faviconUrl: string
        href: string
        label: string
      }
  > = []
  let textStartIndex = 0

  const appendTextBlock = (text: string) => {
    const value = text.replace(/\n{3,}/g, '\n\n').trim()

    if (value.length === 0) {
      return
    }

    const previousBlock = blocks.at(-1)

    if (previousBlock?.kind === 'text') {
      previousBlock.value = `${previousBlock.value}\n${value}`
      return
    }

    blocks.push({
      kind: 'text',
      value,
    })
  }

  for (const match of content.matchAll(httpsUrlPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index ?? 0
    const urlText = matchedText.replace(trailingUrlTextPattern, '')
    const nextTextStartIndex = matchIndex + urlText.length

    if (!URL.canParse(urlText)) {
      continue
    }

    const url = new URL(urlText)
    appendTextBlock(content.slice(textStartIndex, matchIndex))
    blocks.push({
      kind: 'link',
      faviconUrl: getMutterLinkFaviconUrl(url),
      href: url.toString(),
      label: getMutterLinkLabel(url),
    })
    textStartIndex = nextTextStartIndex
  }

  appendTextBlock(content.slice(textStartIndex))

  return blocks
}

function getMutterLinkFaviconUrl(url: URL) {
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url.origin)}&sz=64`
}

function getMutterLinkLabel(url: URL) {
  const pathname = url.pathname === '/' ? '' : url.pathname
  return `${url.hostname}${pathname}${url.search}${url.hash}`
}

export const MutterList: FC<
  ComponentProps<'main'> & {
    query: string
    onEditMutter: (values: { id: number; content: string }) => void
  }
> = ({ query, onEditMutter }) => {
  const { data, isPending } = useMutterQuery({ q: query })
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const { mutate: toggleMutterPublish } = useMutterPublishMutation()
  const [togglingMutterIds, setTogglingMutterIds] = useState<number[]>([])
  const mutters = data?.list ?? []

  const handleTogglePublish = (id: number, isPublished: boolean) => {
    setTogglingMutterIds(previousIds =>
      previousIds.includes(id) ? previousIds : [...previousIds, id],
    )

    toggleMutterPublish(
      {
        id,
        isPublished,
      },
      {
        onSuccess: () => {
          sileo.success({
            title: isPublished ? 'Mutter is now visible.' : 'Mutter is now hidden.',
          })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
        onSettled: () => {
          setTogglingMutterIds(previousIds => previousIds.filter(currentId => currentId !== id))
        },
      },
    )
  }

  if (isPending) {
    return <Loading />
  }

  return (
    <main className="flex min-h-0 flex-1 overflow-y-auto rounded-lg bg-zinc-50/70 [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] dark:bg-zinc-950/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
      {mutters.length === 0 ? (
        <div className="m-auto">虚无。</div>
      ) : (
        <ul className="w-full space-y-2">
          {mutters.map(item => {
            const createdAt = new Date(item.createdAt)
            const updatedAt = new Date(item.updatedAt)
            const isEdited = updatedAt.getTime() > createdAt.getTime()
            const displayAt = isEdited ? updatedAt : createdAt
            const blocks = getMutterListContentBlocks(item.content)

            return (
              <li
                key={item.id}
                className="relative rounded-lg border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-950"
              >
                <section className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer"
                    aria-label="edit mutter"
                    onClick={() => {
                      onEditMutter({
                        id: item.id,
                        content: item.content,
                      })
                    }}
                  >
                    <Edit2 className="size-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer"
                    aria-label={item.isPublished ? 'hide mutter' : 'show mutter'}
                    disabled={togglingMutterIds.includes(item.id)}
                    onClick={() => {
                      handleTogglePublish(item.id, !item.isPublished)
                    }}
                  >
                    {item.isPublished ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="cursor-pointer text-red-600"
                    aria-label="delete mutter"
                    onClick={() => {
                      setModalOpen('deleteMutterModal', {
                        id: item.id,
                        content: item.content,
                      })
                    }}
                  >
                    <Trash className="size-3" />
                  </Button>
                </section>

                <div className="flex flex-col gap-2 pr-22 text-sm leading-6">
                  {blocks.map((block, index) => {
                    if (block.kind === 'text') {
                      return (
                        <p
                          key={`text-${index}`}
                          className={`wrap-break-word whitespace-pre-wrap ${
                            item.isPublished ? '' : 'text-muted-foreground line-through'
                          }`}
                        >
                          {block.value}
                        </p>
                      )
                    }

                    if (block.kind === 'link') {
                      return (
                        <MutterLink
                          key={`link-${block.href}-${index}`}
                          faviconUrl={block.faviconUrl}
                          href={block.href}
                          isPublished={item.isPublished}
                          label={block.label}
                        />
                      )
                    }

                    return null
                  })}
                </div>
                <time className="mt-2 block text-right text-muted-foreground text-xs">
                  {prettyDateTime(displayAt)}
                  {isEdited ? <span className="ml-1">(#已编辑)</span> : null}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
