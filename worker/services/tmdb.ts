import { z } from 'zod'

export const shelfSchema = z.enum([
  'movies-popular',
  'tv-popular',
  'trending',
  'theatrical',
  'movies-acclaimed',
  'tv-acclaimed',
  'coming-soon',
  'movie-genres',
  'tv-genres',
])

export type TmdbShelf = z.infer<typeof shelfSchema>

const titleSchema = z.object({
  id: z.number().int().positive(),
  media_type: z.enum(['movie', 'tv', 'person']).optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().nonnegative().optional(),
  vote_count: z.number().int().nonnegative().optional(),
  popularity: z.number().nonnegative().optional(),
})

const pageSchema = z.object({
  page: z.number().int().positive(),
  results: z.array(titleSchema),
  total_pages: z.number().int().nonnegative(),
  total_results: z.number().int().nonnegative(),
})

const genreListSchema = z.object({ genres: z.array(z.object({ id: z.number().int().positive(), name: z.string() })) })
const movieDetailsSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  runtime: z.number().int().positive().nullable().optional(),
  vote_average: z.number().nonnegative().optional(),
  vote_count: z.number().int().nonnegative().optional(),
})
const tvDetailsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().nonnegative().optional(),
  vote_count: z.number().int().nonnegative().optional(),
  seasons: z.array(z.object({
    season_number: z.number().int().nonnegative(),
    episode_count: z.number().int().nonnegative(),
    name: z.string().optional(),
  })).optional(),
})
const tmdbBase = 'https://api.themoviedb.org/3/'

const shelfPaths: Record<Exclude<TmdbShelf, 'movie-genres' | 'tv-genres'>, string> = {
  'movies-popular': 'movie/popular',
  'tv-popular': 'tv/popular',
  trending: 'trending/all/week',
  theatrical: 'movie/now_playing',
  'movies-acclaimed': 'movie/top_rated',
  'tv-acclaimed': 'tv/top_rated',
  'coming-soon': 'movie/upcoming',
}

export type TmdbOptions = {
  token: string
  shelf: TmdbShelf
  page?: number
  region?: string
  language?: string
  fetcher?: typeof fetch
}

export async function fetchTmdbDetails({ kind, id, token, language = 'en-US', fetcher = fetch }: {
  kind: 'movie' | 'tv'
  id: number
  token: string
  language?: string
  fetcher?: typeof fetch
}) {
  if (!token.trim()) return { ok: false as const, status: 503, code: 'CATALOG_UNAVAILABLE', message: 'Catalog data is not configured.' }
  const url = new URL(`${kind}/${id}`, tmdbBase)
  url.searchParams.set('language', language)
  let response: Response
  try {
    response = await fetcher(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(6000) })
  } catch {
    return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Title details are temporarily unavailable.' }
  }
  if (response.status === 404) return { ok: false as const, status: 404, code: 'TITLE_NOT_FOUND', message: 'This title was not found in TMDB.' }
  if (!response.ok) return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Title details are temporarily unavailable.' }
  const payload: unknown = await response.json().catch(() => null)
  if (kind === 'movie') {
    const parsed = movieDetailsSchema.safeParse(payload)
    if (!parsed.success) return { ok: false as const, status: 502, code: 'INVALID_CATALOG_RESPONSE', message: 'Title details could not be read.' }
    return { ok: true as const, data: {
      kind,
      id: parsed.data.id,
      title: parsed.data.title,
      overview: parsed.data.overview ?? '',
      posterPath: parsed.data.poster_path ?? null,
      backdropPath: parsed.data.backdrop_path ?? null,
      releaseDate: parsed.data.release_date ?? '',
      runtime: parsed.data.runtime ?? null,
      tmdbRating: parsed.data.vote_average ?? null,
      tmdbVoteCount: parsed.data.vote_count ?? 0,
    } }
  }
  const parsed = tvDetailsSchema.safeParse(payload)
  if (!parsed.success) return { ok: false as const, status: 502, code: 'INVALID_CATALOG_RESPONSE', message: 'Title details could not be read.' }
  return { ok: true as const, data: {
    kind,
    id: parsed.data.id,
    title: parsed.data.name,
    overview: parsed.data.overview ?? '',
    posterPath: parsed.data.poster_path ?? null,
    backdropPath: parsed.data.backdrop_path ?? null,
    releaseDate: parsed.data.first_air_date ?? '',
    tmdbRating: parsed.data.vote_average ?? null,
    tmdbVoteCount: parsed.data.vote_count ?? 0,
    seasons: (parsed.data.seasons ?? []).map((season) => ({ number: season.season_number, episodeCount: season.episode_count, name: season.name ?? `Season ${season.season_number}` })),
  } }
}

export async function fetchTmdbShelf({ token, shelf, page = 1, region, language = 'en-US', fetcher = fetch }: TmdbOptions) {
  if (!token.trim()) return { ok: false as const, status: 503, code: 'CATALOG_UNAVAILABLE', message: 'Catalog data is not configured.' }

  const url = new URL(shelf === 'movie-genres' ? 'genre/movie/list' : shelf === 'tv-genres' ? 'genre/tv/list' : shelfPaths[shelf as keyof typeof shelfPaths], tmdbBase)
  url.searchParams.set('language', language)
  if (shelf !== 'movie-genres' && shelf !== 'tv-genres') url.searchParams.set('page', String(page))
  if ((shelf === 'theatrical' || shelf === 'coming-soon') && region) url.searchParams.set('region', region)

  let response: Response
  try {
    response = await fetcher(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(6000) })
  } catch {
    return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Catalog data is temporarily unavailable.' }
  }
  if (!response.ok) return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Catalog data is temporarily unavailable.' }

  const payload: unknown = await response.json().catch(() => null)
  if (shelf === 'movie-genres' || shelf === 'tv-genres') {
    const parsed = genreListSchema.safeParse(payload)
    return parsed.success
      ? { ok: true as const, data: { shelf, genres: parsed.data.genres } }
      : { ok: false as const, status: 502, code: 'INVALID_CATALOG_RESPONSE', message: 'Catalog data could not be read.' }
  }
  const parsed = pageSchema.safeParse(payload)
  return parsed.success
    ? { ok: true as const, data: { shelf, ...parsed.data } }
    : { ok: false as const, status: 502, code: 'INVALID_CATALOG_RESPONSE', message: 'Catalog data could not be read.' }
}

export async function searchTmdb({ token, query, page = 1, language = 'en-US', fetcher = fetch }: Omit<TmdbOptions, 'shelf' | 'region'> & { query: string }) {
  if (!token.trim()) return { ok: false as const, status: 503, code: 'CATALOG_UNAVAILABLE', message: 'Catalog data is not configured.' }
  const url = new URL('search/multi', tmdbBase)
  url.searchParams.set('query', query)
  url.searchParams.set('include_adult', 'false')
  url.searchParams.set('language', language)
  url.searchParams.set('page', String(page))
  let response: Response
  try {
    response = await fetcher(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(6000) })
  } catch {
    return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Search is temporarily unavailable.' }
  }
  if (!response.ok) return { ok: false as const, status: 502, code: 'CATALOG_UPSTREAM_ERROR', message: 'Search is temporarily unavailable.' }
  const parsed = pageSchema.safeParse(await response.json().catch(() => null))
  return parsed.success
    ? { ok: true as const, data: { shelf: 'search', ...parsed.data } }
    : { ok: false as const, status: 502, code: 'INVALID_CATALOG_RESPONSE', message: 'Search results could not be read.' }
}
