import { brand } from "./brand";
import { brandMark, illustration } from "./illustrations";
import type { NewsletterContent, Section } from "./types";

export interface RenderConfig {
  logoUrl?: string;
  avatarUrl?: string;
  authorName: string;
  authorTitle: string;
  linkedinUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
}

export interface RenderResult {
  // HTML suitable for beehiiv's body_content field (no <style>, no <link>).
  bodyContent: string;
  // Full standalone HTML document for local preview (adds <head>, Google Fonts link).
  previewHtml: string;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Lightweight markdown-ish inline formatting: **bold**, *italic*, `code`, [text](url)
function inline(s: string): string {
  let out = escape(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) =>
    `<a href="${u}" style="color:${brand.link};text-decoration:none;border-bottom:1px solid ${brand.link};">${t}</a>`
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${brand.neutral};font-weight:700;">$1</strong>`);
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(
    /`([^`]+)`/g,
    `<code style="font-family:${brand.fontMono};background:${brand.bgCardElevated};border:1px solid ${brand.border};padding:2px 6px;border-radius:4px;font-size:13px;color:${brand.secondary};">$1</code>`
  );
  return out;
}

const headerFontStyle = `font-family:${brand.fontHeader};font-weight:600;letter-spacing:-0.03em;`;
const bodyFontStyle = `font-family:${brand.fontBody};`;

function renderSection(section: Section): string {
  switch (section.type) {
    case "intro":
      return `<p style="${bodyFontStyle}font-size:18px;line-height:1.6;color:${brand.text};margin:0 0 24px;">${inline(section.text)}</p>`;

    case "heading": {
      const size = section.level === 3 ? "22px" : "28px";
      return `<h2 style="${headerFontStyle}font-size:${size};line-height:1.2;color:${brand.neutral};margin:40px 0 16px;">${escape(section.text)}</h2>`;
    }

    case "paragraph":
      return `<p style="${bodyFontStyle}font-size:16px;line-height:1.7;color:${brand.text};margin:0 0 20px;">${inline(section.text)}</p>`;

    case "list": {
      const tag = section.ordered ? "ol" : "ul";
      const items = section.items
        .map(
          (i) =>
            `<li style="${bodyFontStyle}font-size:16px;line-height:1.7;color:${brand.text};margin:0 0 8px;padding-left:8px;">${inline(i)}</li>`
        )
        .join("");
      return `<${tag} style="margin:0 0 24px;padding-left:24px;color:${brand.secondary};">${items}</${tag}>`;
    }

    case "quote":
      return `<blockquote style="margin:28px 0;padding:20px 24px;border-left:3px solid ${brand.secondary};background:${brand.bgCardElevated};border-radius:0 12px 12px 0;">
        <p style="${bodyFontStyle}font-size:17px;line-height:1.6;color:${brand.neutral};margin:0 0 ${section.attribution ? "8px" : "0"};font-style:italic;">"${inline(section.text)}"</p>
        ${section.attribution ? `<p style="${bodyFontStyle}font-size:13px;color:${brand.textMuted};margin:0;">— ${escape(section.attribution)}</p>` : ""}
      </blockquote>`;

    case "callout": {
      const toneColor =
        section.tone === "warn" ? "#FFB020" : section.tone === "success" ? "#00D38A" : brand.secondary;
      return `<div style="margin:28px 0;padding:20px 24px;background:${brand.bgCardElevated};border:1px solid ${brand.border};border-left:3px solid ${toneColor};border-radius:12px;">
        ${section.title ? `<p style="${headerFontStyle}font-size:13px;color:${toneColor};margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">${escape(section.title)}</p>` : ""}
        <p style="${bodyFontStyle}font-size:16px;line-height:1.6;color:${brand.text};margin:0;">${inline(section.text)}</p>
      </div>`;
    }

    case "cta":
      return `<div style="margin:32px 0;text-align:center;">
        <a href="${section.href}" style="display:inline-block;padding:14px 32px;background:${brand.gradient};color:${brand.neutral};text-decoration:none;font-family:${brand.fontBody};font-size:16px;font-weight:600;border-radius:10px;letter-spacing:-0.01em;">${escape(section.text)} →</a>
      </div>`;

    case "image":
      return `<figure style="margin:28px 0;">
        <img src="${section.src}" alt="${escape(section.alt)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:12px;border:1px solid ${brand.border};"/>
        ${section.caption ? `<figcaption style="${bodyFontStyle}font-size:13px;color:${brand.textMuted};margin-top:8px;text-align:center;">${escape(section.caption)}</figcaption>` : ""}
      </figure>`;

    case "illustration":
      return `<figure style="margin:28px 0;">
        <div style="background:${brand.bgCard};border:1px solid ${brand.border};border-radius:16px;overflow:hidden;">
          ${illustration(section.name)}
        </div>
        ${section.caption ? `<figcaption style="${bodyFontStyle}font-size:13px;color:${brand.textMuted};margin-top:10px;text-align:center;">${escape(section.caption)}</figcaption>` : ""}
      </figure>`;

    case "divider":
      return `<div style="margin:40px 0;height:1px;background:linear-gradient(90deg, transparent 0%, ${brand.border} 50%, transparent 100%);"></div>`;

    case "metrics": {
      const cells = section.items
        .map(
          (m) => `<td align="center" valign="top" style="padding:20px 12px;background:${brand.bgCardElevated};border:1px solid ${brand.border};border-radius:12px;width:33.33%;">
            <div style="${headerFontStyle}font-size:32px;color:${brand.secondary};line-height:1;">${escape(m.value)}</div>
            <div style="${bodyFontStyle}font-size:12px;color:${brand.textMuted};margin-top:6px;text-transform:uppercase;letter-spacing:0.08em;">${escape(m.label)}</div>
          </td>`
        )
        .join(`<td style="width:12px;"></td>`);
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:28px 0;border-collapse:separate;"><tr>${cells}</tr></table>`;
    }

    case "html":
      return section.html;
  }
}

