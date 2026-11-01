/**
 * Color conversion from hex, rgb or rgba to rgba
 * @param color hex (3, 4, 6 or 8 digits), rgb or rgba color, its alpha is ignored
 * @param opacity alpha of the result (default 1)
 * @returns rgba
 */
export const hexToRgbA = (color: string, opacity = 1): string => {
  const rgbMatch = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/.exec(color);
  if (rgbMatch) return `rgba(${+rgbMatch[1]},${+rgbMatch[2]},${+rgbMatch[3]},${opacity})`;
  const hexMatch = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.exec(color);
  if (!hexMatch) {
    throw new Error(
      `Bad Hex: ${JSON.stringify(color)} is not a supported hex, rgb() or rgba() color`,
    );
  }
  const digits = hexMatch[1].length <= 4 ? hexMatch[1].replace(/./g, '$&$&') : hexMatch[1];
  const rgbNumber = parseInt(digits.slice(0, 6), 16);
  return `rgba(${(rgbNumber >> 16) & 255},${(rgbNumber >> 8) & 255},${rgbNumber & 255},${opacity})`;
};
