# Sinegang — Design System

Version 6.0 | Cinematic dark interface | Companion to AGENTS.md

## 1. Design intent
Create a premium editorial streaming experience: artwork-first, quiet navigation, strong typography and predictable controls. Use the approved layered glass material system for selected interface surfaces, with clear hierarchy and restrained placement. Avoid visual noise and generic dashboard layouts. Use original branding rather than copying another service's identity.

## 2. Color tokens
Pitch Black (#050505) dominates; Arctic Blue (#7DD3FC) supports navigation, focus and ambient lighting; Ember Orange (#FF6B35) marks primary actions and the wordmark period. Approximate visual balance: 80/15/5, excluding artwork. System preference by default; support accessible light and dark variants; no pastel or purple brand theme. Use status labels/icons in addition to color.
| Token | Hex | Usage |
|---|---|---|
| background | #050505 | Page canvas |
| surface | #101216 | Cards, menus, panels |
| surface-raised | #1C2128 | Hover and elevated surfaces |
| border | #303640 | Decorative separators |
| control-border | #747989 | Visible input boundaries |
| primary | #FF6B35 | Primary filled actions |
| primary-hover | #FF8357 | Primary hover |
| accent-text | #7DD3FC | Links and accent labels |
| foreground | #F5F7FA | Primary text |
| muted | #A1A1AA | Secondary text |
| success | #65D6A0 | Success indicators |
| warning | #F4C66A | Warnings |
| danger | #FF858C | Errors |
| focus | #7DD3FC | Keyboard focus |

Use Pitch Black (#050505) on primary buttons; verify actual rendered contrast for all states. Never communicate status by color alone. Apply dark scrims behind text over artwork.

```css
:root {
  color-scheme: dark;
  --background: #050505;
  --foreground: #F5F7FA;
  --card: #101216;
  --muted: #1C2128;
  --muted-foreground: #A1A1AA;
  --primary: #FF6B35;
  --primary-foreground: #050505;
  --border: #303640;
  --ring: #7DD3FC;
  --accent: #7DD3FC;
  --accent-foreground: #050505;
  --control-border: #747989;
  --primary-hover: #FF8357;
  --radius: 0.625rem;
}
```
Map semantic variables into the installed Tailwind version and shadcn theme. Do not scatter raw colors throughout components.

## 3. Typography
Use Geist for UI and Space Grotesk for display headings. Use system sans-serif fallback. Body defaults to 16px, 1.5 line height.
| Style | Size / line height | Weight |
|---|---|---|
| Hero | 36–64px / 1.08 | 700 |
| Page heading | 28–40px / 1.15 | 650–700 |
| Section heading | 20–24px / 1.3 | 600 |
| Card title | 14–16px / 1.4 | 600 |
| Body | 16px / 1.5 | 400 |
| Metadata | 13–14px / 1.45 | 400–500 |
| Caption | 12px / 1.4 | 400 |

Use sentence case, short labels and tabular numbers for playback time. Clamp titles to two lines in cards but expose full titles accessibly.

## 4. Layout and spacing
Use a 4px base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80. Content max width 1600px; hero may extend edge to edge. Desktop header 72px; mobile header 56px; mobile bottom navigation 64px plus safe-area inset.
| Viewport | Gutter | Poster grid | Gap |
|---|---:|---:|---:|
| 320–639px | 16px | 2 columns | 12px |
| 640–1023px | 24px | 3–4 columns | 16px |
| 1024–1439px | 40px | 5–6 columns | 20px |
| 1440px+ | 56px | 6–8 columns | 24px |
Use CSS grid with minimum card widths and adapt to actual available space. Rails may scroll horizontally; the page itself must not overflow. Reserve image aspect ratios before loading.

## 5. Component library
| Component | Specification | States |
|---|---|---|
| Button | 44px minimum height, 10px radius, icon 20px | Default, hover, focus, pressed, disabled, loading |
| IconButton | 44x44px touch target, accessible name | Same as button |
| PosterCard | 2:3 artwork, 10px radius, title and year below | Loading, hover, focus, saved, unavailable |
| LandscapeCard | 16:9 artwork, title, optional progress | Loading, focus, in progress |
| MediaRail | Heading, optional View all, scroll controls | Loading, empty, error |
| HeroBanner | Full-bleed backdrop, gradient scrim, title, synopsis, actions | Loading, fallback, selected slide |
| SearchInput | 48px height, search icon, clear button | Idle, typing, loading, results, empty |
| FilterChip | 36–44px height, selected indicator | Default, selected, disabled |
| EpisodeCard | 16:9 thumbnail, episode number, synopsis, duration | Unwatched, partial, watched, unavailable |
| Dialog | 480–640px max width, focus trap, Escape | Open, closing, validation error |
| Toast | Brief status, optional undo, live announcement | Success, error, information |
| Skeleton | Match final geometry, muted animation | Reduced-motion static variant |
| EmptyState | Clear explanation and relevant action | Empty library, no search results |
| PlayerShell | 16:9 region, accessible controls where supported | Loading, playing, paused, unavailable, error |

Primary actions use Ember Orange fill; secondary actions use neutral surface or outline; destructive actions use explicit labels and confirmation when irreversible. Icons use Lucide, 20px standard, 24px navigation, 16px inline. Never use icon-only controls without accessible names.

## 6. Screen blueprints
### Homepage
Desktop: header → cinematic hero (approximately 480–640px tall) → continue watching when applicable → trending → popular movies → popular TV → genre collections → footer. Mobile: compact header, stacked hero copy, horizontally scrollable rails, bottom navigation. Hero copy max width 560px; keep important artwork visible. No automatic carousel rotation unless pause controls are provided.

### Discovery and search
Page heading and filters above responsive poster grid. Desktop uses inline filter controls; mobile uses a filter sheet with Apply and Clear. Search suggestions are keyboard navigable, with debounced requests and stale-result protection. Display result count only when available. Preserve filters in URL.

### Movie details
Backdrop with scrim; poster and metadata; title, year, runtime, rating, age classification; primary Watch action only if authorized; secondary My List; synopsis; cast; trailer; similar titles. Mobile stacks content and keeps actions visible without obscuring text.

### TV details
Reuse movie details layout. Add season selector, episode list and progress indicators. Clearly label unreleased or unavailable episodes. Never imply a title is playable merely because metadata exists.

### Watch page
Near-black canvas, back link, title, player region, episode navigation for TV, playback report action. Use provider-supported controls only. Show official viewing options when unavailable. No deceptive play buttons, popups or autoplay audio. Provide a mock-player state for development.

### Personal library and settings
Continue Watching, Watchlist and History use consistent cards. Provide remove and clear-history actions, confirmation for bulk deletion, privacy preferences, age-appropriate settings and account deletion. Keep forms single-column on mobile.

## 7. Motion and interaction — Framer Motion / Motion for React
Use the `motion` package and imports from `motion/react` (do not install a second animation library). Use LazyMotion with domAnimation where supported; isolate richer layout animations in their own components. Centralize variants and tokens in `lib/motion.ts`.

| Motion token | Duration | Use |
|---|---:|---|
| instant | 0.12s | Button feedback |
| quick | 0.18s | Hover, focus-adjacent feedback |
| standard | 0.28s | Menus and panels |
| cinematic | 0.65s | Editorial section reveal |
| hero | 0.9s | Initial artwork and headline entrance |

Use ease-out [0.22, 1, 0.36, 1] for entrances; ease-in [0.4, 0, 1, 1] for exits. Use springs (stiffness 260, damping 28, mass 0.8) for tactile controls. Stagger headline lines by 80ms and poster groups by 45ms, capped at 300ms total delay. Never delay interaction until animation completes.

- Hero: artwork fades from opacity .75 to 1 and scale 1.035 to 1; headline lines reveal from y:24 to 0 inside clipped wrappers; CTA follows. Render meaningful content immediately, with optional prerendering and no initial invisible LCP text.
- Scroll: use useScroll/useTransform for bounded artwork parallax (maximum 32px); use whileInView with once:true for editorial sections. No scroll hijacking, pinned full-page sequences or forced horizontal scroll.
- Posters: hover scale 1.035, subtle elevation and metadata reveal; touch devices show actions without hover. Use layoutId for shared poster transitions within a persistent client layout only; otherwise use a simple fade.
- Navigation: floating minimal header transitions from transparent to solid after hero; active underline uses layoutId. Menus use AnimatePresence and preserve focus restoration.
- Routes: optional 180–240ms content entrance; never block TanStack Router navigation or assume exit animations work across unmounted route boundaries.
- Reduced motion: MotionConfig reducedMotion="user" plus useReducedMotion for custom scroll effects; disable parallax, scale, stagger and automatic motion. Keep controls and content fully visible.
- Performance: animate transform and opacity; avoid continuous blur, large animated shadows and per-frame React state. Pause offscreen animation; no autoplay audio or background video by default. Use optimized responsive images and static fallbacks.
- Keyboard: visible 2px focus ring, Escape closes dialogs, arrow keys for appropriate composite widgets, native links/buttons retain behavior.


## 8. Accessibility and content safety
Target WCAG 2.2 AA. Text contrast >= 4.5:1 for normal text and >= 3:1 for large text; meaningful controls and focus indicators must be distinguishable. Use 44px touch targets where practical, semantic landmarks, heading hierarchy, skip link, descriptive labels, alt text and live announcements for async status. Do not duplicate poster alt text when an adjacent accessible title already identifies the link. Support 200% zoom, keyboard-only navigation and reduced motion. Display age classifications and content advisories; use appropriate catalog filters. Captions and audio options depend on authorized player capabilities.

## 9. Artwork and performance
Posters 2:3, backdrops 16:9, episode thumbnails 16:9, avatars 1:1. Use responsive image sizes, lazy-load below fold, prioritize only the main hero, and supply neutral fallback artwork. Respect image licensing and attribution. Do not download or redistribute artwork beyond permitted use. Avoid layout shifts, large animation libraries and unnecessary client hydration.

## 10. Component documentation and QA
Maintain a development-only component gallery with every component variant and state. Test at 320, 375, 768, 1024, 1440 and 1920px. Include long titles, missing images, empty lists, slow networks, provider errors, keyboard navigation, zoom and reduced motion. Verify no horizontal page overflow, clipping, inaccessible controls or contrast failures. Review screenshots for consistent spacing, typography and artwork proportions. Changes to tokens require updating this document and regression checks.

## 11. Definition of design done
A screen is complete when it follows semantic tokens, matches its blueprint, handles loading/empty/error/success states, works on mobile and desktop, supports keyboard navigation, and accurately represents content availability. Do not add unsupported player controls or placeholder functionality disguised as working features.

## 12. Public landing page — cinematic editorial experience
Separate `/` (public marketing/discovery landing) from `/browse` (catalog experience). Guests can explore without registering. Signed-in users retain access to both. Do not redirect before content is visible.

| Section | Layout and content | Motion choreography |
|---|---|---|
| Navigation | Desktop floating glass pill; mobile compact bottom bar plus a small brand header; search remains one tap away | 180ms background transition; active underline |
| Hero | 85–100svh desktop, one featured title, left-aligned headline, supporting copy, Explore now and View featured title | Scroll-revealed editorial content, accessible manual title selection and static reduced-motion fallback |
| Trending | Editorial heading and horizontal rail of real catalog posters | 45ms stagger, tactile hover; native swipe |
| Featured spotlight | Full-width 16:9 backdrop with title, synopsis and details CTA | Bounded parallax and one-time reveal |
| Explore genres | Asymmetric editorial grid of genre tiles | Gentle stagger; no hover dependency |
| Personal library | Two-column product preview and copy about watchlists and resume | One-time reveal, static on reduced motion |
| Closing CTA | Oversized typography, restrained Arctic Blue ambient glow, Start exploring | Subtle entrance, no looping effects |
| Footer | Navigation, privacy, terms, attribution, accessibility | Static |

Use a 1440px content max width, 64px desktop gutters, 32px tablet, 16–20px mobile. Hero type clamp(3rem, 7vw, 7rem), line-height .95–1.05; body 16–18px. Keep headline width around 12–16 characters per line on desktop where practical. On mobile stack content over a bottom scrim, use 55–75svh hero as content permits, and avoid clipped CTAs. Use real licensed/authorized artwork and TMDB attribution as required; no invented ratings or availability. The hero CTA leads to browse, not unverified playback.

### Component inventory
LandingShell, CinematicHero, RevealText, MotionSection, PosterRail, MotionPosterCard, FeaturedSpotlight, GenreGrid, LibraryPreview, ClosingCTA, SiteFooter, MotionProvider, GlassSurface, GlassNavigation, GlassButton, GlassModal, GlassDrawer, GlassSearch, GlassDropdown, GlassTabs, GlassTooltip, GlassRatingPanel, GlassPlayerControls and GlassSheet. Fetch metadata through Hono and TanStack Query; isolate motion-heavy components and lazy-load noncritical routes. Use skeletons with matching dimensions. Apply glass to navigation, overlays, floating controls, selected metadata panels and dialogs, not indiscriminately to all cards or sections.

### Acceptance gates
At 375, 768 and 1440px: hero copy and CTA visible, no horizontal page overflow, rails keyboard/touch accessible, no layout shift from motion, navigation works during animations, reduced-motion mode has no decorative movement, slow network preserves readable hero and fallback artwork. Target LCP <=2.5s, CLS <=0.1, INP <=200ms; record actual measured results rather than claiming compliance. Verify landing and browse routes with Playwright and capture desktop/mobile screenshots.

## 13. Brand identity
Use Sinegang as the brand name and lowercase `sinegang.` as the wordmark, with the period in Ember Orange. Tagline: Good stories. Good company. Use English-first copy, witty but restrained. No food illustrations, vintage Filipino textures, forced Taglish, or warm retro palette. Use the Pitch Black, Arctic Blue and Ember Orange cinematic palette and Geist / Space Grotesk typography.

## 14. V5 cinematic motion direction
Use a brief, optional first-view wordmark reveal that never blocks content. Pair restrained Arctic Blue ambient lighting with Ember Orange action feedback. Use masked headline reveals, bounded parallax, spring poster motion, fade-through-black route transitions and a quiet black viewing surface. Loading indicators may use a short blue/orange sweep; disable decorative movement under reduced motion. No excessive neon or persistent glow.


## V6 approved creative direction
IMPLEMENTATION_PLAYBOOK.md governs the approved UI/UX decisions and clarification workflow. Use minimal Apple-style storytelling (original design), scroll-driven hero, floating minimal navigation, immersive experimental motion, shared layout movie-card transitions, hybrid rails/grid, oversized expressive typography, and system-preference light/dark themes. These supersede conflicting earlier visual defaults. Preserve brand palette and architecture. Do not ask the user to reconfirm these choices.

## Community UI addendum
Movie and TV detail pages show Sinegang and TMDB ratings as distinct labeled measures. Use Arctic Blue for rating stars and distribution bars, Ember Orange for the primary submission action. Provide an accessible half-star selector with keyboard and touch targets. Display count and a meaningful insufficient-ratings state. Published reviews use pseudonymous names, explicit spoiler disclosure, date/rating sorting and responsive editorial layouts inside a dedicated Community tab; preserve the concise community rating summary beside title metadata. Personal ratings, reviews and diaries are private until explicitly shared; sharing controls must clearly state visibility and support withdrawal. Do not copy Letterboxd layouts.

## Approved glass and discovery addendum
The approved glassmorphism requirement supersedes earlier restrictions on glass effects. Use restrained glass by default, stronger blur only in overlays; the light theme uses frosted pearl. Build a reusable material scale with multiple translucency, blur, border-opacity and elevation levels. Dark mode uses smoked glass; light mode uses frosted pearl. Adapt material tint to the active theme and keep artwork legible. Provide opaque semantic surface fallbacks when `backdrop-filter` is unavailable or reduced transparency is preferred. Glass is reserved for navigation, overlays, floating controls, metadata panels, dialogs, and selected interactive components; do not place blur on every poster or page section. Verify foreground contrast over variable artwork and retain solid scrims behind text where needed.

Required component primitives: GlassSurface, GlassNavigation, GlassButton, GlassModal, GlassDrawer, GlassSearch, GlassDropdown, GlassTabs, GlassTooltip, GlassRatingPanel, GlassPlayerControls and GlassSheet. Motion may animate opacity and transforms for these surfaces; do not animate large blur filters or run nested full-screen backdrop filters.

The discovery experience includes a featured cinematic hero; Top 10 movies; Top 10 television series; trending titles; community favorites; new theatrical releases; popular TV; critically acclaimed titles; coming soon; genre collections; continue watching; personalized recommendations only when data is sufficient; highest-rated Sinegang titles; and recent community activity based only on eligible privacy-safe data. Label TMDB popularity and ratings separately from Sinegang community ratings. Never fabricate rankings, ratings, engagement counts or activity. Use explicit unavailable/insufficient-data states when a source or sample is missing.

Playback should support theater mode and season/episode navigation, and provide progress synchronization, subtitles and controls only where the verified provider supports them. Keep provider boundaries intact. Profile features may include private film diaries and personal collections; discovery and authorized playback remain guest-first, while rating submission and private account features require authentication. Maintain private-by-default journals and age-appropriate privacy and moderation safeguards.

Before final screen composition, resolve the ten visual questions recorded in `docs/OPEN_QUESTIONS.md`. Use alternatives and prototypes for consequential choices; do not reopen approved brand, cinematic motion, typography, theme support, community privacy or playback constraints.


## Supplementary reference-audit visual contract
Use cno.to as a category-level hierarchy reference only. Retain Sinegang's approved palette, Geist/Space Grotesk, restrained smoked/frosted glass, single-title cinematic hero, desktop floating pill/mobile bottom dock, artwork-led title pages, dedicated Community tab, and reduced-motion behavior. Adapt discovery rails, ranked cards, metadata, cast/crew, person and episode screens in Sinegang's own compositions. Do not copy logos, exact layouts, wording, artwork, or unverified styling. See `docs/REFERENCE_AUDIT.md`, `docs/MOTION_SPECIFICATIONS.md`, and `docs/RESPONSIVE_SPECIFICATIONS.md`; reference-site CSS values and motion timings are not established.
