import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { BaseCardBuilder } from '../cards/base/base-card';
import { createTestAvatar } from './create-test-avatar';

expect.extend({ toMatchImageSnapshot });

const avatar = createTestAvatar('#5865F2');

const baseParams = {
  fontDefault: 'Nunito',
  avatarImgURL: avatar,
  mainText: { content: 'Main Text', weight: '700' },
  nicknameText: { content: 'Nickname', weight: '400' },
  secondText: { content: 'Second Text', weight: '300' },
};

describe('BaseCardBuilder', () => {
  it('should create canvas with correct dimensions', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build();
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(350);
  });

  it('default — blue waves', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('custom colors — orange waves', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      avatarBorderColor: '#f48b2d',
      colorTextDefault: '#f48b2d',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('no waves — solid background', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      backgroundColor: { background: '#1a1a2e' },
      colorTextDefault: '#e94560',
      avatarBorderColor: '#e94560',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('avatarBorderStyle: stroke', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarBorderStyle: 'stroke',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('avatarBorderStyle: fill', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarBorderStyle: 'fill',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('without avatar', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      avatarImgURL: undefined,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('without texts — only avatar and background', async () => {
    const canvas = await new BaseCardBuilder({
      avatarImgURL: avatar,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('draw only specific elements', async () => {
    const canvas = await new BaseCardBuilder(baseParams).build({
      only: ['background', 'nickname'],
    });
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Edge cases ---

  it('very long nickname — should be truncated', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      nicknameText: {
        content: 'ThisIsAnExtremelyLongNicknameThatShouldDefinitelyBeTruncatedAtSomePoint123',
        weight: '700',
      },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('very long main text — should be truncated', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      mainText: {
        content: 'This Is A Very Long Main Text That Exceeds The Limit',
        weight: '800',
      },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('empty nickname', async () => {
    const canvas = await new BaseCardBuilder({
      ...baseParams,
      nicknameText: { content: '', weight: '700' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('all texts empty', async () => {
    const canvas = await new BaseCardBuilder({
      avatarImgURL: avatar,
      mainText: { content: '' },
      nicknameText: { content: '' },
      secondText: { content: '' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });
});
