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