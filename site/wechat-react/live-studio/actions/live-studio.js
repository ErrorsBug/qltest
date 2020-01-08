import { api } from './common'
import { create } from 'domain';

export const UPDATE_FUNCTION_MENU = 'LIVE-STUDIO/UPDATE_FUNCTION_MENU'
export const UPDATE_PAGE_MENU = 'LIVE-STUDIO/UPDATE_PAGE_MENU'
export const UPDATE_IS_LIVE_ADMIN = 'LIVE-STUDIO/UPDATE_IS_LIVE_ADMIN';
export const UPDATE_PAGE_SHARE = 'LIVE-STUDIO/UPDATE_PAGE_SHARE'

/**
 * 生成做请求的action
 *
 * @export
 * @param {string} url 请求路径
 * @returns
 */
export function createFetchAction(url, method) {
    return (data = {}) => {
        return async (dispatch, getStore) => {

            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                method,
                body: { ...data },
                url,
            });

            return result
        }
    }
}

export function saveUserDefined(data) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body:data,
            url: '/api/wechat/live-studio/user-defined/save',
        });

        return result
    }
}

/* 判断直播间是否为分销 */
export function isEnterPage(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            body: {
                liveId,
            },
            url: '/api/wechat/live-studio/isEnterPage',
        });

        return result
    }
}

/* 获取页面分享模板 */
export function fetchPageShare(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            showLoading: false,
            method: 'GET',
            body: params,
            url: '/api/wechat/studio/page-share',
        });

        if (result.state.code === 0) {
            dispatch({
                type: UPDATE_PAGE_SHARE,
                data: result.data.pageShare,
            })
        }

        return result
    }
}

//直播间首页顶部绿色条获取三方导粉缓存时间
export function fetchThreeCacheTime(liveId) {
    return api({
        url: '/api/wechat/live/getOpsAppIdSwitchConf',
        method: 'GET',
        body: {
            channel: '205',
            liveId
        }
    });
}

/* 查询是不是专业版 */
export const fetchIsAdminFlag = createFetchAction('/api/wechat/studio/is-live-admin', 'GET')

/* 查询功能菜单 */
export const fetchFunctionMenus = createFetchAction('/api/wechat/live-studio/function-menu/get')

/* 查询页面排版 */
export const fetchPageMenus = createFetchAction('/api/wechat/live-studio/page-menu/get')

/* 查询直播间扩展信息 */
export const fetchLiveExtend = createFetchAction('/api/wechat/live-studio/extend')

/* PC自定义功能模块详情 */
export const fetchModuleInfo = createFetchAction('/api/wechat/studio/module-info','GET')

/* 保存直播间自定义信息 */
// export const saveUserDefined = createFetchAction('/api/wechat/live-studio/user-defined/save', 'post')

/* 查询功能菜单 */
export const fetchPageConfig = createFetchAction('/api/wechat/live-studio/page-config')

/* 查询功能菜单 */
export const savePageConfig = createFetchAction('/api/wechat/live-studio/save-page-config','POST')

/* 保存功能模块显示状态 */
export const saveFunction = createFetchAction('/api/wechat/live-studio/save-function', 'POST')

/* 保存页面模块排序 */
export const saveLayout = createFetchAction('/api/wechat/live-studio/save-layout', 'POST')

/* 保存页面信息 */
export const savePageInfo = createFetchAction('/api/wechat/live-studio/save-page-info', 'POST')

/* 页面访问统计 */
export const modulePv = createFetchAction('/api/wechat/live-studio/module-pv', 'POST')

/* 获取用户和自媒体版本业务负责人的联系信息 */
export const fetchContactInfo = createFetchAction('/api/wechat/studio/mediaMarket/contactInfo', 'POST')

/* 保存编辑的手机号码 */
export const savePhoneNumber = createFetchAction('/api/wechat/studio/mediaMarket/savePhoneNumber', 'POST')

/* 发送短信验证码 */
export const sendValidCode = createFetchAction('/api/wechat/sendValidCode', 'POST')

/* 校验短信验证码 */
export const checkValidCode = createFetchAction('/api/wechat/checkValidCode', 'POST')

/* 查询用户是否开启了自动推广 */
export const fetchIsAutoPromote = createFetchAction('/api/wechat/studio/mediaMarket/isAutoPromote', 'POST')

/* 保存用户设置的自动推广状态 */
export const saveAutoPromote = createFetchAction('/api/wechat/studio/mediaMarket/saveAutoPromote', 'POST')

/* 获取被选系列课列表数据 */
export const fetchAlternativeChannels = createFetchAction('/api/wechat/studio/mediaMarket/alternativeChannels', 'POST')

/* 获取投放中系列课数据 */
export const fetchPromotionalChannels = createFetchAction('/api/wechat/studio/mediaMarket/promotionalChannels', 'POST')

/* 单个系列课关闭/申请推广 */
export const savePromote = createFetchAction('/api/wechat/studio/mediaMarket/savePromote', 'POST')

/* 保存系列课的推文信息 */
export const saveTweet = createFetchAction('/api/wechat/studio/mediaMarket/saveTweet', 'POST')

/* 已经投放的系列课下架 */
export const offshelfChannel = createFetchAction('/api/wechat/studio/mediaMarket/offshelf', 'POST')

/* 保存系列课的分成比例 */
export const savePercent = createFetchAction('/api/wechat/studio/mediaMarket/savePercent', 'POST')

/* 获取系列课进入备选库的条件 */
export const getConditions = createFetchAction('/api/wechat/studio/mediaMarket/getConditions', 'POST')

/** 获取直播间打卡训练营列表 */
export const fetchCheckinCampList = createFetchAction('/api/wechat/checkInCamp/campList', 'POST')

/** 获取直播间训练营列表 */
export const fetchTrainingList = createFetchAction('/api/wechat/training/listCamp', 'POST')

/** 隐藏或显示打卡训练营 */
export const switchCheckinCampStatus = createFetchAction('/api/wechat/checkInCamp/campDisplay', 'POST')

/** 删除打卡训练营 */
export const deleteCheckinCamp = createFetchAction('/api/wechat/checkInCamp/deleteCamp', 'POST')

/** 隐藏或显示训练营 */
export const switchTrainingStatus = createFetchAction('/api/wechat/training/updateCampStatus', 'POST')

/** 删除训练营 */
export const deleteTraining = createFetchAction('/api/wechat/training/deleteCamp', 'POST')


/* 更新功能菜单数据 */
export function updateFunctionMenus(functionMenu) {
    return {
        type: UPDATE_FUNCTION_MENU,
        functionMenu,
    }
}

/* 更新页面排版数据 */
export function updatePageMenus(pageMenu) {
    return {
        type: UPDATE_PAGE_MENU,
        pageMenu,
    }
}
