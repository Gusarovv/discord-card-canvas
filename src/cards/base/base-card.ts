import { Canvas, createCanvas, loadImage } from 'canvas';
import { resolve } from 'path';
import { Color, FontResolvable, TextCard } from '../../interface/card.interface';
const path = resolve(__dirname, '../../src/img');

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
    public avatarImgURL: string = `${path}/default-avatar.png`;
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
	 * Builds a Canvas with the specified parameters
	 */
    async build(): Promise<Canvas> {
        const canvas = createCanvas(800, 350);
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

        const textRender = (
            text: TextCard,
            type: 'nickname' | 'second' | 'main',
            maxLength: number,
            cpy: number,
        ) => {
            const font = text.font ? text.font : this.fontDefault;
            ctx.font = `33px '${font} ${type}'`;
            if (type === 'nickname') {
                ctx.font = `35px '${font} ${type}'`;
            } else if (type === 'main') {
                ctx.font = `48px '${font} ${type}'`;
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

        // Main TextCard
        if (this.mainText) {
            textRender(this.mainText, 'main', 40, 225);
        }

        // Nickname
        if (this.nicknameText) {
            textRender(this.nicknameText, 'nickname', 60, 265);
        }

        // Second text
        if (this.secondText) {
            textRender(this.secondText, 'second', 65, 310);
        }

        // Avatar Border
        ctx.beginPath();
        ctx.fillStyle = this.avatarBorderColor;
        ctx.arc(400, 100, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

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

        return canvas;
    }
}
