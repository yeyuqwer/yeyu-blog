import { cn } from '@/lib/utils/common/shadcn'

export function FriendBlueprint({
  name,
  description,
  isRightAligned,
}: {
  name: string
  description: string
  isRightAligned: boolean
}) {
  return (
    <div
      aria-hidden
      className="motion-safe:animate-blueprint-plan pointer-events-none absolute inset-0 z-10 hidden rounded-xl [animation-delay:var(--viewport-reveal-delay)] motion-safe:block motion-safe:group-data-[reveal-pending]/viewport-reveal:animate-none"
    >
      <div className="absolute -inset-4 bg-[radial-gradient(circle,var(--theme-primary)_0.65px,transparent_0.8px)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] bg-size-[12px_12px] opacity-20" />
      <div className="border-theme-primary/35 absolute inset-0 rounded-xl border border-dashed" />
      <div className="border-theme-primary/20 absolute -inset-x-2 inset-y-0 border-y border-dashed" />
      <div className="border-theme-primary/20 absolute inset-x-0 -inset-y-2 border-x border-dashed" />

      <div
        className={cn(
          'relative flex h-full items-center gap-2 border border-transparent px-3 py-1.5 text-left md:gap-3 md:px-4 md:py-2',
          isRightAligned && 'flex-row-reverse text-right',
        )}
      >
        <span className="border-theme-primary/45 bg-theme-primary/4 size-10 shrink-0 rounded-full border border-dashed md:size-12" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold md:text-base">
            <span className="relative inline-block max-w-full truncate align-top text-transparent">
              {name}
              <span className="bg-theme-primary/15 motion-safe:animate-blueprint-rule absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full [animation-delay:calc(var(--viewport-reveal-delay)_+_60ms)] motion-safe:group-data-[reveal-pending]/viewport-reveal:animate-none" />
              <span className="bg-theme-primary/50 absolute top-1/2 right-0 h-3 w-px -translate-y-1/2" />
            </span>
          </span>
          <span className="mt-1 block text-[11px] leading-4 md:text-xs md:leading-5">
            <span className="relative inline-block max-w-full truncate align-top text-transparent">
              {description}
              <span className="bg-theme-primary/10 motion-safe:animate-blueprint-rule absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full [animation-delay:calc(var(--viewport-reveal-delay)_+_130ms)] motion-safe:group-data-[reveal-pending]/viewport-reveal:animate-none" />
            </span>
          </span>
        </span>
      </div>
    </div>
  )
}
