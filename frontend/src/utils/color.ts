/** Clareia uma cor hex misturando-a com branco (`amount` de 0 a 1). */
export function lightenColor(hex: string, amount = 0.8): string {
  let clean = hex.replace("#", "");
  if (clean.length === 3) clean = [...clean].map((c) => c + c).join("");

  const num = Number.parseInt(clean, 16);
  const channels = [(num >> 16) & 255, (num >> 8) & 255, num & 255];

  return `#${channels
    .map((c) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}
