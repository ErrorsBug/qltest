
import * as authActions from './camp-auth-info/actions';
import * as campBasicInfoActions from './camp-basic-info/actions';
import * as checkInListActions from './camp-check-in-list/actions';
import * as campTopicsActions from './camp-topics/actions';
import * as campUserListActions from './camp-user-list/actions';
import * as campUserInfoActions from './camp-user-info/actions';
import * as littleGraphicActions from './little-graphic/actions';
import * as campIntroActions from './camp-intro/actions';

export const campAuthInfoModel = {
    ...authActions,
}

export const campBasicInfoModel = {
    ...campBasicInfoActions,
}

export const campCheckInListModel = {
    ...checkInListActions,
}

export const campTopicsModel = {
    ...campTopicsActions,
}

export const campUserListModel = {
    ...campUserListActions,
}

export const campUserInfoModel = {
    ...campUserInfoActions,
}

export const littleGraphqlModel = {
    ...littleGraphicActions,
}

export const campIntroModel = {
    ...campIntroActions,
}