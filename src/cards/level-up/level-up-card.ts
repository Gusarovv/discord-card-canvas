import { Canvas, CanvasRenderingContext2D, createCanvas } from 'canvas';
import {
  BackgroundLevelUpColor,
  Color,
  TextCard,
  UserStatus,
} from '../../interface/card.interface';
import { hexToRgbA } from '../../utils/hex-rgba';
import { loadImageSafe } from '../../utils/load-image';

interface LevelUpParamsCommon {
  /**
   * User's nickname
   */
  nicknameText: TextCard;
  /**
   * Previous level number
   */
  previousLvl: number;
  /**
   * New level number
   */
  newLvl: number;
  /**
   * URL to the avatar user image
   */
  avatarImgURL?: string;
  /**
   * The color of the circle behind the avatar; Default: '#0CA7FF'
   */
  avatarBackgroundColor?: Color;
  /**
   * Whether the circle behind the avatar is enabled; Default: true
   */
  avatarBackgroundEnable?: boolean;
  /**
   * User status; Default: 'online'
   */
  userStatus?: UserStatus;
  /**
   * Whether the user status indicator is shown; Default: true
   */
  userStatusEnable?: boolean;
  /**
   * Background color with pattern; Default: white + stars
   */
  backgroundColor?: BackgroundLevelUpColor;
  /**
   * Whether the background pattern (stars/bubbles) is shown when no background image is set; Default: true
   */
  patternEnable?: boolean;
  /**
   * Default font; Default: 'Nunito'
   */
  fontDefault?: string;
  /**
   * Default text color; Default: '#0CA7FF'
   */
  colorTextDefault?: Color;
  /**
   * Customizable "LEVEL UP" text; Default: { content: 'LEVEL UP' }
   */
  levelUpText?: TextCard;
}

export type LevelUpParams = LevelUpParamsCommon &
  (
    | {
        /**
         * URL to the background image (1000x250 px)
         */
        backgroundImgURL: string;
        /**
         * Opacity of the dark overlay drawn on top of the background image (0–1).
         * Only applies when `backgroundImgURL` is set. Ignored for solid color backgrounds.
         */
        overlayOpacity?: number;
      }
    | {
        backgroundImgURL?: undefined;
        overlayOpacity?: never;
      }
  );

type OptionsDraw = {
  /**
   * Sets how the image size should be resized so that it fits the canvas
   * @remark default 'fill'
   */
  objectFit?: 'fill' | 'cover';
};

export class LevelUpBuilder {
  public nicknameText: TextCard;
  public previousLvl: number;
  public newLvl: number;
  public avatarImgURL?: string;
  public avatarBackgroundColor: Color;
  public avatarBackgroundEnable: boolean;
  public userStatus: UserStatus;
  public userStatusEnable: boolean;
  public backgroundImgURL?: string;
  public backgroundColor: BackgroundLevelUpColor;
  public patternEnable: boolean;
  public overlayOpacity?: number;
  public fontDefault: string;
  public colorTextDefault: Color;
  public levelUpText: TextCard;

  constructor({
    nicknameText,
    previousLvl,
    newLvl,
    avatarImgURL,
    avatarBackgroundColor = '#0CA7FF',
    avatarBackgroundEnable = true,
    userStatus = 'online',
    userStatusEnable = true,
    backgroundImgURL,
    backgroundColor = { background: '#FFF', pattern: 'stars', patternColor: '#0CA7FF' },
    patternEnable = true,
    overlayOpacity,
    fontDefault = 'Nunito',
    colorTextDefault = '#0CA7FF',
    levelUpText = { content: 'LEVEL UP' },
  }: LevelUpParams) {
    this.nicknameText = nicknameText;
    this.previousLvl = previousLvl;
    this.newLvl = newLvl;
    this.avatarImgURL = avatarImgURL;
    this.avatarBackgroundColor = avatarBackgroundColor;
    this.avatarBackgroundEnable = avatarBackgroundEnable;
    this.userStatus = userStatus;
    this.userStatusEnable = userStatusEnable;
    this.backgroundImgURL = backgroundImgURL;
    this.backgroundColor = backgroundColor;
    this.patternEnable = patternEnable;
    this.overlayOpacity = overlayOpacity;
    this.fontDefault = fontDefault;
    this.colorTextDefault = colorTextDefault;
    this.levelUpText = levelUpText;
  }

  setNicknameText(nicknameText: TextCard): this {
    this.nicknameText = nicknameText;
    return this;
  }

  setPreviousLvl(previousLvl: number): this {
    this.previousLvl = previousLvl;
    return this;
  }

  setNewLvl(newLvl: number): this {
    this.newLvl = newLvl;
    return this;
  }

  setAvatarImgURL(avatarImgURL: string): this {
    this.avatarImgURL = avatarImgURL;
    return this;
  }

