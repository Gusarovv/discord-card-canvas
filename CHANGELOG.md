## [2.0.2](https://github.com/Gusarovv/discord-card-canvas/compare/v2.0.1...v2.0.2) (2026-03-22)

### 🛠 Dependencies:

- Updated `@types/node` from `22.13.5` to `22.15.24`
- Updated `typescript` from `5.7.3` to `5.8.3`

## [2.0.1](https://github.com/Gusarovv/discord-card-canvas/compare/v2.0.0...v2.0.1) (2024-12-01)

### 🛠 Dependencies:

- Updated `canvas` from `2.11.2` to `3.1.0`
- Updated `@types/node` from `22.10.0` to `22.13.5` 
- Updated `typescript` from `5.7.2` to `5.7.3`

## [2.0.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.4.4...v2.0.0) (2024-11-28)

### 🚀 Breaking Changes:

- **Custom Fonts Support:**
  - The library no longer includes preloaded fonts.
  - Added full support for custom font loading with the `loadFont` and `loadFonts` utility methods.
    > Example:
    > ```typescript
    > loadFont('./fonts/Roboto-Bold.ttf', { family: 'Roboto', weight: '700', style: 'normal' });
    > ```
  - This change allows you to use any font you prefer, providing greater flexibility and reducing library size.

### ✨ New Features:

- **Enhanced TextCard Options:**
  - `TextCard` now includes additional properties:
    - `size`: Easily specify font size for individual text elements.
    - `weight`: Specify font weight (e.g., `'300'`, `'700'`).
    - `color`: Set specific colors for text elements.
    > Example:
    > ```typescript
    > mainText: { content: 'Hello World', font: 'Roboto', size: 40, weight: '700', color: '#FF5733' };
    > ```

- **Updated Builders:**
  - Added fine-grained control for font properties (`size`, `weight`, `color`) across all card builders.
  - Example usage for `BaseCardBuilder`:
    ```typescript
    const canvas = await new BaseCardBuilder({
      mainText: { content: 'HELLO', font: 'Roboto', size: 48, weight: '800', color: '#FF0000' },
      nicknameText: { content: 'User', font: 'Roboto', size: 35, weight: '700' },
    }).build();
    ```

### 📖 Documentation:

- Updated README:
  - Added detailed examples for `loadFont` and `loadFonts` usage.
  - Highlighted the removal of preloaded fonts and how to use the new font-loading utilities.
  - Included examples for the new `TextCard` properties (`size`, `weight`, `color`).
  - Improved instructions for creating rank, welcome, and info cards with custom fonts and styles.

### 🛠 Dependencies:

- Updated `canvas` from `2.10.2` to `2.11.2`.
- Updated `@types/node` from `20.6.3` to `22.10.0`.
- Updated `typescript` from `5.2.2` to `5.7.2`.
- Updated `rimraf` from `5.0.5` to `6.0.1`.

### 🔖 Additional Notes:

- If you previously relied on the preloaded fonts, you must now register your own fonts using `loadFont` or `loadFonts`.
- This update significantly reduces the size of the library, making it faster and more efficient.
- The new `TextCard` properties (`size`, `weight`, `color`) offer unparalleled customization options for text rendering in your cards.

## [1.4.4](https://github.com/Gusarovv/discord-card-canvas/compare/v1.4.3...v1.4.4) (2023-10-28)

### Dependencies:

- Bump @types/node from 20.6.3 to 20.8.9
- Bump rimraf from 5.0.1 to 5.0.5

## [1.4.3](https://github.com/Gusarovv/discord-card-canvas/compare/v1.4.2...v1.4.3) (2023-09-22)

### Bugs fixed:

- The options for building a rating card did not affect the drawing
  > `new RankCardBuilder({ ... }).build({ objectFit: 'cover' })`

### Documentation:

- Minor documentation corrections

### Dependencies:

- Bump canvas from 2.10.2 to 2.11.2
- Bump @types/node from 20.4.5 to 20.6.3
- Bump typescript from 5.1.6 to 5.2.2

## [1.4.2](https://github.com/Gusarovv/discord-card-canvas/compare/v1.4.1...v1.4.2) (2023-07-29)

### Dependencies:

- Bump @types/node from 20.4.1 to 20.4.5 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/63

## [1.4.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.4.0...v1.4.1) (2023-07-12)

### Dependencies:

- Bump @types/node from 20.1.1 to 20.4.1
- Bump rimraf from 5.0.0 to 5.0.1
- Bump typescript from 5.0.3 to 5.1.6

## [1.4.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.3.1...v1.4.0) (2023-04-22)

### New feature:

- Added the ability to draw the image in the 'Cover' mode. The image will retain its proportions when filling the block: the final size of the content will be defined as the "coverage" of the block, limited by its width and height.
- Now drawing options can be set when called .build()
  > Example: `new BaseCardBuilder({ ... }).build({ objectFit: 'cover', only: ['background', 'nickname'] })`

> 🔹 By default, all images are still drawn in the 'fill' mode.

### Dependencies:

- Bump typescript from 5.0.3 to 5.0.4 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/30
- Bump @types/node from 18.15.11 to 18.15.13 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/33
- Bump rimraf from 4.4.1 to 5.0.0 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/31

## [1.3.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.3.0...v1.3.1) (2023-04-05)

### Dependencies:

