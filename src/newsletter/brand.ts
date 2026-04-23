export const brand = {
  // Brand palette (from user-supplied brand assets)
  primary: "#0022EE",
  secondary: "#00A8FF",
  tertiary: "#052349",
  neutral: "#FFFFFF",

  // Dark-mode surfaces derived from the palette
  bgPage: "#05070F",
  bgCard: "#0B1124",
  bgCardElevated: "#111A35",
  border: "#1B2A55",
  borderSoft: "#162142",

  // Typography colors
  text: "#F4F6FF",
  textMuted: "#9AA7CC",
  textDim: "#6B7AA8",
  link: "#00A8FF",

  // Gradients
  gradient: "linear-gradient(135deg, #0022EE 0%, #00A8FF 100%)",
  gradientSubtle: "linear-gradient(135deg, rgba(0,34,238,0.18) 0%, rgba(0,168,255,0.10) 100%)",

  // Fonts (headers use DynaPuff via preview stylesheet; beehiiv strips <style> so we
  // always declare a complete stack inline so fallbacks look intentional).
  fontHeader:
    "'DynaPuff', 'Baloo 2', 'Chalkboard SE', 'Comic Sans MS', system-ui, sans-serif",
  fontBody:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

export type Brand = typeof brand;
