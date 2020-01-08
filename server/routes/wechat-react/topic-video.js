import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';
import { hasCEndSign } from '../../components/url-utils/url-utils';

var topicApi = require('../../api/wechat/topic');
var resProcessor = require('../../components/res-processor/res-processor');

import {
    initTopicInfo,
    // addForumSpeakList,
    initPageData,
    // addTimestamp,
    setLshareKey,
    initPushComplite,
    // addDelSpeakIdList
} from '../../../site/wechat-react/thousand-live/actions/thousand-live-common';
import {
    setIsLiveAdmin,
} from '../../../site/wechat-react/thousand-live/actions/common';

/**
 * 视频话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function topicVideoHandle(req, res, store) {
    try {

        let isKickOutParams = {
            userId: lo.get(req, 'rSession.user.userId',null),
            businessId: lo.get(req, 'query.topicId'),
            type: 'topic',
        }

        let params = {
            userId: lo.get(req, 'rSession.user.userId'),
            topicId: lo.get(req, 'query.topicId'),
            sessionId: req.rSession.sessionId ,
        };
        // let getMsgParams = {
        //     topicId: lo.get(req, 'query.topicId'),
        //     onlyTeacher: 'N',
        //     time:'1120752000000',
        //     beforeOrAfter:'after',
        //     hideLuckyMoney:false,
        // }

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

        // let topicData = await topicApi.getThousandLiveInfo(params);
        let [topicData, kickOutRes] = await Promise.all([topicApi.getThousandLiveInfo(params, req), getKickOutState(isKickOutParams, req)]);

        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let secondParams = {
            sessionId: req.rSession.sessionId,
            userId: params.userId,
            topicId: params.topicId,
            liveId: liveId,
            channelNo: lo.get(req, 'query.pro_cl')||lo.get(req, 'cookies.pro_cl'),
        };
        let isFollowParams = {
            liveId: liveId,
            userId: params.userId,
        }
        let pushCompliteParams = {
            userId: params.userId,
            topicId: params.topicId,
        }


        let topicPo = lo.get(topicData, 'topicInfo.data.topicPo', {});
        let power = lo.get(topicData, 'power.data.powerEntity', null);
        let isKickOut = lo.get(kickOutRes, 'data.status');
        let topicExtendPo = lo.get(topicData, 'topicInfo.data.topicExtendPo')

        if (isKickOut === true) {
            res.redirect(`/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`);
            return false;
        }

        // 视频互动跳极简模式逻辑(C端&&非小程序&&非旧页面分享)
        if(topicPo.style === 'video' && !power.allowMGLive && !power.allowSpeak && !req.isWeapp){
	        res.redirect(`/wechat/page/topic-simple-video?${stringify(req.query)}`);
	        return false;
        }

        topicPo.currentTimeMillis = Date.now();
        // getMsgParams.hideLuckyMoney = topicPo.barrageFlag == 'N'?false:true;

        if (topicPo.sourceTopicId) {
            secondParams.sourceTopicId = topicPo.sourceTopicId;
        }

        let smoothHearingOrBuyOriginParams = {
            userId: params.userId,
            liveId,
            topicId: params.topicId,
            channelId: topicPo.channelId
        }

        // let [forumSpeak, secondData, requsetIsFollow, pushCompliteInfo, delSpeakIdList, isOrNotListen, channelInfo] = await Promise.all([
        let [secondData, requsetIsFollow, pushCompliteInfo,  isOrNotListen, channelInfo] = await Promise.all([
            // topicApi.getForumSpeakNode(getMsgParams, req),
            topicApi.getThousandLiveISecondData(secondParams, req),
            topicApi.getIsFollow(isFollowParams, req),
            //请求是否推送成就卡
            topicApi.getIspushCompliteCard(pushCompliteParams, req),
            // topicApi.getRelayDelSpeakIdList({
            //     type: 'forum',
            //     topicId: params.topicId
            // }, req),
            topicApi.getIsOrNotListen(smoothHearingOrBuyOriginParams, req),
            topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req)
        ]);
        
        const isSmoothHearing = lo.get(isOrNotListen, 'isOrNotListen.data.isListen');
        const authStatus = lo.get(channelInfo, 'channelInfo.data.channel.authStatus');

        // 处理拉黑
        const isBlack = judgeBlack(req, res, lo.get(secondData, 'blackInfo.data.type', null), liveId);
        if (!isBlack) { return false; }

        // 处理购买权限
        const isAuth = judgeAuth(req, res, lo.get(secondData, 'topicAuth.data.isAuth', null), params.topicId, power, topicPo, isSmoothHearing === 'N' && authStatus === 'N', channelInfo);
        if (!isAuth) { return false; }

        // 处理是否已被删除话题
        const isDelete = judgeIsDeleteTopic(req, res, topicPo);
        if (isDelete) { return false; }

        // 判断是否视频类型
        const isVideoLive = judgeIdVideoLive(req, res, topicPo);
        if (!isVideoLive) { return false; }

        // 处理是否已经开始话题
        const isStart = judgeIsStartTopic(req, res, topicPo);
        if (!isStart) { return false; }




        // let forumList = lo.get(forumSpeak, 'forumSpeak.data.forumList', []);
        // delSpeakIdList = lo.get(delSpeakIdList, 'data.delSpeakIdList', []);




        let initData = {
            sid: lo.get(req, 'rSession.sessionId'),
            power,
            isFollow: lo.get(requsetIsFollow, 'isFollow.data.isFollow'),
            liveInfo: lo.get(secondData, 'liveInfo.data'),
            fromWhere: 'first',
            currentUserId: params.userId,
            browseNum: topicPo.browseNum,
            userId:params.userId,
            isLogin:true,
            weappLinkTo: req.weappLinkTo,
        };

        store.dispatch(initTopicInfo({...topicPo, ...topicExtendPo}));
        // store.dispatch(addForumSpeakList(addTimestamp(forumList)));
        // store.dispatch(addDelSpeakIdList(delSpeakIdList));
        store.dispatch(initPageData(initData));
        store.dispatch(setLshareKey(lo.get(secondData, 'lShareKey.data.shareQualify', {}) || {}));
        store.dispatch(initPushComplite(lo.get(pushCompliteInfo, 'shareComplitePushDate.data', {}) || {},lo.get(pushCompliteInfo, 'getnowTopicVideoCount.data', {}) || {}));
        store.dispatch(setIsLiveAdmin(lo.get(secondData, 'isLiveAdmin.data', {}) || {}));

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
        res.redirect(`/topic/details-video?${queryResult}`);
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
    if (/^(audioGraphic|videoGraphic)$/.test(topicPo.style)) {
        res.redirect(`/topic/details-audio-graphic?${queryResult}`);
        return false;
    } else if (/^(graphic)$/.test(topicPo.style)) {
        // 小图文类型
        res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
        return false;
    }else if (!/^(video|audio)$/.test(topicPo.style)) {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${topicPo.id}`;
            return false;
        } else {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
    } else {
        return true;
    }
}

/**
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth (req, res, isAuth, topicId, power, topicPo, isSmoothHearingOrBuyOrigin, channelInfo) {
    const data = {
        ...req.query,
    }
    const queryResult = stringify(data);
    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 不是畅听 & 没有购买原课 & 是转载
        if (isSmoothHearingOrBuyOrigin && topicPo.isRelay === 'Y') {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false
        }
        return true;
    } else if (
        topicPo && topicPo.channelId && topicPo.isFreePublicCourse === 'Y'
    ) {
        // 如果该话题从属系列课并且是公开课，可以直接进入
        return true;
    } else if (!isAuth) {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${topicId}`;
            return true;
        } else {
            // 一元解锁课跳到系列课介绍页
            const discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'normal')
            if(discountStatus == 'UNLOCK') {
                res.redirect(`/wechat/page/channel-intro?channelId=${topicPo.channelId}`);
                return false
            }
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
    } else if(topicPo.status === 'delete') {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/live-index/live-index?liveId=${topicPo.liveId}`;
            return true;
        } else {
            res.redirect(`/live/${topicPo.liveId}.htm`);
            return false;
        }
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
    }else if (!topicPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=topic`);
        return true;
    } else {
        return false;
    }
}
