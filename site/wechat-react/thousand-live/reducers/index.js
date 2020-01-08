import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as thousandLive from './thousand-live';
import * as live from './live';
import * as evaluation from './evaluation';

export default _ => combineReducers({
    ...common,
    ...thousandLive,
    ...live,
    ...evaluation,
    routing: routerReducer,
})
