import { describe, expect, it } from 'vitest'
import app from '../worker/index'

describe('community API without configured external services', () => {
  it('rejects invalid media keys before touching Supabase', async () => {
    const response = await app.request('http://localhost/api/community/movie/nope/rating', {}, {})
    expect(response.status).toBe(400)
    expect((await response.json()).error.code).toBe('INVALID_MEDIA')
  })

  it('does not fabricate a community rating when Supabase is unavailable', async () => {
    const response = await app.request('http://localhost/api/community/movie/1/rating', {}, {})
    expect(response.status).toBe(503)
    expect((await response.json()).error.code).toBe('SERVICE_UNAVAILABLE')
  })

  it('rejects unsupported rating increments', async () => {
    const response = await app.request('http://localhost/api/me/ratings/movie/1', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating: 3.25 }) }, {})
    expect(response.status).toBe(400)
    expect((await response.json()).error.code).toBe('INVALID_RATING')
  })
})
