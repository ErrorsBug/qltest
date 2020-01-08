export const TopicIntro = {
    path: '/wechat/page/topic-intro',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-intro'));
        });
    }
};

export const TopicIntroEdit = {
    path: '/wechat/page/topic-intro-edit',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-intro-edit'))
        })
    }
}

export const TopicDistributionSet = {
	path: '/wechat/page/topic-distribution-set/:topicId',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/topic-distribution-set'))
		})
	}
}

export const TopicInvite = {
    path: '/wechat/page/topic-invite',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-invite'))
        })
    }
}

export const FriendInvite = {
    path: '/wechat/page/friend-invite',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-invite'))
        })
    }
}