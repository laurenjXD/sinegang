# cno.to Reference Audit

## Scope and evidence

This is an evidence-limited product audit based on the owner-provided audit text, the existing reference notes in `docs/REFERENCE_CNO.md`, and prior recorded inspection notes. It is not a fresh source-code, CSS, private API, playback, or full responsive audit. Prior notes record a desktop observation of home, search, and a title detail, but this repository does not currently contain a screenshot set or measurements for those states. Properties below are labeled accordingly.

### Reported page structure

The supplied audit reports a content-first home organized around a featured title, daily movie and TV rankings, popular/liked titles, theatrical and upcoming releases, critically acclaimed titles, and genre collections. It reports title pages with metadata, synopsis, cast/crew, related titles, and a TV page with seasons, episode counts, dates, creators and cast. Person pages are reported to include biography, profession, known-for works, and role-filtered filmographies.

These are structural reports from the supplied audit, not independent verification of every behavior or claim. Published provider claims about account-free access, trailers, subtitles, and streaming are not adopted as Sinegang requirements without separate verification and authorization.

### Existing recorded desktop observations

`docs/REFERENCE_CNO.md` records a dark, full-bleed featured area, compact navigation, featured-title controls, ranked rails, genre collections, search overlay, backdrop-led details, and transitions as observed or noted in an earlier desktop inspection. It explicitly says mobile behavior, authenticated flows, watch flow, and performance were not inspected. No exact colors, typefaces, blur amounts, animation curves, or responsive measurements are asserted here.

### Adaptation principles

- Borrow information hierarchy and discovery speed, not branding, copy, source code, artwork composition, or protected assets.
- Preserve the approved Sinegang identity, guest-first access, TMDB metadata boundary, privacy rules, accessibility, and existing V6 visual choices.
- Keep TMDB and Sinegang community scores visibly distinct. Community collections use only eligible, explicitly shared data.
- TV episode and person-discovery scope must use TMDB data and validated IDs. Do not invent availability, credits, or rankings.
- Keep BingeAPI playback status pending until actual playback is confirmed. The production Wrangler config selects BingeAPI but has not been deployed; a reference site's playback controls do not establish Sinegang rights.

## Audit still required

Capture and inspect real reference and Sinegang screens at desktop, tablet, and mobile sizes: home, nav, search, movie detail, TV detail/episode selector, person page, menus, themes, scroll/transition behavior, focus states, and loading/error/empty states. Record viewport, browser, measured geometry, and whether each observation was directly seen. Do not infer proprietary implementation or provider authorization from page output.

## Current decisions and pending approvals

Already approved Sinegang direction remains: one featured title with scroll-revealed editorial content and manual selection; desktop floating pill/mobile bottom bar; restrained glass; full-bleed title artwork with compact metadata; Community tab; private-by-default library; system theme with manual override. The owner-provided audit does not supersede these approvals. The home-vs-browse hierarchy and next prototype priority remain open in `docs/OPEN_QUESTIONS.md`.
