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
  | 'friendLinkApplyModal'
  | null

export const useModalStore = create<{
  modalType: ModalType
  payload: unknown
  setModalOpen: <T = unknown>(modalType: ModalType, payload?: T) => void
  closeModal: () => void
}>(set => ({
  modalType: null,
  payload: null,
  setModalOpen: <T = unknown>(modalType: ModalType, payload: T = {} as T) => {
    set({
      modalType,
      payload,
    })
  },
  closeModal: () => {
    set({ modalType: null, payload: null })
  },
}))
