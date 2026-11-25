# Sinegang — Agent Engineering Specification

Version 6.0 | Companion to the Sinegang PRD and DESIGN_SYSTEM.md

## 1. Mission and authority
Build a responsive, cinematic movie and television discovery and authorized playback application. Treat the PRD as product scope, this file as engineering policy, and DESIGN_SYSTEM.md as the visual contract. If requirements conflict, prioritize security, privacy, accessibility and verified provider contracts. Record unresolved decisions rather than inventing API capabilities.

## 2. Agent roles
| Role | Ownership | Required output |
|---|---|---|
| Architect | Boundaries, schemas, dependencies | Architecture decisions and migration plan |
| Frontend | Routes, components, responsive UI | Accessible screens and component tests |
| Backend | API handlers, metadata, authentication | Typed contracts and integration tests |
| Playback | Provider capability and rights validation | Adapter, mock player and failure states |
| QA/security | Regression, permissions, performance | Test results and release blockers |

These are logical responsibilities, not a requirement to run multiple agents. The implementation agent must review changes across boundaries before merging.

## 3. Stack and architecture
React + Vite, TypeScript strict mode, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui (Radix primitives), Motion for React (`motion/react`), Lenis (optional), Embla Carousel, Lucide, Zustand only for shared UI state, Hono on Cloudflare Workers, Supabase Auth/PostgreSQL, Zod, TMDB, Vitest, Playwright, pnpm and GitHub.
Use a single repository and one Worker deployment for static assets and API routes.

```text
src/routes/          TanStack Router routes
src/components/      UI, landing, media and motion primitives
src/features/        Catalog, auth, library, playback
src/lib/             Browser Supabase client and query keys
worker/index.ts      Hono entrypoint
worker/services/     TMDB, authorization and metadata cache
shared/              Zod schemas and types
supabase/migrations/ SQL and RLS
tests/               Unit, integration and E2E
vite.config.ts       Vite and Cloudflare plugin
wrangler.jsonc       Worker and static asset configuration
```
Serve SPA navigation fallback for non-API routes; API routes must return JSON errors rather than HTML. Use the Cloudflare Vite plugin and Wrangler; test in the Workers runtime, not only Node. Keep secrets out of browser bundles. Use URL search parameters for filters and pagination. TanStack Query owns remote state.

## 4. Routes and deliverables
| Route | Responsibility |
|---|---|
| / | Public landing; /browse contains catalog and continue watching |
| /movies, /tv, /explore | Paginated catalog and filters |
| /search?q= | Search and empty states |
| /movies/:id, /tv/:id | Details, cast, trailer, seasons |
| /watch/movies/:id | Authorized movie playback |
| /watch/tv/:id/:season/:episode | Authorized episode playback |
| /login, /register | Authentication |
| /watchlist, /history, /settings | Private user library |
| /admin | Restricted provider and rights management |

## 5. External integrations
TMDB is the metadata source, not a license to stream films. Respect its attribution, caching and usage terms. Validate upstream responses, use bounded timeouts, retry transient failures with backoff, and cache only permitted public metadata. Never cache private responses across users.

BingeAPI is a proposed playback provider, not a verified integration. Before enabling it, verify its official documentation, distribution authorization, territories, age restrictions, security behavior, privacy terms and supported player events. Do not invent endpoints or assume an iframe exposes playback position. Do not scrape streams, bypass DRM, geographic restrictions or access controls. Until approved, use an original or public-domain test video through the mock adapter and official viewing links for unavailable titles.

```ts
type MediaKey = { kind: 'movie'; tmdbId: number } |
  { kind: 'tv'; tmdbId: number; season: number; episode: number };
type PlaybackResult =
  | { status: 'available'; sessionId: string; embedUrl: string;
      capabilities: { progress: boolean; captions: boolean; seek: boolean } }
  | { status: 'unavailable'; reason: string };
interface PlaybackProvider {
  resolve(media: MediaKey, territory: string): Promise<PlaybackResult>;
}
```
This is an internal proposed contract, not a third-party API. Resolve only after server-side entitlement and rights checks. Validate URLs against an approved origin allowlist. Accept player messages only from the expected origin and window, with validated payloads. Disable unsupported controls; never fabricate progress.

