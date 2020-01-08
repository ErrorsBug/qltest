import { apiService } from '../components/api-service';
import { setLiveInfo, updateCreatorLiveList } from "./common";
import { updateRelay } from "./recommend";

export const UPDATE_COURSE_LIST = 'COURSE/UPDATE_COURSE_LIST'
export const CLEAR_COURSE_LIST = 'COURSE/CLEAR_COURSE_LIST'
export const UPDATE_COURSE_TAG_LIST = 'COURSE/UPDATE_COURSE_TAG_LIST'
export const UPDATE_CHANNEL_TYPES = 'COURSE/UPDATE_CHANNEL_TYPES'
// 设置转载信息
export const SET_REPRINT_INFO = 'SET_REPRINT_INFO';
// 设置推广信息
export const SET_PROMOTION_INFO = 'SET_PROMOTION_INFO';

// 设置转发系列课信息
export function setReprintInfo(info) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_REPRINT_INFO,
            info,
        });
    }
}


export function setPromotionInfo(pomotionData) {
    return (dispatch, getStore) => {
        dispatch({
            type: SET_PROMOTION_INFO,
            pomotionData,
        });
    }
}

/* 获取课程列表 */
export function fetchCourseList(params)
{
    return async(dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/courseList',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            return result.data
        }    
    }
}

/* 获取高分成活动课程列表 */
export function fetchHighBonusCourseList(params)
{   
    return async(dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/activityCourseList',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            return result.data
        }    
    }
}

export function reprintChannel({relayLiveId,sourceChannelId, tweetId, pushStatus, tagId}, index = 0, reprintCallback = null, channelInfo) {
    return async(dispatch, getStore) => {
        const courseList = getStore().course.courseList;
        const result = await apiService.post({
            url: '/h5/selfmedia/relayChannel',
            body: {
                tagId,
                relayLiveId,
                sourceChannelId,
                tweetId,
                pushStatus
            },
            showError: false,   
        })
        if (result.state.code == 0) {
            if (typeof reprintCallback === 'function') {
                reprintCallback(index, result);
            } else {
                const store = getStore();
                // 推荐页
                if (store.updateFilterConditions.categorySelected == 'recommend') {
                    let {moduleCourseList, recommendModule, hightBonusItem, topTenCourse} = store.recommend;
                    let { title } = channelInfo;
                    channelInfo.relayChannelId = result.data.relayChannelId;
                    for (let k in store.recommend) {
                        let obj = store.recommend[k].list.filter(item => {
                            return item.title == title
                        })
                        if (obj.length) {
                            dispatch(updateRelay(channelInfo, k))
                        }
                    }
                } else {
                    // const creatorList = store.common.userMgrLiveList.creatorList
                    const relayChannelId = result.data.relayChannelId;
                    // const index = this.state.currentReprintChannel.index;
                    let newList = [...courseList]
                    newList[index].isRelay = 'Y';
                    newList[index].relayChannelId = relayChannelId;
                    dispatch(updateCourseList(newList))
                    // this.setReprintSuccessModal(true);
                    // window.message.success('操作成功');
                }
            }
            if (!relayLiveId) {
                dispatch(setLiveInfo({liveId: result.data.liveId}))
                setLocation(result.data.liveId);
                // dispatch(updateCreatorLiveList([]))
            }
        } else {
            window.message.error(result.state.msg);
            return result;
        }
        return result;
    }
}

/* 更新课程列表 */
export function updateCourseList(list) {
    return {
        type: UPDATE_COURSE_LIST,
        list,
    }
}

/* 清空课程列表 */
export function clearCourseList(list) {
    return {
        type: CLEAR_COURSE_LIST,
        list,
    }
}

/* 获取课程标签列表 */
export function fetchCourseTagList(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/selfmedia/course-tag-list',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(updateCourseTagList(result.data.tagList))
            return result.data.tagList
        }
    }
}

/* 更新课程标签列表 */
export function updateCourseTagList(list){
    return {
        type: UPDATE_COURSE_TAG_LIST,
        list,
    }
}

/* 获取直播间的系列课分类 */
export function fetchChannelTypes(params) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/channel/getChannelTags',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(updateChannelTypes(result.data.channelTagList))
            return result.data.channelTagList
        }
    }
}

/* 更新直播间的系列课分类 */
export function updateChannelTypes(list) {
    return {
        type: UPDATE_CHANNEL_TYPES,
        list,       
    }
}

function setLocation(liveId) {
    let herf = window.location.href;
    if (window.location.search === '') {
        herf += `?selectedLiveId=${liveId}`
    } else if( /selectedLiveId/.test(window.location.search)){
        herf = herf.replace(/selectedLiveId\=(\d*)\&?/g, 'selectedLiveId=' + liveId)
    } else {
        herf += `&selectedLiveId=${liveId}`
    }
    window.history.replaceState({liveId: liveId}, null, herf);
}