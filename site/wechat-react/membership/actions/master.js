import { api } from 'common_actions/common';

// 获取大师课标签
export function getQualityTag() {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/qualityTag',
            method: 'POST',
            body: {},
            showLoading: false
        });

        if (res.state.code === 0) {
            return res.data.tags || []
        }
        return [];
    };
}

// 获取大师课列表
export function getQualityCourse(params) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/qualityCourse',
            method: 'POST',
            body: params,
        });

        if (res.state.code === 0) {
            return res.data || {}
        }
        return {}
    };
}

// 选择课程
export function selectCourse(courseList) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/selectCourse',
            method: 'POST',
            body: {
                courseList
            },
        });

        return res
    };
}

// 获取会员体验卡列表
export function getTrialCards() {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/trialCard',
            method: 'POST',
            body: {},
        });

        if (res.state.code === 0) {
            return res.data.cards || []
        }
        return [];
    };
}

// 领取体验会员
export function receiveMember(memberId) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/receiveMember',
            method: 'POST',
            body: {memberId},
        });

        return res
    };
}

// 获取课程信息
export function getCourseInfo(params) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/getCourseInfo',
            method: 'POST',
            body: params,
        });

        if (res.state.code === 0) {
            return res.data
        }
        
        return null;
    };
}

// 获取课程话题列表
export function getCourseTopicList(params) {
    return async (dispatch, getStore) => {
        const res = await api({
            dispatch,
            getStore,
            url: '/api/wechat/member/getCourseTopicList',
            method: 'POST',
            body: params,
        });

        if (res.state.code === 0) {
            return res.data.topicList
        }
        
        return [];
    };
}

// 获取直播地址
export function fetchMediaUrl(topicId, sourceTopicId) {
    const params = {
        topicId
    }
    if (sourceTopicId && sourceTopicId !== topicId) {
        params.topicId = sourceTopicId
        params.relayTopicId = topicId
    }
    return async (dispatch, getStore) => {
        let result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/topic/media-url',
            method: 'GET',
            showLoading: false,
            body: params
        })

        return result;
    };
};