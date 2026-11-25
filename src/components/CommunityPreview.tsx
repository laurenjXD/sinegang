import { useState } from 'react'
import { GlassRatingPanel } from './GlassComponents'

const halfSteps = Array.from({ length: 10 }, (_, index) => (index + 1) / 2)

export function PersonalRatingPreview() {
  const [rating, setRating] = useState<number | null>(null)
  const [share, setShare] = useState(false)

  return <GlassRatingPanel level="1" className="personal-rating" aria-labelledby="your-rating-title">
    <div className="mock">Local preview · nothing is saved</div>
    <h3 id="your-rating-title">Your rating</h3>
    <p>Ratings stay private unless you choose to share them. Sign-in and saving are not connected in this preview.</p>
    <fieldset className="rating-fieldset">
      <legend>Choose a rating from half a star to five stars</legend>
      <div className="rating-choices">
        {halfSteps.map((value) => <label key={value} className={rating === value ? 'selected' : ''}>
          <input type="radio" name="personal-rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
          <span aria-hidden="true">★</span><span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span>
          <small aria-hidden="true">{value}</small>
        </label>)}
      </div>
    </fieldset>
    <label className="share-option"><input type="checkbox" checked={share} onChange={(event) => setShare(event.target.checked)} /> Share this rating with the community</label>
    <p className="privacy-note">{share ? 'Sharing is selected for this local preview. No rating has been published.' : 'Private by default. You can withdraw a shared rating later.'}</p>
    <button className="button" type="button" disabled>Sign in to save rating</button>
  </GlassRatingPanel>
}

export function CommunityScoreSummary({ compact = false, tmdbRating = null, tmdbVoteCount = 0 }: { compact?: boolean; tmdbRating?: number | null; tmdbVoteCount?: number }) {
  return <div className={compact ? 'rating-summary rating-summary-compact' : 'shell rating-summary'} aria-label="Rating summary">
      <div><span className="eyebrow">Sinegang community</span><strong>Not rated yet</strong><span>0 eligible ratings</span></div>
      <div><span className="eyebrow">TMDB</span><strong>{tmdbRating !== null && tmdbRating > 0 ? tmdbRating.toFixed(1) : 'Unavailable'}</strong><span>{tmdbRating !== null ? `${tmdbVoteCount.toLocaleString()} TMDB votes · separate score` : 'Separate metadata score'}</span></div>
    </div>
}

export function CommunityRatingsSection({ kind, id }: { kind: 'movie' | 'tv', id: string }) {
  return <>
    <section className="section community-section" aria-labelledby="community-title">
      <div className="shell">
        <div className="eyebrow">Community / {kind === 'movie' ? 'Film' : 'Series'} #{id}</div>
        <h2 id="community-title">The conversation starts here.</h2>
        <div className="community-layout">
          <div><h3>Rating distribution</h3><p>No eligible shared ratings yet. The chart will appear when community ratings are available.</p><div className="histogram" aria-label="No community ratings yet">{halfSteps.map((value) => <div key={value}><span>{value}</span><div className="bar-track"><div className="bar-fill" /></div><span>0</span></div>)}</div></div>
          <PersonalRatingPreview />
        </div>
        <div className="review-empty"><h3>Community reviews</h3><p>No published reviews yet. Reviews will appear here after privacy and moderation checks are in place.</p></div>
      </div>
    </section>
  </>
}

export function CommunityPreview({ kind, id }: { kind: 'movie' | 'tv', id: string }) {
  return <><CommunityScoreSummary /><CommunityRatingsSection kind={kind} id={id} /></>
}
