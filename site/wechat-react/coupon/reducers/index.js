import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as coupon from './coupon';
import * as common from './common';
import * as live from './live';


const routers = {
    ...coupon,
    ...common,
    ...live,
    routing: routerReducer
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
