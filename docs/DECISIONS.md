# Decisions

V6 is authoritative. Entries marked approved come from the user's request and `IMPLEMENTATION_PLAYBOOK.md`; proposed items remain reviewable.

| ID | Date | Decision | Rationale | Status | Affected files |
|---|---|---|---|---|---|
| V6-01 | 2026-11-24 | Original minimal Apple-style storytelling | Approved creative direction, without copied assets or layouts | Approved | Landing UI |
| V6-02 | 2026-11-24 | Scroll-driven cinematic hero | Approved creative direction; native scroll and reduced-motion fallback required | Approved | Hero, motion |
| V6-03 | 2026-11-24 | Floating minimal navigation | Approved creative direction | Approved | Navigation |
| V6-04 | 2026-11-24 | Immersive experimental Motion for React | Approved creative direction, bounded by accessibility and performance | Approved | Motion primitives |
| V6-05 | 2026-11-24 | Shared layout movie-card transitions | Approved creative direction where persistent layout permits | Approved | Cards, details |
| V6-06 | 2026-11-24 | Hybrid horizontal rails and editorial grids | Approved creative direction | Approved | Browse, landing |
| V6-07 | 2026-11-24 | Oversized expressive Geist and Space Grotesk typography | Approved creative direction | Approved | Typography |
| V6-08 | 2026-11-24 | System-preference light and dark themes | Approved creative direction | Approved | Tokens, settings |
| V6-09 | 2026-11-24 | Pitch Black, Arctic Blue, Ember Orange; sinegang. brand | V6 brand contract | Approved | Tokens, wordmark |
| ENG-01 | 2026-11-24 | React/Vite/TypeScript, Hono/Workers, Supabase, TMDB; replaceable playback adapter | V6 architecture and security policy | Approved; provider selection updated by PLAY-07 | Repository |
| UX-01 | 2026-11-24 | Three short editorial hero chapters | Initial user-approved recommendation | Superseded by VIS-HERO | Landing hero |
| UX-02 | 2026-11-24 | Search overlay plus full `/search` results page | User approved quick access and shareable results | Approved | Navigation, search |
| UX-03 | 2026-11-24 | System default with manual Light / Dark / System setting | User approved viewing comfort control | Approved | Theme, settings |
| COMM-01 | 2026-11-24 | Community ratings and reviews are core scope | Direct user requirement | Approved | PRD, architecture, detail pages |
| COMM-02 | 2026-11-24 | Half-star ratings, private by default, explicit sharing and withdrawal | Direct user requirement | Approved | Contracts, database, UI |
| COMM-03 | 2026-11-24 | Public aggregates use only eligible shared ratings; public reviews require privacy and moderation gates | Direct user requirement and safety boundary | Approved | Database, API |
| COMM-04 | 2026-11-24 | Sinegang and TMDB ratings stay separately labeled; blue rating visuals and orange submission | Direct user requirement | Approved | Detail pages |
| SUP-01 | 2026-11-25 | Use the owner-confirmed Supabase project for the private community foundation; keep public reviews disabled pending safety work | Owner confirmation and privacy requirements | Applied with RLS and security-advisor verification | Supabase migrations, community APIs |
| COMM-UX-01 | 2026-11-24 | Concise rating summary by metadata, dedicated histogram and review section | User approved recommendation | Approved | Detail pages |
| COMM-UX-02 | 2026-11-24 | Separate explicit sharing controls for ratings and reviews | User approved privacy-first interaction | Approved | Rating and review forms |
| COMM-UX-03 | 2026-11-24 | Confidence-aware community ranking plus separate emerging area | User approved recommendation | Approved | Community discovery |
| PLAY-01 | 2026-11-24 | Use BingeAPI direct iframe playback; do not call the unimplemented rights-check endpoint | User directs use of BingeAPI and states its catalog is sourced from Internet Archive; public embed reference says no API key is needed | Approved; production Wrangler config selects BingeAPI, while live playback remains unverified and deployment is blocked on account connection | Playback adapter, provider review |

