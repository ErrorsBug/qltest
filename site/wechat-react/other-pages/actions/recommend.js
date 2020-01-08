
import { api } from './common';
import { get } from 'lodash';
import { request } from 'common_actions/common'

export const INIT_RECOMMEND_COURSE_LIST = 'INIT_RECOMMEND_COURSE_LIST';
export const INIT_RECOMMEND_BANNER_LIST = 'INIT_RECOMMEND_BANNER_LIST';
export const INIT_HOT_LIVE_LIST = 'INIT_HOT_LIVE_LIST';
export const SET_RECOMMEND_COURSE_PAGE_OFFSET = 'SET_RECOMMEND_COURSE_PAGE_OFFSET';

export const FETCH_RECOMMEND_COURSE_LIST = 'FETCH_RECOMMEND_COURSE_LIST';
export const INSERT_RECOMMEND_COURSE_LIST_TO_TOP = 'INSERT_RECOMMEND_COURSE_LIST_TO_TOP';
export const INIT_RECOMMEND_CATEGORY_LIST = 'INIT_RECOMMEND_CATEGORY_LIST';
export const RECOMMEND_CATEGORY_CHANGE = 'RECOMMEND_CATEGORY_CHANGE';
export const RECOMMEND_SHOW_FLAG = 'RECOMMEND_SHOW_FLAG';

export const INIT_PERIOD_COURSE_LIST = 'INIT_PERIOD_COURSE_LIST';
export const INIT_PERIOD_COURSE_INFO = 'INIT_PERIOD_COURSE_INFO';
export const INIT_PERIOD_SHARE_CARD = 'INIT_PERIOD_SHARE_CARD';
export const INIT_PERIOD_TABS = 'INIT_PERIOD_TABS';
export const IS_MINE_NEW = 'IS_MINE_NEW';
// 获取两级分类标签
export const INIT_TWO_LEVEL_TAG = 'INIT_TWO_LEVEL_TAG';

// 更新大咖文章列表
export const UPDATE_ARTICLES = 'RECOMMEND/UPDATE_ARTICLES'
// 更新热门分类标签
export const UPDATE_HOTTAG_TAGS = 'RECOMMEND/UPDATE_HOTTAG_TAGS'
// 更新热门分类数据列表
export const UPDATE_HOTTAG_COURSE = 'RECOMMEND/UPDATE_HOTTAG_COURSE'
// 是否展示热门分类
export const SHOW_HOTTAG_SECTION = 'RECOMMEND/SHOW_HOTTAG_SECTION'
// 更新热门分类数据curIndex
export const UPDATE_COURSE_CURINDEX ='RECOMMEND/UPDATE_COURSE_CURINDEX'
// 更新热门分类标签
export const CLEAR_HOTTAG_TAGS = 'RECOMMEND/CLEAR_HOTTAG_TAGS'
// 清空热门分类数据列表
export const CLEAR_HOT_TAG_COURSE_LIST ='RECOMMEND/CLEAR_HOT_TAG_COURSE_LIST';
// 增加打卡次数
export const ADD_CLOCK_IN_TIME = 'ADD_CLOCK_IN_TIME';

// 初始化四个Icon
export const INIT_ICON_LIST ='RECOMMEND/INIT_ICON_LIST'
export const INIT_CAPSULE_ICON ='RECOMMEND/INIT_CAPSULE_ICON'

// 初始化夜答栏目
export const NIGHT_ANSWER_INFO = 'NIGHT_ANSWER_INFO';
export const NIGHT_ANSWER_IF_REQUEST = 'NIGHT_ANSWER_IF_REQUEST';
// 用户尾数奇偶
export const IS_EVEN = "IS_EVEN";

// 各模块数据
export const INIT_INDEX_DATA = "INIT_INDEX_DATA";

export function initIndexData(data){
    return {
        type: INIT_INDEX_DATA,
        data
    }
}

// 判断用户尾数奇偶
export function initIsEven(flag) {
    return {
        type: IS_EVEN,
        flag
    }
};

// 初始化夜答栏目
export function initNightAnswerInfo(info) {
    return {
        type: NIGHT_ANSWER_INFO,
        info
    }
};
export function nightAnswerIfRequest() {
    return {
        type: NIGHT_ANSWER_IF_REQUEST
    }
};
export function fetchNightAnswerInfo () {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: "POST",
            url: '/api/wechat/recommend/night-answer',
        });
        dispatch(initNightAnswerInfo(result.data && result.data.list || []));
        return result.data && result.data.list
    }
};
export function initIconList(iconList) {
    return {
        type: INIT_ICON_LIST,
        iconList
    }
};
export function initCapsuleIcon(capsuleIcon) {
    return {
        type: INIT_CAPSULE_ICON,
        capsuleIcon
    }
};

