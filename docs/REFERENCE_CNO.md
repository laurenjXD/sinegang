# cno.to reference study

Observed in the live desktop site on 2026-11-24. This is a design and interaction reference. Sinegang must use its own brand, content rights, copy, artwork permissions and implementation.

| Surface | Observed pattern | Sinegang implication |
|---|---|---|
| Home | Dark full-bleed featured title with title art, metadata, synopsis and primary action; compact top navigation | Consider a browse-first home if VIS-01 is approved. Playback actions remain rights-gated. |
| Featured area | Rotating title tabs, previous/next controls and a visible active indicator | Use a pauseable, keyboard-accessible featured selector; no automatic rotation without controls. |
| Discovery | Ranked Top 10 movie/TV rails, popularity and genre rails, large poster cards | Use hybrid rails and editorial grids already approved for Sinegang; ranking source must be labeled and valid. |
| Search | Header search opens a centered command-style overlay with trending results, route shortcuts and keyboard hints | Aligns with approved Sinegang overlay plus full results page; implement focus trap and restoration. |
| Detail | Full-bleed backdrop, title art, metadata/actions, cast, extras, recommendations, topics, official viewing links and reviews | Use clear hierarchy; Sinegang community ratings stay separate from TMDB. Do not show Play unless rights confirmed. |
| Interaction | Shared-looking backdrop continuity and quick transitions between featured and detail screens | Test route transitions and reduced motion. |

Reference-specific logo, wordmark, artwork layout, title art, copy and exact styling are not reusable project assets. The site's Play and Download actions do not establish content rights for Sinegang. Mobile behavior, authenticated flows, watch flow and performance were not inspected in this pass.

Pending decision: VIS-01 (replace editorial landing, keep it and adapt browse, or hybrid) and VIS-02 (prototype priority). Do not finalize the new home composition until the owner answers.


## Supplementary owner-provided audit
A further owner-provided cno.to audit expands reported discovery, detail, person-profile, and season/episode structure. Its own text distinguishes some reported features from unverified visual and behavioral details. See `docs/REFERENCE_AUDIT.md` for evidence limits and `docs/FEATURE_MATRIX.md` for Sinegang gaps. VIS-01 and VIS-02 remain unresolved; previous V6 visual approvals are preserved.
