import { api } from './common';

export const GET_BUY_LISTS = Symbol("GET_BUY_LISTS");

// 获取免费公开课
export const getBuyLists = (params = {}) => {
  return async (dispatch, getStore) => {
		const result = await api({
      dispatch,
      getStore,
      showLoading: true,
      url: '/api/wechat/mine/purchaseList',
      method: 'POST',
      body: {
        page: params.page || 1,
        size: params.size || 20,
        purchaseType: params.purchaseType
      }
    });
    const purchaseList = result.data && result.data.purchaseList || [];
    const buyLists = getStore().buy.buyLists || [];
    const lists = [...buyLists,...purchaseList];
    let noneData = false, isNoMoreCourse = false;
    if(!lists.length){
      noneData = true;
    }
    if(purchaseList.length < params.size && !!lists.length){
      isNoMoreCourse = true
    }
    dispatch({
      type: GET_BUY_LISTS,
      buyLists: purchaseList,
      noneData: noneData,
      isNoMoreCourse: isNoMoreCourse,
      title: result.data && result.data.subTitle || '',
    });
		return result.data && result.data.purchaseList || [];;
	};
}

// 分页数
export const setBooksPage = (params) => {
  return {
    type: SET_BOOKS_LISTS_PAGE,
    ...params
  }
}

// 清空列表
export const clearBooks = () => {
  return {
    type: CLEAR_BOOKS,
  }
}