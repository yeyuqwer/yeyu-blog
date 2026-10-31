import type { AdminFriendLinkRecord } from '@/lib/api/friend-link/get-admin-friend-links'
import type { FriendLinkState } from '@/lib/api/friend-link/type'
import { Check, ExternalLink, Mail, Pencil, RefreshCcw, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { prettyDateTime } from '@/lib/utils/common/time'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { friendLinkStateBadgeVariantMap, friendLinkStateLabelMap } from './constants'

export function FriendLinkListItem({
  friendLink,
  isDeletingFriendLink,
  isUpdatingFriendLink,
  isUpdatingState,
  onDeleteClick,
  onEditClick,
  onUpdateState,
}: {
  friendLink: AdminFriendLinkRecord
  isDeletingFriendLink: boolean
  isUpdatingFriendLink: boolean
  isUpdatingState: boolean
  onDeleteClick: (friendLink: AdminFriendLinkRecord) => void
  onEditClick: (friendLink: AdminFriendLinkRecord) => void
  onUpdateState: (id: number, nextState: FriendLinkState) => void
}) {
  return (
    <li className="bg-background rounded-sm border p-3 shadow-xs">
      <section className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="bg-card grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border">
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
              <h3 className="text-sm font-medium">{friendLink.name}</h3>
              <Badge variant="outline">#{friendLink.id}</Badge>
              <Badge variant={friendLinkStateBadgeVariantMap[friendLink.state]}>
                {friendLinkStateLabelMap[friendLink.state]}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{friendLink.description}</p>
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
              {friendLink.email != null ? (
                <a
                  href={`mailto:${friendLink.email}`}
                  className="text-foreground inline-flex min-w-0 items-center gap-1 underline underline-offset-4"
                >
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{friendLink.email}</span>
                </a>
              ) : null}
              <Link
                href={friendLink.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-foreground inline-flex min-w-0 items-center gap-1 underline underline-offset-4"
              >
                <span className="truncate">{friendLink.siteUrl}</span>
                <ExternalLink className="size-3 shrink-0" />
              </Link>
            </div>
            <time className="text-muted-foreground mt-1 block text-xs">
              {prettyDateTime(Date.parse(friendLink.createdAt))}
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
              onEditClick(friendLink)
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
              onUpdateState(friendLink.id, 'APPROVED')
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
              onUpdateState(friendLink.id, 'PENDING')
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
              onUpdateState(friendLink.id, 'REJECTED')
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
              onDeleteClick(friendLink)
            }}
          >
            <Trash2 className="size-4" />
            删除
          </Button>
        </div>
      </section>
    </li>
  )
}
