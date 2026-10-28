import {z} from 'zod'

// shared with client
// TODO: consider moving this to a shared folder/workspace if used by both client and server.
const comparisonSchema = z.object({
    title: z.string(),
    recommendation: z.object({
        productId: z.string(),
        reason: z.string()
    }),
    alternatives: z.array(
        z.object({
            productId: z.string(),
            reason: z.string(),
        })
    )
})

const comparisonRequestSchema = z.object({
  productIds: z.array(z.string()).min(2).max(10),
  context: z.string().trim().min(1).max(1000),
});

export {
    comparisonSchema,
    comparisonRequestSchema
}