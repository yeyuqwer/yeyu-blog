import type { ComponentProps, FC } from 'react'
import type { NavRoute } from './types'
import Link from 'next/link'
import { sileo } from 'sileo'
import { useModalStore } from '@/store/use-modal-store'

export const NavItem: FC<
  {
    item: NavRoute
    elRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>
  } & Omit<ComponentProps<'a'>, 'href' | 'ref'>
> = ({ item, className, children, elRef, ...props }) => {
  const isButton = item.type === 'button'
  const setModalOpen = useModalStore(s => s.setModalOpen)

  if (isButton) {
    return (
      <button
        ref={elRef as React.Ref<HTMLButtonElement>}
        className={className}
        type="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (item.disabled === true) {
            e.preventDefault()

            sileo.info({ title: 'Coming soon...' })
            return
          }
          if (item.modal != null) {
            setModalOpen(item.modal)
          }
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <Link
      ref={elRef as React.Ref<HTMLAnchorElement>}
      href={item.path}
      className={className}
      {...props}
      onClick={e => {
        if (item.disabled === true) {
          e.preventDefault()
          sileo.info({ title: 'Coming soon...' })
          return
        }
      }}
    >
      {children}
    </Link>
  )
}
