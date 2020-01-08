import { api } from './common';
export const INIT_LIVE_INFO = 'INIT_LIVE_INFO';
export const INIT_LIVE_REALNAME = 'INIT_LIVE_REALNAME';

export const INIT_LIVE_SYMBOL = 'INIT_LIVE_SYMBOL'
export const INIT_POWER = 'INIT_POWER'
export const INIT_LIVE_TIMELINE = 'INIT_LIVE_TIMELINE'
export const INIT_LIVE_FOCUS_STATES = 'INIT_LIVE_FOCUS_STATES'
export const SET_PURCHASED_COURSE_LIST = 'SET_PURCHASED_COURSE_LIST'
export const SET_PREVIEW_COURSE_LIST = 'SET_PREVIEW_COURSE_LIST'

export const CHANGE_TIMELINE_INDEX = 'CHANGE_TIMELINE_INDEX'
export const CHANGE_CHANNEL_INDEX = 'CHANGE_CHANNEL_INDEX'
export const CHANGE_TOPIC_INDEX = 'CHANGE_TOPIC_INDEX'

export const LOAD_TIMELINE = 'LOAD_TIMELINE'
export const SET_BANNER_LIST ='SET_BANNER_LIST'
export const LOAD_BANNER_CHANNEL_LIST = 'LOAD_BANNER_CHANNEL_LIST'
export const LOAD_BANNER_TOPIC_LIST = 'LOAD_BANNER_TOPIC_LIST'
export const FOCUS_LIVE = 'FOCUS_LIVE'
export const LIVE_LIKE_ACTION = 'LIVE_LIKE_ACTION'
export const LIVE_DELETE_TIMELINE = 'LIVE_DELETE_TIMELINE'
export const CHANNEL_AND_TOPIC_NUM = 'CHANNEL_AND_TOPIC_NUM'
export const LIVE_GET_CHANNEL = 'LIVE_GET_CHANNEL'
export const LIVE_GET_TOPIC = 'LIVE_GET_TOPIC'

export const GET_LIVE_INTRO_PHOTO_LIST = 'GET_LIVE_INTRO_PHOTO_LIST'
export const LIVE_SET_ALERT = 'LIVE_SET_ALERT'

export const SET_LIVE_FOCUS_STATES = 'SET_LIVE_FOCUS_STATES'
export const LIVE_SET_FOLLOW_NUM = 'LIVE_SET_FOLLOW_NUM'
export const SET_AUDITED_STATUES = 'SET_AUDITED_STATUES'
export const UPDATE_LIVE_TOPIC_LIST = 'UPDATE_LIVE_TOPIC_LIST';
export const REMOVE_LIVE_TOPIC_ITEM = 'REMOVE_LIVE_TOPIC_ITEM';
export const UPDATE_LIVE_CHANNEL_LIST = 'UPDATE_LIVE_CHANNEL_LIST';
export const REMOVE_LIVE_CHANNEL_ITEM = 'REMOVE_LIVE_CHANNEL_ITEM';
export const SET_VIP_INFO = 'SET_VIP_INFO';
export const INIT_PUSH_NUM = 'INIT_PUSH_NUM';
export const TOGGLE_DISPLAY_MENU = 'TOGGLE_DISPLAY_MENU';
export const INIT_EXTEND_DATA = 'INIT_EXTEND_DATA';

export const INIT_SHARE_QUALITY = 'INIT_SHARE_QUALITY'
export const CLEAN_LIVE_TIMELINE = 'CLEAN_LIVE_TIMELINE'

export const FETCH_LIVE_ROLE = 'FETCH_LIVE_ROLE';
// 初始化直播间信息
export function initLiveInfo (data) {
    return {
        type: INIT_LIVE_INFO,
        data
    }
};
export function initLiveSymbol (data) {
    return {
        type: INIT_LIVE_SYMBOL,
        data
    }
};
export function initPower (data) {
    return {
        type: INIT_POWER,
        data
    }
};
export function initLiveTimeline (data) {
    return {
        type: INIT_LIVE_TIMELINE,
        data
    }
};
export function initLiveFocus (data) {
    return {
        type: INIT_LIVE_FOCUS_STATES,
        data
    }
};
export function cleanLiveTimeline (data) {
    return {
        type: CLEAN_LIVE_TIMELINE,
        cleanLiveTimeline
    }
}
export function initShareQuality (data) {
    return {
        type: INIT_SHARE_QUALITY,
        data
    }
};

export function setPurchasedCourseList (data) {
    return {
        type: SET_PURCHASED_COURSE_LIST,
        data
    }
}

