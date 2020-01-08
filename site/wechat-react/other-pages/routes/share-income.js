
export const ShareIncomeFlow = {
    path: 'share-income-flow',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-flow'));
        });
    }
};
export const ShareIncomeListTopic = {
    path: 'share-income-list-topic',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-list-topic'));
        });
    }
};
export const ShareIncomeListChannel = {
    path: 'share-income-list-channel',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-list-channel'));
        });
    }
};
export const ShareIncomeListVip = {
    path: 'share-income-list-vip',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-list-vip'));
        });
    }
};
export const ShareIncomeDetailTopic = {
    path: 'share-income-detail-topic/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-detail-topic'));
        });
    }
};
export const ShareIncomeDetailChannel = {
    path: 'share-income-detail-channel/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-detail-channel'));
        });
    }
};
export const ShareIncomeDetailVip = {
    path: 'share-income-detail-vip/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-income-detail-vip'));
        });
    }
};