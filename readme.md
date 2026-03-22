# <p align="center">⭐ discord-card-canvas</p>

<p align="center">Are you developing a bot using DiscordJS and you need beautiful images created using Canvas?</p>

<p align="center">You can create great welcome, goodbye, rank, info banner images fully customizable using the many easy-to-use features!</p>

> <p align="center">TypeScript</p>

## 👨🏻‍💻 Installation <a name="Installation"></a>

```bash
$ npm install discord-card-canvas
```

## Features

- 🎨 Canvas only, no third-party libraries
- 📦 Easy to install & use

# 🧾 Examples

## Example Rank

<img src="https://i.imgur.com/rtiKAd1.png"/>

```ts
const canvasRank = await new RankCardBuilder({
    currentLvl: 102,
    currentRank: 563,
    currentXP: 71032,
    requiredXP: 95195,
    backgroundColor: { background: '#070d19', bubbles: '#0ca7ff' },
    // backgroundImgURL: 'any_image.png', ( you can also use )
    avatarImgURL: 'avatar.jpg',
    nicknameText: { content: 'xNinja_Catx', font: 'Nunito', color: '#0CA7FF' },
    userStatus: 'idle',
}).build();

// Saving an image
fs.writeFileSync('rank_blue.png', canvasRank.toBuffer());

// Example of sending to a channel
channel.send(files: [{ attachment: canvasRank.toBuffer(), name: 'rank.png' }])
```

---

<img src="https://i.imgur.com/z8cCddN.png"/>

```ts
const canvasRank = await new RankCardBuilder({
  currentLvl: 50,
  currentRank: 3,
  currentXP: 23478,
  requiredXP: 68195,
  fontDefault: 'Inter',
  backgroundColor: { background: '#fff', bubbles: '#f48b2d' },
  avatarImgURL: 'avatar.jpg',
  nicknameText: { content: 'Good_Hateful' },
  userStatus: 'online',
  requiredXPColor: '#7F8381',
  currentXPColor: '#f48b2d',
  avatarBackgroundColor: '#fbbf60',
  colorTextDefault: '#f48b2d',
  progressBarColor: '#f48b2d',
  lvlNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
  rankNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
}).build({
  only: ['background', 'nickname', 'avatar'],
  objectFit: 'cover',
});

fs.writeFileSync('rank_orange.png', canvasRank.toBuffer());
```

---

## Example Welcome/Leave

<img src="https://i.imgur.com/F7PVnke.png"/>

```ts
const cv = new WelcomeBuilder({
  // backgroundImgURL: 'any_image.png', ( you can also use )
  fontDefault: 'Inter',
  nicknameText: { color: '#0CA7FF', content: 'ДобраяKnopKa#2575' },
  secondText: { color: '#0CA7FF', content: 'Raccoon Bot Discord' },
  avatarImgURL: 'Sad_KnopKa.gif',
}).build();

fs.writeFileSync('welcome-1.png', (await cv.build()).toBuffer());
```

---

<img src="https://i.imgur.com/dLM4shk.png"/>

```ts
const cv = new LeaveBuilder({
  nicknameText: { content: 'ДобраяKnopKa#2575' },
  avatarImgURL: 'Sad_KnopKa.gif',
});
cv.setFontDefault('Inter');
cv.setSecondText({ content: 'Raccoon Bot Discord' });

fs.writeFileSync('welcome-2.png', (await cv.build()).toBuffer());
```

> ⚠️For full control when creating a card, use BaseCardBuilder.

---

## Example Info

<img src="https://i.imgur.com/KsBpoIu.png"/>

```ts
const canvasInfo = await new InfoCardBuilder({
    // backgroundImgURL: 'any_image.png', ( you can also use )
    backgroundColor: {background: '#fff', waves: '#0ca7ff'}
    mainText: { content: 'INFORMATION' },
}).build();

fs.writeFileSync('info.png', canvasInfo.toBuffer());
```

# 📘 Documentation

## **📌 Classes**

## BaseCardBuilder

Creating a base card with a resolution of 800x350 px.

- `mainText` - Text above the user's nickname.
  - Default: { size: `48`, weight: `'800'` }
- `nicknameText` - User's nickname.
  - Default: { size: `35`, weight: `'700'` }
- `secondText` - Text under the user's nickname.
  - Default: { size: `33`, weight: `'600'` }
- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
  - Default: `'#0CA7FF'`
- `avatarImgURL` - URL to the avatar user image.
- `avatarBorderColor` - The outline color of the user's avatar.
  - Default: `'#0CA7FF'`
- `avatarBorderStyle` - Border type for avatar ('fill' fits transparent avatars)
  - `'fill'` or `'stroke'`
- `fontDefault` - Default font. Applies if a specific font is not selected in the TextCard object.
  - Default: `'Nunito'`
- `colorTextDefault` - Default text color. Applies if a specific text color is not selected in the Text Card object.
  - Default: `'#0CA7FF'`

> 🔹 To simplify the creation of welcome, leave cards, you can use the **WelcomeBuilder** and **LeaveBuilder**.

---

## RankCardBuilder

Creating a user rating card with a resolution of 1000x250 px.

- `nicknameText *` - User's nickname.
  - Default: { size: `35`, weight: `'600'` }
- `currentLvl *` - The user's current level.
- `currentRank *` - The user's current rank.
- `currentXP *` - The user's current experience.
- `requiredXP *` - Required experience to the next level
- `userStatus *` - User status.
- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
  - Default: `'#0CA7FF'`
- `avatarImgURL` - URL to the avatar user image.
- `avatarBackgroundEnable` - Whether the circle behind the avatar is enabled.
  - Default: `True`
- `avatarBackgroundColor` - The color of the circle behind the avatar.
  - Default: `'#0CA7FF'`
- `avatarShape` - Avatar shape.
  - `'circle'` or `'square'`
  - Default: `'circle'`
- `userStatusEnable` - Whether the user status indicator is shown.
  - Default: `True`
- `bubblesEnable` - Whether the background bubbles are shown (when no background image).
  - Default: `True`
- `fontDefault` - Default font. Applies if a specific font is not selected in the TextCard object.
  - Default: `'Nunito'`
- `colorTextDefault` - Default text color. Applies if a specific text color is not selected in the Text Card object.
  - Default: `'#0CA7FF'`
- `progressBarColor` - The color of the progress bar.
  - Default: `'#0CA7FF'`
- `currentXPColor` - The color of the current experience number.
  - Default: `'#0CA7FF'`
- `requiredXPColor` - The color of the required experience number.
  - Default: `'#7F8384'`
- `lvlPrefix` - Text before the level number.
  - Default: { content: `'LVL'`, size: `35`, weight: `'600'` }
- `lvlNumFormat` - Level number format
  - Default: { size: `60`, weight: `'600'` }
- `rankPrefix` - Text before the rank number.
  - Default: { content: `'RANK'`, size: `35`, weight: `'600'` }
- `rankNumFormat` - Rank number format
  - Default: { size: `60`, weight: `'600'` }
    > 🔹 `*` - Required parameters

---

## InfoCardBuilder

Creating a card-an information header.

- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
- `mainText` - The main text on the card.

> ✍️ **Important:** To create a canvas object, use the **build()** method of the class.

---

## 🎨 Using Custom Fonts

Enhance the visual appeal of your cards by incorporating custom fonts. The `discord-card-canvas` library provides utility functions to easily load and register your own fonts, giving you full control over the typography of your banners.

Before you begin, ensure that you have the necessary fonts available in your project directory. You can include `.ttf`, `.otf`, or other supported font formats.

The library offers two primary functions for loading fonts:

1. **`loadFont`**: Loads a single font.
2. **`loadFonts`**: Loads multiple fonts at once.

#### 1. Loading a Single Font with `loadFont`

Use the `loadFont` function to register an individual font. This is useful when you have a specific font to load.

```typescript
import { loadFont } from 'discord-card-canvas';

// Register a single font
loadFont('./fonts/Inter-Regular.ttf', {
  family: 'Inter',
  weight: '400',
  style: 'normal',
});
```

**Parameters:**

- `fontPath` (`string`): Relative path to the font file.
- `fontFace` (`{ family: string; weight?: string; style?: string }`): Object describing the font properties.

**Example Usage:**

