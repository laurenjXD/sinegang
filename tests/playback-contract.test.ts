import { describe, expect, it, vi } from 'vitest'
import { buildBingeApiEmbedUrl } from '../worker/services/bingeapi'
import { parseBingeApiMessage, sendBingeApiCommand } from '../src/features/playback/bingeapiBridge'

describe('BingeAPI embed contract', () => {
  it('builds only documented TMDB embed routes with passive defaults', () => {
    const movie = new URL(buildBingeApiEmbedUrl({ kind: 'movie', tmdbId: 27205 }))
    const episode = new URL(buildBingeApiEmbedUrl({ kind: 'tv', tmdbId: 1396, season: 1, episode: 1 }))
    expect(movie.origin).toBe('https://bingeapi.st')
    expect(movie.pathname).toBe('/embed/movie/27205')
    expect(movie.searchParams.get('autoplay')).toBe('0')
    expect(episode.pathname).toBe('/embed/tv/1396/1/1')
    expect(episode.searchParams.get('autonext')).toBe('0')
    expect(() => buildBingeApiEmbedUrl({ kind: 'tv', tmdbId: 1396, season: 0, episode: 1 } as never)).toThrow()
  })

  it('can enable the documented welcome page for local hosting environments', () => {
    const url = new URL(buildBingeApiEmbedUrl({ kind: 'movie', tmdbId: 27205 }, { welcome: true }))
    expect(url.searchParams.get('welcome')).toBe('1')
    expect(new URL(buildBingeApiEmbedUrl({ kind: 'movie', tmdbId: 27205 })).searchParams.has('welcome')).toBe(false)
  })

  it('rejects wrong origin, wrong window and malformed events', () => {
    const frame = {} as Window
    const valid = { origin: 'https://bingeapi.st', source: frame, data: { source: 'bingeapi_player', event: 'time', info: 120 } }
    expect(parseBingeApiMessage(valid, frame)?.event).toBe('time')
    expect(parseBingeApiMessage({ ...valid, origin: 'https://example.com' }, frame)).toBeNull()
    expect(parseBingeApiMessage({ ...valid, source: {} as Window }, frame)).toBeNull()
    expect(parseBingeApiMessage({ ...valid, data: { ...valid.data, info: -1 } }, frame)).toBeNull()
  })

  it('uses an exact target origin for commands', () => {
    const postMessage = vi.fn()
    sendBingeApiCommand({ postMessage } as unknown as Window, 'seek', 120)
    expect(postMessage).toHaveBeenCalledWith({ source: 'bingeapi_player_command', command: 'seek', value: 120 }, 'https://bingeapi.st')
    expect(() => sendBingeApiCommand({ postMessage } as unknown as Window, 'seek', -1)).toThrow()
  })
})
