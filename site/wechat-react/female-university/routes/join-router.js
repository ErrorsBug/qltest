export const JoinUniversity = {
    path: 'join-university',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/join-university'))
        })
    }
};
export const JoinUniversityCountdown = {
    path: 'join-university-countdown',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/join-university-countdown/join-university-countdown'))
        })
    }
};
export const JoinUniversitySuccess = {
    path: 'join-university-success',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/join-university-countdown/join-university-success'))
        })
    }
};
export const JoinUniversityCourses = {
    path: 'join-university-courses',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/join-university-courses'))
        })
    }
};

// 学院介绍简介
export const CollegesIntro = {
    path: 'university-colleges-intro',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/join-university/colleges-intro'))
        })
    }
};

 
// 统计页
export const StatisticalTable = {
    path: 'statistical-table',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/statistical-table'))
        })
    }
};

// 活动链接
export const ActivityUrl = {
    path: 'university-activity-url',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/activity-url'))
        })
    }
};

// 组合购活动
export const ComposeActivity = {
    path: 'compose-activity',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/compose-activity'))
        })
    }
};

// app支付新体验成功页面
export const UniversityExperienceSuccess = {
    path: 'university-experience-success',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/university-experience-success'))
        })
    }
}

// 电子书
export const EBook = {
    path: 'university-ebook',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/ebook'))
        })
    }
}

// 电子相册
export const EAlbums = {
    path: 'university-albums',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/e-albums'))
        })
    }
}
