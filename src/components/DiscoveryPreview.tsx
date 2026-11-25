import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'motion/react'

type TmdbItem = { id: number; media_type?: 'movie' | 'tv' | 'person'; title?: string; name?: string; poster_path?: string | null; release_date?: string; first_air_date?: string; vote_average?: number }
type Shelf = { title: string; source: string; description: string; tone: 'blue' | 'ember' | 'neutral'; wide?: boolean; mediaType?: 'movie' | 'tv' | 'both'; remoteShelf?: string; limit?: number }

const previewMovies: TmdbItem[] = [
  { id: 990001, media_type: 'movie', title: 'The Quiet Orbit', release_date: '2024-04-12' },
  { id: 990002, media_type: 'movie', title: 'A Map of Blue', release_date: '2023-09-08' },
  { id: 990003, media_type: 'movie', title: 'After the Rain Room', release_date: '2025-02-21' },
]
const previewSeries: TmdbItem[] = [
  { id: 990011, media_type: 'tv', name: 'Signal House', first_air_date: '2024-01-18' },
  { id: 990012, media_type: 'tv', name: 'The Pale Atlas', first_air_date: '2022-06-03' },
  { id: 990013, media_type: 'tv', name: 'Small Hours', first_air_date: '2025-03-14' },
]
const previewTrending: TmdbItem[] = [previewMovies[0], previewSeries[0], previewMovies[2]]
const previewByShelf: Record<string, TmdbItem[]> = {
  'movies-popular': previewMovies,
  theatrical: previewMovies,
  'movies-acclaimed': previewMovies,
  'coming-soon': previewMovies,
  'tv-popular': previewSeries,
  'tv-acclaimed': previewSeries,
  trending: previewTrending,
}

const catalogShelves: Shelf[] = [
  { title: 'Top 10 movies', source: 'TMDB popular movies', description: 'The first ten current popular movie results from TMDB.', tone: 'blue', wide: true, mediaType: 'movie', remoteShelf: 'movies-popular', limit: 10 },
  { title: 'Top 10 television series', source: 'TMDB popular TV', description: 'The first ten current popular series results from TMDB.', tone: 'neutral', mediaType: 'tv', remoteShelf: 'tv-popular', limit: 10 },
  { title: 'Trending titles', source: 'TMDB weekly trends', description: 'Current weekly trending movie and television results.', tone: 'ember', mediaType: 'both', remoteShelf: 'trending', limit: 10 },
  { title: 'New theatrical releases', source: 'TMDB now playing', description: 'Current theatrical releases. Set a region to personalize release availability.', tone: 'neutral', mediaType: 'movie', remoteShelf: 'theatrical', limit: 10 },
  { title: 'Popular television', source: 'TMDB popular TV', description: 'Current television popularity results from TMDB.', tone: 'blue', mediaType: 'tv', remoteShelf: 'tv-popular', limit: 10 },
  { title: 'Critically acclaimed movies', source: 'TMDB top rated', description: 'TMDB movie ratings. This is separate from Sinegang community ratings.', tone: 'ember', mediaType: 'movie', remoteShelf: 'movies-acclaimed', limit: 10 },
  { title: 'Critically acclaimed series', source: 'TMDB top rated', description: 'TMDB series ratings. This is separate from Sinegang community ratings.', tone: 'blue', mediaType: 'tv', remoteShelf: 'tv-acclaimed', limit: 10 },
  { title: 'Coming soon', source: 'TMDB upcoming movies', description: 'Upcoming release dates from TMDB; region may affect availability.', tone: 'neutral', mediaType: 'both', remoteShelf: 'coming-soon', limit: 10 },
]

const landingShelves: Shelf[] = [
  catalogShelves[0],
  catalogShelves[1],
  catalogShelves[2],
  catalogShelves[3],
  catalogShelves[5],
  catalogShelves[6],
  catalogShelves[7],
]