export function setPreviewCourseList (data) {
    return {
        type: SET_PREVIEW_COURSE_LIST,
        data
    }
}

export function changeTimelineIdx (idx) {
    return {
        type: CHANGE_TIMELINE_INDEX,
        idx,
    }
};
export function changeChannelIdx (idx) {
    return {
        type: CHANGE_CHANNEL_INDEX,
        idx,
    }
};
export function changeTopicIdx (idx) {
    return {
        type: CHANGE_TOPIC_INDEX,
        idx,
    }
};

export function likeAction(data) {
    return {
        type: LIVE_LIKE_ACTION,
        data,
    };
}

export function setAuditedStatues(data) {
    return {
        type: SET_AUDITED_STATUES,
        data,
    };
}

export function fetchLiveRole (liveId) {
    if (!liveId) {
        console.error('获取直播间角色接口缺少liveId');
        return ;
    }
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/role',
            body: {
                liveId: liveId
            },
            method: 'POST'
        })

        if (result && result.state.code == 0) {
            dispatch({
                type: FETCH_LIVE_ROLE,
                payload: {
                    role: result.data.role
                }
            })
        }
    }
}

export function timelineLike(feedId, status, index) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: "/api/wechat/timeline/like",
            body: {
                feedId,
                status
            },
            method: 'POST',
        });

        if(result && result.data ) {

            dispatch(likeAction({
                status, index
            }))

            return result.data.code == 200
        }
    }
}

export function liveDeleteTimelineAction(data) {
    return {
        type: LIVE_DELETE_TIMELINE,
        data,
    };
}

export function initExtendData (data) {
    return {
        type: INIT_EXTEND_DATA,
        data
    }
}


export function liveDeleteTimeLine(feedId, index){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/deleteTimeLine', 
            body: { feedId },
            method: 'POST',
        });

        if (result && result.data) {
            if (result.data.code === 200) {
                dispatch(liveDeleteTimelineAction({
                    index,
                    feedId,
                }))
            }
        }   
        return result && result.data && result.data.code === 200;
    }
}


export function loadTimeline (page, time, liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getTimelineList',
            body: {
                liveId,
                beforeOrAfter: "before",
                page: {
                    page: page,
                    size: 20
                },
                time,
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: LOAD_TIMELINE,
                data: result && result.data && result.data.list
            })
        }
        return result && result.data && result.data.list
    }
};


export function liveFocus (status, liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/live/follow',
            body: {
                status, 
                liveId
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: FOCUS_LIVE,
                data: result && result.data
            })
        }
        return result && result.data && result.data.isFollow
    }
};

export function liveInfo (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/Info',
            body: {
                liveId, 
            },
            method: 'GET',
        });
        if(result && result.data) {
            dispatch({
                type: INIT_LIVE_INFO,
                data: result && result.data
            })
        }
        return result && result.data
    }
};

/**
 * 删除话题
 * @param {*} topicId
 */
export function hideTopic (topicId, display) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/hide-topic',
            method: 'POST',
            body: {
                topicId,
                status: display
            }
        })

        return result;
    }
}

export function getChannelNumAndTopicNum (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getChannelNumAndTopicNum',
            body: {
                liveId, 
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: CHANNEL_AND_TOPIC_NUM,
                data: result && result.data
            })
        }
        return result && result.data
    }
};

export function getPower (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/power',
            body: {
                liveId, 
            },
            method: 'GET',
        });
        if(result && result.data) {
            dispatch({
                type: INIT_POWER,
                data: result && result.data && result.data.powerEntity
            })
        }
        return result && result.data && result.data.powerEntity
    }
};


export function getNewLikeNum (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getNewLikeNum',
            body: {
                liveId, 
            },
            method: 'POST',
        });
        return result && result.data && result.data.likeNum
    }
};


export function liveGetQr(liveId, channel, showQl) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/get-qr',
            body: {
                liveId, 
                channel,
                showQl,
            }
        });

        return result && result.data && result.data.qrUrl;
    };
}

export function fetchGetQr(channel, liveId, channelId, topicId ,toUserId, showQl) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/get-qr',
            body: {
                channel, 
                liveId, 
                channelId, 
                topicId ,
                toUserId,
                showQl,
            }
        });

        return result;
    };
}
export function liveBanned(bannedUserId, isEnable, liveId, userId ) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/banned',
            body: {
                bannedUserId,
                isEnable, 
                liveId, 
                userId 
            }
        });

        return result;
    };
}


export function initRelaNameInfo(realStatus,power){
    return {
        type: INIT_LIVE_REALNAME,
        realStatus,
        // realNameInfo,
        power,
    }
}

