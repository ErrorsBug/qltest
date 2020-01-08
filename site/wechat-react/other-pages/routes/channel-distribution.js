//系列课分销列表
export const ChannelDistributionIndexList = {
    path: 'channel-distribution-index-list/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-index-list'));
        });
    }
}

//系列课分销用户列表
export const ChannelDistributionList = {
    path: 'channel-distribution-list/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-list'));
        });
    }
};

//课代表专属页
export const ChannelDistributionRepresent = {
    path: 'channel-distribution-represent/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-represent'));
        });
    }
};
// 单发领取课代表
export const GetChannelShareQualify = {
    path: 'get-channel-share-qualify/:channelId/:shareId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-represent'));
        });
    }
};
// 群发领取课代表
export const GetChannelShareQualifyBatch= {
    path: 'get-channel-share-qualify-batch/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-represent'));
        });
    }
};
export const RepresentAuth = {
    path: '/wechat/page/represent-auth',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/represent-auth'));
        });
    }
};

// 课代表冻结、删除、已领完
export const ChannelQualifyNone = {
    path: 'channel-distribution-none/:type/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-none'));
        });
    }
};


//添加课代表页（系列课）
export const ChannelDistributionAdd = {
    path: 'channel-distribution-add/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-add'));
        });
    }
};

//自动分销设置页
export const ChannelDistributionSet = {
    path: 'channel-distribution-set/:channelId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-set'));
        });
    }
};

//课代表推广明细
export const ChannelDistributionRepresentDetailList = {
    path: 'channel-distribution-represent-detail-list/:businessId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-represent-detail-list'));
        });
    }
};

//推广课代表名额被领取完
export const ChannelDistributionNomoreRepresent = {
    path: 'channel-distribution-nomore-represent/:channelId/:userId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/channel-distribution-nomore-represent'));
        });
    }
};
