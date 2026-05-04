import { useEffect, useState } from 'react'
import {
  hasInjectedWallet as checkHasInjectedWallet,
  getAnnouncedWallet,
  providerAnnouncementEventName,
  providerRequestEventName,
} from '@/lib/core/web3'

export const useHasInjectedWallet = () => {
  const [hasInjectedWallet, setHasInjectedWallet] = useState(false)

  useEffect(() => {
    if (checkHasInjectedWallet()) {
      setHasInjectedWallet(true)
      return
    }

    const handleProviderAnnouncement = (event: Event) => {
      if (getAnnouncedWallet(event) !== undefined) {
        setHasInjectedWallet(true)
      }
    }

    window.addEventListener(providerAnnouncementEventName, handleProviderAnnouncement)
    window.dispatchEvent(new Event(providerRequestEventName))

    return () => {
      window.removeEventListener(providerAnnouncementEventName, handleProviderAnnouncement)
    }
  }, [])

  return hasInjectedWallet
}
