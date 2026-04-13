#!/usr/bin/env python3
"""
Netswick Newsletter Creator
Push newsletters to beehiiv via the API.

Usage:
    python create_post.py --html newsletter.html --title "Your Title" [--status draft|confirmed] [--scheduled-at "2026-04-20T10:00:00Z"]

Environment:
    BEEHIIV_API_KEY   - Your beehiiv API key (Bearer token)
    BEEHIIV_PUB_ID    - Your publication ID (default: pub_8c9625c2-4cf2-4980-9c2c-2eb066007189)
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

API_BASE = "https://api.beehiiv.com/v2"
DEFAULT_PUB_ID = "pub_8c9625c2-4cf2-4980-9c2c-2eb066007189"


def create_post(api_key, pub_id, title, body_html, subtitle=None,
                status="draft", scheduled_at=None, content_tags=None):
    """Create a post on beehiiv via the API."""
    url = f"{API_BASE}/publications/{pub_id}/posts"

    payload = {
        "title": title,
        "body_content": body_html,
        "status": status,
    }
    if subtitle:
        payload["subtitle"] = subtitle
    if scheduled_at:
        payload["scheduled_at"] = scheduled_at
    if content_tags:
        payload["content_tags"] = content_tags

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"Post created successfully!")
            print(f"  ID:     {result.get('data', {}).get('id', 'N/A')}")
            print(f"  Status: {result.get('data', {}).get('status', 'N/A')}")
            print(f"  URL:    {result.get('data', {}).get('web_url', 'N/A')}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"Error {e.code}: {body}", file=sys.stderr)
        if e.code == 403:
            print("\nNote: The Create Post endpoint requires a beehiiv Enterprise plan.", file=sys.stderr)
            print("If you're not on Enterprise, paste the HTML into the beehiiv editor.", file=sys.stderr)
        sys.exit(1)


def list_posts(api_key, pub_id, limit=5):
    """List recent posts."""
    url = f"{API_BASE}/publications/{pub_id}/posts?limit={limit}&direction=desc&order_by=created"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        posts = result.get("data", [])
        if not posts:
            print("No posts found.")
        for p in posts:
            print(f"  [{p.get('status', '?')}] {p.get('title', 'Untitled')} (ID: {p.get('id', '?')})")
        return result


def main():
    parser = argparse.ArgumentParser(description="Netswick Newsletter Creator")
    sub = parser.add_subparsers(dest="command", help="Command")

    # create
    create_cmd = sub.add_parser("create", help="Create a new post")
    create_cmd.add_argument("--html", required=True, help="Path to the HTML file")
    create_cmd.add_argument("--title", required=True, help="Post title")
    create_cmd.add_argument("--subtitle", help="Post subtitle")
    create_cmd.add_argument("--status", default="draft", choices=["draft", "confirmed"],
                            help="Post status (default: draft)")
    create_cmd.add_argument("--scheduled-at", help="ISO 8601 datetime to schedule (e.g., 2026-04-20T10:00:00Z)")
    create_cmd.add_argument("--tags", nargs="*", help="Content tags")

    # list
    list_cmd = sub.add_parser("list", help="List recent posts")
    list_cmd.add_argument("--limit", type=int, default=5, help="Number of posts")

    args = parser.parse_args()
    api_key = os.environ.get("BEEHIIV_API_KEY")
    pub_id = os.environ.get("BEEHIIV_PUB_ID", DEFAULT_PUB_ID)

    if not api_key:
        print("Error: Set BEEHIIV_API_KEY environment variable.", file=sys.stderr)
        sys.exit(1)

    if args.command == "create":
        with open(args.html, "r") as f:
            html = f.read()
        create_post(api_key, pub_id, args.title, html,
                    subtitle=args.subtitle, status=args.status,
                    scheduled_at=args.scheduled_at, content_tags=args.tags)

    elif args.command == "list":
        list_posts(api_key, pub_id, limit=args.limit)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
