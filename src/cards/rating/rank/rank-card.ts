import { Canvas, CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import {
  AvatarShape,
  BackgroundRankColor,
  Color,
  TextCard,
  UserStatus,
} from '../../../interface/card.interface';
import { hexToRgbA } from '../../../utils/hex-rgba';
import { loadImageSafe } from '../../../utils/load-image';

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
   * Avatar shape; Default: 'circle'
   */
  avatarShape?: AvatarShape;
  /**
   * Whether the user status indicator is shown; Default: True
   */
  userStatusEnable?: boolean;
  /**
   * Whether the background bubbles are shown (when no background image); Default: True
   */
  bubblesEnable?: boolean;
  /**
   * The color of the progress bar
   */
  progressBarColor?: Color;
  /**
   * Default font. Applies if a specific font is not selected in the TextCard object; Default: 'Nunito'
   */
  fontDefault?: string;
  /**
   * Default text color. Applies if a specific text color is not selected in the Text Card object; Default: '#0CA7FF'
   */
  colorTextDefault?: Color;
  /**
   * Text before the level number; Default: 'LVL'
   */
  lvlPrefix?: Omit<TextCard, 'content'> & Partial<Pick<TextCard, 'content'>>;
  /**
   * Level number format
   */
  lvlNumFormat?: Omit<TextCard, 'content'>;
  /**
   * Text before the rank number; Default: 'RANK'
   */
  rankPrefix?: Omit<TextCard, 'content'> & Partial<Pick<TextCard, 'content'>>;
  /**
   * Rank number format
   */
  rankNumFormat?: Omit<TextCard, 'content'>;
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
  public backgroundColor: BackgroundRankColor;
  public avatarImgURL?: string;
  public avatarBackgroundColor: Color;
  public avatarBackgroundEnable: boolean;
  public avatarShape: AvatarShape;
  public userStatusEnable: boolean;
  public bubblesEnable: boolean;
  public fontDefault: string;
  public colorTextDefault: Color;
  public progressBarColor: Color;
  public currentXPColor: Color;
  public requiredXPColor: Color;
  public lvlPrefix?: Omit<TextCard, 'content'> & Partial<Pick<TextCard, 'content'>>;
  public rankPrefix?: Omit<TextCard, 'content'> & Partial<Pick<TextCard, 'content'>>;
  public lvlNumFormat?: Omit<TextCard, 'content'>;
  public rankNumFormat?: Omit<TextCard, 'content'>;

  constructor({
    nicknameText,
    currentLvl,
    currentRank,
    currentXP,
    requiredXP,
    userStatus,
    backgroundImgURL,
    backgroundColor = { background: '#FFF', bubbles: '#0CA7FF' },
    avatarImgURL,
    avatarBackgroundColor = '#0CA7FF',
    avatarBackgroundEnable = true,
    avatarShape = 'circle',
    userStatusEnable = true,
    bubblesEnable = true,
    fontDefault = 'Nunito',
    colorTextDefault = '#0CA7FF',
    progressBarColor = '#0CA7FF',
    currentXPColor = '#0CA7FF',
    requiredXPColor = '#7F8384',
    lvlPrefix,
    rankPrefix,
    lvlNumFormat,
    rankNumFormat,
  }: RankCardParams) {
    this.nicknameText = nicknameText;
    this.currentLvl = currentLvl;
    this.currentRank = currentRank;
    this.currentXP = currentXP;
    this.requiredXP = requiredXP;
    this.userStatus = userStatus;
    this.backgroundImgURL = backgroundImgURL;
    this.backgroundColor = backgroundColor;
    this.avatarImgURL = avatarImgURL;
    this.avatarBackgroundColor = avatarBackgroundColor;
    this.avatarBackgroundEnable = avatarBackgroundEnable;
    this.avatarShape = avatarShape;
    this.userStatusEnable = userStatusEnable;
    this.bubblesEnable = bubblesEnable;
    this.fontDefault = fontDefault;
    this.colorTextDefault = colorTextDefault;
    this.progressBarColor = progressBarColor;
    this.currentXPColor = currentXPColor;
    this.requiredXPColor = requiredXPColor;
    this.lvlPrefix = lvlPrefix;
    this.rankPrefix = rankPrefix;
    this.lvlNumFormat = lvlNumFormat;
    this.rankNumFormat = rankNumFormat;
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
   * Sets the avatar shape
   * @param avatarShape Avatar shape ('circle' or 'square')
   */
  setAvatarShape(avatarShape: AvatarShape): this {
    this.avatarShape = avatarShape;
    return this;
  }

  /**
   * Sets whether the user status indicator is shown
   * @param userStatusEnable Whether the user status is shown
   */
  setUserStatusEnable(userStatusEnable: boolean): this {
    this.userStatusEnable = userStatusEnable;
    return this;
  }

  /**
   * Sets whether the background bubbles are shown
   * @param bubblesEnable Whether the bubbles are shown
   */
  setBubblesEnable(bubblesEnable: boolean): this {
    this.bubblesEnable = bubblesEnable;
    return this;
  }

  /**
   * Sets the default font
   * @param fontDefault Default font
   */
  setFontDefault(fontDefault: string): this {
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
   * Sets the rank number format
   * @param rankNumFormat Rank number format
   */
  setrankNumFormat(rankNumFormat: Omit<TextCard, 'content'>): this {
    this.rankNumFormat = rankNumFormat;
    return this;
  }

  /**
   * Sets the lvl number format
   * @param rankPrefix Text before the rank number
   */
  setlvlNumFormat(lvlNumFormat: Omit<TextCard, 'content'>): this {
    this.lvlNumFormat = lvlNumFormat;
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
    ctx: CanvasRenderingContext2D,
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

        if (this.backgroundColor.bubbles && this.bubblesEnable) {
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
        if (this.avatarShape === 'square') {
          const size = 150;
          const x = 13;
          const y = 26;
          const radius = 20;
          ctx.moveTo(x + radius, y);
          ctx.arcTo(x + size, y, x + size, y + size, radius);
          ctx.arcTo(x + size, y + size, x, y + size, radius);
          ctx.arcTo(x, y + size, x, y, radius);
          ctx.arcTo(x, y, x + size, y, radius);
        } else {
          ctx.arc(88, 101, 75, 0, Math.PI * 2);
        }
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
        if (this.avatarShape === 'square') {
          const size = 150;
          const x = 30;
          const y = 50;
          const radius = 15;
          ctx.moveTo(x + radius, y);
          ctx.arcTo(x + size, y, x + size, y + size, radius);
          ctx.arcTo(x + size, y + size, x, y + size, radius);
          ctx.arcTo(x, y + size, x, y, radius);
          ctx.arcTo(x, y, x + size, y, radius);
        } else if (this.userStatusEnable) {
          ctx.arc(105, 125, 75, 0, Math.PI * 0.36, true);
          ctx.arc(159, 179, 23.5, Math.PI * 0.82, Math.PI * 1.68, false);
          ctx.arc(105, 125, 75, Math.PI * 0.15, Math.PI * 1.5, true);
        } else {
          ctx.arc(105, 125, 75, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.save();
        ctx.clip();
        const img = await loadImageSafe(this.avatarImgURL);
        if (!img) {
          throw new Error('Error loading the avatar image. The URL may be invalid.');
        }
        ctx.drawImage(img, 30, 50, 150, 150);
        ctx.restore();

        // Status
        if (this.userStatusEnable) {
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
      const font = this.nicknameText.font ? this.nicknameText.font : this.fontDefault;
      const fontWeight = this.nicknameText.weight ? this.nicknameText.weight : '600';
      const fontSize = this.nicknameText.size ? this.nicknameText.size : 35;
      ctx.font = `${fontWeight} ${fontSize}px '${font}'`;

      ctx.fillStyle = this.nicknameText.color ? this.nicknameText.color : this.colorTextDefault;
      ctx.fillText(this.nicknameText.content, 210, 150, offsetLvlXP - 210 - 15);
    }

    // RANK
    ctx.save();
    let offsetRankX = canvasWidth - 30;
    if (!options?.only || options.only.includes('rank')) {
      ctx.textAlign = 'right';

      const rankContent = this.rankPrefix?.content ? this.rankPrefix.content : 'RANK';

      // rank number
      const fontNumber = this.rankNumFormat?.font ? this.rankNumFormat.font : this.fontDefault;
      const fontNumberSize = this.rankNumFormat?.size ? this.rankNumFormat.size : 60;
      const fontNumberWeight = this.rankNumFormat?.weight ? this.rankNumFormat.weight : '600';
      ctx.fillStyle = this.rankNumFormat?.color ? this.rankNumFormat.color : this.colorTextDefault;
      ctx.font = `${fontNumberWeight} ${fontNumberSize}px '${fontNumber}'`;
      ctx.fillText(`${this.currentRank}`, offsetRankX, 75);
      offsetRankX -= ctx.measureText(`${this.currentRank}`).width;

      // rank string
      const fontPrefix = this.rankPrefix?.font ? this.rankPrefix.font : this.fontDefault;
      const fontPrefixSize = this.rankPrefix?.size ? this.rankPrefix.size : 35;
      const fontPrefixWeight = this.rankPrefix?.weight ? this.rankPrefix.weight : '600';
      ctx.fillStyle = this.rankPrefix?.color ? this.rankPrefix.color : this.colorTextDefault;
      ctx.font = `${fontPrefixWeight} ${fontPrefixSize}px '${fontPrefix}'`;
      ctx.fillText(` ${rankContent} `, offsetRankX, 75);
      offsetRankX -= ctx.measureText(` ${rankContent} `).width;
    }

    if (!options?.only || options.only.includes('lvl')) {
      // LVL
      const lvlContent = this.lvlPrefix && this.lvlPrefix.content ? this.lvlPrefix.content : 'LVL';
      ctx.fillStyle =
        this.lvlPrefix && this.lvlPrefix.color ? this.lvlPrefix.color : this.colorTextDefault;

      // lvl number
      const fontNumber = this.lvlNumFormat?.font ? this.lvlNumFormat.font : this.fontDefault;
      const fontNumberSize = this.lvlNumFormat?.size ? this.lvlNumFormat.size : 60;
      const fontNumberWeight = this.lvlNumFormat?.weight ? this.lvlNumFormat.weight : '600';
      ctx.fillStyle = this.lvlNumFormat?.color ? this.lvlNumFormat.color : this.colorTextDefault;
      ctx.font = `${fontNumberWeight} ${fontNumberSize}px '${fontNumber}'`;
      ctx.fillText(`${this.currentLvl}`, offsetRankX, 75);
      offsetRankX -= ctx.measureText(`${this.currentLvl}`).width;

      // lvl string
      const fontPrefix = this.lvlPrefix?.font ? this.lvlPrefix.font : this.fontDefault;
      const fontPrefixSize = this.lvlPrefix?.size ? this.lvlPrefix.size : 35;
      const fontPrefixWeight = this.lvlPrefix?.weight ? this.lvlPrefix.weight : '600';
      ctx.fillStyle = this.lvlPrefix?.color ? this.lvlPrefix.color : this.colorTextDefault;
      ctx.font = `${fontPrefixWeight} ${fontPrefixSize}px '${fontPrefix}'`;
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
    await this.draw(ctx, canvas.width, canvas.height, options);
    return canvas;
  }
}