export function saveRelaNameInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/saveRealName',
            body: {...params},
            method: "POST",
        });

        return result;
    };
}
// 最新保存用户信息
export function saveRealNameUser(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/saveUser',
            body: {...params},
            method: "POST",
        });

        return result;
    };
}

/**
 * 获取旧版实名验证已经提交的认证信息
 * @param {Object} params 
 */
export function getRealNameInfo(params){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading:true,
            url: '/api/wechat/live/getRealNameInfo',
            body: {...params},
        });

        return result;
    };
}

/**
 * 查询旧版实名验证的认证状态
 * @param {String} liveId 直播间id
 * @param {String} type
 */
export function getRealStatus(liveId, type) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getRealStatus',
            body: {liveId,type},
        });

        return result;
    };
}

/**
 * 查询新版实名验证的状态
 * @param {Object} params 
 */
export function getCheckUser(params={}){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: true,
            url: '/api/wechat/live/checkUser',
            body: {...params},
        });

        return result;
    };
}

/**
 * 获取新版实名验证已经提交的认证信息
 */
export function getVerifyInfo() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getVerifyInfo',
            body: {},
        });
        return result;
    };
}


export function getLiveSymbol(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getLiveSymbol',
            body: {liveId},
        });

        return result;
    };
}

/* 获取官方直播间列表 */
export function fetchAuthorityList() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method:'GET',
            url: '/api/wechat/live/authorities',
            body: {},
        });

        return result;
    };
}
/**
 * 页面访问统计接口
 * @return {[type]} [description]
 */
export function addPageUv(topicId, liveId, statType, channelNo) {

    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/topic/pageUv',
            body: {
                topicId,
                liveId,
                statType,
                channelNo,
            }
        });
    };
}

export function getTopic (liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getTopic',
            body: {
                liveId, 
                page: {
                    page: page,
                    size: 20
                }
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: LIVE_GET_TOPIC,
                data: result && result.data && result.data.liveTopics
            })
        }
        return result && result.data && result.data.liveTopics
    }
};

// 获取全部则不填tagId
export function getChannel(liveId, page, tagId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getChannel',
            body: {
                liveId, 
                page: {
                    page: page,
                    size: 20
                },
                tagId
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: LIVE_GET_CHANNEL,
                data: result && result.data && result.data.liveChannels
            })
        }
        return result && result.data && result.data.liveChannels
    }
};

/**
 * 保存banner
 * @param {object} data banner数据
 */
export function saveBanner (data) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: true,
            showWarningTips: false,
            method: 'POST',
            url: '/api/wechat/live/saveBanner',
            body: {
                ...data
            }
        });
    }
}

/**
 * 批量保存banner
 * @param {object} data banner数据
 */
export function batchSaveBanner (data) {
    return (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            showLoading: true,
            method: 'POST',
            url: '/api/wechat/live/batchSaveBanner',
            body: {
                ...data
            }
        });
    }
}

/**
 * 设置banner list
 * @param {object} data banner list
 */
export function setBannerList (data) {
    return {
        type: SET_BANNER_LIST,
        data
    }
}

/**
 * 设置vip information
 * @param {*} data 
 */
export function setVipInfo (data) {
    return {
        type: SET_VIP_INFO,
        data,
    }
}

/**
 * 获取系列课列表
 * @param {string} liveId 
 */
export function loadChannelList(liveId, showDisplay) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/getChannelIdList',
            body: { liveId , showDisplay},
            method: 'POST',
        });

        dispatch({
            type: LOAD_BANNER_CHANNEL_LIST,
            data: result && result.data && result.data.courseList  || []
        });
        return result;
    }
}

/**
 * 获取话题列表
 * @param {*} liveId 
 * @param {*} page 
 */
export function loadTopicList(liveId, page, showDisplay) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getTopicList',
            body: { liveId, page ,showDisplay},
            method: 'POST',
        });

        dispatch({
            type: LOAD_BANNER_TOPIC_LIST,
            data: result && result.data && result.data.topicList  || []
        });

        return result && result.data;
    }
}

/**
 * 获取轮播图列表
 * @param {*} liveId 
 */
export function getLiveBannerList (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/bannerList',
            showLoading: false,
            body: {
                liveId
            }
        });
    }
}

export function initBannerList (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/bannerList',
            showLoading: false,
            body: {
                liveId
            }
        });
        if (result && result.data) {
            dispatch(setBannerList(result.data.LiveBanners));
            
        }
        return result
    }
}

export function initLiveSymbolList (liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/getLiveSymbol',
            showLoading: false,
            body: {
                liveId
            }
        });
        if (result && result.data) {
            dispatch(initLiveSymbol(result.data.symbolList));
        }
    }
}

