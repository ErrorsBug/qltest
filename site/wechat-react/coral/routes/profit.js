/**
 * Created by dylanssg on 2017/10/20.
 */
export const Profit = {
	path: 'coral/profit',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/profit'));
		});
	}
};

export const Withdraw = {
	path: 'coral/profit/withdraw',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/profit/withdraw'));
		});
	}
};

