type RGB = `rgb(${number},${'' | ' '}${number},${'' | ' '}${number})`;
type RGBA = `rgba(${number},${'' | ' '}${number},${'' | ' '}${number},${'' | ' '}${number})`;
type HEX = `#${string}`;

/**
 * Color in HEX, RGB, RGBA formats
 */
export type Color = RGB | RGBA | HEX;

/**
 * Resolvable font
 */
export type FontResolvable =
    | 'Inter'
    | 'Nunito'
    | 'Manrope'
    | 'Open Sans'
    | 'Raleway'
    | 'Roboto Slab'
    | 'Spectral SC'
    | 'Bellota';

/**
 * User status in Discord
 */
export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline' | 'streaming';

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
    font?: FontResolvable;
}

export type BorderStyle = 'fill' | 'stroke';
