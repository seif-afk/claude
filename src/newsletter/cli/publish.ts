import path from "node:path";
import { BeehiivClient } from "../beehiiv";
import { newsletterConfig, renderConfig } from "../config";
import { render } from "../template";
import type { NewsletterContent } from "../types";

async function main() {
  const args = process.argv.slice(2);
  const file = args[0];
  const mode = args.includes("--publish") ? "confirmed" : "draft";
  const scheduled = args.find((a) => a.startsWith("--scheduled="))?.split("=")[1];

  if (!file) {
    console.error("Usage: npm run newsletter:publish -- <content-file> [--publish] [--scheduled=ISO8601]");
    console.error("  No flags          → creates a DRAFT (safe default)");
    console.error("  --publish         → publishes immediately");
    console.error("  --scheduled=<iso> → schedules for a future time (requires --publish)");
    process.exit(1);
  }

  if (!newsletterConfig.publicationId) {
    console.error("BEEHIIV_PUBLICATION_ID is not set. Run `npm run newsletter:pubs` first.");
    process.exit(1);
  }

  const abs = path.resolve(file);
  const mod = await import(abs);
  const content: NewsletterContent = mod.default || mod.content;
  if (!content) throw new Error(`No content export in ${abs}`);

  const { bodyContent } = render(content, renderConfig());
  const client = new BeehiivClient({ apiKey: newsletterConfig.apiKey });

  console.log(`Publishing as: ${mode}${scheduled ? ` scheduled for ${scheduled}` : ""}`);
  console.log(`Subject:       ${content.subject}`);
  console.log(`Title:         ${content.title}`);
  console.log(`Body size:     ${bodyContent.length} chars`);
  console.log("");

  const res = await client.createPost(newsletterConfig.publicationId, {
    title: content.title,
    subtitle: content.subtitle,
    body_content: bodyContent,
    status: mode as "draft" | "confirmed",
    scheduled_at: scheduled,
    email_settings: {
      subject_line: content.subject,
      preview_text: content.previewText,
    },
  });

  console.log(`Post created: ${res.data.id}`);
  if (mode === "draft") {
    console.log("Review it in beehiiv before sending.");
  }
}

main().catch((err) => {
  console.error("Publish failed:", err.message);
  if (err.status === 403) {
    console.error(
      "\nNote: beehiiv's Create Post endpoint is currently Enterprise-only + beta.",
    );
    console.error(
      "If your plan doesn't support it, use `npm run newsletter:preview` and paste",
    );
    console.error("the generated .body.html into beehiiv's web editor (HTML block).");
  }
  if (err.body) console.error("Response body:", JSON.stringify(err.body, null, 2));
  process.exit(1);
});
