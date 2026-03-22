type RGB = `rgb(${number},${'' | ' '}${number},${'' | ' '}${number})`;
type RGBA = `rgba(${number},${'' | ' '}${number},${'' | ' '}${number},${'' | ' '}${number})`;
type HEX = `#${string}`;

/**
 * Color in HEX, RGB, RGBA formats
 */
export type Color = RGB | RGBA | HEX;

/**
 * User status in Discord
 */
export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline' | 'invisible' | 'streaming';

export interface TextCard {
  /**
   * Content (string)
   */
  content: string;
  /**
   * Text color
   */
  color?: Color;
  /**
   * Text font
   */
  font?: string;
  /**
   * Text size
   */
  size?: number;
  /**
   * Text weight
   */
  weight?: string;
}

export type BorderStyle = 'fill' | 'stroke';
export type AvatarShape = 'circle' | 'square';
export type BackgroundBaseColor = { background: Color; waves?: Color };
export type BackgroundRankColor = { background: Color; bubbles?: Color };
