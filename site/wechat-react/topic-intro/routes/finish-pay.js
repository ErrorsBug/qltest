
export const NewFinishPay = {
    path: '/wechat/page/new-finish-pay',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/new-finish-pay'))
        })
    }
};

export const PaySuccess = {
    path: 'pay-success',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/pay-success'))
        })
    }
};

