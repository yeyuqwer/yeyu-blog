import { z } from 'zod'

export const updateCommentConfigSchema = z.object({
  autoApproveEmailUsers: z.boolean(),
  autoApproveWalletUsers: z.boolean(),
})
