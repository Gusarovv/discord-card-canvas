import { TextCard } from '../../interface/card.interface';
import { BaseCardBuilder, BaseCardParams } from './base-card';

export type UserParams = BaseCardParams & {
  avatarImgURL: string;
  nicknameText: TextCard;
};

export class WelcomeBuilder extends BaseCardBuilder {
  constructor(params: UserParams) {
    super({
      ...params,
      mainText: { content: 'WELCOME', ...params.mainText },
      avatarBorderColor: params.avatarBorderColor || '#0CA7FF',
      colorTextDefault: params.colorTextDefault || '#0CA7FF',
      backgroundColor: params.backgroundColor || { background: '#FFFFFF', waves: '#0CA7FF' },
    });
  }
}

export class LeaveBuilder extends BaseCardBuilder {
  constructor(params: UserParams) {
    super({
      ...params,
      mainText: { content: 'LEAVE', ...params.mainText },
      avatarBorderColor: params.avatarBorderColor || '#F44336',
      colorTextDefault: params.colorTextDefault || '#F44336',
      backgroundColor: params.backgroundColor || { background: '#FFFFFF', waves: '#F44336' },
    });
  }
}
