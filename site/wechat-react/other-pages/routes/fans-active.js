export const FansActive = {
    path: 'fans-active',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/fans-active'));
        });
    }
};
export const FansExpress = {
    path: 'fans-express',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/fans-express'));
        });
    }
};
