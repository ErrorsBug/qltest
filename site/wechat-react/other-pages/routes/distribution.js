/**
 * Created by dylanssg on 2018/1/31.
 */
export const PromoRank = {
	path: 'distribution/promo-rank',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/distribution/promo-rank'));
		});
	}
};

export const Authindex = {
	path: 'distribution/auth-index',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/distribution/auth-index'));
		});
	}
};

//添加课代表页(通用)
export const AuthDistributionAdd = {
    path: 'auth-distribution-add/:businessId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/distribution-add'));
        });
    }
};

export const LiveCenterOptions = {
	path: 'distribution/live-center-options',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/distribution/auth-index/components/live-center-options'));
		});
	}
};

export const LiveDistribution = {
	path: 'distribution/live-distribution',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/distribution/live-distribution'));
		});
	}
};

export const Protocol = {
	path: 'distribution/protocol',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/distribution/protocol'));
		});
	}
};

// 课代表冻结、删除、已领完
export const DistributionPresentException = {
    path: 'distribution/present-exception/:pageType',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/distribution/present-exception'));
        });
    }
};

//推广课代表名额被领取完
export const DistributionPresentNoMore = {
    path: 'distribution/present-nomore/:userId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/distribution/present-nomore'));
        });
    }
};

//课代表推广明细(通用)
export const DistributionRepresentDetailList = {
    path: 'distribution-represent-detail-list/:businessId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-represent-detail-list'));
        });
    }
};
