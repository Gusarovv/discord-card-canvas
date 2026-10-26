import { createCanvas } from 'canvas';
import { RankCardBuilder, RankCardParams } from '../../src/cards/rating/rank/rank-card';
import { createTestAvatar, createTestBackground, createTestPhoto } from '../support/images';
import { describeVisual, toPng } from '../support/visual';

const background = createTestBackground(1000, 250);
const avatarOrange = createTestAvatar('orange');
const avatarBlue = createTestAvatar('blue');
const avatarBurgundy = createTestAvatar('burgundy');

const orangeParams: RankCardParams = {
  currentLvl: 50,
  currentRank: 3,
  currentXP: 5134,
  requiredXP: 15100,
  nicknameText: { content: 'pixel_pancake' },
  userStatus: 'online',
  avatarImgURL: avatarOrange,
  backgroundColor: { background: '#fff', bubbles: '#f48b2d' },
  requiredXPColor: '#78716C',
  currentXPColor: '#B45309',
  avatarBackgroundColor: '#fbbf60',
  colorTextDefault: '#B45309',
  progressBarColor: '#f48b2d',
};

const blueParams: RankCardParams = {
  currentLvl: 100,
  currentRank: 1,
  currentXP: 27550,
  requiredXP: 55100,
  nicknameText: { content: 'Juniper', color: '#FFFFFF', size: 42, weight: '700' },
  userStatus: 'online',
  avatarImgURL: avatarBlue,
  backgroundColor: { background: '#070d19', bubbles: '#0CA7FF' },
  colorTextDefault: '#0CA7FF',
  progressBarColor: '#0CA7FF',
  avatarBackgroundColor: '#0CA7FF',
};

const burgundyParams: RankCardParams = {
  ...blueParams,
  avatarImgURL: avatarBurgundy,
  backgroundColor: { background: '#4d1821', bubbles: '#d24b5a' },
  colorTextDefault: '#f0dbb9',
  currentXPColor: '#f0dbb9',
  progressBarColor: '#d24b5a',
  avatarBackgroundColor: '#d24b5a',
};

const photoTextColors = {
  colorTextDefault: '#FFFFFF',
  currentXPColor: '#fbbf60',
  requiredXPColor: '#E9D5FF',
} as const;

async function render(params: RankCardParams, only?: string[]): Promise<Buffer> {
  return toPng(await new RankCardBuilder(params).build({ only }));
}

describeVisual('RankCardBuilder', () => {
  it('orange: default circle, status and bubbles', async () => {
    expect(await render(orangeParams)).toMatchImageSnapshot();
  });

  it('orange: bubblesEnable false', async () => {
    expect(await render({ ...orangeParams, bubblesEnable: false })).toMatchImageSnapshot();
  });

  it('orange: userStatusEnable false', async () => {
    expect(await render({ ...orangeParams, userStatusEnable: false })).toMatchImageSnapshot();
  });

  it('orange: square avatar', async () => {
    expect(await render({ ...orangeParams, avatarShape: 'square' })).toMatchImageSnapshot();
  });

  it('orange: square avatar without status and bubbles', async () => {
    const png = await render({
      ...orangeParams,
      avatarShape: 'square',
      userStatusEnable: false,
      bubblesEnable: false,
    });
    expect(png).toMatchImageSnapshot();
  });

  it('burgundy: default circle, status and bubbles', async () => {
    expect(await render(burgundyParams)).toMatchImageSnapshot();
  });

  it('blue: square avatar without status', async () => {
    const png = await render({ ...blueParams, avatarShape: 'square', userStatusEnable: false });
    expect(png).toMatchImageSnapshot();
  });

  it('avatarBackgroundEnable false', async () => {
    expect(await render({ ...orangeParams, avatarBackgroundEnable: false })).toMatchImageSnapshot();
  });

  it('background without bubbles color renders like bubblesEnable false', async () => {
    const noBubblesColor = await render({
      ...blueParams,
      backgroundColor: { background: '#070d19' },
    });
    const bubblesDisabled = await render({ ...blueParams, bubblesEnable: false });
    expect(noBubblesColor.equals(bubblesDisabled)).toBe(true);
  });

  it.each(['idle', 'dnd', 'offline', 'streaming'] as const)('status %s', async (userStatus) => {
    expect(await render({ ...blueParams, userStatus })).toMatchImageSnapshot();
  });

  it('status invisible renders like offline', async () => {
    const invisible = await render({ ...blueParams, userStatus: 'invisible' });
    const offline = await render({ ...blueParams, userStatus: 'offline' });
    expect(invisible.equals(offline)).toBe(true);
  });

  it('XP above requiredXP', async () => {
    const png = await render({ ...burgundyParams, currentXP: 61000, requiredXP: 55100 });
    expect(png).toMatchImageSnapshot();
  });

  it('XP is zero', async () => {
    expect(await render({ ...blueParams, currentXP: 0 })).toMatchImageSnapshot();
  });

  it('long nickname is squeezed to the free width', async () => {
    const png = await render({
      ...orangeParams,
      nicknameText: { content: 'Maximilian Petrov-Vasquez (he/him) | Host' },
    });
    expect(png).toMatchImageSnapshot();
  });

  it('large level and rank numbers', async () => {
    const png = await render({
      ...burgundyParams,
      currentLvl: 99999,
      currentRank: 99999,
      currentXP: 9999999,
      requiredXP: 9999999,
    });
    expect(png).toMatchImageSnapshot();
  });

  it('level 0, rank 0', async () => {
    const png = await render({
      ...orangeParams,
      currentLvl: 0,
      currentRank: 0,
      currentXP: 0,
      requiredXP: 100,
    });
    expect(png).toMatchImageSnapshot();
  });

  it('background image with overlay 0.5', async () => {
    const png = await render({
      ...orangeParams,
      ...photoTextColors,
      backgroundImgURL: background,
      overlayOpacity: 0.5,
    });
    expect(png).toMatchImageSnapshot();
  });

  it('objectFit: cover crops a square photo', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      ...photoTextColors,
      backgroundImgURL: createTestPhoto(),
    }).build({ objectFit: 'cover' });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('prefixes and number formats', async () => {
    const png = await render({
      ...orangeParams,
      lvlPrefix: { content: 'УР', color: '#78716C' },
      rankPrefix: { content: 'МЕСТО', size: 30 },
      lvlNumFormat: { size: 50, weight: '800' },
      rankNumFormat: { color: '#78716C', weight: '700' },
    });
    expect(png).toMatchImageSnapshot();
  });

  it('custom font family', async () => {
    const png = await render({
      ...burgundyParams,
      nicknameText: { content: 'Juniper', font: 'TestCustom', color: '#FFFFFF', size: 42 },
      lvlNumFormat: { font: 'TestCustom' },
      rankNumFormat: { font: 'TestCustom' },
    });
    expect(png).toMatchImageSnapshot();
  });

  it('only: background, avatar, nickname, progress bar and XP', async () => {
    const png = await render(orangeParams, [
      'background',
      'avatar',
      'nickname',
      'progressBar',
      'xp',
    ]);
    expect(png).toMatchImageSnapshot();
  });

  it('only without XP gives the nickname the full width', async () => {
    const png = await render(
      {
        ...orangeParams,
        nicknameText: { content: 'Maximilian Petrov-Vasquez (he/him) | Host' },
      },
      ['background', 'avatar', 'nickname', 'rank', 'lvl'],
    );
    expect(png).toMatchImageSnapshot();
  });

  it('rgb bubbles color renders like hex', async () => {
    const rgb = await render({
      ...blueParams,
      backgroundColor: { background: '#070d19', bubbles: 'rgb(12, 167, 255)' },
    });
    expect(rgb.equals(await render(blueParams))).toBe(true);
  });
});

