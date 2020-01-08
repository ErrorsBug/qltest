import {
    CHANNEL_STATISTICS_TOTAL,
    CHANNEL_STATISTICS_BASE_DISTRIBUTION,
    CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT,
    CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_RENAME,
    CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_ADD,
    CHANNEL_STATISTICS_INVITER_INIT,
    CHANNEL_STATISTICS_ALL_DATA,
    INIT_CHANNEL_LIST,
} from '../actions/channel-statistics'

const initState = {
    totalData: {
        visitorData: {
            totalVisitor: 0,
            totalJoined: 0,
            totalPayed: 0,
        },
        ticked: {
            tickedIncome: 0,
            tickedPayedNum: 0,
        },
        distribution: {
            channelDistributionCost: 0,
            channelRepresentorNum: 0,
            channelDistributionProfit: 0,
            channelDistributionDealNum: 0,

            liveDistributionCost: 0,
            liveRepresentorNum: 0,
            liveDistributionProfit: 0,
            liveDistributionDealNum: 0,
        },
        gift: {
            giftAmount: 0,
            giftPersonTime: 0,
        },
    },
    distributionData: {
        baseChannel: {
            defaultChannelVisitor: 0,
            defaultChannelJoined: 0,

            topicCenterVisitor: 0,
            topicCenterJoined: 0,

            invitationCardVisitor: 0,
            invitationCardJoined: 0,

            shareLinkVisitor: 0,
            shareLinkJoined: 0,

            appShareLinkVisitor: 0,
            appShareLinkJoined: 0,

            livePushVisitor: 0,
            livePushJoined: 0,

            platformPushVisitor: 0,
            platformPushJoined: 0,

            representCardVisitor: 0,
            representCardJoined: 0,

            distributionLinkVisitor: 0,
            distributionLinkJoined: 0,

            appDistributionLinkVisitor: 0,
            appDistributionLinkJoined: 0,

        }
    },
    popularizeChannelList: [
        {
            name: "推广渠道1",
            visitorNum: 0,
            joinCourseNum: 0,
            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
        },
        {
            name: "推广渠道2",
            visitorNum: 0,
            joinCourseNum: 0,
            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
        },
        {
            name: "推广渠道1",
            visitorNum: 0,
            joinCourseNum: 0,
            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
        },
        {
            name: "推广渠道1",
            visitorNum: 0,
            joinCourseNum: 0,
            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
        },
    ],
    backEndData: {},
    channelList: {},
};

export function channelStatistics (state = initState, action) {

    switch (action.type) {
        case INIT_CHANNEL_LIST: 
            return {
                ...state, ...{
                    channelList: action.data
                }
            }
        case CHANNEL_STATISTICS_ALL_DATA: 
            return {
                ...state, ...{
                    backEndData: action.data
                }
            }
        case CHANNEL_STATISTICS_TOTAL:
            return {
                ...state, ...{
                    totalData: {
                        visitorData: {
                            totalVisitor: 12,
                            totalJoined: 12,
                            totalPayed: 12,
                        },
                        ticked: {
                            tickedIncome: 12,
                            tickedPayedNum: 12,
                        },
                        distribution: {
                            channelDistributionCost: 12,
                            channelRepresentorNum: 12,
                            channelDistributionProfit: 12,
                            channelDistributionDealNum: 12,

                            liveDistributionCost: 12,
                            liveRepresentorNum: 12,
                            liveDistributionProfit: 12,
                            liveDistributionDealNum: 12,
                        },
                        gift: {
                            giftAmount: 12,
                            giftPersonTime: 12,
                        },
                    },
                }
            };


        case CHANNEL_STATISTICS_BASE_DISTRIBUTION: 
            return {
                ...state, ...{
                    distributionData: {
                        baseChannel: {
                            defaultChannelVisitor: 1212,
                            defaultChannelJoined: 832,

                            topicCenterVisitor: 1233,
                            topicCenterJoined: 1212,

                            invitationCardVisitor: 1122,
                            invitationCardJoined: 1213,

                            shareLinkVisitor: 1232,
                            shareLinkJoined: 1231,

                            livePushVisitor: 1231,
                            livePushJoined: 111,

                            platformPushVisitor: 1111,
                            platformPushJoined: 1213,

                            representCardVisitor: 1212,
                            representCardJoined: 1234,

                            distributionLinkVisitor: 111,
                            distributionLinkJoined: 121,
                        },
                    },
                }
            }

        case CHANNEL_STATISTICS_POPULARIZE_DISTRIBUTION_INIT:
            return {
                ...state, ...{
                    popularizeChannelList: [
                        {
                            name: "推广渠道1",
                            visitorNum: 12312,
                            joinCourseNum: 2333,
                            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
                        },
                        {
                            name: "推广渠道2",
                            visitorNum: 12312,
                            joinCourseNum: 2333,
                            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
                        },
                        {
                            name: "推广渠道1",
                            visitorNum: 12312,
                            joinCourseNum: 2333,
                            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
                        },
                        {
                            name: "推广渠道1",
                            visitorNum: 12312,
                            joinCourseNum: 2333,
                            popularizeUrl: "http://dao.corp.qlchat.com/zentao/data/upload/1/201706/2811051905109ta.png"
                        },
                    ],
                }
            }

        default:
            return state;
    }
}
