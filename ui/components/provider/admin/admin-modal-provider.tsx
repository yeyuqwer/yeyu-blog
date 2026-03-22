'use client'

import {
  CreateEchoModal,
  CreateTagModal,
  DeleteArticleModal,
  DeleteEchoModal,
  DeleteMutterModal,
  DeleteTagModal,
  EditEchoModal,
  EditTagModal,
  UpdateMutterModal,
} from '@/ui/components/modal/admin'

export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DeleteArticleModal />
      <DeleteMutterModal />
      <UpdateMutterModal />
      <EditTagModal />
      <DeleteTagModal />
      <CreateEchoModal />
      <DeleteEchoModal />
      <EditEchoModal />
      <CreateTagModal />
    </>
  )
}
