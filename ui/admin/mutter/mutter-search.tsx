import type { Dispatch, SetStateAction } from 'react'
import { Search } from 'lucide-react'
import { type ComponentProps, type FC, useRef } from 'react'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'

export const MutterSearch: FC<
  ComponentProps<'header'> & { setQuery: Dispatch<SetStateAction<string>> }
> = ({ setQuery }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const applyQuery = () => {
    const query = inputRef.current?.value
    setQuery(query?.trim() ? query.trim() : '')
  }

  return (
    <header className="flex w-full shrink-0 gap-2">
      <Input
        className="w-full"
        placeholder="搜索回忆..."
        ref={inputRef}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            applyQuery()
          }
        }}
      />

      <Button type="button" variant="secondary" className="cursor-pointer" onClick={applyQuery}>
        <Search />
        搜索
      </Button>
    </header>
  )
}
