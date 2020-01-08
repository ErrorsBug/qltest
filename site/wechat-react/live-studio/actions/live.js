import { api } from './common';
import dayjs from 'dayjs'
export const INIT_LIVE_INFO = 'INIT_LIVE_INFO';
export const INIT_LIVE_REALNAME = 'INIT_LIVE_REALNAME';

export const INIT_LIVE_SYMBOL = 'INIT_LIVE_SYMBOL'
export const INIT_POWER = 'INIT_POWER'
export const INIT_LIVE_TIMELINE = 'INIT_LIVE_TIMELINE'
export const INIT_LIVE_FOCUS_STATES = 'INIT_LIVE_FOCUS_STATES'
export const SET_PURCHASED_COURSE_LIST = 'SET_PURCHASED_COURSE_LIST'
export const SET_PREVIEW_COURSE_LIST = 'SET_PREVIEW_COURSE_LIST'

export const GET_USER_INFO = 'GET_USER_INFO'

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
export const LIVE_GET_TRAINING = 'LIVE_GET_TRAINING'
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
export const GET_LIVE_MIDDLE_PAGE_COURSE = 'GET_LIVE_MIDDLE_PAGE_COURSE';

export const INIT_SHARE_QUALITY = 'INIT_SHARE_QUALITY'
export const CLEAN_LIVE_TIMELINE = 'CLEAN_LIVE_TIMELINE'
export const SET_TOPIC_HIDDEN = 'SET_TOPIC_HIDDEN'

export const SET_OPERATION_TYPE = 'SET_OPERATION_TYPE'
export const SET_ALTERNATIVE_CHANNEL = 'SET_ALTERNATIVE_CHANNEL'
export const SET_PROMOTIONAL_CHANNEL = 'SET_PROMOTIONAL_CHANNEL'

export const GET_USER_ATTENTION_STATE = 'GET_USER_ATTENTION_STATE';
export const GET_CUSTOM_LIVEFUNCIONS = 'GET_CUSTOM_LIVEFUNCIONS';

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

export function initExtendData (data) {
    return {
        type: INIT_EXTEND_DATA,
        data
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


export function liveFocus (status, liveId, auditStatus) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/follow',
            body: {
                status,
                liveId,
                auditStatus
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

export function getRealStatus(liveId,type) {
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

export function getCheckUser(params={}){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/checkUser',
            body: {...params},
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

export function getTopic (liveId, page, tagId, paginate = true) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/live/getTopic',
            body: {
                liveId,
                showDisplay: 'N',   // 是否显示要隐藏的单课
                tagId,
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
                data: result && result.data && result.data.liveTopics,
                paginate
            })
        }
        return result && result.data && result.data.liveTopics
    }
};

// 获取全部则不填tagId  isCamp为N就是只拿系列课，不传就拿全部
export function getChannel(liveId, page, tagId, isCamp = '', paginate = true) {
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
                tagId,
                isCamp,
                showDisplay: 'N', // 是否显示已经隐藏掉的系列课
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: LIVE_GET_CHANNEL,
                data: result && result.data && result.data.liveChannels,
                paginate
            })
        }
        return result && result.data && result.data.liveChannels
    }
};

// 获取全部则不填tagId  isCamp为N就是只拿系列课，不传就拿全部
export function getTraining(liveId, page, tagId, paginate = true) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/transfer/h5/camp/new/listCamp',
            body: {
                liveId,
                page: {
                    page: page,
                    size: 20
                },
                tagId,
                showDisplay: 'N', // 是否显示已经隐藏掉的系列课
            },
            method: 'POST',
        });
        if(result && result.data) {
            dispatch({
                type: LIVE_GET_TRAINING,
                data: result && result.data && result.data.dataList,
                paginate
            })
        }
        return result && result.data && result.data.dataList
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
export function loadChannelList(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/channel/getChannelIdList',
            body: { liveId },
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
export function loadTopicList(liveId, page) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/timeline/getTopicList',
            body: { liveId, page },
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

// 直播间用户关注状态
export function liveGetLiveUserAttentionState(liveId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/transfer/h5/live/revonsitution/getLiveUserAttentionState',
            body: { liveId },
            method: 'POST',
        });

        if (result && result.data) {
            dispatch({
                type: GET_USER_ATTENTION_STATE,
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

export function getUserInfo(userId,targetId) {
    var params = {};
    if (userId) {
        params.userId = userId;
    };
    if(targetId){
        params.targetUserId = targetId
    }
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/wechat/user/info',
            body: params,
        });
        dispatch({
            type: GET_USER_INFO,
            data: result.data.user
        })

        return result.data;
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

        if (result.state.code == 0) {
            dispatch({
                type: SET_TOPIC_HIDDEN,
                topicId,
                display,
            })
        }

        return result;
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
        showLoading: true,
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

/**
 * 隐藏话题
 * @param {*} showMenuStatus
 */
export function toggleTopicDisplay (topicId, status) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/changeTopicDisplay',
            body: {
                topicId,
                status
            }
        });

        if (result.state.code == 0) {
            // dispatch({
            //     type: TOGGLE_DISPLAY_MENU,
            //     showMenuStatus
            // });
        }
    }
}

/**
 * 获取直播间升级的价格信息
 */
export function getLivePrice(){
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/mediaPrice',
        });
        return result;
    }
}

