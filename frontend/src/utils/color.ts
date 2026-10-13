export const lightenColor = (hex: string, amount: number = 0.8) => {
    const cleanHex = hex.replace("#", "");
    const fullHex = cleanHex.length === 3
        ? cleanHex
            .split("")
            .map((char) => char + char)
            .join("")
        : cleanHex;

    const num = Number.parseInt(fullHex, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);

    return `#${[r, g, b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")}`;
};
