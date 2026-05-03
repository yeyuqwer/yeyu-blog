import 'server-only'

import nodemailer from 'nodemailer'
import { serverEnv } from '@/config/env/server-env'

let mailTransporter: nodemailer.Transporter | null = null

const smtpConnectionTimeout = 8000
const smtpGreetingTimeout = 8000
const smtpSocketTimeout = 12000

type SendEmailResult =
  | {
      ok: true
      messageId: string
    }
  | {
      ok: false
      reason: string
    }

const getEnvValue = (value?: string | null) => {
  const trimmedValue = value?.trim()
  return trimmedValue === '' ? undefined : trimmedValue
}

const getSmtpPassword = () => getEnvValue(serverEnv.SMTP_PASS)?.replace(/\s/g, '')

const splitEmailList = (value?: string | null) =>
  (value ?? '')
    .split(',')
    .map(email => email.trim())
    .filter(isDeliverableEmail)

export const isDeliverableEmail = (email?: string | null) =>
  email != null && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const getNotificationRecipients = () => splitEmailList(serverEnv.MAIL_TO)

const getMissingEmailConfigKeys = () =>
  [
    ['SMTP_HOST', getEnvValue(serverEnv.SMTP_HOST)],
    ['SMTP_PORT', getEnvValue(serverEnv.SMTP_PORT)],
    ['SMTP_USER', getEnvValue(serverEnv.SMTP_USER)],
    ['SMTP_PASS', getSmtpPassword()],
    ['MAIL_FROM', getEnvValue(serverEnv.MAIL_FROM)],
  ]
    .filter(([, value]) => value == null)
    .map(([key]) => key)

const isEmailEnabled = () => getMissingEmailConfigKeys().length === 0

const getMailTransporter = () => {
  if (!isEmailEnabled()) {
    return null
  }

  mailTransporter ??= nodemailer.createTransport({
    host: getEnvValue(serverEnv.SMTP_HOST),
    port: Number(getEnvValue(serverEnv.SMTP_PORT)),
    secure: serverEnv.SMTP_SECURE === 'true',
    auth: {
      user: getEnvValue(serverEnv.SMTP_USER),
      pass: getSmtpPassword(),
    },
    connectionTimeout: smtpConnectionTimeout,
    greetingTimeout: smtpGreetingTimeout,
    socketTimeout: smtpSocketTimeout,
  })

  return mailTransporter
}

export const getAdminMailRecipients = () => getNotificationRecipients()

export const sendEmailInBackground = (task: () => Promise<unknown>) => {
  void task().then(
    () => undefined,
    () => undefined,
  )
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string | string[]
  subject: string
  text: string
  html: string
}): Promise<SendEmailResult> {
  const transporter = getMailTransporter()

  if (transporter == null) {
    const missingKeys = getMissingEmailConfigKeys().join(', ')
    return {
      ok: false,
      reason: `Missing email config: ${missingKeys}`,
    }
  }

  const normalizedRecipients = (Array.isArray(to) ? to : [to]).filter(isDeliverableEmail)

  if (normalizedRecipients.length === 0) {
    return {
      ok: false,
      reason: 'No valid recipients',
    }
  }

  return new Promise<SendEmailResult>(resolve => {
    transporter.sendMail(
      {
        from: getEnvValue(serverEnv.MAIL_FROM),
        to: normalizedRecipients,
        subject,
        text,
        html,
      },
      (error, info) => {
        if (error != null) {
          resolve({
            ok: false,
            reason: error.message,
          })
          return
        }

        resolve({
          ok: true,
          messageId: info.messageId,
        })
      },
    )
  })
}
