'use client'

import type { Blog, Note } from '@prisma/client'
import type { FC } from 'react'
import type { ArticleDTO } from './type'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { File, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createBlog, updateBlogById } from '@/actions/blogs'
import { createNote, updateNoteById } from '@/actions/notes'
import { useBlogTagsQuery, useNoteTagsQuery } from '@/hooks/api/tag'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Combobox } from '@/ui/shadcn/combobox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/shadcn/form'
import { Input } from '@/ui/shadcn/input'
import { Switch } from '@/ui/shadcn/switch'
import MarkdownEditor from './markdown-editor'
import { ArticleSchema } from './type'

// * 策略模式~
const STRATEGIES = {
  [TagType.BLOG]: {
    create: createBlog,
    update: updateBlogById,
    queryKey: 'blog-list',
    path: 'blog',
  },
  [TagType.NOTE]: {
    create: createNote,
    update: updateNoteById,
    queryKey: 'note-list',
    path: 'note',
  },
}

function syncMarkdownTitle(content: string, title: string): string {
  const normalizedTitle = title.trim()
  const lines = content.split(/\r?\n/)
  const firstLine = lines[0] ?? ''
  const hasHeading = /^#\s+/.test(firstLine)

  if (normalizedTitle.length === 0) {
    if (!hasHeading) return content

    lines.shift()
    if (lines[0] === '') {
      lines.shift()
    }
    return lines.join('\n')
  }

  const heading = `# ${normalizedTitle}`
  if (content.trim().length === 0) return heading

  if (hasHeading) {
    lines[0] = heading
    return lines.join('\n')
  }

  return `${heading}\n\n${content}`
}

function extractMarkdownH1Title(content: string): string | null {
  const firstLine = content.split(/\r?\n/, 1)[0] ?? ''
  const match = firstLine.match(/^#(?!#)\s*(.*)$/)
  if (match == null) return null
  return match[1].trim()
}

export const AdminArticleEditPage: FC<{
  article: Blog | Note | null
  relatedArticleTagNames?: string[]
  type: TagType
}> = ({ article, relatedArticleTagNames, type }) => {
  const router = useRouter()
  const { setModalOpen } = useModalStore()
  const strategy = STRATEGIES[type]
  const { data: blogTags } = useBlogTagsQuery({
    enabled: type === TagType.BLOG,
  })
  const { data: noteTags } = useNoteTagsQuery({
    enabled: type === TagType.NOTE,
  })
  const allTags = type === TagType.BLOG ? (blogTags ?? []) : (noteTags ?? [])

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ArticleDTO) => {
      if (article?.id != null) {
        return strategy.update({ ...values, id: article.id })
      }
      return strategy.create(values)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: [strategy.queryKey] })

      toast.success('保存成功')
      router.push(`/admin/${strategy.path}/edit/${variables.slug}`)
    },
    onError: error => {
      if (error instanceof Error) {
        toast.error(`保存失败 ${error.message}`)
      } else {
        toast.error(`保存失败`)
      }
    },
  })

  const form = useForm<ArticleDTO>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      isPublished: article?.isPublished ?? false,
      relatedTagNames: relatedArticleTagNames ?? [],
      content: article?.content ?? '',
    },
    mode: 'onBlur',
  })
  const previewTitle = form.watch('title')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => mutate(values))}
        className="w-full space-y-8 pb-44"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">标题</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入标题"
                  {...field}
                  onChange={e => {
                    const nextTitle = e.target.value
                    field.onChange(nextTitle)

                    const currentContent = form.getValues('content')
                    const nextContent = syncMarkdownTitle(currentContent, nextTitle)

                    if (nextContent !== currentContent) {
                      form.setValue('content', nextContent, {
                        shouldValidate: true,
                      })
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">slug</FormLabel>
              <FormControl>
                <Input placeholder="请输入 slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">是否发布</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={checked => {
                    field.onChange(checked)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="relatedTagNames"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel className="text-lg">标签</FormLabel>
                <FormControl>
                  <Combobox
                    options={
                      allTags.map(el => ({
                        label: el.tagName,
                        value: el.tagName,
                      })) ?? []
                    }
                    multiple
                    clearable
                    selectPlaceholder="请选择标签"
                    value={field.value}
                    onValueChange={val =>
                      form.setValue('relatedTagNames', val, {
                        shouldValidate: true,
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="default"
            onClick={() => setModalOpen('createTagModal')}
            className="cursor-pointer"
          >
            新建标签
          </Button>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">内容</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={nextContent => {
                    field.onChange(nextContent)

                    const markdownTitle = extractMarkdownH1Title(nextContent)
                    if (markdownTitle == null) return

                    const currentTitle = form.getValues('title')
                    if (markdownTitle !== currentTitle) {
                      form.setValue('title', markdownTitle, {
                        shouldValidate: true,
                      })
                    }
                  }}
                  previewTitle={previewTitle}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <File className="mr-2 h-4 w-4" />
              保存
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
