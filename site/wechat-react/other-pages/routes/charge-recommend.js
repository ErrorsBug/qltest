
export default {
    path: 'charge-recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/charge-recommend'));
        });
    }
};
