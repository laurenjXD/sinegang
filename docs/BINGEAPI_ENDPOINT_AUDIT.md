# BingeAPI documented endpoint audit

Checked 2026-11-24 from the Sinegang workspace using the public reference supplied by the owner. This tests documented HTTP routes and their documented server preference values; it does not crawl arbitrary paths or enumerate TMDB IDs.

## Summary

| Area | Requests | Results |
|---|---:|---|
| `servers=` preference matrix | 48 | All 12 published server numbers crossed with both documented routes and TMDB/IMDb reference IDs; all returned expected title HTML |
| Base GET routes | 4 | Movie and TV route templates with both TMDB and IMDb reference IDs return expected title HTML |
| Route methods | 4 | HEAD returns 200 on both templates; OPTIONS returns 404 HTML on both |
| Individual documented options | 34 | Each of 17 non-server options tested separately on movie and TV routes; responses return expected title HTML |
| Combined documented options | 2 | All 18 options, including all server IDs and reserved `example.com` subtitle URL, return expected title HTML; option behavior is not executed or semantically verified |
| Documented unsupported TV special | 1 | Season 0 returns 404, as the reference says specials are unavailable |
| Invalid movie ID | 1 | `/embed/movie/0` returns 200 with generic “BingeAPI Player” title; HTTP status alone does not validate the ID |
| Proposed rights endpoint | 1 | `GET /api/v1/rights/check?type=movie&id=27205&country=US` returns 404 JSON; this is not part of the public iframe reference |

Total: 95 HTTP requests. No redirects occurred in these shell HTTP checks. Requests were made sequentially with a 0.15-second delay. The repeatable test is `python3 scripts/test_bingeapi_endpoints.py --output docs/BINGEAPI_ENDPOINT_TEST_RESULTS.csv`; the full run on 2026-11-24 passed 95/95 expected status/title checks. The CSV lists every requested route, server, option, status, title, and interpretation.

## Documented server preference results

`servers=` is documented as a preference order: the requested server is tried first and the other servers follow. Each result below means only that the embed route returned its HTML shell with that preference. It does **not** show that the title is available on that server or that playback succeeds. That requires a real player event from an ordinary browser.

| Server | ID | Movie route | TV route |
|---|---:|---|---|
| Aldebaran | 81 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Sirius | 80 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Tarazed | 94 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Markab | 85 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Yildun | 87 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Vega | 86 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Mira | 93 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Wezen | 84 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Fomalhaut | 82 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Nashira | 88 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Botein | 92 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |
| Ogma | 91 | 200 · Inception page for TMDB and IMDb IDs | 200 · Breaking Bad page for TMDB and IMDb IDs |

## Route and method results

| Request | Result |
|---|---|
| `GET /embed/movie/27205` | 200 HTML, title `Inception · BingeAPI` |
| `HEAD /embed/movie/27205` | 200 HTML headers |
| `OPTIONS /embed/movie/27205` | 404 HTML, `Not Found · BingeAPI` |
| `GET /embed/tv/1396/1/1` | 200 HTML, title `Breaking Bad · BingeAPI` |
| `HEAD /embed/tv/1396/1/1` | 200 HTML headers |
| `OPTIONS /embed/tv/1396/1/1` | 404 HTML, `Not Found · BingeAPI` |
| `GET /embed/movie/tt1375666` | 200 HTML, title `Inception · BingeAPI` |
| `GET /embed/tv/tt0903747/1/1` | 200 HTML, title `Breaking Bad · BingeAPI` |
| `GET /embed/tv/1396/0/1` | 404 HTML, documented unsupported season 0 |
| `GET /embed/movie/0` | 200 HTML, generic title `BingeAPI Player` |
| `GET /api/v1/rights/check?type=movie&id=27205&country=US` | 404 JSON |

## What this establishes

The documented iframe routes accept the example TMDB and IMDb IDs and return the expected title-specific HTML shell. The query parser accepts a combined set of common documented options without returning an HTTP error. The published server preference values are accepted at the route level.

This audit does not establish that any video source exists, which server actually responds, whether a server preference succeeds, the complete title catalog, title/territory rights, or whether BingeAPI's postMessage events work. A previous Chromium check redirected the player URL to Google while shell HTTP returned the BingeAPI page; actual in-browser playback remains unverified.

The supplied reference documents two route templates only: `/embed/movie/{id}` and `/embed/tv/{id}/{season}/{episode}`. It does not document an endpoint to list the catalog or all server-title associations. The Sinegang diagnostic therefore remains limited to known, supplied title IDs and needs validated browser `serverchange` events for meaningful per-server results.
