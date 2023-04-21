import { Canvas, createCanvas, loadImage } from 'canvas';
import {
    BackgroundRankColor,
    Color,
    FontResolvable,
    TextCard,
    UserStatus,
} from '../../../interface/card.interface';
import { hexToRgbA } from '../../../utils/hex-rgba';

export interface RankCardParams {
    /**
     * User's nickname
     */
    nicknameText: TextCard;
    /**
     * The user's current level
     */
    currentLvl: number;
    /**
     * The user's current rank
     */
    currentRank: number;
    /**
     * The user's current experience
     */
    currentXP: number;
    /**
     * Required experience to the next level
     */
    requiredXP: number;
    /**
     * User status
     */
    userStatus: UserStatus;
    /**
     * The color of the current experience number; Default: '#0CA7FF'
     */
    currentXPColor?: Color;
    /**
     * The color of the required experience number; Default: '#7F8384'
     */
    requiredXPColor?: Color;
    /**
     * URL to the background image (1000x250 px)
     */
    backgroundImgURL?: string;
    /**
     * Background color; Default: '#0CA7FF' | 'bubbles'
     */
    backgroundColor?: BackgroundRankColor;
    /**
     * URL to the avatar user image
     */
    avatarImgURL?: string;
    /**
     * The color of the circle behind the avatar; Default: '#0CA7FF'
     */
    avatarBackgroundColor?: Color;
    /**
     * Whether the circle behind the avatar is enabled; Default: True
     */
    avatarBackgroundEnable?: boolean;
    /**
     * The color of the progress bar
     */
    progressBarColor?: Color;
    /**
     * Default font. Applies if a specific font is not selected in the TextCard object; Default: 'Nunito'
     */
    fontDefault?: FontResolvable;
    /**
     * Default text color. Applies if a specific text color is not selected in the Text Card object; Default: '#0CA7FF'
     */
    colorTextDefault?: Color;
    /**
     * Text before the level number; Default: 'LVL'
     */
    lvlPrefix?: TextCard;
    /**
     * Text before the rank number; Default: 'RANK'
     */
    rankPrefix?: TextCard;
}

type OptionsDraw = {
    /**
     * Objects (name) that will only be drawn
     * @remark only: "background" | "nickname" | "avatarBorder" | "avatar" | "rank" | "lvl" | "progressBar" | xp
     */
    only?: string[];
    /**
     * Sets show, the image size should be resized so that it fits the canvas
     * @remark default 'fill'
     */
    objectFit?: 'fill' | 'cover';
};

export class RankCardBuilder {
    public nicknameText: TextCard;
    public currentLvl: number;
    public currentRank: number;
    public currentXP: number;
    public requiredXP: number;
    public userStatus: UserStatus;
    public backgroundImgURL?: string;
    public backgroundColor: BackgroundRankColor = { background: '#FFF', bubbles: '#0CA7FF' };
    public avatarImgURL?: string;
    public avatarBackgroundColor: Color = '#0CA7FF';
    public avatarBackgroundEnable: boolean = true;
    public fontDefault: FontResolvable = 'Nunito';
    public colorTextDefault: Color = '#0CA7FF';
    public progressBarColor: Color = '#0CA7FF';
    public currentXPColor: Color = '#0CA7FF';
    public requiredXPColor: Color = '#7F8384';
    public lvlPrefix?: TextCard;
    public rankPrefix?: TextCard;

