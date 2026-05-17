import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { LevelUpBuilder } from '../cards/level-up/level-up-card';
import { createTestAvatar, createTestBackground } from './create-test-avatar';

expect.extend({ toMatchImageSnapshot });

const avatar = createTestAvatar('#5865F2');
const bgUrl = createTestBackground(1000, 250);

const blueParams = {
  nicknameText: { content: 'xNinja_Catx', color: '#0CA7FF' as const },
  previousLvl: 9,
  newLvl: 10,
  avatarImgURL: avatar,
  backgroundColor: {
    background: '#070d19' as const,
    pattern: 'stars' as const,
    patternColor: '#0CA7FF' as const,
  },
};

const orangeParams = {
  nicknameText: { content: 'Good_Hateful' },
  previousLvl: 49,
  newLvl: 50,
  avatarImgURL: createTestAvatar('#f48b2d'),
  backgroundColor: {
    background: '#1a1a2e' as const,
    pattern: 'stars' as const,
    patternColor: '#f48b2d' as const,
  },
  colorTextDefault: '#f48b2d' as const,
  avatarBackgroundColor: '#f48b2d' as const,
};

describe('LevelUpBuilder', () => {
  it('should create canvas with correct dimensions', async () => {
    const canvas = await new LevelUpBuilder(blueParams).build();
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(250);
  });

  // --- Stars pattern ---

  it('blue — stars pattern (default)', async () => {
    const canvas = await new LevelUpBuilder(blueParams).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('orange — stars pattern', async () => {
    const canvas = await new LevelUpBuilder(orangeParams).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Bubbles pattern ---

  it('blue — bubbles pattern', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      backgroundColor: {
        background: '#070d19' as const,
        pattern: 'bubbles',
        patternColor: '#0CA7FF' as const,
      },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Background image ---

  it('with background image + overlay', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      backgroundImgURL: bgUrl,
      overlayOpacity: 0.5,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Options ---

  it('without avatar', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      avatarImgURL: undefined,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('avatarBackgroundEnable: false', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      avatarBackgroundEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('custom levelUpText', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      levelUpText: { content: 'NIVEAU HAUT', size: 28 },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('patternEnable: false — solid background without decoration', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      patternEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('setPatternEnable(false) via fluent setter', async () => {
    const builder = new LevelUpBuilder(blueParams);
    builder.setPatternEnable(false);
    const canvas = await builder.build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Edge cases ---

  it('large level numbers', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      previousLvl: 999,
      newLvl: 1000,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('very long nickname — should be truncated', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      nicknameText: { content: 'ThisIsAnExtremelyLongNicknameThatShouldBeTruncated' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('setters work via fluent API', async () => {
    const builder = new LevelUpBuilder(blueParams);
    builder.setNewLvl(99);
    builder.setPreviousLvl(98);
    builder.setAvatarBackgroundEnable(false);
    const canvas = await builder.build();
    expect(canvas.toBuffer()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'fluent-api-lvl-98-99-no-bg',
    });
  });
});
