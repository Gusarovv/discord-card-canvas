import { LeaveBuilder, WelcomeBuilder } from '../../src/cards/base/welcome-card';
import { createTestAvatar } from '../support/images';
import { describeVisual, toPng } from '../support/visual';

const avatar = createTestAvatar('blue');

describeVisual('WelcomeBuilder', () => {
  it('default: blue theme', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'midnight_fox' },
      avatarImgURL: avatar,
      secondText: { content: 'Raccoon Lounge' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('custom colors: orange', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'pixel_pancake', color: '#1F2937' },
      avatarImgURL: createTestAvatar('orange'),
      secondText: { content: 'Raccoon Lounge' },
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      avatarBorderColor: '#f48b2d',
      colorTextDefault: '#B45309',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('dark background without waves', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'Juniper', color: '#FFFFFF' },
      avatarImgURL: createTestAvatar('burgundy'),
      secondText: { content: 'Member #3' },
      backgroundColor: { background: '#4d1821' },
      colorTextDefault: '#f0dbb9',
      avatarBorderColor: '#d24b5a',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('long nickname is truncated', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: {
        content: 'Maximilian Alexander Petrov-Vasquez (he/him) | Community Events Host',
      },
      avatarImgURL: createTestAvatar('burgundy'),
      backgroundColor: { background: '#4d1821', waves: '#d24b5a' },
      avatarBorderColor: '#d24b5a',
      colorTextDefault: '#FFFFFF',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('empty nickname', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: '' },
      avatarImgURL: avatar,
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('all three text fields filled', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'Crème Brûlée' },
      avatarImgURL: avatar,
      mainText: { content: 'WELCOME BACK' },
      secondText: { content: 'Your roles have been restored' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('animated GIF avatar uses the first frame', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'Шустрый Ёж' },
      secondText: { content: 'Участник #2048' },
      avatarImgURL:
        'data:image/gif;base64,R0lGODlhAgACAIEAAFfyh/SLLVhl8u1CRSH/C05FVFNDQVBFMi4wAwEAAAAh+QQAMgAAACwAAAAAAgACAAAIBwAFBAAwICAAIfkEATIABAAsAAAAAAIAAgCBV/KH9IstWGXy7UJFCAcABwAIICAgADs=',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });
});

describeVisual('LeaveBuilder', () => {
  it('default: red theme', async () => {
    const canvas = await new LeaveBuilder({
      nicknameText: { content: 'driftwood' },
      avatarImgURL: createTestAvatar('red'),
      secondText: { content: 'See you around' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('custom colors', async () => {
    const canvas = await new LeaveBuilder({
      nicknameText: { content: 'crimson.moth' },
      avatarImgURL: createTestAvatar('rose'),
      backgroundColor: { background: '#4d1821', waves: '#f26bac' },
      avatarBorderColor: '#f26bac',
      colorTextDefault: '#f26bac',
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });
});
