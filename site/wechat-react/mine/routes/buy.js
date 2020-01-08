export const BuyHistory = {
  path: 'mine/buy',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/buy-history'))
      })
  }
};