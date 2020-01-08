import { api } from './common';

export const SET_UNOPENED_GROUPS = 'SET_UNOPENED_GROUPS';
export const SET_OPENED_GROUPS = 'SET_OPENED_GROUPS';
export const SET_LIVEID = 'SET_LIVEID';


export function setUnopenedGroups(unopenedGroups) {
    return {
        type: SET_UNOPENED_GROUPS,
        unopenedGroups,
    }
}

export function setOpenedGroups(openedGroups) {
    return {
        type: SET_OPENED_GROUPS,
        openedGroups,
    }
}

export function setLiveId(liveId) {
    return {
        type: SET_LIVEID,
        liveId,
    }
}

export function openGroup(data = {}) {
    let { channelId, discount, groupNum, discountType, simulationStatus, groupHour } = data
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            url: '/api/wechat/channel/openGroup',
            body: {
                channelId: channelId,
                discount: `${discount}`,
                groupNum: groupNum,
                discountType,
                simulationStatus,
                groupHour
            }
        });
         if (result.state.code === 0) {
            const openedGroups = getStore().channelGroupList.openedGroups;
            const unopenedGroups = getStore().channelGroupList.unopenedGroups.filter( data => {
                if (data.id === channelId) {
                    data.discount = discount;
                    data.discountStatus = 'P';
                    data.groupNum = 0;
                    openedGroups.unshift(data)
                    return false;
                }
                return true;
            });
            window.toast(result.state.msg);
            dispatch(setOpenedGroups(openedGroups));
            dispatch(setUnopenedGroups(unopenedGroups));
        } else {
            window.toast(result.state.msg);
        }

    }
}

export function getOpenedGroup(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/openGroup',
            body: {
                isGroup: 'Y',
                liveId,
            }
        });
         if (result.state.code === 0) {
            dispatch(setOpenedGroups(result.data.list))
        } else {
            window.toast(result.state.msg);
        }

    }
}

export function getUnopenedGroup(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/openGroup',
            body: {
                isGroup: 'N',
                liveId,
            }
        });
         if (result.state.code === 0) {
            dispatch(setUnpenedGroups(result.data.list))
        } else {
            window.toast(result.state.msg);
        }

    }
}