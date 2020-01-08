import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as common from './common';

const routers = {
    ...common,
    routing: routerReducer
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
