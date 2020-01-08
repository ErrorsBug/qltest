
export default {
    path: 'my-shares',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/my-shares'));
        });
    }
};
