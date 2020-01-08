const lo = require('lodash');

const proxy = require('../../components/proxy/proxy')
const conf = require('../../conf')

const clientParams = require('../../middleware/client-params/client-params')
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth')
const appAuth = require('../../middleware/auth/1.0.0/app-auth')
const resProcessor = require('../../components/res-processor/res-processor')
const requestProcess = require('../../middleware/request-process/request-process')

function getIsLiveAdmin (params, req) {
    return proxy.apiProxyPromise(conf.adminApi.adminFlag, params, conf.adminApi.secret, req);
}

module.exports = [
    // 查询四个tab
    ['GET', '/api/wechat/live-studio/function-menu/get', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.functionMenu, conf.adminApi.secret)],
    // 查询动态，系列课。话题菜单
    ['GET', '/api/wechat/live-studio/page-menu/get', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.pageMenu, conf.adminApi.secret)],
    // 查询直播间扩展信息
    ['GET', '/api/wechat/live-studio/extend', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.extend, conf.adminApi.secret)],
    // 保存直播间自定义信息
    ['POST', '/api/wechat/live-studio/user-defined/save', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.userDefined, conf.adminApi.secret)],
    ['GET', '/api/wechat/studio/my-share', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.myShare, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/unevaluated', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.unevaluated, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/my-joined', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.learnCourse, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/my-homework', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.myHomework, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/my-question', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.myAsk, conf.adminApi.secret)],
    ['GET', '/api/wechat/studio/is-live-admin', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.adminFlag, conf.adminApi.secret)],

    ['POST', '/api/wechat/studio/coupon/create-liveroom', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.createLiveroom, conf.adminApi.secret)],
    ['GET', '/api/wechat/studio/coupon/info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.couponInfo, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/coupon/bind-code', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.bindCouponCode, conf.adminApi.secret)],

    ['GET', '/api/wechat/studio/live/layout', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.layout, conf.adminApi.secret)],
    ['GET', '/api/wechat/studio/page-share', wxAuth(), requestProcess(conf.baseApi.studio.pageShare, conf.baseApi.secret)],
    ['GET', '/api/wechat/studio/module-info', wxAuth(), requestProcess(conf.baseApi.studio.moduleInfo, conf.baseApi.secret)],
    // 查询直播间自定义信息
    ['GET', '/api/wechat/live-studio/page-config', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.pageConfig, conf.adminApi.secret)],
    // 查询直播间自定义信息
    ['POST', '/api/wechat/live-studio/save-page-config', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.savePageConfig, conf.adminApi.secret)],
    // 保存功能模块显示状态
    ['POST', '/api/wechat/live-studio/save-function', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.saveFunction, conf.adminApi.secret)],
    // 保存页面模块排序
    ['POST', '/api/wechat/live-studio/save-layout', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.saveLayout, conf.adminApi.secret)],
    // 保存页面信息
    ['POST', '/api/wechat/live-studio/save-page-info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.savePageInfo, conf.adminApi.secret)],
    // 提交页面pv
    ['POST', '/api/wechat/live-studio/module-pv', requestProcess(conf.adminApi.modulePv, conf.adminApi.secret)],
    // 学员信息采集
    ['POST', '/api/wechat/studio/save-student-info',clientParams(), appAuth(), wxAuth(),  requestProcess(conf.adminApi.collection.saveStudentInfo, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/check-user', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.collection.checkUser, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/region-select', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.collection.regionSelect, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/get-form-fields', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.collection.getFormFields, conf.adminApi.secret)],
    ['POST', '/api/wechat/studio/get-user-detail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.adminApi.collection.getUserDetail, conf.adminApi.secret)],
    // 知识商城标签
    ['POST', '/api/wechat/studio/mediaMarket/courseTagList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.courseTagList, conf.adminApi.secret)],
    // 知识商城系列课列表
    ['POST', '/api/wechat/studio/mediaMarket/courseList', clientParams(), requestProcess(conf.baseApi.mediaMarket.courseList, conf.adminApi.secret)],
    // 上 、下架转播系列课
    ['POST', '/api/wechat/studio/mediaMarket/upOrDownCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.upOrDownCourse, conf.adminApi.secret)],
    // 转播系列课
    ['POST', '/api/wechat/studio/mediaMarket/reprintChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.reprintChannel, conf.adminApi.secret)],
    // 删除转播的系列课
    ['POST', '/api/wechat/studio/mediaMarket/deleteReChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.deleteReChannel, conf.adminApi.secret)],
    // 获取转播系列课列表
    ['POST', '/api/wechat/studio/mediaMarket/getReprintChannelList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.getReprintChannelList, conf.adminApi.secret)],
    // 判断是否有知识通管理权限
    ['POST', '/api/wechat/studio/mediaMarket/hasAdminPower', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.hasAdminPower, conf.adminApi.secret)],
    // 获取代理商信息
    ['POST', '/api/wechat/studio/mediaMarket/agentInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.agentInfo, conf.adminApi.secret)],
    // 获取二级代理商申请信息
    ['POST', '/api/wechat/studio/mediaMarket/applyInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.applyInfo, conf.adminApi.secret)],
    // 提交代理申请
    ['POST', '/api/wechat/studio/mediaMarket/applyAgent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.applyAgent, conf.adminApi.secret)],
    // 获取自媒体开通信息
    ['POST', '/api/wechat/studio/mediaMarket/isActive', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.isActive, conf.adminApi.secret)],
    // 获取用户手机号码和自媒体版业务负责人的微信
    ['POST', '/api/wechat/studio/mediaMarket/contactInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.getContactInfo, conf.adminApi.secret)],
    // 保存用户的手机号码
    ['POST', '/api/wechat/studio/mediaMarket/savePhoneNumber', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.savePhoneNumber, conf.adminApi.secret)],
    // 用户是否开启自动推广
    ['POST', '/api/wechat/studio/mediaMarket/isAutoPromote', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.isAutoPromote, conf.adminApi.secret)],
    // 保存用户设置的自动推广状态
    ['POST', '/api/wechat/studio/mediaMarket/saveAutoPromote', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.saveAutoPromote, conf.adminApi.secret)],
    // 获取备选系列课列表数据
    ['POST', '/api/wechat/studio/mediaMarket/alternativeChannels', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.alternativeChannels, conf.adminApi.secret)],
    // 获取投放中系列课列表数据
    ['POST', '/api/wechat/studio/mediaMarket/promotionalChannels', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.promotionalChannels, conf.adminApi.secret)],
    // 单个系列课关闭/申请推广
    ['POST', '/api/wechat/studio/mediaMarket/savePromote', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.savePromote, conf.adminApi.secret)],
    // 保存系列课的推文信息
    ['POST', '/api/wechat/studio/mediaMarket/saveTweet', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.saveTweet, conf.adminApi.secret)],
    // 已经投放的系列课下架
    ['POST', '/api/wechat/studio/mediaMarket/offshelf', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.offshelf, conf.adminApi.secret)],
    // 保存系列课的分成比例
    ['POST', '/api/wechat/studio/mediaMarket/savePercent', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.savePercent, conf.adminApi.secret)],
    // 获取系列课进入备选库的条件
    ['POST', '/api/wechat/studio/mediaMarket/getConditions', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.getConditions, conf.adminApi.secret)],
    ['GET', '/api/wechat/studio/mediaMarket/getRelayInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.getRelayInfo, conf.adminApi.secret)],
    // 判断直播间是否是分销
    ['POST', '/api/wechat/live-studio/isEnterPage', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.excellentCourse.isEnterPage, conf.adminApi.secret)],
    // 转载后通知
    ['POST', '/api/wechat/studio/getPushStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.getPushStatus, conf.baseApi.secret)],
    ['POST', '/api/wechat/studio/myLiveEntity', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.myLiveEntity, conf.baseApi.secret)],
    // 知识通商城课程上架数量
	['POST', '/api/wechat/mediaMarket/knowledgeCourseInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.knowledgeCourseInfo, conf.baseApi.secret)],

    // 高分成活动课程列表
    ['POST', '/api/wechat/studio/activityCoursesList', clientParams(), requestProcess(conf.baseApi.mediaMarket.activityCoursesList, conf.baseApi.secret)],
    // 知识通商城首页banners
    ['POST', '/api/wechat/studio/knowledgeBannersList', clientParams(), requestProcess(conf.baseApi.mediaMarket.knowledgeBannersList, conf.baseApi.secret)],
     // 热销课程
     ['POST', '/api/wechat/studio/hotCourseList', clientParams(), requestProcess(conf.baseApi.mediaMarket.hotCourseList, conf.baseApi.secret)],
     // 特惠专区
     ['POST', '/api/wechat/studio/discountCourseList', clientParams(), requestProcess(conf.baseApi.mediaMarket.discountCourseList, conf.baseApi.secret)],
]

module.exports.getIsLiveAdmin = getIsLiveAdmin;
