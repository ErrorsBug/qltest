export const VerificationCode = {
    path: 'mine/verification-vode',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/verification-code'))
        })
    }
  };