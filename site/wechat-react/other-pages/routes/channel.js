export const ChannelSettings = {
    path: 'channel-settings',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-settings'));
        });
    }
};

export const ChannelSort = {
    path: 'channel-sort/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-sort'));
            });
    }
};
export const ChannelTopicSort = {
    path: 'channel-topic-sort/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-sort'));
            });
    }
};

export const TopicsSort = {
    path: 'topics-sort/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topics-sort'));
            });
    }
};

export const ChannelIntroList = {
    path: 'channel-intro-list/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-intro-list'));
        });
    }
};


export const ChannelIntroEdit = {
    path: 'channel-intro-edit/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-intro-edit'));
        });
    }
};
export const ChannelIntroVideoEdit = {
    path: 'channel-intro-video-edit/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-intro-video-edit'));
        });
    }
};

export const ChannelGroup = {
    path: '/topic/channel-group',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-group'));
        });
    }
}

export const ChannelGroupList = {
    path: '/wechat/page/channel-group-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-group-list'));
        });
    }
}

export const channelMarketing = {
    path: 'channel-market-seting',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-market-seting'));
        });
    }
}
export const ChannelPurcaseNotice = {
    path: 'channel-purcase-notice',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-purcase-notice'));
        });
    }
}

export const channelConsult = {
    path: 'channel-consult',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-consult'));
        });
    }
}

