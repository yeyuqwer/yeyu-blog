'use client'

import { Moon, Sun } from 'lucide-react'
import { useTransitionTheme } from '@/hooks/animation'
import { Button } from '@/ui/shadcn/button'

export function ModeToggle() {
  const { setTransitionTheme, theme } = useTransitionTheme()

  return (
    <Button
      onClick={() =>
        setTransitionTheme(theme === 'light' ? 'dark' : 'light', {
          direction: theme === 'light' ? 'bottom' : 'top',
        })
      }
      size="sm"
      className="cursor-pointer"
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
