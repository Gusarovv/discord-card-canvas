import { registerFont } from 'canvas';
import { resolve } from 'path';

const registeredFonts = new Set<string>();

/**
 * Loads a single font if it is not already registered.
 * @param fontPath Path to the font file.
 * @param fontFace Object containing font family, weight, and style.
 */
export function loadFont(
  fontPath: string,
  fontFace: { family: string; weight?: string; style?: string },
) {
  const fontKey = `${fontFace.family}-${fontFace.weight || 'normal'}-${
    fontFace.style || 'normal'
  }-${fontPath}`;

  if (registeredFonts.has(fontKey)) {
    return; // Font already registered
  }
  registerFont(fontPath, fontFace);
  registeredFonts.add(fontKey);
}

export type FontDescriptor = {
  path: string; // Relative path to the font file
  family: string; // Font family name
  weight?: string; // Font weight ('300', '400', '700', etc.)
  style?: string; // Font style ('normal', 'italic', etc.)
};

/**
 * Registers a group of fonts.
 * @param fonts Array of FontDescriptor objects.
 * @param basePath Base path for all fonts (optional).
 */
export function loadFonts(fonts: FontDescriptor[], basePath: string = __dirname): void {
  fonts.forEach((font) => {
    const fontPath = resolve(basePath, font.path);
    try {
      loadFont(fontPath, { family: font.family, weight: font.weight, style: font.style });
    } catch (error) {
      console.error(`Failed to register font: ${font.family}, weight: ${font.weight}`, error);
    }
  });
}
