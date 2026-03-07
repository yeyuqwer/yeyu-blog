import { create } from 'zustand'

type HomeEcho = {
  id: number
  content: string
  reference: string
} | null

type HomeEchoStore = {
  initialEcho: HomeEcho | undefined
  setInitialEcho: (echo: HomeEcho) => void
}

export const useHomeEchoStore = create<HomeEchoStore>(set => ({
  initialEcho: undefined,
  setInitialEcho: echo =>
    set(state => {
      if (state.initialEcho !== undefined) {
        return state
      }

      return { initialEcho: echo }
    }),
}))
