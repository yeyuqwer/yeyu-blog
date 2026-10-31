'use client'

import type { ComponentProps, FC, SyntheticEvent } from 'react'
import type { AdminFriendLinkRecord } from '@/lib/api/friend-link/get-admin-friend-links'
import type { FriendLinkState } from '@/lib/api/friend-link/type'
import type { FriendLinkEditForm, FriendLinkStateFilter } from './friend-link-manager/types'
import { useReducer } from 'react'
import { sileo } from 'sileo'
import { useAdminFriendLinkDeleteMutation } from '@/hooks/api/friend-link/use-admin-friend-link-delete-mutation'
import { useAdminFriendLinkQuery } from '@/hooks/api/friend-link/use-admin-friend-link-query'
import { useAdminFriendLinkStateMutation } from '@/hooks/api/friend-link/use-admin-friend-link-state-mutation'
import { useAdminFriendLinkUpdateMutation } from '@/hooks/api/friend-link/use-admin-friend-link-update-mutation'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'
import Loading from '@/ui/components/shared/loading'
import { initialFriendLinkEditForm } from './friend-link-manager/constants'
import { FriendLinkEditDialog } from './friend-link-manager/friend-link-edit-dialog'
import { FriendLinkFilters } from './friend-link-manager/friend-link-filters'
import { FriendLinkListItem } from './friend-link-manager/friend-link-list-item'

type FriendLinkManagerState = {
  deletingFriendLink: AdminFriendLinkRecord | null
  draftQuery: string
  draftState: FriendLinkStateFilter
  editForm: FriendLinkEditForm
  editingFriendLink: AdminFriendLinkRecord | null
  query: string
  state: FriendLinkStateFilter
}

const initialFriendLinkManagerState: FriendLinkManagerState = {
  deletingFriendLink: null,
  draftQuery: '',
  draftState: 'PENDING',
  editForm: initialFriendLinkEditForm,
  editingFriendLink: null,
  query: '',
  state: 'PENDING',
}

type FriendLinkManagerAction =
  | { type: 'applyFilters' }
  | { type: 'closeEditModal' }
  | { type: 'openEditModal'; friendLink: AdminFriendLinkRecord }
  | { type: 'setDeletingFriendLink'; deletingFriendLink: AdminFriendLinkRecord | null }
  | { type: 'setDraftQuery'; draftQuery: string }
  | { type: 'setDraftState'; draftState: FriendLinkStateFilter }
  | { type: 'setEditFormValue'; name: keyof FriendLinkEditForm; value: string }

function friendLinkManagerReducer(
  state: FriendLinkManagerState,
  action: FriendLinkManagerAction,
): FriendLinkManagerState {
  switch (action.type) {
    case 'applyFilters':
      return {
        ...state,
        query: state.draftQuery.trim(),
        state: state.draftState,
      }
    case 'closeEditModal':
      return {
        ...state,
        editingFriendLink: null,
        editForm: initialFriendLinkEditForm,
      }
    case 'openEditModal':
      return {
        ...state,
        editingFriendLink: action.friendLink,
        editForm: {
          name: action.friendLink.name,
          email: action.friendLink.email ?? '',
          description: action.friendLink.description,
          avatarUrl: action.friendLink.avatarUrl,
          siteUrl: action.friendLink.siteUrl,
        },
      }
    case 'setDeletingFriendLink':
      return {
        ...state,
        deletingFriendLink: action.deletingFriendLink,
      }
    case 'setDraftQuery':
      return {
        ...state,
        draftQuery: action.draftQuery,
      }
    case 'setDraftState': {
      const query = state.draftQuery.trim()

      return {
        ...state,
        draftState: action.draftState,
        query,
        state: action.draftState,
      }
    }
    case 'setEditFormValue':
      return {
        ...state,
        editForm: {
          ...state.editForm,
          [action.name]: action.value,
        },
      }
  }
}

