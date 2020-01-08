import App from '../../app.js';

import { PageNotFound,LinkNotFound } from './page-not-found';
import {
    Recommend,
    FreeRecommend,
    ChargeRecommend,
    LowPriceRecommend,
    HotTagList,
    RecommendViewMore,
    ChooseUserTag,
    KnowledgeNews
} from './recommend';
// import ChargeRecommend from './charge-recommend';
import MyShares from './my-shares';
import { ShareCardVip, ShareCardChannel } from './share-card';
import {
    ShareIncomeFlow,
    ShareIncomeListTopic,
    ShareIncomeListChannel,
    ShareIncomeListVip,
    ShareIncomeDetailTopic,
    ShareIncomeDetailChannel,
    ShareIncomeDetailVip,
} from './share-income';

import {
    RealName,
    LiveAuth,
    LiveProtocol,
    joinList,
    coursePush,
    liveTimeline,
    liveCourseTable,
    liveQuestion,
    liveVip,
    liveVipList,
    liveVipDetails,
    liveVipSettingTypes,
    liveVipIncome,
    liveVipSetting,
    liveBannerList,
    liveBannerEditor,
    liveBannerTopicChannel,
    focusQl,
    EditDesc,
    CreateLive,
    CreateLiveSuccess,
    CourseRegistrySuccess,
    CommunityQrcode,
    vipGiftDetails,
    learnEveryday,
    CourseSortPage
} from './live';

import {
    ChannelSettings,
    ChannelIntroEdit,
    ChannelSort,
    ChannelIntroList,
    ChannelTopicSort,
    TopicsSort,
    ChannelIntroVideoEdit,
    channelMarketing,
    ChannelGroup,
    ChannelGroupList,
    ChannelPurcaseNotice,
    channelConsult,
} from './channel';
import {
    ChannelDistributionRepresent,
    ChannelDistributionList,
    ChannelDistributionSet,
    ChannelDistributionAdd,
    ChannelDistributionIndexList,
    GetChannelShareQualify,
    GetChannelShareQualifyBatch,
    ChannelDistributionRepresentDetailList,
    ChannelQualifyNone,
    ChannelDistributionNomoreRepresent,
    RepresentAuth,
} from './channel-distribution';

import {
    TopicDistributionList
} from './topic-distribution'

import {
    subcribeCustomMade,
    subcribeLesson,
    subcribeQRcode,
    subcribeCard,
    subcribeLive,
} from './subcribe';
import { finishPay, finishPayPasterPreview } from './finish-pay';

import {
    LiveProfitOverview,
    LiveProfitWithdraw,
    LiveProfitChecklist,
    LiveProfitChecking,
    LiveProfitTopicAnaslysis,
    LiveProfitChannelAnaslysis,
    LiveProfitRecommendAnalysis,
    LiveProfitRecommendDetails,
    LiveProfitDetailChannel,
    LiveProfitChannelKnowledge,
    LiveProfitCheckinCampAnalysis,
    LiveProfitDetailCheckinCamp,
    LiveProfitDetailCheckin,
    LiveProfitProblem,
} from './profit';
import {ComplainReason, ComplainDetails} from './complain';
import { evaluationCreate, topicEvaluationList, channelEvaluationList, evaluationSetting } from './evaluation';
import {Mine, MineQuestion, MineProfit, MyPromoProfit, MyPromoWithdraw, Unevaluated, JoinedTopic, MineCourse, SimilarCourse, MineCollect, MineFootPrint, qlchatVip, PhoneAuth, LookStudio, RewardProfit, MyStudent } from './mine';
import {
    homeworkManage,
    homeworkCreate,
    homeworkSetContent,
    HandIn,
    RelateCourse,
    Details,
	MyHomework,
	Card,
	Error,
} from './homework';
import { WXLogin } from './wx-login';

import { DocList } from './doc-list';
import { ChannelDataStatistics, LiveChannelList  } from './channel-data-statistics';

import { GuestSeparateListC, GuestSeparateListB, IncomeDetail, Setting, Invitation , Percentplease } from './guest-separate';

import {
    Timeline,
    ChooseTimelineType,
    CreateTimeline,
    MineFocus,
    NewLike,
} from './timeline';

import { Messages, MessagesCourseEval } from './messages';

