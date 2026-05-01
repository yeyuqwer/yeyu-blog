import { prisma } from '@/prisma/instance'
import { FriendsPlane } from './components/friends-plane'

export async function FriendsPage() {
  const friends = await prisma.friendLink.findMany({
    where: {
      state: 'APPROVED',
    },
    select: {
      id: true,
      name: true,
      description: true,
      avatarUrl: true,
      siteUrl: true,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        id: 'desc',
      },
    ],
  })

  return (
    <section className="relative h-[calc(100dvh-194px)] min-h-[520px] overflow-hidden py-4">
      <div className="relative h-full w-full overflow-hidden">
        <FriendsPlane friends={friends} />
      </div>
    </section>
  )
}