export function getLiveIntroPhoto(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getLiveIntro',
            body: { liveId },
            method: 'POST',
        });

        dispatch({
            type: GET_LIVE_INTRO_PHOTO_LIST,
            data: result && result.data && result.data.profileList  || []
        });

        return result && result.data;
    }
}

export function liveSetAlert(liveId, status) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/alert',
            body: { liveId, status },
            method: 'POST',
        });

        if (result && result.data) {
            dispatch({
                type: LIVE_SET_ALERT,
                data: result && result.data && result.data.isAlert
            });
        }

        return result && result.data && result.data.isAlert;
    }
}

export function liveAlert(liveId, status) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/alert',
            body: { liveId, status },
            method: 'POST',
        });
        return result && result.data;
    }
}

export function liveGetSubscribeInfo(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/isSubscribe',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data) {
            dispatch({
                type: SET_LIVE_FOCUS_STATES,
                data: result && result.data
            });
        }

        return result && result.data;
    }
}

export function liveGetFollowInfo(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/isFollow',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data) {
            dispatch({
                type: SET_LIVE_FOCUS_STATES,
                data: result && result.data 
            });
        }

        return result && result.data;
    }
}

export function liveGetFollowNum(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/followNum',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data && result.data.follwerNum) {
            dispatch({
                type: LIVE_SET_FOLLOW_NUM,
                data: result && result.data.follwerNum
            });
        }

        return result && result.data;
    }
}


export function getLiveInfo(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/Info',
            body: { liveId },
            method: 'GET',
        });

        if (result && result.data) {
            dispatch(initLiveInfo(result.data))
        }

        return result && result.data;
    }
}


export function initLiveShareQualify(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/shareQualify',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data && result.data.shareQualify) {
            dispatch(initShareQuality(result.data.shareQualify))
        }

        return result && result.data;
    }
}

export function bindLiveShare(liveId, shareKey) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/bindLiveShare',
            body: { liveId, shareKey },
            method: 'POST',
        });

        return result && result.data;
    }
}

//添加课代表
export function saveAddDistributionLive(shareEarningPercent, shareNum, businessId, beInviterDay = '') {
    return async(dispatch, getStore) => {
         const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/share/distribution/add',
            body: {
                shareEarningPercent,
                shareNum,
                type: 'live',
                businessId,
                beInviterDay
            },
            method: "POST",
        });

        return result;
    }
}

export function userBindKaiFang(kfAppId, kfOpenId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/userBindKaiFang',
            body: { kfAppId, kfOpenId },
            method: 'POST',
        });

        return result && result.data;
    }
}

export function getUserInfo(userId) {
    var params = {};
    if (userId) {
        params.userId = userId;
    };
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/info',
            body: params,
        });
        return result.data
    }
}

/**
 * 话题移动到系列课
 * @param {*} topicId 
 * @param {*} channelId 
 */
export function moveIntoChannel (topicId, channelId) {
    return api({
        url: '/api/wechat/live/mvToChannel',
        method: 'POST',
        body: {
            topicId,
            channelId,
        }
    });
}

/**
 * 结束话题
 * @param {*} topicId 
 */
export function finishTopic (topicId) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/end-topic',
            method: 'GET',
            body: {
                topicId
            }
        })
    }
}

/**
 * 删除话题
 * @param {*} topicId 
 */
export function deleteTopic (topicId) {
    return async (dispatch, getStore) => {
        return api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/delete-topic',
            method: 'GET',
            body: {
                topicId
            }
        })
    }
}

/**
 * 切换直播类型
 * @param {*} topicId 
 */
export function changeTopicType (topicId, isKeep, money) {
    return api({
        url: '/api/wechat/topic/convertTopic',
        method: 'POST',
        body: {
            topicId,
            isKeep,
            money,
        }
    })
    
}

/**
 * 获取推送数据
 * @param {*} topicId 
 */
export function getPushNum (liveId, topicId) {
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/live/pushNum',
            method: 'POST',
            body: {
                liveId,
                topicId,
            }
        })

        dispatch({
            type: INIT_PUSH_NUM,
            data: {
                topicId,
                pushNum: result.data.todayPushNum,
                pushMaxNum: result.data.pushMaxNum,
            }
        });

        return result.data;
    }
}

/**
 * 更新话题列表
 * @param {*} topicItem 
 */
export function updateTopic (topicItem) {
    return {
        type: UPDATE_LIVE_TOPIC_LIST,
        topicItem,
    }
}

/**
 * 更新话题列表
 * @param {*} topicItem 
 */
