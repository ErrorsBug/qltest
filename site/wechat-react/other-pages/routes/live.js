export const LiveAuth = {
    path: 'live-auth',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/live-auth'));
        });
    }
};
export const LiveProtocol = {
    path: 'live-protocol',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/live-protocol-page'));
        });
    }
};

export const RealName = {
    path: 'real-name',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/real-name'));
        });
    }
};

/* 报名列表*/
export const joinList = {
    path: 'join-list/:type',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/join-list'));
        });
    }
};

/* 推送课程或系列课 */
export const coursePush = {
    path: 'course/push/:type/:id',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/course-push'));
        });
    }
};


/* 新直播间动态页 */
export const liveTimeline = {
    path: 'live/timeline/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-timeline'));
        });
    }
};

/* 新直播间课程 */
export const liveCourseTable = {
    path: 'live/courseTable/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-course'));
        });
    }
};

/* 新直播间问答 */
export const liveQuestion = {
    path: 'live/question/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-question'));
        });
    }
};

/* 新直播间VIP */
export const liveVip = {
    path: 'live/vip/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-vip'));
        });
    }
};

/* 直播间会员列表 */
export const liveVipList = {
    path: 'live-vip',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip'));
        });
    }
};

/* 直播间会员详情 */
export const liveVipDetails = {
    path: 'live-vip-details',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip-details'));
        });
    }
};

export const liveVipSetting = {
    path: 'live-vip-setting',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip-setting'));
        })
    }
}

/* 直播间会员设置选择页 */
export const liveVipSettingTypes = {
    path: 'live-vip-setting-types',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip-setting-types'));
        });
    }
};

/* 直播间会员设置选择页 */
export const liveVipIncome = {
    path: 'live-vip-income',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip-income'));
        });
    }
};

/* 直播间会员赠礼详情页 */
export const vipGiftDetails = {
    path: 'vip-gift-details',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-vip-gift-details').default);
        });
    }
};

/* 新直播间Banner管理列表 */
export const liveBannerList = {
    path: 'live/banner/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/banner-list'));
        });
    }
};


/* 新直播间编辑单个Banner */
export const liveBannerEditor = {
    path: 'live-banner-editor',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/banner-editor'));
        });
    }
};

/* 话题系列课选择 */
export const liveBannerTopicChannel = {
    path: 'live-topic-channel-selector',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/topic-channel-selector'));
        });
    }
};

/** 关注页面 */
export const focusQl = {
    path: 'focus-ql',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            console.log('object');
            callback(null, require('../containers/focus-ql'));
        });
    }
}

/* 介绍编辑页，暂支持通用vip */
export const EditDesc = {
    path: 'edit-desc',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/edit-desc'));
        });
    }
};


/* 创建直播间成功 */
export const CreateLiveSuccess = {
    path: 'create-live-success',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/create-live-success'));
        });
    }
};

export const CreateLive = {
    path: 'create-live',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/create-live'));
        });
    }
};
// b端报名成功跳转页面
export const CourseRegistrySuccess = {
    path: 'course-registry-success',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/course-registry-success'));
        })
    }
}

export const CommunityQrcode = {
    path: 'community-qrcode',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/community-qrcode'));
        })
    }
}

export const learnEveryday = {
    path: '/wechat/page/learn-everyday',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/learn-everyday').default);
        });
    }
}

export const CourseSortPage = {
    path: 'course-sort',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/sort-page'));
        });
    }
}