function renderHeader(content: NewsletterContent, cfg: RenderConfig): string {
  const logo = cfg.logoUrl
    ? `<img src="${cfg.logoUrl}" alt="Logo" width="56" height="56" style="display:block;width:56px;height:56px;border-radius:12px;"/>`
    : brandMark(56);

  const dateLabel = new Date(content.dateISO).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 36px;border-collapse:collapse;">
    <tr>
      <td valign="middle" style="width:56px;padding-right:14px;">${logo}</td>
      <td valign="middle">
        <div style="${headerFontStyle}font-size:22px;color:${brand.neutral};line-height:1;">Netswick Weekly</div>
        <div style="${bodyFontStyle}font-size:12px;color:${brand.textMuted};margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">Issue #${content.issueNumber} · ${dateLabel}${content.readTimeMinutes ? ` · ${content.readTimeMinutes} min read` : ""}</div>
      </td>
    </tr>
  </table>`;
}

function renderHero(content: NewsletterContent): string {
  return `<div style="margin:0 0 36px;padding:32px 28px;background:${brand.gradientSubtle};border:1px solid ${brand.border};border-radius:20px;">
    <h1 style="${headerFontStyle}font-size:36px;line-height:1.1;color:${brand.neutral};margin:0 0 12px;">${escape(content.title)}</h1>
    ${content.subtitle ? `<p style="${bodyFontStyle}font-size:17px;line-height:1.5;color:${brand.textMuted};margin:0;">${inline(content.subtitle)}</p>` : ""}
  </div>`;
}

function renderAuthor(cfg: RenderConfig): string {
  const avatar = cfg.avatarUrl
    ? `<img src="${cfg.avatarUrl}" alt="${escape(cfg.authorName)}" width="64" height="64" style="display:block;width:64px;height:64px;border-radius:50%;border:2px solid ${brand.secondary};"/>`
    : `<div style="width:64px;height:64px;border-radius:50%;background:${brand.gradient};display:inline-block;"></div>`;

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:48px 0 24px;border-collapse:collapse;">
    <tr>
      <td valign="middle" style="width:64px;padding-right:16px;">${avatar}</td>
      <td valign="middle">
        <div style="${headerFontStyle}font-size:18px;color:${brand.neutral};line-height:1.2;">Written by ${escape(cfg.authorName)}</div>
        <div style="${bodyFontStyle}font-size:14px;color:${brand.textMuted};margin-top:4px;">${escape(cfg.authorTitle)}</div>
      </td>
    </tr>
  </table>`;
}

