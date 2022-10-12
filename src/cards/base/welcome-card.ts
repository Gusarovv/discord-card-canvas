import { TextCard } from '../../interface/card.interface';
import { BaseCardBuilder, BaseCardParams } from './base-card';

export interface UserParams extends BaseCardParams {
    avatarImgURL: string;
    nicknameText: TextCard;
}

export class WelcomeBuilder extends BaseCardBuilder {
    constructor(params: UserParams) {
        if (!params.mainText) params.mainText = { content: 'WELCOME' };
        if (!params.avatarBorderColor) params.avatarBorderColor = '#0CA7FF';
        if (!params.colorTextDefault) params.colorTextDefault = '#0CA7FF';
        super(params);
    }
}

export class LeaveBuilder extends BaseCardBuilder {
    constructor(params: UserParams) {
        if (!params.mainText) params.mainText = { content: 'LEAVE' };
        if (!params.avatarBorderColor) params.avatarBorderColor = '#ff3e3e';
        if (!params.colorTextDefault) params.colorTextDefault = '#ff3e3e';
        super(params);
    }
}
