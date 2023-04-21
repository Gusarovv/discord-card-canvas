import { Canvas, createCanvas, loadImage } from 'canvas';
import {
    BackgroundBaseColor,
    BorderStyle,
    Color,
    FontResolvable,
    TextCard,
} from '../../interface/card.interface';
import { hexToRgbA } from '../../utils/hex-rgba';
import { rgbToHex } from '../../utils/rgb-hex';

/**
 * Base Card Parameters
 */
export interface BaseCardParams {
    /**
     * Text above the user's nickname
     */
    mainText?: TextCard;
    /**
     * User's nickname
     */
    nicknameText?: TextCard;
    /**
     * Text under the user's nickname
     */
    secondText?: TextCard;
    /**
     * Background color; Default: '#0CA7FF' | 'waves'
     */
    backgroundColor?: BackgroundBaseColor;
    /**
     * URL to the background image (800x350 px)
     */
    backgroundImgURL?: string;
    /**
     * URL to the avatar user image
     */
    avatarImgURL?: string;
    /**
     * The outline color of the user's avatar; Default: '#0CA7FF'
     */
    avatarBorderColor?: Color;
    /**
     * Border type for avatar ('fill' fits transparent avatars)
     */
    avatarBorderStyle?: BorderStyle;
    /**
     * Default font (applies if a specific font is not selected in the TextCard object); Default: 'Nunito'
     */
    fontDefault?: FontResolvable;
    /**
     * Default text color (applies if a specific text color is not selected in the Text Card object); Default: '#0CA7FF'
     */
    colorTextDefault?: Color;
}

type OptionsDraw = {
    /**
     * Objects (name) that will only be drawn
     * @remark only: "background" | "mainText" | "nickname" | "secondText" | "avatarBorder" | "avatar"
     */
    only?: string[];
    /**
     * Sets show, the image size should be resized so that it fits the canvas
     * @remark default 'fill'
     */
    objectFit?: 'fill' | 'cover';
};

/**
 * Base Card Builder
 */
export class BaseCardBuilder {
    public mainText?: TextCard;
    public nicknameText?: TextCard;
    public secondText?: TextCard;
    public backgroundImgURL?: string;
    public backgroundColor: BackgroundBaseColor = { background: '#FFF', waves: '#0CA7FF' };
    public avatarBorderStyle?: BorderStyle;
    public avatarImgURL?: string;
    public avatarBorderColor: Color = '#0CA7FF';
    public fontDefault: FontResolvable = 'Nunito';
    public colorTextDefault: Color = '#0CA7FF';

