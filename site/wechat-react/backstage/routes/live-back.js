/**
 * Created by dylanssg on 2017/10/20.
 */
export const LiveBack = {
	path: 'backstage',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/live-back'));
		});
	}
};

export const LiveChange = {
	path: 'live-change',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/live-change'));
		});
	}
}

export const AuthDistribute = {
	path: 'auth-distribute',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/auth-distribute'));
		});
	}
}