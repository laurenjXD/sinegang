# Sinegang — Product Requirements Document
Version 6.0 | MVP | Companion to AGENTS.md and DESIGN_SYSTEM.md

## 1. Product vision
Build a premium, artwork-first movie and television discovery and authorized streaming website. Separate the cinematic public landing page from the fast, functional catalog. Deliver an original brand, sophisticated Motion for React (Framer Motion) interactions, responsive layouts and a synchronized personal library.

## 2. Goals and scope
- P0: landing page, movie/TV discovery, search, filters, details, seasons and episodes, authentication, watchlist, history, supported progress synchronization, authorized playback, accessible responsive UI.
- P1: favorites, personalized recommendations, official trailers, advanced filters, supported next-episode navigation and playback controls.
- P2: watch parties, multiple profiles, PWA, semantic search, release calendar and collaborative recommendations.
- Non-goals: direct video hosting, unauthorized distribution, copying another service's branding, or implementing undocumented provider capabilities.

## 3. Users and journeys
Guests can explore the landing page, browse and search titles, view details and discover official viewing options. Registered users can save titles, manage their library, resume supported playback and control personalization. Administrators can review provider authorization and playback reports without accessing unnecessary personal data.

## 4. Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Public landing page with cinematic hero, editorial text reveal, trending showcase, featured spotlight, genre discovery and closing CTA | P0 |
| FR-02 | Separate catalog with dynamic trending, popular, top-rated and recent movie/TV rails | P0 |
| FR-03 | Browse movies and TV independently; filter genre/year and sort by popularity, rating or date; paginate | P0 |
| FR-04 | Debounced search with suggestions, keyboard navigation and empty/error states | P0 |
| FR-05 | Details with artwork, synopsis, rating, runtime, release date, genres, cast, age classification and related titles | P0 |
| FR-06 | Season selector and episode list with metadata and availability | P0 |
| FR-07 | Authorized playback with capability-aware controls and official viewing alternatives | P0 |
| FR-08 | Email registration, Google OAuth, verification, password reset and guest browsing | P0 |
| FR-09 | Watchlist, history, continue watching and cross-device progress where supported | P0 |
| FR-10 | Profile settings, account deletion, history clearing and personalization opt-out | P0 |
| FR-11 | Age-appropriate discovery and playback restrictions | P0 |
| FR-12 | Favorites, official trailers and personalized content recommendations | P1 |
| FR-13 | Playback reporting and administrator rights management | P0 |

## 5. Landing page and motion
Follow DESIGN_SYSTEM.md as the visual contract. Build full-bleed artwork, masked editorial text reveals, restrained parallax, staggered poster entrances, animated navigation and tactile spring interactions. Use shared layout transitions where reliable. Keep navigation, scrolling and content usable without animation. Respect reduced motion, avoid scroll hijacking, and do not autoplay audio. The landing CTA leads directly to the catalog. Use authorized artwork and real metadata; fixtures must be clearly marked in development.

## 6. Technology and architecture
React + Vite, TypeScript strict mode, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui (Radix primitives), Motion for React (`motion/react`), Lenis (optional), Embla Carousel, Lucide, Zustand only for shared UI state, Hono on Cloudflare Workers, Supabase Auth/PostgreSQL, Zod, TMDB, Vitest, Playwright, pnpm and GitHub. Deploy Vite static assets and Hono API in one Cloudflare Worker using Wrangler and the Cloudflare Vite plugin. Keep TMDB secrets in Worker bindings; use Supabase RLS for user data. Prerender the public landing page if practical; catalog is client-rendered. No video proxying or transcoding.

### Provider strategy
TMDB supplies metadata, not streaming rights. BingeAPI is the proposed playback provider, pending verification of official API documentation, distribution authorization, territorial rights, security and supported player events. Use a mock adapter with owned or public-domain test media until verified. Never invent provider endpoints or bypass access restrictions. If authorization is unavailable, disable playback and offer official viewing options. Resume, subtitles, quality, speed, fullscreen, picture-in-picture and next-episode features depend on documented provider capabilities.

## 7. Routes and API
Public routes: `/`, `/browse`, `/movies`, `/tv`, `/explore`, `/search`, `/movies/:id`, `/tv/:id`, `/watch/...`. Account routes: `/login`, `/register`, `/watchlist`, `/favorites`, `/history`, `/settings`. Restricted `/admin`.
Internal API: GET `/api/movies`, `/api/tv`, `/api/trending`, `/api/search`, `/api/discover`, `/api/movies/:id`, `/api/tv/:id`, `/api/tv/:id/seasons`, `/api/recommendations`, `/api/watchlist`, `/api/history`; POST `/api/watchlist`, `/api/playback/report`; PATCH `/api/progress`; DELETE `/api/watchlist/:id`, `/api/history/:id`, `/api/account`. These are application contracts, not provider endpoints. Validate inputs and authenticate user-specific operations.

