/**
 * Created by dylanssg on 2017/10/20.
 */
export const Performance = {
	path: 'coral/performance',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/performance'));
		});
	}
};

export const History = {
	path: 'coral/performance/history',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/performance/history'));
		});
	}
};

export const PerformanceDetails = {
	path: 'coral/performance/details',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/performance/details'));
		});
	}
};

