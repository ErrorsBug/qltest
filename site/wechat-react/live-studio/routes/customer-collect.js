export const customerCollect = {
    path: 'live-studio/service-form/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/customer-collect').default);
        });
    }
};

