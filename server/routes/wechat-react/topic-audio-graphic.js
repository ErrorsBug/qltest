import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';
import { hasCEndSign } from '../../components/url-utils/url-utils';

var topicApi = require('../../api/wechat/topic');
var audioGraphicApi = require('../../api/wechat/topic-audio-graphic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');



import {
    getTopicInfo,
    initTopicInfo,
    initPageData,
    setLshareKey,
    initPushComplite,
	initQlshareKey,
	initCoralIdentity,
    initLiveRole,
    initClientBRelay,
} from '../../../site/wechat-react/audio-graphic/actions/audio-graphic';


const isClientB = power => power.allowMGLive;
const isRelayChannel = topicPo => topicPo.isRelayChannel == 'Y';

//需要发送请求获取b端是否能听转载系列课话题
const shouldJudgeClientBAuth = power => topicPo => isClientB(power) && isRelayChannel(topicPo);



/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function audioGraphicHandle(req, res, store) {

    try {
        let isKickOutParams = {
            userId: lo.get(req, 'rSession.user.userId',null),
            businessId: lo.get(req, 'query.topicId'),
            type: 'topic',
        }

        let params = {
            userId: lo.get(req, 'rSession.user.userId',null),
            topicId: lo.get(req, 'query.topicId'),
            sessionId: req.rSession.sessionId,
        };

        // 检测是否有多个topicId
        const topicIdIsArr = checkTopicIdIsArray(req, res, params.topicId);
        if (topicIdIsArr) { return false; }


        // 这里对 res.isWeapp和res.weappLinkTo  解释：
        // res.isWeapp是判断是否小程序跳转，小程序跳转的链接后面会带上weapp=Y参数
        // res.weappLinkTo是经过服务端各种判断后，在h5上需要跳转到h5的介绍页、直播间主页之类的，在小程序上就需要跳转到
        // 小程序的页面，而小程序只能在页面内部跳转，所以这个字段只是指明需要跳转的页面地址，真正跳转还是传到页面上，然后
        // 调用小程序的api跳转
        let isWeapp = lo.get(req, 'query.weapp') === 'Y';
        req.isWeapp = isWeapp;

        // let topicData = await audioGraphicApi.getAudioGraphicInfo(params);
        let [topicData, kickOutRes] = await Promise.all([audioGraphicApi.getAudioGraphicInfo(params, req), getKickOutState(isKickOutParams, req)]);
        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
        let profile = lo.get(topicData, 'profile.data.TopicProfileList', {});
        let power = lo.get(topicData, 'power.data.powerEntity', {}) || {};
        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let channelId = lo.get(topicData, 'topicInfo.data.topicPo.channelId', null);
        let isAuth = lo.get(topicData, 'topicAuth.data.isAuth', false);

        let isKickOut = lo.get(kickOutRes, 'data.status');

        if(!power.allowMGLive && !power.allowSpeak){
            // C端来源
	        const queryResult = stringify(req.query);
	        if(isAuth){
		        if(/video/.test(topicPo.style)){
			        res.redirect(`/wechat/page/topic-simple-video?${queryResult}`);
		        }else{
			        res.redirect(`/topic/details-listening?${queryResult}`);
		        }
	        }else{
                let smoothHearingOrBuyOriginParams = {
                    userId: params.userId,
                    liveId,
                    topicId: params.topicId,
                    channelId
                }
                let  getDataArr = [topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req)]
                let [channelInfo] = await Promise.all(getDataArr);
                // 一元解锁课跳到系列课介绍页
                let discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'normal')
                if(discountStatus == 'UNLOCK') {
                    res.redirect(`/wechat/page/channel-intro?channelId=${channelId}`);
                } else {
                    res.redirect(`/wechat/page/topic-intro?${queryResult}`);
                }
	        }
	        return false;
        }

        const relayClientBListen = shouldJudgeClientBAuth(power, topicPo) ?
        await audioGraphicApi.relayClientBListen({
            ...params,
            liveId
        }, req) :
        null;

        if (isKickOut === true) {
            res.redirect(`/wechat/page/link-not-found?type=topicOut&liveId=${topicPo.liveId}`);
            return false;
        }

        let secondParams={
            userId: lo.get(req, 'rSession.user.userId',null),
            liveId,
            channelId,
            topicId: lo.get(req, 'query.topicId'),
            businessId: lo.get(req, 'query.topicId') || channelId,
            businessType: channelId?'channel':'topic'
        };
        let secondData = await audioGraphicApi.getAudioGraphicSecondData(secondParams, req);

        let pushCompliteParams = {
            userId: params.userId,
            topicId: params.topicId,
        }
        let pushCompliteInfo = await audioGraphicApi.getIspushCompliteCard(pushCompliteParams, req);

        

        if (params.userId){
            // 处理拉黑
            const isBlack = judgeBlack(req, res, lo.get(secondData, 'blackInfo.data.type', null), liveId);
            if (!isBlack) { return false; }
        }

        // 处理是否已被删除话题
        const isDelete = judgeIsDeleteTopic(req, res, topicPo, isAuth);
        if (isDelete) { return false; }

        if (channelId) {
            // 处理系列课隐藏
            const isHide = judgeHideChannel(req, res, lo.get(secondData, 'channelInfo.data', null), isAuth, liveId);
            if (isHide) { return false; }
        }

        // 判断是否视频类型
        const isVideoLive = judgeIdVideoLive(req, res, topicPo);
        if (isVideoLive) { return false; }




        let chargeStatus = lo.get(secondData, 'chargeStatus.data.chargePos', null);
        let vipInfo = lo.get(secondData, 'vipInfo.data', {});





        // 首屏需要注入的数据
        let initData = {
            sid: lo.get(req, 'rSession.sessionId'),
            profile,
            power,
            isLogin:true,
            isAuth,
            userId:params.userId,
            currentUserId: params.userId,
            currentTimeMillis: Date.now(),
            chargeStatus,
            vipInfo,
            channelInfo:lo.get(secondData, 'channelInfo.data', null),
        };

	    store.dispatch(initTopicInfo(topicPo));
        store.dispatch(initPageData(initData));
        store.dispatch(setLshareKey(lo.get(secondData, 'lShareKey.data.shareQualify', {}) || {}));
	    store.dispatch(initPushComplite(lo.get(pushCompliteInfo, 'shareComplitePushDate.data', {}) || {},lo.get(pushCompliteInfo, 'getnowTopicVideoCount.data', {}) || {}));
	    store.dispatch(initLiveRole(lo.get(secondData, 'liveRole.data.role', false)));
        store.dispatch(initClientBRelay(lo.get(relayClientBListen, 'relayClientBListen.data.isListen', 'N')));
        store.dispatch(initCoralIdentity(lo.get(secondData, 'coralIdentity.data', {})));
    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
};