  setAvatarBackgroundColor(avatarBackgroundColor: Color): this {
    this.avatarBackgroundColor = avatarBackgroundColor;
    return this;
  }

  setAvatarBackgroundEnable(avatarBackgroundEnable: boolean): this {
    this.avatarBackgroundEnable = avatarBackgroundEnable;
    return this;
  }

  setUserStatus(userStatus: UserStatus): this {
    this.userStatus = userStatus;
    return this;
  }

  setUserStatusEnable(userStatusEnable: boolean): this {
    this.userStatusEnable = userStatusEnable;
    return this;
  }

  setBackgroundImgURL(backgroundImgURL: string): this {
    this.backgroundImgURL = backgroundImgURL;
    return this;
  }

  setBackgroundColor(backgroundColor: BackgroundLevelUpColor): this {
    this.backgroundColor = backgroundColor;
    return this;
  }

  /**
   * Sets whether the background pattern (stars/bubbles) is shown
   * @param patternEnable Whether the pattern is shown
   */
  setPatternEnable(patternEnable: boolean): this {
    this.patternEnable = patternEnable;
    return this;
  }

  setOverlayOpacity(overlayOpacity: number): this {
    this.overlayOpacity = overlayOpacity;
    return this;
  }

  setFontDefault(fontDefault: string): this {
    this.fontDefault = fontDefault;
    return this;
  }

  setColorTextDefault(colorTextDefault: Color): this {
    this.colorTextDefault = colorTextDefault;
    return this;
  }

  setLevelUpText(levelUpText: TextCard): this {
    this.levelUpText = levelUpText;
    return this;
  }

