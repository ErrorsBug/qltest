export const gift = {
    path: 'gift/:type/:giftId',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/gift/detail'));
        });
    }
}

export const giftSuccess = {
    path: 'gift-success/:type',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/gift/success'))
        })
    }
}

export const redEnvelope = {
    path: 'red-envelope',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/red-envelope'))
        })
    }
}

export const redEnvelopeDetail = {
    path: 'red-envelope-detail',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/red-envelope-detail'))
        })
    }
}

export const redEnvelopeIncome = {
    path: 'red-envelope-income',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/red-envelope-income'))
        })
    }
}