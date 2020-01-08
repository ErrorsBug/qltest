// 首页
export const UniversityHome = {
    path: 'university/home',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/university-home'))
        })
    }
};

// 学习营列表
export const LearningCamp = {
    path: 'university/learning-camp',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/learning-camp'))
        })
    }
};

// 其他学习营列表
export const LearningCampOther = {
    path: 'university/learning-camp-other',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/learning-camp/other'))
        })
    }
};
// 学习营详情
export const CampIntro = {
    path: 'university/camp-intro',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/camp-intro'))
        })
    }
};

// 班级信息
export const ClassInfo = {
    path: 'university/class-info',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/class-info'))
        })
    }
};
// 班级信息
export const ClassInfoCode = {
    path: 'university/class-info-code',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/class-info-code'))
        })
    }
};

// 个人档案
export const MyFile = {
    path: 'university/my-file',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-file'))
        })
    }
};

// 大学必修课
export const CompulsoryList = {
    path: 'university/compulsory-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/compulsory-list'))
        })
    }
};

// 听书列表
export const BooksList = {
    path: 'university/books-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/books-list'))
        })
    }
};

// 学院详情
export const CollegeDetail = {
    path: 'university/college-detail',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/college-detail'))
        })
    }
};

// 导师列表
export const TutorList = {
    path: 'university/tutor-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/tutor-list'))
        })
    }
};

// 邀请卡
export const InvitationCard = {
    path: 'university/invitation-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/invitation-card'))
        })
    }
};


// 提现
export const Withdraw = {
    path: 'university/withdraw',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/withdraw'))
        })
    }
};
// 邀请明细
export const InviteDetail = {
    path: 'university/invite-detail',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/invite-detail'))
        })
    }
};

// 我的课单
export const MyCourseList = {
    path: 'university/my-course-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/my-course-list'))
        })
    }
};

// 通知书
export const NoticeCard = {
    path: 'university/notice-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/notice-card'))
        })
    }
};


// 班级二维码
export const ClassCode = {
    path: 'university/class-code',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/class-code'))
        })
    }
};

//热门排行
export const TopRanking = {
    path: 'university/top-ranking',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/top-ranking'))
        })
    }
};
 

// 二维码
export const ShowQrcode = {
    path: 'university/show-qrcode',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/show-qrcode'))
        })
    }
};

// 人气实时榜单
export const PopularityRank = {
    path: 'university/popularity-rank',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/popularity-rank'))
        })
    }
};

// 打卡日历
export const OpenCalendar = {
    path: 'university/open-calendar',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/open-calendar'))
        })
    }
};