    constructor(params?: BaseCardParams) {
        if (!params) return;
        if (params.mainText) this.mainText = params.mainText;
        if (params.nicknameText) this.nicknameText = params.nicknameText;
        if (params.secondText) this.secondText = params.secondText;
        if (params.backgroundImgURL) this.backgroundImgURL = params.backgroundImgURL;
        if (params.backgroundColor) this.backgroundColor = params.backgroundColor;
        if (params.avatarImgURL) this.avatarImgURL = params.avatarImgURL;
        if (params.avatarBorderColor) this.avatarBorderColor = params.avatarBorderColor;
        if (params.avatarBorderStyle) this.avatarBorderStyle = params.avatarBorderStyle;
        if (params.fontDefault) this.fontDefault = params.fontDefault;
        if (params.colorTextDefault) this.colorTextDefault = params.colorTextDefault;
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
     * Sets the background image of this card
     * @remark Image size 800x350px
     * @param backgroundImgURL URL to the background image
     */
    setBackgroundImgURL(backgroundImgURL: string): this {
        this.backgroundImgURL = backgroundImgURL;
        return this;
    }

    /**
     * Sets the avatar image of this card
     * @param avatarImgURL URL to the avatar user image
     */
    setAvatarImgURL(avatarImgURL: string): this {
        this.avatarImgURL = avatarImgURL;
        return this;
    }

    /**
     * Sets the border color of the avatar of this card
     * @param avatarBorderColor The outline color of the user's avatar
     */
    setAvatarBorderColor(avatarBorderColor: Color): this {
        this.avatarBorderColor = avatarBorderColor;
        return this;
    }

    /**
     * Sets the default font
     * @param fontDefault Default font
     */
    setFontDefault(fontDefault: FontResolvable): this {
        this.fontDefault = fontDefault;
        return this;
    }

    /**
     * Sets the default text color
     * @param colorTextDefault Default text color
     */
    setColorTextDefault(colorTextDefault: Color): this {
        this.colorTextDefault = colorTextDefault;
        return this;
    }

    /**
     * Sets the main text (for example, "Welcome")
     * @param mainText Text above the user's nickname
     */
    setMainText(mainText: TextCard): this {
        this.mainText = mainText;
        return this;
    }

    /**
     * Sets the user's nickname
     * @param nicknameText User's nickname
     */
    setNicknameText(nicknameText: TextCard): this {
        this.nicknameText = nicknameText;
        return this;
    }

    /**
     * Sets the text under the nickname
     * @param secondText Text under the user's nickname
     */
    setSecondText(secondText: TextCard): this {
        this.secondText = secondText;
        return this;
    }

    /**
     * Draws the content on the created canvas
     * @param ctx The context of the created canvas
     * @param canvasWidth Width of the created canvas
     * @param canvasHeight Height of the created canvas
     * @param options Additional options
     */
    async draw(
        ctx: any,
        canvasWidth: number,
        canvasHeight: number,
        options?: OptionsDraw,
    ): Promise<void> {
        if (!options?.only || options.only.includes('background')) {
            ctx.save();
            // Background
            if (this.backgroundImgURL) {
                try {
                    const img = await loadImage(this.backgroundImgURL);
                    if (options?.objectFit === 'cover') {
                        // Default offset is center
                        let offsetX = 0.5;
                        let offsetY = 0.5;

                        // [0.0, 1.0]
                        if (offsetX < 0) offsetX = 0;
                        if (offsetY < 0) offsetY = 0;
                        if (offsetX > 1) offsetX = 1;
                        if (offsetY > 1) offsetY = 1;

                        let iw = img.width,
                            ih = img.height,
                            r = Math.min(canvasWidth / iw, canvasHeight / ih),
                            nw = iw * r, // new prop. width
                            nh = ih * r, // new prop. height
                            cx: number,
                            cy: number,
                            cw: number,
                            ch: number,
                            ar: number = 1;

                        // Decide which gap to fill
                        if (nw < canvasWidth) ar = canvasWidth / nw;
                        if (Math.abs(ar - 1) < 1e-14 && nh < canvasHeight) ar = canvasHeight / nh; // updated
                        nw *= ar;
                        nh *= ar;

                        // Calc source rectangle
                        cw = iw / (nw / canvasWidth);
                        ch = ih / (nh / canvasHeight);

                        cx = (iw - cw) * offsetX;
                        cy = (ih - ch) * offsetY;

                        // Make sure source rectangle is valid
                        if (cx < 0) cx = 0;
                        if (cy < 0) cy = 0;
                        if (cw > iw) cw = iw;
                        if (ch > ih) ch = ih;

                        // Cover
                        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, canvasWidth, canvasHeight);
                    } else {
                        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    }
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
                    ctx.moveTo(0, 120);
                    ctx.bezierCurveTo(25.6, 97.9, 64.94, 91.49, 97, 77);
                    ctx.bezierCurveTo(132.43, 63.25, 160.64, 40.33, 186.02, 14.94);
                    ctx.lineTo(200.64, 0);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(0, 120);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = hexToRgbA(wavesColor, 0.74);
                    ctx.moveTo(0, 176.82);
                    ctx.bezierCurveTo(5.2, 166.79, 11.53, 157.36, 19.25, 149.64);
                    ctx.bezierCurveTo(44.99, 123.9, 86.24, 117.9, 120.8, 103.45);
                    ctx.bezierCurveTo(155.35, 88.99, 183.21, 66.07, 208.95, 40.68);
                    ctx.bezierCurveTo(223.68, 28.13, 247.85, 1, 247.85, 0);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(0, 176.82);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = hexToRgbA(wavesColor, 0.15);
                    ctx.moveTo(0, 290.92);
                    ctx.lineTo(3.01, 272.34);
                    ctx.bezierCurveTo(6.88, 248.37, 14.64, 200.41, 40.03, 174.67);
                    ctx.bezierCurveTo(65.42, 148.93, 108.43, 144.7, 144.05, 131.3);
                    ctx.bezierCurveTo(179.66, 117.9, 207.52, 95.34, 232.9, 69.24);
                    ctx.bezierCurveTo(258.17, 43.63, 280.99, 14.87, 292.67, 0);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(0, 290.92);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = hexToRgbA(wavesColor, 1);
                    ctx.moveTo(800, 350);
                    ctx.lineTo(659.54, 350);
                    ctx.bezierCurveTo(682.24, 320.97, 707.11, 294.92, 739.63, 276.46);
                    ctx.bezierCurveTo(749.37, 270.94, 790.48, 251.69, 800, 246.35);
                    ctx.lineTo(800, 350);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = hexToRgbA(wavesColor, 0.74);
                    ctx.moveTo(800, 350);
                    ctx.lineTo(615.84, 350);
                    ctx.bezierCurveTo(656.4, 297.84, 681.28, 271.8, 713.8, 253.34);
                    ctx.bezierCurveTo(723.54, 247.81, 733.95, 242.94, 744.38, 238.06);
                    ctx.bezierCurveTo(764.54, 228.62, 784.71, 219.18, 800, 205.01);
                    ctx.lineTo(800, 350);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = hexToRgbA(wavesColor, 0.15);
                    ctx.moveTo(800, 350);
                    ctx.lineTo(572.33, 350);
                    ctx.bezierCurveTo(581.96, 335, 593.86, 317.27, 606.73, 300.64);
                    ctx.bezierCurveTo(628.78, 271.74, 653.69, 246.04, 687.39, 228.51);
                    ctx.bezierCurveTo(697.45, 223.28, 708.25, 218.78, 719.05, 214.28);
                    ctx.bezierCurveTo(744.45, 203.69, 769.82, 193.12, 785.32, 173.09);
                    ctx.bezierCurveTo(791.77, 164.75, 796.51, 154.72, 800, 144.08);
                    ctx.lineTo(800, 350);
                    ctx.fill();
                    ctx.closePath();
                }
            }
            ctx.restore();
        }

        const textRender = (
            text: TextCard,
            type: 'nickname' | 'second' | 'main',
            maxLength: number,
            cpy: number,
        ) => {
            const font = text.font ? text.font : this.fontDefault;
            ctx.font = `600 33px '${font}'`;
            if (type === 'nickname') {
                ctx.font = `700 35px '${font}'`;
            } else if (type === 'main') {
                ctx.font = `800 48px '${font}'`;
                text.content = text.content.toUpperCase();
            }
            if (text.content.length > maxLength) {
                text.content = text.content.slice(0, maxLength - 3) + '...';
            }

            const textColor = text.color ? text.color : this.colorTextDefault;
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.fillText(text.content, 400, cpy, 800);
        };

        if (!options?.only || options.only.includes('mainText')) {
            // Main TextCard
            if (this.mainText) {
                textRender(this.mainText, 'main', 40, 225);
            }
        }

        if (!options?.only || options.only.includes('nickname')) {
            // Nickname
            if (this.nicknameText) {
                textRender(this.nicknameText, 'nickname', 60, 265);
            }
        }

        if (!options?.only || options.only.includes('secondText')) {
            // Second text
            if (this.secondText) {
                textRender(this.secondText, 'second', 65, 310);
            }
        }

        if (!options?.only || options.only.includes('avatarBorder')) {
            // Avatar Border
            ctx.save();
            ctx.beginPath();
            if (this.avatarBorderStyle === 'stroke') {
                ctx.strokeStyle = this.avatarBorderColor;
                ctx.lineWidth = 5;
                ctx.arc(400, 100, 77.5, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                ctx.fillStyle = this.avatarBorderColor;
                ctx.arc(400, 100, 80, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.closePath();
            ctx.restore();
        }

        if (
            !options?.only ||
            options.only.includes('avatar') ||
            (options.only.includes('avatarBorder') && this.avatarBorderStyle === 'fill')
        ) {
            if (this.avatarImgURL) {
                ctx.save();
                // Avatar
                ctx.beginPath();
                ctx.arc(400, 100, 75, 0, Math.PI * 2, true);
                ctx.clip();
                try {
                    const img = await loadImage(this.avatarImgURL);
                    ctx.drawImage(img, 325, 25, 150, 150);
                } catch (err) {
                    throw new Error('Error loading the avatar image. The URL may be invalid.');
                }
                ctx.closePath();
                ctx.restore();
            }
        }
    }

    /**
     * Builds a Canvas with the specified parameters
     */
    async build(options?: OptionsDraw): Promise<Canvas> {
        const canvas = createCanvas(800, 350);
        const ctx = canvas.getContext('2d');
        await this.draw(ctx, canvas.width, canvas.height, options);
        return canvas;
    }
}
