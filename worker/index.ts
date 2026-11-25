import { Hono } from 'hono'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { ratingValueSchema } from '../shared/community'
import { playableMediaSchema, type PlayableMedia, type PlaybackProvider } from '../shared/playback'
import { buildBingeApiEmbedUrl } from './services/bingeapi'
import { fetchTmdbDetails, fetchTmdbShelf, searchTmdb, shelfSchema } from './services/tmdb'

type Bindings = {
  TMDB_API_TOKEN?: string
  TMDB_DEFAULT_REGION?: string
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_KEY?: string
  PLAYBACK_PROVIDER?: string
  BINGEAPI_WELCOME?: string
}
const app = new Hono<{ Bindings: Bindings }>()
const keySchema = z.object({ kind: z.enum(['movie', 'tv']), id: z.coerce.number().int().positive() })
const ratingBodySchema = z.object({ rating: ratingValueSchema }).strict()
export class BingeApiProvider implements PlaybackProvider {
  constructor(private readonly showWelcome = false) {}

  async resolve(media: PlayableMedia) {
    const embedUrl = buildBingeApiEmbedUrl(media, { welcome: this.showWelcome })
    return {
      // URL construction does not prove a source exists; BingeAPI resolves
      // title/territory/server availability inside the iframe at runtime.
      status: 'pending' as const,
      sessionId: crypto.randomUUID(),
      embedUrl,
      capabilities: { progress: false, captions: false, seek: false },
    }
  }
}

export function playbackProvider(env: Bindings): PlaybackProvider | null {
  return env.PLAYBACK_PROVIDER === 'bingeapi' ? new BingeApiProvider(env.BINGEAPI_WELCOME === '1') : null
}

function client(env: Bindings, token?: string): SupabaseClient | null {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY) return null
  return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  })
}

app.use('/api/*', async (c, next) => {
  c.header('X-Request-ID', crypto.randomUUID())
  c.header('Cache-Control', 'no-store')
  await next()
})
app.get('/api/health', (c) => c.json({ data: { status: 'ok', playbackProvider: playbackProvider(c.env) ? 'bingeapi' : 'mock' } }))

const pageQuerySchema = z.coerce.number().int().min(1).max(500).default(1)
const regionQuerySchema = z.string().regex(/^[A-Za-z]{2}$/).transform((value) => value.toUpperCase()).optional()
const languageQuerySchema = z.string().regex(/^[a-z]{2}-[A-Z]{2}$/).default('en-US')

