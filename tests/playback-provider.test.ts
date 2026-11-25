import { describe, expect, it } from 'vitest'
import app, { playbackProvider } from '../worker/index'

describe('BingeAPI direct playback adapter', () => {
  it('builds validated movie and TV embeds but leaves availability pending until the player confirms playback', async () => {
    const movie = await app.request('http://localhost/api/playback/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'movie', tmdbId: 27205 }),
    }, { PLAYBACK_PROVIDER: 'bingeapi' })
    expect(movie.status).toBe(200)
    expect(await movie.json()).toMatchObject({ data: { status: 'pending', embedUrl: 'https://bingeapi.st/embed/movie/27205?autoplay=0&autonext=0&color=7DD3FC&theme=dark&resume=0' } })

    const episode = await app.request('http://localhost/api/playback/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'tv', tmdbId: 1396, season: 1, episode: 1 }),
    }, { PLAYBACK_PROVIDER: 'bingeapi' })
    expect(episode.status).toBe(200)
    const episodeBody = await episode.json() as { data: { status: string; embedUrl: string } }
    expect(episodeBody.data).toMatchObject({ status: 'pending' })
    expect(episodeBody.data.embedUrl).toContain('/embed/tv/1396/1/1?')
  })

  it('rejects invalid media identifiers and leaves BingeAPI disabled when mock is selected', async () => {
    const invalid = await app.request('http://localhost/api/playback/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'movie', tmdbId: 0 }),
    }, { PLAYBACK_PROVIDER: 'bingeapi' })
    expect(invalid.status).toBe(400)
    expect(playbackProvider({ PLAYBACK_PROVIDER: 'mock' })).toBeNull()
  })

  it('enables the documented welcome screen only when the local flag is set', async () => {
    const response = await app.request('http://localhost/api/playback/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'movie', tmdbId: 27205 }),
    }, { PLAYBACK_PROVIDER: 'bingeapi', BINGEAPI_WELCOME: '1' })
    const body = await response.json() as { data: { embedUrl: string } }
    expect(new URL(body.data.embedUrl).searchParams.get('welcome')).toBe('1')
  })
})
