import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

type SearchItem = { id: number; media_type: 'movie' | 'tv'; title?: string; name?: string; poster_path?: string | null; release_date?: string; first_air_date?: string }

export function SearchResults() {
  const params = new URLSearchParams(window.location.search)
  const initialQuery = params.get('q')?.trim().slice(0, 100) ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all')
  const search = useQuery({
    queryKey: ['catalog-search-results', initialQuery],
    enabled: initialQuery.length >= 2,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(initialQuery)}`)
      const body = await response.json() as { data?: { results?: SearchItem[] }; error?: { message?: string } }
      if (!response.ok) throw new Error(body.error?.message ?? 'Search is unavailable right now.')
      return body.data?.results ?? []
    },
  })
  const results = search.data?.filter((item) => mediaType === 'all' || item.media_type === mediaType) ?? []

  return <main id="main" className="search-page shell">
    <div className="eyebrow">Explore / TMDB catalog</div>
    <h1>Search stories.</h1>
    <form action="/search" method="get" className="search-page-form">
      <label htmlFor="full-search">Films and series</label>
      <div><input id="full-search" type="search" name="q" value={query} maxLength={100} onChange={(event) => setQuery(event.target.value)} placeholder="Try a title, genre, or year" /><button className="button" type="submit">Search</button></div>
    </form>
    {initialQuery.length < 2 ? <p className="search-page-message">Enter at least two characters to search the TMDB catalog.</p> : search.isPending ? <p className="search-page-message" role="status">Searching the catalog…</p> : search.isError ? <p className="search-page-message" role="status">{search.error.message}</p> : <>
      <div className="browse-filters search-page-filters" role="group" aria-label="Filter search results">{([['all', 'All results'], ['movie', 'Movies'], ['tv', 'Series']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={mediaType === value} onClick={() => setMediaType(value)}>{label}</button>)}</div>
      <p className="search-page-message" aria-live="polite">{results.length ? `${results.length} results from TMDB` : `No results found for “${initialQuery}”.`}</p>
      <div className="search-page-grid">{results.map((item) => {
        const title = item.title ?? item.name ?? 'Untitled'
        const year = (item.release_date ?? item.first_air_date)?.slice(0, 4)
        const href = item.media_type === 'movie' ? '/movies/$id' : '/tv/$id'
        return <Link className="search-page-card" key={`${item.media_type}-${item.id}`} to={href} params={{ id: String(item.id) }}>
          <span className="poster-art">{item.poster_path ? <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} loading="lazy" alt="" /> : <span className="poster-missing" aria-hidden="true" />}</span>
          <strong>{title}</strong><small>{item.media_type === 'movie' ? 'Movie' : 'Series'}{year ? ` · ${year}` : ''} · TMDB</small>
        </Link>
      })}</div>
    </>}
    <p className="tmdb-attribution">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
  </main>
}