app.get('/api/discover/:shelf', async (c) => {
  const shelf = shelfSchema.safeParse(c.req.param('shelf'))
  const page = pageQuerySchema.safeParse(c.req.query('page') ?? '1')
  const region = regionQuerySchema.safeParse(c.req.query('region') ?? c.env.TMDB_DEFAULT_REGION)
  const language = languageQuerySchema.safeParse(c.req.query('language') ?? 'en-US')
  if (!shelf.success || !page.success || !region.success || !language.success) {
    return c.json({ error: { code: 'INVALID_DISCOVERY_QUERY', message: 'Choose a supported discovery shelf and valid filters.' } }, 400)
  }
  const result = await fetchTmdbShelf({ token: c.env.TMDB_API_TOKEN ?? '', shelf: shelf.data, page: page.data, region: region.data, language: language.data })
  if (!result.ok) return c.json({ error: { code: result.code, message: result.message } }, result.status as 502 | 503)
  c.header('Cache-Control', 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600')
  return c.json({ data: result.data })
})

app.get('/api/search', async (c) => {
  const query = z.string().trim().min(2).max(100).safeParse(c.req.query('q') ?? '')
  const page = pageQuerySchema.safeParse(c.req.query('page') ?? '1')
  const language = languageQuerySchema.safeParse(c.req.query('language') ?? 'en-US')
  if (!query.success || !page.success || !language.success) {
    return c.json({ error: { code: 'INVALID_SEARCH_QUERY', message: 'Search needs 2–100 characters and a valid page.' } }, 400)
  }
  const result = await searchTmdb({ token: c.env.TMDB_API_TOKEN ?? '', query: query.data, page: page.data, language: language.data })
  if (!result.ok) return c.json({ error: { code: result.code, message: result.message } }, result.status as 502 | 503)
  c.header('Cache-Control', 'public, max-age=60, s-maxage=180, stale-while-revalidate=600')
  return c.json({ data: { ...result.data, results: result.data.results.filter((item) => item.media_type !== 'person') } })
})

app.get('/api/title/:kind/:id', async (c) => {
  const params = z.object({ kind: z.enum(['movie', 'tv']), id: z.coerce.number().int().positive() }).safeParse(c.req.param())
  const language = languageQuerySchema.safeParse(c.req.query('language') ?? 'en-US')
  if (!params.success || !language.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Choose a valid movie or series.' } }, 400)
  const result = await fetchTmdbDetails({ ...params.data, token: c.env.TMDB_API_TOKEN ?? '', language: language.data })
  if (!result.ok) return c.json({ error: { code: result.code, message: result.message } }, result.status as 404 | 502 | 503)
  c.header('Cache-Control', 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400')
  return c.json({ data: result.data })
})

app.post('/api/playback/resolve', async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = playableMediaSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Choose a valid movie or episode.' } }, 400)
  const provider = playbackProvider(c.env)
  if (!provider) return c.json({ error: { code: 'PLAYBACK_UNAVAILABLE', message: 'Live playback is not configured.' } }, 503)
  const result = await provider.resolve(parsed.data)
  if (result.status === 'unavailable') return c.json({ error: { code: 'RIGHTS_NOT_CLEARED', message: result.reason } }, 403)
  return c.json({ data: result })
})

app.get('/api/community/:kind/:id/rating', async (c) => {
  const parsed = keySchema.safeParse(c.req.param())
  if (!parsed.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Invalid media key.' } }, 400)
  const supabase = client(c.env)
  if (!supabase) return c.json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Community ratings are unavailable.' } }, 503)
  const { kind, id } = parsed.data
  const { data, error } = await supabase.from('community_rating_public').select('media_type,tmdb_id,rating_count,average_rating,distribution').eq('media_type', kind).eq('tmdb_id', id).maybeSingle()
  if (error) return c.json({ error: { code: 'UPSTREAM_ERROR', message: 'Community ratings could not be loaded.' } }, 502)
  return c.json({ data: data ?? { media_type: kind, tmdb_id: id, rating_count: 0, average_rating: null, distribution: Array(10).fill(0) } })
})

async function authenticated(c: { req: { header: (name: string) => string | undefined }, env: Bindings }) {
  const match = /^Bearer (\S+)$/i.exec(c.req.header('Authorization') ?? '')
  if (!match) return null
  const supabase = client(c.env, match[1])
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser(match[1])
  return error || !data.user ? null : { supabase, userId: data.user.id }
}

app.get('/api/me/ratings/:kind/:id', async (c) => {
  const parsed = keySchema.safeParse(c.req.param())
  if (!parsed.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Invalid media key.' } }, 400)
  if (!client(c.env)) return c.json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Ratings are unavailable.' } }, 503)
  const auth = await authenticated(c)
  if (!auth) return c.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to view your rating.' } }, 401)
  const { kind, id } = parsed.data
  const { data, error } = await auth.supabase.from('user_ratings').select('rating,shared_at').eq('user_id', auth.userId).eq('media_type', kind).eq('tmdb_id', id).maybeSingle()
  if (error) return c.json({ error: { code: 'UPSTREAM_ERROR', message: 'Your rating could not be loaded.' } }, 502)
  return c.json({ data: data ?? null })
})

app.put('/api/me/ratings/:kind/:id', async (c) => {
  const parsed = keySchema.safeParse(c.req.param())
  if (!parsed.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Invalid media key.' } }, 400)
  const body = ratingBodySchema.safeParse(await c.req.json().catch(() => null))
  if (!body.success) return c.json({ error: { code: 'INVALID_RATING', message: 'Choose a rating in half-star steps from 0.5 to 5.' } }, 400)
  if (!client(c.env)) return c.json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Ratings are unavailable.' } }, 503)
  const auth = await authenticated(c)
  if (!auth) return c.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to save a rating.' } }, 401)
  const { kind, id } = parsed.data
  const { data, error } = await auth.supabase.from('user_ratings').upsert({ user_id: auth.userId, media_type: kind, tmdb_id: id, rating: body.data.rating, shared_at: null, eligible_for_community: false, updated_at: new Date().toISOString() }, { onConflict: 'user_id,media_type,tmdb_id' }).select('rating,shared_at').single()
  if (error) return c.json({ error: { code: 'SAVE_FAILED', message: 'Your rating was not saved.' } }, 502)
  return c.json({ data })
})

app.delete('/api/me/ratings/:kind/:id', async (c) => {
  const parsed = keySchema.safeParse(c.req.param())
  if (!parsed.success) return c.json({ error: { code: 'INVALID_MEDIA', message: 'Invalid media key.' } }, 400)
  if (!client(c.env)) return c.json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Ratings are unavailable.' } }, 503)
  const auth = await authenticated(c)
  if (!auth) return c.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to delete a rating.' } }, 401)
  const { kind, id } = parsed.data
  const { error } = await auth.supabase.from('user_ratings').delete().eq('user_id', auth.userId).eq('media_type', kind).eq('tmdb_id', id)
  if (error) return c.json({ error: { code: 'DELETE_FAILED', message: 'Your rating was not deleted.' } }, 502)
  return c.json({ data: { deleted: true } })
})
app.all('/api/*', (c) => c.json({ error: { code: 'NOT_IMPLEMENTED', message: 'This API route is not available yet.' } }, 404))
export default app
