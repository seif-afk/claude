---
name: salesfinity-analysis
description: Analyze Salesfinity cold call data for Netswick. Use when asked about call metrics, pickup rates, booking rates, weekly data, wrong contacts, wrong numbers, failed connections, or any cold calling performance analysis. Also use when asked to pull call data for a date range, classify transcripts, or generate reports on Lina's calling performance.
when_to_use: User asks about call data, call metrics, pickup rate, booking rate, wrong contacts, wrong numbers, Lina's performance, cold call analysis, weekly report, daily report, or any Salesfinity-related data pull.
user-invocable: true
allowed-tools: Bash Read Write Agent
argument-hint: [date-range or question]
---

# Salesfinity Cold Call Analysis — Full Operating Manual

You are analyzing cold call data for **Netswick**, an AI-powered lead generation agency for the promotional products / branded merchandise / print industry. The caller is **Lina Mahmoudi**. The founder is **Seif Khalil**.

## Salesfinity API

**Base URL:** `https://client-api.salesfinity.co`  
**Auth:** `x-api-key` header  
**Key:** `sk_3c6ef719-a2dd-43d2-ba1b-95a8dd625bf7`

Always use SSL with verification disabled (`ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE`) as the environment has self-signed cert issues.

Always use retry logic with exponential backoff (4 retries, 2s/4s/8s/16s) — the API throws 503s regularly.

### Fetching calls

**Total dials** for a date range — no filters:
```
GET /v1/call-log?limit=100&page={page}&filters[start_date]={iso}&filters[end_date]={iso}
```

**Connected calls** (SF-Connected) — these are the ones with real outcomes. Fetch by disposition ID:
- `1` = Answered — Meeting Set
- `3` = Answered — Not Interested
- `5` = Answered — Wrong Contact
- `9` = Answered — Do Not Call Again

Loop through all 4 disposition IDs and combine results. This gives you ALL connected calls. URL-encode the brackets.

```python
for disp_id in [1, 3, 5, 9]:
    url = (f"{BASE}?limit=100&page={page}"
           f"&filters%5Bstart_date%5D={start}"
           f"&filters%5Bend_date%5D={end}"
           f"&filters%5Boutcome%5D=answered"
           f"&filters%5Bdisposition_ids%5D%5B%5D={disp_id}")
```

**CRITICAL: Do NOT trust Lina's disposition tags.** They are frequently wrong. Always classify from the transcript content. The dispositions are only used as a filter to pull connected calls from the API — nothing else.

### Response fields

Each call has: `_id`, `call_id`, `outcome`, `duration`, `disposition{internal_id, external_name}`, `contact{first_name, last_name, title, website, phone, email, linkedin_url, timezone, phone_numbers[]}`, `contact_list{name}`, `transcription`, `recording_url`, `started_at`, `ended_at`.

## How to Analyze — Step by Step

### Step 1: Pull all data
For the requested date range, fetch:
1. Total dials (no filter)
2. All connected calls (4 disposition IDs)

### Step 2: Read EVERY transcript
Do not use regex to classify. Do not use Lina's disposition tags. Read every single transcript word by word and classify manually based on what actually happened on the call.

### Step 3: Classify into these buckets

Every connected call goes into exactly ONE of these categories:

**Exclusions (not counted as real pickups):**
- **Voicemail** — transcript contains "you've reached," "please leave a message," "leave me a message," "at the tone," "I'm not available," "I can't take your call," etc. These are AMD (answering machine detection) failures.
- **Too short / no transcript** — under ~8 seconds with no meaningful content, or empty transcript. Just a blip.

**After removing exclusions, the rest are Real Pickups. Classify each:**

- **Failed Connection (FC)** — both parties are on the line but audio failure prevents conversation. Breaking up, can't hear each other, dead air after pickup, echo loops, foreign language with no communication possible. Also includes calls where Lina delivers the full opener (10-20s) but the prospect never says a single word — these are dead-air pickups where the connection failed silently.

- **Wrong Number (WN)** — a live person picks up but it's NOT the intended contact. They confirm it's the wrong number, a different name answers, or the number reaches a completely different business/person.