## 8. Data model
- profiles: id, username, avatar_url, created_at
- media: id, tmdb_id, media_type, title; unique external ID/type
- episodes: id, media_id, season_number, episode_number; unique episode identity
- watchlist and favorites: id, user_id, media_id, created_at; unique user/title
- watch_progress: id, user_id, media_id, episode_id, position, duration, updated_at; unique user/playable item
- watch_history: id, user_id, media_id, episode_id, watched_at
- user_settings: user_id, autoplay, subtitle_language, personalization
- playback_reports: id, user_id, media_id, issue, status
- content_rights: id, media_id, provider, territory, authorization_status, validity dates
Use foreign keys, migrations, constraints and Row Level Security. Derive user identity from authenticated sessions, not client-supplied IDs.

## 9. Recommendations
Start with popularity and genre preferences. Add TF-IDF/cosine similarity for content-based recommendations in P1; consider collaborative or hybrid approaches only after sufficient consented data exists. Provide cold-start results and opt-out.

## 10. Quality, privacy and security
Target LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, cached API responses under 500ms, WCAG 2.2 AA, 320px minimum viewport, modern Chrome/Edge/Firefox/Safari. Treat these as measurable targets, not guarantees. Use HTTPS, server-side secrets, input validation, CSP, provider allowlists, rate limits, RLS, data minimization and deletion workflows. Review Philippine RA 8293 and RA 10173 applicability. Never log credentials or sensitive viewing data unnecessarily.

## 11. Failure states
Handle missing metadata/artwork, invalid IDs, rate limits, provider outages, unreleased episodes, expired sessions, duplicate saves, interrupted connections and unsupported player controls. Preserve last confirmed progress; never claim playback success without provider confirmation. All screens require loading, empty, error and success states.

## 12. Delivery roadmap
Week 1: repository setup, design tokens, motion primitives, landing page, catalog shell and TMDB integration.
Week 2: discovery/details, seasons, authentication, migrations, RLS, library and mock playback adapter.
Week 3: supported progress, recommendations, provider verification, regression/security/accessibility testing and deployment. Three weeks is an estimate, not a guarantee. Licensing and provider verification are independent release gates.

## 13. Acceptance criteria
- Landing page is visually polished at desktop, tablet and mobile widths, with reduced-motion alternatives.
- Catalog, search, filters and details use real metadata and handle failures.
- Users can authenticate, save/remove titles, manage history and delete their account; cross-user access is denied.
- Playback is enabled only for verified authorized content; unsupported controls are hidden.
- Progress synchronization works only with documented player events and is tested across sessions.
- Unit, integration and end-to-end tests pass; actual results and unresolved issues are recorded.
- Production build succeeds, environment setup is documented and no secrets are committed.

## 14. Cost and release gates
Aim for free-tier development using eligible Cloudflare Workers, Supabase and TMDB plans; verify current terms and quotas. Licensing, domains and excess usage are separate costs. Do not launch unauthorized playback. Release discovery-only functionality if playback verification remains unresolved.

## 15. Brand and localization
Brand: Sinegang; wordmark: sinegang. Tagline: Good stories. Good company. A subtle Filipino wordplay on sine, sinigang and gang, expressed through naming rather than themed decoration. Default to clear English microcopy; optional Filipino localization later. Preserve the international catalog and Filipino cinema discovery. Brand is provisional pending trademark and domain checks.

## Provider documentation update
The supplied BingeAPI reference describes iframe playback, browser-local resume and cross-window playback commands/events. This establishes a proposed technical contract, not distribution permission or independent security verification. No API key is described. Cross-device progress is an application responsibility; test against a mock adapter using owned or public-domain media. Do not enable the external provider until content rights and security are independently verified. Validate message origin, source window and schema, and avoid wildcard messaging. Do not assume episode identity events exist; disable unsupported synchronization.

