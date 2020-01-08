
export const FissionFinishPay = {
    path: '/wechat/page/fission-finish-pay',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/fission-pay-success'))
        })
    }
};