const communityShelves: Shelf[] = [
  { title: 'Community favorites', source: 'Eligible shared ratings', description: 'Shown after privacy, age and minimum-sample rules are applied.', tone: 'ember', wide: true },
  { title: 'Highest-rated on Sinegang', source: 'Sinegang community', description: 'Calculated only from eligible shared ratings, with confidence-aware ranking.', tone: 'blue' },
  { title: 'Recent community activity', source: 'Published contributions', description: 'Only approved public contributions appear here; personal diaries stay private.', tone: 'neutral' },
]

const personalShelves: Shelf[] = [
  { title: 'Continue watching', source: 'Your private library', description: 'Your playback history is private and appears here after you sign in.', tone: 'blue' },
  { title: 'Picked for you', source: 'Personalized discovery', description: 'Recommendations stay unavailable until there is enough consented data.', tone: 'neutral' },
]

const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science fiction', 'Thriller']

function MediaPoster({ item }: { item: TmdbItem }) {
  if (item.media_type === 'person') return null
  const kind = item.media_type ?? (item.title ? 'movie' : 'tv')
  const title = item.title ?? item.name ?? 'Untitled'
  const release = item.release_date ?? item.first_air_date
  const year = release?.slice(0, 4)
  const content = <>
    <span className="poster-art">{item.poster_path ? <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} loading="lazy" alt="" /> : <span className="poster-missing" aria-hidden="true" />}</span>
    <span className="poster-copy"><strong>{title}</strong>{year && <small>{year}</small>}{typeof item.vote_average === 'number' && item.vote_average > 0 && <small className="tmdb-score">TMDB · {item.vote_average.toFixed(1)}</small>}</span>
  </>
  return kind === 'movie'
    ? <Link className="shelf-poster" to="/movies/$id" params={{ id: String(item.id) }} aria-label={`${title}${year ? ` (${year})` : ''}`} key={item.id}>{content}</Link>
    : <Link className="shelf-poster" to="/tv/$id" params={{ id: String(item.id) }} aria-label={`${title}${year ? ` (${year})` : ''}`} key={item.id}>{content}</Link>
}

