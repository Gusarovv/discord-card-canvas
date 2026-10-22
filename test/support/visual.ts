import path from 'node:path';
import { Canvas } from 'canvas';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { loadFont } from '../../src/utils/load-font';

/** Font fixtures as [file, family, weight] */
export const fontFixtures: ReadonlyArray<readonly [string, string, string]> = [
  ['Nunito-Light.ttf', 'Nunito', '300'],
  ['Nunito-Regular.ttf', 'Nunito', '400'],
  ['Nunito-SemiBold.ttf', 'Nunito', '600'],
  ['Nunito-Bold.ttf', 'Nunito', '700'],
  ['Nunito-ExtraBold.ttf', 'Nunito', '800'],
  ['Inter-Bold.ttf', 'Inter', '700'],
  ['Inter-ExtraBold.ttf', 'Inter', '800'],
  ['Inter-SemiBold.ttf', 'TestCustom', '600'],
];

for (const [file, family, weight] of fontFixtures) {
  loadFont(path.resolve(__dirname, '../fonts', file), { family, weight });
}

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    customSnapshotsDir: path.resolve(__dirname, '../__image_snapshots__'),
    runInProcess: true,
  }),
});

/** Runs the suite only on Linux x64 */
export const describeVisual = describe.runIf(
  process.platform === 'linux' && process.arch === 'x64',
);

/** Encodes a card as PNG with maximum compression */
export function toPng(canvas: Canvas): Buffer {
  return canvas.toBuffer('image/png', { compressionLevel: 9 });
}
