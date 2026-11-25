import { afterEach, describe, expect, it, vi } from 'vitest'
import app from '../worker/index'
import { fetchTmdbDetails, fetchTmdbShelf } from '../worker/services/tmdb'

afterEach(() => vi.unstubAllGlobals())

describe('TMDB catalog adapter', () => {
  it('loads only public movie detail fields for TMDB-to-player routing', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      id: 27205,
      title: 'Inception',
      overview: 'A dream within a dream.',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2010-07-15',
      runtime: 148,
      vote_average: 8.4,
      vote_count: 30000,
      private_field: 'discarded',
    }), { status: 200 }))
    const result = await fetchTmdbDetails({ kind: 'movie', id: 27205, token: 'test-token', fetcher })
    expect(result).toMatchObject({ ok: true, data: { kind: 'movie', id: 27205, title: 'Inception', runtime: 148 } })
    expect((fetcher.mock.calls[0][0] as URL).pathname).toBe('/3/movie/27205')
    if (result.ok) expect(result.data).not.toHaveProperty('private_field')
  })

  it('projects numbered TV seasons for a BingeAPI episode route', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      id: 1396,
      name: 'Breaking Bad',
      overview: 'A chemistry teacher turns to crime.',
      first_air_date: '2008-01-20',
      vote_average: 8.9,
      vote_count: 15000,
      seasons: [
        { season_number: 0, episode_count: 8, name: 'Specials' },
        { season_number: 1, episode_count: 7, name: 'Season 1' },
      ],
    }), { status: 200 }))
    const result = await fetchTmdbDetails({ kind: 'tv', id: 1396, token: 'test-token', fetcher })
    expect(result).toMatchObject({ ok: true, data: { kind: 'tv', id: 1396, title: 'Breaking Bad', seasons: [{ number: 0 }, { number: 1, episodeCount: 7 }] } })
    expect((fetcher.mock.calls[0][0] as URL).pathname).toBe('/3/tv/1396')
  })

  it('keeps credentials server-side and requests only an approved TMDB route', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      page: 1,
      results: [{ id: 27205, title: 'Inception', media_type: 'movie', vote_average: 8.4, vote_count: 10, private_field: 'discarded' }],
      total_pages: 1,
      total_results: 1,
    }), { status: 200 }))

    const result = await fetchTmdbShelf({ token: 'test-token', shelf: 'theatrical', page: 1, region: 'PH', fetcher })
    expect(result.ok).toBe(true)
    const request = fetcher.mock.calls[0][0] as URL
    expect(request.origin).toBe('https://api.themoviedb.org')
    expect(request.pathname).toBe('/3/movie/now_playing')
    expect(request.searchParams.get('region')).toBe('PH')
    expect(fetcher.mock.calls[0][1]?.headers).toMatchObject({ Authorization: 'Bearer test-token' })
    if (result.ok && 'results' in result.data) expect(result.data.results[0]).not.toHaveProperty('private_field')
  })

  it('returns an explicit unavailable response without a token and makes no request', async () => {
    const fetcher = vi.fn<typeof fetch>()
    const result = await fetchTmdbShelf({ token: '', shelf: 'trending', fetcher })
    expect(result).toMatchObject({ ok: false, status: 503, code: 'CATALOG_UNAVAILABLE' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('validates shelf and pagination before calling TMDB', async () => {
    const invalidShelf = await app.request('http://localhost/api/discover/arbitrary', {}, { TMDB_API_TOKEN: 'token' })
    const invalidPage = await app.request('http://localhost/api/discover/movies-popular?page=0', {}, { TMDB_API_TOKEN: 'token' })
    expect(invalidShelf.status).toBe(400)
    expect(invalidPage.status).toBe(400)
  })

  it('filters person matches from public multi-search results', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      page: 1,
      results: [
        { id: 1, media_type: 'movie', title: 'A film', vote_average: 7, vote_count: 3 },
        { id: 2, media_type: 'person', name: 'A performer' },
      ],
      total_pages: 1,
      total_results: 2,
    }), { status: 200 })))
    const response = await app.request('http://localhost/api/search?q=film', {}, { TMDB_API_TOKEN: 'test-token' })
    expect(response.status).toBe(200)
    const body = await response.json() as { data: { results: Array<{ media_type?: string }> } }
    expect(body.data.results).toHaveLength(1)
    expect(body.data.results[0].media_type).toBe('movie')
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=180')
  })

  it('serves validated title detail data for the TMDB ID used by playback', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      id: 27205,
      title: 'Inception',
      overview: 'A dream within a dream.',
      release_date: '2010-07-15',
      runtime: 148,
      vote_average: 8.4,
      vote_count: 30000,
    }), { status: 200 })))
    const response = await app.request('http://localhost/api/title/movie/27205', {}, { TMDB_API_TOKEN: 'test-token' })
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600')
    expect(await response.json()).toMatchObject({ data: { kind: 'movie', id: 27205, title: 'Inception' } })
  })

  it('passes movie and TV TMDB detail IDs through to the BingeAPI embed resolver', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const url = new URL(String(input))
      return url.pathname === '/3/movie/27205'
        ? new Response(JSON.stringify({ id: 27205, title: 'Inception', release_date: '2010-07-15' }), { status: 200 })
        : new Response(JSON.stringify({ id: 1396, name: 'Breaking Bad', first_air_date: '2008-01-20', seasons: [{ season_number: 1, episode_count: 7 }] }), { status: 200 })
    }))
    for (const media of [
      { kind: 'movie' as const, id: 27205, playback: { kind: 'movie', tmdbId: 27205 } },
      { kind: 'tv' as const, id: 1396, playback: { kind: 'tv', tmdbId: 1396, season: 1, episode: 1 } },
    ]) {
      const detailResponse = await app.request(`http://localhost/api/title/${media.kind}/${media.id}`, {}, { TMDB_API_TOKEN: 'test-token' })
      const detail = await detailResponse.json() as { data: { id: number } }
      const playbackResponse = await app.request('http://localhost/api/playback/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media.playback),
      }, { PLAYBACK_PROVIDER: 'bingeapi', BINGEAPI_WELCOME: '1' })
      const playback = await playbackResponse.json() as { data: { embedUrl: string } }
      expect(detailResponse.status).toBe(200)
      expect(playbackResponse.status).toBe(200)
      expect(playback.data.embedUrl).toContain(`/embed/${media.kind}/${detail.data.id}`)
    }
  })
})