describe('RankCardBuilder setters', () => {
  const initial: RankCardParams = {
    nicknameText: { content: 'Initial' },
    currentLvl: 1,
    currentRank: 1,
    currentXP: 1,
    requiredXP: 2,
    userStatus: 'dnd',
    avatarBackgroundEnable: false,
  };

  it('match constructor params', async () => {
    const viaConstructor = await new RankCardBuilder({
      ...initial,
      nicknameText: { content: 'Setter' },
      currentLvl: 12,
      currentRank: 4,
      currentXP: 300,
      requiredXP: 900,
      backgroundColor: { background: '#1a1a2e', bubbles: '#e94560' },
      avatarImgURL: avatarBurgundy,
      avatarBackgroundColor: '#e94560',
      avatarBackgroundEnable: true,
      avatarShape: 'square',
      userStatusEnable: false,
      bubblesEnable: false,
      fontDefault: 'Inter',
      colorTextDefault: '#feca57',
      lvlPrefix: { content: 'LEVEL' },
      rankPrefix: { content: 'PLACE' },
      lvlNumFormat: { weight: '800' },
      rankNumFormat: { size: 50 },
    }).build();
    const viaSetters = await new RankCardBuilder(initial)
      .setNicknameText({ content: 'Setter' })
      .setCurrentLvl(12)
      .setCurrentRank(4)
      .setCurrentXP(300)
      .setRequiredXP(900)
      .setBackgroundColor({ background: '#1a1a2e', bubbles: '#e94560' })
      .setAvatarImgURL(avatarBurgundy)
      .setAvatarBackgroundColor('#e94560')
      .setAvatarBackgroundEnable(true)
      .setAvatarShape('square')
      .setUserStatusEnable(false)
      .setBubblesEnable(false)
      .setFontDefault('Inter')
      .setColorTextDefault('#feca57')
      .setLvlPrefix({ content: 'LEVEL' })
      .setRankPrefix({ content: 'PLACE' })
      .setlvlNumFormat({ weight: '800' })
      .setrankNumFormat({ size: 50 })
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });

  it('match constructor params for the background image', async () => {
    const viaConstructor = await new RankCardBuilder({
      ...initial,
      backgroundImgURL: background,
      overlayOpacity: 0.7,
    }).build();
    const viaSetters = await new RankCardBuilder(initial)
      .setBackgroundImgURL(background)
      .setOverlayOpacity(0.7)
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });
});

describe('RankCardBuilder draw', () => {
  it('keeps save and restore balanced when only skips the level', async () => {
    const ctx = createCanvas(1000, 250).getContext('2d');
    ctx.fillStyle = '#123456';
    ctx.save();
    ctx.fillStyle = '#abcdef';
    await new RankCardBuilder(orangeParams).draw(ctx, 1000, 250, { only: ['background'] });
    ctx.restore();
    expect(ctx.fillStyle).toBe('#123456');
  });
});
