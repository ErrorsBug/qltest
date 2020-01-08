export const ChannelDataStatistics = {
    path: 'channel-topic-statistics',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-data-statistics').default);
        });
    }
}


export const LiveChannelList = {
    path: 'live-channel-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/live-channel-list').default);
        });
    }
}
