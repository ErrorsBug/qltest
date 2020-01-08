export  const PageNotFound =  {
    path: '*',
    component: require('../containers/404')
}

export const LinkNotFound = {
    path: 'link-not-found',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/link-not-found'));
        });
    }
};