import App from '../../app.js';

import { 
    custom,
    introduction,
    liveInfo,
    liveStudioInfo,
    myQuestion,
    myShares,
    myUnevaluated,
    myJoined,
    myHomework,
    studioLiveContainer,
    introductionNologin,
    studioCouponPreview,
    studioCouponOrder,
    moduleCustom,
    mediaStudioBuy,
    mediaStudioPaid,
    mediaMarket,
    contactInfo,
    mediaPromotion,
    checkinCampList,
    highDivisionActivity,
    topTenCourse,
    favourableCourse,
    boutiqueCourse,
    createChannel,
    createTopic,
    livePushMessage,
    liveRecommend,
    liveDataStatistics,
    simulationGroup,
    promoteMethod,
    ShareGuide,
    SendInvitation,
    trainingList,
    TagManage,
    channelList,
    topicList,
    BEndNoticeCenter,
    LiveSetting,
    LiveRelateService,
    ServiceNumberDocking
} from './live-studio';

import { 
    customerCollect
 } from './customer-collect';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        // 自定义直播间
        custom,
        liveStudioInfo,
        liveInfo,
        // 个人中心
        // mine,
        // 我的提问
        myQuestion,
        // 特权直播间
        introduction,
        introductionNologin,
        // 我的推广页
        myShares,
        // 我的待评价页
        myUnevaluated,
        // 我的学习记录页
        myJoined,
        // 我的课后作业页
        myHomework,
        // 主页的容器
        studioLiveContainer,
        // 优惠券展示页面
        studioCouponPreview,
        // 优惠券购买专业版页面
        studioCouponOrder,
        // 专业版老师自定义的页面
        moduleCustom,
        // 资料填写
        customerCollect,
        // 媒体版直播间购买页面
        mediaStudioBuy,
        // 媒体版直播间支付成功页面
        mediaStudioPaid,
        // 知识通商城
        mediaMarket,
        // 用户联系方式
        contactInfo,
        // 媒体推广投放
        mediaPromotion,
        // 打卡训练营列表
        checkinCampList,
        // 高分成活动
        highDivisionActivity,
        // 热销top10
        topTenCourse,
        // 特惠专区
        favourableCourse,
        // 精品课程
        boutiqueCourse,
        // 创建系列课
        createChannel,
        //创建话题
        createTopic,
        // 直播间推送消息
        livePushMessage,
        // 今日推荐
        liveRecommend,
        // B端通知中心
        BEndNoticeCenter,
        // 数据统计
        liveDataStatistics,
        // 模拟群聊
        simulationGroup,
        // 如何提升课程指数
        promoteMethod,
        // 引导关注
        ShareGuide,
        // 接受邀请页
        SendInvitation,
        trainingList,
        // 分类管理页
        TagManage,
        // 系列课列表页
        channelList,
        topicList,
        // 直播间关联公众号页
        LiveRelateService,
        // 直播间设置页
        LiveSetting,


        // 服务号对接
        ServiceNumberDocking
    ]
};

export default rootRoute;
