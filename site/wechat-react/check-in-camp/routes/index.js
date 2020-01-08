import App from '../../app.js';

import {
    newCamp, 
    campDetail,
    editCamp, 
    campIntroEdit, 
    joinList, 
    littleGraphicCreate,
    littleGraphicDetail,
    checkInRanking,
    checkInRankingShared,
    checkInDiary,
    checkInUserManage,
} from './check-in-camp';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        newCamp,
        editCamp,
        campIntroEdit,
        campDetail,
        joinList,
        littleGraphicCreate,
        littleGraphicDetail,
        checkInRanking,
        checkInRankingShared,
        checkInDiary,
        checkInUserManage,
    ]
};

export default rootRoute;
