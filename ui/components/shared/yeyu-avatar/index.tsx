import Image from 'next/image'
import { useSession } from '@/lib/core/auth'

interface IAvatarSize {
  width?: number | `${number}` | undefined
  height?: number | `${number}` | undefined
}

export default function YeYuAvatar({ width = '32', height = '32' }: IAvatarSize) {
  const { data: session } = useSession()

  return (
    <div>
      <Image
        src={session?.user?.image ?? 'https://avatars.githubusercontent.com/u/140394258?v=4'}
        alt="avatar"
        width={width}
        height={height}
        className="rounded-lg"
      />
    </div>
  )
}
