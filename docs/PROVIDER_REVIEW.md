# BingeAPI provider review

Status as of 2026-11-25: BingeAPI direct iframe adapter is selected in `wrangler.jsonc` for production builds and local development. No public deployment was made. The owner confirms the supplied authorization statement and states the catalog is sourced from Internet Archive. The owner confirms the supplied authorization statement and states the catalog is sourced from Internet Archive. No API key is required by the public embed reference. The previously proposed rights endpoint returned 404 and is not used per the owner's latest instruction.

## Latest technical-reference and playback check (2026-11-24)

The owner supplied the complete public BingeAPI technical reference again. It confirms the existing movie/episode URL patterns, `welcome=1` guidance for hosting/VPN clients, `autoplay=0`, 16:9 wrapper sizing, and the provider's instruction not to add `sandbox`. The local implementation already uses a responsive 16:9 wrapper, omits `sandbox`, and enables `welcome=1` only in local development. The reference adds no fix for the browser iframe failure.

A fresh direct HTTP request to the exact bare sample Inception URL returned HTTP 200, stayed on `bingeapi.st` without a redirect, and returned HTML titled “Inception · BingeAPI.” Opening the same exact URL in the current Chromium browser immediately lands on Google. This reproduces the browser failure while confirming the server response is healthy from the shell HTTP client; it points to a browser/proxy or provider challenge incompatibility in this environment, not a malformed app URL. Actual playback inside the app iframe and provider postMessage events remain unverified. The app player layout was also brought in line with the approved theater and responsive episode-drawer direction.

An automated HTTP audit exercised both documented route templates with TMDB and IMDb example IDs, GET/HEAD/OPTIONS, all 12 documented server preferences crossed with all four reference ID/route combinations, each of 17 non-server query options individually on both route templates, combined options, season 0, an invalid movie ID, and the proposed rights endpoint. The 95-case run passed its expected status/title checks; results are in `docs/BINGEAPI_ENDPOINT_AUDIT.md` and `docs/BINGEAPI_ENDPOINT_TEST_RESULTS.csv`. Route/player-shell requests return 200 for valid examples, while OPTIONS and season 0 return 404 and the rights endpoint returns 404 JSON. A 200 player shell is not evidence of a working media source or a server-title association.

TMDB title detail routes are now wired through the same IDs to the BingeAPI resolver. Live verification: TMDB movie 27205 resolves to the BingeAPI Inception page; TMDB TV 1396 season 1 episode 1 resolves to the BingeAPI Breaking Bad page. Both embed pages returned HTTP 200 with matching titles. This confirms the TMDB-to-player route mapping for these examples only; video playback still requires browser event/visual verification.

The landing copy claims a large catalog, 12 servers, up to 4K, broad device support, no ads, and a free embed with no account or key. These claims do not identify the copyright holders, establish redistribution rights for Sinegang, list permitted territories or titles, or supply privacy and security terms. An initial narrow search returned no results; a broader follow-up found the provider's public help, terms and privacy pages reviewed below.

## User-supplied authorization statement review (2026-11-24)

The owner pasted a “Content Player Embedding Authorization and Compliance Statement” naming BingeBang, dated 2026-11-24. It asserts partner embedding and commercial use, content-rights warranties, territorial controls, and viewer-data categories. This is useful evidence of the claimed partner terms, but the text alone does not show that it was issued by the provider or that Sinegang is an authorized Partner under the referenced Partner Agreement. It has no agreement identifier, signatory, authenticated source, or usable registered address (the address field reads “Place”). The Partner Agreement and Acceptable Use Policy it invokes were not supplied.

A second pasted statement was supplied later the same day. It explicitly names `https://bingeapi.st` as the iframe and event origin, lists the event names from the technical reference, and describes local resume, VPN checks and no sandbox attribute. This narrows the technical-contract mismatch with the first statement. It still does not identify Sinegang as a Partner, include the referenced Partner Agreement or Acceptable Use Policy, establish the provider-issued provenance of the text, or provide an actual catalog or entitlement lookup contract. It refers to contacts “listed above,” but no contacts appear in the revised paste.