// 初始化课程列表
export function initCourseList(categoryId, courseList) {
    return {
        type: INIT_RECOMMEND_COURSE_LIST,
        categoryId,
        courseList
    }
};

// 初始化banners
export function initBannerList(banners) {
    return {
        type: INIT_RECOMMEND_BANNER_LIST,
        banners
    }
};

// 初始化热门直播间
export function initHotLives(hotLives) {
    return {
        type: INIT_HOT_LIVE_LIST,
        hotLives
    }
};

// 设置课程列表分页页码
export function setCourseOffset(courseOffset) {
    return {
        type: SET_RECOMMEND_COURSE_PAGE_OFFSET,
        courseOffset
    }
};



// 获取下一页话题
export function fetchCourseList(categoryId, offset, pageSize, showLoading) {

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/recommend/course-list',
            body: {
                offset,
                pageSize,
                tagId: categoryId,
            }
        });

        let courseList = result.data && result.data.dataList || [];
        courseList.length && courseList.forEach(item => {
            // 此接口字段错乱！！！
            item.chargeType = item.businessType;
            item.businessType = item.type;
        })

        dispatch({
            type: FETCH_RECOMMEND_COURSE_LIST,
            categoryId,
            courseList,
        });

        // dispatch(setCourseOffset(offset + (result.data && result.data.dataList || []).length));

        return courseList
    }
};

// 获取n条数据发布到页面顶部
export function fetchAndInsertTopCourseList(categoryId, offset, pageSize, showLoading) {

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading,
            url: '/api/wechat/recommend/course-list',
            body: {
                offset,
                pageSize,
                tagId: categoryId,
            }
        });
        
        let courseList = result.data && result.data.dataList || [];
        courseList.length && courseList.forEach(item => {
            // 此接口字段错乱！！！
            item.chargeType = item.businessType;
            item.businessType = item.type;
        })

        dispatch({
            type: INSERT_RECOMMEND_COURSE_LIST_TO_TOP,
            categoryId,
            courseList,
        });

        // dispatch(setCourseOffset(offset + (result.data && result.data.dataList || []).length));

        return courseList
    }
};

export function fetchBanners(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/banners',
            body: params,
        });

        dispatch(initBannerList(result.data && result.data.banners || []));

        return result.data && result.data.banners;
    };
}

export function fetchFlag() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/recommend/isflag'
        });

        dispatch(initShowFlag(result.data || []));

        return result.data;
    };
}



// 初始化分类列表
export function initCategoryList(categoryList) {
    return {
        type: INIT_RECOMMEND_CATEGORY_LIST,
        categoryList
    };
};

// 获取分类列表
export function fetchCategoryList() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/recommend/cagegory-list'
        });

        dispatch(initCategoryList(result.data && result.data.dataList || []));

        return result.data && result.data.dataList;
    };
};

// 切换标签的时候获取热门直播间
export function fetchHotLives(tagId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: "POST",
            showLoading: false,
            url: '/api/wechat/recommend/hotLives',
            body: {
                tagId
            }
        });
        // console.log(tagId);
        // console.log(result.data && result.data.lives);
        // console.log(result.data.lives);
        dispatch(initHotLives(result.data && result.data.lives));

        return result.data && result.data.lives;
    };
};

// 更改分类
export function changeCategory(categoryId) {
    return {
        type: RECOMMEND_CATEGORY_CHANGE,
        categoryId,
    };
};

//是否展示订阅标签入口
export function initShowFlag(showFlag) {
    return {
        type: RECOMMEND_SHOW_FLAG,
        showFlag,
    };
};

//个人中心是否有新消息
export function initMineNew(isMineNew) {
    return {
        type: IS_MINE_NEW,
        isMineNew,
    };
};

/**
 * 获取个人中心小红点信息并初始化
 * @return {[type]} [description]
 */
export function fetchIsMineNew() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/recommend/is-mine-new'
        });

        dispatch(initMineNew(result.data || {}));

        return result.data;
    };
}

// 增加打卡次数
export function addClockInTime() {
	return {
		type: ADD_CLOCK_IN_TIME
	};
}

// 定制课程打卡
export function subscribePunchCard() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/recommend/self-course-subscribe',
            method: "POST",
        });

        if(result.state.code === 0){
	        dispatch(addClockInTime());
        }

        return result;
    }
}


