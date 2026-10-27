# <p align="center">⭐ discord-card-canvas</p>

<p align="center">Welcome, leave, rank, level-up and info card images for Discord bots, built on node-canvas.</p>

<p align="center"><img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/rank-blue.png" alt="Rank card made with discord-card-canvas" /></p>

<p align="center">
  <a href="https://www.npmjs.com/package/discord-card-canvas"><img src="https://img.shields.io/npm/v/discord-card-canvas" alt="npm version" /></a>
  <a href="https://github.com/Gusarovv/discord-card-canvas/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/discord-card-canvas" alt="license" /></a>
  <a href="https://github.com/Gusarovv/discord-card-canvas/actions/workflows/ci.yml"><img src="https://github.com/Gusarovv/discord-card-canvas/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="https://www.npmjs.com/package/discord-card-canvas"><img src="https://img.shields.io/npm/unpacked-size/discord-card-canvas" alt="npm package size" /></a>
</p>

## 👨🏻‍💻 Installation <a name="Installation"></a>

```bash
npm install discord-card-canvas
```

The only dependency is [node-canvas](https://github.com/Automattic/node-canvas). It downloads a prebuilt binary in an install script, and some package managers block install scripts of dependencies by default:

- npm 12 skips the script with a warning, and loading the package then fails with `Cannot find module '../build/Release/canvas.node'`. Allow the script in your project's `package.json` before installing:

  ```bash
  npm pkg set allowScripts.canvas=true --json
  npm install discord-card-canvas
  ```

  If the package is already installed, run the same `npm pkg set` command and then `npm rebuild canvas`.

- pnpm 10 skips the script too, and pnpm 11 and later stop the installation with `ERR_PNPM_IGNORED_BUILDS`. Allow the build while adding the package:

  ```bash
  pnpm add --allow-build=canvas discord-card-canvas
  ```

Prebuilt binaries exist for Linux x64 and arm64 with glibc, macOS x64 and arm64, and Windows x64. On other platforms, such as Alpine Linux (musl) or Windows on ARM, canvas compiles from source and needs the libraries listed in [its compiling guide](https://github.com/Automattic/node-canvas#compiling).

## ⚡ Quick start

A `/rank` slash command for discord.js v14:

```ts
import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { RankCardBuilder } from 'discord-card-canvas';

export const data = new SlashCommandBuilder().setName('rank').setDescription('Shows your rank card');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const card = await new RankCardBuilder({
    nicknameText: { content: interaction.user.displayName },
    avatarImgURL: interaction.user.displayAvatarURL({ extension: 'png', size: 256 }),
    currentLvl: 12,
    currentRank: 3,
    currentXP: 4200,
    requiredXP: 6000,
    userStatus: 'online',
  }).build();

  await interaction.editReply({
    files: [new AttachmentBuilder(card.toBuffer(), { name: 'rank.png' })],
  });
}
```

The rank card uses the Nunito font by default, which is not bundled with the package. Register it once at startup, see [Troubleshooting](#Troubleshooting).

## Features

- 🃏 Builders for welcome, leave, rank, level-up and info cards
- 🎨 Custom colors, fonts, background images and avatar shapes
- 🧩 `draw(ctx, width, height)` renders a card on your own canvas
- 🗂 Image cache and a pluggable image loader
- 📘 TypeScript types and visual regression tests for every card

Used in production by [Raccoon Bot](https://raccoon-bot.com).

# 🧾 Examples

The pictures use custom avatars, while the code uses Discord's default avatar.

## Example Rank

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/rank-blue.png" alt="Blue rank card" />

```ts
const canvasRank = await new RankCardBuilder({
    currentLvl: 102,
    currentRank: 563,
    currentXP: 71032,
    requiredXP: 95195,
    backgroundColor: { background: '#070d19', bubbles: '#0ca7ff' },
    // backgroundImgURL: 'https://example.com/background.png',
    avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
    nicknameText: { content: 'xNinja_Catx', font: 'Nunito', color: '#0CA7FF' },
    userStatus: 'idle',
}).build();

// Saving an image
fs.writeFileSync('rank_blue.png', canvasRank.toBuffer());

// Example of sending to a channel
channel.send({ files: [{ attachment: canvasRank.toBuffer(), name: 'rank.png' }] });
```

---

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/rank-orange.png" alt="Orange rank card" />

```ts
const canvasRank = await new RankCardBuilder({
  currentLvl: 50,
  currentRank: 3,
  currentXP: 23478,
  requiredXP: 68195,
  fontDefault: 'Inter',
  backgroundColor: { background: '#fff', bubbles: '#f48b2d' },
  avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
  nicknameText: { content: 'Good_Hateful' },
  userStatus: 'online',
  requiredXPColor: '#7F8381',
  currentXPColor: '#f48b2d',
  avatarBackgroundColor: '#fbbf60',
  colorTextDefault: '#f48b2d',
  progressBarColor: '#f48b2d',
  lvlNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
  rankNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
}).build({ objectFit: 'cover' });

fs.writeFileSync('rank_orange.png', canvasRank.toBuffer());
```

`build({ only: ['background', 'nickname', 'avatar'] })` draws only the listed parts of the card.

---

## Example Level Up

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/level-up-blue.png" alt="Blue level-up card" />

```ts
const canvasLevelUp = await new LevelUpBuilder({
    nicknameText: { content: 'Raccoon Bot', font: 'Nunito', color: '#0CA7FF' },
    previousLvl: 4,
    newLvl: 5,
    avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
    userStatus: 'dnd',
    backgroundColor: { background: '#070d19', pattern: 'bubbles', patternColor: '#0CA7FF' },
}).build();

fs.writeFileSync('level-up.png', canvasLevelUp.toBuffer());
```

---

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/level-up-orange.png" alt="Orange level-up card" />

```ts
const canvasLevelUp = await new LevelUpBuilder({
    nicknameText: { content: 'Raccoon Developer', font: 'Nunito', color: '#f48b2d' },
    previousLvl: 24,
    newLvl: 25,
    avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
    userStatus: 'idle',
    colorTextDefault: '#f48b2d',
    avatarBackgroundColor: '#fbbf60',
    backgroundColor: { background: '#1a1a2e', pattern: 'stars', patternColor: '#f48b2d' },
    levelUpText: { content: 'LEVEL UP', color: '#d4782a' },
}).build();

fs.writeFileSync('level-up-orange.png', canvasLevelUp.toBuffer());
```

---

## Example Welcome/Leave

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/welcome.png" alt="Welcome card" />

```ts
const cv = new WelcomeBuilder({
  // backgroundImgURL: 'https://example.com/background.png',
  fontDefault: 'Inter',
  nicknameText: { color: '#0CA7FF', content: 'DobrayaKnopKa#2575' },
  secondText: { color: '#0CA7FF', content: 'Raccoon Bot Discord' },
  avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
});

fs.writeFileSync('welcome-1.png', (await cv.build()).toBuffer());
```

---

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/leave.png" alt="Leave card" />

```ts
const cv = new LeaveBuilder({
  nicknameText: { content: 'DobrayaKnopKa#2575' },
  avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
});
cv.setFontDefault('Inter');
cv.setSecondText({ content: 'Raccoon Bot Discord' });

fs.writeFileSync('welcome-2.png', (await cv.build()).toBuffer());
```

> ⚠️For full control when creating a card, use BaseCardBuilder.

---

## Example Info

<img src="https://raw.githubusercontent.com/Gusarovv/discord-card-canvas/main/.github/assets/info.png" alt="Info card" />

```ts
const canvasInfo = await new InfoCardBuilder({
    // backgroundImgURL: 'https://example.com/background.png',
    backgroundColor: {background: '#fff', waves: '#0ca7ff'},
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
- `overlayOpacity` - Opacity of the dark overlay on the background image (0–1). Only applies when `backgroundImgURL` is set.
- `backgroundColor` - Background color (if no background image is selected).
  - Default: `{ background: '#FFF', waves: '#0CA7FF' }`
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
- `overlayOpacity` - Opacity of the dark overlay on the background image (0–1). Only applies when `backgroundImgURL` is set.
- `backgroundColor` - Background color (if no background image is selected).
  - Default: `{ background: '#FFF', bubbles: '#0CA7FF' }`
- `avatarImgURL` - URL to the avatar user image.
- `avatarBackgroundEnable` - Whether the circle behind the avatar is enabled.
  - Default: `true`
- `avatarBackgroundColor` - The color of the circle behind the avatar.
  - Default: `'#0CA7FF'`
- `avatarShape` - Avatar shape.
  - `'circle'` or `'square'`
  - Default: `'circle'`
- `userStatusEnable` - Whether the user status indicator is shown.
  - Default: `true`
- `bubblesEnable` - Whether the background bubbles are shown (when no background image).
  - Default: `true`
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
- `overlayOpacity` - Opacity of the dark overlay on the background image (0–1). Only applies when `backgroundImgURL` is set.
- `backgroundColor` - Background color (if no background image is selected).
- `mainText` - The main text on the card.

> ✍️ **Important:** To create a canvas object, use the **build()** method of the class.

---

## LevelUpBuilder

Creating a level-up notification card with a resolution of 1000x250 px.

- `nicknameText *` - User's nickname.
  - Default: { size: `35`, weight: `'600'` }
- `previousLvl *` - Previous level number.
- `newLvl *` - New level number.
- `avatarImgURL` - URL to the avatar user image.
- `avatarBackgroundColor` - The color of the circle behind the avatar.
  - Default: `'#0CA7FF'`
- `avatarBackgroundEnable` - Whether the circle behind the avatar is enabled.
  - Default: `true`
- `userStatus` - User status.
  - Default: `'online'`
- `userStatusEnable` - Whether the user status indicator is shown.
  - Default: `true`
- `backgroundImgURL` - URL to the background image.
- `overlayOpacity` - Opacity of the dark overlay on the background image (0–1). Only applies when `backgroundImgURL` is set.
- `backgroundColor` - Background color with pattern.
  - Default: `{ background: '#FFF', pattern: 'stars', patternColor: '#0CA7FF' }`
  - `background` - Background color
  - `pattern` - `'stars'` or `'bubbles'`; Default: `'stars'`
  - `patternColor` - Pattern color; Default: `colorTextDefault`
- `patternEnable` - Whether the background pattern is shown (when no background image).
  - Default: `true`
- `fontDefault` - Default font.
  - Default: `'Nunito'`
- `colorTextDefault` - Default text color.
  - Default: `'#0CA7FF'`
- `levelUpText` - Customizable "LEVEL UP" text.
  - Default: { content: `'LEVEL UP'`, size: `32`, weight: `'800'` }
    > 🔹 `*` - Required parameters

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
- `basePath` (`string`, optional): Base path for all font files. Without it, font paths are used as given, and relative paths resolve against the current working directory.

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
  avatarImgURL: 'https://cdn.discordapp.com/embed/avatars/0.png',
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
- `BackgroundLevelUpColor` - `{
    background: Color;
    pattern?: 'stars' | 'bubbles';
    patternColor?: Color;
}`

# 📗 Utils

- `rgbToHex` - Color conversion from rgb | rgba to hex
- `hexToRgbA` - Color conversion from hex (3, 4, 6 or 8 digits), rgb or rgba to rgba with the given opacity
- `loadImageSafe` - Loads an image by URL with caching, returns `null` on an invalid URL or a failed load
  - Discord CDN images ending in `.webp`, except attachments and external images, are requested as `.png`
- `setImageLoader` - Sets a custom image loader and clears the image cache; `null` restores the default loader
  - The loader receives the URL after the `.webp` to `.png` rewrite and returns a `Buffer`, an `Image` or `null` to use the default loader for that URL
- `clearImageCache` - Clears the in-memory image cache
- `loadFonts` - Registers a group of fonts for use in the canvas
- `loadFont` - Registers a font for use in the canvas

> 📌 **Note:** If font already registered, repeated loading does not occur.

# 🧰 Troubleshooting <a name="Troubleshooting"></a>

- **`Error loading the avatar image` with a Discord avatar.** node-canvas cannot decode WebP and AVIF, and discord.js returns WebP avatar URLs by default. Since 2.3.3 the library requests `.webp` images from `cdn.discordapp.com` and `media.discordapp.net` as `.png`, except attachments and external images. With `{ extension: 'png' }` in `displayAvatarURL()` static avatars come as PNG and animated ones as GIF, which works before 2.3.3 too. For WebP or AVIF images from other sources, convert them to PNG or JPEG in a loader set with `setImageLoader` and return the result as a `Buffer`.
- **Text is drawn in a fallback font.** The default fonts, Nunito for most cards and Inter for the info card, are not bundled with the package. Download the static (non-variable) font files of [Nunito](https://fonts.google.com/specimen/Nunito) and [Inter](https://fonts.google.com/specimen/Inter) and register the weights the cards use once at startup, with the file names from your download:

  ```ts
  import { loadFonts } from 'discord-card-canvas';

  loadFonts(
    [
      { path: 'Nunito-SemiBold.ttf', family: 'Nunito', weight: '600' },
      { path: 'Nunito-Bold.ttf', family: 'Nunito', weight: '700' },
      { path: 'Nunito-ExtraBold.ttf', family: 'Nunito', weight: '800' },
      { path: 'Inter-ExtraBold.ttf', family: 'Inter', weight: '800' },
    ],
    './fonts',
  );
  ```

  Register the other fonts and weights set in your cards the same way.

- **`Cannot find module '../build/Release/canvas.node'` or `ERR_PNPM_IGNORED_BUILDS`.** The package manager blocked the install script of canvas, see [Installation](#Installation).

# 💎 Contributing

If you have a request for a new feature you can open an issue on Github.

## Development

Tests run on [Vitest](https://vitest.dev) and compare every card with a PNG baseline in `test/__image_snapshots__`. They need Node.js 22.12 or newer.

```bash
npm test             # run all tests once
npm run dev:test     # watch mode, press "u" to accept changed images
npm run test:update  # rewrite changed and missing baselines
npm run typecheck    # type-check the tests
```

Visual tests run only on Linux x64, where the baselines are rendered, and are skipped on other platforms. After every run `test/.gallery/index.html` shows all baselines, with the diffs of failed comparisons on top.

# 📄 Credits

Made by [gusarovv](https://github.com/gusarovv) with ❤️

Please give a ⭐️ if this project helped you!
