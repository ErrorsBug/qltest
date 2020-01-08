/**
 * 
 * 
 *  静态数据配置
 * 
 * 
 *  */ 


 /**
 *  ****************** 渠道来源规则 ******************
 */
 
// 会员中心
export const memberCenterConfigure = [
    {// 个人中心
        page: '/wechat/page/mine',
        wcl: 'member_personal'
    },
    {// 系列课介绍
        page: '/wechat/page/channel-intro',
        wcl: 'member_series-entry'
    },
    {// 话题介绍
        page: '/wechat/page/topic-intro',
        wcl: 'member_topic-entry'
    },
    {// 我的课程 已购列表
        page: '/wechat/page/mine/course',
        params: {
            activeTag: 'purchased'
        },
        wcl: 'member_course-buy'
    },
    {// 我的课程 学习列表
        page: '/wechat/page/mine/course',
        params: {
            activeTag: 'recent'
        },
        wcl: 'member_course-recent'
    },
    {
        page: '/topic/details-listening',
        wcl: 'member_litsening',// 后来发现拼错了（不影响数据统计），当时直接复制产品给的
    },
    {
        page: '/wechat/page/topic-simple-video',
        wcl: 'member_video',
    },
]

// 会员大师课
export const memberMasterConfigure = [
    {// 系列课介绍
        page: '/wechat/page/channel-intro',
        wcl: 'member_series-entry'
    },
    {// 会员中心
        page: '/wechat/page/membership-center',
        wcl: 'member_center'
    },
]