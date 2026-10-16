#!/usr/bin/env python3
"""Local static server for testing the Online Tools site.

Usage examples:
  python local_test_server.py
  python local_test_server.py --port 9000 --open
  python local_test_server.py --dir tools/image-metrics
"""

from __future__ import annotations

import argparse
import functools
import http.server
import socketserver
import sys
import webbrowser
from pathlib import Path


class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Request handler with concise terminal logs."""

    def log_message(self, fmt: str, *args: object) -> None:
        message = "%s - - [%s] %s" % (
            self.client_address[0],
            self.log_date_time_string(),
            fmt % args,
        )
        print(message)


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """HTTP server handling each request in a new thread."""

    daemon_threads = True


def build_parser(default_dir: Path) -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run a local static file server for this repo.",
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Host to bind (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to bind (default: 8000)",
    )
    parser.add_argument(
        "--dir",
        default=str(default_dir),
        help="Directory to serve (default: script directory)",
    )
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the site in your default browser after startup.",
    )
    return parser


def validate_args(args: argparse.Namespace) -> Path:
    if not (1 <= args.port <= 65535):
        raise ValueError("--port must be between 1 and 65535")

    serve_dir = Path(args.dir).expanduser().resolve()
    if not serve_dir.exists():
        raise ValueError(f"Directory does not exist: {serve_dir}")
    if not serve_dir.is_dir():
        raise ValueError(f"Path is not a directory: {serve_dir}")

    return serve_dir


def run_server(host: str, port: int, serve_dir: Path, open_browser: bool) -> None:
    handler_cls = functools.partial(QuietHTTPRequestHandler, directory=str(serve_dir))

    with ThreadingHTTPServer((host, port), handler_cls) as httpd:
        base_url = f"http://{host}:{port}/"
        print("Local test server is running")
        print(f"Serving directory: {serve_dir}")
        print(f"URL: {base_url}")
        print("Press Ctrl+C to stop")

        if open_browser:
            webbrowser.open(base_url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    parser = build_parser(script_dir)
    args = parser.parse_args()

    try:
        serve_dir = validate_args(args)
        run_server(args.host, args.port, serve_dir, args.open)
    except OSError as exc:
        print(f"Failed to start server: {exc}", file=sys.stderr)
        return 1
    except ValueError as exc:
        print(f"Argument error: {exc}", file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
