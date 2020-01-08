export const evaluationCreate = {
    path: 'evaluation-create/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/evaluation/create'));
        });
    }
};

export const topicEvaluationList = {
    path: 'topic-evaluation-list/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/evaluation/list'));
        });
    }
};

export const channelEvaluationList = {
    path: 'channel-evaluation-list/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/evaluation/list'));
        });
    }
};

export const evaluationSetting = {
    path: 'evaluation-setting',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/evaluation/setting'));
        });
    }
};
