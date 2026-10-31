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
          'h-10 min-w-0 cursor-pointer rounded-xl border-black/10 bg-black/[0.03] px-4 text-sm text-zinc-800 hover:border-black/20 hover:bg-black/[0.06] hover:text-black focus-visible:ring-black/20 disabled:cursor-not-allowed dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white/35',
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
          'h-10 min-w-0 cursor-pointer rounded-xl border-black/10 bg-black/[0.03] px-4 text-sm text-zinc-800 hover:border-black/20 hover:bg-black/[0.06] hover:text-black focus-visible:ring-black/20 disabled:cursor-not-allowed dark:border-white/12 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:border-white/25 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white/35',
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
