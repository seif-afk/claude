#!/usr/bin/env python3
"""Pull Smartlead campaign stats for two date ranges and write a side-by-side CSV."""

import csv
import os
import sys
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import json

API_KEY = "b56a5cdd-dce1-44ef-805d-e39888aff5c3_ocf5pcm"
BASE = "https://server.smartlead.ai/api/v1"

PERIOD_A = ("2026-04-05", "2026-04-18")
PERIOD_B = ("2026-04-19", "2026-05-02")

EXCLUDE_SUBSTRING = "netswick"
OUTPUT_CSV = "campaign_comparison.csv"
STATE_FILE = "/tmp/sl_progress.json"
PACE_SECONDS = 0.4  # ~150 req/min, under the 200/min limit


def get_json(path, params, max_retries=8):
    qs = urlencode({"api_key": API_KEY, **params})
    url = f"{BASE}{path}?{qs}"
    backoff = 30  # rate limit window is per-minute
    time.sleep(PACE_SECONDS)
    for attempt in range(max_retries):
        try:
            req = Request(url, headers={
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                              "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            })
            with urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:200]
            if e.code == 429 or e.code >= 500:
                print(f"  ! HTTP {e.code} on {path} — sleeping {backoff}s", flush=True)
                time.sleep(backoff)
                backoff = min(backoff + 15, 90)
                continue
            raise RuntimeError(f"HTTP {e.code} {path}: {body}")
        except URLError as e:
            print(f"  ! Network error on {path}: {e} — retrying in {backoff}s", flush=True)
            time.sleep(backoff)
            backoff = min(backoff + 15, 90)
    raise RuntimeError(f"Exhausted retries for {path}")


def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE) as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError):
            pass
    return {}


def save_state(state):
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f)
    os.replace(tmp, STATE_FILE)


def pick(d, *keys, default=0):
    """Return first present numeric-ish value among keys."""
    for k in keys:
        if k in d and d[k] is not None:
            try:
                return int(d[k])
            except (TypeError, ValueError):
                try:
                    return int(float(d[k]))
                except (TypeError, ValueError):
                    pass
    return default


def fetch_period_stats(campaign_id, start, end, debug=False):
    """Returns dict with sent, replies, positive_replies, bounces for the period.

    /campaigns/{id}/analytics-by-date returns a single aggregated object with
    sent_count / reply_count / bounce_count at the top level.
    /analytics/day-wise-positive-reply-stats returns a list of daily rows where
    positive_replied is nested inside email_engagement_metrics.
    """
    data = get_json(
        f"/campaigns/{campaign_id}/analytics-by-date",
        {"start_date": start, "end_date": end},
    )
    if debug:
        print(f"  DEBUG analytics-by-date sample: {json.dumps(data)[:600]}", flush=True)

    sent = pick(data, "sent_count", "sent", "total_sent", "unique_sent_count")
    replies = pick(data, "reply_count", "replies", "total_replies")
    bounces = pick(data, "bounce_count", "bounces", "total_bounces")

    if replies == 0:
        positive = 0
    else:
        pos = get_json(
            "/analytics/day-wise-positive-reply-stats",
            {"start_date": start, "end_date": end, "campaign_ids": str(campaign_id)},
        )
        if debug:
            print(f"  DEBUG positive-reply sample: {json.dumps(pos)[:600]}", flush=True)
        pos_rows = []
        if isinstance(pos, dict):
            d = pos.get("data") or {}
            if isinstance(d, dict):
                pos_rows = d.get("day_wise_stats") or d.get("rows") or []
            elif isinstance(d, list):
                pos_rows = d
        positive = 0
        for r in pos_rows:
            metrics = r.get("email_engagement_metrics") if isinstance(r, dict) else None
            if isinstance(metrics, dict):
                positive += pick(metrics, "positive_replied", "positive_reply_count", "interested")
            else:
                positive += pick(r, "positive_replied", "positive_reply_count", "interested")

    return {
        "sent": sent,
        "replies": replies,
        "positive_replies": positive,
        "bounces": bounces,
    }


def main():
    print(f"Fetching campaign list...", flush=True)
    campaigns = get_json("/campaigns/", {})
    if not isinstance(campaigns, list):
        print(f"Unexpected campaign list response: {str(campaigns)[:300]}", flush=True)
        sys.exit(1)
    print(f"  -> {len(campaigns)} campaigns total", flush=True)

    filtered = [
        c for c in campaigns
        if EXCLUDE_SUBSTRING not in (c.get("name") or "").lower()
    ]
    excluded_count = len(campaigns) - len(filtered)
    print(f"  -> {excluded_count} excluded (Netswick), {len(filtered)} to process", flush=True)

    state = load_state()
    print(f"  -> resuming with {len(state)} campaigns already cached", flush=True)
    debug_done = False
    for i, c in enumerate(filtered, 1):
        cid, name = c["id"], c.get("name", "")
        cid_str = str(cid)
        if cid_str in state:
            continue
        print(f"[{i}/{len(filtered)}] {name} (id={cid})", flush=True)
        try:
            a = fetch_period_stats(cid, *PERIOD_A, debug=not debug_done)
            debug_done = True
            b = fetch_period_stats(cid, *PERIOD_B)
        except RuntimeError as e:
            print(f"  ! Failed: {e} — skipping", flush=True)
            continue

        state[cid_str] = {"name": name, "status": c.get("status", ""), "a": a, "b": b}
        save_state(state)

        total_activity = (
            a["sent"] + a["replies"] + a["positive_replies"] + a["bounces"]
            + b["sent"] + b["replies"] + b["positive_replies"] + b["bounces"]
        )
        if total_activity == 0:
            print(f"  -> zero activity in both periods, skipping", flush=True)
            continue
        print(f"  -> A: sent={a['sent']} replies={a['replies']} pos={a['positive_replies']} bounces={a['bounces']}", flush=True)
        print(f"  -> B: sent={b['sent']} replies={b['replies']} pos={b['positive_replies']} bounces={b['bounces']}", flush=True)

    rows_out = []
    for c in filtered:
        cid_str = str(c["id"])
        s = state.get(cid_str)
        if not s:
            continue
        a, b = s["a"], s["b"]
        if a["sent"] + a["replies"] + a["positive_replies"] + a["bounces"] + \
           b["sent"] + b["replies"] + b["positive_replies"] + b["bounces"] == 0:
            continue
        rows_out.append({
            "campaign_id": c["id"],
            "campaign_name": s["name"],
            "status": s["status"],
            "period_a_start": PERIOD_A[0],
            "period_a_end": PERIOD_A[1],
            "period_a_sent": a["sent"],
            "period_a_replies": a["replies"],
            "period_a_positive_replies": a["positive_replies"],
            "period_a_bounces": a["bounces"],
            "period_b_start": PERIOD_B[0],
            "period_b_end": PERIOD_B[1],
            "period_b_sent": b["sent"],
            "period_b_replies": b["replies"],
            "period_b_positive_replies": b["positive_replies"],
            "period_b_bounces": b["bounces"],
        })

    if not rows_out:
        print("No campaigns with activity to write.", flush=True)
        return

    fieldnames = list(rows_out[0].keys())
    with open(OUTPUT_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows_out)
    print(f"Wrote {len(rows_out)} rows to {OUTPUT_CSV}", flush=True)


if __name__ == "__main__":
    main()
