import {
  InfoCardBuilder,
  LeaveBuilder,
  LevelUpBuilder,
  RankCardBuilder,
  WelcomeBuilder,
} from '../src';

export type Params = Record<string, any>;

export type FieldKind = 'text' | 'number' | 'color' | 'select' | 'image';

export interface Field {
  path: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  inherits?: string;
  options?: string[];
  required?: boolean;
}

export type Section = [title: string, fields: Field[], collapsed?: boolean];

export interface Preset {
  name: string;
  params: Params;
}

export interface Card {
  id: string;
  label: string;
  builder: string;
  create: (params: Params) => { build(options?: { objectFit?: 'cover' }): Promise<unknown> };
  sections: Section[];
  backgroundDefaults?: Params;
  presets: Preset[];
  fonts: (params: Params) => [string, string][];
}

const avatar = (file: string) => new URL(file, location.origin + import.meta.env.BASE_URL).href;
export const FONTS = ['Nunito', 'Inter', 'Montserrat', 'Manrope', 'Rubik', 'Exo 2'];
export const WEIGHTS = ['600', '700', '800'];
const STATUSES = ['online', 'idle', 'dnd', 'offline', 'invisible', 'streaming'];

const text = (path: string, label: string, required = false, placeholder?: string): Field => ({
  path,
  label,
  kind: 'text',
  required,
  placeholder,
});
const num = (path: string, label: string): Field => ({ path, label, kind: 'number', required: true });
const color = (path: string, label: string, placeholder: string): Field => ({
  path,
  label,
  kind: 'color',
  placeholder,
});
const textColor = (path: string, label: string): Field => ({
  path,
  label,
  kind: 'color',
  inherits: 'colorTextDefault',
});
const select = (path: string, label: string, options: string[], placeholder?: string): Field => ({
  path,
  label,
  kind: 'select',
  options,
  placeholder,
});
const font = (path: string, label: string) => select(path, label, FONTS, 'Default font');
const weight = (path: string, label: string) => select(path, label, WEIGHTS, '600 (default)');
const size = (path: string, label: string): Field => ({
  path,
  label,
  kind: 'number',
  placeholder: '60',
});

const images = (avatar: 'none' | 'optional' | 'required'): Section => [
  'Images',
  [
    ...(avatar === 'none'
      ? []
      : [{ path: 'avatarImgURL', label: 'Avatar', kind: 'image', required: avatar === 'required' } as Field]),
    { path: 'backgroundImgURL', label: 'Background image', kind: 'image' },
    select('objectFit', 'Background fit', ['cover'], 'fill (default)'),
  ],
];

const pick = (text: Params | undefined, fallback: string, weight: string): [string, string] => [
  text?.font ?? fallback,
  text?.weight ?? weight,
];

function userCard(id: string, label: string, accent: string, preset: Preset): Card {
  return {
    id,
    label,
    builder: id === 'welcome' ? 'WelcomeBuilder' : 'LeaveBuilder',
    create: (params) =>
      id === 'welcome' ? new WelcomeBuilder(params as any) : new LeaveBuilder(params as any),
    sections: [
      [
        'Text',
        [
          text('nicknameText.content', 'Nickname', true),
          text('secondText.content', 'Subtitle'),
          color('nicknameText.color', 'Nickname color', accent),
          color('secondText.color', 'Subtitle color', accent),
          select('fontDefault', 'Font', FONTS, 'Nunito (default)'),
        ],
      ],
      images('required'),
    ],
    presets: [preset],
    fonts: (p) => {
      const family = p.fontDefault ?? 'Nunito';
      const pairs = [pick(p.mainText, family, '800'), pick(p.nicknameText, family, '700')];
      if (p.secondText) pairs.push(pick(p.secondText, family, '600'));
      return pairs;
    },
  };
}

