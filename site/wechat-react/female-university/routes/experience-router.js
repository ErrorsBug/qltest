
// 理财训练营
export const ExperienceFinance = {
    path: 'experience-finance',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance'))
        })
    }
};
// 理财训练营兜底页
export const ExperienceFinanceBottom = {
    path: 'experience-finance-bottom',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance/bottom-page'))
        })
    }
};
// 理财训练营购买成功
export const ExperienceFinanceCard = {
    path: 'experience-finance-card',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-card'))
        })
    }
};
// 理财训练营购买记录
export const ExperienceFinanceBuyed = {
    path: 'experience-finance-bought',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-bought'))
        })
    }
};
// 理财训练营购买记录
export const ExperienceFinancePoster = {
    path: 'experience-finance-poster',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-poster'))
        })
    }
};

// 理财训练营购买记录
export const ExperienceFinanceScholarship = {
    path: 'experience-finance-scholarship',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-scholarship'))
        })
    }
};
// 理财训练营提现
export const ExperienceFinanceWithdraw = {
    path: 'experience-finance-withdraw',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-withdraw'))
        })
    }
};

// 理财训练营邀请明细
export const ExperienceFinanceInviteDetail = {
    path: 'experience-finance-invite-detail',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-finance-invite-detail'))
        })
    }
};


// 体验营
export const UnExperienceCamp = {
    path: 'un-experience-camp',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/un-experience-camp'))
        })
    }
};

// 新体验营支付导购
export const UniversityExperienceCamp = {
    path: 'university-experience-camp',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/university-experience-camp'))
        })
    }
};

// 新体验营活动页
export const ExperienceCampActivity = {
    path: 'experience-camp-activity',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/university-experience-camp/activity'))
        })
    }
};
// 新体验营活动页
export const ExperienceCampInvite = {
    path: 'experience-camp-invite',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-invite'))
        })
    }
};
// 新体验营邀请列表
export const ExperienceCampInviteList = {
    path: 'experience-camp-invite-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-invite/list'))
        })
    }
};
// 体验营兜底页
export const ExperienceBottomPage = {
    path: 'experience-bottom',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/university-experience-camp/bottom-page'))
        })
    }
};

// 体验营列表
export const ExperienceCampList = {
    path: 'experience-camp-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-list'))
        })
    }
};
// 体验营提现
export const ExperienceCampWithdraw = {
    path: 'experience-camp-withdraw',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-withdraw'))
        })
    }
};
// 体验营提现列表
export const ExperienceCampWithdrawList = {
    path: 'experience-camp-withdraw-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-withdraw-list'))
        })
    }
};

// 体验营提现
export const ExperienceCampScholarship = {
    path: 'experience-camp-scholarship',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-scholarship'))
        })
    }
};

// 外部兑换码
export const ExperienceCampExchange = {
    path: 'experience-camp-exchange',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/experience-camp-exchange'))
        })
    }
};