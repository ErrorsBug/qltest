import {
    UPDATE_QUERY_NAME,
    UPDATE_QUERY_DATE,
    UPDATE_PROMOTE_LIST,
} from '../actions/promote'

const initData = {
    queryName: '',
    queryDate: [],

    promoteList: [],
};

export function promote(state = initData, action) {
    switch (action.type) {

        case UPDATE_QUERY_NAME:
            return {
                ...state,
                queryName: action.name
            };

        case UPDATE_QUERY_DATE:
            return {
                ...state,
                queryDate: action.date,
            };

        case UPDATE_PROMOTE_LIST:
            return {
                ...state,
                promoteList: action.list,
            }    

        default:
            return state
    }
}
