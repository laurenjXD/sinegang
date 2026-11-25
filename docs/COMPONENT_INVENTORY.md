# Component Inventory

Legend: **Built** exists in code; **Partial** has a starter implementation or mock data; **Planned** is absent or required behavior is not wired.

| Component family | Component | Status | Current location / notes |
|---|---|---|---|
| Glass | GlassSurface, GlassButton, GlassModal, GlassNavigation | Built | `src/components/GlassSurface.tsx`, `GlassComponents.tsx`; opaque fallback and restrained blur |
| Navigation | Desktop floating nav, mobile bottom nav | Built | `src/main.tsx`; account menu and selected-route polish planned |
| Hero | TMDB featured title, manual selector, background artwork | Partial | `Landing` in `src/main.tsx`; live trending data, up to three selectors, `LandingDiscovery` reusing TMDB shelves; no final visual QA |
| Motion | MotionConfig, scroll-linked hero offset, reveal section | Partial | `src/main.tsx`; reduced-motion setting used; timing and visual QA pending |
| Catalog | Discovery shelf, shelf group, poster, media filter | Partial | `DiscoveryPreview.tsx`; real TMDB shelves plus truthful unavailable states |
| Catalog | RankedCard / rank indicator, genre filters, pagination | Planned | No ranking display contract, route filters, or pagination UI yet |
| Search | SearchOverlay, SearchResults | Built | `src/main.tsx`, `SearchResults.tsx`; browser focus restoration needs QA |
| Details | TitleDetail, CommunityScoreSummary | Partial | `TitleDetail.tsx`, `CommunityPreview.tsx`; metadata and playback route, incomplete credits/related data |
| TV | SeasonSelector, episode number input | Partial | `TitleDetail.tsx`; no episode catalog/list |
| People | PersonProfile, credit filters, filmography | Planned | Needs validated TMDB person and credits service routes |
| Ratings | PersonalRatingPreview, histogram, community empty state | Preview | `CommunityPreview.tsx`; no persistent current user or live public aggregate data |
| Reviews | ReviewCard, spoiler reveal, sort, report flow | Planned | Public API intentionally disabled pending moderation/privacy work |
| Library | WatchlistGrid, diary, favorites, history | Planned | No account routes or persisted library UI |
| Playback | WatchPreview, episode drawer, BingeAPI bridge | Partial | `src/features/playback/`; playback events checked, actual rendering unknown; production config selects BingeAPI but is not deployed |
| Feedback | Loading/error/empty messages | Partial | Implemented per relevant catalog/search/detail states; reusable skeleton/toast components not established |
| Overlay | Search dialog | Built | Accessible native dialog wrapper; inspect keyboard/focus behavior in browser |
