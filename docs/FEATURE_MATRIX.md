# Feature Matrix

Status is based on the current repository, not the full PRD. “Preview” means the layout or interaction is present but is not backed by durable/live user data.

| Area | Reference-inspired product target | Current Sinegang status | Remaining work |
|---|---|---|---|
| Home feature | Featured film/series with synopsis, artwork, clear browse action | Implemented: up to three TMDB trending titles with backdrops, synopsis, manual selector, loading/error state; source-labeled TMDB rails beneath hero; live discovery rails beneath hero | Responsive visual QA; enrich with approved metadata and editorial story sections |
| Discovery | Movie/TV rankings, popular, trending, theatrical, acclaimed, upcoming | Partially implemented on `/browse`: live TMDB shelves and type filter | `/movies` and `/tv` currently placeholders; pagination, genre/year filters, sorting and independent catalog pages |
| Genres | Genre discovery and collections | Static genre name tiles on `/browse` | Make genre tiles navigate to real TMDB genre shelves; distinguish movie/TV genre mappings |
| Search | Overlay suggestions and shareable full results | Implemented with TMDB search, quick links, full results, type filter, loading/error/empty states | Keyboard/focus restoration QA and search improvements |
| Movie details | Artwork, metadata, cast/crew, related titles, trailer | Partial: TMDB title detail/backdrop, synopsis, runtime/date, separate ratings, mock community area and player link | Genres, credits, official trailer, recommendations, richer unavailable states |
| TV details | Series metadata, seasons, episode list and episode details | Partial: details and season/episode-number selection from TMDB season counts | Episode metadata/list, episode artwork/date/runtime, navigation; only verified fields |
| Person discovery | Biography, profession, known-for and filmography | Not implemented | Add public TMDB person/credits routes and screens after API/schema scope review |
| Community ratings | Half-star personal ratings, eligible aggregate and histogram | Preview UI, contracts, API stubs, SQL migration drafted | Supabase staging, apply/test RLS, save/share/withdraw, live aggregate UI and manipulation controls |
| Reviews | Private drafts and explicit publishing, spoilers, moderation | Empty state/schema groundwork; public reviews disabled | Auth, reporting/blocking/moderation/age policy before public enablement |
| Library | Private watchlist, favorites, diary/history, settings | Not implemented as pages; discovery shows truthful placeholders | Supabase Auth, private APIs, RLS, user controls and deletion flow |
| Playback | Theater player, episode navigation, verified controls | BingeAPI iframe route and event/error messaging; playback rendering unverified; production config not deployed | Confirm actual browser playback and provider/privacy/security release gates |
| Person/episode transitions | Shared layout transitions and motion | Motion dependency and reduced-motion config exist; no person or episode-card flow | Implement only after routes/data and prototype/QA |
| Responsive/accessibility | Touch, keyboard, contrast, reduced motion | Responsive CSS and reduced-motion behavior exist; coverage incomplete | Test defined viewport matrix, focus flow, screen reader names, contrast and artwork resilience |
