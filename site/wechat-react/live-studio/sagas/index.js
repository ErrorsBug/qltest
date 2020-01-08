import { all } from 'redux-saga/effects';
import commonSagas from './common';
import checkInListSagas from '../model/camp-check-in-list/sagas';
import authInfoSagas from '../model/camp-auth-info/sagas';
import campBasicInfoSagas from '../model/camp-basic-info/sagas';
import campTopicsSagas from '../model/camp-topics/sagas';
import campUserinfoSagas from '../model/camp-user-info/sagas';
import campUserList from '../model/camp-user-list/sagas';
import littleGraphic from '../model/little-graphic/sagas';
import campIntro from '../model/camp-intro/sagas';


export default function* rootSaga(...args){
    let allSagas = [
        ...commonSagas,
        ...authInfoSagas,
        ...checkInListSagas,
        ...campBasicInfoSagas,
        ...campTopicsSagas,
        ...campUserinfoSagas,
        ...campUserList,
        ...littleGraphic,
        ...campIntro,
    ];
    yield all(allSagas.map((saga) => saga(...args)));
}
