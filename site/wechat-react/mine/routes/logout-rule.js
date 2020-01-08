export const LogOutRule = {
    path: 'mine/logout-rule',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/logout-rule'))
        })
    }
  };