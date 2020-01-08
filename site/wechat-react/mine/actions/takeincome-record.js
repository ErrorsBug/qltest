import { api } from "./common";
import { locationTo } from "components/util";

export const GET_TAKEINCOME_RECORD = "GET_TAKEINCOME_RECORD";
export const SET_LOADING_STATUS = "SET_LOADING_STATUS";

// 获取提现列表
export const getTakeincomeRecord = (params = {}) => {
    return async (dispatch, getStore) => {
        dispatch(setLoadingStatus('pending'));
        const takeincomeRecord = getStore().takeincomeRecord;
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
            method: "POST",
            body: {
                liveId: params.liveId,
                userId: params.userId,
                page: {
                    page: takeincomeRecord.page,
                    size: takeincomeRecord.pageSize
                }
            }
        });
        if (result.state.code === 0) {
            dispatch({
                type: GET_TAKEINCOME_RECORD,
                payload: result.data
            });
            if(result.data.list.length < takeincomeRecord.pageSize) {
                dispatch(setLoadingStatus('end'));
            } else {
                dispatch(setLoadingStatus('more'));
            }
        }
        return (result.data && result.data.purchaseList) || [];
    };
};

// 获取直播间嘉宾分成发放记录
export const getGuestTransferRecord = (params = {}) => {
    return async (dispatch, getStore) => {
        dispatch(setLoadingStatus('pending'));
        const takeincomeRecord = getStore().takeincomeRecord;
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
            method: "POST",
            body: {
                liveId: params.liveId,
                userId: params.userId,
                page: {
                    page: takeincomeRecord.page,
                    size: takeincomeRecord.pageSize
                }
            }
        });
        if (result.state.code === 0) {
            dispatch({
                type: GET_TAKEINCOME_RECORD,
                payload: result.data
            });
            if(result.data.list.length < takeincomeRecord.pageSize) {
                dispatch(setLoadingStatus('end'));
            } else {
                dispatch(setLoadingStatus('more'));
            }
        }
        return (result.data && result.data.purchaseList) || [];
    };
};

// 重新提交申请
export const resendName = (params = {}) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: "/api/wechat/transfer/h5/profitRecord/saveRealName",
            method: "POST",
            body: {
                liveId: params.liveId,
                userId: params.userId,
                name: params.name,
                recordId: params.recordId
            }
        });
        window && window.toast(result.state.msg);
        if (result.state.code === 0) {
            locationTo(`/wechat/page/live/profit/withdraw/${params.liveId}`)
        }
        return result.state || [];
    };
};

export const setLoadingStatus = (status) => {
    return {
        type: SET_LOADING_STATUS,
        status
    };
}