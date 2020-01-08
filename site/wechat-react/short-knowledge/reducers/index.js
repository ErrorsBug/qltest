import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as common from './common';
import * as shortKnowledge from './short-knowledge';
import * as connectCourse from './connect-course';

export default _ => combineReducers({
    ...common,
    ...shortKnowledge,
    ...connectCourse,
    routing: routerReducer,
})
