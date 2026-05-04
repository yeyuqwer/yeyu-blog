import Loading from '@/ui/components/shared/loading'

export const LoginPendingPanel = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <Loading />
      <p className="text-muted-foreground text-sm">少女折寿中...</p>
    </div>
  )
}
