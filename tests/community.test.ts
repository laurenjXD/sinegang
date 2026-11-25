import { describe, expect, it } from 'vitest'
import { personalRatingSchema, ratingValueSchema } from '../shared/community'

describe('community contracts', () => {
  it('accepts only half-star values from 0.5 through 5', () => {
    for (let half = 1; half <= 10; half++) expect(ratingValueSchema.safeParse(half / 2).success).toBe(true)
    for (const invalid of [0, 5.5, 1.25, -1, Number.NaN]) expect(ratingValueSchema.safeParse(invalid).success).toBe(false)
  })

  it('defaults a personal rating to private', () => {
    const result = personalRatingSchema.parse({ mediaType: 'movie', tmdbId: 1, rating: 4.5 })
    expect(result.shareWithCommunity).toBe(false)
  })
})