function socialLink(href: string, label: string, svgPath: string): string {
  return `<a href="${href}" style="display:inline-block;width:40px;height:40px;margin:0 6px;background:${brand.bgCardElevated};border:1px solid ${brand.border};border-radius:10px;text-align:center;text-decoration:none;" aria-label="${label}">
    <span style="display:inline-block;vertical-align:middle;line-height:38px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${brand.secondary}" aria-hidden="true">${svgPath}</svg>
    </span>
  </a>`;
}

function renderFooter(cfg: RenderConfig): string {
  const linkedin = `<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>`;
  const youtube = `<path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/>`;
  const globe = `<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.9 9h-3.1a15.7 15.7 0 00-1.3-5.4A8 8 0 0119.9 11zM12 4c.9 0 2.3 2.2 2.8 5H9.2C9.7 6.2 11.1 4 12 4zM4.1 13h3.1c.2 1.9.6 3.8 1.3 5.4A8 8 0 014.1 13zm0-2a8 8 0 014.4-5.4A15.7 15.7 0 007.2 11H4.1zM12 20c-.9 0-2.3-2.2-2.8-5h5.6C14.3 17.8 12.9 20 12 20zm3.5-1.6a15.7 15.7 0 001.3-5.4h3.1a8 8 0 01-4.4 5.4z"/>`;

  return `<div style="margin:48px 0 8px;padding:32px 24px;background:${brand.bgCard};border:1px solid ${brand.border};border-radius:20px;text-align:center;">
    <div style="${headerFontStyle}font-size:16px;color:${brand.neutral};margin-bottom:16px;">Let's connect</div>
    <div style="margin-bottom:24px;">
      ${socialLink(cfg.linkedinUrl, "LinkedIn", linkedin)}
      ${socialLink(cfg.youtubeUrl, "YouTube", youtube)}
      ${socialLink(cfg.websiteUrl, "Website", globe)}
    </div>
    <p style="${bodyFontStyle}font-size:12px;color:${brand.textDim};margin:0;line-height:1.6;">
      You're receiving this because you subscribed at <a href="${cfg.websiteUrl}" style="color:${brand.textMuted};text-decoration:none;">netswick.com</a>.<br/>
      {{rp_unsubscribe_url}} — unsubscribe anytime.
    </p>
  </div>`;
}

export function render(content: NewsletterContent, cfg: RenderConfig): RenderResult {
  const body = content.sections.map(renderSection).join("\n");

  const inner = `
    ${renderHeader(content, cfg)}
    ${renderHero(content)}
    <div style="padding:0 4px;">${body}</div>
    ${renderAuthor(cfg)}
    ${renderFooter(cfg)}
  `;

  // This wrapper table is standard email practice and renders consistently in
  // Gmail, Outlook, Apple Mail. All visual styles are inline.
  const bodyContent = `<div style="background:${brand.bgPage};padding:24px 0;${bodyFontStyle}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td style="padding:32px 28px;background:${brand.bgPage};">
          ${inner}
        </td>
      </tr>
    </table>
  </div>`;

  const previewHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escape(content.subject)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet"/>
  <style>
    html,body{margin:0;padding:0;background:${brand.bgPage};}
    *{box-sizing:border-box;}
    a:hover{opacity:0.85;}
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;

  return { bodyContent, previewHtml };
}
