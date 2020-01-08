export const TrainingIntro = {
    path: '/wechat/page/training-intro',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-intro'))
        })
    }
}
export const TrainingStudentInfo = {
    path: '/wechat/page/training-student-info',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/student-info'))
        })
    }
}
export const TrainingLearn = {
    path: '/wechat/page/training-learn',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-learn'))
        })
    }
}
export const TrainingClassService = {
    path: '/wechat/page/training/class-service',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-learn/class-service'))
        })
    }
}
export const LearnRecord = {
    path: '/wechat/page/learn-record',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/learn-record'))
        })
    }
}
export const TrainingClass = {
    path: '/wechat/page/training-class',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-class'))
        })
    }
}
export const TrainingDetails = {
    path: '/wechat/page/training-details',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-details'))
        })
    }
}
export const TrainingCheckin = {
    path: '/wechat/page/training-checkin',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-checkin'))
        })
    }
}
export const TrainingCard = {
    path: '/wechat/page/training-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-card'))
        })
    }
}
export const TrainingHomework = {
    path: '/wechat/page/training-homework',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/training/training-homework'))
        })
    }
}