import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as video from './video';
import * as thousandLive from './thousand-live';

export default _ => combineReducers({
    ...common,
    ...video,
    ...thousandLive,
    routing: routerReducer,
})