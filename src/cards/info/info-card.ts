import { Canvas, createCanvas, loadImage } from 'canvas';
import { BackgroundBaseColor, TextCard } from '../../interface/card.interface';
import { hexToRgbA } from '../../utils/hex-rgba';
import { rgbToHex } from '../../utils/rgb-hex';

export interface InfoCardParams {
    /**
     * Background color (if no background image is selected)
     */
    backgroundColor?: BackgroundBaseColor;
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
    public backgroundColor: BackgroundBaseColor = { background: '#FFF', waves: '#0CA7FF' };
    public backgroundImgURL?: string;
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
    setBackgroundColor(backgroundColor: BackgroundBaseColor): this {
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
     * Draws the content on the created canvas
     * @param ctx The context of the created canvas
     * @param canvasWidth Width of the created canvas
     * @param canvasHeight Height of the created canvas
     */
    async draw(ctx: any, canvasWidth: number, canvasHeight: number): Promise<void> {
        // Background
        if (this.backgroundImgURL) {
            try {
                const img = await loadImage(this.backgroundImgURL);
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            } catch (err) {
                throw new Error('Error loading the background image. The URL may be invalid.');
            }
        } else {
            ctx.fillStyle = this.backgroundColor.background;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            if (this.backgroundColor.waves) {
                let wavesColor: string = this.backgroundColor.waves;
                if (wavesColor.includes('rgb')) wavesColor = rgbToHex(wavesColor);

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 1);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 86.99);
                ctx.bezierCurveTo(11.52, 76.67, 27.2, 71.53, 42.87, 66.4);
                ctx.bezierCurveTo(49.97, 64.08, 57.07, 61.75, 63.77, 58.95);
                ctx.bezierCurveTo(86.14, 49.59, 104.18, 34.86, 120.84, 18.31);
                ctx.bezierCurveTo(126.92, 12.27, 132.81, 5.99, 138.2, 0);
                ctx.lineTo(0, 0);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 0.75);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 124.19);
                ctx.bezierCurveTo(3.45, 117.4, 7.67, 111.02, 12.87, 105.86);
                ctx.bezierCurveTo(24.54, 94.27, 41.13, 88.84, 57.71, 83.41);
                ctx.bezierCurveTo(64.81, 81.08, 71.9, 78.76, 78.61, 75.95);
                ctx.bezierCurveTo(100.98, 66.59, 119.01, 51.87, 135.68, 35.32);
                ctx.bezierCurveTo(148.04, 23.05, 159.58, 9.77, 167.84, 0);
                ctx.lineTo(0, 0);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 0.15);
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 198.88);
                ctx.lineTo(2.25, 184.95);
                ctx.bezierCurveTo(4.76, 169.43, 9.9, 138.5, 26.34, 121.72);
                ctx.bezierCurveTo(37.82, 110, 54.87, 105.24, 71.92, 100.48);
                ctx.bezierCurveTo(79.28, 98.43, 86.65, 96.37, 93.56, 93.76);
                ctx.bezierCurveTo(116.5, 85.08, 134.65, 70.36, 151.09, 53.58);
                ctx.bezierCurveTo(167.08, 37.25, 181.57, 18.97, 189.17, 9.38);
                ctx.lineTo(196.61, 0);
                ctx.lineTo(0, 0);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 1);
                ctx.moveTo(1000, 200);
                ctx.lineTo(830.32, 200);
                ctx.bezierCurveTo(839.51, 189.35, 850.88, 176.66, 862.89, 164.75);
                ctx.bezierCurveTo(883.05, 144.76, 904.86, 126.97, 931.92, 115.67);
                ctx.bezierCurveTo(940.03, 112.28, 948.62, 109.47, 957.2, 106.66);
                ctx.bezierCurveTo(972.31, 101.72, 987.43, 96.78, 1000, 88.66);
                ctx.lineTo(1000, 200);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 0.75);
                ctx.moveTo(1000, 200);
                ctx.lineTo(794.66, 200);
                ctx.lineTo(798.42, 195.53);
                ctx.bezierCurveTo(808.17, 183.92, 825.55, 163.21, 844.52, 144.45);
                ctx.bezierCurveTo(864.73, 124.46, 886.6, 106.68, 913.73, 95.37);
                ctx.bezierCurveTo(921.87, 91.98, 930.48, 89.18, 939.09, 86.37);
                ctx.bezierCurveTo(959.19, 79.81, 979.32, 73.25, 993.47, 59.25);
                ctx.bezierCurveTo(995.8, 56.94, 997.98, 54.43, 1000, 51.76);
                ctx.lineTo(1000, 200);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = hexToRgbA(wavesColor, 0.15);
                ctx.moveTo(1000, 200);
                ctx.lineTo(765.5, 200);
                ctx.lineTo(775.46, 187.07);
                ctx.bezierCurveTo(784.82, 175.15, 802.65, 152.45, 822.05, 132.36);
                ctx.bezierCurveTo(841.98, 111.73, 863.69, 93.88, 890.37, 84.18);
                ctx.bezierCurveTo(898.42, 81.26, 906.93, 79.09, 915.44, 76.92);
                ctx.bezierCurveTo(935.15, 71.9, 954.85, 66.88, 968.77, 52.47);
                ctx.bezierCurveTo(981.43, 39.36, 989.35, 18.55, 994.49, 0);
                ctx.lineTo(1000, 0);
                ctx.lineTo(1000, 200);
                ctx.fill();
                ctx.closePath();
            }
        }

        // Main TextCard
        if (this.mainText && this.mainText.color) {
            ctx.font = `800 76px '${this.mainText.font}'`;
            if (this.mainText.content.length > 80) {
                this.mainText.content = this.mainText.content.slice(0, 77) + '...';
            }
            ctx.fillStyle = this.mainText.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.mainText.content, 500, 100, 900);
        }
    }

    /**
     * Builds a Canvas with the specified parameters
     */
    async build(): Promise<Canvas> {
        const canvas = createCanvas(1000, 200);
        const ctx = canvas.getContext('2d');
        await this.draw(ctx, canvas.width, canvas.height);
        return canvas;
    }
}
