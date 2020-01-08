/**
 * Created by dylanssg on 2017/10/24.
 */
export const Association = {
	path: 'coral/association',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/association'));
		});
	}
};

export const Potential = {
	path: 'coral/association/potential',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/association/potential'));
		});
	}
};

export const AssociationList = {
	path: 'coral/association/list',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/association/list'));
		});
	}
};