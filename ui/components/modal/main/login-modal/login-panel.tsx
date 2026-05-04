import { signIn } from '@/lib/core/auth/client'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { GitHubIcon } from './assets/github-icon'
import { GoogleIcon } from './assets/google-icon'

export const LoginPanel = ({
  hasWalletLogin,
  isActionPending,
}: {
  hasWalletLogin: boolean
  isActionPending: boolean
}) => {
  return (
    <>
      <Button
        type="button"
        onClick={() => signIn.social({ provider: 'github', callbackURL: '/admin' })}
        className={cn(
          'h-10 min-w-0 cursor-pointer rounded-xl border-theme-border/70 bg-theme-surface/50 px-4 text-sm text-theme-primary hover:border-theme-indicator/40 hover:bg-theme-hover-background/70 hover:text-theme-primary focus-visible:ring-theme-ring/25 disabled:cursor-not-allowed dark:border-theme-400/20 dark:bg-theme-950/35 dark:text-theme-100 dark:hover:bg-theme-900/45 dark:hover:text-theme-50',
          hasWalletLogin ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GitHubIcon className="size-5 shrink-0" />
        <span className="truncate">GitHub</span>
      </Button>

      <Button
        type="button"
        onClick={() => signIn.social({ provider: 'google', callbackURL: '/admin' })}
        className={cn(
          'h-10 min-w-0 cursor-pointer rounded-xl border-theme-border/70 bg-theme-surface/50 px-4 text-sm text-theme-primary hover:border-theme-indicator/40 hover:bg-theme-hover-background/70 hover:text-theme-primary focus-visible:ring-theme-ring/25 disabled:cursor-not-allowed dark:border-theme-400/20 dark:bg-theme-950/35 dark:text-theme-100 dark:hover:bg-theme-900/45 dark:hover:text-theme-50',
          hasWalletLogin ? 'justify-start' : 'justify-center',
        )}
        disabled={isActionPending}
      >
        <GoogleIcon className="size-5 shrink-0" />
        <span className="truncate">Google</span>
      </Button>
    </>
  )
}