  /**
   * Draws a 4-point star at (cx, cy) with the given size
   */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
  ): void {
    ctx.beginPath();
    // Top
    ctx.moveTo(cx, cy - outerRadius);
    ctx.lineTo(cx + innerRadius, cy - innerRadius);
    // Right
    ctx.lineTo(cx + outerRadius, cy);
    ctx.lineTo(cx + innerRadius, cy + innerRadius);
    // Bottom
    ctx.lineTo(cx, cy + outerRadius);
    ctx.lineTo(cx - innerRadius, cy + innerRadius);
    // Left
    ctx.lineTo(cx - outerRadius, cy);
    ctx.lineTo(cx - innerRadius, cy - innerRadius);
    ctx.closePath();
    ctx.fill();
  }

  async draw(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    options?: OptionsDraw,
  ): Promise<void> {
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
      const img = await loadImageSafe(this.backgroundImgURL);
      if (!img) {
        throw new Error('Error loading the background image. The URL may be invalid.');
      }
      if (options?.objectFit === 'cover') {
        let offsetX = 0.5;
        let offsetY = 0.5;
        if (offsetX < 0) offsetX = 0;
        if (offsetY < 0) offsetY = 0;
        if (offsetX > 1) offsetX = 1;
        if (offsetY > 1) offsetY = 1;

        let iw = img.width,
          ih = img.height,
          r = Math.min(canvasWidth / iw, canvasHeight / ih),
          nw = iw * r,
          nh = ih * r,
          cx: number,
          cy: number,
          cw: number,
          ch: number,
          ar: number = 1;

        if (nw < canvasWidth) ar = canvasWidth / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < canvasHeight) ar = canvasHeight / nh;
        nw *= ar;
        nh *= ar;

        cw = iw / (nw / canvasWidth);
        ch = ih / (nh / canvasHeight);
        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, canvasWidth, canvasHeight);
      } else {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      }
      // Overlay
      if (this.overlayOpacity) {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.overlayOpacity})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    } else {
      ctx.fillStyle = this.backgroundColor.background;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (this.patternEnable) {
        const patternColor = this.backgroundColor.patternColor || this.colorTextDefault;
        const pattern = this.backgroundColor.pattern || 'stars';

        if (pattern === 'bubbles') {
          ctx.beginPath();
          ctx.arc(153, 225, 10, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.31);
          ctx.fill();
          ctx.closePath();

          ctx.arc(213, 81, 10, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.07);
          ctx.fill();
          ctx.closePath();

          ctx.arc(238, 16, 10, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.6);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(486, 148, 40, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.1);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(396.5, 33.5, 7.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.05);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(515.5, 38.5, 12.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.43);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(572, 257, 30, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 1);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(782.5, 226.5, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.15);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(1000, 101, 10, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.63);
          ctx.fill();
          ctx.closePath();
        } else {
          // Stars pattern
          ctx.fillStyle = hexToRgbA(patternColor, 0.8);
          this.drawStar(ctx, 250, 30, 12, 4);

          ctx.fillStyle = hexToRgbA(patternColor, 0.5);
          this.drawStar(ctx, 840, 40, 10, 3);

          ctx.fillStyle = hexToRgbA(patternColor, 0.9);
          this.drawStar(ctx, 300, 210, 14, 5);

          ctx.fillStyle = hexToRgbA(patternColor, 0.35);
          this.drawStar(ctx, 700, 190, 11, 4);

          ctx.fillStyle = hexToRgbA(patternColor, 0.6);
          this.drawStar(ctx, 960, 220, 8, 3);

          ctx.fillStyle = hexToRgbA(patternColor, 0.15);
          this.drawStar(ctx, 500, 110, 20, 7);

          ctx.fillStyle = hexToRgbA(patternColor, 0.7);
          this.drawStar(ctx, 180, 230, 6, 2);

          ctx.fillStyle = hexToRgbA(patternColor, 0.25);
          this.drawStar(ctx, 420, 30, 9, 3);

          // Small dots
          ctx.beginPath();
          ctx.arc(60, 140, 2, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.3);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(200, 60, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.5);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(640, 50, 2, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.4);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(900, 100, 2, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgbA(patternColor, 0.45);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    ctx.restore();

    // Avatar background circle
    if (this.avatarBackgroundEnable) {
      ctx.beginPath();
      ctx.arc(88, 101, 75, 0, Math.PI * 2);
      ctx.fillStyle = this.avatarBackgroundColor;
      ctx.fill();
      ctx.closePath();
    }

    // Avatar
    if (this.avatarImgURL) {
      ctx.beginPath();
      if (this.userStatusEnable) {
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

    // --- Level numbers (render right-to-left, measure total width) ---
    ctx.save();
    ctx.textAlign = 'right';
    let lvlOffsetX = canvasWidth - 30;

    // New level (large, accent color)
    ctx.font = `700 60px '${this.fontDefault}'`;
    ctx.fillStyle = this.colorTextDefault;
    ctx.fillText(`${this.newLvl}`, lvlOffsetX, 145);
    const newLvlWidth = ctx.measureText(`${this.newLvl}`).width;
    lvlOffsetX -= newLvlWidth;

    // Arrow (rounded stroke)
    const arrowLen = 24;
    const arrowGap = 14;
    const arrowX = lvlOffsetX - arrowGap - arrowLen;
    const arrowY = 130;

    ctx.save();
    ctx.strokeStyle = this.colorTextDefault;
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Shaft
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX + arrowLen, arrowY);
    ctx.stroke();

    // Head (chevron)
    ctx.beginPath();
    ctx.moveTo(arrowX + arrowLen - 9, arrowY - 9);
    ctx.lineTo(arrowX + arrowLen, arrowY);
    ctx.lineTo(arrowX + arrowLen - 9, arrowY + 9);
    ctx.stroke();
    ctx.restore();

    lvlOffsetX = arrowX - arrowGap;

    // Previous level (smaller, muted)
    ctx.font = `600 40px '${this.fontDefault}'`;
    ctx.fillStyle = hexToRgbA(this.colorTextDefault, 0.4);
    ctx.fillText(`${this.previousLvl}`, lvlOffsetX, 142);
    const prevLvlWidth = ctx.measureText(`${this.previousLvl}`).width;
    lvlOffsetX -= prevLvlWidth;
    ctx.restore();

    // --- Center text (positioned between avatar and level numbers) ---
    const leftBound = 210; // right edge of avatar area
    const rightBound = lvlOffsetX - 15; // left edge of level numbers with gap
    const centerX = (leftBound + rightBound) / 2;

    // Level Up text
    const lvlUpFont = this.levelUpText.font || this.fontDefault;
    const lvlUpWeight = this.levelUpText.weight || '800';
    const lvlUpSize = this.levelUpText.size || 32;
    const lvlUpColor = this.levelUpText.color || this.colorTextDefault;
    ctx.font = `${lvlUpWeight} ${lvlUpSize}px '${lvlUpFont}'`;
    ctx.fillStyle = lvlUpColor;
    ctx.textAlign = 'center';
    ctx.fillText(this.levelUpText.content, centerX, 100, rightBound - leftBound);

    // Nickname
    const nickFont = this.nicknameText.font || this.fontDefault;
    const nickWeight = this.nicknameText.weight || '600';
    const nickSize = this.nicknameText.size || 35;
    const nickColor = this.nicknameText.color || this.colorTextDefault;
    ctx.font = `${nickWeight} ${nickSize}px '${nickFont}'`;
    ctx.fillStyle = nickColor;
    ctx.textAlign = 'center';
    let nickContent = this.nicknameText.content;
    if (nickContent.length > 30) {
      nickContent = nickContent.slice(0, 27) + '...';
    }
    ctx.fillText(nickContent, centerX, 150, rightBound - leftBound);
  }

  async build(options?: OptionsDraw): Promise<Canvas> {
    const canvas = createCanvas(1000, 250);
    const ctx = canvas.getContext('2d');
    await this.draw(ctx, canvas.width, canvas.height, options);
    return canvas;
  }
}
