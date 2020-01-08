import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';

export default _ => combineReducers({
    ...common,
    routing: routerReducer,
})