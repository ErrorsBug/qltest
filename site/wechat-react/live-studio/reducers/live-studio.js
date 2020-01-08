import {
    UPDATE_FUNCTION_MENU,
    UPDATE_PAGE_MENU,
    UPDATE_PAGE_SHARE,
} from '../actions/live-studio'

const initState = {
    /* 功能菜单 */
    functionMenus: [],
    /* 页面排版 */
    pageMenus: [],
    /* 页面分享 */
    pageShare: null,
}

const actionHandle = {
    [UPDATE_FUNCTION_MENU]: (state, action) => {
        return { ...state, functionMenus: action.functionMenus, }
    },
    [UPDATE_PAGE_MENU]: (state, action) => {
        return { ...state, pageMenus: action.pageMenus }
    },
    [UPDATE_PAGE_SHARE]: (state, action) => {
        return { ...state, pageShare: action.data }    
    },
}

export function liveStudio(state = initState, action) {
    const handle = actionHandle[action.type]
    return handle ? handle(state, action) : state
}
