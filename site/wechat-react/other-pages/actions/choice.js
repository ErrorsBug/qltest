import { api } from './common';

export const GET_PUBLIC_COURSE = 'GET_PUBLIC_COURSE';
export const SET_FREE_COURSE_PAGE_NUM = 'SET_FREE_COURSE_PAGE_NUM';
export const CLEAR_COURSES = 'CLEAR_COURSES'

// 获取免费公开课
export const getPublicCourse = (params = {}) => {
  return async (dispatch, getStore) => {
		const result = await api({
      dispatch,
      getStore,
      showLoading: true,
      url: '/api/wechat/liveCenter/freePublicCourses',
      method: 'POST',
      body: {
          pageNum: params.page || 1,
          pageSize: params.size || 20,
      }
    });
    dispatch({
      type: GET_PUBLIC_COURSE,
      courseList: result.data && result.data.dataList || [],
      title: result.data && result.data.subTitle || '',
    });
    const page = getStore().choice.pageNumb ? getStore().choice.pageNumb : 1;
    const options = {
      page: page,
      noData: false,
      isNoMore: false
    }
    if(result.data.dataList){
      if(result.data.dataList.length === 20){
        options.page = page ? Number(page) + 1 : 1;
      } else if(result.data.dataList.length < 20 && result.data.dataList.length >= 0 ) {
        options.isNoMore = true;
      } else if(page === 1 && !result.data.dataList.length){
        options.isNoMore = false;
        options.noData = true;
      }
    }
    dispatch(setCoursePage(options));
		return result.data && result.data.dataList || [];;
	};
}

// 分页数
export const setCoursePage = (params) => {
  return {
    type: SET_FREE_COURSE_PAGE_NUM,
    ...params
  }
}

// 清空列表
export const clearCourses = () => {
  return {
    type: CLEAR_COURSES,
  }
}