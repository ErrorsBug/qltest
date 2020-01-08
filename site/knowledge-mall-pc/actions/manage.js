import { apiService } from '../components/api-service';

// 查询当前登录用户的知识店铺信息
export function fetchKnowledgeStoreInfo(params) {
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            url: '/h5/knowledge/personas/info',
            body: params,
            showError: true,
        });
        return result;
    }
}

// 查询订单和收益的汇总信息
export function fetchOrdersIncomeInfo(params) {
    return async (dispatch, getStore) => {
        const result = await apiService.post({
            url: '/h5/knowledge/orderAndProfit',
            body: params,
            showError: true,
        });
        return result;
    }
}