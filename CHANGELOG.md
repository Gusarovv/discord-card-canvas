## [1.4.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.3.1...v1.4.0) (2023-04-22)

### New feature:

* Added the ability to draw the image in the 'Cover' mode.  The image will retain its proportions when filling the block: the final size of the content will be defined as the "coverage" of the block, limited by its width and height.
* Now drawing options can be set when called .build()
> Example: `new BaseCardBuilder({ ... }).build({ objectFit: 'cover', only: ['background', 'nickname'] })`

> 🔹 By default, all images are still drawn in the 'fill' mode.


### Dependencies:

* Bump typescript from 5.0.3 to 5.0.4 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/30
* Bump @types/node from 18.15.11 to 18.15.13 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/33
* Bump rimraf from 4.4.1 to 5.0.0 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/31


## [1.3.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.3.0...v1.3.1) (2023-04-05)

### Dependencies:

* Bump rimraf from 4.1.2 to 4.1.3 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/13
* Bump @types/node from 18.14.2 to 18.14.4 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/12
* Bump rimraf from 4.1.3 to 4.3.1 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/17
* Bump @types/node from 18.14.4 to 18.14.6 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/16
* Bump canvas from 2.11.0 to 2.11.2 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/29
* Bump rimraf from 4.3.1 to 4.4.1 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/24
* Bump typescript from 4.9.5 to 5.0.3 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/28
* Bump @types/node from 18.14.6 to 18.15.11 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/27

## [1.3.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.2.5...v1.3.0) (2023-03-01)

### New feature:

- Default background with waves for base card (via canvas)([`6fb1561`](https://github.com/Gusarovv/discord-canvas-card/commit/6fb156140c254079786a924571420ed301cf4425))
> Example: `new BaseCardBuilder({ background: '#FFFFFF', waves: '#FFAD4E' }, ... })` 
- Default background with bubbles for rank card (via canvas)([`5153140`](https://github.com/Gusarovv/discord-canvas-card/commit/5153140c02f922d87cd49da9752261a3cdd45d4d))
> Example: `new RankCardBuilder({ backgroundColor: { background: '#FFFFFF', bubbles: '#0CA7FF' }, ... })`
- Default background with waves for base card (via canvas)([`2f41095`](https://github.com/Gusarovv/discord-canvas-card/commit/2f41095370b2ddef61c153188af93a15813ab447))
- Color conversion utility from rgb to hex([`e6787c7`](https://github.com/Gusarovv/discord-canvas-card/commit/e6787c7da25046294fbba1997c12b282844bcb86))
- Color conversion utility from hex to rgba([`d36f36a`](https://github.com/Gusarovv/discord-canvas-card/commit/d36f36a645f71368852616b740617c32580e2653))

### Dependencies:

* Bump @types/node from 18.11.18 to 18.14.2 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/11
* Bump typescript from 4.9.4 to 4.9.5 by @dependabot in https://github.com/Gusarovv/discord-card-canvas/pull/6

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
- Added support for 'invisible' user status([`7567376`](https://github.com/Gusarovv/discord-canvas-card/commit/75673768f51b1070dc99de6a471023764b8ecf51))

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

- Content stroke (due to "destination-over")([`de4999e`](https://github.com/Gusarovv/discord-canvas-card/commit/de4999e02d5475001ed4a817a34e318d68a4607a))
- Clip avatar (deleted after drawing the avatar)([`ac03215`](https://github.com/Gusarovv/discord-canvas-card/commit/ac03215189e0e815b8f59777f81a090632b3c3de))

## [1.2.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.1.0...v1.2.0) (2022-10-23)

### New feature:

- Avatar border style for base card([`dc4ea04`](https://github.com/Gusarovv/discord-canvas-card/commit/dc4ea0479fd1287aa11b52b827228ca46a86bfdf))
- Draw only([`c92d2cc`](https://github.com/Gusarovv/discord-canvas-card/commit/c92d2cccf9e8ae658814092df8ab2727afb96ad9))
> The ability to draw only the specified objects, without redrawing the entire canvas.\
> Example: `this.draw(ctx, canvas.width, canvas.height, ['nickname', 'mainText']);` Only nickname and main text will be drawn

## [1.1.0](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.3...v1.1.0) (2022-10-17)

### New feature:

- New fonts([`7771223`](https://github.com/Gusarovv/discord-canvas-card/commit/7771223f3aec3745d0871b7f4491620c57a8d701))
- Draws the content on the created canvas([`33429cc`](https://github.com/Gusarovv/discord-canvas-card/commit/33429cc7b66c32cec1b0cd8bf09cd59bd371da0d))

### Bugs fixed:

- Registering fonts in the browser([`f5e30d1`](https://github.com/Gusarovv/discord-canvas-card/commit/f5e30d1f20dfbba7c31b25790db5ddf2b8554bf7))

## [1.0.3](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.1...v1.0.2) (2022-10-15)

### Documentation

* Fix package name in docs

## [1.0.2](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.1...v1.0.2) (2022-10-15)

### Documentation

* Added an example for Discord

## [1.0.1](https://github.com/Gusarovv/discord-card-canvas/compare/v1.0.0...v1.0.1) (2022-10-15)

### Documentation

* Description of classes, methods, types

# 1.0.0 (2022-10-12)
