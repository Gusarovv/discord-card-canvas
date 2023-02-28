/**
 * Color conversion from rgb | rgba to hex
 * @param rgb rgb or rgba
 * @returns hex (with "#")
 */
export const rgbToHex = (rgb: string): string => {
    let matchColors = /(rgb|rgba)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/;
    const match: any[] | null = matchColors.exec(rgb);
    if (match !== null) {
        return (
            '#' + ((1 << 24) | (match[2] << 16) | (match[3] << 8) | match[4]).toString(16).slice(1)
        );
    }
    throw new Error('Bad Rgb');
};
