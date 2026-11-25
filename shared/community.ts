import { z } from 'zod'

export const mediaKeySchema = z.object({
  mediaType: z.enum(['movie', 'tv']),
  tmdbId: z.number().int().positive(),
})

export const ratingValueSchema = z.number().min(0.5).max(5).refine(
  (value) => Number.isInteger(value * 2),
  'Ratings must use half-star increments',
)

export const personalRatingSchema = mediaKeySchema.extend({
  rating: ratingValueSchema,
  shareWithCommunity: z.boolean().default(false),
})

export const personalReviewSchema = mediaKeySchema.extend({
  body: z.string().trim().min(1).max(5000),
  containsSpoilers: z.boolean().default(false),
  shareWithCommunity: z.boolean().default(false),
})

export const publicRatingStatsSchema = mediaKeySchema.extend({
  ratingCount: z.number().int().nonnegative(),
  averageRating: z.number().min(0.5).max(5).nullable(),
  distribution: z.array(z.number().int().nonnegative()).length(10),
})

export const publicReviewSchema = mediaKeySchema.extend({
  id: z.string().uuid(),
  displayName: z.string(),
  body: z.string(),
  containsSpoilers: z.boolean(),
  rating: ratingValueSchema.nullable(),
  publishedAt: z.string().datetime(),
})

export type PublicRatingStats = z.infer<typeof publicRatingStatsSchema>
export type PublicReview = z.infer<typeof publicReviewSchema>
