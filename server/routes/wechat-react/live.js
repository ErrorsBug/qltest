import lo from 'lodash';

var liveApi = require('../../api/wechat/live');
var mineApi = require('../../api/wechat/mine');
var resProcessor = require('../../components/res-processor/res-processor');
var topicApi = require('../../api/wechat/topic');
const channelApi = require('../../api/wechat/channel');
var timelineApi = require('../../api/wechat/timeline.js');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
import {
    initRelaNameInfo,
    initLiveInfo,
    initLiveSymbol,
    initPower,
    initLiveTimeline,
    initLiveFocus,
    setBannerList,
    setAuditedStatues,
    setVipInfo,
    initExtendData,
} from '../../../site/wechat-react/other-pages/actions/live';
import {
    updateUserPower,
    setIsLiveAdmin,
    initUserInfo,
    setIsLiveMedia,
    initSubscribeInfo,
    setLivePrice,
} from '../../../site/wechat-react/other-pages/actions/common';
import {
    initTopicData,initChannelData,initCampData
} from '../../../site/wechat-react/live-studio/actions/course-info';
import { isLiveAdmin } from '../../../site/wechat-react/actions/common';

/**
 * 直播间相关store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function realNameCheck(req, res, store) {
    const liveId = lo.get(req, 'query.liveId') || false;
    if(!!liveId && liveId != 'undefined'){
        let params = {
            userId: lo.get(req, 'rSession.user.userId'),
            liveId: lo.get(req, 'query.liveId'),
            type: lo.get(req, 'query.type'),
        };
    
        try {
            let initData = await liveApi.getCheckRealNameData(params, req);
            let realStatus = lo.get(initData, 'realStatus.data.status');
            // let realNameInfo = lo.get(initData, 'realNameInfo.data.identity',{});
            let power = lo.get(initData, 'power.data.powerEntity',{});
            if(power.allowMGLive){
                store.dispatch(initRelaNameInfo(realStatus,power));
            }else{
                 res.render('500', {
                    msg: '无权限访问'
                });
                return false;
            }
    
        } catch(err) {
            console.error(err);
        }
        return store;
    } else {
        return store;
    }
    
};

export async function joinList (req, res, store) {
    const { id } = req.query;
    const { type } = req.params;
    const userId = lo.get(req, 'rSession.user.userId');
    const key = type == 'channel' ? 'channelId' :
                type == 'topic' ? 'topicId':
                type == 'vip' ? 'liveId' : 
                type == 'customvip' ? 'liveId' : 
                type == 'camp' ? 'campId' : '';

    const result = await liveApi.getPower({
        userId,
        [key]: id
    }, req);

    let power = lo.get(result, 'power.data.powerEntity',{});
    let authTo = power.allowMGLive
    if(type==='topic'){
        authTo = power.allowMGTopic
    }
    if(authTo){
        store.dispatch(updateUserPower(power));
    } else{
        res.redirect('/wechat/page/mine')
        return false
    }


    return store;
}


export async function newLiveMainHandle (req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId');
    let liveId = req.params.liveId || req.query.fromLiveId;

    if (!liveId) {
        let state = store.getState()
        liveId = state.live.liveInfo.id;
    }

    const result = await liveApi.gitInitLiveData({
        userId,
        liveId
    }, req);

    let bannerList = lo.get(result, 'liveInfo.data.banners', [])
    let liveInfo = lo.get(result, 'liveInfo.data',{});
    let liveSymbol = lo.get(result, 'liveInfo.data.symbolList',[]);
    let auditedStatues = lo.get(result, 'liveInfo.data.status', false)
    let isBlackList = lo.get(result, 'isBlackList.data.isBlackList')

    let power = lo.get(result, 'power.data.powerEntity',{});
    let timelineInfo = lo.get(result, 'timeline.data.list')||[];
    if (!liveInfo) {
        res.render('500', {
            msg: '该直播间不存在!'
        });
        return false; 
    }

    if (liveInfo && liveInfo.entity && liveInfo.entity.status === 'delete') {
        res.render('500', {
            msg: '很抱歉，您的直播间已被拉黑！'
        });
        return;
    }

    if (isBlackList) {
        res.render('500', {
            msg: '很抱歉，您已被该直播间拉黑！'
        });
        return;
    }
    store.dispatch(setBannerList(bannerList));
    store.dispatch(initLiveInfo(liveInfo));
    store.dispatch(initLiveSymbol(liveSymbol));
    store.dispatch(initPower(power));
    store.dispatch(initLiveTimeline(timelineInfo));
    store.dispatch(setAuditedStatues(auditedStatues));

    const adminFlag = lo.get(result, 'isLiveAdmin.data') || {};
    store.dispatch(setIsLiveAdmin(adminFlag))
    if (adminFlag.isLiveAdmin === 'Y') {
        const extendRes = await liveApi.getExtnedLiveData({
            userId,
            liveId
        });

        // let functionMenu = lo.get(extendRes, 'functionMenu.data.menus')
        // let pageMenu = lo.get(extendRes, 'pageMenu.data.pages')
        let pageConfig = lo.get(extendRes, 'pageConfig.data.config')

        store.dispatch(initExtendData({
            // pageMenu,
            // functionMenu,
            ...pageConfig,
        }));
    }


    return store;
}


export async function liveBannerList (req, res, store) {
    const liveId = req.params.liveId;
    const userId = req.rSession.user.userid;

    const [ bannerListRes, vipInfoRes ] = await Promise.all([
        liveApi.getLiveBannerList({ liveId }),
        liveApi.getVipInfo({ liveId, userId })
    ])

    const bannerList = lo.get(bannerListRes, 'getBannerList.data.LiveBanners');
    const vipInfo = lo.get(vipInfoRes, 'data');

    store.dispatch(setBannerList(bannerList));
    store.dispatch(setVipInfo(vipInfo));

    return store;
}

// 直播间自媒体版升级
export async function mediaLiveUpgrade(req, res, store){
    // 获取我的直播间信息
    const userId = req.rSession.user.userId;
    let result = await mineApi.getMyLive({userId}, req);
    const myLive = lo.get(result, 'myLive.data.entityPo');
    let level = '';
    if (myLive) {
        const liveId = myLive.id;
        const liveName = myLive.name;
        // 查询是否已经是自媒体版
        result = await liveApi.getIsLiveMedia({liveId}, req);
        level = lo.get(result, 'data.level');
        store.dispatch(setIsLiveMedia({
            isLiveMedia: level === 'selfMedia'
            // isLiveMedia: true
        }));
        // 查询是否是专业版直播间并获取到期时间信息
        result = await liveApi.getIsLiveAdmin({liveId}, req);
        const isLiveAdmin = lo.get(result, 'data.isLiveAdmin');
        const liveAdminStart = lo.get(result, 'data.liveAdminStart');
        const liveAdminOverDue = lo.get(result, 'data.liveAdminOverDue');
        store.dispatch(setIsLiveAdmin({
            liveId,
            liveName,
            isLiveAdmin,
            liveAdminStart,
            liveAdminOverDue
        }));
    }
    // 获取价格信息
    const priceType = level === 'liveAdmin' ? 'SELF_MEDIA_UPDATE' : 'SELF_MEDIA_BUY';
    result = await liveApi.getLivePrice({type: priceType}, req);
    const livePrice = lo.get(result, 'data');
    store.dispatch(setLivePrice({
        livePrice
    }));
    // 存储用户信息
    store.dispatch(initUserInfo({
        userId,
        username: req.rSession.user.name,
        headImgUrl: req.rSession.user.headImgUrl,
    }));
    
    return store;
}


// 自媒体版直播间购买支付成功
export async function mediaLivePaid(req, res, store){
    const state = store.getState();
    // 如果已经是自媒体版直播间，查询用户是否关注千聊Live公众号
    if (state.common.isLiveMedia) {
        const result = await liveApi.initSubscribe({
            userId: state.common.userInfo.userId,
            liveId: state.common.liveId
        });
        const subscribeInfo = lo.get(result, 'subscribe.data');
        store.dispatch(initSubscribeInfo(subscribeInfo));
    } else {
        // 不是自媒体版，重定向至支付页面
        res.redirect('/wechat/page/media-studio-buy');
        return false;
    }
    return store;
}

export function focusQl (req, res, store) {
    
    const userId = req.rSession.user.userId;

    store.dispatch(initUserInfo({
        userId,
    }));

    return store;
}

/**
 * 初始化用户角色和直播间的等级
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function initUserPower(req, res, store){
    const userId = req.rSession.user.userId;
    const liveId = req.params.liveId;
    const initPowerRes = await liveApi.getPower({userId, liveId}, req);
    if (initPowerRes.power.state.code > 0) {
        res.render('500', {
            msg: initPowerRes.power.state.msg
        });
        return false;
    }
    store.dispatch(initPower(initPowerRes.power.data.powerEntity));
    return store;
}

export async function isMyLive(req, res, store) {
	const params = {
		userId: lo.get(req, 'rSession.user.userId'),
    }
    // 如果是B端用户，则跳转到我的关注页面
    const result = await proxy.parallelPromise([
        ['myLive', conf.baseApi.live.my, params, conf.baseApi.secret]
    ], req);
    if(result.myLive.state.code === 0){
        const liveInfo = result.myLive.data.entityPo
        if(liveInfo !== null && liveInfo.id == req.query.liveId) {
            res.redirect('/wechat/page/timeline/mine-focus');
            return false;
        }
    }
	return store;
}



/**
 * live黑名单的话跳到500 
 */
