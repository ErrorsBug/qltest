export const WXLogin = {
    path: 'wx-login',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/wx-login'));
        });
    }
};