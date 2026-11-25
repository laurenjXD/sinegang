# Changelog

## 2026-11-24

- Imported the five V6 specification documents into a new project directory.
- Audited the empty workspace and seeded living decision, question and progress records.
- Began an independent foundation; no data migration or public deployment.
- Added React/Vite/TypeScript and Hono/Cloudflare Worker scaffolding, semantic theme tokens, routing, and a mock three-chapter landing prototype.
- Ran TypeScript successfully and inspected the desktop local preview. Build succeeded before the last chapter edit; a final build remains due.
- Integrated community ratings and reviews into the V6 specifications and living records; added typed contracts, validation tests and an unapplied privacy-first database migration.
- Recorded three approved community UX decisions and added a mock movie/TV detail community section. Fixed horizontal overflow found during desktop browser review.
- Added guarded private rating API routes and public aggregate read route. With no Supabase configuration, routes return an explicit service-unavailable response rather than fabricated data.
- Added an ESLint configuration. Five unit/API tests, typecheck, lint and production build pass. SQL remains unapplied and needs a Supabase integration test.
- Recorded BingeAPI as the selected but inactive technical candidate. Added a fixed-origin URL builder, validated postMessage bridge and provider review checklist; no external playback enabled.
- Reviewed additional BingeAPI landing-page copy. Recorded its catalog, quality and device claims as unverified marketing claims; rights and security gates remain open.
- Reviewed a pasted BingeBang partner authorization statement against public terms, privacy, help and domain pages. Recorded unresolved partner status, rights-catalog, entity/domain and postMessage-origin conflicts; kept external playback disabled.
- Inspected cno.to home, movie catalog, search overlay and title detail screens as a new visual reference. Recorded observations and asked whether the browse-first home supersedes the previously approved editorial landing.
- Reviewed a revised pasted BingeBang authorization statement. It aligns with the technical event and origin reference but still lacks authenticated Sinegang partner status, the referenced agreement/policy and a rights-catalog lookup contract.
- Reviewed a third pasted statement naming Sinegang and incorporating partner terms. Its issuer remains unverified; embed responses and playback events do not supply the required pre-play title-and-territory rights decision. External playback remains disabled.
- Reviewed a fourth pasted statement adding a signatory and proposed rights endpoint. These claims remain unverified; no code was added against the undocumented endpoint, and mock playback remains active.
- Implemented the fifth statement's pre-play rights check contract behind `PLAYBACK_PROVIDER=bingeapi`, plus movie/TV watch routes that mount the iframe only after exact title, territory and unexpired license clearance. Mock remains configured by default.
- Added rights gate tests for authorized, denied, expired, mismatched-title, territory, upstream-error and provider-config cases.
- Recorded the approved cinematic glassmorphism override and expanded discovery scope across all five V6 specifications; added ten owner decisions to the open-questions log.
- Added reusable glass material tokens and an accessible GlassSurface foundation; existing floating navigation and community rating form now use glass selectively.
- Recorded the owner’s answers to all ten glass composition choices; resolved the hero composition, responsive navigation, detail/player/search layouts, Community tab, profile and light material.
- Clarified that the dedicated Community tab contains full rating distribution and reviews while retaining the previously approved concise community score beside title metadata.
- Added desktop floating glass navigation, compact mobile bottom navigation, the responsive featured-title landing mock, frosted search dialog, artwork-led title header and dedicated Community view; introduced reusable glass primitives and solid fallbacks.
- Verified TypeScript, ESLint, 14 tests and production build. Inspected the live browser preview at 1168px width with no page overflow; 375px device emulation remains outstanding because browser DevTools are policy-blocked.
- Replaced the `/browse` placeholder with grouped catalog, genre, community and personal discovery shelves. Added a working movie/series preview filter and honest source-aware empty states; no rankings, ratings or activity are fabricated while integrations are disconnected.
- Added server-side TMDB discovery and search endpoints with strict route/response validation, safe response projection, timeout handling, cache headers and attribution. Connected catalog shelves and added a functional shareable search results page.
- Added configurable default region support for localized release shelves. Live catalog data remains disabled until a TMDB Read Access Token is configured as a Worker secret.

- Added an actual `/search?q=…` results page with media type filters, poster cards, source labels and an honest not-configured state. Fixed TMDB API v3 path construction; verified browse and search rendering without horizontal overflow at 1168px.
- Re-ran full checks: TypeScript, ESLint, 18 tests and production build pass. Mobile and system-theme browser QA remains open.

