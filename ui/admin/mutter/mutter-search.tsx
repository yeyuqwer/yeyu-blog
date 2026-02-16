import { Search } from 'lucide-react'
import { type ComponentProps, type FC, useRef } from 'react'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'

export const MutterSearch: FC<ComponentProps<'header'>> = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="flex w-full gap-2">
      <Input
        className="w-full"
        placeholder="请输入标签名喵~"
        ref={inputRef}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const query = inputRef.current?.value
            if (query?.trim() != null) {
              // setQuery(query)
            } else {
              // setQuery('')
            }
          }
        }}
      />

      <Button
        type="button"
        variant="secondary"
        className="cursor-pointer"
        onClick={() => {
          // const _query = inputRef.current?.value
          // if (query?.trim() != null) {
          //   setQuery(query)
          // }
        }}
      >
        <Search />
        搜索
      </Button>
    </header>
  )
}