/**
 * 检测是否有多个topicId
 *
 * @param {any} topicId
 * @returns
 */
function checkTopicIdIsArray(req, res, topicId) {
    if (Object.prototype.toString.call(topicId)=='[object Array]') {
        const data = {
            ...req.query,
            topicId: topicId[0],
        }
        const queryResult = stringify(data);
        res.redirect(`/topic/details-audio-graphic?${queryResult}`);
        return true;
    } else {
        return false;
    }
}


/**
 * 拉黑处理
 *
 * @param {any} blackType
 * @returns
 */
function judgeBlack (req, res, blackType, liveId) {
    if (blackType === 'channel') {
        resProcessor.reject(req, res, {
            isLive: false,
            liveId: liveId
        });
        return false;
    } else if (blackType === 'live') {
        resProcessor.reject(req, res, {
            isLive: true,
            liveId: liveId
        });
        return false;
    } else if (blackType === 'user') {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/live-index/live-index?liveId=${liveId}`;
            return true;
        } else {
            res.redirect('/black.html?code=inactived');
            return false;
        }
    } else {
        return true;
    }
}

/**
 *
 *
 * @param {any} req
 * @param {any} res
 * @param {any} topicPo
 */
function judgeIdVideoLive (req, res, topicPo) {
    const data = {
        topicId: topicPo.id,
        ...req.query,
    }
    const queryResult = stringify(data);

    // 如果话题类型是音视频，就跳到音视频
    if (/^(video|audio)$/.test(topicPo.style)) {
        res.redirect(`/topic/details-video?${queryResult}`);
        return true;
    }else if (!/^(audioGraphic|videoGraphic)$/.test(topicPo.style)) {
        res.redirect(`/topic/details?${queryResult}`);
        return true;
    } else {
        return false;
    }
}

/**
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth (req, res, isAuth, topicId, topicPo, power, userId) {
    const data = {
        ...req.query,
    }
    const queryResult = stringify(data);

    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 有管理权限或者发言权限可以直接接入
        return true;
    }else if(hasCEndSign(req)){
        if(isAuth){
            if(/video/.test(topicPo.style)){
	            res.redirect(`/wechat/page/topic-simple-video?${queryResult}`);
            }else{
	            res.redirect(`/topic/details-listening?${queryResult}`);
            }
        }else{
	        res.redirect(`/wechat/page/topic-intro-cend?${queryResult}`);
        }
	    return false;
    } else if (topicPo && topicPo.isNeedAuth == 'N' && topicPo.type == 'public' && !(topicPo.channelId && topicPo.isAuditionOpen != 'Y')) {
        // 如果非频道话题是免费的，且没有开启介绍页，可以直接进入
        // 如果频道话题开启了免费试听的，可以直接进入
        return true;
    } else if (!userId) {
        // 如果没有登录，就跳到登录页
        var pageUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
        // res.redirect(`/api/wx/login?redirect_url=${encodeURIComponent(pageUrl)}`);
        // 去到登录页（或手动授权）
        wxUtils.goWxAuth(req, res, pageUrl);
        return false;
    } else if (!isAuth) {
        // 没有报名（包含没有支付和没有输入过密码），跳转到介绍页
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${topicId}&${queryResult}`;
            return true;
        } else {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
    } else {
        return true;
    }
}

