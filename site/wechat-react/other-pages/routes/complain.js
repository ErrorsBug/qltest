export const ComplainReason = {
    path: 'complain-reason',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/complain-reason'));
        });
    }
};

export const ComplainDetails = {
    path: 'complain-details',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/complain-details'));
        });
    }
};

