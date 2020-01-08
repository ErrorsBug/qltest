import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as common from './common';
import * as home from './home';
import * as community from './community';
import * as experience from './experience';

export default _ => combineReducers({
  ...common,
  ...home,
  ...community,
  ...experience,
  routing: routerReducer,
})