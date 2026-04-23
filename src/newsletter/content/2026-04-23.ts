import type { NewsletterContent } from "../types";

const content: NewsletterContent = {
  issueNumber: 1,
  dateISO: "2026-04-23",
  subject: "Issue #1 — Why we're building in public",
  previewText: "The first edition of Netswick Weekly. Expect signal, not noise.",
  title: "Welcome to Netswick Weekly",
  subtitle: "Every Thursday: one hard-won lesson from building an AI-native GTM company.",
  readTimeMinutes: 4,
  sections: [
    {
      type: "intro",
      text: "You're reading **issue #1**. Here's the deal: every week I'll send one tight write-up on what's actually working (and what isn't) as we scale Netswick. No fluff, no recycled takes. If that sounds good, keep reading.",
    },
    {
      type: "illustration",
      name: "rocket",
      caption: "Shipping → Learning → Shipping. Rinse and repeat.",
    },
    {
      type: "heading",
      text: "What this newsletter is",
    },
    {
      type: "paragraph",
      text: "Three things you'll get here, and nothing else:",
    },
    {
      type: "list",
      items: [
        "**Playbooks** we've used to land enterprise logos — with the exact numbers.",
        "**Teardowns** of outbound sequences, landing pages, and offers that are printing.",
        "**Behind the scenes** of building an AI-first GTM stack in 2026.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "This week's experiment",
      text: "We replaced our SDR intro call with a 90-second async Loom. Reply rate to booked call is up **38%**. Full breakdown next week.",
    },
    {
      type: "heading",
      text: "Numbers from last week",
    },
    {
      type: "metrics",
      items: [
        { label: "Meetings booked", value: "42" },
        { label: "Reply rate", value: "11.4%" },
        { label: "Close rate", value: "19%" },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "heading",
      text: "One thing to try this week",
    },
    {
      type: "paragraph",
      text: "Audit your last 10 cold emails. Count how many open with a compliment or a \"quick question.\" Those are filler. Cut them, open with the specific trigger that got them on your list, and watch reply rates move.",
    },
    {
      type: "quote",
      text: "The best cold email reads like it could only have been sent to one person.",
      attribution: "Every rep who's actually hit quota",
    },
    {
      type: "cta",
      text: "See how we do outbound",
      href: "https://netswick.com",
    },
    {
      type: "paragraph",
      text: "That's it for issue #1. Reply to this email and tell me what you want me to dig into next week — whatever gets the most votes is the topic.",
    },
    {
      type: "paragraph",
      text: "Talk soon,\n— Seif",
    },
  ],
};

export default content;