import { activeValue, promoteActiveValue } from  './active-value'

import { FansActive, FansExpress } from './fans-active';
import {
    searchIndex,
	searchUpdating,
} from './search'
import { NightAnswer,NightAnswerShow} from './night-answer'

import {
    activityGift,
    activityAddress
} from './activity-commen'

import {
    gift,
    giftSuccess,
    redEnvelope, 
    redEnvelopeDetail,
    redEnvelopeIncome,
} from './gift'
import {ExclusiveGiftPackage} from './exclusive-gift-package'
import {ExcellentCourse} from './excellent-course'

import {
	PromoRank,
	Authindex,
    LiveCenterOptions,
    LiveDistribution,
    Protocol,
    AuthDistributionAdd,
    DistributionPresentException,
    DistributionPresentNoMore,
    DistributionRepresentDetailList
} from './distribution'

import {
    Pay
} from './pay'

import { ChoiceCourse } from './choice'
import { BooksLists, BooksHome, BooksAll, BooksRanking, BookList, BookDetails, BookSecondary } from './books'
import { Recycle } from './recycle'
import { UserManager } from './userManager'

import { ActivityEntrance, CreateLiveAdvSuccess } from './activity-entrance';
import { SmsProtocolPage } from './protocol';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    indexRoute: { component: PageNotFound },
    childRoutes: [
        // 推荐首页
        Recommend,
        //免费专区
        FreeRecommend,
        // 知识新闻
        KnowledgeNews,
        // 低价专区
        LowPriceRecommend,
        // 热门分类列表
        HotTagList,
	    // 首页查看更多
        RecommendViewMore,
        // 用户偏好选择
        ChooseUserTag,
        // 听书列表
        BooksLists,

        // 付费精品推荐
        ChargeRecommend,
        // 我的分销推广
        MyShares,

        // 系列课介绍列表页面
        ChannelIntroList,
        // 系列课设置页面
        ChannelSettings,
        //系列课排序
        ChannelSort,
        //系列課话题排序
        ChannelTopicSort,
        // 课程排序
        TopicsSort,
        CourseSortPage,
        /*话题分销*/
        // 话题分销用户列表
        TopicDistributionList,
        /*系列课分销*/
        //系列课分销用户列表
        ChannelDistributionList,

        // //课代表专属页（旧）
        ChannelDistributionRepresent,
         // 课代表专属页
        RepresentAuth,

        // 课代表名额领取异常页
        DistributionPresentException,
        DistributionPresentNoMore,

        // 课代表分销明细页
        DistributionRepresentDetailList,
        
        //单发领取
        GetChannelShareQualify,
        //群发领取
        GetChannelShareQualifyBatch,
        //课代表删除冻结
        ChannelQualifyNone,
        // 系列课分销添加课代表
        ChannelDistributionAdd,
        // 添加课代表（通用）
        AuthDistributionAdd,
        //自动分销设置
        ChannelDistributionSet,

        //营销工具：课程促销设置页面
        channelMarketing,

        //系列课数据统计
        ChannelDataStatistics,

        //系列课分销列表
        ChannelDistributionIndexList,
        //课代表推广明细
        ChannelDistributionRepresentDetailList,
        //课代表派发完
        ChannelDistributionNomoreRepresent,
       
        // 系列课编辑页面
        ChannelIntroEdit,
        ChannelIntroVideoEdit,
        
        //分销
        ShareCardChannel,
        ShareCardVip,

        // 我的分销收益流水
        ShareIncomeFlow,
        ShareIncomeListTopic,
        ShareIncomeListChannel,
        ShareIncomeListVip,
        ShareIncomeDetailTopic,
        ShareIncomeDetailChannel,
        ShareIncomeDetailVip,

        //课程定制
        subcribeCustomMade,
        subcribeLesson,
        subcribeQRcode,
        subcribeCard,
        subcribeLive,
        // 拼课页面
        ChannelGroup,
        ChannelGroupList,
        // 购买须知
        ChannelPurcaseNotice,
        // 系列课咨询
        channelConsult, 
        //完成支付
        finishPay,
	    //完成支付贴图预览
	    finishPayPasterPreview,

        //投诉
        ComplainReason,
        ComplainDetails,

        //个人中心
        Mine,
        MineQuestion,
        MineProfit,
        MyPromoProfit,
        MyPromoWithdraw,
        RewardProfit,
        MineCourse,
        MyStudent,

        SimilarCourse, MineCollect, MineFootPrint,

        /*收益相关页面*/
        // 直播间收益主页
        LiveProfitOverview,
        // 提现申请
        LiveProfitWithdraw,
        // 直播间收益列表
        LiveProfitChecklist,
        // 待结算金额
        LiveProfitChecking,
        // 系列课收益明细
        LiveProfitDetailChannel,
        // 直播间收益分析
        LiveProfitTopicAnaslysis,
        LiveProfitChannelAnaslysis,
        LiveProfitRecommendAnalysis,
        LiveProfitRecommendDetails,
        LiveProfitChannelKnowledge,
        LiveProfitProblem,
        LiveProfitCheckinCampAnalysis,
        LiveProfitDetailCheckinCamp,
        LiveProfitDetailCheckin,
        CourseRegistrySuccess,
        CommunityQrcode,
        // 系列课数据统计
        LiveChannelList,
        Unevaluated,
        JoinedTopic,

        //课程评价
        evaluationCreate,
        topicEvaluationList,
        channelEvaluationList,

        evaluationSetting,

        //优质课程库
        ExcellentCourse,

        //嘉宾分成
        GuestSeparateListC,
        GuestSeparateListB,
        IncomeDetail,
	    Setting,
	    Invitation,
        Percentplease,
        LookStudio,


        // 课后作业
        homeworkManage,
        homeworkCreate,
        homeworkSetContent,
	    HandIn,
        RelateCourse,
	    Details,
	    MyHomework,
	    Card,
	    Error,

        // 登录
        WXLogin,
        //直播间认证
        LiveAuth,
        LiveProtocol,
        
        // 短信服务协议
        SmsProtocolPage,
        
        //实名认证
        RealName,
        // 报名列表
        joinList,

        // 文档列表
        DocList,
        // 动态
        Timeline,
        ChooseTimelineType,
        CreateTimeline,
        MineFocus,
        NewLike,

        Messages,
        MessagesCourseEval,

        // 推送通知
        coursePush,

        // 新直播间主页相关页面
        liveTimeline,
        liveCourseTable,
        liveQuestion,
        liveVip,
        liveVipList,
        liveVipDetails,
        liveVipSettingTypes,
        liveVipSetting,
        liveVipIncome,
        liveBannerList,
        liveBannerEditor,
        liveBannerTopicChannel,
        vipGiftDetails,
        learnEveryday,
        EditDesc,
        CreateLive,
        CreateLiveSuccess,
        
        // 粉丝激活
        FansActive,
        // 千聊直通车
        FansExpress,

        // 夜答
        NightAnswer,
        NightAnswerShow,
        
        activeValue, 
        promoteActiveValue,

	    // 搜索功能升级中
	    searchUpdating,
        // 搜索页
        searchIndex,

        // 通用的活动赠礼领取页面
        activityGift,
        activityAddress,
        
        //赠礼
        gift,
        //赠礼领取成功页面
        giftSuccess,
        //新人专属礼包
        ExclusiveGiftPackage,
        // 发红包
        redEnvelope,
        // 红包详情
        redEnvelopeDetail,
        // 红包收益
        redEnvelopeIncome,


	    // 分享排行榜
	    PromoRank,
	    // 分销授权主页
	    Authindex,
        LiveCenterOptions,
        // 直播间分销状态
        LiveDistribution,
        // 课程上架协议
        Protocol,
        // 千聊会员合作签订
        qlchatVip,
        // 精选课程
        ChoiceCourse,
        // 绑定手机号
        PhoneAuth,

        //  链接失效
        LinkNotFound,
        // 关注千聊
        focusQl,
	    // 统一支付页
	    Pay,

		// 回收站
		Recycle,
		// 权限管理页面
		UserManager,
                
        // 创建课程前置入口页面
        ActivityEntrance,
        CreateLiveAdvSuccess,

        // 听书首页
        BooksHome,
        BooksAll,
        BooksRanking,
        BookList,
        BookDetails,
        BookSecondary,
        // 404
        PageNotFound,

    ]
};

export default rootRoute;