//课程定制初始化最新那期的课程列表
export function initPeriodCourseList(periodCourse) {
    return {
        type: INIT_PERIOD_COURSE_LIST,
        periodData: periodCourse,
    };
};
export function initPeriodCourseInfo(periodInfo) {
    return {
        type: INIT_PERIOD_COURSE_INFO,
        periodInfo: periodInfo,
    };
};
export function fetchPeriodInfo() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/recommend/get-period-info'
        });

        dispatch(initPeriodCourseInfo(result.data || []));

        return result.data;
    };
}


// 获取下一期定制课程
export function getPeriodCourseList(periodId, showLoading) {
    if (periodId == -1) {
        return false;
    } else {
        return async (dispatch, getStore) => {
            const result = await api({
                dispatch,
                getStore,
                showLoading,
                url: '/api/wechat/recommend/get-period-course',
                body: {
                    periodId,
                }
            });
            dispatch(initPeriodCourseList(result.data || []));
            // return data
            return result
        }
    }
};


//定制课程邀请卡
export function initPeriodShareCard(periodInfo) {
    return {
        type: INIT_PERIOD_SHARE_CARD,
        periodCardInfo: periodInfo,
    };
};

//定制课程选择订阅标签页面
export function initPeriodTagSelect(allPeriodTabs, myPeriodTabs, status) {
    var allTabs = allPeriodTabs || [];
    var myTabs = myPeriodTabs || [];
    var hasMy = myPeriodTabs && myPeriodTabs.length > 0 ? "Y" : "N";

    var bigLabels = [],
        bigTags = [],
        smLabels = [];

    allTabs.map((label, index) => {
        if (label.parentId == 0) {
            label.smLabels = [];
            bigLabels.push(label);
            bigLabels[String(label.id)] = bigLabels.length - 1; // 了解大标签的位置
        }
        return label;
    });

    allTabs.map((label, index) => {

        if (label.parentId != 0 && label.parentId) {
            let arr = bigLabels[bigLabels[String(label.parentId)]].smLabels;
            // console.log('big',bigLabels[bigLabels[String(label.parentId)]]);
            arr.push(label);
            arr[String(label.id)] = arr.length - 1; // 了解小标签的位置
        }
        return label;
    });
    if (status == "Y") {
        myTabs.map((label, index) => {
            if ((label.parentId == 0 || !label.parentId) && bigLabels[bigLabels[String(label.id)]]) {
                bigLabels[bigLabels[String(label.id)]].action = true;
                bigTags.push(label.id);
            } else if (label.parentId && label.parentId != 0 && bigLabels[String(label.parentId)]) {
                let arr = bigLabels[bigLabels[String(label.parentId)]].smLabels;
                arr[arr[String(label.id)]].action = true;
                bigLabels[bigLabels[String(label.parentId)]].smLabels.action = true;
                smLabels.push(label.id);
            }
        });
    };
    return {
        type: INIT_PERIOD_TABS,
        status,
        hasMy: hasMy,
        bigLabels,
        bigTags: bigTags,
        smLabels: smLabels,
    };
};

export function getPeriodShareCard(inviteKey) {

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/recommend/get-period-share-card',
            body: {
                inviteKey,
            }
        });


        dispatch({
            type: INIT_PERIOD_SHARE_CARD,
            periodCardInfo: result.data,
        });
        return result
    }
};



//初始化訂閲標簽
export function getSelectPeriodTag() {

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/recommend/init-period-tag',
        });
        dispatch(initPeriodTagSelect(get(result, 'data.allPeriodTag.data.dataList', []), get(result, 'data.myPeriodTag.data.dataList', []), get(result, 'data.getSubscribeStatus.data.status', [])));
    }
};


// 保存订阅标签
export function saveSelectPeriodTag(ids, inviteKey) {

    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/recommend/save-period-tag',
            body: {
                ids, inviteKey
            },
            method: "POST",
        });

        return result
    }
};


export function setSubscribeStatus(isOpen) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/recommend/set-subscribe-status',
            body: {
                status: isOpen,
            },
            method: "POST",
        });

        return result
    }
};

/**
 * 服务端渲染获取二级标签
 */
export function initTwoLevelTag(allTags) {
    return {
        type: INIT_TWO_LEVEL_TAG,
        allTags
    }
};
// 前端路由获取二级标签
export function getTwoLevelTag(type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/recommend/class/all-tags',
            body: {
                type
            },
        });

        if (result && result.data && result.data.dataList) {
            dispatch(initTwoLevelTag(result.data.dataList));
        }

        return result;
    };
};

// kfAppId , kfOpenId 用户绑定三方平台
export function userBindKaiFang(kfAppId, kfOpenId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/userBindKaiFang',
            body: {
                kfAppId,
                kfOpenId,
            },
            method: "POST",
        });

        return result;
    };
}

// 请求首页弹窗url
export function fetchCenterPopup() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/center/popup',
            body: {}
        })
        return result
    }
}

