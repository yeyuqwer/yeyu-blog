import { BadRequestError, HttpRequestError } from '@/lib/common/errors/request'
import { withResponse } from '@/lib/infra/http/with-response'

const numericIdPattern = /^\d+$/

export const GET = withResponse(async request => {
  const id = request.nextUrl.searchParams.get('id')

  if (id == null || !numericIdPattern.test(id)) {
    throw new BadRequestError('Invalid song id.')
  }

  const response = await fetch(`https://music.163.com/api/song/detail?ids=%5B${id}%5D`, {
    headers: {
      Referer: 'https://music.163.com/',
      'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  })

  if (!response.ok) {
    throw new HttpRequestError('Failed to fetch Netease Music song.', {
      data: {
        status: response.status,
      },
    })
  }

  const data = (await response.json()) as {
    songs?: {
      name?: string
      artists?: {
        name?: string
      }[]
      album?: {
        name?: string
        picUrl?: string
      }
    }[]
  }
  const song = data.songs?.[0]

  if (song == null) {
    throw new BadRequestError('Song not found.')
  }

  return {
    name: song.name ?? '网易云音乐',
    artist:
      song.artists
        ?.map(item => item.name)
        .filter(Boolean)
        .join(' / ') ?? '',
    album: song.album?.name ?? '',
    cover: song.album?.picUrl?.replace(/^http:\/\//, 'https://') ?? '',
  }
})
