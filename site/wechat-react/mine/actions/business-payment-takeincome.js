import { api } from "./common";
import { locationTo } from "components/util";

export const GET_PUBTOPUB_MESSAGE = "GET_PUBTOPUB_MESSAGE";

// 提交公对公打款申请
export const commitApply = (params = {}) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: "/api/wechat/transfer/h5/live/reward/ptpApply",
            method: "POST",
            body: {
                liveId: params.liveId,
                money: (Number(params.money)*100).toString(), // 单位为分
                userId: params.userId,
                commitmentLetter: params.commitmentLetter
            }
        });

        if (result.state.code === 0) {
            window && window.toast('提交成功', 2000);
            locationTo(`/wechat/page/mine/takeincome-record?liveId=${params.liveId}`);
        } else {
            window && window.toast(result.state.msg);
        }
        return (result.data && result.data.purchaseList) || [];
    };
};

// 获取公对公打款信息
export const getPubToPubMessage = (params = {}) => {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: "/api/wechat/transfer/h5/live/reward/pubToPub",
            method: "POST",
            body: {
                applyType: "P2P",
                liveId: params.liveId,
                userId: params.userId
            }
        });
        if (result.state.code === 0) {
            const { accountName, accountNo, openBank } = result.data;
            dispatch({
                type: GET_PUBTOPUB_MESSAGE,
                openBank,
                accountNo,
                accountName
            });
        }
        return (result.data && result.data.purchaseList) || [];
    };
};
