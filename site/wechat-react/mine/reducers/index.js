import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import * as common from "./common";
import * as buy from "./buy";
import * as businessPaymentTakeincome from "./business-payment-takeincome";
import * as takeincomeRecord from "./takeincome-record";

export default _ =>
    combineReducers({
        ...buy,
        ...common,
        ...businessPaymentTakeincome,
        ...takeincomeRecord,
        routing: routerReducer
    });
