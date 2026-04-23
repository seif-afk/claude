import fs from "node:fs";
import path from "node:path";
import { renderConfig } from "../config";
import { render } from "../template";
import type { NewsletterContent } from "../types";

async function main() {
  const issueArg = process.argv[2];
  if (!issueArg) {
    console.error("Usage: npm run newsletter:preview -- <content-file>");
    console.error("Example: npm run newsletter:preview -- src/newsletter/content/2026-04-23.ts");
    process.exit(1);
  }

  const abs = path.resolve(issueArg);
  const mod = await import(abs);
  const content: NewsletterContent = mod.default || mod.content;
  if (!content) {
    throw new Error(`No default export or named 'content' export in ${abs}`);
  }

  const { bodyContent, previewHtml } = render(content, renderConfig());

  const outDir = path.resolve("newsletter-dist");
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.basename(abs, path.extname(abs));
  const previewPath = path.join(outDir, `${base}.preview.html`);
  const bodyPath = path.join(outDir, `${base}.body.html`);
  fs.writeFileSync(previewPath, previewHtml, "utf8");
  fs.writeFileSync(bodyPath, bodyContent, "utf8");

  console.log(`Preview written to: ${previewPath}`);
  console.log(`Beehiiv body_content written to: ${bodyPath}`);
  console.log(`\nSubject:      ${content.subject}`);
  console.log(`Preview text: ${content.previewText}`);
  console.log(`\nOpen the preview file in a browser to see the rendered newsletter.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
