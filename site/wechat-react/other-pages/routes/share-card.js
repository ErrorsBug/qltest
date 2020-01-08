
export const ShareCardVip = {
    path: 'share-card-vip/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-card-vip'));
        });
    }
};

export const ShareCardChannel = {
    path: 'share-card-channel/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/share-card-channel'));
        });
    }
};