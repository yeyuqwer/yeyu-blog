'use client'

import { Moon, Sun } from 'lucide-react'
import { useTransitionTheme } from '@/hooks/animation'
import { useIsMounted } from '@/hooks/common'
import { Button } from '@/ui/shadcn/button'

export function ModeToggle() {
  const { setTransitionTheme, resolvedTheme } = useTransitionTheme()
  const mounted = useIsMounted()
  const currentTheme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <Button
      onClick={() =>
        setTransitionTheme(currentTheme === 'light' ? 'dark' : 'light', {
          direction: currentTheme === 'light' ? 'bottom' : 'top',
        })
      }
      size="sm"
      className="cursor-pointer"
    >
      {currentTheme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
