import { GET_TAKEINCOME_RECORD, SET_LOADING_STATUS  } from "../actions/takeincome-record";

const initState = {
    page: 1,
    pageSize: 9,
    loadingStatus: 'more',
    takeincomeRecord: []
};

export function takeincomeRecord(state = initState, action) {
    switch (action.type) {
        case GET_TAKEINCOME_RECORD:
            return { ...state, takeincomeRecord: state.takeincomeRecord.concat(action.payload.list), page: state.page + 1 };
        case SET_LOADING_STATUS: 
            return {...state, loadingStatus: action.status};
        default:
            return state;
    }
}
