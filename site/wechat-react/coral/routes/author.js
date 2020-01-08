export const Author = {
    path: 'coral/author',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/author'));
        });
    }
};