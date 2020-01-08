export const activeValue = {
    path: 'active-value',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/active-value'));
        });
    }
};

export const promoteActiveValue = {
    path: 'active-value/promote',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/active-value/promote-active-value'));
        });
    }
};

