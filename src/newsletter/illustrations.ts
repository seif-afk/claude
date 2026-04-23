import { brand } from "./brand";
import type { IllustrationName } from "./types";

// Inline-SVG illustrations keyed by name. Each returns a self-contained SVG
// string using only inline attributes (no <style> blocks) so beehiiv does not
// strip anything. SVG renders in Apple Mail, iOS Mail, Outlook 2016+, and
// webmail; Gmail app still shows it as a block when embedded as a data URI
// on <img>. To be safe we also expose `asDataUri()` for <img src="data:..."/>.

export function illustration(name: IllustrationName): string {
  switch (name) {
    case "rocket":
      return rocket();
    case "graph":
      return graph();
    case "network":
      return network();
    case "spark":
      return spark();
    case "bolt":
      return bolt();
    case "target":
      return target();
  }
}

export function illustrationDataUri(name: IllustrationName): string {
  const svg = illustration(name);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const base = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="auto" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${brand.primary}"/>
        <stop offset="100%" stop-color="${brand.secondary}"/>
      </linearGradient>
      <linearGradient id="gSoft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${brand.primary}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${brand.primary}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="240" rx="16" ry="16" fill="${brand.bgCardElevated}"/>
    <rect x="0" y="0" width="400" height="240" rx="16" ry="16" fill="url(#gSoft)"/>
    ${body}
  </svg>`;

function rocket() {
  return base(`
    <g transform="translate(200 120)">
      <path d="M-10,-60 C20,-60 40,-30 40,10 L20,30 L-20,30 L-40,10 C-40,-30 -20,-60 -10,-60 Z"
        fill="url(#g)"/>
      <circle cx="0" cy="-20" r="10" fill="${brand.neutral}" opacity="0.95"/>
      <path d="M-20,30 L-30,55 L-10,40 Z" fill="${brand.secondary}"/>
      <path d="M20,30 L30,55 L10,40 Z" fill="${brand.primary}"/>
      <path d="M-6,30 Q0,55 6,30 Z" fill="${brand.neutral}" opacity="0.8"/>
    </g>
    <circle cx="70" cy="50" r="2" fill="${brand.neutral}" opacity="0.8"/>
    <circle cx="330" cy="70" r="3" fill="${brand.secondary}" opacity="0.9"/>
    <circle cx="340" cy="180" r="2" fill="${brand.neutral}" opacity="0.6"/>
    <circle cx="60" cy="190" r="2.5" fill="${brand.secondary}" opacity="0.7"/>
  `);
}

function graph() {
  const pts = [
    [40, 190],
    [90, 160],
    [140, 170],
    [190, 120],
    [240, 130],
    [290, 80],
    [340, 50],
  ];
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L340,210 L40,210 Z`;
  return base(`
    <path d="${area}" fill="url(#g)" opacity="0.22"/>
    <path d="${path}" fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="4" fill="${brand.neutral}" stroke="${brand.primary}" stroke-width="2"/>`
      )
      .join("")}
    <g stroke="${brand.border}" stroke-width="1" stroke-dasharray="2 4" opacity="0.5">
      <line x1="40" y1="210" x2="360" y2="210"/>
      <line x1="40" y1="30" x2="40" y2="210"/>
    </g>
  `);
}

function network() {
  const nodes = [
    [200, 120, 18],
    [100, 70, 10],
    [300, 70, 10],
    [80, 170, 9],
    [320, 170, 9],
    [200, 40, 8],
    [200, 200, 8],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 5],
    [2, 5],
    [3, 6],
    [4, 6],
  ];
  return base(`
    <g stroke="url(#g)" stroke-width="1.5" opacity="0.55">
      ${edges
        .map(
          ([a, b]) =>
            `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`
        )
        .join("")}
    </g>
    ${nodes
      .map(
        ([x, y, r], i) =>
          `<circle cx="${x}" cy="${y}" r="${r}" fill="${i === 0 ? "url(#g)" : brand.bgCard}" stroke="${brand.secondary}" stroke-width="${i === 0 ? 0 : 2}"/>`
      )
      .join("")}
  `);
}

function spark() {
  return base(`
    <g transform="translate(200 120)">
      <path d="M0,-70 L14,-14 L70,0 L14,14 L0,70 L-14,14 L-70,0 L-14,-14 Z" fill="url(#g)"/>
      <path d="M0,-34 L6,-6 L34,0 L6,6 L0,34 L-6,6 L-34,0 L-6,-6 Z" fill="${brand.neutral}" opacity="0.9"/>
    </g>
    <circle cx="80" cy="60" r="2" fill="${brand.neutral}" opacity="0.7"/>
    <circle cx="320" cy="180" r="2" fill="${brand.neutral}" opacity="0.5"/>
    <circle cx="340" cy="50" r="3" fill="${brand.secondary}" opacity="0.8"/>
  `);
}

function bolt() {
  return base(`
    <g transform="translate(200 120)">
      <path d="M-20,-70 L30,-70 L10,-10 L40,-10 L-25,70 L-5,10 L-35,10 Z"
        fill="url(#g)" stroke="${brand.neutral}" stroke-width="1.5" stroke-linejoin="round"/>
    </g>
    <circle cx="340" cy="70" r="3" fill="${brand.secondary}"/>
    <circle cx="70" cy="190" r="2" fill="${brand.neutral}" opacity="0.6"/>
  `);
}

function target() {
  return base(`
    <g transform="translate(200 120)">
      <circle r="80" fill="none" stroke="${brand.primary}" stroke-width="2" opacity="0.5"/>
      <circle r="55" fill="none" stroke="${brand.secondary}" stroke-width="2" opacity="0.7"/>
      <circle r="30" fill="none" stroke="url(#g)" stroke-width="2.5"/>
      <circle r="8" fill="url(#g)"/>
      <line x1="-90" y1="0" x2="-70" y2="0" stroke="${brand.textMuted}" stroke-width="1"/>
      <line x1="70" y1="0" x2="90" y2="0" stroke="${brand.textMuted}" stroke-width="1"/>
      <line x1="0" y1="-90" x2="0" y2="-70" stroke="${brand.textMuted}" stroke-width="1"/>
      <line x1="0" y1="70" x2="0" y2="90" stroke="${brand.textMuted}" stroke-width="1"/>
    </g>
  `);
}

// Brand "n" mark, used in the header when no logo URL is configured.
export function brandMark(size = 56): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Logo">
    <defs>
      <linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${brand.secondary}"/>
        <stop offset="100%" stop-color="${brand.primary}"/>
      </linearGradient>
    </defs>
    <path d="M50 6 L94 50 L50 94 L6 50 Z" fill="url(#logoG)"/>
    <text x="50" y="68" text-anchor="middle" font-family="${brand.fontHeader}"
      font-size="56" font-weight="700" fill="${brand.neutral}">n</text>
  </svg>`;
}
