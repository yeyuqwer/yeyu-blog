import { getAdminOverviewStats } from '@/app/api/admin/overview/get-admin-overview-stats'

export async function OverviewStats() {
  const data = await getAdminOverviewStats()
  const stats = [
    { label: '博客', value: data.blogCount, description: `${data.blogDraftCount} 篇草稿` },
    { label: '笔记', value: data.noteCount, description: `${data.noteDraftCount} 篇草稿` },
    { label: '草稿', value: data.draftCount, description: '未发布内容' },
    {
      label: '待处理',
      value: data.pendingCount,
      description: `${data.commentPendingCount} 条评论 / ${data.friendLinkPendingCount} 个友链`,
    },
  ]

  return (
    <section className="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(stat => (
        <article
          key={stat.label}
          className="rounded-lg border border-zinc-200 bg-white/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/50"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
          <p className="mt-2 font-semibold text-2xl text-zinc-950 leading-none dark:text-zinc-50">
            {stat.value}
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{stat.description}</p>
        </article>
      ))}
    </section>
  )
}
