export const custom = {
    path: 'live-studio/custom/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/custom').default);
        });
    }
};

export const introduction = {
    path: '/topic/live-studio-intro',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/introduction').default);
        });
    }
};

export const introductionNologin = {
    path: 'live-studio/intro-nologin',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/introduction').default);
        });
    }
};

export const mine = {
    path: 'live-studio/mine',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/mine').default);
        });
    },
}

export const liveStudioInfo = {
    path: 'live-studio/info',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-info').default);
        });
    },
}

export const liveInfo = {
    path: 'live/info/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live/live-info').default);
        });
    },
}

export const myQuestion = {
    path: 'live-studio/mine/question/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-question').default);
        });
    },
}

export const myShares = {
    path: 'live-studio/my-shares',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-shares').default);
        });
    },
}

export const myUnevaluated = {
    path: 'live-studio/my-unevaluated',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-unevaluated').default);
        });
    },
}

export const myHomework = {
    path: 'live-studio/my-homework',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-homework').default);
        });
    },
}

export const myJoined = {
    path: 'live-studio/my-joined',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-joined').default);
        });
    },
}

export const liveIndex = {
    path: 'live/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live'));
        });
    }
}

export const ServiceNumberDocking = {
    path: 'service-number-docking',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/service-number-docking').default);
        });
    }
}

export const BEndNoticeCenter = {
    path: 'notice-center',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/b-end-notice-center').default);
        });
    }
}


export const studioLiveContainer = {
    path: '/wechat/page',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/studio-index').default);
        });
},
    childRoutes: [
        mine,
        liveIndex,
    ]
};

export const studioCouponPreview = {
    path: 'live-studio/coupon/preview/:couponId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon/preview').default);
        });
    },
}

export const studioCouponOrder = {
    path: '/wechat/page/studio-coupon-order',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon/order').default);
        });
    },
}

export const moduleCustom = {
    path: 'live-studio/module-custom/:moduleId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/module-custom').default);
        });
    }
}

// 媒体版直播间升级购买页面
export const mediaStudioBuy = {
    path: '/wechat/page/media-studio-buy',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/media-studio/buy').default);
        });
    }
}

// 媒体版直播间升级购买的支付成功页面
export const mediaStudioPaid = {
    path: '/wechat/page/media-studio-paid',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/media-studio/paid').default);
        })
    }
}

export const mediaMarket = {
    path: 'live-studio/media-market',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/media-market').default);
        });
    }
}

// 用户填写联系方式
export const contactInfo = {
    path: 'live-studio/contact-info/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/media-market/contact-info').default);
        });
    }
}

// 媒体推广投放页面
export const mediaPromotion = {
    path: 'live-studio/media-promotion/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/media-market/media-promotion').default);
        });
    }
}

// 打卡列表页面
export const checkinCampList = {
    path: 'live-studio/checkin-camp-list/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/checkin-camp-list').default);
        });
    }
}

// 训练营列表页面
export const trainingList = {
    path: 'live-studio/training-list/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/checkin-camp-list/training').default);
        });
    }
}

// 系列课列表页（迁移）
export const channelList = {
    path: 'live-channel-list/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/checkin-camp-list/training').default);
        });
    }
}

// 话题列表页
export const topicList = {
    path: 'live-topic-list/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/live/topic-list').default);
        });
    }
}

// 高分成活动页面
export const highDivisionActivity = {
    path: 'live-studio/media-market/high-division-activity',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/media-market/high-division-activity').default);
        });
    }
}

// 热销top10课程页面
export const topTenCourse = {
    path: 'live-studio/media-market/top-ten-course',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/media-market/top-ten-course').default);
        });
    }
}

// 特惠专区页面
export const favourableCourse = {
    path: 'live-studio/media-market/favourable-course',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/media-market/favourable-course').default);
        });
    }
}

// 精品课程页面
export const boutiqueCourse = {
    path: 'live-studio/media-market/boutique-course',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/media-market/boutique-course').default);
        });
    }
} 

export const createChannel = {
    path: 'channel-create',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/create-channel').default);
        });
    }
} 

export const createTopic = {
    path: 'topic-create',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/create-topic').default);
        });
    }
} 

export const livePushMessage = {
    path: '/wechat/page/live-push-message',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/live-push-message').default);
        });
    }
}

export const liveRecommend = {
    path: '/wechat/page/live-recommend',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/live-recommend').default);
        });
    }
}

export const liveDataStatistics = {
    path: '/wechat/page/live-data-statistics',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/live-data-statistics').default);
        });
    }
}

export const simulationGroup = {
    path: '/wechat/page/simulation-group',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/live-simulation-group').default);
        });
    }
}

export const promoteMethod = {
    path: '/wechat/page/live-promote-method',
    getComponent: function(nextState, callback){
        require.ensure([], () => {
            callback(null, require('../containers/live-promote-method').default);
        });
    }
}
// 管理员引导分享页
export const ShareGuide = {
    path: 'share-guide',
    getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
        callback(null, require('../containers/guide').default)
      })
    }
};
  
// 管理接受邀请页
export const SendInvitation = {
    path: 'send-invitation-live',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
        callback(null, require('../containers/send-invitation').default)
        })
    }
};



export const TagManage = {
    path: 'live-studio/tag-manage',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/tag-manage').default)
        })
    }
};

export const LiveSetting = {
    path: 'live-setting',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-setting'))
        })
    }
};

export const LiveRelateService = {
    path: 'live-relate-service',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-relate-service'))
        })
    }
};