## V5 visual contract
Sinegang uses Pitch Black (#050505), Arctic Blue (#7DD3FC), and Ember Orange (#FF6B35). Black dominates, blue supports navigation and focus, and orange identifies primary actions with dark text. Keep Geist and Space Grotesk, cinematic editorial composition, advanced Motion for React, and accessible reduced-motion alternatives. No legacy purple or pastel palette. DESIGN_SYSTEM.md is authoritative for semantic tokens and motion. Preserve the existing Cloudflare/Vite architecture and provider authorization gate.


## V6 approved creative direction
IMPLEMENTATION_PLAYBOOK.md governs the approved UI/UX decisions and clarification workflow. Use minimal Apple-style storytelling (original design), scroll-driven hero, floating minimal navigation, immersive experimental motion, shared layout movie-card transitions, hybrid rails/grid, oversized expressive typography, and system-preference light/dark themes. These supersede conflicting earlier visual defaults. Preserve brand palette and architecture. Do not ask the user to reconfirm these choices.

## V6 community ratings and reviews addendum
Community ratings are core scope. Members can privately rate films and TV from 0.5 to 5 stars in half-star steps. Guests can read eligible public aggregates and published reviews. Sharing a rating and publishing a review require separate explicit opt-ins; private ratings, reviews and diaries remain private. Members can withdraw shared content. Detail pages separate Sinegang averages, counts and distribution from TMDB's rating. Public review content uses pseudonyms, spoiler warnings and collapsible text, with date and rating sort. Community discovery uses eligible shared data and must handle insufficient samples. Authentication is required for create, edit and delete. Reporting, blocking, moderation, rate limiting, age rules and manipulation controls gate public review release. No direct messaging or unrestricted social interaction in the initial release. Implementation order: private ratings, aggregates, shared reviews after safety verification.

## Approved glassmorphism and discovery addendum
Glassmorphism is an approved and required design direction; it supersedes any earlier restriction on glass in this specification. Preserve the V6 brand, typography, themes, motion and architecture. Implement a reusable material system and Glass components described in `DESIGN_SYSTEM.md`, including dark smoked and light frosted pearl materials, multiple intensity levels, solid fallbacks and contrast/performance safeguards. Use glass selectively for floating navigation, overlays, controls and selected panels.

Discovery scope includes a featured cinematic hero, Top 10 movies and TV, trending, community favorites, new theatrical releases, popular TV, critically acclaimed and coming-soon selections, genre collections, continue watching, data-sufficient personalized recommendations, top Sinegang-rated titles and privacy-safe recent community activity. Keep TMDB popularity/ratings distinct from Sinegang community metrics. Rankings and engagement values must come from real eligible data; show honest unavailable or insufficient-sample states otherwise. Preserve guest-first discovery and playback, private-by-default diaries and collections, and all existing age, privacy and moderation requirements. Theater mode and episode navigation must expose only controls actually supported by a verified playback provider.

## Playback source selection update
The owner selected BingeAPI as the intended playback source and supplied its technical reference on 2026-11-24. Technical selection does not establish distribution rights or permitted territories. Continue with mock playback until the authorization and security gates in `docs/PROVIDER_REVIEW.md` are verified. TMDB remains the metadata source.


### Resolved screen composition
On 2026-11-24, the project owner selected restrained glass with stronger blur concentrated in overlays; a floating desktop pill and mobile bottom bar; one featured title with scroll-revealed editorial content and manual selection; consistent 2:3 posters with landscape feature tiles; artwork-led detail headers with compact glass metadata; a near-black theater player with glass controls and responsive episode drawer/sheet; frosted search; a dedicated Community tab while retaining the concise metadata rating summary; private library-first profiles; and frosted pearl light-theme material. These choices supersede the earlier fixed three-chapter hero count. All remaining V6 architecture, privacy, accessibility, community and provider boundaries remain unchanged.


## Supplementary reference audit and product scope
Use the owner-provided cno.to audit as a discovery and information-hierarchy reference while keeping Sinegang's original brand, guest-first experience, approved cinematic hero, privacy-first community features, and authorized playback boundary. The adaptation backlog includes independently browsable movie/TV catalogs, rankings with truthful source labels, genre collections, credits/person filmographies, richer series seasons/episodes, and related titles. The reference report does not independently verify behavior, content rights, provider claims, or visual measurements. See `docs/FEATURE_MATRIX.md` and `docs/SCREEN_SPECIFICATIONS.md` for implementation status; do not treat reported features as completed.


## Owner update — playback integration (2026-11-25)
The owner selected direct BingeAPI iframe playback and requested no mock playback. Current Wrangler production configuration selects BingeAPI. The adapter builds routes from TMDB movie IDs or TV ID/season/episode and waits for a real player `play` event before claiming playback. HTTP title-page matches do not establish video availability. Show a clear unavailable message if playback cannot be confirmed. Actual browser playback and any public deployment remain unverified/not performed.