    constructor(params: RankCardParams) {
        this.nicknameText = params.nicknameText;
        this.currentLvl = params.currentLvl;
        this.currentRank = params.currentRank;
        this.currentXP = params.currentXP;
        this.requiredXP = params.requiredXP;
        this.userStatus = params.userStatus;
        if (params.backgroundImgURL) this.backgroundImgURL = params.backgroundImgURL;
        if (params.backgroundColor) this.backgroundColor = params.backgroundColor;
        if (params.avatarImgURL) this.avatarImgURL = params.avatarImgURL;
        if (params.avatarBackgroundColor) this.avatarBackgroundColor = params.avatarBackgroundColor;
        if (params.fontDefault) this.fontDefault = params.fontDefault;
        if (params.colorTextDefault) this.colorTextDefault = params.colorTextDefault;
        if (params.lvlPrefix) this.lvlPrefix = params.lvlPrefix;
        if (params.rankPrefix) this.rankPrefix = params.rankPrefix;
        if (params.progressBarColor) this.progressBarColor = params.progressBarColor;
        if (params.currentXPColor) this.currentXPColor = params.currentXPColor;
        if (params.requiredXPColor) this.requiredXPColor = params.requiredXPColor;
        if (params.avatarBackgroundEnable === false) this.avatarBackgroundEnable = false;
    }

    /**
     * Sets the background color of this card (if no background image is selected)
     * @param backgroundColor Background color
     */
    setBackgroundColor(backgroundColor: BackgroundRankColor): this {
        this.backgroundColor = backgroundColor;
        return this;
    }

    /**
     * URL to the background image
     * @remark Image size 1000x250px
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
     * Sets the color of the circle behind the avatar
     * @param avatarBackgroundColor The color of the circle behind the avatar
     */
    setAvatarBackgroundColor(avatarBackgroundColor: Color): this {
        this.avatarBackgroundColor = avatarBackgroundColor;
        return this;
    }

