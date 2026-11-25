#!/usr/bin/env python3
"""Live HTTP smoke test for BingeAPI's documented iframe routes.

This checks the HTML player endpoints and accepted server preferences. It does
not execute the player, verify playback, or enumerate titles from a catalog.
"""

import argparse
import csv
import io
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener


BASE_URL = "https://bingeapi.st"
SERVERS = [
    (81, "Aldebaran"),
    (80, "Sirius"),
    (94, "Tarazed"),
    (85, "Markab"),
    (87, "Yildun"),
    (86, "Vega"),
    (93, "Mira"),
    (84, "Wezen"),
    (82, "Fomalhaut"),
    (88, "Nashira"),
    (92, "Botein"),
    (91, "Ogma"),
]


class PageTitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


class RedirectCounter(HTTPRedirectHandler):
    def __init__(self):
        super().__init__()
        self.count = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.count += 1
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def route_cases():
    return [
        {
            "label": "movie TMDB 27205",
            "path": "/embed/movie/27205",
            "expected_title": "Inception · BingeAPI",
            "media": "movie",
        },
        {
            "label": "movie IMDb tt1375666",
            "path": "/embed/movie/tt1375666",
            "expected_title": "Inception · BingeAPI",
            "media": "movie",
        },
        {
            "label": "TV TMDB 1396 S1E1",
            "path": "/embed/tv/1396/1/1",
            "expected_title": "Breaking Bad · BingeAPI",
            "media": "tv",
        },
        {
            "label": "TV IMDb tt0903747 S1E1",
            "path": "/embed/tv/tt0903747/1/1",
            "expected_title": "Breaking Bad · BingeAPI",
            "media": "tv",
        },
    ]


def option_cases():
    # sub_url uses the reserved example.com hostname. This HTTP test only
    # downloads the player page and does not execute its JavaScript or fetch it.
    options = {
        "autoplay": "0",
        "welcome": "1",
        "color": "7DD3FC",
        "bg": "050505",
        "theme": "dark",
        "title": "0",
        "autonext": "0",
        "next": "0",
        "episodes": "0",
        "pause_overlay": "0",
        "skip": "0",
        "resume": "0",
        "right_click": "0",
        "sub_lang": "eng",
        "sub_os": "1",
        "sub_url": "https://example.com/subs/en.srt",
        "sub_label": "English",
        "servers": ",".join(str(server_id) for server_id, _ in SERVERS),
    }
    return options


def individual_option_cases():
    # The server option is exercised separately in the 12-server × 4-route matrix.
    return [
        ("autoplay", {"autoplay": "0"}),
        ("welcome", {"welcome": "1"}),
        ("color", {"color": "7DD3FC"}),
        ("bg", {"bg": "050505"}),
        ("theme", {"theme": "dark"}),
        ("title", {"title": "0"}),
        ("autonext", {"autonext": "0"}),
        ("next", {"next": "0"}),
        ("episodes", {"episodes": "0"}),
        ("pause_overlay", {"pause_overlay": "0"}),
        ("skip", {"skip": "0"}),
        ("resume", {"resume": "0"}),
        ("right_click", {"right_click": "0"}),
        ("sub_lang", {"sub_lang": "eng"}),
        ("sub_os with sub_lang", {"sub_lang": "eng", "sub_os": "1"}),
        ("sub_url with sub_label", {"sub_url": "https://example.com/subs/en.srt", "sub_label": "English"}),
        ("sub_label", {"sub_label": "English"}),
    ]


