# Motion Specifications

## Approved principles

- Motion for React (`motion/react`) is the single animation library.
- Keep the one-title cinematic hero, editorial reveals, and shared layout transitions where router/layout continuity supports them.
- Preserve content and navigation without animation. Respect `prefers-reduced-motion`; do not hijack scroll or autoplay sound.
- Bound parallax and blur; avoid large continuously animated layers and layout thrashing.

## Current implementation

`MotionConfig reducedMotion="user"` wraps the app. Landing hero uses a small scroll-linked vertical offset that is set to zero for reduced motion. Editorial content uses `whileInView`. Search dialog uses a short CSS entrance animation. Existing navigation and title routes do not yet use a shared layout transition.

## Proposed interaction contracts (not all implemented)

| Interaction | Motion behavior | Accessibility / failure behavior | Status |
|---|---|---|---|
| Landing entry | Keep headline and CTA visible on first paint; artwork may crossfade after data arrives | No hidden LCP content; reduced motion removes transition | Partial |
| Hero title selection | Crossfade title/copy/artwork with short bounded opacity transition | Buttons remain focusable; announce selected item; disable if unavailable | To implement/QA |
| Scroll story | Native scroll with restrained layered translation | No scroll lock; reduced motion removes parallax | Partial |
| Poster hover/focus | Small elevation/scale; actions also visible on touch | No hover-only information; keyboard focus equivalent | Partial |
| Card to detail | Shared layout only if IDs/routes are stable | Reduced-motion fallback to simple fade | Planned |
| Search overlay | Brief fade/translate; preserve native dialog focus behavior | Escape, close button, restore opener focus | Partial |
| Season selection | Content change with minimal crossfade | Standard select and live current episode label | Partial |
| Rating selection | Spring fill on selected half-star | Radio semantics and direct keyboard support; no required motion | Preview only |
| Theme change | Avoid long global transition; transition surfaces briefly | Theme applies without blocking input | Planned |

Exact duration/easing values remain implementation details until captured in rendered QA; do not claim reference-site timings.