export async function ifIsBlackGoTo500(req, res, next) {
    const params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: req.query.liveId,
    }

    const result = await proxy.parallelPromise([
        ['isBlackList', conf.baseApi.live.isBlackList, params, conf.baseApi.secret]
    ], req);

    if (lo.get(result, 'isBlackList.data.isBlackList')) {
        return resProcessor.reject(req, res, {
            isLive: true,
        });
    } else {
        return next();
    }
}

/**
 * 推送课程页面store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function courseInfoHandle(req, res, store) {
    try {
        let channelId = lo.get(req, 'query.channelId')
        let isSingleBuy = lo.get(req, 'query.isSingleBuy')
        let topicId = lo.get(req, 'query.topicId')
        let campId = lo.get(req, 'query.campId')

        if(campId){
            let campData = await proxy.apiProxyPromise(conf.baseApi.checkInCamp.campInfo, {campId}, conf.baseApi.secret, req);
            let campInfo = lo.get(campData, 'data.liveCamp', {});
            store.dispatch(initCampData(campInfo));
        }else if(!channelId || channelId && isSingleBuy == 'Y'){
            let topicData = await topicApi.getTopicIntroInfo({topicId}, req)
            let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
            store.dispatch(initTopicData(topicPo));
        }else {
            let channelData = await channelApi.getChannelStaticInitData({channelId}, req);
            let channelInfo = lo.get(channelData, 'channelInfo.data.channel', {});
            store.dispatch(initChannelData(channelInfo));
        }
    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
}

/**
 * 如何提升课程指数判断是否是B端
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function howToPromoteCourseIndex(req, res, store){
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
    };
    let businessType = req.query.businessType, businessId = req.query.businessId
    if(!businessId || !businessType){
        res.render('404')
        return false
    }
    if(businessType == 'topic'){
        params.topicId = businessId
    }else if (businessType == 'channel'){
        params.channelId = businessId
    }
    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
    ], req);
    let power = result.power.data.powerEntity
    if(!power.allowSpeak && !power.allowMGLive){
        if(businessType == 'topic'){
            res.redirect(`/wechat/page/topic-intro?topicId=${businessId}`);
        }else if(businessType == 'channel'){
            res.redirect(`/wechat/page/channel-intro?channelId=${businessId}`);
        }
        return false
    }else {
        return store;
    }
}


/**
 * 如何提升课程指数判断是否是B端
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function liveDataStatistics(req, res, store){
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: req.query.liveId
    };
    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
    ], req);
    let power = result.power.data.powerEntity
    if(!power.allowSpeak && !power.allowMGLive){
        res.redirect(`/wechat/page/live/${req.query.liveId}`);
        return false
    }else {
        return store;
    }
}


/**
 * 判断直播间权限
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function isliveRole(req, res, next){
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: req.query.liveId,
        code: req.query.code
    };
    const { getInvite = {},role = {},white = {},user = {}, attention= {} } = await proxy.parallelPromise([
        ['getInvite', conf.baseApi.live.getInvite, params, conf.baseApi.secret],
        ['role', conf.baseApi.live.role, params, conf.baseApi.secret],
        ['white',conf.baseApi.live.isServiceWhiteLive,params, conf.baseApi.secret], // 白名单
        ['user',conf.baseApi.user.info,{  userId: lo.get(req, 'rSession.user.userId'), }, conf.baseApi.secret], // 用户信息
        ['attention',conf.baseApi.user.getAppIdByType,{ userId: lo.get(req, 'rSession.user.userId'), type: "ql_market" }, conf.baseApi.secret], // 是否关注千聊知识店铺
    ], req);
    console.log(getInvite, role, white,attention ,user)
    console.log("==========================+")
    // 判断链接是否过期
    if((getInvite.state && getInvite.state.code !== 0)){
        res.redirect(`/live/invite/mgrGet/${ params.liveId }/${ params.code }.htm`)
        return false
    }
    // 创建者
    if((role.data && role.data.role === "creater")){
        res.redirect(`/wechat/page/live/${req.query.liveId}`);
        return false
    } else {
        // 判断是否成为管理者
        if((role.data && !!role.data.role)){
            if((user.data && user.data.user && !!user.data.user.mobile) && (attention.data && attention.data.isSubscribe === "Y")){
                res.redirect(`/wechat/page/live/${req.query.liveId}`);
                return false
            }
        }
        // 手机已经绑定
        if(user.data && user.data.user && !!user.data.user.mobile){
            // 判断是否为白名单
            if(white.data && white.data.isWhite === "Y"){
                res.redirect(`/wechat/page/live/${req.query.liveId}`);
                return false
                // 判断是否关注
            } 
        } 
        return next;
    }
}