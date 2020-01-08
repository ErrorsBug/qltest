// 个人目标
export const FlagHome = {
    path: 'flag-home',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-home'))
        })
    }
};

// 别人目标
export const FlagOther = {
    path: 'flag-other',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-home/other'))
        })
    }
};

// 制定目标
export const FlagAdd = {
    path: 'university/flag-add',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-add'))
        })
    }
};
 // 目标列表
export const FlagList = {
    path: 'flag-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-list'))
        })
    }
};

 // 等待生效
 export const FlagWait = {
    path: 'university/flag-wait',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-wait'))
        })
    }
};
 
// 补卡
export const FlagRecard = {
    path: 'flag-recard',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-recard'))
        })
    }
};

// 发布打卡动态
export const FlagPublish = {
    path: 'university/flag-publish',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-publish'))
        })
    }
};

// 见证目标
export const FlagShow = {
    path: 'university/flag-show',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-show'))
        })
    }
};


// 打卡详情
export const FlagCardDetail = {
    path: 'university/flag-card-detail',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/flag-card-detail'))
        })
    }
};
