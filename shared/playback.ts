import { z } from 'zod'

export const playableMediaSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('movie'), tmdbId: z.number().int().positive() }),
  z.object({ kind: z.literal('tv'), tmdbId: z.number().int().positive(), season: z.number().int().positive(), episode: z.number().int().positive() }),
])

export type PlayableMedia = z.infer<typeof playableMediaSchema>

export type PlaybackResult =
  | { status: 'pending'; sessionId: string; embedUrl: string; capabilities: { progress: boolean; captions: boolean; seek: boolean } }
  | { status: 'unavailable'; reason: string }

export interface PlaybackProvider {
  resolve(media: PlayableMedia): Promise<PlaybackResult>
}
