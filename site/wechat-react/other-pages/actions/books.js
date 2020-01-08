import { api } from './common';
import { request } from 'common_actions/common'

export const GET_BOOKS_LISTS = Symbol('GET_BOOKS_LISTS');
export const SET_BOOKS_LISTS_PAGE = Symbol("SET_BOOKS_LISTS_PAGE");
export const CLEAR_BOOKS = Symbol('CLEAR_BOOKS')

// 获取免费公开课
export const getBooksLists = (params = {}) => {
  return async (dispatch, getStore) => {
		const result = await api({
      dispatch,
      getStore,
      showLoading: true,
      url: '/api/wechat/books/lists',
      method: 'GET',
      body: {
          page: params.page || 1,
          size: params.size || 5,
      }
    });
    const bookLists = result.data && result.data.bookList || [];
    const shareObj = result.data && result.data.shareObj || {}
    const bookSubjectHeadImage = result.data && result.data.bookSubjectHeadImage
    const storeList = getStore().books.bookLists || [];
    const lists = [...bookLists,...storeList];
    let noneData = false, isNoMoreCourse = false ,page = getStore().books.pageNumb;
    if(!lists.length){
      noneData = true;
    } else {
      if(bookLists.length < params.size){
        isNoMoreCourse = true
      } else {
        page += 1
      }
    }
    dispatch({
      type: GET_BOOKS_LISTS,
      bookLists: bookLists,
      noneData: noneData,
      isNoMoreCourse: isNoMoreCourse,
      pageNumb: page,
      shareObj: shareObj,
      bookSubjectHeadImage
    });
		return result.data && result.data.bookLists || [];;
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


// 获取子节点信息
export const listChildren = async (query) => {
  const params = {
      method: 'POST',
      url: '/api/wechat/university/listChildren',
      body: { ...query }
  }
  const data = await api(params);
  return data;
}

// 获取当前节点信息和子节点的数据
export const getWithChildren = async (query) => {
  const params = {
      method: 'POST',
      url: '/api/wechat/university/getWithChildren',
      body: { ...query }
  }
  const data = await api(params);
  return data;
}

// 获取大学信息
export const getMenuNode = async (query) => {
  const params = {
      method: 'POST',
      url: '/api/wechat/university/getMenuNode',
      body: { ...query }
  }
  const data = await api(params);
  return data;
}

// 根据节点集合获取多个集合数据
export const getMenuMapNode = async (query) => {
  const params = {
      url: '/api/wechat/university/batchListChildren',
      body: { ...query }
  }
  const data = await api(params);
  return data;
}

// 获取听书首页和菜单
export const bannerAndMenu = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/bannerAndMenu',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 获取听书首页节点
export const homeIndex = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/homeIndex',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 获取节点数据
export const nodeData = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/nodeData',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 听书分类
export const categoryList = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/categoryList',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 听书分类数据
export const categoryBookList = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/categoryBookList',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 千聊书单
export const bookSetList = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/bookSetList',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}

// 书单详情
export const bookList = async (params) => {
  const res = await request.post({
      url: '/api/wechat/transfer/shortKnowledgeApi/listenBook/bookList',
      body: { ...params }
  }).then(res => {
      if(res.state && res.state.code !== 0){
          throw new Error(res.state.msg)
      }
      return res;
  }).catch(err => {
      window.toast(err.message);
  })
  return res && res.data  || {};
}