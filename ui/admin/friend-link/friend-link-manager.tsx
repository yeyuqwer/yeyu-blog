'use client'

import type { ComponentProps, FC, FormEvent } from 'react'
import type { AdminFriendLinkRecord, FriendLinkState } from '@/lib/api/friend-link'
import { Check, ExternalLink, Pencil, RefreshCcw, Search, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { sileo } from 'sileo'
import {
  useAdminFriendLinkDeleteMutation,
  useAdminFriendLinkQuery,
  useAdminFriendLinkStateMutation,
  useAdminFriendLinkUpdateMutation,
} from '@/hooks/api/friend-link'
import { prettyDateTime } from '@/lib/utils/time'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'
import Loading from '@/ui/components/shared/loading'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

type FriendLinkStateFilter = 'all' | FriendLinkState
type FriendLinkEditForm = Pick<
  AdminFriendLinkRecord,
  'name' | 'description' | 'avatarUrl' | 'siteUrl'
>

const friendLinkStateOptions: Array<{
  label: string
  value: FriendLinkStateFilter
}> = [
  { label: '全部状态', value: 'all' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
]

const friendLinkStateLabelMap: Record<FriendLinkState, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

const friendLinkStateBadgeVariantMap: Record<FriendLinkState, BadgeVariant> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
}

const initialFriendLinkEditForm: FriendLinkEditForm = {
  name: '',
  description: '',
  avatarUrl: '',
  siteUrl: '',
}

const friendLinkEditFields = [
  {
    name: 'name',
    label: '站点名称',
    type: 'text',
  },
  {
    name: 'description',
    label: '站点描述',
    type: 'text',
  },
  {
    name: 'avatarUrl',
    label: '头像地址',
    type: 'url',
  },
  {
    name: 'siteUrl',
    label: '站点地址',
    type: 'url',
  },
] satisfies {
  name: keyof FriendLinkEditForm
  label: string
  type: ComponentProps<'input'>['type']
}[]

export const FriendLinkManager: FC<ComponentProps<'main'>> = () => {
  const [draftQuery, setDraftQuery] = useState('')
  const [draftState, setDraftState] = useState<FriendLinkStateFilter>('PENDING')

  const [query, setQuery] = useState('')
  const [state, setState] = useState<FriendLinkStateFilter>('PENDING')
  const [editingFriendLink, setEditingFriendLink] = useState<AdminFriendLinkRecord | null>(null)
  const [deletingFriendLink, setDeletingFriendLink] = useState<AdminFriendLinkRecord | null>(null)
  const [editForm, setEditForm] = useState<FriendLinkEditForm>(initialFriendLinkEditForm)

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
    setQuery(draftQuery.trim())
    setState(draftState)
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
    setEditingFriendLink(friendLink)
    setEditForm({
      name: friendLink.name,
      description: friendLink.description,
      avatarUrl: friendLink.avatarUrl,
      siteUrl: friendLink.siteUrl,
    })
  }

  const closeEditModal = () => {
    setEditingFriendLink(null)
    setEditForm(initialFriendLinkEditForm)
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
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
          setDeletingFriendLink(null)
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  return (
    <>
      <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
        <header className="flex flex-wrap items-center gap-2">
          <Input
            className="min-w-56 flex-1"
            placeholder="搜索站点、描述或地址..."
            value={draftQuery}
            onChange={event => {
              setDraftQuery(event.target.value)
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                applyFilters()
              }
            }}
          />
          <Select
            value={draftState}
            onValueChange={value => {
              setDraftState(value as FriendLinkStateFilter)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="友链状态" />
            </SelectTrigger>
            <SelectContent>
              {friendLinkStateOptions.map(option => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={applyFilters}
          >
            <Search className="size-4" />
            搜索
          </Button>
        </header>

        {isPending ? (
          <Loading />
        ) : friendLinks.length === 0 ? (
          <div className="m-auto text-muted-foreground">虚无。</div>
        ) : (
          <main className="flex max-h-[74vh] min-h-0 flex-1 overflow-y-auto bg-card [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
            <ul className="w-full space-y-2">
              {friendLinks.map(friendLink => (
                <li key={friendLink.id} className="rounded-sm border bg-background p-3 shadow-xs">
                  <section className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-card">
                        <Image
                          src={friendLink.avatarUrl}
                          alt={friendLink.name}
                          width={56}
                          height={56}
                          unoptimized
                          className="size-full object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-sm">{friendLink.name}</h3>
                          <Badge variant="outline">#{friendLink.id}</Badge>
                          <Badge variant={friendLinkStateBadgeVariantMap[friendLink.state]}>
                            {friendLinkStateLabelMap[friendLink.state]}
                          </Badge>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                          {friendLink.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                          <Link
                            href={friendLink.siteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-w-0 items-center gap-1 text-foreground underline underline-offset-4"
                          >
                            <span className="truncate">{friendLink.siteUrl}</span>
                            <ExternalLink className="size-3 shrink-0" />
                          </Link>
                        </div>
                        <time className="mt-1 block text-muted-foreground text-xs">
                          {prettyDateTime(new Date(friendLink.createdAt))}
                        </time>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isUpdatingFriendLink}
                        onClick={() => {
                          openEditModal(friendLink)
                        }}
                      >
                        <Pencil className="size-4" />
                        修改
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isUpdatingState || friendLink.state === 'APPROVED'}
                        onClick={() => {
                          handleUpdateState(friendLink.id, 'APPROVED')
                        }}
                      >
                        <Check className="size-4" />
                        通过
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isUpdatingState || friendLink.state === 'PENDING'}
                        onClick={() => {
                          handleUpdateState(friendLink.id, 'PENDING')
                        }}
                      >
                        <RefreshCcw className="size-4" />
                        待审
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={isUpdatingState || friendLink.state === 'REJECTED'}
                        onClick={() => {
                          handleUpdateState(friendLink.id, 'REJECTED')
                        }}
                      >
                        <X className="size-4" />
                        拒绝
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        disabled={isDeletingFriendLink}
                        onClick={() => {
                          setDeletingFriendLink(friendLink)
                        }}
                      >
                        <Trash2 className="size-4" />
                        删除
                      </Button>
                    </div>
                  </section>
                </li>
              ))}
            </ul>
          </main>
        )}
      </main>

      <Dialog
        open={editingFriendLink != null}
        onOpenChange={open => {
          if (!open) {
            closeEditModal()
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>修改友链信息</DialogTitle>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleEditSubmit}>
            {friendLinkEditFields.map(field => {
              const fieldId = `friend-link-edit-${field.name}`

              return (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={fieldId}>{field.label}</Label>
                  <Input
                    id={fieldId}
                    type={field.type}
                    required
                    value={editForm[field.name]}
                    onChange={event => {
                      setEditForm(previousForm => ({
                        ...previousForm,
                        [field.name]: event.target.value,
                      }))
                    }}
                  />
                </div>
              )
            })}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isUpdatingFriendLink}
                onClick={closeEditModal}
              >
                取消
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isUpdatingFriendLink}>
                {isUpdatingFriendLink ? '保存中...' : '保存修改'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingFriendLink != null}
        onClose={() => {
          setDeletingFriendLink(null)
        }}
        onConfirm={handleDelete}
        title="确定要删除这条友链申请吗？"
        description="该操作不可撤销。"
        isPending={isDeletingFriendLink}
      >
        {deletingFriendLink != null ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">{deletingFriendLink.name}</p>
            <p className="mt-1 line-clamp-1 text-muted-foreground text-xs">
              {deletingFriendLink.siteUrl}
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  )
}
