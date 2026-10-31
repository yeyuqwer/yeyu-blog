import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'

export function DataTablePagination({
  pageCount,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
}: {
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageIndexChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  return (
    <div className="flex shrink-0 items-center justify-end border-t border-zinc-200 py-2 pr-2 dark:border-zinc-800">
      <div className="flex items-center gap-x-2 lg:gap-x-3">
        <div className="flex items-center gap-x-2">
          <Select
            value={`${pageSize}`}
            onValueChange={value => {
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[15, 30, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {pageIndex + 1} /{pageCount}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="hidden size-8 cursor-pointer p-0 lg:flex"
            onClick={() => onPageIndexChange(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">首页</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8 cursor-pointer p-0"
            onClick={() => onPageIndexChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">上一页</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8 cursor-pointer p-0"
            onClick={() => onPageIndexChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">下一页</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 cursor-pointer p-0 lg:flex"
            onClick={() => onPageIndexChange(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">最后一页</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
