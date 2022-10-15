import { createCanvas, loadImage } from 'canvas';
import { Color, TextCard } from '../../interface/card.interface';

export interface InfoCardParams {
	/**
	 * Background color (if no background image is selected)
	 */
    backgroundColor?: Color;
	/**
	 * URL to the background image (1000x200 px)
	 */
    backgroundImgURL?: string;
	/**
	 * The main text on the card
	 */
    mainText?: TextCard;
}

export class InfoCardBuilder {
    public backgroundImgURL?: string;
    public backgroundColor: Color = '#bbe8ff';
    public mainText?: TextCard;

    constructor(params?: InfoCardParams) {
        if (!params) return;
        if (params.backgroundImgURL) this.backgroundImgURL = params.backgroundImgURL;
        if (params.backgroundColor) this.backgroundColor = params.backgroundColor;
        if (params.mainText) {
            this.mainText = params.mainText;
            if (!this.mainText.color) this.mainText.color = '#0CA7FF';
            if (!this.mainText.font) this.mainText.font = 'Inter';
        }
    }

	/**
	 * Sets the background color of this card (if no background image is selected)
	 * @param backgroundColor Background color
	 */
    setBackgroundColor(backgroundColor: Color): this {
        this.backgroundColor = backgroundColor;
        return this;
    }


	/**
	 * URL to the background image
	 * @remark Image size 1000x200px
	 * @param backgroundImgURL URL to the background image
	 */
    setBackgroundImgURL(backgroundImgURL: string): this {
        this.backgroundImgURL = backgroundImgURL;
        return this;
    }

	/**
	 * Sets the main text (for example, "Info")
	 * @param mainText The main text on the card
	 */
    setMainText(mainText: TextCard): this {
        this.mainText = mainText;
        return this;
    }

	/**
	 * Builds a Canvas with the specified parameters
	 */
    async build() {
        const canvas = createCanvas(1000, 200);
        const ctx = canvas.getContext('2d');

        // Background
        if (this.backgroundImgURL) {
            try {
                const img = await loadImage(this.backgroundImgURL);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch (err) {
                throw new Error('Error loading the background image. The URL may be invalid.');
            }
        } else {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Main TextCard
        if (this.mainText && this.mainText.color) {
            ctx.font = `76px '${this.mainText.font} main'`;
            if (this.mainText.content.length > 80) {
                this.mainText.content = this.mainText.content.slice(0, 77) + '...';
            }
            ctx.fillStyle = this.mainText.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.mainText.content, 500, 100, 900);
        }

        return canvas;
    }
}
