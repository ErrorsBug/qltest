import { callActivityLog } from '../actions/channel';

/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-11 11:05:39 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-05-15 10:50:47
 */
export const LiveProfitOverview = {
    path: 'live/profit/overview/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-overview'));
        });
    }
};

export const LiveProfitWithdraw = {
    path: 'live/profit/withdraw/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-withdraw'));
        });
    }
};

export const LiveProfitChecklist = {
    path: 'live/profit/checklist/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-checklist'));
        });
    }
};

export const LiveProfitChecking = {
    path: 'live/profit/checking/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-checking'));
        });
    }
};
export const LiveProfitTopicAnaslysis = {
    path: 'live/profit/anslysis/topic/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-analysis/topic'));
        });
    }
};
export const LiveProfitChannelAnaslysis = {
    path: 'live/profit/anslysis/channel/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-analysis/channel'));
        });
    }
};
export const LiveProfitRecommendAnalysis = {
    path: 'live/profit/anslysis/recommend/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-analysis/recommend'));
        });
    }
};
export const LiveProfitRecommendDetails = {
    path: 'live/profit/anslysis/recommend-details/:id',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-analysis/recommend-details'));
        });
    }
};

export const LiveProfitCheckinCampAnalysis = {
    path: 'live/profit/analysis/checkinCamp/:liveId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-analysis/checkin-camp').default);
        });
    }
}

export const LiveProfitDetailCheckinCamp = {
    path: 'live/profit/detail/checkinCamp/:campId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-detail-checkin-camp').default);
        });
    }
}

export const LiveProfitDetailCheckin = {
    path: 'live/profit/detail/checkin',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-detail-checkin').default);
        });
    }
}

export const LiveProfitDetailChannel = {
    path: 'live/profit/detail/channel/:channelId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-detail-channel'));
        });
    }
};

export const LiveProfitChannelKnowledge = {
    path: 'live/profit/detail/channel-knowledge/:channelId',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-channel-knowledge').default);
        });
    }
}

export const LiveProfitProblem = {
    path: 'live/profit/detail/problem',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/live-profit-problem').default);
        });
    }
}