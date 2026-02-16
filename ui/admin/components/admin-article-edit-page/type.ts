import { z } from 'zod'

// * import from https://github.com/aifuxi/fuxiaochen/blob/master/constants/regex.ts

const REGEX = {
  SLUG: /^[a-z0-9-]+$/,
  PURE_NUMBERS: /\d+/g,
}

export const ArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: '长度不能少于1个字符' })
    .max(50, { message: '标题超出大小限制' }),
  slug: z
    .string()
    .trim()
    .regex(REGEX.SLUG, {
      message: '只允许输入数字、小写字母和中横线',
    })
    .min(1, { message: '长度不能少于1个字符' }),
  isPublished: z.boolean(),
  relatedTagNames: z.array(z.string()).max(3, { message: '最多只能选择 3 个标签' }),
  content: z.string(),
})

export type ArticleDTO = z.infer<typeof ArticleSchema>
export type UpdateArticleDTO = ArticleDTO & {
  id: number
}
