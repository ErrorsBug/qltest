export const GetCouponTopic = {
    path: 'get-coupon-topic/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-topic'));
        });
    }
};

export const GetCouponChannel = {
    path: 'get-coupon-channel/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-channel'));
        });
    }
};

export const GetCouponCamp = {
    path: 'get-coupon-camp/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-camp'));
        });
    }
};

export const GetCouponVip = {
    path: 'get-coupon-vip/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-vip'));
        });
    }
};

export const GetCouponUniversal = {
    path: 'get-coupon-universal/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-universal'));
        });
    }
};

//群发
export const GetCouponTopicBatch = {
    path: 'get-coupon-topic-batch/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-topic'));
        });
    }
};

export const GetCouponChannelBatch = {
    path: 'get-coupon-channel-batch/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-channel'));
        });
    }
};

export const GetCouponCampBatch = {
    path: 'get-coupon-camp-batch/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-camp'));
        });
    }
};

export const GetCouponVipBatch = {
    path: 'get-coupon-vip-batch/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/get-coupon-vip'));
        });
    }
};

// 分享

export const SendCoupon = {
    path: 'send-coupon/:type',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/send-coupon').default);
        });
    }
};

export const CouponList = {
    path: 'coupon-manage/list/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/list').default);
        });
    }
}

export const CouponDetail = {
    path: 'coupon-manage/detail/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/detail').default);
        });
    }
}

export const CouponShare = {
    path: 'coupon-manage/share/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/share').default);
        });
    }
}

export const CouponCreate = {
    path: 'coupon-create/:couponType/:id',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/create').default);
        })
    }
}


export const CouponCard = {
    path: 'coupon-card',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-card'));
        })
    }   
}

export const StaticCoupon = {
    path: 'static-coupon/:topicId',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/static-coupon').default)
        })
    }
}

// 优惠码列表页面
export const CouponCodeList = {
    path: 'coupon-code/list/:type/:id',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/code-list').default);
        });
    }
}

// 优惠码列表搜索页面
export const CouponCodeListSearch = {
    path: 'coupon-code/search/:type/:id',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/code-list/code-search').default);
        });
    }
}

// 优惠码详情页面
export const CouponCodeInfo = {
    path: 'coupon-code/info/:type/:codeId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-b/code-info').default);
        });
    }
}

// 优惠码兑换页面
export const CouponExchange = {
    path: 'coupon-code/exchange/:type/:id',
    getComponent: function (nextState, callback) {
        require.ensure([], require => {
            callback(null, require('../containers/coupon-exchange'));
        })
    }
}
// 优惠码推送中转页
export const CouponTransfer = {
    path: 'coupon-transfer',
    getComponent: function (nextState, callback) {
        require.ensure([], require => {
            callback(null, require('../containers/coupon-transfer'));
        })
    }
}

export const CouponCenter = {
    path: 'coupon-center',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/coupon-center').default);
        })
    }
}

export const MineCoupon = {
	path: 'mine/coupon-list',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/coupon-center').default);
		});
	}
};

export const GrabPlatformCoupon = {
    path: 'grab-platform-coupon',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/platform-coupon-grab').default);
		});
	}
}

export const SendPlatformCoupon = {
    path: 'send-platform-coupon',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/platform-coupon-send').default);
		});
	}
}