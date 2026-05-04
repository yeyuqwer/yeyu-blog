'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAnnouncedWallet,
  getInjectedWalletChainId,
  getInjectedWallets,
  type InjectedWallet,
  type InjectedWalletProvider,
  parseInjectedWalletChainId,
  providerAnnouncementEventName,
  providerRequestEventName,
  requestInjectedWalletAccounts,
  signInjectedWalletMessage,
} from '@/lib/core/web3'

const getWalletTextKey = (value?: string) => value?.trim().toLowerCase()

const isSameInjectedWallet = (currentWallet: InjectedWallet, wallet: InjectedWallet) => {
  const currentRdns = getWalletTextKey(currentWallet.rdns)
  const nextRdns = getWalletTextKey(wallet.rdns)
  const currentName = getWalletTextKey(currentWallet.name)
  const nextName = getWalletTextKey(wallet.name)
  const hasSpecificName = currentName !== undefined && currentName !== 'browser wallet'

  return (
    currentWallet.provider === wallet.provider ||
    currentWallet.id === wallet.id ||
    (currentRdns !== undefined && currentRdns === nextRdns) ||
    (hasSpecificName && currentName === nextName)
  )
}

export const useInjectedWallet = () => {
  const [wallets, setWallets] = useState<InjectedWallet[]>([])
  const [provider, setProvider] = useState<InjectedWalletProvider>()
  const [account, setAccount] = useState<string>()
  const [chainId, setChainId] = useState<number>()
  const [isPending, setIsPending] = useState(false)

  const addWallet = useCallback((wallet: InjectedWallet) => {
    setWallets(currentWallets => {
      const matchedWalletIndex = currentWallets.findIndex(currentWallet =>
        isSameInjectedWallet(currentWallet, wallet),
      )

      if (matchedWalletIndex >= 0) {
        return currentWallets.map((currentWallet, index) =>
          index === matchedWalletIndex
            ? {
                ...currentWallet,
                ...wallet,
                icon: wallet.icon ?? currentWallet.icon,
                rdns: wallet.rdns ?? currentWallet.rdns,
              }
            : currentWallet,
        )
      }

      return [...currentWallets, wallet]
    })
  }, [])

  useEffect(() => {
    getInjectedWallets().forEach(addWallet)

    const handleProviderAnnouncement = (event: Event) => {
      const announcedWallet = getAnnouncedWallet(event)

      if (announcedWallet !== undefined) {
        addWallet(announcedWallet)
      }
    }

    window.addEventListener(providerAnnouncementEventName, handleProviderAnnouncement)
    window.dispatchEvent(new Event(providerRequestEventName))

    return () => {
      window.removeEventListener(providerAnnouncementEventName, handleProviderAnnouncement)
    }
  }, [addWallet])

  useEffect(() => {
    if (provider === undefined) {
      return
    }

    const handleAccountsChanged = (value: unknown) => {
      const accounts = Array.isArray(value) ? value : []
      const [nextAccount] = accounts

      setAccount(typeof nextAccount === 'string' ? nextAccount : undefined)
    }

    const handleChainChanged = (value: unknown) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        return
      }

      setChainId(parseInjectedWalletChainId(value))
    }

    provider.on?.('accountsChanged', handleAccountsChanged)
    provider.on?.('chainChanged', handleChainChanged)

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged)
      provider.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [provider])

  const connect = useCallback(async (wallet: InjectedWallet) => {
    setIsPending(true)

    return await (async () => {
      const walletProvider = wallet.provider

      setProvider(walletProvider)

      const accounts = await requestInjectedWalletAccounts({ provider: walletProvider })
      const [nextAccount] = accounts

      if (nextAccount === undefined) {
        return undefined
      }

      const nextChainId = await getInjectedWalletChainId({ provider: walletProvider })

      setAccount(nextAccount)
      setChainId(nextChainId)

      return {
        account: nextAccount,
        chainId: nextChainId,
        provider: walletProvider,
      }
    })().finally(() => {
      setIsPending(false)
    })
  }, [])

  const signMessage = useCallback(
    async ({
      account,
      message,
      provider: walletProvider,
    }: {
      account: string
      message: string
      provider?: InjectedWalletProvider
    }) => {
      return await signInjectedWalletMessage({
        account,
        message,
        provider: walletProvider ?? provider,
      })
    },
    [provider],
  )

  return useMemo(
    () => ({
      account,
      chainId,
      connect,
      hasWallet: wallets.length > 0,
      isConnected: account !== undefined,
      isPending,
      signMessage,
      wallets,
    }),
    [account, chainId, connect, isPending, signMessage, wallets],
  )
}
