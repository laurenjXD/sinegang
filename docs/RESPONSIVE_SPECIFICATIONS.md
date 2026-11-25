# Responsive Specifications

## Target layout bands

| Viewport width | Target behavior |
|---|---|
| 320–479px | Compact layout, mobile bottom navigation, touch-sized controls, single-column editorial sections, horizontal rails |
| 480–767px | Larger mobile, flexible two/three-column poster grids where space allows |
| 768–1023px | Tablet navigation and adaptive grids; preserve readable metadata widths |
| 1024–1439px | Desktop floating nav, editorial grid and horizontal rails |
| 1440–1919px | Wider artwork/canvas with controlled content max-width |
| 1920px+ | Keep readable line lengths and centered canvas; no unbounded poster growth |

These are Sinegang targets, not measured properties of cno.to.

## Required QA matrix

Inspect 320, 375, 480, 768, 1024, 1440 and 1920 CSS-pixel widths, portrait and landscape where relevant. Capture screenshots for landing, browse, search, movie detail, TV detail, and watch page. Verify horizontal overflow, safe areas, minimum 44px touch targets, text zoom/reflow, keyboard navigation, focus visibility, screen-reader labels, dark/light theme and reduced motion. Check backdrop contrast against text and opaque glass fallback. Exercise missing artwork, slow network, API error, empty results, long translated titles, and narrow episode drawer layouts.

## Current evidence

Previous progress notes record a desktop preview around 1168px and one no-overflow measurement. The current landing TMDB data and artwork change has not yet had a fresh screenshot pass. The full matrix above remains outstanding; CSS breakpoints alone are not proof of responsive behavior.
