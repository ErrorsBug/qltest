import {
    UPDATE_STORE_INFO,
    UPDATE_WECHAT_INFO,
    UPDATE_TAGS_SELECTED,
    UPDATE_FANS_REMARK,
    UPDATE_FANS_TAGS,
    UPDATE_TEAM_TAGS,
    UPDATE_ACTIVE_PLATFORMS,
    ADD_TAGS_SELECTED,
    HAS_PORTRAIT_INFO,
    ADD_ACTIVE_PLATFORM,
    SET_ACTIVE_PLATFORM,
    DESTROY_ACTIVE_PLATFORM,
    SET_PLATFORM_MODAL_DISPLAY,
    EMPTY_TAGS_SELECTED,
} from '../actions/portrait';

// 用户画像信息
const initData = {
    // 店铺信息
    storeInfo: {
        name: '暂未开通知识店铺',
        version: '暂未开通知识店铺',
        followers: '0',
    },
    // 公众号信息
    wechatInfo: {
        name: '',
        account: '',
        followers: '',
        category: '',
        allCategories: [],
        contacts: '',
        phone: '',
    },
    // 选中的粉丝标签和团队标签
    tagsSelected: [],
    // 粉丝画像的备注信息
    fansRemark: '',
    // 所有的粉丝标签列表
    fansTags: [],
    // 所有的团队标签列表
    teamTags: [],
    // 活跃平台信息
    activePlatforms: [],
    // 是否展示添加平台的弹窗
    showPlatformModal: 'N',
    // 当前正在修改的平台信息的数组索引
    platformToBeUpdatedIndex: -1,
    // 是否填写过用户画像信息
    hasPortraitInfo: true,
    
}

export function portrait(state = initData, action) {
    switch (action.type) {
        case UPDATE_STORE_INFO: 
            return {
                ...state,
                storeInfo: { ...state.storeInfo, ...action.storeInfo }
            }
        case UPDATE_WECHAT_INFO:
            return {
                ...state,
                wechatInfo: { ...state.wechatInfo, ...action.wechatInfo }
            }
        case UPDATE_TAGS_SELECTED:
            return {
                ...state,
                tagsSelected: [...action.tagsSelected]
            }
        case ADD_TAGS_SELECTED:
            return {
                ...state,
                tagsSelected: [...state.tagsSelected, ...action.tagsSelected]
            }
        case EMPTY_TAGS_SELECTED:
            return {
                ...state,
                tagsSelected: []
            }
        case UPDATE_FANS_REMARK:
            return {
                ...state,
                fansRemark: action.fansRemark
            }
        case UPDATE_FANS_TAGS:
            return {
                ...state,
                fansTags: [...action.fansTags]
            }
        case UPDATE_TEAM_TAGS:
            return {
                ...state,
                teamTags: [...action.teamTags],
            }
        case UPDATE_ACTIVE_PLATFORMS:
            return {
                ...state,
                activePlatforms: [...action.activePlatforms]
            }
        case HAS_PORTRAIT_INFO:
            return {
                ...state,
                hasPortraitInfo: action.hasPortraitInfo
            }
        case ADD_ACTIVE_PLATFORM:
            return {
                ...state,
                activePlatforms: [...state.activePlatforms, action.activePlatform]
            }
        case SET_ACTIVE_PLATFORM:
            return {
                ...state,
                platformToBeUpdatedIndex: action.index
            }
        case DESTROY_ACTIVE_PLATFORM:
            return {
                ...state,
                platformToBeUpdatedIndex: -1
            }
        case SET_PLATFORM_MODAL_DISPLAY:
            return {
                ...state,
                showPlatformModal: action.YorN
            }
        default:
            return state
    }
}