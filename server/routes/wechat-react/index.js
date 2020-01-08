import path from 'path';
import async from 'async';
import lo from 'lodash'
import fs from 'fs';

// apollo
import schema from '../../graphql';
const {
    graphql
} = require('graphql');
const {
    graphqlExpress,
    graphiqlExpress
} = require('apollo-server-express');

// utils
const conf = require('../../conf');
const envi = require('../../components/envi/envi');
const routerMatch = require('../../components/isomorphic-router-match').routerMatch;

// middlewares
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const actAuth = require('../../middleware/auth/1.0.0/act-auth');
const wxHqAuth = require('../../middleware/auth/1.0.0/wx-hq-auth');
const knowledgeCodeAuth = require('../../middleware/knowledge-code-auth');
const clientParams = require('../../middleware/client-params/client-params');
const apolloHander = require('../../middleware/page-handler/apollo-handler').default;
const reduxHander = require('../../middleware/page-handler/redux-handler').default;
const wxAppAuth = require('../../middleware/auth/1.0.0/wx-app-auth').default;
const hostValidate = require('../../middleware/host-validate/host-validate');
const staticHtml = require('../../middleware/static-html').default;
const userTag = require('../../middleware/user-tag');
const silentFollow = require('../../middleware/silent-follow');
const managerPass = require('../../middleware/manager-pass');
const univFollow = require('../../middleware/university-follow');
const { managePassForConsult } = require('../../middleware/manager-pass');
const autoDeviceRoute = require('../../middleware/auto-route/auto-route').autoDeviceRoute;


// ========= webpack isomorphic tools init
const Webpack_isomorphic_tools = require('webpack-isomorphic-tools');
const context = require('../../../site/wechat-react/webpack.base').context;
global.webpackConfig = new Webpack_isomorphic_tools(require('../../../site/wechat-react/webpack_isomorphic_tools_config'));
global.webpackConfig.server(context, null);

// ========= 提取所有文件中的handlers
const files = fs.readdirSync(path.resolve(__dirname))
const h = files.reduce((pre, cur, index) => {
    if (path.extname(cur) === '.js' && path.basename(cur) !== 'index') {
        let obj = require(path.resolve(__dirname, cur))
        return lo.merge(pre, obj)
    }
}, {})

// ========= Sites
const thousandLiveConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/thousand_live.html')),
    routers: require('../../../site/wechat-react/thousand-live/routes').default,
    reducers: require('../../../site/wechat-react/thousand-live/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const audioGraphicConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/audio_graphic.html')),
    routers: require('../../../site/wechat-react/audio-graphic/routes').default,
    reducers: require('../../../site/wechat-react/audio-graphic/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const couponPagesConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/coupon.html')),
    routers: require('../../../site/wechat-react/coupon/routes').default,
    reducers: require('../../../site/wechat-react/coupon/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const feedbackPagesConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/feedback.html')),
    routers: require('../../../site/wechat-react/feedback/routes').default,
    reducers: require('../../../site/wechat-react/feedback/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const otherPagesConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/other_pages.html')),
    routers: require('../../../site/wechat-react/other-pages/routes').default,
    reducers: require('../../../site/wechat-react/other-pages/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const coralConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/coral.html')),
    routers: require('../../../site/wechat-react/coral/routes').default,
    reducers: require('../../../site/wechat-react/coral/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const campConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/training_camp.html')),
    routers: require('../../../site/wechat-react/training-camp/routes').default,
    reducers: require('../../../site/wechat-react/training-camp/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const checkInCampConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/check_in_camp.html')),
    routers: require('../../../site/wechat-react/check-in-camp/routes').default,
    reducers: require('../../../site/wechat-react/check-in-camp/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const liveStudioConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/live_studio.html')),
    routers: require('../../../site/wechat-react/live-studio/routes').default,
    reducers: require('../../../site/wechat-react/live-studio/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const topicIntroConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/topic_intro.html')),
    routers: require('../../../site/wechat-react/topic-intro/routes').default,
    reducers: require('../../../site/wechat-react/topic-intro/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const videoCourseConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/video_course.html')),
    routers: require('../../../site/wechat-react/video-course/routes').default,
    reducers: require('../../../site/wechat-react/video-course/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const commentConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/comment.html')),
    routers: require('../../../site/wechat-react/comment/routes').default,
    reducers: require('../../../site/wechat-react/comment/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const membershipConfigs = {
	htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/membership.html')),
	routers: require('../../../site/wechat-react/membership/routes').default,
	reducers: require('../../../site/wechat-react/membership/reducers').default,
	defaultHandlers: [
		h.defaultHandler
	]
};

const pointConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/point.html')),
    routers: require('../../../site/wechat-react/point/routes').default,
    reducers: require('../../../site/wechat-react/point/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const backstageConfigs = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/backstage.html')),
    routers: require('../../../site/wechat-react/backstage/routes').default,
    reducers: require('../../../site/wechat-react/backstage/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
};

const mineConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/mine.html')),
    routers: require('../../../site/wechat-react/mine/routes').default,
    reducers: require('../../../site/wechat-react/mine/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const shortKnowledgeConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/short_knowledge.html')),
    routers: require('../../../site/wechat-react/short-knowledge/routes').default,
    reducers: require('../../../site/wechat-react/short-knowledge/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const femaleUniversityConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/female_university.html')),
    routers: require('../../../site/wechat-react/female-university/routes').default,
    reducers: require('../../../site/wechat-react/female-university/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const communityConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/community.html')),
    routers: require('../../../site/wechat-react/community/routes').default,
    reducers: require('../../../site/wechat-react/community/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}


const homeWorkConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/home_work.html')),
    routers: require('../../../site/wechat-react/home-work/routes').default,
    reducers: require('../../../site/wechat-react/home-work/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const freeColumnConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/live_center.html')),
    routers: require('../../../site/wechat-react/live-center/routes').default,
    reducers: require('../../../site/wechat-react/live-center/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

const commonPageConfig = {
    htmlPath: path.resolve(path.join(__dirname, '../../../public/wechat-react/common_page.html')),
    routers: require('../../../site/wechat-react/live-center/routes').default,
    reducers: require('../../../site/wechat-react/live-center/reducers').default,
    defaultHandlers: [
        h.defaultHandler
    ]
}

// ========= Handers
const thousandLivePage = reduxHander(thousandLiveConfigs);
const otherPagesApollo = apolloHander(otherPagesConfigs);
const otherPagesRedux = reduxHander(otherPagesConfigs);
const liveStudioRedux = reduxHander(liveStudioConfigs);
const couponPagesRedux = reduxHander(couponPagesConfigs);
const feedbackPagesRedux = reduxHander(feedbackPagesConfigs);
const liveStudioApollo = apolloHander(liveStudioConfigs);
const audioGraphicPage = reduxHander(audioGraphicConfigs);
const coralRedux = reduxHander(coralConfigs);
const campRedux = reduxHander(campConfigs)
const checkInCampRedux = reduxHander(checkInCampConfigs);
const topicIntroPage = reduxHander(topicIntroConfigs);
const videoCourseRedux = reduxHander(videoCourseConfigs);
const commentRedux = reduxHander(commentConfigs);
const membershipRedux = reduxHander(membershipConfigs);
const pointRedux = reduxHander(pointConfigs);
const backstageRedux = reduxHander(backstageConfigs);
const mineRedux = reduxHander(mineConfig);
const shortKnowledgeRedux = reduxHander(shortKnowledgeConfig);
const femaleUniversityRedux = reduxHander(femaleUniversityConfig);
const communityRedux = reduxHander(communityConfig);
const homeWorkRedux = reduxHander(homeWorkConfig);
const freeColumnRedux = reduxHander(freeColumnConfig);
const commonPage = reduxHander(commonPageConfig);


// =========
const routeDefinitions = [
    // graphql通用请求接口
    ['ALL', '/api/wechat/graphql', wxAppAuth(), (req, res, next) => {
        graphqlExpress({
            schema: schema,
            rootValue: {
                req,
                res
            },
            // graphiql: true
        })(req, res, next)
    }],
    ['GET', '/api/wechat/graphiql', wxAppAuth(), (req, res, next) => {
        graphiqlExpress({
            endpointURL: '/api/wechat/graphql'
        })(req, res, next)
    }],

    ['GET', '/wechat/page/recommend',hostValidate('main'), wxAppAuth(), userTag(true), otherPagesRedux(h.recommendHandle)],
    ['GET', '/wechat/page/recommend/view-more', wxAppAuth(), userTag(), otherPagesRedux()],
    ['GET', '/wechat/page/recommend/user-like', wxAppAuth(), userTag(), otherPagesRedux()],
    ['GET', '/wechat/page/charge-recommend', wxAppAuth(), otherPagesRedux(h.chargeRecommendHandle, true)],
    ['GET', '/wechat/page/free-recommend', wxAppAuth(), otherPagesRedux(h.freeRecommendHandle, true)],
    ['GET', '/wechat/page/hot-tag-list/:tagId', wxAppAuth(), otherPagesRedux()],
    // 课程数据卡
    ['GET', '/wechat/page/course-data-card/:topicId', wxAppAuth(), managerPass(), thousandLivePage()],

    ['GET', '/wechat/page/my-shares', wxAppAuth(), otherPagesRedux()],
    //话题视频详情页
    ['GET', '/topic/details-video', (req, res, next) => {
        req.aliVideoPlayerjs = true;

        if (envi.isPc(req)) {
            req.isPc = true;
        }

        next();
    }, knowledgeCodeAuth(), wxAppAuth(), thousandLivePage(h.topicVideoHandle, true)],
    //话题音频图文详情页
    ['GET', '/topic/details-audio-graphic', (req, res, next) => {
        req.aliVideoPlayerjs = true;
        if (envi.isPc(req)) {
            req.isPc = true;
        }

        next();
    }, knowledgeCodeAuth(), wxAppAuth(), audioGraphicPage(h.audioGraphicHandle, true)],
    //话题音视频直播详情页
    ['GET', '/topic/details-live', (req, res, next) => {
        req.aliVideoPlayerjs = true;
        if (envi.isPc(req)) {
            req.isPc = true;
        }

        next();
    }, knowledgeCodeAuth(), wxAppAuth(), thousandLivePage(h.topicLiveHandle,true)],
    // 小图文详情页
    ['GET', '/wechat/page/detail-little-graphic', knowledgeCodeAuth(), wxAppAuth(), checkInCampRedux(h.littleGraphicHandle, true)],
    //话题详情页极简模式
    ['GET', '/topic/details-listening', knowledgeCodeAuth(), wxAppAuth(), thousandLivePage(h.topicListeningHandle, true)],
    // 话题共享文件列表
    ['GET', '/wechat/page/topic-docs', knowledgeCodeAuth(), wxAppAuth(), thousandLivePage()],
    // 微信PC端 引导下载音频
    ['GET', '/wechat/page/tablet-audio', knowledgeCodeAuth(), wxAppAuth(), thousandLivePage()],
    // 关注页
    ['GET', '/wechat/page/live-share', knowledgeCodeAuth(), wxAppAuth(), thousandLivePage()],
    // 邀请
    ['GET', '/wechat/page/live-invitation', knowledgeCodeAuth(), wxAppAuth(), thousandLivePage()],
    //话题音频图文编辑页
    ['GET', '/wechat/page/audio-graphic-edit', wxAppAuth(), audioGraphicPage(h.audioGraphicEditHandle, true)],
    // 话题文稿（听书专属）
    ['GET', '/wechat/page/topic-manuscript', knowledgeCodeAuth(), wxAppAuth(), clientParams(), thousandLivePage(h.topicListeningHandle, true)],
    //话题介绍页
    // ['GET', '/wechat/page/topic-intro', knowledgeCodeAuth(), wxAuth({
    //     // 允许不登录访问
    //     allowFree: true
    // }), staticHtml('TI', 'topicId'), topicIntroPage(h.topicIntroHandle, false)],
    //话题介绍页编辑
    ['GET', '/wechat/page/topic-intro-edit', knowledgeCodeAuth(), wxAppAuth(), topicIntroPage()],
    // 链接失效页面
    ['GET', '/wechat/page/link-not-found', otherPagesRedux()],
    // 黑名单提示页面
    ['GET', '/wechat/page/is-black', (req, res, next) => {
        let isLive = lo.get(req, 'query.isLive', false);
        let liveId = lo.get(req, 'query.liveId', '');
        res.render('reject', {
            isLive: isLive,
            liveId: liveId
        });
    }],
    /****  课程促销设置页面  ****/
    ['GET', '/wechat/page/channel-market-seting', wxAppAuth(), otherPagesRedux(h.channelMarket, true)],
    ['GET', '/wechat/page/channel-settings', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/channel-sort/:liveId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/channel-topic-sort/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/topics-sort/:liveId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/channel-intro-edit/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/channel-intro-video-edit/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/channel-intro-list/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-card-vip/:liveId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/course-sort', wxAppAuth(), otherPagesRedux()],

    /****  优惠券相关页面  ****/
    ['GET', '/wechat/page/get-coupon-topic/:topicId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getTopicCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-topic-batch/:topicId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getTopicCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-channel/:channelId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getChannelCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-channel-batch/:channelId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getChannelCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-vip/:liveId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getVipCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-vip-batch/:liveId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getVipCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-camp/:campId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getCampCouponHandle, true)],
    ['GET', '/wechat/page/get-coupon-camp-batch/:campId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.getCampCouponHandle, true)],
    ['GET', '/wechat/page/send-coupon/:type', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.sendCouponHandle, true)],
    ['GET', '/wechat/page/coupon-code/list/:type/:id', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.couponListHandle,true)],
    ['GET', '/wechat/page/coupon-code/search/:type/:id', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.couponListHandle,true)],
    ['GET', '/wechat/page/coupon-code/info/:type/:codeId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.codeListHandle, true)],
    ['GET', '/wechat/page/coupon-create/:couponType/:id', wxAppAuth(), couponPagesRedux(h.couponCreatePage, true)],
    ['GET', '/wechat/page/static-coupon/:topicId', wxAppAuth(),  managerPass(), couponPagesRedux()],
    // 领取固定优惠码
    ['GET', '/wechat/page/static-coupon-link', wxAppAuth(), couponPagesRedux(h.bindStaticCoupon, true)],
    // 优惠码兑换
    ['GET', '/wechat/page/coupon-code/exchange/:type/:id', wxAppAuth(), couponPagesRedux(h.couponSubscriberPage, true)],
    // 领券中心
    ['GET', '/wechat/page/coupon-center', wxAppAuth(), couponPagesRedux()],
    // 抢平台通用券页面
    ['GET', '/wechat/page/grab-platform-coupon', wxAppAuth(), couponPagesRedux()],
    // 发平台通用券页面
    ['GET', '/wechat/page/send-platform-coupon', wxAppAuth(), couponPagesRedux(h.sendPlatformCouponPower, true)],
    // 我的优惠券
    ['GET', '/wechat/page/mine/coupon-list', wxAppAuth(), couponPagesRedux()],
    ['GET', '/wechat/page/coupon-manage/list/:liveId', wxAppAuth(), managerPass(), couponPagesRedux()],
    ['GET', '/wechat/page/coupon-manage/detail/:liveId', wxAppAuth(), managerPass(), couponPagesRedux()],
    ['GET', '/wechat/page/coupon-manage/share/:liveId', wxAppAuth(), managerPass(), couponPagesRedux()],
    // 优惠码推送中转页
    ['GET', '/wechat/page/coupon-transfer', wxAppAuth(), couponPagesRedux(h.couponTransfer,true)],
    ['GET', '/wechat/page/coupon-card', wxAppAuth(), couponPagesRedux(h.couponCardPage, true)],
    ['GET', '/wechat/page/get-coupon-universal/:liveId', knowledgeCodeAuth(), wxAppAuth(), couponPagesRedux(h.liveCouponSubscriberPage, true)],


    //分销收益流水
    ['GET', '/wechat/page/share-income-flow', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-list-topic', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-list-channel', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-list-vip', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-detail-topic/:topicId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-detail-channel/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/share-income-detail-vip/:liveId', wxAppAuth(), otherPagesRedux()],
    /*系列课分销*/
    //系列课分销用户列表
    ['GET', '/wechat/page/channel-distribution-list/:channelId', wxAppAuth(), otherPagesRedux(h.checkDistributionPower, true)],
    //课代表专属页(旧)
    ['GET', '/wechat/page/channel-distribution-represent/:channelId', wxAppAuth(), otherPagesRedux()],
    //课代表专属页(新)
    ['GET', '/wechat/page/represent-auth', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux(h.representAuthHandle, true)], 
    //单发领取课代表
    ['GET', '/wechat/page/get-channel-share-qualify/:channelId/:shareId', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux(h.getChannelShareHandle, true)],
    //群发领取课代表
    ['GET', '/wechat/page/get-channel-share-qualify-batch/:channelId', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux(h.getChannelShareHandle, true)],
    //删除冻结课代表
    ['GET', '/wechat/page/channel-distribution-none/:type/:channelId', wxAppAuth(), otherPagesRedux()],
    //课代表领取异常页
    ['GET', '/wechat/page/distribution/present-exception/:pageType', wxAppAuth(), otherPagesRedux()],
    
    //购买须知
    ['GET', '/wechat/page/channel-purcase-notice', wxAppAuth(), otherPagesRedux(h.powerCheck, true)],
    // 系列课咨询页面
    ['GET', '/wechat/page/channel-consult', wxAppAuth(), otherPagesRedux()],
    //分销课代表授权添加（系列课）
    ['GET', '/wechat/page/channel-distribution-add/:channelId', wxAppAuth(), otherPagesRedux(h.checkDistributionPower, true)],
    //分销课代表授权添加(通用)
    ['GET', '/wechat/page/auth-distribution-add/:businessId', wxAppAuth(), otherPagesRedux(h.checkDistributionPower, true)],
    //系列课自动分销设置
    ['GET', '/wechat/page/channel-distribution-set/:channelId', wxAppAuth(), otherPagesRedux(h.checkDistributionPower, true)],
    //话题自动分销设置
    ['GET', '/wechat/page/topic-distribution-set/:topicId', wxAppAuth(), topicIntroPage()],
    //系列课分销列表
    ['GET', '/wechat/page/channel-distribution-index-list/:liveId', wxAppAuth(), otherPagesRedux(h.checkDistributionPower, true)],
    //课代表推广明细
    ['GET', '/wechat/page/channel-distribution-represent-detail-list/:businessId', wxAppAuth(), otherPagesRedux(h.checkDistributionDetail, true)],
    ['GET', '/wechat/page/distribution-represent-detail-list/:businessId', wxAppAuth(), otherPagesRedux(h.checkDistributionDetail, true)],
    //邀请卡
    ['GET', '/wechat/page/share-card-channel/:channelId', wxAppAuth(), otherPagesRedux()],
    //推广名额已领取完页
    ['GET', '/wechat/page/channel-distribution-nomore-represent/:channelId/:userId', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux()],
    //课代表名额已领取完页
    ['GET', '/wechat/page/distribution/present-nomore/:userId', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux()],
    // 拼课
    ['GET', '/topic/channel-group', wxAppAuth(), otherPagesRedux(h.channelGroup, true)],
    // 全部拼课 创建者 管理员查看
    ['GET', '/wechat/page/splicing-all', wxAppAuth(), topicIntroPage()],
    // 快捷拼课页面
    ['GET', '/wechat/page/channel-group-list', wxAppAuth(), otherPagesRedux(h.channelGroupListHandle, true)],
    //课程定制
    ['GET', '/wechat/page/subscribe-custom-made', wxAppAuth(), otherPagesRedux(h.periodTabSelectHandle, true)],
    ['GET', '/wechat/page/dingzhi', wxAppAuth(), otherPagesRedux(h.periodCourseHandle, true)], //一开始验证是否有订阅定制课程
    ['GET', '/wechat/page/subscribe-qrcode', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/subscribe-card', wxAppAuth(), otherPagesRedux(h.periodCardHandle, true)],
    //完成支付
    ['GET', '/wechat/page/finish-pay', wxAppAuth(), otherPagesRedux(h.finishPayHandle, true)],
    // 新版支付成功页面
    ['GET', '/wechat/page/new-finish-pay', wxAppAuth(), topicIntroPage()],
    // pay-success页面
    ['GET', '/wechat/page/pay-success', wxAppAuth(), topicIntroPage()],
    // 裂变课支付成功页面
    ['GET', '/wechat/page/fission-finish-pay', wxAppAuth(), topicIntroPage()],
	//完成支付贴图预览
	['GET', '/wechat/page/finish-pay-paster-preview', clientParams(), otherPagesRedux()],
	//投诉原因
    ['GET', '/wechat/page/complain-reason', wxAppAuth(), otherPagesRedux()],
    //投诉页面
    ['GET', '/wechat/page/complain-details', wxAppAuth(), otherPagesRedux()],
    //创建评价
    ['GET', '/wechat/page/evaluation-create/:topicId', wxAppAuth(), otherPagesRedux(h.evaluationCreateHandle, true)],
    //系列课评价
    ['GET', '/wechat/page/channel-evaluation-list/:channelId', wxAppAuth(), otherPagesRedux(h.evaluationListHandle, true)],
    //话题评价
    ['GET', '/wechat/page/topic-evaluation-list/:topicId', wxAppAuth(), otherPagesRedux(h.evaluationListHandle, true)],
    //话题分销用户列表
    ['GET', '/wechat/page/topic-distribution-list/:topicId', wxAppAuth(), otherPagesRedux()],
    //个人中心页
    // 收益相关页面
    ['GET', '/wechat/page/live/profit/overview/:liveId', wxAppAuth(), otherPagesRedux(h.overview, true)],
    ['GET', '/wechat/page/live/profit/withdraw/:liveId', wxAppAuth(), otherPagesRedux(h.overview, true)],
    ['GET', '/wechat/page/live/profit/checklist/:liveId', wxAppAuth(), otherPagesRedux(h.checklist, true)],
    ['GET', '/wechat/page/live/profit/checking/:liveId', wxAppAuth(), otherPagesRedux(h.overview, true)],
    ['GET', '/wechat/page/live/profit/detail/channel/:channelId', wxAppAuth(), otherPagesRedux(h.detailChannel, true)],
    ['GET', '/wechat/page/live/profit/detail/channel-knowledge/:channelId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live/profit/anslysis/topic/:liveId', wxAppAuth(), otherPagesRedux(h.profitAnalysisTopicHandle, true)],
    ['GET', '/wechat/page/live/profit/anslysis/channel/:liveId', wxAppAuth(), otherPagesRedux(h.profitAnalysisChannelHandle, true)],
    ['GET', '/wechat/page/live/profit/anslysis/recommend/:liveId', wxAppAuth(), otherPagesRedux(h.profitAnalysisRecommendHandle, true)],
    ['GET', '/wechat/page/live/profit/anslysis/recommend-details/:id', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live/profit/analysis/checkinCamp/:liveId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live/profit/detail/checkinCamp/:campId', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live/profit/detail/checkin', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live/profit/detail/problem', wxAppAuth(), otherPagesRedux()],

    ['GET', '/wechat/page/mine',hostValidate('main'), wxAppAuth(), userTag(), otherPagesRedux(h.mineHandle, true)],
    ['GET', '/wechat/page/mine-question', wxAppAuth(), otherPagesRedux(h.mineHandle, true)],
    ['GET', '/wechat/page/mine-profit', wxAppAuth(), otherPagesRedux(h.myWalletHandle, true)],
    ['GET', '/wechat/page/mine-profit/promo-profit', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/mine-profit/promo-withdraw', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/mine-profit/reward-profit', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/low-price-recommend', wxAppAuth(), otherPagesRedux(h.lowPriceRecommendHandle, true)],
    // 我的学员
    ['GET', '/wechat/page/my-student', wxAppAuth(), managerPass(), otherPagesRedux(h.mineHandle, true)],
    //我参与的课程
    ['GET', '/wechat/page/mine/unevaluated', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/mine/joined-topic', wxAppAuth(), otherPagesRedux(h.joinedTopicHandle, true)],

    ['GET', '/wechat/page/phone-auth', wxAppAuth(), otherPagesRedux()],
    // 看过的直播间
    ['GET', '/wechat/page/mine/look-studio', wxAppAuth(), otherPagesRedux()],

    // 已购优惠二期 我参与的课程
    ['GET', '/wechat/page/mine/course', wxAppAuth(), userTag(), otherPagesRedux()],

    ['GET', '/wechat/page/mine/foot-print', wxAppAuth(), userTag(), otherPagesRedux()],
    ['GET', '/wechat/page/mine/collect', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/similarity-course', wxAppAuth(), otherPagesRedux()],

    // 课后作业
    ['GET', '/wechat/page/homework/manage', wxAppAuth(), otherPagesRedux(h.initManage, true)],
    ['GET', '/wechat/page/homework/create', wxAppAuth(), otherPagesRedux(h.initInfo, true)],
    ['GET', '/wechat/page/homework/set-homework-content', wxAppAuth(), otherPagesRedux(h.initInfo, true)],
    ['GET', '/wechat/page/homework/hand-in', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/homework/details', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux(h.initInfo, true)],
    ['GET', '/wechat/page/homework/relate-course', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/homework/mine', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/homework/card', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/homework/error', wxAppAuth(), otherPagesRedux()],
    // 评价设置
    ['GET', '/wechat/page/evaluation-setting', wxAppAuth(), otherPagesRedux(h.isOpenEvaluateHandle, true)],
    //实名认证页面
    ['GET', '/wechat/page/real-name', wxAppAuth(), otherPagesRedux(h.realNameCheck, true)],
    //直播间认证
    ['GET', '/wechat/page/live-auth', wxAppAuth(), otherPagesRedux()],
    //千聊平台讲师协议页面
    ['GET', '/wechat/page/live-protocol', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/sms-protocol', wxAppAuth(), otherPagesRedux()],
    // 报名列表页面
    ['GET', '/wechat/page/join-list/:type', wxAppAuth(), otherPagesRedux(h.joinList, true)],
    ['GET', '/wechat/page/wx-login', otherPagesRedux()],

    //新直播间首页
    // ['GET', '/wechat/page/live/:liveId', knowledgeCodeAuth(), wxAppAuth(), liveStudioApollo(h.newLiveMainHandle)],
    ['GET', '/wechat/page/live/info/:liveId', wxAppAuth(), liveStudioApollo(h.newLiveMainHandle, true)],
    ['GET', '/wechat/page/live/timeline/:liveId', wxAppAuth(), userTag(), otherPagesRedux()],
    ['GET', '/wechat/page/live/courseTable/:liveId', wxAppAuth(), otherPagesApollo()],
    ['GET', '/wechat/page/live/question/:liveId', knowledgeCodeAuth(), wxAppAuth(), otherPagesApollo()],
    ['GET', '/wechat/page/live/vip/:liveId', wxAppAuth(), otherPagesApollo()],
    ['GET', '/wechat/page/live/banner/:liveId', wxAppAuth(), otherPagesRedux(h.liveBannerList, true)],
    ['GET', '/wechat/page/live-banner-editor', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live-topic-channel-selector', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/live-channel-list/:liveId', wxAppAuth(), liveStudioRedux(h.initUserPower, true)],
    ['GET', '/wechat/page/live-topic-list/:liveId', wxAppAuth(), liveStudioRedux()],
    ['GET', '/wechat/page/notice-center', wxAppAuth(), managerPass(),liveStudioRedux()],
    ['GET', '/wechat/page/live-vip-setting', wxAppAuth(), otherPagesRedux()],
    // 直播间会员设置选择页
    ['GET', '/wechat/page/live-vip-setting-types', wxAppAuth(), otherPagesRedux()],
    // 直播间vip收益
    ['GET', '/wechat/page/live-vip-income', wxAppAuth(), otherPagesRedux()],
    // 直播间会员列表
    ['GET', '/wechat/page/live-vip', wxAppAuth(), otherPagesRedux()],
    // 直播间会员详情
    ['GET', '/wechat/page/live-vip-details', wxAppAuth(), silentFollow, h.ifIsBlackGoTo500, otherPagesRedux()],
    // 直播间会员赠礼闲情页
    ['GET', '/wechat/page/vip-gift-details', wxAppAuth(), otherPagesRedux()],
    // 介绍编辑页
    ['GET', '/wechat/page/edit-desc', wxAppAuth(), otherPagesRedux()],

    // 文档下载列表
    ['GET', '/wechat/page/doc-list/:topicId', wxAppAuth(), otherPagesRedux()],
    //系列课数据统计
    ['GET', '/wechat/page/channel-topic-statistics', wxAppAuth(), otherPagesRedux(h.channelStatisticsHandle, true)],
    // 直播间管理后台系列课数据统计入口
    ['GET', '/wechat/page/live-channel-list', wxAppAuth(), otherPagesRedux(h.liveChannelListHandle, true)],

    //嘉宾分成
    ['GET', '/wechat/page/guest-separate/channel-list-c', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/guest-separate/channel-list-b', wxAppAuth(), otherPagesRedux(h.powerCheck, true)],
    ['GET', '/wechat/page/guest-separate/income-detail/:mtype', knowledgeCodeAuth(), wxAppAuth(), otherPagesRedux(h.separateIncomeDetailHandle, true)],
    ['GET', '/wechat/page/guest-separate/setting', wxAppAuth(), otherPagesRedux(h.powerCheck, true)],
    ['GET', '/wechat/page/guest-separate/invitation', wxAppAuth(), otherPagesRedux(h.initInvitation, true)],
    ['GET', '/wechat/page/guest-separate/percent-please', wxAppAuth(), otherPagesRedux(h.initPercentPlease, true)],


    // 动态页
    ['GET', '/wechat/page/timeline', wxAppAuth(), otherPagesRedux(h.timelineHandle, true)],
    ['GET', '/wechat/page/timeline/choose-type', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/timeline/create', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/timeline/mine-focus', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/timeline/new-like', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/course/push/:type/:id', wxAppAuth(), otherPagesRedux(h.coursePushHandle, true)],

    // 消息页
    ['GET', '/wechat/page/messages', wxAppAuth(), otherPagesRedux()],
    // ['GET', '/wechat/page/messages/course-eval', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/comment/bend-manage', wxAppAuth(), commentRedux()],
    ['GET', '/wechat/page/comment/bend-course-list', wxAppAuth(), commentRedux()],
    ['GET', '/wechat/page/comment/bend-course-details', wxAppAuth(), commentRedux()],
    ['GET', '/wechat/page/comment/cend-comment-details', wxAppAuth(), commentRedux()],

    // 粉丝激活
    ['GET', '/wechat/page/fans-active', wxAppAuth(), otherPagesRedux(h.fansActiveHandle, true)],
    // 千聊直通车
    ['GET', '/wechat/page/fans-express', wxAppAuth(), otherPagesRedux(h.fansExpressHandle, true)],

    // 自定义直播间
    ['GET', '/wechat/page/live-studio/custom/:liveId', wxAppAuth(), liveStudioRedux([
        h.studioMineHandle,
        h.newLiveMainHandle,
    ], true)],
    // 特权直播间介绍购买页
    ['GET', '/topic/live-studio-intro', wxAppAuth(), managerPass({
        failHandle: (req, res, next) => {
            res.redirect('/topic/live-studio-intro')
            return false;
        }
    }), liveStudioRedux()],
    // 销售人员推广使用的专业版购买链接
    ['GET', '/wechat/page/live-studio-sales', wxAppAuth(), h.liveStudioSalesHandle],
    ['GET', '/wechat/page/live-studio/intro-nologin', wxAppAuth(), liveStudioRedux(h.introHandle, true)],
    // 特权直播间的个人中心页
    ['GET', '/wechat/page/live-studio/mine', knowledgeCodeAuth(), wxAppAuth(), liveStudioRedux([
        h.studioMineHandle,
        h.newLiveMainHandle,
    ], true)],

    // 特权直播间的简介页
    ['GET', '/wechat/page/live-studio/info', wxAppAuth(), liveStudioRedux([
        h.studioMineHandle,
        h.newLiveMainHandle,
    ], true)],

    // 自定义直播间的我的提问
    ['GET', '/wechat/page/live-studio/mine/question/:liveId', wxAppAuth(), liveStudioRedux()],
    // 特权直播间的个人中心的分销推广页
    ['GET', '/wechat/page/live-studio/my-shares', wxAppAuth(), liveStudioRedux()],
    // 特权直播间的个人中心的待评价页
    ['GET', '/wechat/page/live-studio/my-unevaluated', wxAppAuth(), liveStudioRedux()],
    // 特权直播间的个人中心的课后作业
    ['GET', '/wechat/page/live-studio/my-homework', wxAppAuth(), liveStudioRedux()],
    // 特权直播间的个人中心的学习记录
    ['GET', '/wechat/page/live-studio/my-joined', wxAppAuth(), liveStudioRedux()],
    ['GET', '/wechat/page/live-studio/coupon/preview/:couponId', wxAppAuth(), liveStudioRedux()],
    ['GET', '/wechat/page/studio-coupon-order', wxAppAuth(), liveStudioRedux()],

    // 创建话题
    ['GET', '/wechat/page/topic-create', wxAppAuth(), liveStudioRedux()],
    // 创建系列课
    ['GET', '/wechat/page/channel-create', wxAppAuth(), liveStudioRedux()],
    // ['GET', '/wechat/page/live-studio/coupon/order/:couponId', wxAppAuth(), liveStudioRedux()],

    // 老师自定义模块的页面
    ['GET', '/wechat/page/live-studio/module-custom/:moduleId', wxAppAuth(), liveStudioRedux()],
    ['GET', '/wechat/page/active-value', wxAppAuth(), otherPagesRedux()],
    ['GET', '/wechat/page/active-value/promote', wxAppAuth(), otherPagesRedux()],
    // 学员信息采集
    ['GET', '/wechat/page/live-studio/service-form/:liveId', wxAppAuth(), liveStudioRedux()],
    // 知识通商城
    ['GET', '/wechat/page/live-studio/media-market', wxAppAuth(), liveStudioRedux()],
    // 高分成活动
    ['GET', '/wechat/page/live-studio/media-market/high-division-activity', wxAppAuth({
        allowFree: true
    }), liveStudioRedux()],
    // 热销top10
    ['GET', '/wechat/page/live-studio/media-market/top-ten-course', wxAppAuth({
        allowFree: true
    }), liveStudioRedux(h.topTenCourseHandle, true)],
    // 特惠专区
    ['GET', '/wechat/page/live-studio/media-market/favourable-course', wxAppAuth({
        allowFree: true
    }), liveStudioRedux(h.favourableCourseHandle, true)],
    // 精品推荐
    ['GET', '/wechat/page/live-studio/media-market/boutique-course', wxAppAuth({
        allowFree: true
    }), liveStudioRedux(h.boutiqueCourseHandle, true)],
    // 用户联系方式
    ['GET', '/wechat/page/live-studio/contact-info/:liveId', wxAppAuth(), liveStudioRedux()],
    // 媒体推广投放
    ['GET', '/wechat/page/live-studio/media-promotion/:liveId', wxAppAuth(), liveStudioRedux(h.mediaPromotionHandle, true)],

    // 分类管理
    ['GET', '/wechat/page/live-studio/tag-manage', wxAppAuth(), liveStudioRedux()],
    // 直播间设置
    ['GET', '/wechat/page/live-setting', wxAppAuth(), managerPass(), liveStudioRedux()],
    // 直播间关联公众号
    ['GET', '/wechat/page/live-relate-service', wxAppAuth(),  managerPass(),liveStudioRedux()],

    // 搜索
    ['GET', '/wechat/page/search', wxAppAuth(), otherPagesRedux(h.searchHandle, true)],
    ['GET', '/wechat/page/search/all', wxAppAuth(), otherPagesRedux(h.searchHandle, true)],
    ['GET', '/wechat/page/search/topic', wxAppAuth(), otherPagesRedux(h.searchHandle, true)],
    ['GET', '/wechat/page/search/channel', wxAppAuth(), otherPagesRedux(h.searchHandle, true)],
    ['GET', '/wechat/page/search/live', wxAppAuth(), otherPagesRedux(h.searchHandle, true)],
    ['GET', '/wechat/page/search/updating', wxAppAuth(), otherPagesRedux()],


    ['GET', '/wechat/page/topic-hide', (req, res) => {
        res.render('channel-hide', {
            liveId: req.query.liveId
        });
    }],

    // 活动通用的赠礼领取页面
    ['GET', '/wechat/page/activity-gift', wxAppAuth(), otherPagesRedux()],
    // 活动通用的地址页面
    ['GET', '/wechat/page/activity-address', wxAppAuth(), otherPagesRedux(h.activityAddressPage, true)],
    // 活动入口，创课前置
    ['GET', '/wechat/page/activity-entrance', wxAppAuth(), otherPagesRedux()],
    // 创课前置, 成功页
    ['GET', '/wechat/page/create-live-adv-success', wxAppAuth(), otherPagesRedux()],


    // 个人分销商城
    ['GET', '/wechat/page/coral/mine', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/shop', wxAppAuth(), coralRedux(h.coralShopHandle, true)],
    ['GET', '/wechat/page/coral/shop/push-list', wxAppAuth(), coralRedux(h.initMyIdentity, true)],
    ['GET', '/wechat/page/coral/shop/rank-list', wxAppAuth(), coralRedux(h.initMyIdentity, true)],
    ['GET', '/wechat/page/coral/shop/theme', wxAppAuth(), coralRedux(h.initMyIdentity, true)],
    ['GET', '/wechat/page/coral/shop/theme-card', wxAppAuth(), coralRedux(h.initMyIdentity, true)],
    ['GET', '/wechat/page/coral/focus-middle', wxAppAuth(), coralRedux()],


    ['GET', '/wechat/page/coral/push-order', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/cut-price', wxAppAuth(), coralRedux(h.initCutInfo, true)],
    ['GET', '/wechat/page/coral/profit', wxAppAuth(), coralRedux([
        h.initAccountData
    ], true)],
    ['GET', '/wechat/page/coral/coral-index', wxAppAuth(), coralRedux([
        h.initMyIdentity,
        h.initGiftBagData,
        h.initSubscribe,
    ], true)],
    ['GET', '/wechat/page/coral/intro', wxAppAuth(), coralRedux([
        h.initMyIdentity,
        h.initGiftBagData,
    ], true)],
    ['GET', '/wechat/page/coral/share', wxAppAuth(), coralRedux([
        h.initMyIdentity,
        h.initGiftBagData,
    ], true)],
    ['GET', '/wechat/page/coral/gift-share-card', wxAppAuth(), coralRedux([
        h.initMyIdentity,
        h.initGiftBagData,
    ], true)],
    ['GET', '/wechat/page/coral/focus', wxAppAuth(), coralRedux([
        // h.initMyIdentity,
        h.initGiftBagData,
    ], true)],
    ['GET', '/wechat/page/coral/profit/withdraw', wxAppAuth(), coralRedux([
        h.initAccountData
    ], true)],
    ['GET', '/wechat/page/coral/performance', wxAppAuth(), coralRedux([
        h.initPerformanceThisMonth
    ], true)],
    ['GET', '/wechat/page/coral/performance/history', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/performance/details', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/association', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/association/potential', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/association/list', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/order/details', wxAppAuth(), coralRedux([
        h.initOrderDetails
    ], true)],
    ['GET', '/wechat/page/coralOrderConfirm', wxAppAuth(), coralRedux([
        h.initGiftBagData
    ], true)],
    ['GET', '/wechat/page/coral/author', wxAppAuth(), coralRedux()],
    ['GET', '/wechat/page/coral/bought-course', wxAppAuth(), coralRedux()],
    


    // 训练营
    ['GET', '/wechat/page/camp-join', wxAppAuth(), campRedux([h.initPayCampData])],
    ['GET', '/wechat/page/camp/:campId', wxAppAuth(), campRedux([h.campHandle])],
    ['GET', '/wechat/page/camp-finish-pay', wxAppAuth(), campRedux()],
    ['GET', '/wechat/page/camp-fail-pay', wxAppAuth(), campRedux()],
    ['GET', '/wechat/page/preparation-test', wxAppAuth(), campRedux()],

    ['GET', '/wechat/page/camp-achievement-card', wxAppAuth(), campRedux()],
    ['GET', '/wechat/page/camp-history', wxAppAuth(), campRedux(h.campJoinPower)],
    ['GET', '/wechat/page/camp-preparation-test-result', wxAppAuth(), campRedux()],
    ['GET', '/wechat/page/camp-preview', wxAppAuth(), campRedux()],

    //夜答
    ['GET', '/wechat/page/night-answer', wxAppAuth(), otherPagesRedux([h.nightAnswer, h.nightAnswerList], true)],
    ['GET', '/wechat/page/night-answer-show', wxAppAuth(), otherPagesRedux(h.nightAnswerShow, true)],

    // 媒体版直播间
    ['GET', '/wechat/page/media-studio-buy', wxAppAuth(), liveStudioRedux([
        h.mediaLiveUpgrade
    ], true)],
    ['GET', '/wechat/page/media-studio-paid', wxAppAuth(), liveStudioRedux([
        h.mediaLiveUpgrade,
        h.mediaLivePaid
    ], true)],

    //赠礼
    ['GET', '/wechat/page/gift/:type/:giftId', wxAppAuth(), otherPagesRedux()],

    //赠礼领取成功页面
    ['GET', '/wechat/page/gift-success/:type', wxAppAuth(), otherPagesRedux()],

    /*----- 社群打卡训练营 -----*/
    ['GET', '/wechat/page/camp-detail', knowledgeCodeAuth(), wxAppAuth(), silentFollow, checkInCampRedux(h.checkInCampHandle(false), true)],
    ['GET', '/wechat/page/check-in-camp/new-camp/:liveId', wxAppAuth(), checkInCampRedux(h.checkInCampHandle(true), true)],
    ['GET', '/wechat/page/check-in-camp/edit-camp/:campId/:liveId', wxAppAuth(), checkInCampRedux(h.checkInCampHandle(true), true)],
    ['GET', '/wechat/page/check-in-camp/camp-intro-edit/:campId', wxAppAuth(), checkInCampRedux(h.checkInCampHandle(true), true)],
    ['GET', '/wechat/page/check-in-camp/join-list', wxAppAuth(), checkInCampRedux()],
    ['GET', '/wechat/page/check-in-camp/check', wxAppAuth(), checkInCampRedux()],
    ['GET', '/wechat/page/check-in-camp/create-little-graphic/:liveId/:campId', wxAppAuth(), checkInCampRedux(h.littleGraphicHandle, true)],
    ['GET', '/wechat/page/check-in-camp/check-in-ranking/:campId', knowledgeCodeAuth(), wxAppAuth(), checkInCampRedux(h.checkInCampHandle(false), true)],
    ['GET', '/wechat/page/check-in-camp/check-in-ranking/:campId/:shareUser', wxAuth({
        allowFree: true
    }), checkInCampRedux(h.checkInCampHandle(false), true)],
    ['GET', '/wechat/page/check-in-camp/check-in-diary/:campId', knowledgeCodeAuth(), wxAppAuth(), checkInCampRedux(h.checkInCampHandle(false), true)],
    ['GET', '/wechat/page/check-in-camp/user-manage/:campId', wxAppAuth(), checkInCampRedux(h.checkInCampHandle(true), true)],

    // 直播间打卡训练营列表页面
    ['GET', '/wechat/page/live-studio/checkin-camp-list/:liveId', wxAppAuth(), liveStudioRedux(h.initUserPower, true)],
    ['GET', '/wechat/page/live-studio/training-list/:liveId', wxAppAuth(), liveStudioRedux(h.initUserPower, true)],

    // 取消支付后的关注页面
    ['GET', '/wechat/page/focus-ql', wxAppAuth(), otherPagesRedux()],

    //新人礼包
    ['GET', '/wechat/page/exclusive-gift-package', wxAppAuth(), otherPagesRedux(h.initGiftPackage, true)],
    // 优质课程库
    ['GET', '/wechat/page/excellent-course', wxAppAuth(), otherPagesRedux(h.excellentCourse, true)],
    //分销排行榜
    ['GET', '/wechat/page/distribution/promo-rank', wxAppAuth(), otherPagesRedux(h.promoRankPageHandle, true)],
    // 千聊帮你推授权主页
    ['GET', '/wechat/page/distribution/auth-index', wxAppAuth(), managerPass(), otherPagesRedux()],
    ['GET', '/wechat/page/distribution/live-center-options', wxAppAuth(), otherPagesRedux(h.shareQualifyPo, true)],
    // 通用支付页
    ['GET', '/wechat/page/common-pay', wxAppAuth(), otherPagesRedux()],
    // 直播间分销状态
    ['GET', '/wechat/page/distribution/live-distribution', wxAppAuth(), otherPagesRedux(h.shareQualifyPo, true)],
    // 课程上架协议
    ['GET', '/wechat/page/distribution/protocol', wxAppAuth(), otherPagesRedux()],
    // 订阅直播间
    ['GET', '/wechat/page/subscribe-live', wxAppAuth(), otherPagesRedux(h.isMyLive, true)],
    // 创建直播间
    ['GET', '/wechat/page/create-live', wxAppAuth(), otherPagesRedux()],
    // 直播间创建成功
    ['GET', '/wechat/page/create-live-success', wxAppAuth(), otherPagesRedux()],

	['GET', '/wechat/page/topic-simple-video', (req, res, next) => {
		req.aliVideoPlayerjs = true;
		if (envi.isPc(req)) {
			req.isPc = true;
		}

		next();
	}, wxAppAuth(), videoCourseRedux(h.videoCourseSimpleModeHandle, true)],
	// 新用户访问三方域名授权失败时调用，先授权主站
	// ['GET', '/wechat/page/authMainSite', wxAppAuth(), (req, res, next) => {
     //    const redirectUrl = lo.get(req, 'query.redirectUrl', '');
     //    if(redirectUrl){
     //        res.redirect(redirectUrl);
     //    }else{
	//         res.redirect('/');
     //    }
    // }],

    // 发红包
    ['GET', '/wechat/page/red-envelope', wxAppAuth(), otherPagesRedux(h.getRedEnvelopePower, true)],
    // 红包详情
    ['GET', '/wechat/page/red-envelope-detail', wxAppAuth(), otherPagesRedux()],
    // 红包收益
    ['GET', '/wechat/page/red-envelope-income', wxAppAuth(), otherPagesRedux()],
    // 历史嘉宾
    ['GET', '/wechat/page/guest-list', wxAppAuth(), thousandLivePage()],
    // 直播间推送课程
    ['GET', '/wechat/page/live-push-message', wxAppAuth(), liveStudioRedux(h.courseInfoHandle, true)],
    // 今日推荐
    ['GET', '/wechat/page/live-recommend', wxAppAuth(), liveStudioRedux()],
    // 服务号对接
    ['GET', '/wechat/page/service-number-docking', wxAppAuth(), managerPass(), liveStudioRedux()],
    // 每天学
    ['GET', '/wechat/page/learn-everyday',hostValidate('main'), wxAppAuth(), otherPagesRedux()],
    // 数据统计
    ['GET', '/wechat/page/live-data-statistics', wxAppAuth(), liveStudioRedux(h.liveDataStatistics, true)],
    // 模拟群聊
    ['GET', '/wechat/page/simulation-group', wxAppAuth(), liveStudioRedux()],
    // 如何提升课程指数
    ['GET', '/wechat/page/live-promote-method', wxAppAuth(), liveStudioRedux(h.howToPromoteCourseIndex, true)],

    // 千聊会员相关页面
	['GET', '/wechat/page/membership-center', wxAppAuth(), silentFollow, membershipRedux(h.memberCenterHandle, true)],
	['GET', '/wechat/page/membership-master', wxAppAuth(), membershipRedux(h.memberMasterHandle, true)],
	['GET', '/wechat/page/membership/invitation', wxAppAuth(), membershipRedux(h.invitationHandle, true)],
	['GET', '/wechat/page/membership/invitation/card/:memberId', wxAppAuth(), membershipRedux(h.invitationCardHandle, true)],
	['GET', '/wechat/page/membership/invitation/card', wxAppAuth(), membershipRedux(h.invitationCardHandle, true)],
	['GET', '/wechat/page/membership/invitation/receive', wxAppAuth(), membershipRedux(h.invitationReceiveHandle, true)],
	['GET', '/wechat/page/membership-free-courses', wxAppAuth(), membershipRedux(h.memberFreeCourseHandle, true)],
	['GET', '/wechat/page/membership/rules-intro', wxAppAuth(), membershipRedux()],
    // 邀请好友学习
    ['GET', '/wechat/page/topic-invite', wxAppAuth(), topicIntroPage()],
    ['GET', '/wechat/page/friend-invite', wxAppAuth(), topicIntroPage()], // 新开路由 :todo 有时间迁移到 activity 项目
    ['GET', '/wechat/page/live/message/:liveId', wxAppAuth(), managerPass(), feedbackPagesRedux()],
    ['GET', '/wechat/page/live/messageManage/:topicId', wxAppAuth(), managePassForConsult, feedbackPagesRedux()],
    
    ['GET', '/wechat/page/help-center', wxAppAuth(), feedbackPagesRedux()],
    ['GET', '/wechat/page/help-center/cate/:category', wxAppAuth(), feedbackPagesRedux()],
    ['GET', '/wechat/page/help-center/faq/:id', wxAppAuth(), feedbackPagesRedux()],
    ['GET', '/wechat/page/feedback*', wxAppAuth(), feedbackPagesRedux()],
    ['GET', '/wechat/page/my-feedback', wxAppAuth(), feedbackPagesRedux()],

    // 千聊会员合作签订
    ['GET', '/wechat/page/qlchat-vip-cooperation', wxAppAuth(), otherPagesRedux()],
    // 精选课
    ['GET', '/wechat/page/choice-course', wxAppAuth(), otherPagesRedux()],
    // b端报名成功中转页 ---- 已迁移，下次再删
    ['GET', '/wechat/page/course-registry-success', wxAppAuth(), otherPagesRedux()],
    // 社群二维码页面
    ['GET', '/wechat/page/community-qrcode', wxAppAuth(), otherPagesRedux()],

    // 我的积分
    ['GET', '/wechat/page/point/mine', wxAppAuth(), pointRedux()],
    // 奖品详情
    ['GET', '/wechat/page/point/gift-detail', wxAppAuth(), pointRedux()],
    // 已领奖品
    ['GET', '/wechat/page/point/received', wxAppAuth(), pointRedux()],
    // 设置打卡提醒
    ['GET', '/wechat/page/point/attend-remind', wxAppAuth(), pointRedux()],

    //直播间管理后台
    ['GET', '/wechat/page/backstage', wxAppAuth(), backstageRedux(h.backstage, true)],
    ['GET', '/wechat/page/live-change', wxAppAuth(), backstageRedux(h.backstageChangePage, true)],
    ['GET', '/wechat/page/auth-distribute', wxAppAuth(), backstageRedux(h.liveDistributePrower, true)],
    

    
    // 训练营详情
    ['GET', '/wechat/page/training-camp', wxAppAuth(), topicIntroPage(h.TrainingCampHandle, true)],
    // 训练营证书
    ['GET', '/wechat/page/certificate', wxAppAuth(), topicIntroPage()],
    
    // 新训练营详情
    ['GET', '/wechat/page/training-intro', wxAppAuth(), topicIntroPage(h.TrainingIntroHandle, true)],
    // 训练营完善信息
    ['GET', '/wechat/page/training-student-info', wxAppAuth(), topicIntroPage([h.TrainingAuthorHandle, h.TrainingStudentInfo], true)],
    // 训练营学习页面
    ['GET', '/wechat/page/training-learn', wxAppAuth(), topicIntroPage([h.TrainingAuthorHandle, h.TrainingLearnInfoHandle], true)],
    // 训练营班级服务
    ['GET', '/wechat/page/training/class-service', wxAppAuth(), topicIntroPage([h.TrainingAuthorHandle, h.TrainingLearnInfoHandle], true)],
    // 训练营学习记录
    ['GET', '/wechat/page/learn-record', wxAppAuth(), topicIntroPage([h.TrainingAuthorHandle, h.TrainingLearnRecordHandle], true)],
    // 训练营全部课程
    ['GET', '/wechat/page/training-class', wxAppAuth(), topicIntroPage(h.TrainingAuthorHandle, true)],
    // 训练营作业详情
    ['GET', '/wechat/page/training-details', wxAppAuth(), topicIntroPage()],
    // 训练营成就卡
    ['GET', '/wechat/page/training-checkin', wxAppAuth(), topicIntroPage(h.TrainingAuthorHandle, true)],
    // 训练营成就卡 展示页
    ['GET', '/wechat/page/training-card', wxAppAuth(), topicIntroPage()],
    // 训练营作业列表
    ['GET', '/wechat/page/training-homework', wxAppAuth(), topicIntroPage([h.TrainingAuthorHandle, h.TrainingLearnInfoHandle], true)],

    // 知识新闻
    ['GET', '/wechat/page/knowledge-news', wxAppAuth(), otherPagesRedux()],
    // 听书列表
    ['GET', '/wechat/page/books-lists', wxAppAuth(), otherPagesRedux()],
    // 听书首页 
    ['GET', '/wechat/page/books-home', wxAppAuth(), otherPagesRedux()],
    // 全部听书
    ['GET', '/wechat/page/books-all', wxAppAuth(), otherPagesRedux()],
    // 听书排行
    ['GET', '/wechat/page/books-ranking', wxAppAuth(), otherPagesRedux()],
    // 书单列表
    ['GET', '/wechat/page/book-list', wxAppAuth(), otherPagesRedux()],
    // 书单详情
    ['GET', '/wechat/page/book-details', wxAppAuth(), otherPagesRedux()],
    // 书单二级页面
    ['GET', '/wechat/page/book-secondary', wxAppAuth(), otherPagesRedux()],

    // 购买记录
    ['GET', '/wechat/page/mine/buy', wxAppAuth(), mineRedux()],
    ['GET', '/wechat/page/mine/logout-rule', wxAppAuth(), mineRedux()],
    ['GET', '/wechat/page/mine/enter-logout', wxAppAuth(), mineRedux()],
    ['GET', '/wechat/page/mine/verification-vode', wxAppAuth(), mineRedux()],

    ['GET', '/wechat/page/mine/user-info', knowledgeCodeAuth(), wxAppAuth(), mineRedux()],
    ['GET', '/wechat/page/mine/business-payment-takeincome',  wxAppAuth(), managerPass(), mineRedux()],
    ['GET', '/wechat/page/mine/takeincome-record',  wxAppAuth(), managerPass(), mineRedux()],
    

    // 引导关注千聊知识店铺
    ['GET', '/wechat/page/share-guide', wxAppAuth(), liveStudioRedux()],

    ['GET', '/wechat/page/send-invitation-live', wxAppAuth(), liveStudioRedux()],

    ['GET', '/wechat/page/short-knowledge/video-list', wxAppAuth(), shortKnowledgeRedux()],
    
    ['GET', '/wechat/page/short-knowledge/create', wxAppAuth(), shortKnowledgeRedux()],
    ['GET', '/wechat/page/short-knowledge/publish', wxAppAuth(), shortKnowledgeRedux(h.getShortknowledgeData, true)],
    ['GET', '/wechat/page/short-knowledge/ppt-edit', wxAppAuth(), shortKnowledgeRedux(h.pptEditPageHandler, true)],
    
    // 短知识详情页在微信端使用其他域名访问，这里需要区分使用不同的中间件
    ['GET', '/wechat/page/short-knowledge/video-show', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), shortKnowledgeRedux(h.initShortknowledgeData)],
    ['GET', '/wechat/page/short-knowledge/recommend', wxAppAuth(), shortKnowledgeRedux()],
    ['GET', '/wechat/page/short-knowledge/sort', wxAppAuth(), shortKnowledgeRedux()],
    ['GET', '/wechat/page/short-knowledge/hot-recommend', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin:conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin:conf.mode === 'prod' ? wxHqAuth() : null,
        }), shortKnowledgeRedux()],
    // 直播中心子站点
    ['GET', '/wechat/page/live-center/free-column', wxAppAuth(), freeColumnRedux()],
    
    // 学员考试
    ['GET', '/wechat/page/student-exam', wxAppAuth(), homeWorkRedux()],
    // 查看成绩
    ['GET', '/wechat/page/exam-card', wxAppAuth(), homeWorkRedux()],
    // 查看解析
    ['GET', '/wechat/page/exam-analysis', wxAppAuth(), homeWorkRedux()],

    // 回收站
    ['GET', '/wechat/page/recycle', wxAppAuth(), otherPagesRedux(h.recycleHandle, true)],
    // 权限管理
    ['GET', '/wechat/page/userManager/:liveId', wxAppAuth(), otherPagesRedux(h.userManagerHandle, true)],
    // 学员作业 考试形式
    ['GET', '/wechat/page/homework-exam', wxAppAuth(), homeWorkRedux(h.homeworkExamHandler, true)],
    // 通用支付页
    ['GET', '/wechat/page/payment', hostValidate('main'), wxAppAuth(), commonPage()],

    // 订阅号跳转页
    ['GET', '/wechat/page/share-card-subscribe', hostValidate('main'), wxAppAuth(), commonPage()],

    /******************* 女性大学 ************************/
    ['GET', '/wechat/page/university/home', hostValidate('main'), wxAppAuth(), femaleUniversityRedux([h.handleBuySratus, h.handleHomeData])],
    ['GET', '/wechat/page/join-university', hostValidate('main'), wxAppAuth(), femaleUniversityRedux(h.handlePurchased, true)],
    ['GET', '/wechat/page/join-university-countdown', wxAppAuth(), femaleUniversityRedux(h.handlePurchased, true)],
    ['GET', '/wechat/page/join-university-success', wxAppAuth(), femaleUniversityRedux(h.handleBuySratus, true)],
    ['GET', '/wechat/page/join-university-courses', wxAppAuth(), univFollow(), femaleUniversityRedux()],
    ['GET', '/wechat/page/university-colleges-intro', wxAppAuth(), univFollow(), femaleUniversityRedux()],
    ['GET', '/wechat/page/university/my-file', wxAppAuth(), femaleUniversityRedux(h.handleFileLimit, true)], 

    ['GET', '/wechat/page/flag-home', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux([h.handleBuySratus,h.handleFlagSratus], true)], 
    ['GET', '/wechat/page/university/flag-add', hostValidate('main'), wxAppAuth(), femaleUniversityRedux(h.handleBuySratus, true)],
    ['GET', '/wechat/page/flag-list', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux(h.handleBuySratus, true)],
    ['GET', '/wechat/page/university/flag-wait', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux([h.handleBuySratus,h.handleFlagWaitSratus], true)],
    ['GET', '/wechat/page/flag-recard', hostValidate('main'), wxAppAuth(), femaleUniversityRedux([h.handleBuySratus,h.handleFlagSratus], true)],
    ['GET', '/wechat/page/university/flag-publish', hostValidate('main'), wxAppAuth(), femaleUniversityRedux([h.handleBuySratus,h.handleFlagSratus], true)],
    ['GET', '/wechat/page/university/flag-card-detail', hostValidate('shortKnowledge'), 
    // 只有生产环境微信端才需要更换域名
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
        other:wxAppAuth(),
    }),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? wxHqAuth() : null,
    }), femaleUniversityRedux( h.handleCardData, true)],
    ['GET', '/wechat/page/university/flag-show', hostValidate('shortKnowledge'), 
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux()], 
    //查看其他人目标
    ['GET', '/wechat/page/flag-other', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux([h.handleBuySratus], true)],    
    //测评页
    ['GET', '/wechat/page/university/course-exam', wxAppAuth(), femaleUniversityRedux()],  
    //学习建议
    ['GET', '/wechat/page/university-study-advice', wxAppAuth(), femaleUniversityRedux()],  
    // 处理珊瑚分销兑换码
    ['GET', '/wechat/page/join-university-from-coral', wxAppAuth(), femaleUniversityRedux(h.handleBuyFromCoral, true)],

    // 体验营
    ['GET', '/wechat/page/un-experience-camp', wxAppAuth(), univFollow(), femaleUniversityRedux()],

    // 体验营
    ['GET', '/wechat/page/statistical-table', wxAppAuth(), univFollow(), femaleUniversityRedux()],

    // 新体验营
    ['GET', '/wechat/page/university-experience-camp',hostValidate('main'), wxAppAuth(), univFollow(), femaleUniversityRedux(h.handleExpCamp, true)],
    // 新体验营活动
    ['GET', '/wechat/page/experience-camp-activity', wxAppAuth(), femaleUniversityRedux()],
    // 新体验营邀请有礼活动
    ['GET', '/wechat/page/experience-camp-invite', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux(h.handleInviteData,true)],   
        // 新体验营邀请有礼活动
    ['GET', '/wechat/page/experience-camp-invite-list', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux()],    
    // 绑定第三方并跳转
    ['GET', '/wechat/page/experience-bind', wxAppAuth(), femaleUniversityRedux(h.handleBindAndJump, true)],
    // 新体验营兜底页
    ['GET', '/wechat/page/experience-bottom', wxAppAuth(), univFollow(), femaleUniversityRedux(h.handleExpCamp, true)],
    
    // 新体验营列表
    ['GET', '/wechat/page/experience-camp-list', wxAppAuth(), femaleUniversityRedux(h.handleExpCamp, true)],
    // 外部兑换码
    ['GET', '/wechat/page/experience-camp-exchange', wxAppAuth(), femaleUniversityRedux()],
    // app 支付成功页
    ['GET', '/wechat/page/university-experience-success', wxAppAuth(), femaleUniversityRedux(h.handleExpCamp, true)],
    // 新体验营提现
    ['GET', '/wechat/page/experience-camp-withdraw', wxAppAuth(), femaleUniversityRedux()],
    // 新体验营提现
    ['GET', '/wechat/page/experience-camp-scholarship', wxAppAuth(), femaleUniversityRedux()],
    // 新体验营提现列表
    ['GET', '/wechat/page/experience-camp-withdraw-list', wxAppAuth(), femaleUniversityRedux()],
    
    // 亲友卡领取成功页
    ['GET', '/wechat/page/university-experience-card', wxAppAuth(), femaleUniversityRedux(h.handleFamilyCardBind, true)],
    ['GET', '/wechat/page/university-family-other', wxAppAuth(), femaleUniversityRedux()],
    ['GET', '/wechat/page/family-camp-list', wxAppAuth(), femaleUniversityRedux()],
    
    // 活动链接
    ['GET', '/wechat/page/university-activity-url', hostValidate('shortKnowledge'),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
        other:wxAppAuth(),
    }),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? wxHqAuth() : null,
    }), femaleUniversityRedux(h.handleExpCamp, true)],  
    // 二维码
    ['GET', '/wechat/page/university/show-qrcode', wxAppAuth(),  femaleUniversityRedux()],
    // 学习营-每日打卡-人气值实时榜单
    ['GET', '/wechat/page/university/popularity-rank', wxAppAuth(),  femaleUniversityRedux(h.handleBuySratus, true)],
    // 打卡日历
    ['GET', '/wechat/page/university/open-calendar', wxAppAuth(),  femaleUniversityRedux(h.handleBuySratus, true)],
    // 组合购活动
    ['GET', '/wechat/page/compose-activity', wxAppAuth(), femaleUniversityRedux()],
    
    // 理财训练营
    ['GET', '/wechat/page/experience-finance', wxAppAuth(), univFollow(), femaleUniversityRedux()],
    // 理财训练营兜底页
    ['GET', '/wechat/page/experience-finance-bottom', wxAppAuth(), univFollow(), femaleUniversityRedux()],
    // 理财训练营成功页
    ['GET', '/wechat/page/experience-finance-card', wxAppAuth(), femaleUniversityRedux()],
    // 理财训练营购买记录
    ['GET', '/wechat/page/experience-finance-bought', wxAppAuth(), femaleUniversityRedux()],
    // 海报页二维码
    ['GET', '/wechat/page/experience-finance-poster', wxAppAuth(), femaleUniversityRedux()],
    // 理财训练营奖学金
    ['GET', '/wechat/page/experience-finance-scholarship', wxAppAuth(), femaleUniversityRedux()],
    // 理财训练营提现
    ['GET', '/wechat/page/experience-finance-withdraw', wxAppAuth(), femaleUniversityRedux()],
    // 邀请明细
    ['GET', '/wechat/page/experience-finance-invite-detail', wxAppAuth(), femaleUniversityRedux()],
    // 蜕变笔记本
    ['GET', '/wechat/page/university-ebook', femaleUniversityRedux('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), communityRedux(h.handleCampStatus, true)],
    // 电子相册
    ['GET', '/wechat/page/university-albums', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), femaleUniversityRedux(h.handleCampStatus, true)],

    /*========================= 社区 ============================*/
    ['GET', '/wechat/page/test', wxAppAuth(), communityRedux()],
    ['GET', '/wechat/page/university/community-home', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), communityRedux(h.getStudentInfoData, true)],      
    
    //话题列表
    ['GET', '/wechat/page/university/community-list-topic', hostValidate('shortKnowledge'),
        // 只有生产环境微信端才需要更换域名
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
            other:wxAppAuth(),
        }),
        autoDeviceRoute({
            weixin: conf.mode === 'prod' ? wxHqAuth() : null,
        }), communityRedux()],        
    //想法详情 
    ['GET', '/wechat/page/university/community-detail', hostValidate('shortKnowledge'),
    // 只有生产环境微信端才需要更换域名
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
        other:wxAppAuth(),
    }),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? wxHqAuth() : null,
    }), communityRedux()],  
    //社区话题 
    ['GET', '/wechat/page/university/community-topic', hostValidate('shortKnowledge'),
    // 只有生产环境微信端才需要更换域名
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
        other:wxAppAuth(),
    }),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? wxHqAuth() : null,
    }), communityRedux(h.getCommunityTopicData, true)],
    //社区广场 
    ['GET', '/wechat/page/university/community-center', hostValidate('shortKnowledge'),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? actAuth() : wxAppAuth(),
        other:wxAppAuth(),
    }),
    autoDeviceRoute({
        weixin: conf.mode === 'prod' ? wxHqAuth() : null,
    }), communityRedux(h.getCommunityCenterData, true)],  

    ['GET', '/wechat/page/university/fan-attention', wxAppAuth(), communityRedux(h.handleBuySratus, true)],
    ['GET', '/wechat/page/community/excellent-person', hostValidate('main'), wxAppAuth(), communityRedux()],

    /***   匹配所有(女子大学)university下的路由,并进行权限拦截   ***/
    ['GET', '/wechat/page/university/*', wxAppAuth(), femaleUniversityRedux(h.handleBuySratus, true)],
];

module.exports = routeDefinitions;

module.exports.otherPagesRedux = otherPagesRedux;
module.exports.otherPagesApollo = otherPagesApollo;
module.exports.thousandLivePage = thousandLivePage;
module.exports.topicIntroPage = topicIntroPage;
module.exports.liveStudioApollo = liveStudioApollo;
module.exports.audioGraphicPage = audioGraphicPage;
module.exports.coralRedux = coralRedux;
module.exports.membershipRedux = membershipRedux;
module.exports.commonPage = commonPage;
