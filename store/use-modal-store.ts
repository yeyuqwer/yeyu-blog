import { create } from 'zustand'

export type ModalType =
  | 'deleteArticleModal'
  | 'deleteMutterModal'
  | 'updateMutterModal'
  | 'editTagModal'
  | 'deleteTagModal'
  | 'createEchoModal'
  | 'deleteEchoModal'
  | 'editEchoModal'
  | 'createTagModal'
  | 'loginModal'
  | 'selectThemeModal'
  | 'mutterCommentModal'
  | null

type IModalStore = {
  modalType: ModalType
  payload: unknown
  setModalOpen: <T = unknown>(modalType: ModalType, payload?: T) => void
  onModalClose: () => void
}

export const useModalStore = create<IModalStore>(set => ({
  modalType: null,
  payload: null,
  setModalOpen: <T = unknown>(modalType: ModalType, payload: T = {} as T) => {
    set({
      modalType,
      payload,
    })
  },
  // * 可以直接不用这个函数的, 直接使用 setModalOpen(null) 来替代, 但是我想更纯粹一点
  onModalClose: () => {
    set({ modalType: null })
  },
}))
