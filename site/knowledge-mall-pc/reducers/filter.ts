import {
    UPDATE_FILTER_CONDITIONS,
    RESET_FILTER_CONDITIONS,
    FETCH_CATEGORY_LIST
} from '../actions/filter';

// 课程筛选条件
const initData = {
    // 选中的课程分类对应的ID
    activeCategoryId: '',
    // 排序指标
    sortBy: '',
    // 排序方式
    sortOrder: '',
    // 是否只看未转载课程
    onlyViewRelayCourse: false,
    // 搜索文本
    searchText: '',
    // 当前页码
    page: 1,
    // 分页大小
    size: 20,
    // 没有更多
    noMore: false,
    // 是否查看热销top10的活动课程
    viewTopTenCourses: false,
    categorySelected: 'recommend',
    // 分类列表
    categoryList: []
}

export function updateFilterConditions(state = initData, action) {
    switch (action.type) {
        case UPDATE_FILTER_CONDITIONS:
            if (state.categorySelected == 'recommend' || action.conditions.categorySelected == 'recommend') {
                action.conditions.noMore = true;
            }
            return {
                ...state,
                ...action.conditions
            }
        case RESET_FILTER_CONDITIONS:
            let { categoryList } = state;
            return {
                ...initData,
                categoryList
            }
        case FETCH_CATEGORY_LIST:
            return {
                ...state,
                ...action.payload
            }
        default: 
            return state;
    }
}