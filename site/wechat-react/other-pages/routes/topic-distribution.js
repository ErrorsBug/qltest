//话题分销用户列表
export const TopicDistributionList = {
    path: 'topic-distribution-list/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-distribution-list'));
        });
    }
};