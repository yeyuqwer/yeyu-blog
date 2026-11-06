import MainProvider from '../components/provider/main'
import { MaxWidthWrapper } from '../components/shared/max-width-wrapper'
import Header from './layout/header'
import { MainStage } from './layout/main-stage'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainProvider>
      <MainStage>
        <div className="site-whiteboard relative flex h-[calc(100dvh-1.5rem)] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl sm:h-[calc(100dvh-2.5rem)]">
          <Header />

          <div
            data-main-scroll-container
            className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:hidden"
          >
            <MaxWidthWrapper className="flex min-h-full flex-col overflow-x-clip">
              <main className="flex flex-1 flex-col">{children}</main>
              <div
                data-main-scroll-end
                aria-hidden
                className="pointer-events-none -mt-px h-px shrink-0"
              />
            </MaxWidthWrapper>
          </div>
          <div
            data-main-scroll-overlay
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[calc(1rem-clamp(4px,0.55vw,8px))]"
          />
        </div>
      </MainStage>
    </MainProvider>
  )
}