function DiscoveryShelf({ shelf }: { shelf: Shelf }) {
  const query = useQuery({
    queryKey: ['discovery-shelf', shelf.remoteShelf],
    enabled: Boolean(shelf.remoteShelf),
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/discover/${shelf.remoteShelf}`)
      const body = await response.json() as { data?: { results?: TmdbItem[] }; error?: { message?: string } }
      if (!response.ok) throw new Error(body.error?.message ?? 'This shelf is unavailable right now.')
      return body.data?.results ?? []
    },
  })
  const isDevelopmentSample = import.meta.env.DEV && query.isError && query.error.message === 'Catalog data is not configured.'
  const items = (query.data ?? (isDevelopmentSample ? previewByShelf[shelf.remoteShelf ?? ''] : undefined))?.filter((item) => item.media_type !== 'person').slice(0, shelf.limit ?? 10)
  const visibleSource = isDevelopmentSample ? 'Local sample · preview only' : shelf.source
  return <article className={`discovery-shelf tone-${shelf.tone}${shelf.wide ? ' discovery-shelf-wide' : ''}`}>
    <div className="shelf-copy">
      <div className="eyebrow">{visibleSource}</div>
      <h3>{shelf.title}</h3>
      <p>{isDevelopmentSample ? 'Fictional sample titles preview the card layout; these are not live catalog results.' : shelf.description}</p>
      {!shelf.remoteShelf && <span className="shelf-state">Data unavailable</span>}
      {isDevelopmentSample && <span className="shelf-state">Development sample data · not live</span>}
      {query.isPending && shelf.remoteShelf && <span className="shelf-state">Loading verified catalog results…</span>}
      {query.isError && !isDevelopmentSample && <span className="shelf-state">{query.error.message}</span>}
      {query.isSuccess && !items?.length && <span className="shelf-state">No results available for this shelf.</span>}
    </div>
    {items?.length ? <div className="shelf-results" aria-label={`${shelf.title} results`}>{items.map((item) => <MediaPoster key={`${item.media_type ?? 'title'}-${item.id}`} item={item} />)}</div> : <div className="shelf-art" aria-hidden="true"><span /></div>}
  </article>
}

function ShelfGroup({ title, description, shelves }: { title: string; description: string; shelves: Shelf[] }) {
  return <section className="discovery-group" aria-label={title}>
    <div className="discovery-group-heading"><div><div className="eyebrow">Discovery collection</div><h2>{title}</h2></div><p>{description}</p></div>
    <div className="discovery-grid">{shelves.map((shelf) => <DiscoveryShelf key={shelf.title} shelf={shelf} />)}</div>
  </section>
}

export function DiscoveryPreview() {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all')
  const scopedCatalog = catalogShelves.filter((shelf) => mediaType === 'all' || shelf.mediaType === 'both' || shelf.mediaType === mediaType)
  return <main id="main" className="browse-page">
    <header className="shell browse-hero">
      <div className="eyebrow">Explore / Catalog preview</div>
      <h1>Find the story that stays with you.</h1>
      <p>Browse a considered mix of films and series. Catalog shelves will fill from verified metadata and privacy-safe community data.</p>
      <div className="browse-actions"><Link className="button" to="/search">Search the catalog</Link><span className="browse-data-note">Catalog shelves load from TMDB and eligible community data.</span></div>
      <div className="browse-filters" role="group" aria-label="Choose media type">{([['all', 'All stories'], ['movie', 'Movies'], ['tv', 'Series']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={mediaType === value} onClick={() => setMediaType(value)}>{label}</button>)}</div>
      <p className="filter-preview" aria-live="polite">{mediaType === 'all' ? 'Showing the full discovery preview.' : `Showing ${mediaType === 'movie' ? 'movie' : 'series'} shelves.`}</p>
    </header>
    <div className="shell">
      <section className="discovery-group genre-group" aria-labelledby="genre-heading">
        <div className="discovery-group-heading"><div><div className="eyebrow">Explore by mood</div><h2 id="genre-heading">Stories by genre</h2></div><p>Genre names are navigation categories; no title counts or rankings are implied.</p></div>
        <div className="genre-grid">{genres.map((genre, index) => <div className={`genre-tile genre-${index % 4}`} key={genre}>{genre}<span aria-hidden="true">↗</span></div>)}</div>
      </section>
      <p className="tmdb-attribution">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      <ShelfGroup title="A pulse on the catalog" description="Popularity, trends, release dates and TMDB ratings stay labeled by source." shelves={scopedCatalog} />
      <ShelfGroup title="Chosen by the community" description="These shelves use eligible, explicitly shared data and appear only when safety and minimum-sample rules are met." shelves={communityShelves} />
      <ShelfGroup title="Your place in the story" description="Personal history and recommendations stay private and depend on an account and sufficient user-controlled data." shelves={personalShelves} />
    </div>
  </main>
}

export function LandingDiscovery() {
  const reducedMotion = useReducedMotion()
  const revealProps = reducedMotion
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.55, ease: 'easeOut' as const } }
  return <section id="discover" className="landing-discovery" aria-labelledby="landing-discovery-title">
    <div className="shell">
      <header className="landing-discovery-heading">
        <div className="eyebrow">A world of stories</div>
        <h2 id="landing-discovery-title">Find your next favorite.</h2>
        <p>Explore live catalog shelves. Scores and popularity are labeled by source.</p>
        <Link to="/browse" className="text-link">Open all discovery collections →</Link>
      </header>
      <motion.div {...revealProps}><ShelfGroup title="Start with what’s moving" description="Current popularity and weekly trends from TMDB." shelves={landingShelves.slice(0, 3)} /></motion.div>
      <motion.div {...revealProps}><ShelfGroup title="In theaters and on the horizon" description="Release listings from TMDB. Availability varies by region." shelves={landingShelves.slice(3, 4).concat(landingShelves.slice(6))} /></motion.div>
      <motion.div {...revealProps}><ShelfGroup title="Acclaimed by TMDB voters" description="TMDB ratings are separate from Sinegang community ratings." shelves={landingShelves.slice(4, 6)} /></motion.div>
      <p className="tmdb-attribution">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </div>
  </section>
}
