import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as campIntro from './camp-intro';
import * as test from './test';
import { campCheckInList } from '../model/camp-check-in-list/reducer';
import { campAuthInfo } from '../model/camp-auth-info/reducer';
import { campBasicInfo } from '../model/camp-basic-info/reducer';
import { campUserList } from '../model/camp-user-list/reducer';
import { campTopics } from '../model/camp-topics/reducer';
import { campUserInfo } from '../model/camp-user-info/reducer';
import { littleGraphic } from '../model/little-graphic/reducer';
import { campIntroModel } from '../model/camp-intro/reducer';
// import * as live from './live';
// import * as evaluation from './evaluation';

export default _ => combineReducers({
    ...common,
    ...campIntro,
    ...test,
    campCheckInList,
    campAuthInfo,
    campBasicInfo,
    campUserList,
    campTopics,
    campUserInfo,
    littleGraphic,
    campIntroModel,
    routing: routerReducer,
})
