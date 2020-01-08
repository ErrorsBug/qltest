/**
 * Created by qing on 2017/10/26.
 */
import { api } from './common';

export const INIT_SHOP_TAG_LIST = 'INIT_SHOP_TAG_LIST';
export const INIT_SHOP_COURSE_LIST = 'INIT_SHOP_COURSE_LIST';
export const INIT_PUSH_ORDER_LIST = 'INIT_PUSH_ORDER_LIST';
export const INIT_PUSH_COURSE_LIST = 'INIT_PUSH_COURSE_LIST';
export const INIT_SHOP_RECOMMEND_LIST = 'INIT_SHOP_RECOMMEND_LIST';
export const INIT_THEMES = 'INIT_THEMES';
export const INIT_THEME = 'INIT_THEME';
export const GET_IMG_URL_CONFIG = 'GET_IMG_URL_CONFIG';

//获取分销商城分类列表
export function initTagList(tagList){
	return {
		type:INIT_SHOP_TAG_LIST,
		tagList:tagList || [],
	};
}


export function getCoursetagList(tagId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getCoursetagList',
		});
		dispatch(initTagList(result.data.list,tagId));
		return result;
	};
}


// 获取分销商城课程列表
export function getShopCourseList (tagId,pageNum,pageSize) {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/shopCouseList',
			body: {
				tagId,pageNum,pageSize
			}
		});
		dispatch({
            type: INIT_SHOP_COURSE_LIST,
            courseList:(result.data && result.data.list) || []
        });

		return result;
	};
};
//加入推广
export function setJoinCollection (userId,courseId,businessId,businessType) {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:true,
			url: '/api/wechat/coral/joinCollection',
			body: {
				userId,
				courseId,
				businessId,
				businessType
			},
			method:'POST'
		});

		return result;
	};
};

// 获取分销推广课程列表
export function getPushCourseList (pageNum,pageSize) {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getMyShareList',
			body: {
				pageNum,pageSize
			}
		});
		dispatch({
            type: INIT_PUSH_COURSE_LIST,
            coursePushList:(result.data&&result.data.list)||[]
        });

		return result;
	};
};

// 获取分销推广订单列表
export function getPushOrderList (pageNum,pageSize) {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getMyProfitRecord',
			body: {
				pageNum,pageSize
			}
		});
		dispatch({
            type: INIT_PUSH_ORDER_LIST,
            orderList:(result.data&&result.data.list)||[]
        });

		return result;
	};
};

// 获取分销商城课程列表
export function getShopBannerList () {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getBannerList',
		});

		return result;
	};
};

// 获取分销商城课程排行榜
export function getShopRankList (params) {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getRankList',
			body: params
		});

		return result;
	};
};
// 获取分销商城课程排行榜前三
export function getExcellentRankList (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method:'POST',
			showLoading:false,
			url: '/api/wechat/coral/getExcellentRankList',
			body: params
		});

		return result;
	};
};

// 获取分销商城每日推荐
export function getShopRecommendList () {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getRecommendList',
		});

		return result;
	};
};


//每日推广图片弹框
export function getShopPushImg () {
    return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			url: '/api/wechat/coral/getIndexFloatBox',
		});

		return result;
	};
};

//课程推广素材
export function getCourseMaterial (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'POST',
			url: '/api/wechat/coral/getCourseMaterial',
			body: params
		});

		return result;
	};
};

//获取专题设置
export function getThemes () {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'GET',
			url: '/api/wechat/coral/getSubjectList',
		});
		dispatch({
            type: INIT_THEMES,
            themes:(result.data&&result.data.list)||[]
        });
		return result;
	};
};

export function getOneTheme (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'GET',
			url: '/api/wechat/coral/getSubject',
			body:params,
		});
		dispatch({
            type: INIT_THEME,
            theme: result.data||{}
        });
		return result;
	};
};

export function getThemeList (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'GET',
			url: '/api/wechat/coral/getSubjectCourseList',
			body: params
		});
		return result;
	};
};



//首页专栏icon
export function getThemeIcon (params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'GET',
			url: '/api/wechat/coral/getIconList',
			body: params
		});
		return result;
	};
};


// 获取配置的弹窗图片和中部横幅图片
export function getImgUrlConfig () {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading:false,
			method:'POST',
			url: '/api/wechat/coral/getImgUrlConfig',
		});

		dispatch({
            type: GET_IMG_URL_CONFIG,
            chartletUrl: (result.data && result.data) || []
		});
		
		return result;
	};
};