- Added development-only fictional catalog samples with explicit “not live” labels, meeting the mock-data-first workflow while keeping production data source-truthful. Recorded that no BingeAPI API key is required per the supplied public reference and that the supplied authorization statement does not need to be resent.

- Tested the documented BingeAPI entitlement URL; it returned HTTP 404 for a sample title/territory request. Kept the player fail-closed and mock-configured; recorded the need for a working rights endpoint rather than bypassing clearance.
- Following the owner's latest instruction, switched local development to direct BingeAPI iframe playback based on the owner-stated Internet Archive source; removed the unavailable rights-endpoint call from local code, retained media ID validation and autoplay-off settings, and kept production Wrangler config on mock.

- Enabled BingeAPI for local development using ignored `.dev.vars`; verified local health and playback-resolution responses. Production config remains mock and no deployment occurred.

- Inspected the actual local BingeAPI watch route: its iframe URL and API resolution are correct; the provider returned an HTML title over direct GET, but Chromium rendered the embedded frame blank/broken. Updated status text to report embed loading accurately and recorded browser-rendering QA as open.

- Added the documented `welcome=1` option for local hosting-network preview and wired validated BingeAPI `serverchange`/`error` events into player status with a timeout; an iframe load event no longer implies playback success. Browser audit shows the provider route redirects to Google, which refuses iframe connection. Logged a known-working title/server or provider fix as the remaining playback QA input.
- Added a bounded BingeAPI server diagnostic for owner-supplied TMDB IDs. It tests the 12 documented server preferences sequentially and records first-server events to CSV; no catalog ID brute force or stream scraping.
- Fixed diagnostic event cleanup, fallback error handling, visible error details, progress and CSV download handling.
- Audited 36 documented BingeAPI route/method/server/query cases; recorded per-server route results and their limitations in `docs/BINGEAPI_ENDPOINT_AUDIT.md`.
- Added and ran a 95-case BingeAPI HTTP endpoint matrix across all documented servers, route/ID formats, and query options; saved the complete results CSV.
- Added the supplied TMDB v4 token to ignored local `.dev.vars`; direct API read succeeded. Added a development-only Vite bridge to invoke the same Hono routes in proxy-aware Node because local Workerd cannot use this environment's proxy. Verified all nine discovery shelves and live search return real TMDB data; production remains Worker-based.
- Added TMDB title detail API and connected catalog/search title IDs to BingeAPI player routes. Movies now have a player action; TV details expose TMDB numbered seasons and episode selection. Live checks matched the Inception and Breaking Bad player pages; actual playback remains unverified.
- Added a repeatable cross-source smoke test for each TMDB title shelf and search; all 7 sampled unique TMDB IDs returned matching BingeAPI page titles. Genre endpoints are taxonomy-only. Typecheck and all 20 tests passed; production build completed. Page-title matches verify routing, not video playback.
- Replaced landing-page fictional titles/art with up to three trending TMDB titles and backdrop art, plus explicit loading and failure states. Typecheck, ESLint, 20 tests and build pass; responsive visual QA remains.

- Integrated the owner-provided cno.to audit as supplementary scope: created six audit/specification documents, added adaptation guidance to all five V6 documents, and kept unresolved home hierarchy/prototype priorities open.

- Owner approved the hybrid landing (keep cinematic motion hero, add catalog rails beneath) and guest discovery priority. Added source-labeled TMDB discovery rails to `/` with reduced-motion-aware scroll reveals.

- Changed BingeAPI resolver status from `available` to `pending` until the embedded player confirms playback; updated the contract test and documented why TMDB IDs cannot guarantee stream coverage. Added a fallback-display decision for official watch links or additional authorized providers.

- Recorded the owner’s playback fallback choice: show only a clear unavailable message. The player now waits for an actual `play` event, allows 20 seconds for provider fallback, and gives a clear message on timeout or iframe load failure.

- Switched the production Wrangler playback setting from mock to BingeAPI with the documented hosting welcome option. Local production-build smoke tests confirmed Inception and Breaking Bad player pages by HTTP; Chromium timed out before playback confirmation. No public deployment occurred.
- Added a production setup guide for Cloudflare, TMDB, Supabase, migration, and playback checks; aligned `.env.example` with BingeAPI configuration and ignored local env files. Deployment remains blocked on secure account connections and an identified existing production target.

- Attempted production deployment; blocked before publish because Cloudflare credentials are not connected. No Sinegang Sites project or production URL was found, and no public deployment occurred.
