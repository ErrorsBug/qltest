import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as liveBack from './live-back';
import * as noticeCenter from './notice-center';


const routers = {
    ...common,
    ...liveBack,
    ...noticeCenter,
    routing: routerReducer
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