/**
 * 处理是否已经开始话题
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsStartTopic (req, res, topicPo) {
    const data = {
        ...req.query,
    }
    const queryResult = stringify(data);
    // 话题正在进行中
    if (topicPo.status === 'beginning' && topicPo.startTime < topicPo.currentTimeMillis) {
        return true;
    } else if(topicPo.style !== 'video' && topicPo.style !== 'audio') {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${topicPo.id}&${queryResult}`;
            return true;
        } else {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
    } else {
        return true;
    }
}


/**
 * 处理是否已经删除话题
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsDeleteTopic (req, res, topicPo, isAuth) {
    // 话题已被删除
    if (topicPo.status === 'delete') {
        res.redirect(`/wechat/page/link-not-found?type=topic&liveId=${topicPo.liveId}`);
        return true;
    } else if (!isAuth && topicPo.displayStatus == 'N') {
        // 话题隐藏
        res.redirect(`/wechat/page/topic-hide?liveId=${topicPo.liveId}`);
        return true;
    }else if (!topicPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=topic`);
        return true;
    } else {
        return false;
    }
}


/**
 * 处理是否系列课隐藏
 *
 * @param {any} req
 * @param {any} res
 */
function judgeHideChannel (req, res, channelInfo , isAuth , liveId) {
    const displayStatus = channelInfo.channel.displayStatus;
    if ( !isAuth &&  displayStatus == 'N') {
        res.render('channel-hide', {
            liveId: liveId
        });
        return true;

    }else {
        return false;
    }
}