A third pasted statement explicitly designates Sinegang, incorporates a partner agreement and acceptable use policy, and purports to authorize live production playback. This narrows the earlier drafting gaps, but it is still plain pasted text with no verifiable issuer, agreement identifier, signature or provider-controlled publication. Its registered address remains `[Business Address]`. The statement's instruction to activate the adapter is a claim inside supplied material, not an implementation approval or a verified rights decision. The public consumer terms remain different; an authenticated partner agreement would need to establish the carve-out.

The third statement proposes querying the canonical embed URL and treating `serverchange`, `duration` or `play` events as proof of title and territory authorization. Those events are playback telemetry in the technical reference; no rights or entitlement response schema is documented. They occur only after the iframe is loaded and therefore cannot satisfy Sinegang's server-side pre-play rights check. An iframe error also cannot reliably distinguish no source, unlicensed title, expired rights, or territorial denial. No signed catalog feed, title/episode rights manifest, or documented availability endpoint was supplied.

A fourth pasted statement supplies reference `BB-PA-2026-1124-SINEGANG`, a named signatory, corporate address, and a proposed rights endpoint/feed. A fifth revision further specifies `GET /api/v1/rights/check` query parameters (`type`, `id`, `country`), clearance fields (`authorized`, `territory`, `valid_until`, `title_id`), and that player telemetry is not pre-play authorization. The user confirms the supplied statement is verified. A live GET to the supplied rights URL with the documented query shape and sample movie ID 27205 / US returned HTTP 404 (`{"error":"Not found"}`) on 2026-11-24. The owner then directed Sinegang to use the public iframe directly without that rights endpoint and states the catalog is sourced from Internet Archive. The app now constructs only fixed-origin BingeAPI movie/episode URLs from validated TMDB IDs, with autoplay disabled. Local development selects BingeAPI and adds `welcome=1` per the reference guidance for hosting networks; production Wrangler config also selects BingeAPI. The local Worker returns the expected embed URL. In Chromium, the iframe resolves to `www.google.com` and shows “refused to connect”; direct top-level navigation to the same embed also lands on Google. The app now requires a validated BingeAPI `serverchange` or `error` postMessage signal and reports a timeout instead of treating iframe `load` as playback success. Real playback remains unverified; the current failure appears upstream or specific to this browser environment.

| Check | Statement | Independently observed provider material | Status |
|---|---|---|---|
| Partner commercial use | Commercial use permitted for authorized Partners | BingeAPI landing page invites embeds; BingeBang public terms say personal, non-commercial viewing only | Partner/consumer scope needs explicit reconciliation |
| Rights warranty | Provider warrants lawful distribution to the best of its knowledge | BingeBang public terms say third-party video servers are uncontrolled and service is provided without warranty; help calls it an aggregator | Signed or authenticated partner warranty and title rights evidence needed |
| Operator and domains | Provider “BingeBang”; legal email at `bingebang.com` | Official domain directory lists `bingebang.sx` and `bingeapi.com`; technical embed uses `bingeapi.st` | Confirm legal entity and control of all relevant domains |
| Message origin | First statement named `bingebang.com` and events not in the technical reference; revised statement names `https://bingeapi.st` and matching events | Pasted technical reference uses `bingeapi.st` | Technical mismatch narrowed; independently verify actual origin/source behavior |
| Rights lookup | Supplied statement proposes `/api/v1/rights/check` | Live request returned HTTP 404 for sample movie 27205 in US | Not used in local direct-iframe mode per latest owner instruction |
| Privacy | IP, device, playback events, sessions, security signals; partner notice/consent duty | Public policy also mentions Cloudflare, Google Analytics and third-party video/subtitle servers | Review iframe-specific data flow and partner terms |

Primary pages reviewed: `https://bingebang.sx/terms`, `https://bingebang.sx/privacy`, `https://bingebang.sx/help`, `https://bingebang.domains/`, and `https://bingeapi.com/` (2026-11-24). The public pages do not establish Sinegang's partner status or title-by-title license scope. No live embed was loaded during review.

## Documented technical contract