def request_once(method, path, timeout):
    redirect_counter = RedirectCounter()
    opener = build_opener(ProxyHandler(), redirect_counter)
    request = Request(
        BASE_URL + path,
        method=method,
        headers={
            "User-Agent": "Sinegang-BingeAPI-endpoint-test/1.0",
            "Accept": "text/html,application/json,*/*",
        },
    )
    try:
        with opener.open(request, timeout=timeout) as response:
            body = b"" if method == "HEAD" else response.read(500_000)
            status = response.status
            content_type = response.headers.get("Content-Type", "")
            effective_url = response.geturl()
    except HTTPError as error:
        body = b"" if method == "HEAD" else error.read(200_000)
        status = error.code
        content_type = error.headers.get("Content-Type", "")
        effective_url = error.geturl()
    except (URLError, TimeoutError, OSError) as error:
        return {
            "status": "ERROR",
            "content_type": "",
            "redirects": redirect_counter.count,
            "effective_url": "",
            "page_title": "",
            "detail": str(error)[:240],
        }

    parser = PageTitleParser()
    if body:
        parser.feed(body.decode("utf-8", "replace"))
    return {
        "status": status,
        "content_type": content_type,
        "redirects": redirect_counter.count,
        "effective_url": effective_url,
        "page_title": parser.title.strip(),
        "detail": "",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--timeout", type=float, default=12, help="per-request timeout in seconds (default: 12)")
    parser.add_argument("--delay", type=float, default=0.15, help="delay between requests in seconds (default: 0.15)")
    parser.add_argument("--output", help="also write the full CSV report to this path")
    args = parser.parse_args()
    if args.timeout <= 0 or args.delay < 0:
        parser.error("--timeout must be positive and --delay cannot be negative")

    checks = []
    routes = route_cases()

    # Every documented route/ID form crossed with all 12 published server IDs.
    for route in routes:
        for server_id, server_name in SERVERS:
            query = urlencode({"servers": str(server_id), "autoplay": "0", "welcome": "1"})
            checks.append({
                "name": f"{route['label']} · {server_name} ({server_id})",
                "method": "GET",
                "path": f"{route['path']}?{query}",
                "expected_status": 200,
                "expected_title": route["expected_title"],
                "server": f"{server_name} ({server_id})",
                "interpretation": "route response only; does not prove this server has playable media",
            })

    # Base route responses, independent of the server preference matrix.
    for route in routes:
        checks.append({
            "name": f"{route['label']} · default order",
            "method": "GET",
            "path": route["path"],
            "expected_status": 200,
            "expected_title": route["expected_title"],
            "server": "default",
            "interpretation": "route response only",
        })

    # GET/HEAD/OPTIONS method behavior for each route template.
    for path, name in (("/embed/movie/27205", "movie route"), ("/embed/tv/1396/1/1", "TV route")):
        for method, expected in (("HEAD", 200), ("OPTIONS", 404)):
            checks.append({
                "name": f"{name} · {method}",
                "method": method,
                "path": path,
                "expected_status": expected,
                "expected_title": "",
                "server": "n/a",
                "interpretation": "OPTIONS is not required for a direct iframe GET",
            })

    combined_options = urlencode(option_cases())
    for path, name, title in (
        ("/embed/movie/27205", "movie route", "Inception · BingeAPI"),
        ("/embed/tv/1396/1/1", "TV route", "Breaking Bad · BingeAPI"),
    ):
        for option_name, option_values in individual_option_cases():
            query = urlencode(option_values)
            checks.append({
                "name": f"{name} · option {option_name}",
                "method": "GET",
                "path": f"{path}?{query}",
                "expected_status": 200,
                "expected_title": title,
                "server": "n/a",
                "interpretation": "HTTP acceptance only; option behavior is not executed by this test",
            })
        checks.append({
            "name": f"{name} · combined documented options",
            "method": "GET",
            "path": f"{path}?{combined_options}",
            "expected_status": 200,
            "expected_title": title,
            "server": "all listed values",
            "interpretation": "HTTP acceptance only; option behavior is not executed by this test",
        })

    checks.extend([
        {
            "name": "TV specials season 0 (documented unsupported)",
            "method": "GET",
            "path": "/embed/tv/1396/0/1",
            "expected_status": 404,
            "expected_title": "",
            "server": "n/a",
            "interpretation": "documentation says season 0 specials are unavailable",
        },
        {
            "name": "invalid movie ID 0",
            "method": "GET",
            "path": "/embed/movie/0",
            "expected_status": 200,
            "expected_title": "",
            "server": "n/a",
            "interpretation": "200 may be a generic player page; inspect its title/result",
        },
        {
            "name": "proposed rights endpoint (not in public iframe reference)",
            "method": "GET",
            "path": "/api/v1/rights/check?type=movie&id=27205&country=US",
            "expected_status": 404,
            "expected_title": "",
            "server": "n/a",
            "interpretation": "owner-supplied endpoint proposal; not a documented public route",
        },
    ])

    fields = [
        "name", "method", "path", "status", "expected_status", "redirects",
        "effective_url", "content_type", "page_title", "server", "result", "detail", "interpretation",
    ]
    results = []
    for index, check in enumerate(checks, start=1):
        response = request_once(check["method"], check["path"], args.timeout)
        passed = response["status"] == check["expected_status"]
        expected_title = check.get("expected_title", "")
        if expected_title:
            passed = passed and expected_title in response["page_title"]
        result = {
            **check,
            **response,
            "result": "PASS" if passed else "FAIL",
        }
        results.append(result)
        print(
            f"[{index:02d}/{len(checks)}] {result['result']} {check['method']} "
            f"{check['name']} | HTTP {response['status']} | {response['page_title'] or response['detail']}",
            flush=True,
        )
        if index < len(checks):
            time.sleep(args.delay)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(results)
    csv_text = output.getvalue()
    if args.output:
        with open(args.output, "w", newline="", encoding="utf-8") as report:
            report.write(csv_text)
        print(f"CSV report: {args.output}")

    passed_count = sum(result["result"] == "PASS" for result in results)
    failed_count = len(results) - passed_count
    print(f"SUMMARY: {passed_count}/{len(results)} passed; {failed_count} failed")
    print("NOTE: HTTP 200 confirms an HTML player response only; it does not prove video playback or server-title availability.")
    if not args.output:
        print("CSV follows:")
        print(csv_text, end="")
    return 1 if failed_count else 0


if __name__ == "__main__":
    sys.exit(main())
