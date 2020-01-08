import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';
import { hasCEndSign } from '../../components/url-utils/url-utils';
const proxy = require('../../components/proxy/proxy');

var topicApi = require('../../api/wechat/topic');
const conf = require('../../conf');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');

import {
    initTopicInfo,
    initPageData,
    setLshareKey,
    initSubscribe,
	UPDATE_POWER,
} from '../../../site/wechat-react/thousand-live/actions/thousand-live-common';


import {
    setIsLiveAdmin,
    initUserInfo
} from '../../../site/wechat-react/thousand-live/actions/common';


/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function topicListeningHandle(req, res, store) {
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

        // 访问话题的时间戳
        let currentTimeMillis = Date.now();


        // let topicData = await topicApi.getThousandLiveInfo(params);
        let [topicData, kickOutRes] = await Promise.all([topicApi.getThousandLiveInfo(params, req), getKickOutState(isKickOutParams, req)]);

        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
        let power = lo.get(topicData, 'power.data.powerEntity', null);
        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let channelId = lo.get(topicData, 'topicInfo.data.topicPo.channelId', null);
        let isKickOut = lo.get(kickOutRes, 'data.status');
        const userInfo = lo.get(req, 'rSession.user');

        store.dispatch(initUserInfo({
            user: userInfo
        }))

        if (isKickOut === true) {
            res.redirect(`/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`);
            return false;
        }

        // 获取第二批数据的参数
        let secondParams = {
            sessionId: req.rSession.sessionId,
            userId: params.userId,
            topicId: params.topicId,
            liveId: liveId,
            channelNo: lo.get(req, 'query.pro_cl')||lo.get(req, 'cookies.pro_cl'),
        };
        // 获取关注信息的参数
        let isFollowParams = {
            liveId: liveId,
            userId: params.userId,
            topicId: params.topicId,
        }

        let pushCompliteParams = {
            userId: params.userId,
            topicId: params.topicId,
        }

        let smoothHearingOrBuyOriginParams = {
            userId: params.userId,
            liveId,
            topicId: params.topicId,
            channelId
        }


        topicPo.currentTimeMillis = currentTimeMillis;

        // 第二次要请求的数据
        let getDataArr = [
            topicApi.getThousandLiveISecondData(secondParams, req),
        ];

        // 有登录才请求是否关注信息
        if (params.userId){
            getDataArr.push(topicApi.getIsFollow(isFollowParams, req))
            getDataArr.push(topicApi.getIsOrNotListen(smoothHearingOrBuyOriginParams, req))
            getDataArr.push(topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req))
        }


        let [ secondData, requsetIsFollow, isOrNotListen, channelInfo] = await Promise.all(getDataArr);

        const isSmoothHearing = lo.get(isOrNotListen, 'isOrNotListen.data.isListen');
        const authStatus = lo.get(channelInfo, 'channelInfo.data.channel.authStatus');

        if (params.userId){
            // 处理拉黑
            const isBlack = judgeBlack(req, res, lo.get(secondData, 'blackInfo.data.type', null), liveId);
            if (!isBlack) { return false; }
        }

        // 处理购买权限
        const isAuth = judgeAuth({
            req,
            res,
            isAuth: lo.get(secondData, 'topicAuth.data.isAuth', null),
            topicId: params.topicId,
            topicPo,
            power,
            userId: params.userId,
            isSmoothHearingOrBuyOrigin: isSmoothHearing === 'N' && authStatus === 'N',
            channelInfo
        });
        // 处理是否已被删除话题
        if (!isAuth) { return false; }

        const isDelete = judgeIsDeleteTopic(req, res, topicPo,isAuth);
        if (isDelete) { return false; }

        // 判断是否视频类型
        const isVideoLive = judgeIdVideoLive(req, res, topicPo, power);
        if (isVideoLive) { return false; }


        // // 处理是否已经开始话题
        // const isStart = judgeIsStartTopic(req, res, topicPo);
        // if (!isStart) { return false; }

        // 未开始的音频录播使用音频极简打开
        if (!/^(audioGraphic)$/.test(topicPo.style)
            && currentTimeMillis < topicPo.startTime) {
            switch (topicPo.style) {
                case 'audio':
                case 'video':
                    res.redirect(`/topic/details-video?topicId=${params.topicId}`);
                    break;
                    
                case 'normal':
                case 'ppt':
                    res.redirect(`/topic/details?topicId=${params.topicId}`);
                    break;
            
                default:
                    res.redirect(`/topic/details?topicId=${params.topicId}`);
                    break;
            }
            return false;
        }

        // 首屏需要注入的数据
        let initData = {
            sid: lo.get(req, 'rSession.sessionId'),
            liveInfo: lo.get(secondData, 'liveInfo.data'),
            currentUserId: params.userId,
            browseNum: topicPo.browseNum,
            currentTimeMillis: Date.now(),

        };

        // 有登录才插入数据
        if (params.userId){

            let hasData = {
                power,
                isLogin:true,
                isAlert: lo.get(requsetIsFollow, 'isFollow.data.isAlert',false),
                isFollow: lo.get(requsetIsFollow, 'isFollow.data.isFollow',false),
                userId:params.userId,
            }

            initData = { ...initData, ...hasData };
            
            // 这里特殊处理，因为后台可能返回null;
            let isSubscribe = lo.get(requsetIsFollow, 'isSubscribe.data',{})||{};
            // 刘媛媛系列课的课程特殊处理
            if(channelId && channelId === '240000552022354'){
                isSubscribe.subscribe = true;
                isSubscribe.isFocusThree = true;
            }
            store.dispatch(initSubscribe(isSubscribe));

        }
        store.dispatch(initTopicInfo(topicPo));
        store.dispatch(initPageData(initData));
        store.dispatch(setLshareKey(lo.get(secondData, 'lShareKey.data.shareQualify', {}) || {}));
        store.dispatch(setIsLiveAdmin(lo.get(secondData, 'isLiveAdmin.data', {}) || {}));
        store.dispatch({
	        type: UPDATE_POWER,
	        parmas: power
        });

    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
};



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
        res.redirect('/black.html?code=inactived');
        return false;
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
function judgeIdVideoLive (req, res, topicPo, power) {
    const data = {
        topicId: topicPo.id,
        ...req.query,
    }
    const queryResult = stringify(data);

    // 如果话题类型是音视频，就跳到音视频
    if (/^(audioGraphic|videoGraphic)$/.test(topicPo.style)) {
        if(power.allowMGLive){
	        res.redirect(`/topic/details-audio-graphic?${queryResult}`);
        }else{
	        if(/^(videoGraphic)$/.test(topicPo.style)){
		        res.redirect(`/wechat/page/topic-simple-video?${queryResult}`);
            }else{
	            return false;
            }
        }
        return true;
    } else if (/^(graphic)$/.test(topicPo.style)) {
        // 小图文类型
        res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
        return true;
    } else if (/^(audio)$/.test(topicPo.style) && topicPo.currentTimeMillis < topicPo.startTime) {
        // 未开播回去互动页面
        res.redirect(`/topic/details-video?${queryResult}`);
        return true;
    } else if (/^(video|audio)$/.test(topicPo.style) && power.allowMGLive) {
        // B端就跳去交互页
        res.redirect(`/topic/details-video?${queryResult}`);
        return true;
    } else if (/^(video)$/.test(topicPo.style) && !power.allowMGLive) {
        // 非B端就跳去视频极简页
        res.redirect(`/wechat/page/topic-simple-video?${queryResult}`);
        return true;
    } else if (/^(audioLive|videoLive)$/.test(topicPo.style)) {
        // 音视频直播页
        res.redirect(`/topic/details-live?${queryResult}`);
        return true;
    }else {
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
function judgeAuth ({req, res, isAuth, topicId, topicPo, power, userId, isSmoothHearingOrBuyOrigin, channelInfo}) {
    // 如果系列课话题是公开课或者是知识新闻，可以直接进入极简页
    if (topicPo && (topicPo.isFreePublicCourse == 'Y' || topicPo.isNewsTopic === 'Y')) return true;
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
        // 有管理权限或者发言权限可以直接接入
        return true;
    } else if (
        topicPo &&
        topicPo.isNeedAuth == 'N' &&
        topicPo.type == 'public' &&
        topicPo.displayStatus == 'Y' &&
        !(topicPo.channelId && topicPo.isAuditionOpen != 'Y')
    ) {
        // 如果非频道话题是免费的，且没有开启介绍页，可以直接进入
        // 如果频道话题开启了免费试听的，可以直接进入
        return true;
    } else if (
        topicPo &&
        (topicPo.channelId && topicPo.isFreePublicCourse === 'Y')
    ) {
        // 如果该话题从属系列课并且是公开课，可以直接进入
        return true;
    } else if (!userId) {
        // 如果没有登录，就跳到登录页
        var pageUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
        // res.redirect(`/api/wx/login?redirect_url=${encodeURIComponent(pageUrl)}`);
        // 去到登录页（或手动授权）
        wxUtils.goWxAuth(req, res, pageUrl);
        return false;
    } else if (!isAuth) {
        // 一元解锁课跳到系列课介绍页
        const discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'normal')
        if(discountStatus == 'UNLOCK') {
            res.redirect(`/wechat/page/channel-intro?channelId=${topicPo.channelId}`);
            return false
        }
        // 没有报名（包含没有支付和没有输入过密码），跳转到介绍页
        res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        return false;
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
        try {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        } catch (error) {
            console.error(error);
        }
        return false;
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
        try {
            res.redirect(`/wechat/page/topic-hide?liveId=${topicPo.liveId}`);
        } catch (error) {
            console.error('话题隐藏报错！！');
        }
        return true;
    }else if (!topicPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=topic`);
        return true;
    } else {
        return false;
    }
}

