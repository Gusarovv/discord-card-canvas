type RGB = `rgb(${number},${'' | ' '}${number},${'' | ' '}${number})`;
type RGBA = `rgba(${number},${'' | ' '}${number},${'' | ' '}${number},${'' | ' '}${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export type FontResolvable = 'Inter' | 'Nunito' | 'Manrope';

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline' | 'streaming';

export interface TextCard {
    content: string;
    color?: Color;
    font?: FontResolvable;
}