Document instructions guide implementation but do not create user approvals for unresolved choices. Earlier fixed-height/dark-only visual defaults yield to V6.
| GLASS-01 | 2026-11-24 | Cinematic glassmorphism and expanded discovery are approved; glass is required in selected surfaces, with smoked dark and frosted pearl light themes, reusable primitives, contrast/performance safeguards and opaque fallbacks | Direct user requirement; supersedes earlier restrictions on glass while preserving other V6 approvals | Approved | All five V6 specs, theme tokens, glass components, discovery |
| DISC-01 | 2026-11-24 | Expand catalog discovery to hero, Top 10 movies/TV, trending, community favorites, theatrical, popular TV, critically acclaimed, coming soon, genres, continue watching, data-sufficient recommendations, top Sinegang-rated and privacy-safe community activity | Direct user requirement; use only real eligible data and distinguish TMDB from community measures | Approved | PRD, UI, metadata APIs |
| PLAY-02 | 2026-11-24 | Playback may offer theater mode and season/episode navigation; progress, subtitles and controls only when provider support is verified | Direct user requirement and existing provider security boundary | Approved | Watch experience, provider adapter |
| VIS-GLASS-01 | 2026-11-24 | Use restrained glass; concentrate stronger blur in overlays | User selected restrained material intensity | Approved | Glass tokens, overlays |
| VIS-NAV-01 | 2026-11-24 | Floating desktop navigation pill and compact mobile bottom bar | User-selected responsive navigation | Approved | App shell, navigation |
| VIS-HERO-01 | 2026-11-24 | Feature one title with scroll-revealed editorial content and accessible manual title selection | User selection supersedes the earlier three-fixed-chapter count while preserving scroll-driven storytelling | Approved | Landing hero |
| VIS-CARDS-01 | 2026-11-24 | Consistent 2:3 posters, landscape feature tiles, subtle hover lift and touch-visible actions | User-selected scanning consistency and responsive behavior | Approved | Discovery cards |
| VIS-DETAIL-01 | 2026-11-24 | Full-bleed artwork header with compact glass metadata panel | User-selected detail composition | Approved | Movie/TV detail |
| VIS-PLAYER-01 | 2026-11-24 | Near-black theater with glass controls; desktop episode side drawer and mobile bottom sheet | User-selected responsive player composition; capabilities remain provider-gated | Approved | Watch page |
| VIS-SEARCH-01 | 2026-11-24 | Frosted discovery search overlay with trending titles, keyboard hints and route shortcuts | Extends prior approved overlay plus `/search` results route | Approved | Search |
| VIS-COMMUNITY-01 | 2026-11-24 | Dedicated Community tab for distribution and reviews; retain concise rating summary beside title metadata | User selected tab; preserves earlier approved metadata summary | Approved | Title detail |
| VIS-PROFILE-01 | 2026-11-24 | Private library-first profile with explicit per-item sharing | User-selected privacy-first layout | Approved | Profile/diary |
| VIS-LIGHT-01 | 2026-11-24 | Frosted pearl light-theme glass with dark text and accessible controls | User-selected material direction | Approved | Light theme |

| REF-01 | 2026-11-24 | Treat cno.to as a competitive IA reference; retain Sinegang brand, approved visuals, privacy and playback boundaries; label claims and evidence by confidence | Owner-provided audit and existing V6 decisions | Approved as supplementary scope; home hierarchy resolved by REF-02/REF-03 | Reference audit and feature documentation |
| REF-02 | 2026-11-24 | Keep the cinematic motion landing and add live discovery rails beneath it | Owner approved the recommended hybrid; preserves the approved hero while reducing discovery steps | Approved | Landing, discovery |
| REF-03 | 2026-11-24 | Prioritize guest discovery/home for the next implementation slice | Owner selected the recommended prototype priority | Approved | Landing, discovery |
| PLAY-06 | 2026-11-25 | If BingeAPI cannot confirm playback, show a clear unavailable message only; no external watch links | User selected the simplest honest fallback | Approved | Watch page, provider status |
| PLAY-07 | 2026-11-25 | Select real BingeAPI playback in the production Wrangler config; report playback pending until the player emits `play`; no mock provider | Owner explicitly requested production playback testing and no more mocks | Approved; public browser playback remains unverified and no deployment was made | Playback configuration, watch page |