/* 获取大咖文章列表 */
export function fetchArticleList(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/recommend/article/list',
            body: params,
        })
        if (result.state.code === 0) {
            dispatch(updateArticleList(result.data.dataList || []))
        }

        return result
    }
}

export function updateArticleList(data) {
    return {
        type: UPDATE_ARTICLES,
        data,
    }
}

/* 获取热门分类列表 */
export function fetchHotTags(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/recommend/hot-tag/tags',
            body: params,
        })
        if (result.state.code === 0) {
            dispatch(updateHotTags(result.data.dataList))
        }
        return result.data.dataList
    }
}

export function updateHotTags(tags=[]) {
    return {
        type: UPDATE_HOTTAG_TAGS,
        tags,
        courses: tags.map((item, index) => {
            return {
                ...item,
                courses: [],
                page: 1,
                size: 10,
                noMore: false,
                curIndex: 0,
            }
        }),
    }
}

/* 获取制定热门分类的课程列表 */
export function fetchHotTagCourse(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/recommend/hot-tag/course',
            body: params,
        })

        if (!params.noRedux) {
            dispatch(updateHotTagCourse({
                ...params,
                courses: result.data.dataList || [],
            }))
        }

        return result.data.dataList
    }
}

export function updateCourseCurIndex(data) {
    return {
        type: UPDATE_COURSE_CURINDEX,
        data,
    }
}

export function updateHotTagCourse(data) {
    return {
        type: UPDATE_HOTTAG_COURSE,
        data,
    }
}

/* 展示新内容 */
export function showHotTagSection() {
    return {
        type: SHOW_HOTTAG_SECTION,
    }
}

export function clearHotTagCourseList() {
    return {
        type: CLEAR_HOT_TAG_COURSE_LIST,
    }
}

export function clearHotTags() {
    return {
        type: CLEAR_HOTTAG_TAGS,
    }
}

//
export function getCustomCoursePaster(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/recommend/getCustomCoursePaster',
			body: params,
		});

		return result
	}
}


export function getIconList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'GET',
			url: '/api/wechat/recommend/iconList',
			body: params,
		});

        if(result && result.data && result.data.zoneList && result.data.zoneList.length > 0) {
            dispatch(initIconList(result.data.zoneList))
            dispatch(initCapsuleIcon(result.data.capsuleIcon))
            return result.data.zoneList
        }

		return result
	}
}

//查询用户领新人礼包标识
export function giftFlag() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/recommend/giftFlag',
		});

		return result
	}
}

//查询新人礼包列表
export function allGift() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			url: '/api/wechat/recommend/allGift',
		});

		return result
	}
}

//查询新人礼包列表-换一换
export function getNewGroup(groupId) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
            method: 'POST',
            body: {
                groupId,
            },
			url: '/api/wechat/recommend/newGiftTopic',
		});

		return result
	}
}

//领取礼包
export function getGift(groupId,couponIds) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
            method: 'POST',
            body: {
                groupId,
                couponIds,
            },
			url: '/api/wechat/recommend/getGift',
		});

		return result
	}
}

/**
 * 获取新用户礼包信息
 */
export function getNewUserGiftData () {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/recommend/newUserGift',
        });
    }
}

//初始化首页数据
export function getIndexData(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			cache: true,
			expires: 60 * 5,
			url: '/api/wechat/recommend/init-index-data',
            body: params
		});
        if (result?.data?.regions?.length) {
            dispatch(initIndexData(result.data.regions))
        }


		return result
	}
}

//初始化首页兴趣相投
export function initInterest() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			cache: true,
			expires: 60 * 5,
			url: '/api/wechat/recommend/init-interest',
		});

		return result
	}
}

//初始化首页兴趣相投
export function viewMore(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			body: params,
			url: '/api/wechat/recommend/view-more',
		});

		return result
	}
}

// 获取用户偏好标签列表
export function getLivecenterTags(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			body: params,
			url: '/api/live/center/livecenterTags',
		});

        if (result && result.state.code === 0) {
            return result.data.tagList
        }
		return false
	}
}

// 获取用户偏好标签列表
export function saveUserTag(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			method: 'POST',
			body: params,
			url: '/api/live/center/saveUserTag',
		});

		return result
	}
}



// 课程广告位
export const myCourseAd = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/ad/myCourse',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || null
}

// 已购体验营列表
export const buyCampList = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/camp/list',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || {}
}

// 用户中心体验营广告位
export const userCenterAd = async (params) => {
    const res = await request.post({
        url: '/api/wechat/transfer/baseApi/h5/ad/userCenter',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    }) 
    return res && res.data || {}
}