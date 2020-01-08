import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as payCamp from './pay-camp'
import * as camp from './camp'

export default _ => combineReducers({
    ...common,
    ...camp,
    ...payCamp,
    routing: routerReducer,
})
