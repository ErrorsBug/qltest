export const LinkNotFound = {
    path: 'coral/link-not-found',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/link-not-found'));
        });
    }
};