## 6. Data and authorization
Use profiles, media, episodes, watchlist, favorites, watch_progress, watch_history, user_settings, playback_reports and content_rights tables. Media identity is unique by (media_type, tmdb_id); episode identity by (media_id, season_number, episode_number). Enforce unique user/title watchlist records and separate movie/episode progress uniqueness using appropriate partial indexes. Validate nonnegative positions and duration bounds. Store timestamps in UTC. Use foreign keys and explicit deletion policies.

Enable RLS on every exposed table. User-owned rows require auth.uid() = user_id for reads and writes; admin access requires server-verified roles. Service-role credentials remain server-only. Do not trust client-supplied user IDs, roles or entitlement claims. Account deletion must remove personal library and progress according to retention policy.

## 7. Internal API conventions
Use JSON responses with consistent error codes, safe messages and request IDs. Validate all inputs with Zod. Return 400 for invalid input, 401 unauthenticated, 403 forbidden, 404 missing, 429 throttled, 502/503 upstream failure. Make watchlist addition idempotent. Save progress on supported player events with throttling and final best-effort flush; reject stale updates. Never claim successful persistence until confirmed.

## 8. UI implementation rules
Follow DESIGN_SYSTEM.md. Every data-dependent screen requires loading, empty, error and success states. Use semantic HTML, visible focus, reduced-motion support, keyboard navigation and responsive images. Do not hardcode catalog entries outside fixtures. Use skeletons matching final geometry. Avoid hover-only actions. Show content ratings and enforce age-appropriate availability. Do not autoplay audio or trailers by default.

## 9. Security and configuration
Maintain .env.example with placeholders only: TMDB_API_TOKEN, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY (only if necessary), PLAYBACK_PROVIDER=mock. Add provider credentials only after verification. Never commit secrets or log tokens, viewing history or personal data. Apply CSP, frame-src allowlists, secure cookies where applicable, CSRF protection for cookie-authenticated mutations, rate limits and dependency audits. Avoid broad iframe permissions. Use HTTPS. Keep privacy notices, consent where required, and account deletion available.

## 10. Agent execution protocol
1. Inspect repository, lockfile, existing conventions and current tests.
2. Identify impacted requirements and write a short implementation plan.
3. Implement the smallest complete vertical slice, including failure states.
4. Add migrations and tests alongside code; do not silently modify production data.
5. Run lint, typecheck, unit tests, relevant E2E tests and production build.
6. Review responsive UI, accessibility, permissions and secret exposure.
7. Report changed files, actual test results, limitations and next steps.

Do not overwrite unrelated changes, deploy publicly, spend money, or perform destructive database actions without explicit approval. Do not claim a test passed unless executed. Use mock data clearly labeled as such.

## 11. Milestones and release gates
| Milestone | Acceptance gate |
|---|---|
| Foundation | Build passes; tokens, layout and navigation work |
| Catalog | Search, filters, details, pagination and failures tested |
| Accounts | Auth and cross-user RLS isolation verified |
| Playback | Mock playback works; real provider remains gated until approved |
| Library | Watchlist and supported progress synchronize correctly |
| Release | E2E, accessibility, security and deployment checks pass |

Target LCP <= 2.5s, INP <= 200ms and CLS <= 0.1 under representative conditions. Measure rather than guarantee. MVP is complete only when required flows work, provider limitations are disclosed and no critical security issues remain.

## Motion-first landing implementation mandate (v5)
Implement DESIGN_SYSTEM.md sections 7 and 12 before expanding the catalog. Public `/` is a cinematic editorial landing page; `/browse` is the functional catalog. Preserve guest discovery and existing auth/library routes. Install `motion` and use `motion/react`; do not mix GSAP or duplicate animation packages without an approved architecture decision.

1. Establish motion tokens, MotionProvider, responsive shell and static or prerendered landing layout.
2. Build CinematicHero, RevealText and MotionSection with reduced-motion fallbacks and visible initial content.
3. Connect real TMDB metadata to PosterRail, FeaturedSpotlight and GenreGrid; use fixtures only in tests or clearly marked development previews.
4. Build library preview, closing CTA, footer and responsive navigation. Add shared layout transitions only where persistent router layouts support them.
5. Test keyboard, touch, reduced motion, slow network, route navigation, missing artwork and mobile overflow. Run lint, typecheck, unit tests and Playwright; record actual results and screenshots.

Do not sacrifice performance for visual effects. No scroll hijacking, invisible initial LCP content, autoplay audio, unbounded parallax, or unsupported player controls. Maintain verified playback authorization gates. Deliver a working landing page, not merely a component gallery. Report any unmet design requirements explicitly.