export const cards: Card[] = [
  userCard('welcome', 'Welcome', '#0CA7FF', {
    name: 'User Nickname',
    params: {
      fontDefault: 'Inter',
      nicknameText: { color: '#0CA7FF', content: 'User Nickname' },
      secondText: { color: '#0CA7FF', content: 'Raccoon Bot Discord' },
      avatarImgURL: avatar('user.png'),
    },
  }),
  userCard('leave', 'Leave', '#F44336', {
    name: 'User Nickname',
    params: {
      nicknameText: { content: 'User Nickname' },
      avatarImgURL: avatar('user.png'),
      fontDefault: 'Inter',
      secondText: { content: 'Raccoon Bot Discord' },
    },
  }),
  {
    id: 'rank',
    label: 'Rank',
    builder: 'RankCardBuilder',
    create: (params) => new RankCardBuilder(params as any),
    sections: [
      [
        'User',
        [
          text('nicknameText.content', 'Nickname', true),
          font('nicknameText.font', 'Nickname font'),
          textColor('nicknameText.color', 'Nickname color'),
          select('userStatus', 'Status', STATUSES),
          select('fontDefault', 'Default font', FONTS, 'Nunito (default)'),
        ],
      ],
      images('optional'),
      [
        'Stats',
        [
          num('currentLvl', 'Level'),
          num('currentRank', 'Rank'),
          num('currentXP', 'Current XP'),
          num('requiredXP', 'Required XP'),
        ],
      ],
      [
        'Colors',
        [
          color('backgroundColor.background', 'Background', '#FFF'),
          color('backgroundColor.bubbles', 'Bubbles', '#0CA7FF'),
          color('colorTextDefault', 'Default text color', '#0CA7FF'),
          color('progressBarColor', 'Progress bar', '#0CA7FF'),
          color('currentXPColor', 'Current XP color', '#0CA7FF'),
          color('requiredXPColor', 'Required XP color', '#7F8384'),
          color('avatarBackgroundColor', 'Circle behind avatar', '#0CA7FF'),
        ],
      ],
      [
        'Level and rank numbers',
        [
          font('lvlNumFormat.font', 'Level font'),
          textColor('lvlNumFormat.color', 'Level color'),
          weight('lvlNumFormat.weight', 'Level weight'),
          size('lvlNumFormat.size', 'Level size'),
          font('rankNumFormat.font', 'Rank font'),
          textColor('rankNumFormat.color', 'Rank color'),
          weight('rankNumFormat.weight', 'Rank weight'),
          size('rankNumFormat.size', 'Rank size'),
        ],
        true,
      ],
    ],
    backgroundDefaults: { background: '#FFF', bubbles: '#0CA7FF' },
    presets: [
      {
        name: 'xNinja_Catx',
        params: {
          currentLvl: 102,
          currentRank: 563,
          currentXP: 71032,
          requiredXP: 95195,
          backgroundColor: { background: '#070d19', bubbles: '#0ca7ff' },
          avatarImgURL: avatar('xninja.jpg'),
          nicknameText: { content: 'xNinja_Catx', font: 'Nunito', color: '#0CA7FF' },
          userStatus: 'idle',
        },
      },
      {
        name: 'Good_Hateful',
        params: {
          currentLvl: 50,
          currentRank: 3,
          currentXP: 23478,
          requiredXP: 68195,
          fontDefault: 'Inter',
          backgroundColor: { background: '#fff', bubbles: '#f48b2d' },
          avatarImgURL: avatar('good-hateful.jpg'),
          nicknameText: { content: 'Good_Hateful' },
          userStatus: 'online',
          requiredXPColor: '#7F8381',
          currentXPColor: '#f48b2d',
          avatarBackgroundColor: '#fbbf60',
          colorTextDefault: '#f48b2d',
          progressBarColor: '#f48b2d',
          lvlNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
          rankNumFormat: { font: 'Inter', size: 60, weight: '600', color: '#f48b2d' },
          objectFit: 'cover',
        },
      },
    ],
    fonts: (p) => {
      const family = p.fontDefault ?? 'Nunito';
      return [
        [family, '600'],
        pick(p.nicknameText, family, '600'),
        pick(p.lvlNumFormat, family, '600'),
        pick(p.rankNumFormat, family, '600'),
      ];
    },
  },
  {
    id: 'levelUp',
    label: 'Level Up',
    builder: 'LevelUpBuilder',
    create: (params) => new LevelUpBuilder(params as any),
    sections: [
      [
        'User',
        [
          text('nicknameText.content', 'Nickname', true),
          font('nicknameText.font', 'Nickname font'),
          textColor('nicknameText.color', 'Nickname color'),
          num('previousLvl', 'Previous level'),
          num('newLvl', 'New level'),
          select('userStatus', 'Status', STATUSES, 'online (default)'),
        ],
      ],
      images('optional'),
      [
        'Title and colors',
        [
          text('levelUpText.content', 'Title', false, 'LEVEL UP'),
          textColor('levelUpText.color', 'Title color'),
          color('colorTextDefault', 'Default text color', '#0CA7FF'),
          color('backgroundColor.background', 'Background', '#FFF'),
          select('backgroundColor.pattern', 'Pattern', ['stars', 'bubbles'], 'stars (default)'),
          textColor('backgroundColor.patternColor', 'Pattern color'),
          color('avatarBackgroundColor', 'Circle behind avatar', '#0CA7FF'),
        ],
      ],
    ],
    backgroundDefaults: { background: '#FFF' },
    presets: [
      {
        name: 'Raccoon Developer',
        params: {
          nicknameText: { content: 'Raccoon Developer', font: 'Nunito', color: '#f48b2d' },
          previousLvl: 24,
          newLvl: 25,
          avatarImgURL: avatar('raccoon-developer.jpg'),
          userStatus: 'idle',
          colorTextDefault: '#f48b2d',
          avatarBackgroundColor: '#fbbf60',
          backgroundColor: { background: '#1a1a2e', pattern: 'stars', patternColor: '#f48b2d' },
          levelUpText: { content: 'LEVEL UP', color: '#d4782a' },
        },
      },
      {
        name: 'Raccoon Bot',
        params: {
          nicknameText: { content: 'Raccoon Bot', font: 'Nunito', color: '#0CA7FF' },
          previousLvl: 4,
          newLvl: 5,
          avatarImgURL: avatar('raccoon-bot.png'),
          userStatus: 'dnd',
          backgroundColor: { background: '#070d19', pattern: 'bubbles', patternColor: '#0CA7FF' },
        },
      },
    ],
    fonts: (p) => {
      const family = p.fontDefault ?? 'Nunito';
      return [
        [family, '700'],
        [family, '600'],
        pick(p.levelUpText, family, '800'),
        pick(p.nicknameText, family, '600'),
      ];
    },
  },
  {
    id: 'info',
    label: 'Info',
    builder: 'InfoCardBuilder',
    create: (params) => new InfoCardBuilder(params as any),
    sections: [
      [
        'Text and colors',
        [
          text('mainText.content', 'Title'),
          color('backgroundColor.background', 'Background', '#FFF'),
          color('backgroundColor.waves', 'Waves', '#0CA7FF'),
        ],
      ],
      images('none'),
    ],
    backgroundDefaults: { background: '#FFF', waves: '#0CA7FF' },
    presets: [
      {
        name: 'INFORMATION',
        params: {
          backgroundColor: { background: '#fff', waves: '#0ca7ff' },
          mainText: { content: 'INFORMATION' },
        },
      },
    ],
    fonts: (p) => (p.mainText ? [pick(p.mainText, 'Inter', '800')] : []),
  },
];
