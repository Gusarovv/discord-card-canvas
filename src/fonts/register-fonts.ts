import { registerFont } from 'canvas';

/**
 * Registers fonts needed to create cards
 * @remark For the browser, you need to use the import url fonts
 */
export function registerFonts() {

	// Required for initialization in the browser
	// For the browser, use the @import url
	if(!registerFont) {
		// Skipping font registration. For the browser, use the @import url');
		return;
	};


	// Nunito
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/Nunito/Nunito-SemiBold.ttf`, {
        family: 'Nunito',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/Nunito/Nunito-Bold.ttf`, {
        family: 'Nunito',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/Nunito/Nunito-ExtraBold.ttf`, {
        family: 'Nunito',
        weight: '800',
        style: 'normal',
    });

    // Manrope
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&display=swap');
    registerFont(`${__dirname}/Manrope/Manrope-SemiBold.ttf`, {
        family: 'Manrope',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/Manrope/Manrope-Bold.ttf`, {
        family: 'Manrope',
        weight: '700',
        style: 'normal',
    });
    registerFont(`${__dirname}/Manrope/Manrope-ExtraBold.ttf`, {
        family: 'Manrope',
        weight: '800',
        style: 'normal',
    });

	// Open Sans
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/OpenSans/OpenSans-SemiBold.ttf`, {
        family: 'Open Sans',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/OpenSans/OpenSans-Bold.ttf`, {
        family: 'Open Sans',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/OpenSans/OpenSans-ExtraBold.ttf`, {
        family: 'Open Sans',
        weight: '800',
        style: 'normal',
    });

    // Inter
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/Inter/Inter-SemiBold.ttf`, {
        family: 'Inter',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/Inter/Inter-Bold.ttf`, {
        family: 'Inter',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/Inter/Inter-ExtraBold.ttf`, {
        family: 'Inter',
        weight: '800',
        style: 'normal',
    });

    // Raleway
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/Raleway/Raleway-SemiBold.ttf`, {
        family: 'Raleway',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/Raleway/Raleway-Bold.ttf`, {
        family: 'Raleway',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/Raleway/Raleway-ExtraBold.ttf`, {
        family: 'Raleway',
        weight: '800',
        style: 'normal',
    });

    // Roboto Slab
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/RobotoSlab/RobotoSlab-SemiBold.ttf`, {
        family: 'Roboto Slab',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/RobotoSlab/RobotoSlab-Bold.ttf`, {
        family: 'Roboto Slab',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/RobotoSlab/RobotoSlab-ExtraBold.ttf`, {
        family: 'Roboto Slab',
        weight: '800',
        style: 'normal',
    });

    // Spectral SC
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Spectral+SC:wght@600;700;800&display=swap');
	registerFont(`${__dirname}/SpectralSC/SpectralSC-SemiBold.ttf`, {
        family: 'Spectral SC',
        weight: '600',
        style: 'normal',
    });
	registerFont(`${__dirname}/SpectralSC/SpectralSC-Bold.ttf`, {
        family: 'Spectral SC',
        weight: '700',
        style: 'normal',
    });
	registerFont(`${__dirname}/SpectralSC/SpectralSC-ExtraBold.ttf`, {
        family: 'Spectral SC',
        weight: '800',
        style: 'normal',
    });
	
    // Bellota
	// Use on the web:
	// @import url('https://fonts.googleapis.com/css2?family=Bellota:wght@400;700&display=swap');
	registerFont(`${__dirname}/Bellota/Bellota-Bold.ttf`, {
        family: 'Bellota',
        weight: '700',
        style: 'normal',
    });
}
