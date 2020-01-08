// 回收站
export const UserManager = {
	path: 'userManager/:liveId',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/userManager').default);
		});
	}
};
