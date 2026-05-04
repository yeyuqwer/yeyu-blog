export type InjectedWalletProvider = {
  request: <T>(args: { method: string; params?: unknown[] }) => Promise<T>
  on?: (eventName: string, listener: (value: unknown) => void) => void
  removeListener?: (eventName: string, listener: (value: unknown) => void) => void
  providers?: InjectedWalletProvider[]
  icon?: unknown
  isBitKeep?: boolean
  isBitgetWallet?: boolean
  isBraveWallet?: boolean
  isCoinbaseWallet?: boolean
  isMetaMask?: boolean
  isOKExWallet?: boolean
  isOkxWallet?: boolean
  isRabby?: boolean
  isTokenPocket?: boolean
  isTrust?: boolean
  name?: unknown
}

export type InjectedWallet = {
  id: string
  name: string
  provider: InjectedWalletProvider
  icon?: string
  rdns?: string
}

type AnnouncedWalletDetail = {
  info?: {
    uuid?: string
    name?: string
    icon?: string
    rdns?: string
  }
  provider?: InjectedWalletProvider
}

export const providerAnnouncementEventName = 'eip6963:announceProvider'
export const providerRequestEventName = 'eip6963:requestProvider'

const legacyInjectedWalletDescriptors = [
  {
    id: 'okx',
    name: 'OKX Wallet',
    rdns: 'com.okx.wallet',
    isMatched: (provider: InjectedWalletProvider) =>
      provider.isOkxWallet === true || provider.isOKExWallet === true,
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    rdns: 'io.rabby',
    isMatched: (provider: InjectedWalletProvider) => provider.isRabby === true,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    rdns: 'com.coinbase.wallet',
    isMatched: (provider: InjectedWalletProvider) => provider.isCoinbaseWallet === true,
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    rdns: 'com.brave.wallet',
    isMatched: (provider: InjectedWalletProvider) => provider.isBraveWallet === true,
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    rdns: 'com.trustwallet.app',
    isMatched: (provider: InjectedWalletProvider) => provider.isTrust === true,
  },
  {
    id: 'token-pocket',
    name: 'TokenPocket',
    rdns: 'pro.tokenpocket',
    isMatched: (provider: InjectedWalletProvider) => provider.isTokenPocket === true,
  },
  {
    id: 'bitget',
    name: 'Bitget Wallet',
    rdns: 'com.bitget.web3',
    isMatched: (provider: InjectedWalletProvider) =>
      provider.isBitgetWallet === true || provider.isBitKeep === true,
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    rdns: 'io.metamask',
    isMatched: (provider: InjectedWalletProvider) =>
      provider.isMetaMask === true && provider.isBraveWallet !== true,
  },
]

const getBrowserWindow = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window as Window & {
    ethereum?: InjectedWalletProvider
  }
}

export const getAnnouncedWalletProvider = (event: Event) => {
  return getAnnouncedWallet(event)?.provider
}

export const getAnnouncedWallet = (event: Event) => {
  const customEvent = event as CustomEvent<AnnouncedWalletDetail>
  const { info, provider } = customEvent.detail ?? {}

  if (provider === undefined) {
    return undefined
  }

  const legacyWallet = getLegacyInjectedWallet({ provider, index: 0 })

  return {
    id: info?.uuid ?? info?.rdns ?? legacyWallet.id,
    name: info?.name ?? legacyWallet.name,
    provider,
    icon: info?.icon ?? legacyWallet.icon,
    rdns: info?.rdns ?? legacyWallet.rdns,
  } satisfies InjectedWallet
}

export const getLegacyInjectedWallet = ({
  index,
  provider,
}: {
  index: number
  provider: InjectedWalletProvider
}) => {
  const descriptor = legacyInjectedWalletDescriptors.find(wallet => wallet.isMatched(provider))
  const providerIcon = typeof provider.icon === 'string' ? provider.icon : undefined
  const providerName = typeof provider.name === 'string' ? provider.name : undefined
  const id = descriptor?.id ?? `browser-wallet-${index}`

  return {
    id: `legacy:${id}:${index}`,
    name: providerName ?? descriptor?.name ?? 'Browser Wallet',
    provider,
    icon: providerIcon,
    rdns: descriptor?.rdns,
  } satisfies InjectedWallet
}

export const getInjectedWallets = () => {
  const ethereum = getBrowserWindow()?.ethereum

  if (ethereum === undefined) {
    return []
  }

  const providers = ethereum.providers ?? [ethereum]

  return providers.map((provider, index) => getLegacyInjectedWallet({ index, provider }))
}

export const getInjectedWalletProvider = () => getInjectedWallets()[0]?.provider

export const hasInjectedWallet = () => getInjectedWallets().length > 0

const getRequiredInjectedWalletProvider = (provider?: InjectedWalletProvider) => {
  const walletProvider = provider ?? getInjectedWalletProvider()

  if (walletProvider === undefined) {
    throw new Error('No injected wallet provider found')
  }

  return walletProvider
}

export const parseInjectedWalletChainId = (chainId: string | number) => {
  if (typeof chainId === 'number') {
    return chainId
  }

  return Number.parseInt(chainId, 16)
}

export const requestInjectedWalletAccounts = async ({
  provider,
}: {
  provider?: InjectedWalletProvider
} = {}) => {
  const walletProvider = getRequiredInjectedWalletProvider(provider)

  return await walletProvider.request<string[]>({
    method: 'eth_requestAccounts',
  })
}

export const getInjectedWalletChainId = async ({
  provider,
}: {
  provider?: InjectedWalletProvider
} = {}) => {
  const walletProvider = getRequiredInjectedWalletProvider(provider)
  const chainId = await walletProvider.request<string | number>({
    method: 'eth_chainId',
  })

  return parseInjectedWalletChainId(chainId)
}

export const signInjectedWalletMessage = async ({
  account,
  message,
  provider,
}: {
  account: string
  message: string
  provider?: InjectedWalletProvider
}) => {
  const walletProvider = getRequiredInjectedWalletProvider(provider)

  return await walletProvider.request<string>({
    method: 'personal_sign',
    params: [message, account],
  })
}
