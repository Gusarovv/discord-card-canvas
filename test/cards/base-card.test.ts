import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { BaseCardBuilder } from '../../src/cards/base/base-card';
import { Color } from '../../src/interface/card.interface';
import { createTestAvatar, createTestBackground, createTestPhoto } from '../support/images';
import { describeVisual, toPng } from '../support/visual';

const avatar = createTestAvatar('blue');
const background = createTestBackground(800, 350);

const baseParams = {
  fontDefault: 'Nunito',
  avatarImgURL: avatar,
  mainText: { content: 'Hello, traveler', weight: '700' },
  nicknameText: { content: 'midnight_fox', weight: '400' },
  secondText: { content: 'Member #1024', weight: '300' },
};

const burgundyTheme = {
  avatarImgURL: createTestAvatar('burgundy'),
  backgroundColor: { background: '#4d1821', waves: '#d24b5a' },
  avatarBorderColor: '#d24b5a',
  colorTextDefault: '#FFFFFF',
} as const;

const whiteTextColors = { colorTextDefault: '#FFFFFF', avatarBorderColor: '#FFFFFF' } as const;

describeVisual('BaseCardBuilder', () => {
  it('default: blue waves', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('custom colors: orange waves', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarImgURL: createTestAvatar('orange'),
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      avatarBorderColor: '#f48b2d',
      colorTextDefault: '#B45309',
      nicknameText: { content: 'pixel_pancake', weight: '400' },
      secondText: { content: 'Member #12', weight: '300' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('solid background without waves', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarImgURL: createTestAvatar('rose'),
      backgroundColor: { background: '#4d1821' },
      colorTextDefault: '#f26bac',
      avatarBorderColor: '#f26bac',
      nicknameText: { content: 'crimson.moth', weight: '400' },
      secondText: { content: 'Member #377', weight: '300' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('avatarBorderStyle: stroke', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarBorderStyle: 'stroke',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('avatarBorderStyle: fill renders like the default style', async () => {
    const fill = await new BaseCardBuilder({ ...baseParams, avatarBorderStyle: 'fill' }).build();
    const byDefault = await new BaseCardBuilder(baseParams).build();
    expect(toPng(fill).equals(toPng(byDefault))).toBe(true);
  });

  it('without avatar', async () => {
    const canvas = await new BaseCardBuilder({ ...baseParams, avatarImgURL: undefined }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('without texts', async () => {
    const canvas = await new BaseCardBuilder({ avatarImgURL: avatar }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('only: background and nickname', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build({
      only: ['background', 'nickname'],
    });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('only: avatarBorder with the default style draws the border without the avatar', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build({ only: ['avatarBorder'] });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('only: avatarBorder with the fill style also draws the avatar', async () => {
    const canvas = await new BaseCardBuilder({ ...baseParams, avatarBorderStyle: 'fill' }).build({
      only: ['avatarBorder'],
    });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('long nickname is truncated', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...burgundyTheme,
      nicknameText: {
        content: 'Maximilian Alexander Petrov-Vasquez (he/him) | Community Events Host',
        weight: '700',
      },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('long main text is truncated', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...burgundyTheme,
      mainText: {
        content: 'Hello, traveler, the kettle is on and the snacks are out',
        weight: '800',
      },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('long second text is truncated', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...burgundyTheme,
      secondText: {
        content: 'Say hi in #general, pick a role in #roles and check the pinned messages',
      },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('empty nickname', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      nicknameText: { content: '', weight: '700' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('empty texts render like no texts', async () => {
    const emptyTexts = await new BaseCardBuilder({
      avatarImgURL: avatar,
      mainText: { content: '' },
      nicknameText: { content: '' },
      secondText: { content: '' },
    }).build();
    const noTexts = await new BaseCardBuilder({ avatarImgURL: avatar }).build();
    expect(toPng(emptyTexts).equals(toPng(noTexts))).toBe(true);
  });

  it('background image with overlay 0.5', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...whiteTextColors,
      backgroundImgURL: background,
      overlayOpacity: 0.5,
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('background image with overlay 0', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...whiteTextColors,
      backgroundImgURL: background,
      overlayOpacity: 0,
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('objectFit: cover crops a square photo', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      ...whiteTextColors,
      backgroundImgURL: createTestPhoto(),
    }).build({ objectFit: 'cover' });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('loads the avatar over http like a data: URL', async () => {
    const png = Buffer.from(avatar.split(',')[1], 'base64');
    const server = createServer((_request, response) => response.end(png));
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    try {
      const viaHttp = await new BaseCardBuilder({
        ...baseParams,
        avatarImgURL: `http://127.0.0.1:${port}/avatar.png`,
      }).build();
      const viaDataUrl = await new BaseCardBuilder(baseParams).build();
      expect(toPng(viaHttp).equals(toPng(viaDataUrl))).toBe(true);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('rgba and 4-digit hex waves render like 6-digit hex', async () => {
    const build = (waves: Color) =>
      new BaseCardBuilder({
        ...baseParams,
        backgroundColor: { background: '#FFF', waves },
      }).build();
    const hex = toPng(await build('#00aaff'));
    expect(toPng(await build('rgba(0, 170, 255, 0.5)')).equals(hex)).toBe(true);
    expect(toPng(await build('#0af8')).equals(hex)).toBe(true);
  });
});

describe('BaseCardBuilder setters', () => {
  it('match constructor params', async () => {
    const viaConstructor = await new BaseCardBuilder({
      backgroundColor: { background: '#1a1a2e', waves: '#e94560' },
      avatarImgURL: avatar,
      avatarBorderColor: '#e94560',
      fontDefault: 'Inter',
      colorTextDefault: '#feca57',
      mainText: { content: 'Hello', weight: '800' },
      nicknameText: { content: 'Setter' },
      secondText: { content: 'Fluent API', weight: '300' },
    }).build();
    const viaSetters = await new BaseCardBuilder()
      .setBackgroundColor({ background: '#1a1a2e', waves: '#e94560' })
      .setAvatarImgURL(avatar)
      .setAvatarBorderColor('#e94560')
      .setFontDefault('Inter')
      .setColorTextDefault('#feca57')
      .setMainText({ content: 'Hello', weight: '800' })
      .setNicknameText({ content: 'Setter' })
      .setSecondText({ content: 'Fluent API', weight: '300' })
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });

  it('match constructor params for the background image', async () => {
    const viaConstructor = await new BaseCardBuilder({
      backgroundImgURL: background,
      overlayOpacity: 0.7,
    }).build();
    const viaSetters = await new BaseCardBuilder()
      .setBackgroundImgURL(background)
      .setOverlayOpacity(0.7)
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });
});

describe('BaseCardBuilder params', () => {
  it('keeps the caller text object intact when truncating', async () => {
    const nickname = 'Maximilian Alexander Petrov-Vasquez (he/him) | Community Events Host';
    const nicknameText = { content: nickname };
    await new BaseCardBuilder({ ...baseParams, nicknameText }).build();
    expect(nicknameText.content).toBe(nickname);
  });
});
