'use client'

import type { ComponentProps, FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getBlogList, getBlogsBySelectedTagName, getQueryBlog } from '@/actions/blogs'
import { useBlogTagsQuery } from '@/hooks/api/tag'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import BlogSearch from './blog-search'
import { columns } from './blog-table-column'
import { BlogTagsContainer } from './blog-tags-container'

export const AdminBlogPage: FC<ComponentProps<'div'>> = () => {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: blogList, isPending: blogListPending } = useQuery({
    queryKey: ['blog-list', query, selectedTags],
    queryFn: () => {
      if (query.trim().length > 0) return getQueryBlog(query)
      if (selectedTags.length > 0) return getBlogsBySelectedTagName(selectedTags)
      return getBlogList()
    },
    staleTime: 1000 * 30,
  })

  const { data: blogTags, isPending: blogTagsPending } = useBlogTagsQuery()

  return (
    <main className="flex w-full flex-col gap-2">
      <BlogSearch setQuery={setQuery} />

      {!blogTagsPending && (
        <BlogTagsContainer blogTagList={blogTags ?? []} setSelectedTags={setSelectedTags} />
      )}

      {blogListPending || blogTagsPending ? (
        <Loading />
      ) : (
        <DataTable columns={columns} data={blogList ?? []} />
      )}
    </main>
  )
}
