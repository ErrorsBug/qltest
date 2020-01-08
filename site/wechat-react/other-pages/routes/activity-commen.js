export const activityGift = {
    path: 'activity-gift',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/activity-gift'));
        });
    }
};

export const activityAddress = {
    path: 'activity-address',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/activity-address'));
        });
    }
};

