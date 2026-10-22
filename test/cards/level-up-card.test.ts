import { LevelUpBuilder, LevelUpParams } from '../../src/cards/level-up/level-up-card';
import { createTestAvatar, createTestBackground, createTestPhoto } from '../support/images';
import { describeVisual, toPng } from '../support/visual';

const avatar = createTestAvatar('blue');
const background = createTestBackground(1000, 250);

const blueParams: LevelUpParams = {
  nicknameText: { content: 'Juniper', color: '#FFFFFF' },
  previousLvl: 99,
  newLvl: 100,
  avatarImgURL: avatar,
  backgroundColor: { background: '#070d19', pattern: 'stars', patternColor: '#0CA7FF' },
};

const orangeParams: LevelUpParams = {
  nicknameText: { content: 'pixel_pancake', color: '#FFFFFF' },
  previousLvl: 49,
  newLvl: 50,
  avatarImgURL: createTestAvatar('orange'),
  backgroundColor: { background: '#1a1a2e', pattern: 'stars', patternColor: '#fbbf60' },
  colorTextDefault: '#f48b2d',
  avatarBackgroundColor: '#fbbf60',
};

async function render(params: LevelUpParams): Promise<Buffer> {
  return toPng(await new LevelUpBuilder(params).build());
}

describeVisual('LevelUpBuilder', () => {
  it('blue: stars pattern', async () => {
    expect(await render(blueParams)).toMatchImageSnapshot();
  });

  it('orange: stars pattern', async () => {
    expect(await render(orangeParams)).toMatchImageSnapshot();
  });

  it('blue: bubbles pattern', async () => {
    const png = await render({
      ...blueParams,
      backgroundColor: { background: '#070d19', pattern: 'bubbles', patternColor: '#0CA7FF' },
    });
    expect(png).toMatchImageSnapshot();
  });

  it('background image with overlay 0.5', async () => {
    const png = await render({
      ...blueParams,
      backgroundImgURL: background,
      overlayOpacity: 0.5,
    });
    expect(png).toMatchImageSnapshot();
  });

  it('objectFit: cover crops a square photo', async () => {
    const canvas = await new LevelUpBuilder({
      ...blueParams,
      colorTextDefault: '#FFFFFF',
      backgroundImgURL: createTestPhoto(),
    }).build({ objectFit: 'cover' });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('without avatar', async () => {
    expect(await render({ ...blueParams, avatarImgURL: undefined })).toMatchImageSnapshot();
  });

  it('avatarBackgroundEnable false', async () => {
    expect(await render({ ...blueParams, avatarBackgroundEnable: false })).toMatchImageSnapshot();
  });

  it('custom levelUpText', async () => {
    const png = await render({
      ...blueParams,
      levelUpText: { content: 'NEW LEVEL REACHED', size: 28 },
    });
    expect(png).toMatchImageSnapshot();
  });

  it('patternEnable false: solid background', async () => {
    expect(await render({ ...blueParams, patternEnable: false })).toMatchImageSnapshot();
  });

  it.each(['idle', 'dnd', 'offline', 'streaming'] as const)('status %s', async (userStatus) => {
    expect(await render({ ...blueParams, userStatus })).toMatchImageSnapshot();
  });

  it('status invisible renders like offline', async () => {
    const invisible = await render({ ...blueParams, userStatus: 'invisible' });
    const offline = await render({ ...blueParams, userStatus: 'offline' });
    expect(invisible.equals(offline)).toBe(true);
  });

  it('userStatusEnable false', async () => {
    expect(await render({ ...blueParams, userStatusEnable: false })).toMatchImageSnapshot();
  });

  it('large level numbers', async () => {
    expect(await render({ ...blueParams, previousLvl: 999, newLvl: 1000 })).toMatchImageSnapshot();
  });

  it('long nickname is truncated', async () => {
    const png = await render({
      ...blueParams,
      nicknameText: { content: 'Maximilian Petrov-Vasquez | Mod', color: '#FFFFFF' },
    });
    expect(png).toMatchImageSnapshot();
  });
});

describe('LevelUpBuilder setters', () => {
  const initial: LevelUpParams = {
    ...blueParams,
    avatarBackgroundEnable: false,
    userStatusEnable: false,
  };

  it('match constructor params', async () => {
    const viaConstructor = await new LevelUpBuilder({
      ...initial,
      nicknameText: { content: 'Setter' },
      previousLvl: 98,
      newLvl: 99,
      avatarImgURL: createTestAvatar('rose'),
      avatarBackgroundColor: '#e94560',
      avatarBackgroundEnable: true,
      userStatus: 'dnd',
      userStatusEnable: true,
      backgroundColor: { background: '#1a1a2e', pattern: 'bubbles', patternColor: '#e94560' },
      patternEnable: false,
      fontDefault: 'Inter',
      colorTextDefault: '#feca57',
      levelUpText: { content: 'NEW LEVEL' },
    }).build();
    const viaSetters = await new LevelUpBuilder(initial)
      .setNicknameText({ content: 'Setter' })
      .setPreviousLvl(98)
      .setNewLvl(99)
      .setAvatarImgURL(createTestAvatar('rose'))
      .setAvatarBackgroundColor('#e94560')
      .setAvatarBackgroundEnable(true)
      .setUserStatus('dnd')
      .setUserStatusEnable(true)
      .setBackgroundColor({ background: '#1a1a2e', pattern: 'bubbles', patternColor: '#e94560' })
      .setPatternEnable(false)
      .setFontDefault('Inter')
      .setColorTextDefault('#feca57')
      .setLevelUpText({ content: 'NEW LEVEL' })
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });

  it('match constructor params for the background image', async () => {
    const viaConstructor = await new LevelUpBuilder({
      ...blueParams,
      backgroundImgURL: background,
      overlayOpacity: 0.7,
    }).build();
    const viaSetters = await new LevelUpBuilder(blueParams)
      .setBackgroundImgURL(background)
      .setOverlayOpacity(0.7)
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });
});
