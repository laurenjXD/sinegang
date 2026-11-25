# Sinegang — Implementation Playbook
Version 6.0 | Approved creative direction and collaborative delivery protocol

## 1. Authority and approved decisions
Read PRD.md, AGENTS.md, DESIGN_SYSTEM.md and ARCHITECTURE.md first. This playbook governs collaboration and supersedes earlier conflicting creative preferences. Security, accessibility, content rights and verified technical contracts remain mandatory. Do not reopen approved choices unless a material conflict is demonstrated.

| Decision | Approved direction |
|---|---|
| Landing | Minimal Apple-style storytelling; original composition, not a copy |
| Hero | Scroll-driven storytelling |
| Navigation | Floating minimal navigation |
| Motion | Highly immersive and experimental |
| Movie cards | Shared layout transitions |
| Catalog | Hybrid rails and grid |
| Typography | Oversized and expressive; Geist + Space Grotesk |
| Theme | System preference, with accessible light/dark variants |
| Brand | Sinegang; Good stories. Good company. |
| Palette | Pitch Black #050505, Arctic Blue #7DD3FC, Ember Orange #FF6B35 |

## 2. Decision autonomy and clarification
- Independent: reversible engineering choices, naming, spacing within tokens, implementation details and test fixtures. Record meaningful assumptions; do not interrupt.
- Recommend and ask: unresolved visual composition, navigation contents, search interaction, mobile layout, card behavior, onboarding and other choices affecting the experience. Offer two or three materially different options, recommendation, rationale, trade-offs and a visual prototype where useful.
- Explicit approval: changing approved branding, scope, architecture, security boundaries, paid services, public deployment or activating a provider. Provider approval never substitutes for documented content rights and security verification.
- Ask one focused batch per milestone, only about unresolved consequential choices. Continue independent work while waiting; do not commit blocked decisions. Do not interpret silence as approval. If no material uncertainty remains, proceed to prototype.

Question format: decision ID; affected screen; question; why it matters; options A/B/C; recommended default; accessibility/performance implications; whether blocking. The hero composition is resolved as one featured title with scroll-revealed editorial content and manual title selection; this supersedes the earlier three-chapter count while preserving scroll-driven storytelling.

## 3. First discovery session
Audit the workspace and existing docs; identify contradictions and missing assets. Present only unanswered questions from this backlog, grouped by dependency:

| Area | Unresolved questions |
|---|---|
| Landing | Hero story, headline, artwork selection, chapter count, CTA destination, closing section |
| Floating navigation | Desktop width, mobile placement, search access, authenticated actions, scroll visibility |
| Motion | Specific choreography, duration, mobile fallback, transition interruption |
| Catalog | Rail ordering, grid breakpoints, genre filters, pagination, featured collections |
| Details | Information hierarchy, cast, season/episode selector, back navigation |
| Search | Overlay vs dedicated page, keyboard shortcuts, suggestion grouping |
| Library | Watchlist sorting, history controls, progress display and empty states |
| Account | Sign-in layout, onboarding, preferences and privacy controls |
| Watch | Theater layout, episode navigation, captions availability and mock/error states |
| Theme | Whether to expose a manual override in addition to system default; light surface treatment |

Do not ask again whether the user wants Apple-style storytelling, scroll hero, floating nav, immersive motion, shared transitions, hybrid catalog, expressive typography or system preference.

## 4. Creative exploration and prototype
Present two or three compositions within the approved direction, not competing brand identities, for any still-open composition. The user has approved restrained glass, a desktop floating pill/mobile bottom bar, one featured-title hero, consistent 2:3 posters with landscape features, artwork-led detail, theater with responsive episode drawer, frosted search, dedicated Community tab, private library-first profile, and frosted pearl light mode. Explain responsive behavior, motion, accessibility and asset requirements for any remaining consequential choice.

Build a local working prototype using mock data. Deliver landing, floating navigation, theme tokens, component gallery and a sample detail transition. Keep backend integration independent of visual review. Show screenshots at 375, 768 and 1440px, plus a short motion recording if tools permit. If browser tools are unavailable, state what could not be inspected; do not fabricate evidence.

## 5. Screen implementation instructions
| Screen | Implementation and acceptance |
|---|---|
| Landing | Clear headline and CTA immediately; one featured title anchors scroll-revealed editorial content; manual title selection; no forced scroll or hidden essential content; final CTA links to discovery |
| Navigation | Desktop floating glass pill; compact brand header and safe-area mobile bottom bar; accessible search/account actions and focus restoration; never obscure focused content |
| Browse | Editorial feature plus horizontal rails and responsive grid; rails usable by touch, mouse and keyboard; preserve scroll on return |
| Details | Shared poster-to-detail artwork transition where supported; stable route and back behavior; metadata, synopsis and availability clearly separated |
| TV | Season selection and episode list with clear selected state; handle unavailable episodes and long titles |
| Search | Debounced query, loading/empty/error states, keyboard access and cancel stale requests |
| Library | Responsive grid/list, clear empty state, accessible remove action, progress only from valid events |
| Auth | Accessible labels, validation, password manager compatibility, safe redirects and session expiry handling |
| Watch | Distraction-free near-black player area; mock or authorized playback only; truthful controls, loading and unavailable states |
| Settings | System theme default; if approved, persistent manual override and reset to system; privacy and history controls |

