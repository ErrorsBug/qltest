import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as course from './course';
import * as reprint from './reprint';
import * as promote from './promote';
import * as filter from './filter';
import * as portrait from './portrait';
import * as recommend from './recommend'

const routers = {
    ...common,
    ...course,
    ...reprint,
    ...promote,
    ...filter,
    ...portrait,
    ...recommend,
    routing: routerReducer,
}

export default client => {
    return combineReducers(routers);
}
