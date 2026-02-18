import { z } from 'zod'

export const CreateEchoSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: '引用不能为空' })
    .max(100, { message: '引用长度过长' }),
  reference: z
    .string()
    .trim()
    .min(1, { message: '来源不能为空' })
    .max(20, { message: '来源长度过长' }),
  isPublished: z.boolean(),
})

export const UpdateEchoSchema = z
  .object({
    id: z.number(),
  })
  .merge(CreateEchoSchema)

export type CreateEchoDTO = z.infer<typeof CreateEchoSchema>
export type UpdateEchoDTO = z.infer<typeof UpdateEchoSchema>

export type EchoRecord = {
  id: number
  content: string
  reference: string
  isPublished: boolean
  createdAt: string
}

export type UpdateEchoParams = {
  id: number
  content?: string
  reference?: string
  isPublished?: boolean
}
