export const SmsProtocolPage = {
    path: 'sms-protocol',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/sms-protocol-page'));
        });
    }
};