export function removeTopic (topicItem) {
    return {
        type: REMOVE_LIVE_TOPIC_ITEM,
        topicItem,
    }
}

/**
 * 隐藏/显示系列课
 * @param {*} channelId 
 * @param {*} tagId 系列课所属类别
 * @param {*} display 是否隐藏Y/N
 */
export function displayChannel (channelId, tagId, display) {
    return api({
        url: '/api/wechat/channel/changeDisplay',
        method: 'POST',
        body: {
            channelId,
            tagId,
            display
        }
    });
}

/**
 * 将系列课移入分类
 * @param {*} channelId 
 * @param {*} tagId 系列课所属类别
 * @param {*} display 是否隐藏Y/N
 */
export function moveChannelIntoTag (channelId, tagId) {
    return api({
        url: '/api/wechat/live/moveChannelIntoTag',
        method: 'POST',
        body: {
            channelId,
            tagId,
        }
    });
}

/**
 * 删除channel
 * @param {*} channelId 
 */
export function deleteChannel (channelId) {
    return api({
        url: '/api/wechat/channel/delete',
        method: 'POST',
        body: {
            channelId
        }
    })
}

// /**
//  * 内测直播间列表
//  * @param {*} channelId 
//  */
// export function getWhiteForNewLiveIndex () {
//     return api({
//         url: '/api/wechat/live/getWhiteForNewLiveIndex',
//         method: 'POST',
//         body: {}
//     })
// }

/**
 * 更新列表中的系列课
 * @param {*} channelItem 
 */
export function updateChannel (channelItem) {
    return {
        type: UPDATE_LIVE_CHANNEL_LIST,
        channelItem
    }
}

/**
 * 移除列表中的系列课
 * @param {*} channelItem 
 */
export function removeChannel (channelItem) {
    return {
        type: REMOVE_LIVE_CHANNEL_ITEM,
        channelItem
    }
}

/**
 * 是否隐藏功能菜单
 * @param {*} showMenuStatus 
 */
export function toggleDisplayMenu (liveId, showMenuStatus) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/live/funcMenuShow',
            body: {
                liveId,
                funcMenuShow: showMenuStatus,
            }
        });

        if (result.state.code == 0) {
            dispatch({
                type: TOGGLE_DISPLAY_MENU,
                showMenuStatus
            });
        }
    }
}

export function isLiveAdmin(liveId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/studio/is-live-admin',
            body: {
                liveId,
            }
        });

        return result
    }
    
}

export function isHaveMediaProfit(liveId){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/selfmedia/isHaveMediaProfit',
            body: {
                liveId,
            }
        });

        return result
    }
}

// 获取直播间的引流配置
export function getGuideQrSetting(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/getGuideQrSetting',
            body: {
                liveId
            }
        })
        return result;
    }
}

// 是否畅听直播间
export function getIsOrNotListen(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/isOrNotListen',
            body: {
                ...params
            }
        })
        return result;
    }
}


// 获取直播间标签列表
export function getLiveTag() {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'GET',
            url: '/api/wechat/getLiveTag',
        })
        return result;
    }
}

// 获取直播间授权信息
export function getAuthInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/getAuthInfo',
            body: {
                ...params
            }
        })
        return result;
    }
}
// 获取验证码
export function getIdentifyingCode(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/auth/getCode',
            body: {
                ...params
            }
        })
        return result;
    }
}

// 校验验证码
export function identityValidCode(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/auth/validCode',
            body: {
                ...params
            }
        })
        return result;
    }
}

// 保存信息
export function saveAuthInfo(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/auth/save',
            body: {
                ...params
            }
        })
        return result;
    }
}

// 创建直播间
export function createLive(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/create',
            body: {
                ...params
            }
        })
        return result;
    }
}

export function invitationCreate (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/addLiveAdminDate',
            body: {
                ...params
            }
        })
        return result;
    }
}

export function getVipInfo (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/getVipInfo',
            body: {
                ...params
            }
        })
        return result;
    }
}

export function updateVipStatus (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/updateVipStatus',
            body: {
                ...params
            }
        })
        return result;
    }
}

export function saveVipCharge (params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/live/saveVipCharge',
            body: {
                ...params
            }
        })
        return result;
    }
}

// 用户每天学是否更新了信息状态
export async function getLearnEverydayNewData(){
    try {
        const res = await api({
            method: 'POST',
            url: '/api/wechat/transfer/h5/live/push/getLearnEverydayNewData',
            body: {}
        })
        if(res.state.code) {
            throw new Error(res.state.msg)
        }
        return res.data && res.data.status || 'N'
    } catch(err){
        console.error(err)
        return 'N'
    }
}