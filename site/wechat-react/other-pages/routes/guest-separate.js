export const GuestSeparateListC = {
    path: 'guest-separate/channel-list-c',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/guest-separate/channel-list-c'));
        });
    }
};
export const GuestSeparateListB = {
    path: 'guest-separate/channel-list-b',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/guest-separate/channel-list-b'));
        });
    }
};
export const IncomeDetail = {
    path: 'guest-separate/income-detail/:mtype',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/guest-separate/income-detail'));
        });
    }
};
export const Setting = {
	path: 'guest-separate/setting',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/guest-separate/setting'));
		});
	}
};
export const Invitation = {
	path: 'guest-separate/invitation',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/guest-separate/invitation'));
		});
	}
};
export const Percentplease = {
	path: 'guest-separate/percent-please',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/guest-separate/percent-please'));
		});
	}
};