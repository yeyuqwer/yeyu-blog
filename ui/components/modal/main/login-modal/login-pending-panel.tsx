import { useChainId, useChains } from 'wagmi'
import Loading from '@/ui/components/shared/loading'

export const LoginPendingPanel = () => {
  const chainId = useChainId()
  const currentChain = useChains().find(chain => chain.id === chainId)

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="space-y-1 text-center">
        <p className="text-muted-foreground text-xs">当前网络</p>
        {currentChain != null ? <p>{currentChain.name}</p> : null}
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Loading />
        <p className="text-muted-foreground text-sm">少女折寿中...</p>
      </div>
    </div>
  )
}
