'use client'

import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { motion } from 'motion/react'
import { useState } from 'react'
import { DataTablePagination } from '@/ui/components/shared/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/shadcn/table'

export function DataTable<TData, TValue>({
  columns,
  data = [],
  onPaginationChange,
  pageCount,
  pagination: controlledPagination,
}: {
  columns: ColumnDef<TData, TValue>[]
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isManualPagination ? undefined : getPaginationRowModel(),
    manualPagination: isManualPagination,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
    pageCount: isManualPagination ? pageCount : undefined,
    state: {
      pagination: tablePagination,
    },
  })
  const rows = table.getRowModel().rows

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
      <div className="min-h-0 min-w-0 flex-1 overflow-auto [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
        <Table containerClassName="overflow-visible">
          <TableHeader className="bg-gray-100 dark:bg-card">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="sticky top-0 z-20 bg-gray-100 text-gray-500 shadow-[0_1px_0_var(--border)] dark:bg-card dark:text-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* 后序再骨架屏效果 */}
          {/* 11 个月前说要做骨架屏效果🤣 */}
          <TableBody>
            {rows.length > 0 ? (
              rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      <DataTablePagination table={table} />
    </motion.div>
  )
}
