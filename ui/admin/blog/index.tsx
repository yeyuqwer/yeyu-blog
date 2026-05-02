'use client'

import type { ComponentProps, FC, SetStateAction } from 'react'
import { useState } from 'react'
import { useBlogQuery } from '@/hooks/api/blog'
import { useBlogTagsQuery } from '@/hooks/api/tag'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import BlogSearch from './blog-search'
import { columns } from './blog-table-column'
import { BlogTagsContainer } from './blog-tags-container'

export const AdminBlogPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const updateQuery = (value: SetStateAction<string>) => {
    setPagination(previousPagination => ({
      ...previousPagination,
      pageIndex: 0,
    }))
    setQuery(value)
  }
  const updateSelectedTags = (value: SetStateAction<string[]>) => {
    setPagination(previousPagination => ({
      ...previousPagination,
      pageIndex: 0,
    }))
    setSelectedTags(value)
  }

  const { data: blogList, isPending: blogListPending } = useBlogQuery({
    q: query,
    tagNames: selectedTags,
    take: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  })

  const { data: blogTags, isPending: blogTagsPending } = useBlogTagsQuery()
  const blogPageCount = Math.ceil((blogList?.total ?? 0) / pagination.pageSize)

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full min-w-0 flex-col gap-3 pb-4">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
        <BlogSearch setQuery={updateQuery} />

        {!blogTagsPending && (
          <BlogTagsContainer blogTagList={blogTags ?? []} setSelectedTags={updateSelectedTags} />
        )}

        {blogListPending || blogTagsPending ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={blogList?.list ?? []}
            onPaginationChange={setPagination}
            pageCount={blogPageCount}
            pagination={pagination}
          />
        )}
      </section>
    </main>
  )
}