- **Wrong Contact (WC)** — the right person picks up at the right number but they are structurally not a fit. Sub-categories:
  - **Retired / sold business / left company / deceased** — no longer active
  - **Wrong industry** — company is not in promo/print/branded merch (see ICP below)
  - **Not decision maker / wrong role** — "that's not my job," "I'm not in charge of that"
  - **Wrong division** — right company but wrong department (e.g., signage division at a multi-division company)
  - **Competitor** — they sell the same service as Netswick ("we do that too," "you're a competitor")

- **Rejected at Opener (RO)** — prospect heard the opener but declined BEFORE hearing the substantive pitch. Short call (<25s typically), no pitch markers delivered. Just intro + "no thanks" / hang up / "not interested" before hearing what the service does.

- **Pitched** — prospect heard the substantive value prop (at least "identifying companies exhibiting trade shows" or "our sales team reaches out to event directors" or similar) and declined. They understood what the service is and said no. Valid rejection reasons: not interested, doing it in house, no budget, bad timing, already using a competitor, etc.

- **Booked** — prospect verbally agreed to a specific day and time for a demo, AND confirmed their email. A real booking means genuine engagement — not just "call me back" or "sure whatever" while distracted. If a prospect picked a time and confirmed email but was clearly just trying to get off the phone (zero qualification, said "call me back tomorrow"), that is NOT a real booking.

### Step 4: Separate cold calls from warm leads

**Cold calls** use the standard trade show script: "We are identifying companies who are exhibiting trade shows in {{state}}..."

**Warm leads** are callbacks from email replies or referrals. They use different scripts (e.g., "I just saw your reply on the trade show exhibitor's email" or "Phil referred you"). These should be tracked separately — they inflate cold call metrics if mixed in.

### Step 5: Calculate metrics

```
Pickup Rate        = real_pickups / total_dials
FC Rate            = failed_connections / real_pickups
WN Rate            = wrong_numbers / real_pickups
WC Rate            = wrong_contacts / real_pickups
Combined Wrong Rate = (WN + WC) / real_pickups
Connection Rate    = real_connections / total_dials
Pitch Rate         = (pitched + booked) / real_connections
Booking Rate       = booked / (pitched + booked)

Where:
  real_pickups = SF_connected - exclusions (VM + too_short)
  real_connections = real_pickups - FC - WN - WC
```

## ICP — Who is a valid contact

Netswick sells to **promotional products distributors, branded merchandise companies, and print companies**. These are companies whose core business is selling branded merch (hats, shirts, mugs, pens, etc.) to end-buyers.

### Valid ICP examples:
- Promo distributors (Swag.com, Imprint Engine, HALO, Geiger, Proforma)
- Print shops that do promo (commercial printers offering branded merch)
- Branded merch agencies
- Sign & banner companies (adjacent)
- Embroidery/screen print shops
- Awards & recognition companies

### Hard exclusions (NOT ICP):
- Consumer retail / clothing brands (B2C)
- Food, beverage, restaurants, bakeries, confectionery
- Shipping / logistics / 3PL / fulfillment
- Equipment / vehicle / real estate
- Education (universities, K-12)
- Entertainment / media / film studios / record labels / ad agencies
- Sports teams / esports orgs / recreation
- Non-promo SaaS
- Corporate gifting platforms (Snappy, Thnks, Ongoody, Zazzle)
- Manufacturers and contract decorators (upstream — they sell TO promo distributors)
- Cannabis companies
- Nonprofits / charities
- Casket companies, kitchen equipment, lighting companies, etc.

If a pitched prospect's company is clearly not in the ICP, they should be classified as **Wrong Contact (wrong industry)** regardless of what they said on the call.

## Classification Priority Order

1. Wrong Contact (overrides everything — even if they booked, if they're wrong ICP it's a WC)
2. Booked (overrides RO/Pitched)
3. Pitched (heard the value prop, declined)
4. Rejected at Opener (declined before hearing the pitch)

## Current Cold Call Script (trade show script)

