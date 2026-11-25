import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { playableMediaSchema, type PlayableMedia } from '../../../shared/playback'
import { parseBingeApiMessage } from './bingeapiBridge'

type Resolution = { embedUrl: string }

export function WatchPreview({ media }: { media: PlayableMedia }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const playbackConfirmed = useRef(false)
  const [resolution, setResolution] = useState<Resolution | null>(null)
  const [message, setMessage] = useState('Checking whether this title can play…')

  const kind = media.kind
  const tmdbId = media.tmdbId
  const season = media.kind === 'tv' ? media.season : undefined
  const episode = media.kind === 'tv' ? media.episode : undefined

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const playerEvent = parseBingeApiMessage(event, frameRef.current?.contentWindow ?? null)
      if (!playerEvent) return
      if (playerEvent.event === 'serverchange') setMessage('Player connected. Checking available sources…')
      else if (playerEvent.event === 'error') setMessage('A playback source reported an error. Checking availability…')
      else if (playerEvent.event === 'play') {
        playbackConfirmed.current = true
        setMessage('Playback started.')
      }
      else if (playerEvent.event === 'pause') setMessage('Playback paused.')
      else if (playerEvent.event === 'ended') setMessage('Playback ended.')
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (!resolution) return
    const timer = window.setTimeout(() => {
      if (!playbackConfirmed.current) setMessage('This title or episode is currently unavailable to play. Try again later.')
    }, 20_000)
    return () => window.clearTimeout(timer)
  }, [resolution])

  useEffect(() => {
    let current = true
    setResolution(null)
    playbackConfirmed.current = false
    setMessage('Checking whether this title can play…')
    const candidate: PlayableMedia = kind === 'movie'
      ? { kind, tmdbId }
      : { kind, tmdbId, season: season ?? 0, episode: episode ?? 0 }
    const checked = playableMediaSchema.safeParse(candidate)
    if (!checked.success) {
      setMessage('This movie or episode selection is invalid.')
      return () => { current = false }
    }
    fetch('/api/playback/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(checked.data) })
      .then(async (response) => {
        const body = await response.json().catch(() => null) as { data?: Resolution; error?: { message?: string } } | null
        if (!current) return
        if (!response.ok || !body?.data?.embedUrl) {
          setMessage(body?.error?.message ?? 'BingeAPI player could not be loaded.')
          return
        }
        setResolution(body.data)
        setMessage('Player opened. Checking whether this title can play…')
      }).catch(() => { if (current) setMessage('BingeAPI player is unavailable right now.') })
    return () => { current = false }
  }, [kind, tmdbId, season, episode])

  return <main id="main" className="watch-page shell">
    <Link to={media.kind === 'movie' ? '/movies/$id' : '/tv/$id'} params={{ id: String(media.tmdbId) }} className="text-link">← Back to title</Link>
    <h1>Watch {media.kind === 'movie' ? 'movie' : `season ${media.season}, episode ${media.episode}`}</h1>
    <div className={`player-theater ${media.kind === 'tv' ? 'has-episode-drawer' : ''}`}>
      <div className="player-stage">
        <p role="status" aria-live="polite">{message}</p>
        {resolution ? <div className="player-frame"><iframe ref={frameRef} title="BingeAPI video player" src={resolution.embedUrl} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => { if (!playbackConfirmed.current) setMessage('Player opened. Checking whether this title can play…') }} onError={() => setMessage('This title or episode is currently unavailable to play. The player could not load.')} /></div> : <div className="player-placeholder" aria-label="BingeAPI player is loading">Checking playback availability…</div>}
      </div>
      {media.kind === 'tv' && <aside className="episode-drawer glass-surface glass-1" aria-label="Episode navigation"><h2>Episodes</h2><p>Season {media.season} · Episode {media.episode}</p><div className="episode-empty">Episode list will appear with verified catalog metadata.</div></aside>}
    </div>
  </main>
}
