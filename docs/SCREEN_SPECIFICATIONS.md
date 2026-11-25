# Screen Specifications

Approved visual decisions are recorded in `docs/DECISIONS.md`. This file maps intended screens to current implementation and calls out behavior that is not yet complete.

| Screen / route | Intended hierarchy and behavior | Current status |
|---|---|---|
| `/` Landing | One featured title, first-paint action, scroll-revealed editorial composition, manually selectable title, live TMDB artwork; closing discovery CTA | Live TMDB trending hero plus editorial story and discovery rails for popular movies, TV, trends, theatrical, acclaimed and upcoming titles; scroll reveal respects reduced motion; visual/responsive QA pending |
| `/browse` | Genre entry, movie/TV and community discovery groups, hybrid rails/editorial grids, clear data source labels | Partially live; community/personal sections truthfully unavailable until connected |
| `/movies` | Movie catalog with ranked/popular/trending/genres, filters, sorting and pagination | Placeholder today |
| `/tv` | TV catalog with independent filters and series shelves | Placeholder today |
| Search overlay | Focused frosted dialog, suggestions, keyboard hints, route shortcuts, Escape/close | Implemented; focus restoration and keyboard QA pending |
| `/search?q=` | Shareable results, movie/series filter, loading/error/empty states | Implemented |
| `/movies/:id` | Backdrop, metadata glass, synopsis, separate TMDB/community rating, cast/crew, trailer, related titles, Community tab | Partial: metadata, score summary, community preview, BingeAPI action |
| `/tv/:id` | Series detail, metadata, season selection, episode list, Community tab | Partial: metadata and season/episode number input; no episode list |
| Person detail | Biography, role/profession, known-for works, filtered filmography | Not implemented; route/data contract required |
| `/watch/movies/:id` | Near-black theater, clear player status, supported controls only, return to detail | BingeAPI iframe integration; browser playback unverified, production config not yet deployed |
| `/watch/tv/:id/:season/:episode` | Player plus desktop side drawer/mobile sheet with verified episode list | Partial: current-episode label only; no list |
| `/login`, `/register` | Guest-first auth forms, validation, clear session and recovery states | Not implemented |
| `/watchlist`, `/favorites` | Private library grids, remove/empty/loading/error states | Not implemented |
| `/history` | Private diary/history, progress only if a supported event exists, clear controls | Not implemented |
| `/settings` | System/light/dark, privacy/personalization, account deletion | Not implemented |
| `/admin` | Restricted rights/reports review and audit | Not implemented |

All public screens keep metadata and community measures labeled by source. Private user data must be owner-scoped; public reviews remain gated by policy and moderation readiness.
