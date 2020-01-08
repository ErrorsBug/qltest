import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as attendRemind from './attend-remind';

export default _ => combineReducers({
    ...common,
    ...attendRemind,
    routing: routerReducer,
})