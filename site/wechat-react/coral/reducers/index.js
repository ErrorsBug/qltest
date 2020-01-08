import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as mine from './mine';
import * as account from './account';
import * as shop from './shop';
import * as gift from './gift';
import * as performance from './performance';
import * as cut from './cut';


const routers = {
    ...common,
    ...mine,
    ...account,
    ...shop,
    ...gift,
    ...performance,
    ...cut,
    routing: routerReducer
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
