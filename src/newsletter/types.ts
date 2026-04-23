export type Section =
  | { type: "intro"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; title?: string; text: string; tone?: "info" | "success" | "warn" }
  | { type: "cta"; text: string; href: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "illustration"; name: IllustrationName; caption?: string }
  | { type: "divider" }
  | { type: "metrics"; items: Array<{ label: string; value: string }> }
  | { type: "html"; html: string };

export type IllustrationName =
  | "rocket"
  | "graph"
  | "network"
  | "spark"
  | "bolt"
  | "target";

export interface NewsletterContent {
  issueNumber: number;
  dateISO: string;
  subject: string;
  previewText: string;
  title: string;
  subtitle?: string;
  readTimeMinutes?: number;
  sections: Section[];
}