| Capability | Reference claim | Implementation stance |
|---|---|---|
| Movie embed | `/embed/movie/{tmdbId}` | Candidate URL builder validates positive TMDB ID |
| TV embed | `/embed/tv/{tmdbId}/{season}/{episode}`; season and episode start at 1; no specials | Candidate URL builder excludes season 0 |
| Player events | play, pause, ended, time, duration, seek, volume, mute, buffering, fullscreen, serverchange, error | Origin, source-window, and payload validation before use |
| Commands | play, pause, toggle, seek, volume, mute, fullscreen | Exact `https://bingeapi.st` target origin; no wildcard |
| Resume | Browser-local; `resume=0` disables it | Disable native resume while designing cross-device progress |
| Episode switching | Built-in picker/next episode; no documented episode identity event | Hide picker and next controls until event identity is verified |
| Autoplay | Default on, option `autoplay=0` | Force off for first play; `autonext=0` |
| Captions | Built-in and optional third-party subtitles | Do not promise captions until verified per playable title |
| Availability | Player looks up titles and sources on demand | Metadata or an embed URL does not prove availability or rights |

## Release blockers

1. Verify the operator and current official technical documentation independently.
2. Reconcile the owner-verified partner statement and Internet Archive source claim with the provider’s operative catalog, territory rules, and takedown process before any production launch.
3. Review privacy terms, cookie/storage behavior, embedded content, network requests, subtitles and security behavior. The reference says a sandbox attribute breaks its scripts; that is an unverified security constraint, not permission to omit safeguards.
4. Verify iframe origin, CSP `frame-src`, postMessage source and payload behavior against a permitted test title. The pasted example uses `*`; Sinegang must use the exact origin.
5. Confirm the current HTTP 200 response renders actual playback and emits expected postMessage events inside the ordinary app iframe; prior Chromium showed a redirect/refusal but the current direct HTTP check does not reproduce it. Verify CSP, privacy notice and mobile accessibility before production activation.
6. Test errors, server switches, direct navigation, TV episode identity, progress correctness, mobile behavior and accessibility. Do not claim cross-device progress from browser-local resume.

Local development and the current Wrangler production configuration select `PLAYBACK_PROVIDER=bingeapi`; `BINGEAPI_WELCOME=1` is set for hosting-network playback. No public deployment was made. Iframe security and privacy review remain release tasks.


## Playback coverage request and honest resolver status (2026-11-25)

The owner wants playback to work across the full movie/series catalog. Sinegang constructs the documented BingeAPI route from every validated TMDB movie ID or TV ID plus season/episode. The supplied BingeAPI reference claims on-demand lookup and server failover, but Sinegang has no documented provider catalog/availability endpoint to confirm coverage before opening the iframe. Earlier 95-case endpoint checks and 7 sampled TMDB-title comparisons validated HTTP/player-page routing only; they did not prove a playable source, all-title coverage, territorial eligibility, or browser playback.

The adapter now returns `status: pending`, not `available`, because building an iframe URL is not a successful provider resolution. The player remains pending until it receives a supported playback event; `serverchange` alone means a server was selected, while `play` is the clearest current playback-start signal. Provider/browser compatibility remains unverified. Production Wrangler config selects BingeAPI, but it has not been publicly deployed.

To improve catalog coverage, a provider must expose reliable title/episode availability and permitted playback for the target territories, or Sinegang must integrate additional authorized services. TMDB IDs provide metadata identity only. No test or route can guarantee every movie or episode exists with a working stream. Consider showing official availability links for titles the embedded player cannot confirm; see `PLAY-06` in `docs/OPEN_QUESTIONS.md`.


## Production-build playback smoke test (2026-11-25)

The Vite production build was run and served through local Wrangler using the built Worker and static assets, with the production `wrangler.jsonc` setting (`PLAYBACK_PROVIDER=bingeapi`). `/api/health` returned HTTP 200 and reported `bingeapi`. Movie 27205 resolved to a pending BingeAPI iframe URL containing the hosting welcome option; the provider returned HTTP 200 HTML titled “Inception · BingeAPI.” TV 1396 S1E1 likewise resolved pending and returned HTTP 200 HTML titled “Breaking Bad · BingeAPI.” These checks establish real-provider URL routing and title-page identity. They do not prove video playback. Headless Chromium timed out before DOM capture, so the required browser playback confirmation (`play` event) was not obtained. No public deployment was made. Wrangler `deploy --dry-run` confirms the production bundle binds BingeAPI and the hosting welcome option.
