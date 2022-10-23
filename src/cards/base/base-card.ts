import { Canvas, createCanvas, loadImage } from 'canvas';
import { BorderStyle, Color, FontResolvable, TextCard } from '../../interface/card.interface';

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
     * Background color; Default: '#BBE8FF'
     */
    backgroundColor?: Color;
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

/**
 * Base Card Builder
 */
export class BaseCardBuilder {
    public mainText?: TextCard;
    public nicknameText?: TextCard;
    public secondText?: TextCard;
    public backgroundImgURL?: string;
    public backgroundColor: Color = '#bbe8ff';
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
    setBackgroundColor(backgroundColor: Color): this {
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
     * @param only Objects (name) that will only be drawn
     * @remark only: "background" | "mainText" | "nickname" | "secondText" | "avatarBorder" | "avatar"
     */
    async draw(
        ctx: any,
        canvasWidth: number,
        canvasHeight: number,
        only?: string[],
    ): Promise<void> {
        if (!only || only?.includes('background')) {
            ctx.save();
            // Background
            if (this.backgroundImgURL) {
                try {
                    const img = await loadImage(this.backgroundImgURL);
                    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                } catch (err) {
                    throw new Error('Error loading the background image. The URL may be invalid.');
                }
            } else {
                ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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

        if (!only || only?.includes('mainText')) {
            // Main TextCard
            if (this.mainText) {
                textRender(this.mainText, 'main', 40, 225);
            }
        }

        if (!only || only?.includes('nickname')) {
            // Nickname
            if (this.nicknameText) {
                textRender(this.nicknameText, 'nickname', 60, 265);
            }
        }

        if (!only || only?.includes('secondText')) {
            // Second text
            if (this.secondText) {
                textRender(this.secondText, 'second', 65, 310);
            }
        }

        if (!only || only?.includes('avatarBorder')) {
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
            !only ||
            only?.includes('avatar') ||
            (only?.includes('avatarBorder') && this.avatarBorderStyle === 'fill')
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
    async build(): Promise<Canvas> {
        const canvas = createCanvas(800, 350);
        const ctx = canvas.getContext('2d');
        await this.draw(ctx, canvas.width, canvas.height);
        return canvas;
    }
}
