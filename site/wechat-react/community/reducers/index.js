import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import * as common from "./common";
import * as community from './community';

export default _ =>
    combineReducers({
        ...common,
        ...community,
        routing: routerReducer
    });
