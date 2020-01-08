export const Payment = {
  path: 'payment',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/payment'))
      })
  }
};