/**
 * Created by dylanssg on 2018/3/5.
 */
export const Pay = {
	path: 'common-pay',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/pay'));
		});
	}
};