- Bump rimraf from 4.1.2 to 4.1.3 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/13
- Bump @types/node from 18.14.2 to 18.14.4 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/12
- Bump rimraf from 4.1.3 to 4.3.1 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/17
- Bump @types/node from 18.14.4 to 18.14.6 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/16
- Bump canvas from 2.11.0 to 2.11.2 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/29
- Bump rimraf from 4.3.1 to 4.4.1 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/24
- Bump typescript from 4.9.5 to 5.0.3 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/28
- Bump @types/node from 18.14.6 to 18.15.11 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/27

## [1.3.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.5...v1.3.0) (2023-03-01)

### New feature:

- Default background with waves for base card (via canvas)([`6fb1561`](https://github.com/Gusarovv/discord-card-canvas/commit/6fb156140c254079786a924571420ed301cf4425))
  > Example: `new BaseCardBuilder({ background: '#FFFFFF', waves: '#FFAD4E' }, ... })`
- Default background with bubbles for rank card (via canvas)([`5153140`](https://github.com/Gusarovv/discord-card-canvas/commit/5153140c02f922d87cd49da9752261a3cdd45d4d))
  > Example: `new RankCardBuilder({ backgroundColor: { background: '#FFFFFF', bubbles: '#0CA7FF' }, ... })`
- Default background with waves for base card (via canvas)([`2f41095`](https://github.com/Gusarovv/discord-card-canvas/commit/2f41095370b2ddef61c153188af93a15813ab447))
- Color conversion utility from rgb to hex([`e6787c7`](https://github.com/Gusarovv/discord-card-canvas/commit/e6787c7da25046294fbba1997c12b282844bcb86))
- Color conversion utility from hex to rgba([`d36f36a`](https://github.com/Gusarovv/discord-card-canvas/commit/d36f36a645f71368852616b740617c32580e2653))

### Dependencies:

- Bump @types/node from 18.11.18 to 18.14.2 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/11
- Bump typescript from 4.9.4 to 4.9.5 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/6

## [1.2.5](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.4...v1.2.5) (2023-01-25)

### Other

- Package size reduction

### Dependencies:

- Bump rimraf from 4.1.1 to 4.1.2 (@dependabot) in https://github.com/Gusarovv/discord-card-canvas/pull/5

## [1.2.4](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.3...v1.2.4) (2023-01-20)

### Dependencies:

- Bump canvas from 2.10.2 to 2.11.0 (@dependabot) in https://github.com/Gusarovv/discord-card-canvas/pull/2
- Bump rimraf from 3.0.2 to 4.1.1 (@dependabot) in https://github.com/Gusarovv/discord-card-canvas/pull/3
- Bump @types/node from 18.11.17 to 18.11.18 (@dependabot) in https://github.com/Gusarovv/discord-card-canvas/pull/4

## [1.2.3](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.2...v1.2.3) (2022-12-20)

### Bugs fixed:

- Added support for 'invisible' user status([`7567376`](https://github.com/Gusarovv/discord-card-canvas/commit/75673768f51b1070dc99de6a471023764b8ecf51))

### Dependencies:

- Bump typescript to 4.9.4
- Bump @types/node to 18.11.17

## [1.2.2](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.1...v1.2.2) (2022-11-21)

### Dependencies:

- Bump typescript to 4.9.3
- Bump canvas to 2.10.2
- Bump @types/node to 18.11.9

## [1.2.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.0...v1.2.1) (2022-10-23)

### Bugs fixed:

- Content stroke (due to "destination-over")([`de4999e`](https://github.com/Gusarovv/discord-card-canvas/commit/de4999e02d5475001ed4a817a34e318d68a4607a))
- Clip avatar (deleted after drawing the avatar)([`ac03215`](https://github.com/Gusarovv/discord-card-canvas/commit/ac03215189e0e815b8f59777f81a090632b3c3de))

## [1.2.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.1.0...v1.2.0) (2022-10-23)

### New feature:

- Avatar border style for base card([`dc4ea04`](https://github.com/Gusarovv/discord-card-canvas/commit/dc4ea0479fd1287aa11b52b827228ca46a86bfdf))
- Draw only([`c92d2cc`](https://github.com/Gusarovv/discord-card-canvas/commit/c92d2cccf9e8ae658814092df8ab2727afb96ad9))
  > The ability to draw only the specified objects, without redrawing the entire canvas.\
  > Example: `this.draw(ctx, canvas.width, canvas.height, ['nickname', 'mainText']);` Only nickname and main text will be drawn

## [1.1.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.3...v1.1.0) (2022-10-17)

### New feature:

- New fonts([`7771223`](https://github.com/Gusarovv/discord-card-canvas/commit/7771223f3aec3745d0871b7f4491620c57a8d701))
- Draws the content on the created canvas([`33429cc`](https://github.com/Gusarovv/discord-card-canvas/commit/33429cc7b66c32cec1b0cd8bf09cd59bd371da0d))

### Bugs fixed:

- Registering fonts in the browser([`f5e30d1`](https://github.com/Gusarovv/discord-card-canvas/commit/f5e30d1f20dfbba7c31b25790db5ddf2b8554bf7))

## [1.0.3](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.1...v1.0.2) (2022-10-15)

### Documentation

- Fix package name in docs

## [1.0.2](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.1...v1.0.2) (2022-10-15)

### Documentation

- Added an example for Discord

## [1.0.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.0...v1.0.1) (2022-10-15)

### Documentation

- Description of classes, methods, types

# 1.0.0 (2022-10-12)
