// 亲友卡首页
export const FamilyCard = {
    path: 'university/family-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/family-card'))
        })
    }
};

// 亲友卡 客人访问页
export const FamilyOther = {
    path: 'university-family-other',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/family-other'))
        })
    }
};


// 亲友卡领取成功
export const ExperienceCard = {
    path: 'university-experience-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-card'))
        })
    }
};

// 体验营列表
export const FamilyCampList = {
    path: 'family-camp-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/family-camp-list'))
        })
    }
};