> [Opener] "Hey [name], it's [caller] from Netswick Group. I know I'm calling out of the blue so I'll tell you why in 30 seconds then you can decide if you wanna continue."
>
> [Pitch] "So we're identifying companies who are exhibiting trade shows in {{state}} like {{trade show}} and need branded merchandise for their booth. Then, our sales team reaches out to the event directors to bring your company new opportunities. And since we've partnered with companies like Swag.com and Imprint Engine — we'd love to give you a 2-week pilot so you can see the results for yourself. Is tomorrow or [DAY] good for a 10-minute demo?"

## Qualification Framework (Post-Booking)

After a prospect agrees to a meeting, Lina should ask 3 questions with the **Acknowledge → Build → Bridge** loop:

- **Q1** (situational): "What are you currently doing for lead generation?" — acknowledge only, don't probe
- **Q2** (pain): "What would you want to improve about it?" — this is where she should BUILD an implication question ("So [consequence of their pain]?") and then BRIDGE back to the value prop
- **Q3** (budget): "Our programs typically start at $3-5K/month. Assuming the ROI is there, would that be budget friendly?"

**Known issue:** Lina skips the Build and Bridge steps. She asks Q2, the prospect answers, she says "makes total sense" and moves to Q3. This is why show-up rates are low — prospects have zero emotional investment in the demo.

## Reporting Format

Always present data in this table format:

| | Day 1 | Day 2 | ... | **Total** |
|---|---|---|---|---|
| Dials | | | | |
| Excl (VM/short) | | | | |
| Real Pickups | | | | |
| Failed Connections | | | | |
| Wrong Numbers | | | | |
| Wrong Contacts | | | | |
| Real Connections | | | | |
| Rejected at Opener | | | | |
| Pitched | | | | |
| **Booked** | | | | |

Then metrics:

| Metric | Value |
|---|---|
| Pickup Rate | x / y = **z%** |
| FC Rate | |
| WN Rate | |
| WC Rate | |
| Combined Wrong Rate | |
| Pitch Rate | |
| **Booking Rate** | |

Then list:
- All bookings with name, company, demo date, gap from call, qualification depth
- All wrong numbers with name, title, company
- All wrong contacts with name, title, company, sub-issue (retired/wrong industry/not DM/wrong division/competitor)
- Top rejection reasons for pitched calls

## Key Context

- **Lina** is the SDR/cold caller. Slack user ID: `U0AJMQUK717`
- **Rahim** is the list builder. Slack user ID: `U09MJ5GEHCN`
- **Seif** is the founder (the user). Slack user ID: `U078W2EAEJ3`
- Wrong numbers = Rahim's phone enrichment tool is failing (numbers not validated)
- Wrong contacts = Rahim's list filtering is failing (wrong industry, retired people, wrong roles)
- Lina changed scripts without authorization multiple times (HR/onboarding script, FIFA script) — the approved script is the trade show script above
- Apr 30-May 5 had a completely wrong ICP list (soccer teams, film studios, entertainment companies) — 0 bookings, 88% wrong rate
- The list went back to promo companies around May 6 and bookings resumed
- Lina should be calling each contact 3x before moving on — currently most get 1-2 calls then dropped
- Show-up rate is a problem — bookings scheduled 5+ days out tend to no-show
- Lina's qualification is mechanical (checkbox-style) with no discovery depth — this contributes to no-shows

## Slack Integration

To send messages as Seif, use the Slack Web API with his user token. **ALWAYS show the draft to the user for approval before sending.**

Channel IDs:
- `#meeting-notifications`: `C0A9DB00RPC`
- Rahim DM: `U09MJ5GEHCN`
- Lina DM: `U0AJMQUK717`

The Slack user token (xoxp-...) must be provided by the user — it's not stored persistently.

## Benchmarks / KPIs

| Metric | Target | Recent actual |
|---|---|---|
| Pickup Rate | 5-8% | 7-8% (on fresh lists) |
| Wrong Rate (WN+WC) | <15% | 15-30% depending on list |
| Pitch Rate | >60% | 60-65% |
| Booking Rate | >15% | 7-13% (trending down) |
| Contacts called 3x | 100% | ~6% (major gap) |
| Booking gap (call to demo) | <48 hours | 4.7 days average |
