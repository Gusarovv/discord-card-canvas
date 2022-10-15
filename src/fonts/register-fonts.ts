import { registerFont } from 'canvas';
import { resolve } from 'path';

/**
 * Registers fonts needed to create cards
 */
export function registerFonts() {
    const path = resolve(__dirname, '../../src/fonts');

    // Nunito
    registerFont(`${path}/Nunito/Nunito-Black.ttf`, { family: 'Nunito main' });
    registerFont(`${path}/Nunito/Nunito-ExtraBold.ttf`, { family: 'Nunito nickname' });
    registerFont(`${path}/Nunito/Nunito-Bold.ttf`, { family: 'Nunito second' });

    // Manrope
    registerFont(`${path}/Manrope/Manrope-ExtraBold.ttf`, { family: 'Manrope main' });
    registerFont(`${path}/Manrope/Manrope-Bold.ttf`, { family: 'Manrope nickname' });
    registerFont(`${path}/Manrope/Manrope-SemiBold.ttf`, { family: 'Manrope second' });

    // Inter
    registerFont(`${path}/Inter/Inter-Black.ttf`, { family: 'Inter main' });
    registerFont(`${path}/Inter/Inter-ExtraBold.ttf`, { family: 'Inter nickname' });
    +registerFont(`${path}/Inter/Inter-Bold.ttf`, { family: 'Inter second' });
}
