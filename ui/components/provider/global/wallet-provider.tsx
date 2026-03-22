import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/lib/core'

// TODO: 没必要放在 global，之后再想办法抽取
export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
