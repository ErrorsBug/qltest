 import { api } from "common_actions/common";

export const GET_ATTEND_REMIND_SETTING = "GET_ATTEND_REMIND_SETTING";
export const SET_ATTEND_REMIND_SETTING = "SET_ATTEND_REMIND_SETTING";

export function getAttendRemindSetting() {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: "/api/wechat/affair/getAttendRemind",
            method: "POST",
            showLoading: false,
            body: {}
        });
        if(result.state.code === 0) {
            dispatch({
                type: GET_ATTEND_REMIND_SETTING,
                openStatus: result.data && result.data.openStatus
            });
        }
        return result;
    };
}
export function setAttendRemindSetting(status) {
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: "/api/wechat/affair/updateAttendRemind",
            method: "POST",
            showLoading: false,
            body: { openStatus: status }
        });
        return result;
    };
}
