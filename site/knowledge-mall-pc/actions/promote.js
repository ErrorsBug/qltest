import { apiService } from '../components/api-service'

export const UPDATE_QUERY_NAME = 'COURSE/UPDATE_QUERY_NAME'
export const UPDATE_QUERY_DATE = 'COURSE/UPDATE_QUERY_DATE'
export const UPDATE_PROMOTE_LIST = 'COURSE/UPDATE_PROMOTE_LIST'

/* 更新查询姓名 */
export function updateQueryName(name) {
    return {
        type: UPDATE_QUERY_NAME,
        name,
    }
}

/* 更新查询日期 */
export function updateQueryDate(date) {
    return {
        type: UPDATE_QUERY_DATE,
        date,
    }
}

/* 查询推广订单 */
export function fetchPromoteOrder(params) {
    return async (dispatch, getStore) => {
        
        const result = await apiService.post({
            url: '/h5/knowledge/orderList',
            body: params,
            showError: true,
        })
        if (result.state.code === 0) {
            dispatch(updatePromoteList(result.data.orderList))
            dispatch(updatePromoteTotalCount(result.data.totalCount))
            return result.data
        }
    }
}

/* 更新推广列表 */
export function updatePromoteList(list) {
    return {
        type: UPDATE_PROMOTE_LIST,
        list,
    }
}