// 回收站
export const Recycle = {
	path: 'recycle',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/recycle').default);
		});
	}
};