## Cloudflare deployment protocol
Use pnpm scripts for dev, lint, typecheck, test, build, preview and deploy. Configure Wrangler static assets from the Vite build output, SPA fallback and API-first routing for /api/*. Keep TMDB_API_TOKEN in Worker secrets (local .dev.vars ignored by git). VITE_* values are public; never place service-role keys there. Validate Supabase access tokens for private Hono routes and use user-scoped database access with RLS. Cache public metadata only, respecting upstream terms. Configure OAuth redirect allowlists for local and deployed origins. Test direct deep links, API errors, auth redirects and Worker CPU usage. Deploy via GitHub only after explicit approval; do not enable paid resources automatically.

## Provider documentation update
The supplied BingeAPI reference describes iframe playback, browser-local resume and cross-window playback commands/events. This establishes a proposed technical contract, not distribution permission or independent security verification. No API key is described. Cross-device progress is an application responsibility; test against a mock adapter using owned or public-domain media. Do not enable the external provider until content rights and security are independently verified. Validate message origin, source window and schema, and avoid wildcard messaging. Do not assume episode identity events exist; disable unsupported synchronization.

## V5 visual contract
Sinegang uses Pitch Black (#050505), Arctic Blue (#7DD3FC), and Ember Orange (#FF6B35). Black dominates, blue supports navigation and focus, and orange identifies primary actions with dark text. Keep Geist and Space Grotesk, cinematic editorial composition, advanced Motion for React, and accessible reduced-motion alternatives. No legacy purple or pastel palette. DESIGN_SYSTEM.md is authoritative for semantic tokens and motion. Preserve the existing Cloudflare/Vite architecture and provider authorization gate.


## V6 approved creative direction
IMPLEMENTATION_PLAYBOOK.md governs the approved UI/UX decisions and clarification workflow. Use minimal Apple-style storytelling (original design), scroll-driven hero, floating minimal navigation, immersive experimental motion, shared layout movie-card transitions, hybrid rails/grid, oversized expressive typography, and system-preference light/dark themes. These supersede conflicting earlier visual defaults. Preserve brand palette and architecture. Do not ask the user to reconfirm these choices.

## Additional approved glass and discovery requirement
The owner explicitly approved glassmorphism as a required visual direction. This supersedes any earlier prohibition or restriction on glass in the V6 documents. Implement a reusable, multi-level glass material system and the primitives listed in DESIGN_SYSTEM.md. Use smoked glass in dark mode and frosted pearl in light mode, with opaque fallbacks, readable contrast, limited placement and performance-safe motion. Do not blur every card or section. Preserve all V6 architecture, guest-first access, privacy, accessibility, verified-provider and motion constraints. Follow the resolved material and screen choices in `docs/DECISIONS.md`. The cno.to reference-priority questions remain open in `docs/OPEN_QUESTIONS.md`; do not silently decide those. Independent implementation and mock-data validation can continue. The discovery catalog must support the sections and truthful-data rules in the DESIGN_SYSTEM.md addendum.


## Supplementary reference-audit requirement — cno.to
Use cno.to only as a competitive information-architecture reference. The owner-provided audit is evidence about reported page structure, not proof of interactive behavior, styling metrics, implementation, playback rights, or provider claims. Preserve all approved Sinegang requirements and architecture. Maintain `docs/REFERENCE_AUDIT.md`, `docs/FEATURE_MATRIX.md`, `docs/COMPONENT_INVENTORY.md`, `docs/SCREEN_SPECIFICATIONS.md`, `docs/MOTION_SPECIFICATIONS.md`, and `docs/RESPONSIVE_SPECIFICATIONS.md`. Mark observed, reported, inferred, proposed, and implemented facts separately. Do not finalize the browse-first versus editorial-home relationship or next prototype priority until the owner resolves the open questions.


## Owner update — playback provider selection (2026-11-25)
The owner selected BingeAPI and directed that playback use the real iframe rather than mock playback. `wrangler.jsonc` now sets `PLAYBACK_PROVIDER=bingeapi` and `BINGEAPI_WELCOME=1`. Keep availability pending until a real player `play` event; a valid TMDB ID, HTTP 200, or matching HTML title is not proof of playable media. Show the clear unavailable state when the player cannot be confirmed. No public deployment has occurred; deployment and browser playback verification remain separate checks.
