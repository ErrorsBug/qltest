import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common'
import * as liveStudio from './live-studio'
import * as myShares from './my-shares';
import * as live from './live';
import * as myQuestion from './my-question';
import * as courseInfo from './course-info';
import * as noticeCenter from './notice-center';

const routers = {
    ...common,
    ...myShares,
    ...liveStudio,
    ...live,
    ...myQuestion,
    ...courseInfo,
    ...noticeCenter,
    routing: routerReducer,
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
