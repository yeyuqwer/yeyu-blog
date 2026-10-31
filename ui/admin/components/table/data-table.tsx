'use client'

import type { ColumnDef, OnChangeFn, PaginationState, RowData } from '@tanstack/react-table'
import { useTable } from '@tanstack/react-table'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/shadcn/table'
import { dataTableFeatures } from './data-table-features'
import { DataTablePagination } from './data-table-pagination'

const emptyData: never[] = []

export function DataTable<TData extends RowData>({
  columns,
  data = emptyData,
  onPaginationChange,
  pageCount,
  pagination: controlledPagination,
}: {
  columns: ColumnDef<typeof dataTableFeatures, TData>[]
  data: TData[]
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pagination?: PaginationState
}) {
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const tablePagination = controlledPagination ?? internalPagination
  const isManualPagination = controlledPagination != null && onPaginationChange != null
  const table = useTable({
    columns,
    data,
    features: dataTableFeatures,
    manualPagination: isManualPagination,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    pageCount: isManualPagination ? pageCount : undefined,
    state: {
      pagination: tablePagination,
    },
  })
  const resolvedPageCount = Math.max(table.getPageCount(), 1)
  const resolvedPageIndex = Math.min(table.state.pagination.pageIndex, resolvedPageCount - 1)
  const rows = table.getRowModel().rows

  const updatePageIndex = (nextPageIndex: number) => {
    table.setPageIndex(Math.min(Math.max(nextPageIndex, 0), resolvedPageCount - 1))
  }

  return (
    <motion.div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border bg-zinc-50/70 dark:bg-zinc-950/50"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <div className="min-h-0 min-w-0 flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.45)_transparent] overflow-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent">
        <Table containerClassName="overflow-visible">
          <TableHeader className="dark:bg-card bg-zinc-100">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className="dark:bg-card sticky top-0 z-20 bg-zinc-100 text-zinc-500 shadow-[0_1px_0_var(--border)] dark:text-zinc-200"
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* 后序再骨架屏效果 */}
          {/* 11 个月前说要做骨架屏效果🤣 */}
          <TableBody>
            {rows.length > 0 ? (
              rows.map(row => (
                <TableRow key={row.id}>
                  {row.getAllCells().map(cell => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  虚无。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        pageCount={resolvedPageCount}
        pageIndex={resolvedPageIndex}
        pageSize={tablePagination.pageSize}
        onPageIndexChange={updatePageIndex}
        onPageSizeChange={nextPageSize => {
          table.setPageSize(nextPageSize)
          table.setPageIndex(0)
        }}
      />
    </motion.div>
  )
}