    /**
     * Sets the circle behind the avatar
     * @param avatarBackgroundEnable Whether the circle behind the avatar is enabled
     */
    setAvatarBackgroundEnable(avatarBackgroundEnable: boolean): this {
        this.avatarBackgroundEnable = avatarBackgroundEnable;
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
     * Sets the text before the level number
     * @param lvlPrefix Text before the level number
     */
    setLvlPrefix(lvlPrefix: TextCard): this {
        this.lvlPrefix = lvlPrefix;
        return this;
    }

    /**
     * Sets the text before the rank number
     * @param rankPrefix Text before the rank number
     */
    setRankPrefix(rankPrefix: TextCard): this {
        this.rankPrefix = rankPrefix;
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
     * Sets the user's current level
     * @param currentLvl The user's current level
     */
    setCurrentLvl(currentLvl: number): this {
        this.currentLvl = currentLvl;
        return this;
    }

    /**
     * Sets the user's current rank
     * @param currentRank The user's current rank
     */
    setCurrentRank(currentRank: number): this {
        this.currentRank = currentRank;
        return this;
    }

    /**
     * Sets the user's current experience
     * @param currentXP The user's current experience
     */
    setCurrentXP(currentXP: number): this {
        this.currentXP = currentXP;
        return this;
    }

    /**
     * Sets the required experience to the next level
     * @param requiredXP Required experience to the next level
     */
    setRequiredXP(requiredXP: number): this {
        this.requiredXP = requiredXP;
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
            // Border radius
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(1000, 250);
            ctx.arcTo(0, 250, 0, 0, 30);
            ctx.arcTo(0, 0, 1000, 0, 30);
            ctx.arcTo(1000, 0, 1000, 250, 30);
            ctx.arcTo(1000, 250, 0, 250, 30);
            ctx.clip();

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

                if (this.backgroundColor.bubbles) {
                    ctx.beginPath();
                    ctx.arc(153, 225, 10, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.31);
                    ctx.fill();
                    ctx.closePath();

                    ctx.arc(213, 81, 10, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.07);
                    ctx.fill();
                    ctx.closePath();

                    ctx.arc(238, 16, 10, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.6);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(486, 148, 40, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.1);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(396.5, 33.5, 7.5, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.05);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(515.5, 38.5, 12.5, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.43);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(572, 257, 30, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 1);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(782.5, 226.5, 8.5, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.15);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(1000, 101, 10, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgbA(this.backgroundColor.bubbles, 0.63);
                    ctx.fill();
                    ctx.closePath();
                }
            }
            ctx.restore();
        }

        if (!options?.only || options.only.includes('avatarBorder')) {
            // Задний фон аватарки
            if (this.avatarBackgroundEnable) {
                ctx.beginPath();
                ctx.arc(88, 101, 75, 0, Math.PI * 2);
                ctx.fillStyle = this.avatarBackgroundColor;
                ctx.fill();
                ctx.closePath();
            }
        }

        if (
            !options?.only ||
            options.only.includes('avatar') ||
            options.only.includes('avatarBorder')
        ) {
            if (this.avatarImgURL) {
                // Avatar
                ctx.beginPath();
                ctx.arc(105, 125, 75, 0, Math.PI * 0.36, true);
                ctx.arc(159, 179, 23.5, Math.PI * 0.82, Math.PI * 1.68, false);
                ctx.arc(105, 125, 75, Math.PI * 0.15, Math.PI * 1.5, true);
                ctx.closePath();
                ctx.save();
                ctx.clip();
                try {
                    const img = await loadImage(this.avatarImgURL);
                    ctx.drawImage(img, 30, 50, 150, 150);
                } catch (err) {
                    throw new Error('Error loading the avatar image. The URL may be invalid.');
                }
                ctx.restore();

                // Status
                ctx.beginPath();
                if (this.userStatus === 'online') {
                    ctx.arc(159, 179, 17, 0, Math.PI * 2);
                    ctx.fillStyle = '#57F287';
                } else if (this.userStatus === 'idle') {
                    ctx.arc(159, 179, 17, Math.PI * 0.9, Math.PI * 1.6, true);
                    ctx.arc(148, 168, 17, Math.PI * 1.9, Math.PI * 0.6);
                    ctx.fillStyle = '#faa61a';
                } else if (this.userStatus === 'dnd') {
                    ctx.arc(151, 179, 3.5, Math.PI * 1.5, Math.PI * 0.5, true);
                    ctx.arc(167, 179, 3.5, Math.PI * 0.5, Math.PI * 1.5, true);
                    ctx.closePath();
                    ctx.arc(159, 179, 17, 0, Math.PI * 2);
                    ctx.fillStyle = '#ed4245';
                } else if (this.userStatus === 'streaming') {
                    ctx.moveTo(168, 179);
                    ctx.lineTo(154.5, 170);
                    ctx.lineTo(154.5, 188);
                    ctx.closePath();
                    ctx.arc(159, 179, 17, 0, Math.PI * 2);
                    ctx.fillStyle = '#593695';
                } else {
                    ctx.arc(159, 179, 9, Math.PI * 1.5, Math.PI * 0.5, true);
                    ctx.arc(159, 179, 9, Math.PI * 0.5, Math.PI * 1.5, true);
                    ctx.closePath();
                    ctx.arc(159, 179, 17, 0, Math.PI * 2);
                    ctx.fillStyle = '#747f8d';
                }
                ctx.fill();
            }
        }

        if (!options?.only || options.only.includes('progressBar')) {
            // Progress Bar
            ctx.save();

            // Progress Bar Back
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = this.progressBarColor;
            ctx.arc(canvasWidth - 47.5, 182.5, 17.5, Math.PI * 1.5, Math.PI * 0.5);
            ctx.arc(227.5, 182.5, 17.5, Math.PI * 0.5, Math.PI * 1.5);
            ctx.fill();
            ctx.clip();
            ctx.closePath();

            // Progress Bar Front
            const currentPercentXP = Math.floor((this.currentXP / this.requiredXP) * 100);
            if (currentPercentXP >= 1) {
                ctx.beginPath();
                const onePercentBar = (canvasWidth - 30 - 210) / 100;
                const pxBar = onePercentBar * currentPercentXP;
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.progressBarColor;
                ctx.arc(192.5 + pxBar, 182.5, 17.5, Math.PI * 1.5, Math.PI * 0.5);
                ctx.arc(227.5, 182.5, 17.5, Math.PI * 0.5, Math.PI * 1.5);
                ctx.fill();
                ctx.closePath();
            }
            ctx.restore();
        }
        let offsetLvlXP = canvasWidth - 30;
        if (!options?.only || options.only.includes('xp')) {
            // XP
            ctx.save();
            ctx.font = `600 35px '${this.fontDefault}'`;
            ctx.textAlign = 'right';
            ctx.fillStyle = this.requiredXPColor;
            ctx.fillText(`${this.requiredXP} xp`, offsetLvlXP, 150);
            offsetLvlXP -= ctx.measureText(`${this.requiredXP} xp`).width + 3;
            ctx.fillText('/', offsetLvlXP, 150);
            ctx.fillStyle = this.currentXPColor;
            // 3px - the distance to the left and right of "/"
            offsetLvlXP -= ctx.measureText(`/`).width + 3;
            ctx.fillText(`${this.currentXP}`, offsetLvlXP, 150);
            offsetLvlXP -= ctx.measureText(`${this.currentXP}`).width;
            ctx.restore();
        }

        if (!options?.only || options.only.includes('nickname')) {
            // Nickname
            const nicknameFont = this.nicknameText.font ? this.nicknameText.font : this.fontDefault;
            ctx.font = `600 35px '${nicknameFont}'`;
            ctx.fillStyle = this.nicknameText.color
                ? this.nicknameText.color
                : this.colorTextDefault;
            ctx.fillText(this.nicknameText.content, 210, 150, offsetLvlXP - 210 - 15);
        }

        // RANK
        ctx.save();
        let offsetRankX = canvasWidth - 30;
        if (!options?.only || options.only.includes('rank')) {
            ctx.textAlign = 'right';

            const rankFont =
                this.rankPrefix && this.rankPrefix.font ? this.rankPrefix.font : this.fontDefault;
            const rankContent =
                this.rankPrefix && this.rankPrefix.content ? this.rankPrefix.content : 'RANK';
            ctx.fillStyle =
                this.rankPrefix && this.rankPrefix.color
                    ? this.rankPrefix.color
                    : this.colorTextDefault;

            // rank number
            ctx.font = `600 60px '${rankFont}'`;
            ctx.fillText(`${this.currentRank}`, offsetRankX, 75);
            offsetRankX -= ctx.measureText(`${this.currentRank}`).width;

            // rank string
            ctx.font = `600 35px '${rankFont}'`;
            ctx.fillText(` ${rankContent} `, offsetRankX, 75);
            offsetRankX -= ctx.measureText(` ${rankContent} `).width;
        }

        if (!options?.only || options.only.includes('lvl')) {
            // LVL
            const lvlFont =
                this.lvlPrefix && this.lvlPrefix.font ? this.lvlPrefix.font : this.fontDefault;
            const lvlContent =
                this.lvlPrefix && this.lvlPrefix.content ? this.lvlPrefix.content : 'LVL';
            ctx.fillStyle =
                this.lvlPrefix && this.lvlPrefix.color
                    ? this.lvlPrefix.color
                    : this.colorTextDefault;

            // lvl number
            ctx.font = `600 60px '${lvlFont}'`;
            ctx.fillText(`${this.currentLvl}`, offsetRankX, 75);
            offsetRankX -= ctx.measureText(`${this.currentLvl}`).width;

            // lvl string
            ctx.font = `600 35px '${lvlFont}'`;
            ctx.fillText(`${lvlContent} `, offsetRankX, 75);
            ctx.restore();
        }
    }

    /**
     * Builds a Canvas with the specified parameters
     */
    async build(options?: OptionsDraw): Promise<Canvas> {
        const canvas = createCanvas(1000, 250);
        const ctx = canvas.getContext('2d');
        await this.draw(ctx, canvas.width, canvas.height);
        return canvas;
    }
}
