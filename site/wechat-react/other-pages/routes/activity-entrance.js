export const ActivityEntrance = {
    path: 'activity-entrance',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/activity-entrance'))
        })
    }
}

export const CreateLiveAdvSuccess = {
    path: 'create-live-adv-success',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/create-live-adv-success'))
        })
    }
}