export const FriendLinkManager: FC<ComponentProps<'main'>> = () => {
  const [managerState, dispatch] = useReducer(
    friendLinkManagerReducer,
    initialFriendLinkManagerState,
  )
  const { deletingFriendLink, draftQuery, draftState, editForm, editingFriendLink, query, state } =
    managerState

  const { data, isPending } = useAdminFriendLinkQuery({
    q: query,
    state: state === 'all' ? undefined : state,
    take: 100,
    skip: 0,
  })

  const friendLinks = data?.list ?? []
  const { mutate: updateStateById, isPending: isUpdatingState } = useAdminFriendLinkStateMutation()
  const { mutate: updateFriendLinkById, isPending: isUpdatingFriendLink } =
    useAdminFriendLinkUpdateMutation()
  const { mutate: deleteById, isPending: isDeletingFriendLink } = useAdminFriendLinkDeleteMutation()

  const applyFilters = () => {
    dispatch({ type: 'applyFilters' })
  }

  const handleUpdateState = (id: number, nextState: FriendLinkState) => {
    updateStateById(
      {
        id,
        state: nextState,
      },
      {
        onSuccess: () => {
          sileo.success({ title: '友链状态已更新。' })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  const openEditModal = (friendLink: AdminFriendLinkRecord) => {
    dispatch({ type: 'openEditModal', friendLink })
  }

  const closeEditModal = () => {
    dispatch({ type: 'closeEditModal' })
  }

  const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()

    if (editingFriendLink == null) {
      return
    }

    updateFriendLinkById(
      {
        id: editingFriendLink.id,
        ...editForm,
      },
      {
        onSuccess: () => {
          sileo.success({ title: '友链信息已更新。' })
          closeEditModal()
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  const handleDelete = () => {
    if (deletingFriendLink == null) {
      sileo.error({ title: '友链信息不存在，删除失败。' })
      return
    }

    deleteById(
      { id: deletingFriendLink.id },
      {
        onSuccess: () => {
          sileo.success({ title: '友链申请已删除。' })
          dispatch({ type: 'setDeletingFriendLink', deletingFriendLink: null })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  return (
    <>
      <main className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
        <FriendLinkFilters
          draftQuery={draftQuery}
          draftState={draftState}
          onApplyFilters={applyFilters}
          onDraftQueryChange={value => {
            dispatch({ type: 'setDraftQuery', draftQuery: value })
          }}
          onDraftStateChange={value => {
            dispatch({ type: 'setDraftState', draftState: value })
          }}
        />

        {isPending ? (
          <Loading />
        ) : friendLinks.length === 0 ? (
          <div className="text-muted-foreground m-auto">虚无。</div>
        ) : (
          <main className="bg-card flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.45)_transparent] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent">
            <ul className="w-full space-y-2">
              {friendLinks.map(friendLink => (
                <FriendLinkListItem
                  key={friendLink.id}
                  friendLink={friendLink}
                  isDeletingFriendLink={isDeletingFriendLink}
                  isUpdatingFriendLink={isUpdatingFriendLink}
                  isUpdatingState={isUpdatingState}
                  onDeleteClick={friendLink => {
                    dispatch({
                      type: 'setDeletingFriendLink',
                      deletingFriendLink: friendLink,
                    })
                  }}
                  onEditClick={openEditModal}
                  onUpdateState={handleUpdateState}
                />
              ))}
            </ul>
          </main>
        )}
      </main>

      <FriendLinkEditDialog
        editForm={editForm}
        editingFriendLink={editingFriendLink}
        isUpdatingFriendLink={isUpdatingFriendLink}
        onClose={closeEditModal}
        onEditFormValueChange={(name, value) => {
          dispatch({ type: 'setEditFormValue', name, value })
        }}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={deletingFriendLink != null}
        onClose={() => {
          dispatch({ type: 'setDeletingFriendLink', deletingFriendLink: null })
        }}
        onConfirm={handleDelete}
        title="确定要删除这条友链申请吗？"
        description="该操作不可撤销。"
        isPending={isDeletingFriendLink}
      >
        {deletingFriendLink != null ? (
          <div className="bg-muted/30 rounded-md border p-3 text-sm">
            <p className="font-medium">{deletingFriendLink.name}</p>
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
              {deletingFriendLink.siteUrl}
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  )
}
