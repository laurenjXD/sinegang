import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CommunityRatingsSection, CommunityScoreSummary } from './CommunityPreview'

type MediaKind = 'movie' | 'tv'
type Season = { number: number; episodeCount: number; name: string }
type TitleDetails = {
  kind: MediaKind
  id: number
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  runtime?: number | null
  tmdbRating: number | null
  tmdbVoteCount: number
  seasons?: Season[]
}

export function TitleDetail({ kind, id }: { kind: MediaKind; id: string }) {
  const [section, setSection] = useState<'overview' | 'community'>('overview')
  const [seasonNumber, setSeasonNumber] = useState<number | undefined>()
  const [episodeNumber, setEpisodeNumber] = useState(1)
  const details = useQuery({
    queryKey: ['tmdb-title-details', kind, id],
    retry: false,
    staleTime: 15 * 60 * 1000,
    queryFn: async () => {
      const response = await fetch(`/api/title/${kind}/${encodeURIComponent(id)}`)
      const body = await response.json() as { data?: TitleDetails; error?: { message?: string } }
      if (!response.ok || !body.data) throw new Error(body.error?.message ?? 'Title details are unavailable right now.')
      return body.data
    },
  })
  const data = details.data
  const validSeasons = (data?.seasons ?? []).filter((season) => season.number > 0 && season.episodeCount > 0)
  const activeSeason = validSeasons.find((season) => season.number === seasonNumber)
    ?? validSeasons.find((season) => season.number === 1)
    ?? validSeasons[0]
  const releaseYear = data?.releaseDate.slice(0, 4)
  const backdropStyle = data?.backdropPath
    ? { backgroundImage: `linear-gradient(0deg,#050505 0%,rgba(5,5,5,.22) 68%,rgba(5,5,5,.08)), url("https://image.tmdb.org/t/p/w1280${data.backdropPath}")` }
    : undefined
  const movieWatchLink = data && kind === 'movie'
    ? <Link className="button" to="/watch/movies/$id" params={{ id }}>{'Open BingeAPI player'}</Link>
    : null
  const episodeWatchLink = data && kind === 'tv' && activeSeason && episodeNumber <= activeSeason.episodeCount
    ? <Link className="button" to="/watch/tv/$id/$season/$episode" params={{ id, season: String(activeSeason.number), episode: String(episodeNumber) }}>Open episode in BingeAPI</Link>
    : null

  return <main id="main">
    <section className={`detail-backdrop detail-${kind}`} style={backdropStyle}>
      <div className="shell detail-intro">
        <div className="detail-panel glass-surface glass-1">
          <div className="eyebrow">{details.isSuccess ? 'TMDB title details' : 'Loading TMDB title details'}</div>
          <h1>{data?.title ?? (kind === 'movie' ? 'Film details' : 'Series details')}</h1>
          {releaseYear && <p className="detail-meta">{releaseYear}{data?.runtime ? ` · ${data.runtime} min` : ''}</p>}
          <p>{data?.overview || (details.isPending ? 'Loading title details…' : details.error?.message ?? 'No synopsis is available for this title.')}</p>
          <CommunityScoreSummary compact tmdbRating={data?.tmdbRating ?? null} tmdbVoteCount={data?.tmdbVoteCount ?? 0}/>
          {details.isSuccess && kind === 'tv' && <div className="episode-selection">
            {activeSeason ? <>
              <label htmlFor="title-season">Season</label>
              <select id="title-season" value={activeSeason.number} onChange={(event) => { setSeasonNumber(Number(event.target.value)); setEpisodeNumber(1) }}>
                {validSeasons.map((season) => <option key={season.number} value={season.number}>{season.name} · {season.episodeCount} episodes</option>)}
              </select>
              <label htmlFor="title-episode">Episode number</label>
              <input id="title-episode" type="number" min={1} max={activeSeason.episodeCount} value={episodeNumber} onChange={(event) => setEpisodeNumber(Math.max(1, Math.min(activeSeason.episodeCount, Number(event.target.value) || 1)))} />
              {episodeWatchLink}
            </> : <p>No numbered episodes are listed by TMDB for this series.</p>}
          </div>}
          {movieWatchLink}
          {data && <p className="playback-note">The player uses this TMDB ID. Playback availability is determined by BingeAPI when it opens.</p>}
        </div>
      </div>
    </section>
    <div className="shell detail-tabs" aria-label="Title sections">
      <button type="button" aria-pressed={section === 'overview'} onClick={() => setSection('overview')}>Overview</button>
      <button type="button" aria-pressed={section === 'community'} onClick={() => setSection('community')}>Community</button>
    </div>
    {section === 'community'
      ? <CommunityRatingsSection kind={kind} id={id}/>
      : <section className="shell detail-overview"><h2>About this title</h2><p>{data?.overview || (details.isPending ? 'Loading title information…' : 'No synopsis is available for this title.')}</p></section>}
  </main>
}
