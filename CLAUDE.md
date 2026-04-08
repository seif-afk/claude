# Netswick — Context & Workflows

This file is automatically loaded by every Claude Code session in this repo.
It contains everything needed to pick up Seif's ongoing work on Netswick's
outbound operations without re-explaining context.

---

## About Netswick

Netswick is a done-for-you AI-powered lead generation agency built exclusively
for the promotional products, branded merchandise, and print industry. Founded
by **Seif Khalil** (based in London), ~3-person team. Tagline: *"We help branded
merch companies land Fortune 5000 clients."*

**Core service:** replaces in-house SDR teams by running a modern AI-driven cold
outreach system that books meetings with mid-market and enterprise prospects who
have active buying intent for branded merchandise.

**Clients (public):** Swag.com, Merch.com, Vox Marketing Group, MSP Design
Group, Imprint Engine, Nadell, Steamboat Marketing, Global Product Source,
Gateway Printing, Disco.com.

**Pricing:** $5K/month standard; $3-5K/month for pilots; 3-month minimum.

**Current channels:** cold calling (Salesfinity power dialer), cold email
(Smartlead), LinkedIn outreach (HeyReach).

---

## Secrets & Tokens (env vars)

All secrets live in `.env` at the repo root (gitignored). Load them before
running scripts that need them:

```bash
set -a && source .env && set +a
```

| Variable | Used for |
|---|---|
| `SALESFINITY_API_KEY` | Salesfinity call-log API |
| `SLACK_USER_TOKEN` | Post Slack messages as Seif (xoxp-) |
| `SLACK_BOT_TOKEN` | Post as Netswick bot (xoxb-) — rarely used |

**HeyReach MCP** is installed as a user-scope MCP server in Claude Code — it's
available as `mcp__heyreach__*` tools automatically in every session.

---

## Salesfinity API

**Base URL:** `https://client-api.salesfinity.co`
**Auth:** `x-api-key: $SALESFINITY_API_KEY` header
**Docs:** https://docs.salesfinity.ai/llms.txt

### Key endpoint: `GET /v1/call-log`

Query params (URL-encode brackets):
- `limit` (1-100, default 10)
- `page` (default 1)
- `filters[start_date]` / `filters[end_date]` (ISO 8601)
- `filters[outcome]` — `answered`, `no-answer`, `cancelled`
- `filters[answered_by]` — `human`, `machine_start`
- `filters[disposition_ids][]` — array (see below)
- `filters[user_ids][]` / `filters[contact_list_ids][]`

Response includes `data[]` with fields: `_id`, `call_id`, `outcome`,
`direction`, `duration`, `disposition{internal_id, external_name}`,
`contact{first_name, last_name, title, website, ...}`, `user`, `contact_list`,
`transcription`, `recording_url`, `started_at`, `ended_at`.

### Known disposition IDs (Netswick account)

| ID | Name |
|---|---|
| 1 | Answered — Meeting Set |
| 3 | Answered — Not Interested |
| 5 | Answered — Wrong Contact |
| 9 | Answered — Do Not Call Again |
| 10 | No Answer |

### Example: fetch all human-answered calls for a date range

```python
import json, urllib.request, os
API = os.environ["SALESFINITY_API_KEY"]
BASE = "https://client-api.salesfinity.co/v1/call-log"

def fetch(start, end, disp_ids=(1, 3, 5, 9)):
    out = []
    for d in disp_ids:
        page = 1
        while True:
            url = (f"{BASE}?limit=100&page={page}"
                   f"&filters%5Bstart_date%5D={start}"
                   f"&filters%5Bend_date%5D={end}"
                   f"&filters%5Boutcome%5D=answered"
                   f"&filters%5Banswered_by%5D=human"
                   f"&filters%5Bdisposition_ids%5D%5B%5D={d}")
            req = urllib.request.Request(url, headers={"x-api-key": API})
            with urllib.request.urlopen(req) as r:
                data = json.loads(r.read())
            out.extend(data["data"])
            if page >= data["pagination"].get("pages", 1): break
            page += 1
    return out
```

---

## Strict Classification Methodology (CRITICAL — don't use regex)

**This is how Seif expects every pickup to be classified.** Salesfinity's
dispositions are unreliable — always classify from the transcript content +
contact metadata, not the disposition tag. **Read every transcript manually.**

Every pickup falls into exactly ONE of these four buckets:

### 1. WRONG CONTACT — structural mismatch only
Only if ONE of these is true:
- Prospect explicitly says it's a wrong number / "this isn't [name]"
- Prospect's **title** is outside the promo buying decision role (software
  engineer, UX researcher, principal dancer, HR, finance, designer, product
  manager, chef, race chairman, etc.)
- Prospect's **company** is not in promo/print/branded merch/signage industry
  (food, beverage, restaurants, consumer retail, education, entertainment, non-promo
  SaaS, sports leagues, shipping, real estate, charities, ad agencies, gifting
  platforms like Snappy/Thnks/Ongoody/Zazzle, manufacturers/contract decorators
  that sell to promo distributors)
- Prospect says they're **retired / sold the business / closed the business /
  "I don't own the company anymore" / "I don't do merch"**
- Prospect says they're **not the decision maker** ("that's not my job / not my
  role / not my department / contact our marketing team / reach out to
  corporate / I'm a sales rep")
- Prospect says they're a **manufacturer or contract decorator** — *"we sell to
  distributors like Swag.com"* — they're upstream of the ICP

### 2. REJECTED AT OPENER
- Prospect hung up or declined BEFORE hearing substantive value prop
- Short call (<25s) with no pitch markers delivered
- Call contains only the intro phrases ("hey, I know I'm calling out of the
  blue, I'll tell you why in 30 seconds") — prospect never heard anything about
  events / auto-send / custom merch / buying signals

### 3. PITCHED (didn't book)
- Prospect heard the substantive value prop (at least "identify companies
  attending events" or "auto send custom merch designs" or similar)
- Declined for an **objection**, not a structural reason
- Valid pitched objections: "not interested / no budget / doing it in-house /
  too busy / no bandwidth / already tried agencies / bad past experience /
  already using ZoomInfo / doesn't fit how we sell / not the right time"

### 4. BOOKED
- Prospect verbally agreed to a meeting ("sure, let's do Tuesday", "sounds
  good", "yeah I'll take a look")
- OR completed the booking flow (gave email, picked a time)
- OR was disqualified AFTER agreeing (e.g., on price during qualification)
- Counts as booked even if marked "Not Interested" or "DNC" in Salesfinity
  (disposition errors happen — transcript is source of truth)

### Priority order when classifying
1. Wrong Contact (overrides everything)
2. Booked (overrides rejected/pitched)
3. Pitched
4. Rejected at Opener

### Metrics formulas
```
Pickup Rate        = pickups / total_dials
Connection Rate    = (pickups − wrong_contacts) / total_dials
Wrong Contact Rate = wrong_contacts / pickups
Pitch Rate         = (pitched + booked) / (pickups − wrong_contacts)
Booking Rate       = booked / (pitched + booked)
```

---

## Current Cold Call Script (the proven new one)

This version is outperforming the old "find leads actively looking to buy
promo" framing:

> Hey [name], it's [caller] from Netswick. I know I'm calling out of the blue
> so I'll tell you why in 30 seconds then you can decide if you wanna continue.
>
> So we're helping branded merch companies like Swag.com, Imprint Engine and
> others identify companies who are attending or sponsoring large nearby events
> like {{nearby_event}} — and need thousands of units. Then we send them custom
> merch designs based on your catalog with their branding, to grab attention
> and book sales meetings. So far we've helped our clients book meetings with
> companies like Hilton, Stripe, and Uber.
>
> Is tomorrow or the day after good for a visual demo?

**Open thread on the script:**
- Lina's opener currently starts with *"Hey [name]"* — this is making prospects
  hang up because of upward inflection. Feedback sent to her 2026-04-08 to drop
  the "Hey" and use downward inflection from the first word.
- Lag at the start of calls makes prospects think it's an AI — fix: start
  opener the instant the call connects, don't wait for "hello."

---

## Wrong Industry Exclusion List (for list builder feedback)

The Lina-Very-Qualified-List has a recurring issue where ~13% of pickups are
from companies not in the ICP. **Hard exclusions to apply when evaluating list
quality or giving list-builder feedback:**

- Consumer retail / clothing brands (Lands' End, Kirkland's, HydroJug, Parks
  Project, Hooey)
- Food, beverage, confectionery, restaurants, bakeries
- Shipping / logistics / 3PL / fulfillment (Argo, DTL, Ocop, Pacful)
- Equipment / vehicle / real estate leasing
- Education (universities, K-12, learning platforms)
- Entertainment / media / record labels / film studios / ad agencies
- Sports apps / sports leagues / recreation platforms
- Non-promo SaaS (Upside, UX research tools, engineering platforms)
- Corporate gifting platforms (Snappy, Thnks, Ongoody, Zazzle, Giftsenda) —
  competitors or wrong tier
- Manufacturers and contract decorators (Stahls, Blue Generation, Steel
  Threads, Orlandi, Logo Concepts) — upstream of the ICP
- Fuel / rewards / financial services

---

## Slack Integration

**Workspace:** Netswick (team ID `T079D3HMC3W`)
**Seif's user ID:** `U078W2EAEJ3`

### Known user IDs
| Person | Role | User ID |
|---|---|---|
| Seif Khalil | Founder (me) | U078W2EAEJ3 |
| Rahim | List builder | U09MJ5GEHCN |
| Lina Mahmoudi | Cold caller | U0AJMQUK717 |

### Sending a DM as Seif (xoxp user token)

```python
import json, urllib.request, os
TOKEN = os.environ["SLACK_USER_TOKEN"]
req = urllib.request.Request(
    "https://slack.com/api/chat.postMessage",
    data=json.dumps({
        "channel": "U0AJMQUK717",  # recipient user ID
        "text": "message with *bold* and _italic_ and :emoji:",
        "unfurl_links": False,
        "unfurl_media": False,
    }).encode(),
    headers={"Authorization": f"Bearer {TOKEN}",
             "Content-Type": "application/json; charset=utf-8"},
)
with urllib.request.urlopen(req) as r:
    print(json.loads(r.read()))
```

**IMPORTANT:** Never send a Slack message without showing the draft to Seif
for approval first. Always wait for "send it" or "yes" before calling
`chat.postMessage`.

---

## Common Workflows

### Weekly metrics pull
1. Fetch all human-answered calls for the date range (4 dispositions: 1, 3, 5, 9)
2. Fetch total dials for the same range (no filter)
3. **Read every transcript manually** and classify using the 4 buckets above
4. Report: Pickup Rate, Connection Rate, Wrong Contact Rate, Pitch Rate,
   Booking Rate
5. Per-list breakdown if multiple contact lists were used
6. List the booked calls with full context
7. Categorize the pitched rejections by reason (flat no, in-house,
   competitor, price, bad timing, etc.)

### Giving caller feedback (Lina)
1. Pull the specific calls from yesterday by name
2. Get their `recording_url` from the API response
3. Start with positive — what she's doing well
4. Per-call feedback with recording link
5. Action steps at the end
6. Send as DM from Seif's profile (user token), not the bot
7. **ALWAYS get Seif's approval before sending**

### Giving list-builder feedback (Rahim)
1. Identify wrong contacts from yesterday's Qualified List only
2. Focus only on **wrong industry** — not wrong number, retired, or wrong role
3. Send as DM from Seif's profile
4. **ALWAYS get Seif's approval before sending**

---

## HeyReach LinkedIn Outreach

HeyReach is installed as an MCP server. Tools are available as `mcp__heyreach__*`.
Use these for any LinkedIn outreach analytics or messaging tasks.

---

## Recording URLs

Salesfinity recording URLs live at
`https://prod-twillio-recordings.s3.eu-central-1.amazonaws.com/...` and are
publicly accessible (no auth). **But GitHub's secret scanner blocks commits
that contain them** because the path includes a Twilio Account SID. If you
build an audio player UI, download recordings locally to `recordings/`
(which is gitignored) and reference them by relative path.

---

## Repository Layout

```
/home/user/claude/
├── CLAUDE.md                          # this file
├── .env                                # secrets (gitignored)
├── .gitignore                          # includes .env, recordings/
├── reports/                            # feedback DOCX files
├── not_interested_transcripts/         # old batch of .txt transcripts
├── not_interested_transcripts.html     # web viewer for those
├── recordings/                         # downloaded .wav files (gitignored)
└── [source code for the Netswick web app]
```

Dev branch for Claude Code sessions: `claude/export-call-transcripts-57t62`

---

## Known Issues / Open Items

- **Script opener:** "Hey [name]" with upward inflection hurts pickup → pitch
  conversion. Feedback sent 2026-04-08.
- **Qualified List wrong contact rate:** still ~34% despite being the best
  list. Industry filter feedback sent to Rahim 2026-04-08.
- **Old lists (First1500, extracted_rows_1501+):** zero bookings, 41-62% wrong
  contact rate. Seif was advised to kill these immediately.
- **Repeat clients on lists:** Steamboat Marketing (existing client) was
  called Apr 2. Suppression list needs to include all past/current clients.
- **Salesfinity dispositions unreliable:** don't trust them for metrics. Always
  re-classify from transcripts.
