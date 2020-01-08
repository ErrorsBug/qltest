import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as audioGraphic from './audio-graphic';


export default _ => combineReducers({
    ...common,
    ...audioGraphic,
    routing: routerReducer,
})