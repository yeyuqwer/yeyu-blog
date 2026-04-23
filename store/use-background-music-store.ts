import { create } from 'zustand'

export const useBackgroundMusicStore = create<{
  isPlaying: boolean
  audio: HTMLAudioElement | null
  play: () => void
  pause: () => void
  initialize: () => void
}>((set, get) => ({
  isPlaying: false,
  audio: null,
  initialize: () => {
    if (typeof window === 'undefined' || get().audio !== null) return
    // TODO: config or settings ?
    const audio = new Audio('/music/日暮里 - JINBAO.mp3')
    audio.loop = true
    set({ audio })
  },
  play: () => {
    const { audio, initialize } = get()
    if (audio === null) {
      initialize()
      get()
        .audio?.play()
        .catch(e => console.error('Audio play failed', e))
    } else {
      audio.play().catch(e => console.error('Audio play failed', e))
    }
    set({ isPlaying: true })
  },
  pause: () => {
    const { audio } = get()
    if (audio !== null) {
      audio.pause()
    }
    set({ isPlaying: false })
  },
}))