## 6. Motion engineering
Use motion/react as the primary engine. Create reusable RevealText, ScrollChapter, FloatingNav, MotionPosterCard and SharedMediaTransition primitives. Prefer transform and opacity; bound parallax and avoid layout thrashing. Use scroll progress and transforms for visual choreography, not scroll hijacking. Keep headline and CTA readable before animation loads. Use unique layout IDs per media item and route context; test direct navigation, rapid back/forward, interrupted transitions and missing artwork. Fall back to ordinary navigation if shared transitions cannot be preserved across route mounts. Lenis is optional; preserve native scrolling and disable smoothing for reduced motion. Reduced motion must remove decorative parallax, pinning and large transforms without hiding content. Avoid animating large blur filters or running offscreen loops. Test on mobile and low-power devices; measure rather than assume smoothness.

## 7. Theme and visual quality
System preference is the default, not dark-only. Resolve preference before first paint when practical, respond to OS changes, and use semantic CSS variables. Preserve the three brand colors in both modes; light mode uses neutral near-white surfaces and dark text, with darker blue/orange semantic variants where needed for contrast. The watch canvas may remain pitch black for viewing comfort. Check WCAG 2.2 AA contrast, focus visibility, 200% zoom, keyboard navigation and reduced motion. Use the newly approved reusable glass material system selectively, with opaque fallbacks and backdrop-aware contrast checks; do not animate blur or indiscriminately apply it to all cards and sections. Avoid generic dashboard cards and copying Apple layouts or assets.

## 8. Delivery gates
1. Discovery: workspace audit, traceability, unresolved questions and approved decisions recorded.
2. Foundation: strict TypeScript, Vite/Hono/Worker compatibility, design tokens, routing, mock data and tests.
3. Creative review: alternatives and working prototype; user approval of unresolved major visual choices.
4. Frontend: complete responsive screens and states; visual regression screenshots and accessibility checks.
5. Integration: TMDB metadata, Supabase Auth and RLS, personal library, mock/authorized playback; no video proxying.
6. QA: unit/integration/E2E tests, production build, Worker preview, security review, measured performance. Target LCP <=2.5s, CLS <=0.1, INP <=200ms; report conditions and actual results.
7. Release: explicit approval for public deployment and any paid resource; verify rights, secrets, environment separation, rollback and monitoring.

At each gate report completed requirements, changed files, test commands/results, screenshots if available, open blockers, and next actions. Do not claim completion from scaffolding alone. Keep approved components stable during refinement.

## 9. Living records
Create docs/DECISIONS.md (ID, date, decision, rationale, status, affected files), docs/OPEN_QUESTIONS.md (ID, owner, options, blocking status), docs/PROGRESS.md (requirement ID, implementation, tests, status), docs/CHANGELOG.md (changes and migration notes). Seed decisions with all eight approved choices above. Update records after each review. Never silently change approved requirements.

## 10. Start instruction
Read all five root documents, audit the repository, seed the living records, and present the first focused batch of unresolved questions with recommendations. Begin independent foundation tasks while awaiting major creative approvals. Do not deploy publicly or enable unverified playback.

## Community delivery addendum
Treat community ratings as core scope. Deliver personal half-star ratings first, then public aggregates from eligible shared ratings, then shared reviews. Public review release requires verified privacy, age rules, moderation, blocking, reporting and rate limits. Ask a focused batch about rating placement, sharing interaction and community discovery ranking. Preserve the approved cinematic direction and earlier requirements.


## Approved glass and expanded discovery scope
The owner has explicitly approved glassmorphism as a required direction; this supersedes earlier limitations in the V6 files. The approved material intensity is restrained with stronger blur reserved for overlays, and light surfaces use frosted pearl. The resolved responsive and screen compositions are recorded in `docs/DECISIONS.md`. Follow the token, placement, fallback, contrast, and performance rules in `DESIGN_SYSTEM.md`. Implement the shared glass primitives as reusable components. Preserve the approved brand and cinematic identity.

Discovery must provide real-data modules for a featured hero, Top 10 movies and TV, trending, community favorites, new theatrical releases, popular TV, critically acclaimed titles, coming soon, genres, continue watching, recommendations when data is sufficient, highest-rated Sinegang titles and privacy-safe community activity. Separate TMDB popularity/ratings from Sinegang community measures. Never invent metrics; design empty, insufficient-data and provider-error states. Playback supports theater mode, episode navigation, progress, subtitles and controls only when authorized provider capabilities confirm them. Guest-first discovery, optional registration, private-by-default diary/collections and community moderation requirements remain unchanged.

The ten glass and composition questions are resolved and recorded in `docs/DECISIONS.md`. Continue mock-data validation; cno.to reference priorities remain open as listed in `docs/OPEN_QUESTIONS.md`. Prototype alternatives where practical, then inspect rendered layouts at mobile, tablet and desktop widths, test backdrop contrast, keyboard flow, reduced motion and lower-powered-device performance, and capture evidence before calling the visual QA complete.

## Supplementary reference-audit workflow
For cno.to-inspired work, consult `docs/REFERENCE_AUDIT.md` and maintain the feature, component, screen, motion, and responsive specifications listed there. Distinguish directly observed behavior from owner-provided reports and recommendations. Do not claim source-code, CSS, mobile, animation, or rights verification without evidence. Preserve approved Sinegang decisions. Before making a consequential change to home-versus-browse hierarchy or choosing the next major prototype, present alternatives, trade-offs, and an original visual prototype when practical; obtain owner approval. Continue independent low-risk groundwork meanwhile.
