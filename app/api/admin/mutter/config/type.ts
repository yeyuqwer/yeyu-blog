import { z } from 'zod'

export const updateMutterCommentConfigSchema = z.object({
  autoApproveEmailUsers: z.boolean(),
  autoApproveWalletUsers: z.boolean(),
})
