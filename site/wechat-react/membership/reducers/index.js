import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as member from './member';

export default _ => combineReducers({
    ...common,
    ...member,
    routing: routerReducer,
})