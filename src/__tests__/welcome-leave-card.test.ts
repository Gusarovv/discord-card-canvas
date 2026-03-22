import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { WelcomeBuilder, LeaveBuilder } from '../cards/base/welcome-card';
import { createTestAvatar } from './create-test-avatar';

expect.extend({ toMatchImageSnapshot });

const avatar = createTestAvatar('#5865F2');

describe('WelcomeBuilder', () => {
  it('should create canvas with correct dimensions', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'TestUser' },
      avatarImgURL: avatar,
    }).build();
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(350);
  });

  it('default — blue theme', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'xNinja_Catx' },
      avatarImgURL: avatar,
      secondText: { content: 'Raccoon Bot Discord' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('custom colors — orange', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'Good_Hateful', color: '#f48b2d' },
      avatarImgURL: createTestAvatar('#f48b2d'),
      secondText: { content: 'My Server' },
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      avatarBorderColor: '#f48b2d',
      colorTextDefault: '#f48b2d',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('dark background — no waves', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'ChampionX' },
      avatarImgURL: avatar,
      backgroundColor: { background: '#0d1117' },
      colorTextDefault: '#58a6ff',
      avatarBorderColor: '#58a6ff',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Edge cases ---

  it('very long nickname — should be truncated', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: {
        content: 'ThisIsAnExtremelyLongNicknameThatShouldDefinitelyBeTruncatedAtSomePointInRendering',
      },
      avatarImgURL: avatar,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('empty nickname', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: '' },
      avatarImgURL: avatar,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('all three text fields filled', async () => {
    const canvas = await new WelcomeBuilder({
      nicknameText: { content: 'User#1234' },
      avatarImgURL: avatar,
      mainText: { content: 'WILLKOMMEN' },
      secondText: { content: 'Du bist Mitglied #42' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });
});

describe('LeaveBuilder', () => {
  it('default — red theme', async () => {
    const canvas = await new LeaveBuilder({
      nicknameText: { content: 'xNinja_Catx' },
      avatarImgURL: avatar,
      secondText: { content: 'Raccoon Bot Discord' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('custom colors', async () => {
    const canvas = await new LeaveBuilder({
      nicknameText: { content: 'Good_Hateful' },
      avatarImgURL: createTestAvatar('#e94560'),
      backgroundColor: { background: '#1a1a2e', waves: '#e94560' },
      avatarBorderColor: '#e94560',
      colorTextDefault: '#e94560',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });
});
