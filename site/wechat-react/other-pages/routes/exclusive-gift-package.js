export const ExclusiveGiftPackage = {
    path: 'exclusive-gift-package',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/exclusive-gift-package'));
        });
    }
};