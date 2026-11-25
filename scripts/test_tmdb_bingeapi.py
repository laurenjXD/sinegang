#!/usr/bin/env python3
"""Exercise live Sinegang TMDB endpoints through BingeAPI's documented embeds.

Uses one title per TMDB title shelf plus one search result. Genre endpoints are
checked and reported as taxonomy-only because they do not return media IDs.
This checks title routing/page identity, not whether a playable stream exists.
"""

import argparse
import json
import sys
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


SHELVES = [
    ("popular movies", "movies-popular", "movie"),
    ("popular TV", "tv-popular", "tv"),
    ("weekly trending", "trending", None),
    ("theatrical", "theatrical", "movie"),
    ("top-rated movies", "movies-acclaimed", "movie"),
    ("top-rated TV", "tv-acclaimed", "tv"),
    ("upcoming movies", "coming-soon", "movie"),
    ("movie genres", "movie-genres", None),
    ("TV genres", "tv-genres", None),
]
BINGE_ORIGIN = "https://bingeapi.st"


class PageTitle(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.value = ""

    def handle_starttag(self, tag, attrs):
        self.in_title = tag.lower() == "title"

    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.value += data


def read_response(url, method="GET", body=None, json_body=False, timeout=15, headers=None):
    request_headers = {"Accept": "application/json", "User-Agent": "Sinegang-TMDB-Binge-integration-check/1.0"}
    request_headers.update(headers or {})
    if json_body:
        request_headers["Content-Type"] = "application/json"
        body = json.dumps(body).encode("utf-8")
    request = Request(url, data=body, headers=request_headers, method=method)
    with urlopen(request, timeout=timeout) as response:
        data = response.read(1_000_000)
        return response.status, response.geturl(), response.headers.get("Content-Type", ""), data


def fetch_json(origin, path):
    status, _, _, body = read_response(f"{origin}{path}")
    return status, json.loads(body)


def guess_kind(item, shelf_kind=None):
    kind = item.get("media_type")
    if kind in ("movie", "tv"):
        return kind
    if shelf_kind in ("movie", "tv"):
        return shelf_kind
    if item.get("title"):
        return "movie"
    if item.get("name"):
        return "tv"
    return None


def normalize_title(value):
    return "".join(character.casefold() for character in value if character.isalnum())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="http://localhost:5173", help="local Sinegang dev origin")
    parser.add_argument("--search", default="Inception", help="query used to sample the search endpoint")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")

    candidates = {}
    for label, shelf, shelf_kind in SHELVES:
        status, payload = fetch_json(origin, f"/api/discover/{shelf}")
        data = payload.get("data", {})
        items = data.get("results")
        if not isinstance(items, list):
            print(f"TMDB {label}: HTTP {status}; taxonomy endpoint, no media IDs to send to BingeAPI")
            continue
        selected = next((item for item in items if guess_kind(item, shelf_kind) in ("movie", "tv")), None)
        if not selected:
            print(f"TMDB {label}: HTTP {status}; no media title in results")
            continue
        kind = guess_kind(selected, shelf_kind)
        key = (kind, selected["id"])
        candidates.setdefault(key, {"kind": kind, "id": selected["id"], "sources": [], "label": selected.get("title") or selected.get("name") or str(selected["id"])})
        candidates[key]["sources"].append(label)
        print(f"TMDB {label}: HTTP {status}; sampled {kind} {selected['id']} · {candidates[key]['label']}")

    search_status, search_payload = fetch_json(origin, f"/api/search?{urlencode({'q': args.search})}")
    search_items = search_payload.get("data", {}).get("results", [])
    search_item = next((item for item in search_items if guess_kind(item) in ("movie", "tv")), None)
    if search_item:
        kind = guess_kind(search_item)
        key = (kind, search_item["id"])
        candidates.setdefault(key, {"kind": kind, "id": search_item["id"], "sources": [], "label": search_item.get("title") or search_item.get("name") or str(search_item["id"])})
        candidates[key]["sources"].append(f"search: {args.search}")
        print(f"TMDB search: HTTP {search_status}; sampled {kind} {search_item['id']} · {candidates[key]['label']}")
    else:
        print(f"TMDB search: HTTP {search_status}; no media result for {args.search!r}")

    checks = []
    for candidate in candidates.values():
        kind, tmdb_id = candidate["kind"], candidate["id"]
        _, detail_payload = fetch_json(origin, f"/api/title/{kind}/{tmdb_id}")
        detail = detail_payload["data"]
        title = detail["title"]
        episode = None
        if kind == "tv":
            seasons = [season for season in detail.get("seasons", []) if season["number"] > 0 and season["episodeCount"] > 0]
            if not seasons:
                checks.append({**candidate, "title": title, "result": "no numbered TMDB season"})
                continue
            selected_season = next((season for season in seasons if season["number"] == 1), seasons[0])
            episode = {"season": selected_season["number"], "episode": 1}

        media = {"kind": kind, "tmdbId": tmdb_id, **(episode or {})}
        _, _, _, resolve_payload = read_response(
            f"{origin}/api/playback/resolve",
            method="POST",
            body=media,
            json_body=True,
        )
        resolution = json.loads(resolve_payload)["data"]
        embed_url = resolution["embedUrl"]
        if not embed_url.startswith(BINGE_ORIGIN + "/embed/"):
            checks.append({**candidate, "title": title, "result": "rejected embed origin", "url": embed_url})
            continue
        try:
            status, final_url, _, body = read_response(embed_url, headers={"Accept": "text/html"})
            parsed = PageTitle()
            parsed.feed(body.decode("utf-8", "replace"))
            page_title = parsed.value.strip()
            page_name = page_title.split(" · BingeAPI", 1)[0]
            matched = normalize_title(page_name) == normalize_title(title)
            result = "title page matched" if matched and status == 200 else "page/title mismatch"
            checks.append({
                **candidate,
                "title": title,
                "result": result,
                "http_status": status,
                "binge_page_title": page_title,
                "effective_url": final_url,
                "watch_route": f"{kind}/{tmdb_id}" if kind == "movie" else f"{kind}/{tmdb_id}/{episode['season']}/{episode['episode']}",
            })
        except (HTTPError, URLError, TimeoutError) as error:
            checks.append({**candidate, "title": title, "result": f"embed request failed: {type(error).__name__}"})

    print("\nTMDB → BingeAPI results")
    for item in checks:
        print(f"{item['result']}: {item['title']} ({item['kind']} {item['id']}) · sources: {', '.join(item['sources'])}" + (f" · page: {item.get('binge_page_title')}" if item.get('binge_page_title') else ''))
    matched = sum(item["result"] == "title page matched" for item in checks)
    failed = len(checks) - matched
    print(f"SUMMARY: {matched}/{len(checks)} player title pages matched; {failed} unmatched")
    print("A matching page confirms TMDB-to-player title routing only, not that a playable video source exists.")
    return 1 if failed else 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (HTTPError, URLError, TimeoutError, KeyError, ValueError) as error:
        print(f"Integration check failed: {type(error).__name__}: {error}", file=sys.stderr)
        sys.exit(1)
