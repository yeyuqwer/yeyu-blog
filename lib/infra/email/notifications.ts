import 'server-only'

import { serverEnv } from '@/config/env/server-env'
import { getAdminMailRecipients, sendEmail } from './send-email'

const subjectPrefix = '叶鱼博客'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const truncateText = (value: string, maxLength = 240) => {
  const normalizedValue = value.trim()
  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength)}...`
}

const getAbsoluteUrl = (path: string) => new URL(path, serverEnv.SITE_URL).href

const createEmailHtml = ({
  title,
  lines,
  actionUrl,
  actionLabel,
}: {
  title: string
  lines: string[]
  actionUrl?: string
  actionLabel?: string
}) => {
  const htmlLines = lines
    .map(line => `<p style="margin:0 0 12px;line-height:1.7;">${escapeHtml(line)}</p>`)
    .join('')

  const actionHtml =
    actionUrl != null && actionLabel != null
      ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;border-radius:8px;background:#111827;color:#ffffff;padding:10px 16px;text-decoration:none;">${escapeHtml(actionLabel)}</a></p>`
      : ''

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;font-size:14px;">
  <h1 style="margin:0 0 18px;font-size:20px;line-height:1.4;">${escapeHtml(title)}</h1>
  ${htmlLines}
  ${actionHtml}
</div>`
}

const sendAdminNotificationEmail = async ({
  subject,
  title,
  lines,
  actionUrl,
  actionLabel,
}: {
  subject: string
  title: string
  lines: string[]
  actionUrl: string
  actionLabel: string
}) => {
  const recipients = getAdminMailRecipients()

  if (recipients.length === 0) {
    return
  }

  await sendEmail({
    to: recipients,
    subject: `【${subjectPrefix}】${subject}`,
    text: [...lines, '', `${actionLabel}：${actionUrl}`].join('\n'),
    html: createEmailHtml({ title, lines, actionUrl, actionLabel }),
  })
}

export const notifyAdminNewSiteComment = async ({
  authorName,
  authorEmail,
  content,
  targetTitle,
  targetPath,
  state,
}: {
  authorName: string
  authorEmail: string
  content: string
  targetTitle: string
  targetPath: string
  state: string
}) => {
  const articleUrl = getAbsoluteUrl(targetPath)
  const adminUrl = getAbsoluteUrl('/admin/comment')

  await sendAdminNotificationEmail({
    subject: `收到新评论：${targetTitle}`,
    title: '收到一条新的文章评论',
    lines: [
      `文章：${targetTitle}`,
      `评论人：${authorName}（${authorEmail}）`,
      `状态：${state === 'APPROVED' ? '已发布' : '待审核'}`,
      `内容：${truncateText(content)}`,
      `文章地址：${articleUrl}`,
    ],
    actionUrl: adminUrl,
    actionLabel: '去后台查看评论',
  })
}

export const notifyCommentAuthorReply = async ({
  to,
  recipientName,
  replyAuthorName,
  targetTitle,
  targetPath,
  replyContent,
}: {
  to: string
  recipientName: string
  replyAuthorName: string
  targetTitle: string
  targetPath: string
  replyContent: string
}) => {
  const commentUrl = getAbsoluteUrl(`${targetPath}#comments`)
  const lines = [
    `${recipientName}，${replyAuthorName} 回复了你在「${targetTitle}」下的评论。`,
    `回复内容：${truncateText(replyContent)}`,
    `查看地址：${commentUrl}`,
  ]

  await sendEmail({
    to,
    subject: `【${subjectPrefix}】你的评论收到了回复`,
    text: lines.join('\n'),
    html: createEmailHtml({
      title: '你的评论收到了回复',
      lines,
      actionUrl: commentUrl,
      actionLabel: '查看回复',
    }),
  })
}

export const notifyAdminNewMutterComment = async ({
  authorName,
  authorEmail,
  content,
  mutterId,
  state,
}: {
  authorName: string
  authorEmail: string
  content: string
  mutterId: number
  state: string
}) => {
  const mutterUrl = getAbsoluteUrl('/mutter')
  const adminUrl = getAbsoluteUrl('/admin/comment')

  await sendAdminNotificationEmail({
    subject: '收到新的低语评论',
    title: '收到一条新的低语评论',
    lines: [
      `低语 ID：${mutterId}`,
      `评论人：${authorName}（${authorEmail}）`,
      `状态：${state === 'APPROVED' ? '已发布' : '待审核'}`,
      `内容：${truncateText(content)}`,
      `低语页面：${mutterUrl}`,
    ],
    actionUrl: adminUrl,
    actionLabel: '去后台查看评论',
  })
}

export const notifyAdminFriendLinkApplication = async ({
  name,
  email,
  description,
  siteUrl,
  avatarUrl,
}: {
  name: string
  email?: string
  description: string
  siteUrl: string
  avatarUrl: string
}) => {
  const adminUrl = getAbsoluteUrl('/admin/friend-link')

  await sendAdminNotificationEmail({
    subject: `新的友链申请：${name}`,
    title: '收到新的友链申请',
    lines: [
      `站点名称：${name}`,
      `联系邮箱：${email ?? '未填写'}`,
      `站点描述：${description}`,
      `站点地址：${siteUrl}`,
      `头像地址：${avatarUrl}`,
    ],
    actionUrl: adminUrl,
    actionLabel: '去后台审核友链',
  })
}

export const notifyFriendLinkApproved = async ({
  to,
  name,
  siteUrl,
}: {
  to: string
  name: string
  siteUrl: string
}) => {
  const friendsUrl = getAbsoluteUrl('/friends')
  const lines = [
    `你好，${name} 的友链申请已经通过。`,
    `站点地址：${siteUrl}`,
    `友链页面：${friendsUrl}`,
  ]

  await sendEmail({
    to,
    subject: `【${subjectPrefix}】你的友链申请已通过`,
    text: lines.join('\n'),
    html: createEmailHtml({
      title: '你的友链申请已通过',
      lines,
      actionUrl: friendsUrl,
      actionLabel: '查看友链页面',
    }),
  })
}

export const notifyAdminFriendLinkApproved = async ({
  name,
  email,
  siteUrl,
}: {
  name: string
  email: string
  siteUrl: string
}) => {
  const adminUrl = getAbsoluteUrl('/admin/friend-link')

  await sendAdminNotificationEmail({
    subject: `友链已通过：${name}`,
    title: '友链审核已通过',
    lines: [`站点名称：${name}`, `联系邮箱：${email}`, `站点地址：${siteUrl}`],
    actionUrl: adminUrl,
    actionLabel: '查看友链管理',
  })
}
