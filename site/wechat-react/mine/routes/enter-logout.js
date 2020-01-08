export const EnterLogout = {
    path: 'mine/enter-logout',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/enter-logout'))
        })
    }
  };