# Open questions

| ID | Owner | Question | Options | Recommendation | Blocking |
|---|---|---|---|---|---|
| UX-01 | User | Hero story structure | Three chapters / continuous artwork / typography-led transitions | Three short editorial chapters | Superseded by VIS-HERO: single featured title with scroll-revealed editorial content |
| UX-02 | User | Search access from floating navigation | Overlay plus `/search` / dedicated page | Overlay plus results page | Resolved: overlay plus page |
| UX-03 | User | Manual theme override | System default with override / system only | Override | Resolved: override |
| UX-04 | User, later milestone | Primary artwork and title selection | Licensed TMDB artwork / original commissioned artwork | Decide after metadata and rights review | Final art direction |
| PRODUCT-01 | User, later milestone | Age eligibility policy | Age gate and ratings policy to define | Pending | Playback and restricted content |
| PRODUCT-02 | User, later milestone | Retention and completion threshold | Policy to define | Pending | History and progress |
| OPS-01 | Project owner | TMDB terms, provider rights, quotas, admin provisioning, SEO | Verify against current contracts | Pending | External integration and release |
| COMM-UX-01 | User | Community rating placement on details | Summary and section / large feature / section only | Summary and section | Resolved: summary plus section |
| COMM-UX-02 | User | Sharing controls | Separate rating and review / combined | Separate controls | Resolved: separate controls |
| COMM-UX-03 | User | Community discovery rank | Confidence-aware plus emerging / raw average / editorial only | Confidence-aware plus emerging | Resolved: confidence-aware plus emerging |
| COMM-POL-01 | User | Public age eligibility | Verified adults / all verified with controls / keep private | Verified adults plus moderation | Public rating and review release |
| COMM-POL-02 | User | Review moderation timing and staffing | Pre-publication queue / post-publication / disable until staffed | Pre-publication queue | Public review release |
| COMM-POL-03 | Project owner | Pseudonym rules, abuse escalation and minimum rating sample | Define before public release | Pending | Public UGC release |
| PLAY-01 | Project owner | Provider authorization statement | Owner says the supplied statement is verified; recorded as the project authorization input. No need to resend it. Public embed reference says no API key is required. | Resolved for integration; production config selects BingeAPI but is not deployed | Production release still needs privacy/security review and playback verification |
| PLAY-02 | Project owner | Rights endpoint usage | Owner directs direct iframe use; supplied endpoint returned 404 and is not used | Resolved: remove rights-endpoint dependency for local direct embed | None for local integration |
| PLAY-03 | Provider / project owner | Reconcile official consumer terms with partner agreement; confirm legal entity and actual iframe message origin | Revised paste aligns event names and embed origin but has no authenticated provenance | Pending evidence | External playback security review |
| VIS-01 | User | Home hierarchy: (A) keep the approved cinematic landing and `/browse` as catalog; (B) add catalog rails below the cinematic hero; (C) replace the editorial landing with browse-first home | Recommend B: preserves approved first-paint storytelling while reducing discovery steps. A keeps a clear marketing/catalog split; C follows the reported reference structure most closely but changes the approved landing composition. | Resolved: owner chose B — keep the cinematic motion landing and add catalog rails beneath it |
| VIS-02 | User | Next prototype: (A) guest discovery/home, (B) movie/TV detail with credits and related titles, (C) TV season/episode journey | Recommend A to validate the guest-first path and home decision. B adds missing metadata value; C depends on episode metadata and playback behavior. | Resolved: owner chose A — prioritize guest discovery/home |
| AUTH-01 | User | Which first-release sign-in methods should be enabled? | Email magic link / email and password / Google OAuth / combination | Supabase email magic link first; add Google only if desired | Blocks final sign-in UX and provider setup |
| CATALOG-01 | User | What default region should local theatrical/upcoming shelves use? | No region / fixed country code / edge-derived country with user override | Edge-derived country with explicit override; fixed market is simpler and predictable | Optional for current catalog; required for localized release shelves |
| OPS-02 | Project owner | Provide TMDB Read Access Token to local/Cloudflare Worker secret store and Supabase staging URL + publishable key to local/Worker config | Configure privately in secrets/environment; never send secrets in chat | Use least-privilege public/publishable Supabase key; no service-role key in frontend or chat | Live catalog and Supabase integration |
| PLAY-04 | Project owner | BingeAPI playback mode | User directs direct embedding without the non-working rights endpoint and states catalog source is Internet Archive | Use fixed-origin BingeAPI iframe locally, with validated media IDs and autoplay disabled; keep production deployment decision separate | Resolved for local integration; production launch remains gated |