export function setOperationType(operationType){
    return {
        type: SET_OPERATION_TYPE,
        operationType
    }
}

export function setAlternativeChannel(channel){
    return {
        type: SET_ALTERNATIVE_CHANNEL,
        channel
    }
}

export function setPromotionalChannel(channel){
    return {
        type: SET_PROMOTIONAL_CHANNEL,
        channel
    }
}

// 获取当前登录用户的直播间信息
export function getMyLive() {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			showLoading: false,
			url: '/api/wechat/live/mine',
			body: {}
        });
        
		return result;
	};
}

// 创建系列课
export async function addChannel(params) {
    const result = await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/live/addOrUpdateChannel',
        body: params
    });
    
    return result;
}

// 初始化系列课信息
export async function getChannelInfo (channelId) {
    const result = await api({
        url: '/api/wechat/channel/getChannelInfo',
        body: {
            channelId
        }
    });
    return result;
};

// 获取直播间系列课分类
export async function getChannelTags (params){
    const result = await api({
        method: 'POST',
        url: '/api/wechat/live/getChannelTags',
        body: params
    })
    return result;
}

//新建系列课分类
export async function setChannelTag (params){
    const result = await api({
        method: 'POST',
        url: '/api/wechat/live/addOrEditChannelTag',
        body: params
    })
    return result;
}

//创建话题
export function createNewTopic (topic) {
    return async (dispatch, getStore) => {
        topic.startTime = dayjs(topic.startTime).format('YYYY-MM-DD HH:mm:ss');
        topic.endTime && (topic.endTime = dayjs(topic.endTime).format('YYYY-MM-DD HH:mm:ss'));
        topic.topicId = topic.id;
        const result = await api({
            showLoading: false,
            url: '/api/wechat/topic/update',
            method: 'POST',
            body: topic
        })
        
        return result;
    }
}

export async function getEditorSummary(businessId, type){
    const result = await api({
        showLoading: false,
        showWarningTips: false,
        url: '/api/wechat/ueditor/getSummary', 
        body: { 
            businessId,
            type
            },
        method: 'POST',
    });

    if (result.state.code == 0) {
        return result
    }
}

// 获取直播间中间页课程用于导粉
export function getLiveMiddlepageCourse(liveId){
    return async (dispatch, getStore) => {
        const result = await api({
            url: '/api/wechat/live/getLiveMiddlepageCourse', 
            body: { 
                liveId
            },
            method: 'POST',
        });

        if (result.state.code == 0) {
            dispatch({
                type: GET_LIVE_MIDDLE_PAGE_COURSE,
                data: result.data
            })

            return result.data
        }
    }
}

// 获取动态剩余推送次数
export async function restPushTimes(type, businessId){
    return await api({
        showLoading: false,
        url: '/api/wechat/timeline/restPushTimes', 
        body: { type, businessId},
        method: 'POST',
    });
}

// 判断该系列课是否为转载课
export async function channelIsRelay(params){
    return await api({
        showLoading: false,
        url: '/api/wechat/channel/isRelay', 
        body: params,
    });
}

// 获取系列课或者话题的待优化点状态
export async function getChannelOrTopicOptimize (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/dataSat/getChannelOrTopicOptimize',
        body: params,
        method: 'POST',
    });
};

// 获取app推送信息
export async function appPushInfo (params) { 
    return await api({
        url: '/api/wechat/channel/appPushInfo', 
        body: params,
        method: 'POST',
    }); 
};

/**
 * 推送合集
 * @param {*} type 类型(channel,topic,camp)
 * @param {*} businessId 类型对应的id(channelId,topicId,campId)
 */
export async function allPushInfo(type, businessId){
    // 系列课推送
    if(type === 'channel'){
        return await api({
            url: '/api/wechat/channel/getPushInfo', 
            body: {channelId: businessId},
            method: 'POST',
        });
    // 话题推送
    }else if(type === 'topic'){
        return await api({
            url: '/api/wechat/topic/getPushInfo', 
            body: {topicId: businessId},
            method: 'POST',
        });
    // 训练营推送
    }else if (type === 'camp'){
        return await api({
            url: '/api/wechat/checkInCamp/pushInfo', 
            body: {campId: businessId},
            method: 'POST',
        });
    }else {
        window.toast('未传入正确的类型！')
        return
    }
}

// 发送邀请-直播间管理员
export async function sendLiveShare (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/live/sendInvite',
        body: params,
        method: 'POST',
    });
};

// 接受邀请-直播间管理员
export async function getLiveShare (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/live/getInvite',
        body: params,
        method: 'POST',
    });
};

// 获取公众号信息
export async function getQrInfo (params) {
    return await api({
        showLoading: false,
        url: '/api/wechat/get-qrcode',
        body: params,
        method: 'GET',
    });
};
// 获取公众号是否关注
export const getAppIdByType = async (params) => {
    const result = await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/user/getAppIdByType',
        body: params
    })
    return result;
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

// 获取自定义功能列表
export function getCustomLiveFunctions(params) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/transfer/h5/live/selfDefine/modules/list',
            body: {
                ...params
            }
        })
        if(result.state.code === 0) {
            dispatch({
                type: GET_CUSTOM_LIVEFUNCIONS,
                payload: result.data.config && result.data.config.adminFunctionConfigDtoList
            })
        }
        return result;
    }
}