```typescript
import { loadFont, BaseCardBuilder } from 'discord-card-canvas';

// Load the custom font
loadFont('./fonts/Roboto-Bold.ttf', {
  family: 'Roboto',
  weight: '700',
  style: 'normal',
});

// Create a card using the custom font
const card = await new BaseCardBuilder({
  mainText: {
    content: '- Main Text -',
    weight: '700',
    size: 45,
    color: '#0CA7FF',
    font: 'Roboto',
  },
  nicknameText: {
    content: 'Nickname',
    weight: '400',
    size: 40,
    color: '#0CA7FF',
    font: 'Roboto',
  },
  secondText: {
    content: 'Second Text',
    weight: '300',
    size: 35,
    color: '#0CA7FF',
    font: 'Roboto',
  },
}).build();

fs.writeFileSync('custom-font-card.png', card.toBuffer());
```

#### 2. Loading Multiple Fonts with `loadFonts`

If you have multiple fonts to load, the `loadFonts` function simplifies the process by allowing you to register all fonts in a single call.

```typescript
import { loadFonts } from 'discord-card-canvas';

// Register multiple fonts
loadFonts([
  {
    path: './fonts/Inter-Regular.ttf',
    family: 'Inter',
    weight: '400',
    style: 'normal',
  },
  {
    path: './fonts/Inter-Bold.ttf',
    family: 'Inter',
    weight: '700',
    style: 'normal',
  },
  {
    path: './fonts/Roboto-Italic.ttf',
    family: 'Roboto',
    weight: '400',
    style: 'italic',
  },
]);
```

**Parameters:**

- `fonts` (`FontDescriptor[]`): An array of font descriptors.
- `basePath` (`string`, optional): Base path for all font files. Defaults to the current directory (`__dirname`).

**FontDescriptor Interface:**

```typescript
interface FontDescriptor {
  path: string; // Relative path to the font file
  family: string; // Font family name
  weight?: string; // Font weight (e.g., '400', '700')
  style?: string; // Font style (e.g., 'normal', 'italic')
}
```

**Example Usage:**

```typescript
import { loadFonts, RankCardBuilder } from 'discord-card-canvas';

// Load multiple custom fonts
loadFonts([
  {
    path: './fonts/Roboto-Bold.ttf',
    family: 'Roboto',
    weight: '700',
    style: 'normal',
  },
  {
    path: './fonts/Inter-SemiBold.ttf',
    family: 'Inter',
    weight: '600',
    style: 'normal',
  },
]);

// Create a rank card using the loaded fonts
const rankCard = await new RankCardBuilder({
  nicknameText: {
    content: 'ChampionX',
    font: 'Roboto',
    color: '#0CA7FF',
    size: 42,
    weight: '700',
  },
  avatarImgURL: 'URL.png',
  currentLvl: 25,
  currentRank: 1,
  currentXP: 5000,
  requiredXP: 10000,
  userStatus: 'online',
  fontDefault: 'Inter',
  backgroundColor: { background: '#000', bubbles: '#0CA7FF' },
}).build({ objectFit: 'cover' });

fs.writeFileSync('rank-custom-font.png', rankCard.toBuffer());
```

> 📌 **Font Registration:** Fonts must be registered **before** creating any card that uses them. Typically, load fonts at the entry point of your application.

---

## **🔖 Additional Types and Interfaces**

- `Color` - **String** - RGB | RGBA | HEX
- `UserStatus` - **String** - 'online' | 'idle' | 'dnd' | 'offline' | 'invisible' | 'streaming'
- `BorderStyle` - **String** - 'fill' | 'stroke'
- `AvatarShape` - **String** - 'circle' | 'square'
- `TextCard` - `{
    content: string;
    color?: Color;
    font?: string;
    size?: number;
    weight?: string;
}`
- `BackgroundBaseColor` - `{
    background: Color;
    waves?: Color;
}`
- `BackgroundRankColor` - `{
    background: Color;
    bubbles?: Color;
}`

# 📗 Utils

- `rgbToHex` - Color conversion from rgb | rgba to hex
- `hexToRgbA` - Color conversion from hex to rgba
- `loadFonts` - Registers a group of fonts for use in the canvas
- `loadFont` - Registers a font for use in the canvas

> 📌 **Note:** If font already registered, repeated loading does not occur.

# 💎 Contributing

If you have a request for a new feature you can open an issue on Github.

# 📄 Credits

Made by [gusarovv](https://github.com/gusarovv) with ❤️

Please give a ⭐️ if this project helped you!