| GLASS-UX-01 | User | Glass material intensity | Restrained layering / prominent liquid glass / mostly solid with glass only for overlays. Preview dark/light samples. | Restrained layering for readable text and visible artwork; lower blur costs | Resolved: restrained glass; stronger blur limited to overlays |
| GLASS-UX-02 | User | Desktop and mobile navigation | Floating glass pill plus compact mobile bottom bar / floating pill at both sizes / top desktop bar and mobile drawer. | Desktop floating pill and mobile bottom bar for reachability | Resolved: desktop floating pill and compact mobile bottom bar |
| GLASS-UX-03 | User | Featured hero composition | One featured title / rotating carousel / editorial chapter story. | One featured title with scroll choreography; clear first-paint CTA | Resolved: one featured title with scroll-revealed editorial content and accessible manual title selection |
| GLASS-UX-04 | User | Poster shape and hover behavior | Consistent 2:3 cards / mixed 2:3 and 16:9 editorial tiles / flexible landscape-first. | Consistent 2:3 posters with landscape feature tiles | Resolved: consistent 2:3 posters, landscape features, subtle hover lift and touch-visible actions |
| GLASS-UX-05 | User | Detail page layout | Backdrop-led title header plus metadata glass / poster-led editorial detail / split information-first layout. | Artwork header with a restrained glass metadata panel and dedicated community section | Resolved: full-bleed artwork header with compact glass metadata panel |
| GLASS-UX-06 | User | Player layout | Theater-first with responsive episode drawer / player with persistent side rail / immersive full-screen default. | Theater mode with responsive episode drawer; preserve controls and content area | Resolved: near-black theater with glass controls, desktop side drawer and mobile bottom sheet |
| GLASS-UX-07 | User | Search overlay | Frosted discovery overlay with live suggestions / compact command palette / expanded full-screen search. | Frosted overlay that opens into shareable `/search` results | Resolved: frosted overlay with trending titles, keyboard hints and route shortcuts |
| GLASS-UX-08 | User | Community rating and review presentation | Glass rating summary with solid editorial reviews / fully glass section / compact summary only. | Glass summary panel plus readable solid review section | Resolved: dedicated Community tab; preserve the concise rating summary beside title metadata |
| GLASS-UX-09 | User | Profile and film diary layout | Private library-first / activity-first social profile / diary timeline. | Private library-first with explicit opt-in public contributions | Resolved: private library-first profile and per-item sharing opt-in |
| GLASS-UX-10 | User | Light-theme glass material | Frosted pearl / cool blue frost / nearly opaque neutral. | Frosted pearl with neutral text and strong controls | Resolved: frosted pearl with dark text and accessible controls |

Silence does not resolve a blocking decision. Approved V6 direction is not reopened.

| API-01 | Project owner | Provide a TMDB Read Access Token and Supabase staging URL + publishable key in local/Cloudflare configuration | Configure secrets privately; do not paste credentials into chat | TMDB token as Worker secret; Supabase publishable key with RLS, never service-role key in browser | Live catalog, auth, and saved ratings |

| PLAY-05 | Provider / project owner | Supply one known-working BingeAPI TMDB title and, if needed, documented `servers=` order for a third-party iframe; current sample 27205 redirects to Google and shows “refused to connect” in Chromium | Provider-confirmed sample title/server combination or upstream embed fix | Needed to verify real playback; app code cannot repair an upstream redirect | Playback QA |


## cno.to audit follow-up

The owner approved the recommended hybrid landing and guest-discovery priority on 2026-11-24. The supplied audit does not include screenshots or independent responsive measurements; direct visual reference QA remains outstanding.

| PLAY-06 | User | When BingeAPI cannot confirm playback, what should Sinegang show? | A: clear unavailable message only / B: official regional watch links / C: another authorized playback provider | User chose A: keep the app simple and do not imply an alternate source is available. | Resolved: show a clear unavailable message only; no external watch-provider links |
