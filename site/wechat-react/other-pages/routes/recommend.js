
export const Recommend = {
    path: 'recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/recommend'));
        });
    }
};
export const FreeRecommend = {
    path: 'free-recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/free-recommend'));
        });
    }
};
export const ChargeRecommend = {
    path: 'charge-recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/charge-recommend'));
        });
    }
};
export const LowPriceRecommend = {
    path: 'low-price-recommend',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/low-price-recommend'));
        });
    }
}

export const HotTagList = {
    path: 'hot-tag-list/:tagId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/recommend/hot-tag-list').default);
        });
    }
}

export const RecommendViewMore = {
	path: 'recommend/view-more',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/recommend/view-more'));
		});
	}
}

export const ChooseUserTag = {
	path: 'recommend/user-like',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/choose-user-tag'));
		});
	}
}
export const KnowledgeNews = {
    path: 'knowledge-news',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/news-lists'));
		});
	}
}
