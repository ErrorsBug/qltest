export const TopicDataStatistics = {
    path: 'topic-data-statistics',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-data-statistics').default);
        });
    }
}