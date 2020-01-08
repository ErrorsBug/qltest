export const ChannelIntro = {
	path: '/wechat/page/channel-intro',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/channel-intro'))
		})
	}
};
export const ChannelSplicingAll = {
	path: '/wechat/page/splicing-all',
	getComponent: function (nextState, callback) {
			require.ensure([], (require) => {
					callback(null, require('../containers/splicing-all'));
			});
	}
}
export const TrainingCampDetails = {
	path: '/wechat/page/training-camp',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/training-camp-details'))
		})
	}
};
export const TrainingCampCertificate = {
	path: '/wechat/page/certificate',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/certificate'))
		})
	}
};