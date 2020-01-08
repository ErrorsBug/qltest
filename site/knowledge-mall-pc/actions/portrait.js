import { apiService } from '../components/api-service';

export const UPDATE_STORE_INFO = 'UPDATE_STORE_INFO';
export const UPDATE_WECHAT_INFO = 'UPDATE_WECHAT_INFO';
export const UPDATE_TAGS_SELECTED = 'UPDATE_TAGS_SELECTED';
export const UPDATE_FANS_REMARK = 'UPDATE_FANS_REMARK';
export const UPDATE_FANS_TAGS = 'UPDATE_FANS_TAGS';
export const UPDATE_TEAM_TAGS = 'UPDATE_TEAM_TAGS';
export const UPDATE_ACTIVE_PLATFORMS = 'UPDATE_ACTIVE_PLATFORMS';
export const ADD_TAGS_SELECTED = 'ADD_TAGS_SELECTED';
export const EMPTY_TAGS_SELECTED = 'EMPTY_TAGS_SELECTED';
export const ADD_ACTIVE_PLATFORM = 'ADD_ACTIVE_PLATFORM';
export const SET_ACTIVE_PLATFORM = 'SET_ACTIVE_PLATFORM';
export const DESTROY_ACTIVE_PLATFORM = 'DESTROY_ACTIVE_PLATFORM';
export const SET_PLATFORM_MODAL_DISPLAY = 'SET_PLATFORM_MODAL_DISPLAY';

// 是否已经有画像信息
export const HAS_PORTRAIT_INFO = 'HAS_PORTRAIT_INFO';

export function updateStoreInfo(object){
    return {
        type: UPDATE_STORE_INFO,
        storeInfo: object
    }
}

export function updateWechatInfo(object){
    return {
        type: UPDATE_WECHAT_INFO,
        wechatInfo: object
    }
}

export function updateTagsSelected(array){
    return {
        type: UPDATE_TAGS_SELECTED,
        tagsSelected: array
    }
}

export function updateFansRemark(string){
    return {
        type: UPDATE_FANS_REMARK,
        fansRemark: string
    }
}

export function updateFansTags(array){
    return {
        type: UPDATE_FANS_TAGS,
        fansTags: array
    }
}

export function updateTeamTags(array){
    return {
        type: UPDATE_TEAM_TAGS,
        teamTags: array
    }
}

export function updateActivePlatforms(array){
    return {
        type: UPDATE_ACTIVE_PLATFORMS,
        activePlatforms: array
    }
}

export function addTagsSelected(array){
    return {
        type: ADD_TAGS_SELECTED,
        tagsSelected: array
    }
}

export function emptyTagsSelected(){
    return {
        type: EMPTY_TAGS_SELECTED
    }
}

export function hasPortraitInfo(string) {
    return {
        type: HAS_PORTRAIT_INFO,
        hasPortraitInfo: string == 'Y' ? true : false
    }
}

export function addActivePlatform(object){
    return {
        type: ADD_ACTIVE_PLATFORM,
        activePlatform: object
    }
}

export function setActivePlatform(number){
    return {
        type: SET_ACTIVE_PLATFORM,
        index: number
    }
}

export function destroyActivePlatform(){
    return {
        type: DESTROY_ACTIVE_PLATFORM
    }
}

export function setPlatformModalDisplay(char){
    return {
        type: SET_PLATFORM_MODAL_DISPLAY,
        YorN: char
    }
}

// 获取粉丝标签和团队标签列表
export function fetchTagsList(type, liveId){
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/list',
            body: {
                type,
                liveId
            },
            showError: true
        });
        if (result.state.code === 0) {
            const tagsSelected = [];
            const tagsList = result.data.personasList;
            tagsList.forEach((list) => {
                const items = list.items;
                items.forEach((item) => {
                    if (item.isCheck == 'Y') {
                        tagsSelected.push(String(item.itemId));
                    }
                });
            });
            dispatch(addTagsSelected(tagsSelected));
            if (type === 'fans_personas') {
                dispatch(updateFansTags(tagsList));
                dispatch(updateFansRemark(result.data.diyRemark));
            } else if (type === 'team_status') {
                dispatch(updateTeamTags(tagsList));
            }
        }
    }
}

// 获取画像信息
export function fetchPortraitInfo(liveId){
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/info',
            body: {
                liveId
            },
            showError: true
        });
        if (result.state.code === 0) {
            const storeInfo = result.data.knowledgeLiveInfo;
            const wechatInfo = result.data.appInfo;
            const activePlatforms = result.data.activePlatforms;
            const wechatCategoryList = result.data.appCategoryList;
            dispatch(updateStoreInfo({
                name: storeInfo.liveName,
                version: storeInfo.liveVersion,
                followers: storeInfo.fansNumber
            }));
            dispatch(updateWechatInfo({
                name: wechatInfo.appName,
                account: wechatInfo.appAccount,
                followers: wechatInfo.appFansNum,
                category: wechatInfo.appCategory,
                contacts: wechatInfo.linkman,
                phone: wechatInfo.mobile
            }));
            dispatch(updateActivePlatforms(activePlatforms));
        }
    }
}

// 查询是否已经存在画像信息
export function fetchHasPortraitInfo (liveId) {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/hasInfo',
            body: {
                liveId
            },
            showError: true
        });
        if (result.state.code === 0) {
            dispatch(hasPortraitInfo(result.data.result))
        }
    }
}

// 保存用户画像信息
export function savePortraitInfo(params){
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/save',
            body: params,
            showError: true
        });
        return result;
    }
}

// 获取公众号分类信息
export function fetchWechatCategoryList(){
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/wxopenCategorys',
            showError: true
        });
        if (result.state.code === 0) {
            dispatch(updateWechatInfo({
                allCategories: result.data.categoryList
            }));
        }
    }
}


