export const Cut = {
    path: 'cut-price',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/cut'));
        });
    }
};